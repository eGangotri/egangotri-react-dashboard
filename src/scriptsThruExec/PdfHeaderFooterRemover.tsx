;
import type React from "react"
import { useState, useEffect } from "react"
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid"
import {
    Box,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    type SelectChangeEvent,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    Pagination,
    FormControlLabel,
    Checkbox,
    Chip,
} from "@mui/material"
import { makeGetCall, makePostCall } from 'service/ApiInterceptor';
import { IconButton, Tooltip } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ConfirmDialog from "widgets/ConfirmDialog"
import { set } from "lodash"
import { useMemo } from "react"
import { ResultDisplayPopover } from "widgets/ResultDisplayPopover"
import { ExecType } from "scriptsThruExec/ExecLauncherUtil";
import ExecComponent from "scriptsThruExec/ExecComponent";
import { csvize } from "scriptsThruExec/Utils";
import { FileWidget } from "pages/FileTransfer/FileWidget";
import { buildDeterministicColorMap, colorForKey } from "utils/color";
import { ellipsis } from "widgets/ItemTooltip";

interface HeaderFooterRemovalItem {
    _id: string
    runId: string
    commonRunId: string
    _srcFolder: string
    _destFolder: string
    success: boolean
    results: {
        srcPdf: string
        destPdf: string
        success: boolean
        errorMsg?: string
        exceptionMsg?: string
    }[]
    logs: any
    errorMsg: string
    createdAt: string
}

interface FileTransferPopupProps {
    open: boolean
    onClose: () => void
    files: string[]
    title: string
}



