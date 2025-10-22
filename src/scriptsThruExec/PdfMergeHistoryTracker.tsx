import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Button, Dialog, DialogTitle, DialogContent, Typography, CircularProgress, IconButton } from '@mui/material';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { makeGetCall } from 'service/ApiInterceptor';
import { FaCopy } from 'react-icons/fa';

// Types for API responses
interface CommonRunRow {
  commonRunId: string;
  createdAt: string;
  pdfPathsToMergeCount: number | null;
}

interface CommonRunsResponse {
  response: CommonRunRow[];
}

interface MoveResult {
  sourcePath: string;
  movedToPath: string;
}

interface OperationDetailsPdf {
  path: string;
  size_mb?: number;
  pages?: number;
}

interface OperationDetailsData {
  status: string; // e.g., 'success' | 'failed'
  message: string;
  details?: {
    first_pdf?: OperationDetailsPdf;
    second_pdf?: OperationDetailsPdf;
    merged_pdf?: OperationDetailsPdf;
    processing_time_seconds?: number;
  };
}

interface OperationResult {
  status: boolean;
  message: string;
  data?: OperationDetailsData;
}

interface DetailRow {
  _id: string;
  commonRunId: string;
  runId: string;
  first_pdf_path?: string;
  second_pdf_path?: string;
  third_pdf_path?: string;
  operationResult?: OperationResult;
  moveResults?: MoveResult[];
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

interface DetailsResponse {
  response: DetailRow[];
}

const PdfMergeHistoryTracker: React.FC = () => {
  const [rows, setRows] = useState<CommonRunRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Detail dialog state
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedCommonRunId, setSelectedCommonRunId] = useState<string>('');
  const [detailRows, setDetailRows] = useState<DetailRow[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);

  // Modal for operationResult
  const [openOperation, setOpenOperation] = useState(false);
  const [operationForRow, setOperationForRow] = useState<OperationResult | null>(null);

  // Modal for moveResults
  const [openMoves, setOpenMoves] = useState(false);
  const [movesForRow, setMovesForRow] = useState<MoveResult[] | null>(null);

  // Selected detail row (default to first when details load)
  const [selectedDetail, setSelectedDetail] = useState<DetailRow | null>(null);

  const copy = (t: any) => navigator.clipboard.writeText(String(t ?? ''));

