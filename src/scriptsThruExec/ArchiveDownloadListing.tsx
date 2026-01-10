import React, { useMemo, useState, useEffect } from "react";
import {
    DataGrid,
    type GridColDef,
    type GridPaginationModel,
    type GridFilterModel,
    GridToolbar,
} from "@mui/x-data-grid";
import {
    Box,
    Typography,
    Chip,
    IconButton,
    Button,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
} from "@mui/material";
import { makeGetCall } from 'service/ApiInterceptor';
import { FaCopy } from "react-icons/fa";
import { buildDeterministicColorMap, colorForKey } from "utils/color";
import { ellipsis } from "widgets/ItemTooltip";

// Types
export interface IArchiveDownloadRequest {
    _id: string | { $oid: string };
    runId: string;
    commonRunId: string;
    excelPath?: string;
    archiveUrl?: string;
    profileOrAbsPath: string;
    status: string;
    totalItems: number;
    deleted: boolean;
    verify: boolean;
    createdAt: string | { $date: string };
    updatedAt: string | { $date: string };
    __v: number;
    itemCounts?: {
        total: number;
        success: number;
        failed: number;
        queued: number;
    };
}

export interface IArchiveDownloadItem {
    _id: string | { $oid: string };
    runId: string;
    fileName: string;
    archiveUrl?: string;
    filePath?: string;
    status: string;
    msg?: string;
    createdAt: string | { $date: string };
    updatedAt: string | { $date: string };
}

interface FetchResponse {
    data: IArchiveDownloadRequest[];
    totalItems: number;
    currentPage?: number;
    totalPages?: number;
    response?: any;
}

