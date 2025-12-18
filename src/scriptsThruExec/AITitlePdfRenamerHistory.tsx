import React, { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, Typography, Backdrop, Chip } from '@mui/material';
import { DataGrid, GridColDef, GridFilterModel, GridPaginationModel, GridToolbar } from '@mui/x-data-grid';
import { FaCopy } from 'react-icons/fa';
import { makeGetCall, makePostCall } from 'service/ApiInterceptor';
import { buildDeterministicColorMap, colorForKey } from '../utils/color';

// Backend can send either Mongo-style wrappers or plain strings
type Oid = { $oid: string } | string;
type IsoDate = { $date: string } | string;

type PairedBatch = { index: number; pdfs: string[]; reducedPdfs: string[] };
// Schema for renamingResults
type RenamingResult = {
  originalFilePath?: string;
  reducedFilePath?: string;
  // Backend returns newFilePath; keep backward-compat props too
  newFilePath?: string;
  extractedMetadata?: string;
  success: boolean;
  error?: string;
};
type MetaDataRow = { originalFilePath: string; fileName: string; extractedMetadata: string; error?: string };

type RunRow = {
  _id: Oid;
  runId: string;
  commonRunId: string;
  processedCount: number;
  successCount: number;
  failedCount: number;
  renamedCount?: number;
  success: boolean;
  pairedBatches: PairedBatch[];
  renamingResults: RenamingResult[];
  metaDataAggregated: MetaDataRow[];
  error?: string;
  createdAt: IsoDate;
  updatedAt: IsoDate;
  __v: number;
};

type DetailKey = 'pairedBatches' | 'renamingResults' | 'metaDataAggregated';

