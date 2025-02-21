import type React from "react"
import { useState, useEffect } from "react"
import { DataGrid, type GridColDef, type GridValueGetterParams, type GridRenderCellParams } from "@mui/x-data-grid"
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
} from "@mui/material"
import { makeGetCall } from "service/BackendFetchService"
import { IconButton, Tooltip } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { FileWidget } from "./FileWidget"
import { makePostCall } from "mirror/utils"
import ConfirmDialog from "widgets/ConfirmDialog"
import { set } from "lodash"
import { ResultDisplayPopover } from "widgets/ResultDisplayPopover"

interface JsonData {
    _id: string
    src: string
    dest: string
    destFolderOrProfile: string
    success: boolean
    msg: string
    errorList: string[]
    srcPdfsBefore?: number
    srcPdfsAfter?: number
    destFilesBefore?: number
    destFilesAfter?: number
    fileCollisionsResolvedByRename: string[]
    filesMoved: string[]
    filesMovedNewAbsPath: string[]
    filesAbsPathMoved: string[]
    reversed: boolean
    createdAt: string
    updatedAt: string
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


export default function FileTransferList() {
    const [data, setData] = useState<JsonData[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [filterField, setFilterField] = useState<string>("")
    const [filterValue, setFilterValue] = useState<string>("")
    const [openDialog, setOpenDialog] = useState(false)
    const [idForReverse, setIdForReverse] = useState<string>("")
    const [popoverAnchor, setPopoverAnchor] = useState<HTMLButtonElement | null>(null)
    const [popoverContent, setPopoverContent] = useState<string>("")

    const columns: GridColDef[] = [
        {
            field: "filesMoved",
            headerName: "Files Transferred",
            width: 150,
            renderCell: (params: GridRenderCellParams) => (
                <FileWidget files={params.row.filesMoved} label="Transferred Files" />
            ),
        },
        {
            field: "filesAbsPathMoved",
            headerName: "Files with Abs Path Transferred",
            width: 150,
            renderCell: (params: GridRenderCellParams) => (
                <FileWidget files={params.row.filesAbsPathMoved} label="Transferred Files with Old Abs Path"
                />
            ),
        },
        {
            field: "filesMovedNewAbsPath",
            headerName: "Transferred Files with New Abs Path",
            width: 150,
            renderCell: (params: GridRenderCellParams) => (
                <FileWidget files={params.row.filesMovedNewAbsPath} label="Transferred Files with New Abs Path"
                />
            ),
        },

        {
            field: "fileCollisionsResolvedByRename",
            headerName: "Collisions Resolved",
            width: 150,
            renderCell: (params: GridRenderCellParams) => (
                <FileWidget files={params.row.fileCollisionsResolvedByRename}
                    label="Collisions Resolved"
                />
            ),
        },
        {
            field: "reverse",
            headerName: "Reverse",
            width: 150,
            renderCell: (params: GridRenderCellParams) => (
                <>
                    <Button
                        variant="contained"
                        color="primary"
                        id={`reverse-button-${params.row._id}`}
                        disabled={params.row.reversed === true || params.row.success === false}
                        onClick={async () => {
                            setIdForReverse(params.row._id)
                            setOpenDialog(true)
                            return
                        }}
                    >
                        Reverse
                    </Button>
                    <ResultDisplayPopover
                        popoverAnchor={popoverAnchor}
                        setPopoverAnchor={setPopoverAnchor}
                        popoverContent={popoverContent}
                        actionType={"Reverse File Move"}
                    />
                </>
            ),
        },
        {
            field: "src", headerName: "Source", width: 250,
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
                    <Typography>{params.value}</Typography>
                </Box>
            ),
        },
        {
            field: "dest", headerName: "Destination", width: 250,
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
                    <Typography>{params.value}</Typography>
                </Box>
            ),
        },
        { field: "destFolderOrProfile", headerName: "Folder/Profile", width: 150 },
        { field: "success", headerName: "Success", width: 100, type: "boolean" },
        { field: "msg", headerName: "Message", width: 300 },
        { field: "srcPdfsBefore", headerName: "Source PDFs Before", width: 150, type: "number" },
        { field: "srcPdfsAfter", headerName: "Source PDFs After", width: 150, type: "number" },
        { field: "destFilesBefore", headerName: "Dest Files Before", width: 150, type: "number" },
        { field: "destFilesAfter", headerName: "Dest Files After", width: 150, type: "number" },

        {
            field: "createdAt",
            headerName: "Created At",
            width: 200,
            valueGetter: (params: GridValueGetterParams) => new Date(params.row.createdAt).toLocaleString(),
        },
    ]
    const reverseFileMove = async () => {
        setOpenDialog(false);
        setLoading(true);
        try {
            const resource =
                `fileUtil/reverse-file-move`;
            const data = await makePostCall({ id: idForReverse },
                resource);
            console.log(`data ${JSON.stringify(data)}`);
            const resp = data.response;
            setPopoverContent(JSON.stringify(resp, null, 2))
            setPopoverAnchor(document.getElementById(`reverse-button-${idForReverse}`) as HTMLButtonElement)
        } catch (error) {
            console.error("Error deleting upload cycle:", error)
            setPopoverContent(`Error deleting upload cycle: ${error}`)
            setPopoverAnchor(document.getElementById(`reverse-button-${idForReverse}`) as HTMLButtonElement)
        } finally {
            setLoading(false)
            fetchData()
        }
        try {

            console.log("reverseFileMove", idForReverse)
            return { x: idForReverse }
        } catch (error) {
            console.error("Error reversing file move:", error)
        }
    }
    const fetchData = async () => {
        setLoading(true)
        try {
            const result = await makeGetCall(`fileUtil/file-move-list?page=${page}&limit=50`);
            if (result && result.data) {
                console.log("result", result?.data?.length)
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
                const fieldValue = item[filterField as keyof JsonData]
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

    return (
        <Box sx={{ height: 600, width: "100%" }}>
            <Typography variant="h4" component="h1" gutterBottom>
                File Transfer List
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
                        <MenuItem value="src">Source</MenuItem>
                        <MenuItem value="dest">Destination</MenuItem>
                        <MenuItem value="destFolderOrProfile">Folder/Profile</MenuItem>
                        <MenuItem value="success">Success</MenuItem>
                        <MenuItem value="srcPdfsBefore">Source PDFs Before</MenuItem>
                        <MenuItem value="srcPdfsAfter">Source PDFs After</MenuItem>
                        <MenuItem value="destFilesBefore">Dest Files Before</MenuItem>
                        <MenuItem value="destFilesAfter">Dest Files After</MenuItem>
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
                    if (params.row.reversed) {
                        return 'pointer-events-none opacity-50';
                    }
                    return params.row.success ? 'bg-green-100' : 'bg-red-100';
                }}
                isRowSelectable={(params) => !params.row.reversed}
            />
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
            </Box>
            <ConfirmDialog
                openDialog={openDialog}
                handleClose={() => setOpenDialog(false)}
                setOpenDialog={setOpenDialog}
                invokeFuncOnClick2={reverseFileMove}
            />
        </Box>
    )
}

