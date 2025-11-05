import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, Chip, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import { DataGrid, GridColDef, GridFilterModel, GridPaginationModel, GridToolbar } from '@mui/x-data-grid';
import { makeGetCall } from 'service/ApiInterceptor';
import { FaCopy } from 'react-icons/fa';
import ExecComponent from './ExecComponent';
import { ExecType } from './ExecLauncherUtil';
import { buildDeterministicColorMap, colorForKey } from 'utils/color';

interface GroupRow {
    runId: string;
    commonRunId: string;
    successCount: number;
    failureCount: number;
    totalCount: number;
    createdAt: string;
}

interface GroupFetchResponse {
    data: GroupRow[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
}

interface DetailRow {
    _id: string;
    commonRunId: string;
    runId: string;
    success: boolean;
    error: string | null;
    googleDriveLink?: string;
    fileId?: string;
    oldName?: string | null;
    newName?: string | null;
    createdAt: string;
    updatedAt?: string;
    __v?: number;
}

interface DetailFetchResponse {
    data: DetailRow[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
}

const LauncherAIGDriveCPRenamerHistory: React.FC = () => {

    const [absPathForAiRenamer, setAbsPathForAiRenamer] = useState('');
    const [reducedPathForAiRenamer, setReducedPathForAiRenamer] = useState('');

    const [rows, setRows] = useState<GroupRow[]>([]);
    const [rowCount, setRowCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
    const [filterModel, setFilterModel] = useState<GridFilterModel>({ items: [] });

    const [detailOpen, setDetailOpen] = useState<boolean>(false);
    const [selectedRunId, setSelectedRunId] = useState<string>('');
    const [detailRows, setDetailRows] = useState<DetailRow[]>([]);
    const [detailRowCount, setDetailRowCount] = useState<number>(0);
    const [detailPaginationModel, setDetailPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
    const [detailFilterModel, setDetailFilterModel] = useState<GridFilterModel>({ items: [] });

    const handleCopyText = (text: string) => navigator.clipboard.writeText(String(text ?? ''));

    // const colorForKey = (key: string): { bg: string; color: string; border: string } => {
    //     let hash = 0;
    //     for (let i = 0; i < key.length; i++) {
    //         hash = ((hash << 5) - hash) + key.charCodeAt(i);
    //         hash |= 0;
    //     }
    //     const abs = Math.abs(hash);
    //     const isBlue = (abs % 2) === 0;
    //     const hue = isBlue ? 215 : 30;
    //     const sat = isBlue ? 70 : 60;
    //     const light = 85 - (abs % 3) * 5;
    //     const bg = `hsl(${hue}, ${sat}%, ${light}%)`;
    //     const color = `hsl(${hue}, 60%, 20%)`;
    //     const border = `hsl(${hue}, ${isBlue ? 70 : 65}%, 35%)`;
    //     return { bg, color, border };
    // };

    // const commonRunIdColorMap = useMemo(() => {
    //     const ids = Array.from(new Set((rows || []).map(r => r.commonRunId || '')));
    //     const map: Record<string, { bg: string; color: string; border: string }> = {};
    //     ids.forEach((id, idx) => {
    //         const isBlue = (idx % 2) === 0;
    //         const hue = isBlue ? 215 : 30;
    //         const sat = isBlue ? 70 : 60;
    //         const light = 85 - (idx % 3) * 5;
    //         map[id] = {
    //             bg: `hsl(${hue}, ${sat}%, ${light}%)`,
    //             color: `hsl(${hue}, 60%, 20%)`,
    //             border: `hsl(${hue}, ${isBlue ? 70 : 65}%, 35%)`,
    //         };
    //     });
    //     return map;
    // }, [rows]);

    const commonRunIdColorMap = useMemo(() => {
        const ids = Array.from(new Set((rows || []).map((g) => String(g.commonRunId ?? ''))));
        return buildDeterministicColorMap(ids);
    }, [rows]);

    const fetchGroups = async (page: number, limit: number) => {
        setLoading(true);
        setError(null);
        try {
            const res = await makeGetCall(`ai/gDrive/gDriveRenamingHistoryGroupedByRunId?page=${page}&limit=${limit}`) as GroupFetchResponse;
            setRows(res?.data ?? []);
            setRowCount(res?.totalItems ?? (res?.data?.length ?? 0));
        } catch (e: any) {
            setError(e?.message || 'Failed to load');
            setRows([]);
            setRowCount(0);
        } finally {
            setLoading(false);
        }
    };

    const fetchDetails = async (runId: string, page: number, limit: number) => {
        setLoading(true);
        setError(null);
        try {
            const res = await makeGetCall(`ai/gDrive/gDriveRenamingHistory/${runId}?page=${page}&limit=${limit}`) as DetailFetchResponse;
            const ordered = [...(res?.data ?? [])].sort((a, b) => Number(a.success) - Number(b.success)); // errors (false) first
            setDetailRows(ordered);
            setDetailRowCount(res?.totalItems ?? (res?.data?.length ?? 0));
        } catch (e: any) {
            setError(e?.message || 'Failed to load details');
            setDetailRows([]);
            setDetailRowCount(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroups(paginationModel.page + 1, paginationModel.pageSize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paginationModel.page, paginationModel.pageSize]);

    useEffect(() => {
        if (!selectedRunId) return;
        fetchDetails(selectedRunId, detailPaginationModel.page + 1, detailPaginationModel.pageSize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedRunId, detailPaginationModel.page, detailPaginationModel.pageSize]);

    const groupedColumns: GridColDef[] = [
        {
            field: 'runId', headerName: 'Run ID', width: 260, renderCell: (params) => (
                <div className="flex items-center gap-2" style={{ width: '100%' }}>
                    <IconButton onClick={() => handleCopyText(params.value)} className="ml-2">
                        <FaCopy />
                    </IconButton>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{params.value}</span>
                </div>
            )
        },
        {
            field: 'commonRunId', headerName: 'Common Run Id', width: 180, renderCell: (params) => {
                const v = String(params.value ?? '');
                const { bg, color, border } = commonRunIdColorMap[v] || colorForKey(v);
                return <Chip label={v} size="small" sx={{ bgcolor: bg, color, fontWeight: 600, border: `1px solid ${border}` }} />
            }
        },
        {
            field: 'mainGDriveLink', headerName: 'Google Drive Link', width: 250, renderCell: (params) => (
                <a href={params.value} target="_blank" rel="noreferrer">{params.value || "N/A"}</a>
            )
        },
        {
            field: 'action', headerName: 'Action', width: 140, sortable: false, filterable: false, renderCell: (params) => (
                <Button variant="text" onClick={() => { setSelectedRunId(params.row.runId); setDetailOpen(true); }}>
                    View Details
                </Button>
            )
        },
        { field: 'successCount', headerName: 'Success', width: 100 },
        { field: 'failureCount', headerName: 'Failed', width: 90 },
        { field: 'totalCount', headerName: 'Total', width: 90 },
        {
            field: 'createdAt', headerName: 'Created At', width: 200, renderCell: (p) => new Date(p.value).toLocaleString()
        },
    ];

    const detailColumns: GridColDef[] = [
        { field: 'oldName', headerName: 'Old Name', width: 220 },
        { field: 'newName', headerName: 'New Name', width: 220 },
        {
            field: 'success', headerName: 'Status', width: 120, renderCell: (p) => (
                <Chip size="small" label={p.value ? 'Success' : 'Failed'} color={p.value ? 'success' as any : 'error' as any} />
            )
        },
        {
            field: 'error', headerName: 'Error', width: 320, renderCell: (p) => (
                p.value ? <span style={{ color: '#c62828', fontWeight: 600 }}>{p.value}</span> : <span>-</span>
            )
        },
        {
            field: 'googleDriveLink', headerName: 'Google Drive Link', width: 250, renderCell: (params) => (
                <a href={params.value} target="_blank" rel="noreferrer">{params.value}</a>
            )
        },
        { field: 'fileId', headerName: 'File Id', width: 180 },
        { field: 'createdAt', headerName: 'Created At', width: 200, renderCell: (p) => new Date(p.value).toLocaleString() },
    ];

    const allSuccessQuick = (r: GroupRow) => r.successCount > 0 && r.failureCount === 0;

    return (
        <div className="h-[600px] w-full">
            <Box mb={2}>
                <Stack direction="column" spacing={2} alignItems="stretch">
                    <ExecComponent
                        buttonText="AI GDrive CP Renamer"
                        placeholder='Enter Google Drive Link(s)/Identifiers as CSV'
                        execType={ExecType.AI_CP_RENAMER}
                        css={{ minWidth: "70vw" }}
                        textBoxOneValue={absPathForAiRenamer}
                        multiline1stTf
                        rows1stTf={2}
                        textBoxTwoValue={reducedPathForAiRenamer}
                    />
                    <Typography variant="h5">AI GDrive CP Renamer History</Typography>
                </Stack>
            </Box>

            {error && (
                <Box sx={{ mb: 2, p: 1, bgcolor: '#ffebee', borderRadius: 1 }}>
                    <Typography color="error">{error}</Typography>
                </Box>
            )}

            <div className="h-[420px] w-full mb-4">
                <DataGrid
                    rows={rows}
                    columns={groupedColumns}
                    getRowId={(r) => r.runId}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[5, 10, 20]}
                    pagination
                    paginationMode="server"
                    filterMode="server"
                    filterModel={filterModel}
                    onFilterModelChange={setFilterModel}
                    rowCount={rowCount}
                    loading={loading}
                    getRowClassName={(p) => (p.row.failureCount > 0 ? 'row-failed' : 'row-success')}
                    sx={{
                        '& .row-success': {
                            bgcolor: 'rgba(76, 175, 80, 0.10)',
                        },
                        '& .row-failed': {
                            bgcolor: 'rgba(244, 67, 54, 0.10)',
                        },
                    }}
                    slots={{ toolbar: GridToolbar }}
                />
            </div>

            <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="xl" fullWidth>
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">Details for Run: {selectedRunId}</Typography>
                        <Button variant="contained" onClick={() => setDetailOpen(false)}>Close</Button>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Chip color="success" label={`Success: ${detailRows.filter(r => r.success).length}`} />
                        <Chip color="error" label={`Failed: ${detailRows.filter(r => !r.success).length}`} />
                        <Chip label={`Total: ${detailRows.length}`} />
                    </Box>

                    <div className="h-[520px] w-full">
                        <DataGrid
                            rows={detailRows}
                            columns={detailColumns}
                            getRowId={(r) => r._id}
                            paginationModel={detailPaginationModel}
                            onPaginationModelChange={setDetailPaginationModel}
                            pageSizeOptions={[5, 10, 20]}
                            pagination
                            paginationMode="server"
                            filterMode="server"
                            filterModel={detailFilterModel}
                            onFilterModelChange={setDetailFilterModel}
                            rowCount={detailRowCount}
                            loading={loading}
                            getRowClassName={(p) => (p.row.success ? 'detail-success' : 'detail-failed')}
                            sx={{
                                '& .detail-success': { bgcolor: 'rgba(76, 175, 80, 0.06)' },
                                '& .detail-failed': { bgcolor: 'rgba(244, 67, 54, 0.08)' },
                            }}
                            slots={{ toolbar: GridToolbar }}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default LauncherAIGDriveCPRenamerHistory;