const ArchiveDownloadListing: React.FC = () => {
    const [downloads, setDownloads] = useState<IArchiveDownloadRequest[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalItems, setTotalItems] = useState(0);
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        page: 0,
        pageSize: 10,
    });
    const [filterModel, setFilterModel] = useState<GridFilterModel>({
        items: [],
    });

    // Detail Dialog State
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
    const [items, setItems] = useState<IArchiveDownloadItem[]>([]);
    const [itemsLoading, setItemsLoading] = useState(false);

    const fetchArchiveDownloads = async (page: number, pageSize: number): Promise<FetchResponse> => {
        const response = await makeGetCall(`yarnArchive/getAllArchiveDownloadRequests?page=${page}&limit=${pageSize}`);
        return response;
    };

    const loadDownloads = async () => {
        setLoading(true);
        try {
            const response = await fetchArchiveDownloads(paginationModel.page + 1, paginationModel.pageSize);
            if (response && response.data) {
                setDownloads(response.data);
                setTotalItems(response.totalItems || 0);
            } else if (response && response.response) {
                // Handle case where makeGetCall might have wrapped it differently
                const data = response.response;
                if (Array.isArray(data)) {
                    setDownloads(data);
                } else if (data.data) {
                    setDownloads(data.data);
                    setTotalItems(data.totalItems || 0);
                }
            }
        } catch (error) {
            console.error("Error fetching Archive downloads:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadItems = async (runId: string) => {
        setItemsLoading(true);
        try {
            const response = await makeGetCall(`yarnArchive/getArchiveDownloadItemsByRunId/${runId}`);
            if (response && response.data) {
                setItems(response.data);
            } else if (Array.isArray(response)) {
                setItems(response);
            } else if (response?.response) {
                setItems(response.response);
            } else {
                // If makeGetCall spreads an array result into keys "0", "1", etc.
                const arrayFromIndices = [];
                for (let i = 0; i in response; i++) {
                    arrayFromIndices.push(response[i]);
                }
                if (arrayFromIndices.length > 0) {
                    setItems(arrayFromIndices);
                } else {
                    setItems([]);
                }
            }
        } catch (error) {
            console.error("Error fetching Archive items:", error);
        } finally {
            setItemsLoading(false);
        }
    };

    useEffect(() => {
        loadDownloads();
    }, [paginationModel.page, paginationModel.pageSize]);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const handleRunIdClick = (runId: string) => {
        setSelectedRunId(runId);
        setOpenDialog(true);
        loadItems(runId);
    };

    const commonRunIdColorMap = useMemo(() => {
        const ids = Array.from(new Set((downloads || []).map((r) => String(r.commonRunId ?? ''))));
        return buildDeterministicColorMap(ids);
    }, [downloads]);

    const columns: GridColDef<IArchiveDownloadRequest>[] = [
        {
            field: 'commonRunId',
            headerName: 'Common Run Id',
            width: 150,
            renderCell: (params) => {
                const v = String(params.value ?? '');
                const { bg, color, border } = commonRunIdColorMap[v] || colorForKey(v);
                return (
                    <Chip
                        label={v}
                        size="small"
                        sx={{ bgcolor: bg, color, fontWeight: 600, border: `1px solid ${border}` }}
                    />
                );
            }
        },
        {
            field: "runId",
            headerName: "Run ID",
            width: 120,
            renderCell: (params) => (
                <Box display="flex" alignItems="center">
                    <Tooltip title="Click to view details">
                        <Button
                            size="small"
                            onClick={() => handleRunIdClick(params.value)}
                            sx={{ textTransform: 'none', minWidth: 0, p: 0, color: 'primary.main', fontWeight: 'bold' }}
                        >
                            {ellipsis(params.value, 8)}
                        </Button>
                    </Tooltip>
                    <IconButton size="small" onClick={() => handleCopy(params.value)}>
                        <FaCopy size={12} />
                    </IconButton>
                </Box>
            ),
        },
        {
            field: "source",
            headerName: "Source (Excel/URL)",
            width: 300,
            valueGetter: (params, row) => row.excelPath || row.archiveUrl || "",
            renderCell: (params) => (
                <Box display="flex" alignItems="center">
                    <Tooltip title={params.value}>
                        <Typography variant="body2">{ellipsis(params.value, 30)}</Typography>
                    </Tooltip>
                    <IconButton size="small" onClick={() => handleCopy(params.value)}>
                        <FaCopy size={12} />
                    </IconButton>
                </Box>
            ),
        },
        {
            field: "profileOrAbsPath",
            headerName: "Output Path",
            width: 250,
            renderCell: (params) => (
                <Box display="flex" alignItems="center">
                    <Tooltip title={params.value}>
                        <Typography variant="body2">{ellipsis(params.value, 25)}</Typography>
                    </Tooltip>
                    <IconButton size="small" onClick={() => handleCopy(params.value)}>
                        <FaCopy size={12} />
                    </IconButton>
                </Box>
            ),
        },
        {
            field: "status",
            headerName: "Status",
            width: 120,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={
                        params.value === "completed" ? "success" :
                            params.value === "failed" ? "error" :
                                params.value === "initiated" ? "info" : "default"
                    }
                    size="small"
                />
            ),
        },
        {
            field: "totalItems",
            headerName: "Total Items",
            width: 100,
            type: 'number',
        },
        {
            field: "itemCounts",
            headerName: "Quick Status (S/F/Q)",
            width: 180,
            renderCell: (params) => {
                const counts = params.value;
                if (!counts) return "-";
                return (
                    <Box>
                        <Typography variant="body2" sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                            <span style={{ color: 'green' }}>{counts.success}</span> /
                            <span style={{ color: 'red' }}> {counts.failed}</span> /
                            <span> {counts.queued}</span>
                            {` (of ${counts.total})`}
                        </Typography>
                    </Box>
                );
            }
        },
        {
            field: "verify",
            headerName: "Verified",
            width: 100,
            renderCell: (params) => (
                <Chip
                    label={params.value ? "Yes" : "No"}
                    color={params.value ? "success" : "default"}
                    size="small"
                    variant="outlined"
                />
            ),
        },
        {
            field: "createdAt",
            headerName: "Created At",
            width: 180,
            renderCell: (params) => {
                const date = typeof params.value === 'string' ? params.value : (params.value as any)?.$date;
                return date ? new Date(date).toLocaleString() : 'N/A';
            },
        },
    ];

    const itemColumns: GridColDef<IArchiveDownloadItem>[] = [
        {
            field: "fileName",
            headerName: "File Name",
            width: 400,
            renderCell: (params) => (
                <Tooltip title={params.value}>
                    <Typography variant="body2">{params.value}</Typography>
                </Tooltip>
            )
        },
        {
            field: "status",
            headerName: "Status",
            width: 120,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={
                        params.value === "success" || params.value === "completed" ? "success" :
                            params.value === "failed" ? "error" :
                                params.value === "queued" || params.value === "initiated" ? "info" : "default"
                    }
                    size="small"
                />
            )
        },
        {
            field: "archiveUrl",
            headerName: "Archive URL",
            width: 300,
            renderCell: (params) => (
                <Box display="flex" alignItems="center">
                    <Tooltip title={params.value}>
                        <Typography variant="body2">{ellipsis(params.value, 40)}</Typography>
                    </Tooltip>
                    <IconButton size="small" onClick={() => handleCopy(params.value)}>
                        <FaCopy size={12} />
                    </IconButton>
                </Box>
            )
        },
        {
            field: "msg",
            headerName: "Message",
            width: 250,
        },
        {
            field: "filePath",
            headerName: "File Path",
            width: 400,
            renderCell: (params) => (
                <Box display="flex" alignItems="center">
                    <Tooltip title={params.value}>
                        <Typography variant="body2">{ellipsis(params.value, 50)}</Typography>
                    </Tooltip>
                    <IconButton size="small" onClick={() => handleCopy(params.value)}>
                        <FaCopy size={12} />
                    </IconButton>
                </Box>
            )
        },
        {
            field: "createdAt",
            headerName: "Created At",
            width: 180,
            renderCell: (params) => {
                const date = typeof params.value === 'string' ? params.value : (params.value as any)?.$date;
                return date ? new Date(date).toLocaleString() : 'N/A';
            },
        }
    ];

    return (
        <Box sx={{ height: 800, width: '100%', p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5" fontWeight="bold" color="primary">
                    Archive Download Requests History
                </Typography>
                <Button variant="outlined" onClick={loadDownloads} disabled={loading}>
                    Refresh
                </Button>
            </Box>
            <DataGrid
                rows={downloads}
                columns={columns}
                getRowId={(row) => {
                    const id = typeof row._id === 'string' ? row._id : row._id?.$oid;
                    return id || row.runId;
                }}
                loading={loading}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[10, 25, 50]}
                rowCount={totalItems}
                paginationMode="server"
                slots={{ toolbar: GridToolbar }}
                disableRowSelectionOnClick
                filterModel={filterModel}
                onFilterModelChange={setFilterModel}
                sx={{
                    '& .MuiDataGrid-cell:hover': {
                        color: 'primary.main',
                    },
                    boxShadow: 2,
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 2,
                    backgroundColor: 'background.paper',
                }}
            />

            {/* Drill-down Dialog */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth="xl"
                fullWidth
            >
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">Download Items for Run: {selectedRunId}</Typography>
                        <Button onClick={() => setOpenDialog(false)}>Close</Button>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ height: 600, width: '100%' }}>
                        <DataGrid
                            rows={items}
                            columns={itemColumns}
                            getRowId={(row) => {
                                const id = typeof row._id === 'string' ? row._id : row._id?.$oid;
                                return id || row.fileName;
                            }}
                            loading={itemsLoading}
                            slots={{ toolbar: GridToolbar }}
                            disableRowSelectionOnClick
                            pageSizeOptions={[10, 20, 50]}
                            initialState={{
                                pagination: { paginationModel: { pageSize: 10 } },
                            }}
                        />
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default ArchiveDownloadListing;