  // Load common runs
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await makeGetCall('pythonScripts/merge-multiple-pdf-tracker/common-runs');
        const data = (res?.response ?? []) as CommonRunRow[];
        setRows(data);
      } catch (e: any) {
        setError(e?.message || 'Failed to load common runs');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Load details for selected common run
  const loadDetails = async (commonRunId: string) => {
    setDetailLoading(true);
    setError(null);
    try {
      const res = await makeGetCall(`pythonScripts/merge-multiple-pdf-tracker/by-common-run/${commonRunId}`);
      const data = (res?.response ?? []) as DetailRow[];
      setDetailRows(data);
      setSelectedDetail(data.length > 0 ? data[0] : null);
    } catch (e: any) {
      setError(e?.message || 'Failed to load details');
    } finally {
      setDetailLoading(false);
    }
  };

  const openDetails = (commonRunId: string) => {
    setSelectedCommonRunId(commonRunId);
    setOpenDetail(true);
    loadDetails(commonRunId);
  };

  const columns: GridColDef[] = [
    {
      field: 'commonRunId',
      headerName: 'Common Run Id',
      width: 320,
      renderCell: (params) => (
        <div className="flex items-center">
          <IconButton onClick={() => copy(params.value)} className="ml-2" size="small">
            <FaCopy />
          </IconButton>
          <Button variant="text" onClick={() => openDetails(params.value)}>{params.value}</Button>
        </div>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 220,
      renderCell: (params) => new Date(params.value).toLocaleString(),
    },
    {
      field: 'pdfPathsToMergeCount',
      headerName: 'PDFs to Merge',
      width: 160,
      renderCell: (params) => {
        const val = params.value as number | null;
        return <span>{val === null || typeof val === 'undefined' ? '-' : String(val)}</span>;
      },
    },
  ];

  const detailColumns: GridColDef<DetailRow>[] = [
    { field: 'runId', headerName: 'Run ID', width: 280 },
    {
      field: 'mergedPdfPath', headerName: 'Merged PDF', width: 360,
      renderCell: (p) => {
        const val = p.row.operationResult?.data?.details?.merged_pdf?.path ?? '';
        return (
          <div className="flex items-center">
            <IconButton onClick={() => copy(val)} className="ml-2" size="small"><FaCopy /></IconButton>
            <span>{val}</span>
          </div>
        );
      }
    },{
      field: 'first_pdf_path', headerName: 'First PDF', width: 360,
      renderCell: (p) => (
        <div className="flex items-center">
          <IconButton onClick={() => copy(p.value)} className="ml-2" size="small"><FaCopy /></IconButton>
          <span>{p.value}</span>
        </div>
      )
    },
    {
      field: 'second_pdf_path', headerName: 'Second PDF', width: 360,
      renderCell: (p) => (
        <div className="flex items-center">
          <IconButton onClick={() => copy(p.value)} className="ml-2" size="small"><FaCopy /></IconButton>
          <span>{p.value}</span>
        </div>
      )
    },
    {
      field: 'third_pdf_path', headerName: 'Third PDF', width: 360,
      renderCell: (p) => (
        <div className="flex items-center">
          <IconButton onClick={() => copy(p.value)} className="ml-2" size="small"><FaCopy /></IconButton>
          <span>{p.value}</span>
        </div>
      )
    },
    
    {
      field: 'operationResult', headerName: 'Operation Result', width: 180,
      renderCell: (p) => (
        <Button size="small" variant="outlined" onClick={() => { setOperationForRow(p.row.operationResult ?? null); setOpenOperation(true); }}>
          View
        </Button>
      )
    },
    {
      field: 'moveResults', headerName: 'Move Results', width: 160,
      renderCell: (p) => (
        <Button size="small" variant="outlined" onClick={() => { setMovesForRow(p.row.moveResults ?? null); setOpenMoves(true); }}>
          View
        </Button>
      )
    },
    {
      field: 'processingTime', headerName: 'Proc. Time (s)', width: 140,
      renderCell: (p) => {
        const val = p.row.operationResult?.data?.details?.processing_time_seconds ?? '';
        return <span>{val}</span>;
      }
    },
    {
      field: 'createdAt', headerName: 'Created At', width: 200,
      renderCell: (p) => new Date(p.value as any).toLocaleString(),
    },
  ];

  return (
    <div className="h-[600px] w-full">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" component="h2">
          PDF Merge History Tracker
        </Typography>
        <Button
          variant="outlined"
          onClick={() => {
            // reload main list
            (async () => {
              setLoading(true);
              try {
                const res = await makeGetCall('pythonScripts/merge-multiple-pdf-tracker/common-runs');
                const data = (res?.response ?? []) as CommonRunRow[];
                setRows(data);
              } finally {
                setLoading(false);
              }
            })();
          }}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Box sx={{ mb: 2, p: 1, bgcolor: '#ffebee', borderRadius: 1 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      <div className="h-[420px] w-full mb-4">
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.commonRunId}
          pagination
          pageSizeOptions={[5, 10, 20]}
          loading={loading}
          slots={{ toolbar: GridToolbar }}
        />
      </div>

      {/* Details dialog */}
      <Dialog open={openDetail} onClose={() => setOpenDetail(false)} maxWidth="xl" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Details for Common Run: {selectedCommonRunId}</Typography>
            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                onClick={() => loadDetails(selectedCommonRunId)}
                startIcon={detailLoading ? <CircularProgress size={20} color="inherit" /> : null}
                disabled={detailLoading}
              >
                Refresh
              </Button>
              <Button variant="contained" onClick={() => setOpenDetail(false)}>Close</Button>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {error && (
            <Box sx={{ mb: 2, p: 1, bgcolor: '#ffebee', borderRadius: 1 }}>
              <Typography color="error">{error}</Typography>
            </Box>
          )}

          {/* Selected row files summary */}
          <Box sx={{ mb: 2, p: 1, bgcolor: '#f7f7f7', borderRadius: 1 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Selected Row Files {selectedDetail ? `(Run: ${selectedDetail.runId})` : ''}
            </Typography>
            {selectedDetail ? (
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 0.5 }}>
                <div className="flex items-center">
                  <Typography variant="body2" sx={{ mr: 1 }}>1st PDF:</Typography>
                  <IconButton onClick={() => copy(selectedDetail.first_pdf_path ?? '')} size="small"><FaCopy /></IconButton>
                  <span className="truncate">{selectedDetail.first_pdf_path ?? ''}</span>
                </div>
                <div className="flex items-center">
                  <Typography variant="body2" sx={{ mr: 1 }}>2nd PDF:</Typography>
                  <IconButton onClick={() => copy(selectedDetail.second_pdf_path ?? '')} size="small"><FaCopy /></IconButton>
                  <span className="truncate">{selectedDetail.second_pdf_path ?? ''}</span>
                </div>
                <div className="flex items-center">
                  <Typography variant="body2" sx={{ mr: 1 }}>3rd PDF:</Typography>
                  <IconButton onClick={() => copy(selectedDetail.third_pdf_path ?? '')} size="small"><FaCopy /></IconButton>
                  <span className="truncate">{selectedDetail.third_pdf_path ?? ''}</span>
                </div>
                <div className="flex items-center">
                  <Typography variant="body2" sx={{ mr: 1 }}>Merged PDF:</Typography>
                  <IconButton onClick={() => copy(selectedDetail.operationResult?.data?.details?.merged_pdf?.path ?? '')} size="small"><FaCopy /></IconButton>
                  <span className="truncate">{selectedDetail.operationResult?.data?.details?.merged_pdf?.path ?? ''}</span>
                </div>
              </Box>
            ) : (
              <Typography variant="body2">No row selected.</Typography>
            )}
          </Box>

          <div className="h-[520px] w-full">
            <DataGrid
              rows={detailRows}
              columns={detailColumns}
              getRowId={(r) => r._id}
              pageSizeOptions={[5, 10, 20]}
              pagination
              loading={detailLoading}
              slots={{ toolbar: GridToolbar }}
              onRowClick={(params) => setSelectedDetail(params.row)}
              getRowClassName={(params) => {
                const op: any = (params.row as any)?.operationResult;
                const isSuccess = op?.status ?? op?.success ?? false;
                return isSuccess ? 'bg-green-100' : 'bg-red-100';
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Operation Result dialog */}
      <Dialog open={openOperation} onClose={() => setOpenOperation(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Operation Result</Typography>
            <Button variant="outlined" onClick={() => setOpenOperation(false)}>Close</Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          {operationForRow ? (
            <Box sx={{ p: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="subtitle2">Status: <span className={operationForRow.status ? 'text-green-700' : 'text-red-700'}>{String(operationForRow.status)}</span></Typography>
              <Typography variant="subtitle2">Message: {operationForRow.message}</Typography>

              {/* Nested details if available */}
              {operationForRow.data?.details && (
                <Box sx={{ mt: 1, p: 1, bgcolor: '#f5f5f5', borderRadius: 1, display: 'grid', gridTemplateColumns: '1fr', gap: 1 }}>
                  {operationForRow.data.details.first_pdf?.path && (
                    <div className="flex items-center">
                      <Typography variant="body2" sx={{ mr: 1 }}>First PDF:</Typography>
                      <IconButton onClick={() => copy(operationForRow.data!.details!.first_pdf!.path)} size="small"><FaCopy /></IconButton>
                      <span>{operationForRow.data.details.first_pdf.path}</span>
                    </div>
                  )}
                  {operationForRow.data.details.second_pdf?.path && (
                    <div className="flex items-center">
                      <Typography variant="body2" sx={{ mr: 1 }}>Second PDF:</Typography>
                      <IconButton onClick={() => copy(operationForRow.data!.details!.second_pdf!.path)} size="small"><FaCopy /></IconButton>
                      <span>{operationForRow.data.details.second_pdf.path}</span>
                    </div>
                  )}
                  {operationForRow.data.details.merged_pdf?.path && (
                    <div className="flex items-center">
                      <Typography variant="body2" sx={{ mr: 1 }}>Merged PDF:</Typography>
                      <IconButton onClick={() => copy(operationForRow.data!.details!.merged_pdf!.path)} size="small"><FaCopy /></IconButton>
                      <span>{operationForRow.data.details.merged_pdf.path}</span>
                    </div>
                  )}
                  {typeof operationForRow.data.details.processing_time_seconds !== 'undefined' && (
                    <Typography variant="body2">Processing Time (s): {operationForRow.data.details.processing_time_seconds}</Typography>
                  )}
                </Box>
              )}
            </Box>
          ) : (
            <Typography variant="body2">No operation result available.</Typography>
          )}
        </DialogContent>
      </Dialog>

      {/* Move Results dialog */}
      <Dialog open={openMoves} onClose={() => setOpenMoves(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Move Results</Typography>
            <Button variant="outlined" onClick={() => setOpenMoves(false)}>Close</Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          {movesForRow && movesForRow.length > 0 ? (
            <div className="h-[420px] w-full">
              <DataGrid
                rows={movesForRow.map((m, i) => ({ id: i + 1, ...m }))}
                columns={[
                  {
                    field: 'sourcePath', headerName: 'Source Path', width: 420,
                    renderCell: (p) => (
                      <div className="flex items-center">
                        <IconButton onClick={() => copy(p.value)} className="ml-2" size="small"><FaCopy /></IconButton>
                        <span>{p.value}</span>
                      </div>
                    )
                  },
                  {
                    field: 'movedToPath', headerName: 'Moved To Path', width: 420,
                    renderCell: (p) => (
                      <div className="flex items-center">
                        <IconButton onClick={() => copy(p.value)} className="ml-2" size="small"><FaCopy /></IconButton>
                        <span>{p.value}</span>
                      </div>
                    )
                  }
                ] as GridColDef[]}
                getRowId={(r) => (r as any).id}
                pageSizeOptions={[5, 10, 20]}
                pagination
              />
            </div>
          ) : (
            <Typography variant="body2">No move results available.</Typography>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PdfMergeHistoryTracker;