const AITitlePdfRenamerHistory: React.FC = () => {
  const [rows, setRows] = useState<RunRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedRun, setSelectedRun] = useState<RunRow | null>(null);
  const [detailKey, setDetailKey] = useState<DetailKey>('pairedBatches');
  const [reloadKey, setReloadKey] = useState<number>(0);
  // Pagination state
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 20,
  });

  // Detail view pagination
  const [detailPaginationModel, setDetailPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  // Filter model
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
  });

  // Filter model for detail view
  const [detailFilterModel, setDetailFilterModel] = useState<GridFilterModel>({
    items: [],
  });

  // Popup for REDO result
  const [redoOpen, setRedoOpen] = useState(false);
  const [redoTitle, setRedoTitle] = useState<string>('');
  const [redoBody, setRedoBody] = useState<string>('');
  const [redoLoading, setRedoLoading] = useState<Record<string, boolean>>({});
  const [redoGlobalLoading, setRedoGlobalLoading] = useState<boolean>(false);
  const [selectedRunIds, setSelectedRunIds] = useState<string[]>([]);

  const copy = (t: any) => navigator.clipboard.writeText(String(t ?? ''));

  // Build a deterministic color map for visible commonRunId values
  const commonRunIdColorMap = useMemo(() => {
    const ids = Array.from(new Set((rows || []).map((r) => String((r as any)?.commonRunId ?? ''))));
    return buildDeterministicColorMap(ids);
  }, [rows]);

  const displayRenamingResults = (row: RunRow) => {
    return (
      <>
        <span className="text-green-700">{row.successCount}+</span>
        <span className="text-red-700">{row.failedCount}</span>
        <span className={row.failedCount > 0 ? 'text-red-700' : 'text-green-700'}>
          ={row.renamingResults?.length}
        </span>
      </>
    );
  };
  useEffect(() => {
    const load = async (page: number, pageSize: number) => {
      setLoading(true);
      setError(null);
      try {
        // Call backend directly to avoid concatenation with app base URL
        const res = await makeGetCall(`ai/getAllTitlePdfRenamedViaAIList?page=${page}&limit=${pageSize}`);
        console.log(`Response from fetchGroupedRenameData: ${JSON.stringify(res)}`);
        const _data = res.data;
        const normalized: RunRow[] = _data?.map((r: any) => ({
          ...r,
          _id: r._id ?? r._id?.$oid ?? `${r.runId}`,
          createdAt: r.createdAt ?? r.createdAt?.$date ?? new Date().toISOString(),
          updatedAt: r.updatedAt ?? r.updatedAt?.$date ?? r.createdAt ?? new Date().toISOString(),
          pairedBatches: r.pairedBatches || [],
          renamingResults: (r.renamingResults || [])?.map((x: any) => ({
            ...x,
            // keep fields as-is; just ensure presence
          })),
          metaDataAggregated: r.metaDataAggregated || [],
        }));
        setRows(normalized);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    load(paginationModel.page + 1, paginationModel.pageSize);
  }, [reloadKey, paginationModel.page, paginationModel.pageSize]);

  const columns: GridColDef<RunRow>[] = useMemo(() => ([
    {
      field: 'commonRunId',
      headerName: 'Common Run Id',
      width: 100,
      filterable: true,
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
      field: 'runId', headerName: 'Run ID', width: 340, renderCell: (p) => (
        <div className="flex items-center">
          <IconButton onClick={() => copy(p.value)} size="small"><FaCopy /></IconButton>
          <span>{p.value}</span>
        </div>
      )
    },
    { field: 'processedCount', headerName: 'Processed', width: 110 },
    { field: 'sfp', headerName: 'Success/Failed/Processed', width: 200,
      renderCell: (p) => displayRenamingResults(p.row)
    },
    { field: 'successCount', headerName: 'Success', width: 100 },
    { field: 'failedCount', headerName: 'Failed', width: 100 },
    { field: 'renamedCount', headerName: 'Renamed', width: 110 },
    { field: 'success', headerName: 'Overall', width: 100, renderCell: (p) => <span className={(p.row.failedCount > 0) ? 'text-red-700' : 'text-green-700'}>{String(p.row.failedCount > 0 ? 'Failed' : 'Success')}</span> },
    {
      field: 'actions', headerName: 'REDO Failed', width: 120,
      renderCell: (p) => (
        (p.row.failedCount > 0 || p.row.success === false) ? (
          <Button
            size="small"
            color="error"
            variant="contained"
            startIcon={redoLoading[p.row.runId] ? <CircularProgress size={16} color="inherit" /> : null}
            disabled={redoGlobalLoading || !!redoLoading[p.row.runId]}
            onClick={async () => {
              const ok = window.confirm(`Are you sure you want to REDO Failed for runId=${p.row.runId}?`);
              if (!ok) return;
              try {
                setRedoGlobalLoading(true);
                setRedoLoading((m) => ({ ...m, [p.row.runId]: true }));
                const res = await makePostCall({}, `ai/aiRenamer/${p.row.runId}`);
                setRedoTitle(`REDO Failed triggered for runId=${p.row.runId}`);
                setRedoBody(JSON.stringify(res.data, null, 2));
                setRedoOpen(true);
                setReloadKey((k) => k + 1);
              } catch (e: any) {
                setRedoTitle('REDO Failed error');
                setRedoBody(e?.message ? String(e.message) : 'Unknown error');
                setRedoOpen(true);
              } finally {
                setRedoLoading((m) => ({ ...m, [p.row.runId]: false }));
                setRedoGlobalLoading(false);
              }
            }}
          >
            {redoLoading[p.row.runId] ? (
              <>
                <CircularProgress size={16} color="inherit" style={{ marginRight: 6 }} />
                Redoing...
              </>
            ) : (
              'REDO Failed'
            )}
          </Button>
        ) : null
      )
    },
    {
      field: 'renamingResults', headerName: 'Renaming Results(S/F/T)', width: 170, renderCell: (p) => (
        <Button size="small" variant="outlined" onClick={() => { setSelectedRun(p.row); setDetailKey('renamingResults'); setOpen(true); }}>
          {displayRenamingResults(p.row)}
        </Button>
      )
    },

    {
      field: 'pairedBatches', headerName: 'Paired Batches', width: 160, renderCell: (p) => (
        <Button size="small" variant="outlined" onClick={() => { setSelectedRun(p.row); setDetailKey('pairedBatches'); setOpen(true); }}>{p.row.pairedBatches?.length ?? 0}</Button>
      )
    },
    {
      field: 'metaDataAggregated', headerName: 'MetaData Aggregated', width: 190, renderCell: (p) => (
        <Button size="small" variant="outlined" onClick={() => { setSelectedRun(p.row); setDetailKey('metaDataAggregated'); setOpen(true); }}>{p.row.metaDataAggregated?.length ?? 0}</Button>
      )
    },
    {
      field: 'createdAt', headerName: 'Created At', width: 190, renderCell: (p) => {
        const v: any = p.row.createdAt as any;
        const iso = typeof v === 'string' ? v : v?.$date;
        return new Date(iso).toLocaleString();
      }
    },
  ]), []);

  const detailColumns: GridColDef<any>[] = useMemo(() => {
    switch (detailKey) {
      case 'pairedBatches':
        return [
          { field: 'index', headerName: 'Batch #', width: 90 },
          {
            field: 'pdfs', headerName: 'PDFs', width: 420,
            renderCell: (p) => (
              <div className="truncate whitespace-pre-wrap">
                {(p.row.pdfs || [])?.map((s: string, i: number) => (
                  <div key={i} className="flex items-center">
                    <IconButton onClick={() => copy(s)} className="ml-2" size="small"><FaCopy /></IconButton>
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            ),
          },
          {
            field: 'reducedPdfs', headerName: 'Reduced PDFs', width: 420,
            renderCell: (p) => (
              <div className="truncate whitespace-pre-wrap">
                {(p.row.reducedPdfs || [])?.map((s: string, i: number) => (
                  <div key={i} className="flex items-center">
                    <IconButton onClick={() => copy(s)} className="ml-2" size="small"><FaCopy /></IconButton>
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            ),
          },
        ];
      case 'metaDataAggregated':
        return [
          {
            field: 'originalFilePath', headerName: 'Original Path', width: 350,
            renderCell: (p) => (
              <div className="flex items-center">
                <IconButton onClick={() => copy(p.value)} className="ml-2" size="small"><FaCopy /></IconButton>
                <span>{p.value}</span>
              </div>
            ),
          },
          { field: 'fileName', headerName: 'File Name', width: 220 },
          { field: 'extractedMetadata', headerName: 'Extracted Metadata', width: 420 },
          { field: 'error', headerName: 'Error', width: 280 },
        ];
      case 'renamingResults':
        return [
          {
            field: 'originalFilePath', headerName: 'Original Path', width: 320,
            renderCell: (p) => (
              <div className="flex items-center">
                <IconButton onClick={() => copy(p.value)} className="ml-2" size="small"><FaCopy /></IconButton>
                <span>{p.value}</span>
              </div>
            ),
          },
          {
            field: 'reducedFilePath', headerName: 'Reduced Path', width: 120,
            renderCell: (p) => (
              <div className="flex items-center">
                <IconButton onClick={() => copy(p.value)} className="ml-2" size="small"><FaCopy /></IconButton>
                <span>{p.value}</span>
              </div>
            ),
          },

          { field: 'extractedMetadata', headerName: 'Extracted Metadata', width: 300 },
          {
            field: 'newFilePath', headerName: 'New File Path', width: 340,
            renderCell: (p) => (
              <div className="flex items-center">
                <IconButton onClick={() => copy(p.value)} className="ml-2" size="small"><FaCopy /></IconButton>
                <span>{p.value}</span>
              </div>
            ),
          },
          {
            field: 'success', headerName: 'Success', width: 90,
            renderCell: (p) => <span className={p.value ? 'text-green-700' : 'text-red-700'}>{p.value ? 'Yes' : 'No'}</span>,
          },
          {
            field: 'error', headerName: 'Error', width: 260,
            renderCell: (p) => <span className={'text-red-700'}>{String(p.value || "")}</span>,
          },
        ];
      default:
        return [];
    }
  }, [detailKey]);

  const detailRows = useMemo(() => {
    if (!selectedRun) return [];
    const arr: any[] = (selectedRun as any)[detailKey] || [];
    return arr?.map((r, i) => ({ id: i + 1, ...r }));
  }, [selectedRun, detailKey]);

  return (
    <div className="w-full">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">AI Title PDF Renamer History</Typography>
        <Box display="flex" gap={2} alignItems="center">
          <Button
            variant="contained"
            color="error"
            disabled={redoGlobalLoading || selectedRunIds.length === 0}
            onClick={async () => {
              if (selectedRunIds.length === 0) return;
              const ok = window.confirm(`Are you sure you want to REDO Failed for ${selectedRunIds.length} selected run(s)?`);
              if (!ok) return;
              try {
                setRedoGlobalLoading(true);
                const res = await makePostCall({ selectedRunIds }, 'ai/aiRenamerRedo');
                setRedoTitle(`REDO Failed triggered for ${selectedRunIds.length} selected run(s)`);
                setRedoBody(JSON.stringify(res, null, 2));
                setRedoOpen(true);
                setReloadKey((k) => k + 1);
              } catch (e: any) {
                setRedoTitle('REDO Failed error');
                setRedoBody(e?.message ? String(e.message) : 'Unknown error');
                setRedoOpen(true);
              } finally {
                setRedoGlobalLoading(false);
              }
            }}
          >
            {`Redo Selected (${selectedRunIds.length})`}
          </Button>
        </Box>
      </Box>

      {error && (
        <Box sx={{ mb: 2, p: 1, bgcolor: '#ffebee', borderRadius: 1 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      <div className="h-[800px] w-full">
        <DataGrid
          rows={rows}
          getRowId={(r) => r.runId}
          columns={columns}
          pagination
          pageSizeOptions={[10, 20, 50]}
          loading={loading}
          checkboxSelection
          disableRowSelectionOnClick
          onRowSelectionModelChange={(newSelection) => {
            setSelectedRunIds((newSelection as any[]).map((id) => String(id)));
          }}
          slots={{ toolbar: GridToolbar }}
          getRowClassName={(params) => {
            return (params.row.failedCount > 0) ? 'bg-red-100' : 'bg-green-100';
          }}
        />
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xl" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">{detailKey} for Run: {selectedRun?.runId}</Typography>
            <Button variant="outlined" onClick={() => setOpen(false)}>Close</Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedRun && (
            <Box sx={{ mb: 2, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="subtitle2">Processed: {selectedRun.processedCount}</Typography>
              <Typography variant="subtitle2">Success: {selectedRun.successCount} | Failed: {selectedRun.failedCount}</Typography>
              {!!selectedRun.error && <Typography variant="subtitle2" color="error">Error: {selectedRun.error}</Typography>}
            </Box>
          )}
          <div className="h-[520px] w-full">
            <DataGrid
              rows={detailRows}
              columns={detailColumns}
              getRowId={(r) => r.id}
              pageSizeOptions={[10, 20, 50]}
              pagination
              initialState={{
                sorting: {
                  sortModel: detailKey === 'renamingResults' ? [{ field: 'success', sort: 'asc' }] : [],
                },
              }}
              slots={{ toolbar: GridToolbar }}
              getRowClassName={(params) => {
                return params.row.success ? 'bg-green-100' : 'bg-red-100';
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Full-screen spinner overlay during REDO processing */}
      <Backdrop open={redoGlobalLoading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.modal + 1 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <CircularProgress color="inherit" />
          <Typography variant="subtitle1">Redoing failed items...</Typography>
        </Box>
      </Backdrop>

      {/* Popup to display REDO result */}
      <Dialog open={redoOpen} onClose={() => setRedoOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">{redoTitle || 'REDO Result'}</Typography>
            <Button variant="outlined" onClick={() => setRedoOpen(false)}>Close</Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: 12 }}>
            {redoBody}
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AITitlePdfRenamerHistory;