function FileTransferPopup({ open, onClose, files, title }: FileTransferPopupProps) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent dividers>
                <List>
                    {files.map((file, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={file} />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}


export default function PdfHeaderFooterRemover() {
    const [data, setData] = useState<HeaderFooterRemovalItem[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [filterField, setFilterField] = useState<string>("")
    const [filterValue, setFilterValue] = useState<string>("")

    const [detailDialogOpen, setDetailDialogOpen] = useState(false)
    const [selectedResults, setSelectedResults] = useState<HeaderFooterRemovalItem['results']>([])

    const [filePath, setFilePath] = useState('');
    // Build a deterministic color map for visible commonRunId values
    const commonRunIdColorMap = useMemo(() => {
        const ids = Array.from(new Set((data || []).map((r) => String(r?.commonRunId ?? ''))));
        return buildDeterministicColorMap(ids);
    }, [data]);

    const columns: GridColDef[] = [
        {
            field: "runId",
            headerName: "Run ID",
            width: 120,
            renderCell: (params: GridRenderCellParams) => (
                <Button
                    variant="text"
                    color="primary"
                    onClick={() => {
                        console.log("Opening details for Run ID:", params.value, "Results:", params.row.results);
                        setSelectedResults(params.row.results || []);
                        setDetailDialogOpen(true);
                    }}
                    sx={{
                        textTransform: 'none',
                        textAlign: 'left',
                        justifyContent: 'flex-start',
                        fontWeight: 'bold',
                        fontSize: '0.75rem',
                        padding: 0,
                        '&:hover': { textDecoration: 'underline' }
                    }}
                >
                    {ellipsis(params.value?.toString() || "-", 15)}
                </Button>
            ),
        },
        {
            field: 'commonRunId',
            headerName: 'Common Run ID',
            width: 190,
            renderCell: (params: GridRenderCellParams) => {
                const v = String(params.value ?? '');
                const { bg, color, border } = commonRunIdColorMap[v] || colorForKey(v);
                return (
                    <Chip
                        label={ellipsis(v, 8)}
                        size="small"
                        sx={{ bgcolor: bg, color, fontWeight: 600, border: `1px solid ${border}`, fontSize: '0.7rem' }}
                    />
                );
            }
        },
        {
            field: "_srcFolder",
            headerName: "Source Folder",
            width: 300,
            renderCell: (params: GridRenderCellParams) => (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Tooltip title="Copy">
                        <IconButton
                            size="small"
                            onClick={() => navigator.clipboard.writeText(params.value)}
                        >
                            <ContentCopyIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{params.value}</Typography>
                </Box>
            ),
        },
        {
            field: "_destFolder",
            headerName: "Dest Folder",
            width: 300,
            renderCell: (params: GridRenderCellParams) => (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Tooltip title="Copy">
                        <IconButton
                            size="small"
                            onClick={() => navigator.clipboard.writeText(params.value)}
                        >
                            <ContentCopyIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{params.value}</Typography>
                </Box>
            ),
        },
        { field: "success", headerName: "Success", width: 90, type: "boolean" },
        {
            field: "logs",
            headerName: "Status/Logs",
            width: 200,
            renderCell: (params: GridRenderCellParams) => (
                <Tooltip title={JSON.stringify(params.value)}>
                    <Typography variant="body2" noWrap>
                        {typeof params.value === 'object' ? (params.value.total_files ? `Files: ${params.value.total_files}` : JSON.stringify(params.value)) : params.value}
                    </Typography>
                </Tooltip>
            ),
        },
        { field: "errorMsg", headerName: "Error", width: 150 },
        {
            field: "createdAt",
            headerName: "Created At",
            width: 180,
            renderCell: (params: GridRenderCellParams) => new Date(params?.value)?.toLocaleString(),
        },
    ]

    const fetchData = async () => {
        setLoading(true)
        try {
            const result = await makeGetCall(`fileUtil/header-footer-removal-item-report?page=${page}&limit=10`);
            if (result && result.data) {
                setData(result.data)
                setTotalPages(result.totalPages)
            }
            else {
                setData([])
                setTotalPages(0)
            }
        } catch (error) {
            console.error("Error fetching data:", error)
            setData([])
            setTotalPages(1)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [page])

    useEffect(() => {
        if (filterField && filterValue) {
            const filtered = data.filter((item) => {
                const fieldValue = item[filterField as keyof HeaderFooterRemovalItem]
                if (typeof fieldValue === "string") {
                    return fieldValue.toLowerCase().includes(filterValue.toLowerCase())
                } else if (typeof fieldValue === "boolean") {
                    return fieldValue.toString() === filterValue.toLowerCase()
                } else if (typeof fieldValue === "number") {
                    return fieldValue.toString().includes(filterValue)
                }
                return false
            })
            setData(filtered)
        } else {
            fetchData()
        }
    }, [filterField, filterValue])

    const handleFilterFieldChange = (event: SelectChangeEvent) => {
        setFilterField(event.target.value as string)
    }

    const handleFilterValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterValue(event.target.value)
    }

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value)
    }

    const rows = data?.map((item) => ({
        id: item._id,
        ...item,
    }))

    const [overrideNonEmptyFlag, setOverrideNonEmptyFlag] = useState(false);
    const handleOverrideNonEmptyFlag = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOverrideNonEmptyFlag(event.target.checked);
        setRemoveHeaderExecType(event.target.checked ? ExecType.REMOVE_HEADER_FOOTER_OVERRIDE_NON_EMPTY_FLAG : ExecType.REMOVE_HEADER_FOOTER);
    };

    const [removeHeaderExecType, setRemoveHeaderExecType] = useState(ExecType.REMOVE_HEADER_FOOTER);

    const handleInputChange = (inputValue: string) => {
        setFilePath(inputValue);
    };

    return (
        <Box sx={{ height: 600, width: "100%" }}>
            <Box display="flex" alignItems="center" gap={4} mb={2} flexDirection="column">
                <ExecComponent
                    buttonText="Remove Header Footer"
                    placeholder='Single PDF Path, Folder Path Or Profile Name - CSVs'
                    secondTextBoxPlaceHolder="Destination Path"
                    textBoxOneValue={filePath}
                    onInputChange={handleInputChange}
                    thirdButton={<Button
                        variant="contained"
                        color="primary"
                        onClick={() => setFilePath(csvize(filePath))}
                        sx={{ marginRight: "10px", marginBottom: "10px" }}>CSVize</Button>}
                    execType={removeHeaderExecType}
                    css={{ minWidth: "80vw" }}
                    css2={{ minWidth: "80vw" }}
                    userInputOneInfo="Multiple entries as Coma Separated PDF Paths, Folder-Path or Profile Name"
                    userInputTwoInfoNonMandatory="Single Profile Name or Absolute Path"
                    onCompleted={() => fetchData()}
                    reactComponent={<>
                        <Box>
                            <FormControlLabel
                                control={<Checkbox checked={overrideNonEmptyFlag} onChange={handleOverrideNonEmptyFlag} />}
                                label="Override Non Empty Flag"
                            />
                        </Box>
                    </>}
                />
            </Box>
            <Typography variant="h4" component="h1" gutterBottom>
                PDF Header Footer Removal Report
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel id="filter-field-label">Filter Field</InputLabel>
                    <Select
                        labelId="filter-field-label"
                        id="filter-field"
                        value={filterField}
                        label="Filter Field"
                        onChange={handleFilterFieldChange}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value="runId">Run ID</MenuItem>
                        <MenuItem value="commonRunId">Batch ID</MenuItem>
                        <MenuItem value="_srcFolder">Source Folder</MenuItem>
                        <MenuItem value="_destFolder">Dest Folder</MenuItem>
                        <MenuItem value="success">Success</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    label="Filter Value"
                    variant="outlined"
                    value={filterValue}
                    onChange={handleFilterValueChange}
                    disabled={!filterField}
                />
            </Box>
            <DataGrid rows={rows}
                columns={columns}
                loading={loading}
                hideFooterPagination
                disableRowSelectionOnClick
                getRowClassName={(params) => {
                    return params.row.success ? 'bg-green-500' : 'bg-red-500';
                }}
            />
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
            </Box>

            <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'primary.main', color: 'white', py: 1.5 }}>
                    <Typography variant="h6">File Results ({selectedResults?.length || 0} items)</Typography>
                    <IconButton onClick={() => setDetailDialogOpen(false)} sx={{ color: 'white' }}>
                        <Typography variant="button">Close</Typography>
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ p: 0 }}>
                    <Box sx={{ height: 450, width: "100%" }}>
                        <DataGrid
                            rows={selectedResults?.map((r, i) => ({ ...r, id: i })) || []}
                            columns={[
                                {
                                    field: "srcPdf",
                                    headerName: "Source PDF",
                                    width: 400,
                                    renderCell: (params: GridRenderCellParams) => (
                                        <Tooltip title={params.value || ""}>
                                            <Typography variant="body2" sx={{ fontSize: '0.85rem' }} noWrap>
                                                {params.value}
                                            </Typography>
                                        </Tooltip>
                                    )
                                },
                                {
                                    field: "destPdf",
                                    headerName: "Destination PDF",
                                    width: 400,
                                    renderCell: (params: GridRenderCellParams) => (
                                        <Tooltip title={params.value || ""}>
                                            <Typography variant="body2" sx={{ fontSize: '0.85rem' }} noWrap>
                                                {params.value}
                                            </Typography>
                                        </Tooltip>
                                    )
                                },
                                { field: "success", headerName: "Success", width: 100, type: "boolean" },
                                { field: "errorMsg", headerName: "Error Message", width: 250 },
                                { field: "exceptionMsg", headerName: "Exception", width: 250 },
                            ]}
                            disableRowSelectionOnClick
                            hideFooter={selectedResults.length <= 100}
                            density="compact"
                            getRowClassName={(params) => {
                                return params.row.success ? 'bg-green-500' : 'bg-red-500';
                            }}
                        />
                        {selectedResults.length === 0 && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                <Typography color="textSecondary">No individual file results available for this run.</Typography>
                            </Box>
                        )}
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    )
}


