import React, { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import { Button, Chip, Dialog, DialogContent, DialogTitle, IconButton, Tooltip, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel, GridToolbar } from '@mui/x-data-grid';
import { makeGetCall } from 'service/ApiInterceptor';
import { buildDeterministicColorMap, colorForKey } from '../utils/color';
import { FaCopy, FaArrowRight } from 'react-icons/fa';
import { ellipsis } from 'widgets/ItemTooltip';
import { useNavigate } from 'react-router-dom';
import { FILE_TRANSFER_LISTING } from 'Routes/constants';

interface ExtractNPagesItem {
  _id: string;
  _srcFolders: string[];
  _destRootFolders: string[];
  firstNPages: number;
  lastNPages: number;
  reducePdfSizeAlso: boolean;
  srcFolderCount?: number;
  success?: boolean;
  commonRunId: string;
  createdAt: string;
  __v: number;
}

interface FetchExtractNPagesHistoryResponse {
  data: ExtractNPagesItem[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

interface ExtractPerItemHistoryRow {
  _id: string;
  _srcFolder: string;
  _destRootFolder: string;
  firstNPages: number;
  lastNPages: number;
  reducePdfSizeAlso: boolean;
  commonRunId: string;
  runId: string;
  createdAt: string;
  __v: number;
  success?: boolean;
  errorMsg?: string;
  logs?: any;
}

const PdfPageExtractionHistory: React.FC = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<ExtractNPagesItem[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [detailOpen, setDetailOpen] = useState<boolean>(false);
  const [detailRows, setDetailRows] = useState<ExtractPerItemHistoryRow[]>([]);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [selectedCommonRunId, setSelectedCommonRunId] = useState<string>('');

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  const handleCopyText = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(String(text));
  };

  const fetchHistory = async (
    page: number,
    pageSize: number
  ): Promise<FetchExtractNPagesHistoryResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await makeGetCall(`pdf/getPageExtractionHistory?page=${page}&limit=${pageSize}`);
      return response as FetchExtractNPagesHistoryResponse;
    } catch (e: unknown) {
      console.error('Error fetching ExtractNPages history:', e);
      setError(e instanceof Error ? e.message : 'Failed to fetch Extract N Pages history');
      return { data: [], currentPage: page, totalPages: 0, totalItems: 0 };
    } finally {
      setLoading(false);
    }
  };

  const fetchPerItemHistory = async (commonRunId: string) => {
    if (!commonRunId) return;
    setDetailLoading(true);
    setDetailError(null);
    try {
      const res = await makeGetCall(`pdf/getPageExtractionPerItemHistory/${commonRunId}`);
      let data: any = [];

      // Case 1: backend returns a plain array
      if (Array.isArray(res)) {
        data = res;
      } else {
        const anyRes: any = res;

        // Case 2: common pattern { data: [...] }
        if (anyRes && Array.isArray(anyRes.data)) {
          data = anyRes.data;
        } else if (anyRes && typeof anyRes === 'object') {
          // Case 3: "array-like" object: {0: {...}, 1: {...}, ..., date: '...', timeTaken: '...'}
          const numericKeys = Object.keys(anyRes)
            .filter((k) => /^\d+$/.test(k))
            .sort((a, b) => Number(a) - Number(b));
          if (numericKeys.length > 0) {
            data = numericKeys.map((k) => anyRes[k]);
          }
        }
      }

      setDetailRows(Array.isArray(data) ? (data as ExtractPerItemHistoryRow[]) : []);
    } catch (e: unknown) {
      console.error('Error fetching per-item ExtractNPages history:', e);
      setDetailError(e instanceof Error ? e.message : 'Failed to fetch per-item history');
      setDetailRows([]);
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      const page = paginationModel.page + 1;
      const pageSize = paginationModel.pageSize;
      const res = await fetchHistory(page, pageSize);
      setRows(res.data || []);
      setTotalItems(res.totalItems || 0);
    };
    load();
  }, [paginationModel.page, paginationModel.pageSize]);

  const commonRunIdColorMap = useMemo(() => {
    const ids = Array.from(new Set((rows || []).map((r) => String(r.commonRunId ?? ''))));
    return buildDeterministicColorMap(ids);
  }, [rows]);

  const openLogsWindow = (row: ExtractPerItemHistoryRow) => {
    const logs: any = (row as any)?.logs;
    if (!logs) return;

    const logMessages: string[] = Array.isArray(logs.log_messages) ? logs.log_messages : [];
    const details: any[] = Array.isArray(logs.processing_details) ? logs.processing_details : [];

    const lines: string[] = [];
    lines.push(`Common Run ID: ${row.commonRunId}`);
    lines.push(`Run ID       : ${row.runId}`);
    lines.push(`Source Folder: ${row._srcFolder}`);
    lines.push(`Dest Folder  : ${row._destRootFolder}`);
    lines.push('');
    lines.push('Summary:');
    lines.push(`  Total Files        : ${logs.totalFiles}`);
    lines.push(`  Processed Files    : ${logs.processedFiles}`);
    lines.push(`  Errors             : ${logs.errors}`);
    if (logs.duration_seconds != null) {
      lines.push(`  Duration (seconds) : ${logs.duration_seconds}`);
    }
    if (logs.start_time) {
      lines.push(`  Start Time         : ${logs.start_time}`);
    }
    lines.push('');
    lines.push('Log Messages:');
    for (const m of logMessages) {
      lines.push(String(m));
    }
    lines.push('');
    if (details.length > 0) {
      lines.push('Processing Details:');
      for (const d of details) {
        lines.push(`- File: ${d.file || ''}`);
        lines.push(`  Status         : ${d.status}`);
        if (d.original_pages != null) lines.push(`  Original Pages : ${d.original_pages}`);
        if (d.pages_extracted != null) lines.push(`  Pages Extracted: ${d.pages_extracted}`);
        if (d.error) lines.push(`  Error          : ${d.error}`);
        lines.push('');
      }
    }

    const text = lines.join('\n');
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8" /><title>Logs for ${row._srcFolder}</title></head><body><pre style="white-space: pre-wrap; font-family: monospace; font-size: 12px;">${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      }</pre></body></html>`;

    const win = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.close();
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'commonRunId',
      headerName: 'Common Run ID',
      width: 120,
      renderCell: (params) => {
        const v = String(params.value ?? '');
        const { bg, color, border } = commonRunIdColorMap[v] || colorForKey(v);
        return (
          <Button
            variant="text"
            size="small"
            onClick={() => {
              setSelectedCommonRunId(v);
              setDetailOpen(true);
              fetchPerItemHistory(v);
            }}
            sx={{ minWidth: 0, padding: 0 }}
          >
            <Chip
              label={ellipsis(v, 10)}
              size="small"
              sx={{ bgcolor: bg, color, fontWeight: 600, border: `1px solid ${border}` }}
            />
          </Button>
        );
      },
    },
    {
      field: 'srcFolderCount',
      headerName: 'Files',
      width: 50,
    },
    {
      field: '_srcFolders',
      headerName: 'Source Folders',
      width: 280,
      renderCell: (params) => {
        const v = (params.value as string[]) || [];
        const asText = v.join(', ');
        return (
          <div className="flex items-center gap-2">
            <Tooltip title="Copy Source Folders">
              <IconButton onClick={() => handleCopyText(asText)} size="small" className="ml-1">
                <FaCopy />
              </IconButton>
            </Tooltip>
            <Tooltip title={`Copy and Go to File Transfer`}>
              <IconButton
                onClick={() => {
                  handleCopyText(asText);
                  navigate(`${FILE_TRANSFER_LISTING}?src=${encodeURIComponent(asText)}`);
                }}
                size="small"
                color="primary"
              >
                <FaArrowRight />
              </IconButton>
            </Tooltip>
            <span>{asText}</span>
          </div>
        );
      },
    },
    {
      field: '_destRootFolders',
      headerName: 'Destination Root Folders',
      width: 280,
      renderCell: (params) => {
        const v = (params.value as string[]) || [];
        const asText = v.join(', ');
        return (
          <div className="flex items-center gap-2">
            <Tooltip title="Copy Destination Root Folders">
              <IconButton onClick={() => handleCopyText(asText)} size="small" className="ml-1">
                <FaCopy />
              </IconButton>
            </Tooltip>
            <span>{asText}</span>
          </div>
        );
      },
    },
    {
      field: 'success',
      headerName: 'Success',
      width: 110,
      renderCell: (params) => (
        <span className={params.value ? 'text-green-700' : 'text-red-700'}>
          {params.value ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 200,
      renderCell: (params) => {
        const v = params.value as string;
        return v ? new Date(v).toLocaleString() : '';
      },
    },
    {
      field: 'composite',
      headerName: 'First-Last N Pages',
      width: 130,
      renderCell: (params) => `${params.row.firstNPages}-${params.row.lastNPages}`,
    },
    {
      field: 'reducePdfSizeAlso',
      headerName: 'Reduce Size',
      width: 120,
      renderCell: (params) => (params.value ? 'Yes' : 'No'),
    },
  ];

  return (
    <div className="h-[600px] w-full">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" component="h2">
          Extract N Pages History
        </Typography>
      </Box>

      {error && (
        <Box sx={{ mb: 2, p: 1, bgcolor: '#ffebee', borderRadius: 1 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      <div className="h-[520px] w-full">
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row._id}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 20]}
          pagination
          paginationMode="server"
          rowCount={totalItems}
          loading={loading}
          slots={{ toolbar: GridToolbar }}
          getRowClassName={(params) => {
            return params.row.success ? 'bg-green-100' : 'bg-red-100';
          }}
        />
      </div>

      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="xl" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Per Item History for Common Run: {selectedCommonRunId}</Typography>
            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                onClick={() => fetchPerItemHistory(selectedCommonRunId)}
                disabled={detailLoading || !selectedCommonRunId}
              >
                Refresh
              </Button>
              <Button variant="contained" onClick={() => setDetailOpen(false)}>
                Close
              </Button>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {detailError && (
            <Box sx={{ mb: 2, p: 1, bgcolor: '#ffebee', borderRadius: 1 }}>
              <Typography color="error">{detailError}</Typography>
            </Box>
          )}

          <div className="h-[520px] w-full">
            <DataGrid
              rows={detailRows}
              columns={[
                {
                  field: '_srcFolder',
                  headerName: 'Source Folder',
                  width: 260,
                  renderCell: (params) => (
                    <div className="flex items-center gap-2">
                      <Tooltip title="Copy Source Folder">
                        <IconButton onClick={() => handleCopyText(params.value as string)} size="small">
                          <FaCopy />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={`Copy and Go to File Transfer`}>
                        <IconButton
                          onClick={() => {
                            handleCopyText(params.value as string);
                            navigate(`${FILE_TRANSFER_LISTING}?src=${encodeURIComponent(params.value as string)}`);
                          }}
                          size="small"
                          color="primary"
                        >
                          <FaArrowRight />
                        </IconButton>
                      </Tooltip>
                      <span>{params.value}</span>
                    </div>
                  ),
                },
                {
                  field: '_destRootFolder',
                  headerName: 'Dest Root Folder',
                  width: 260,
                  renderCell: (params) => (
                    <div className="flex items-center gap-2">
                      <Tooltip title="Copy Destination Root Folder">
                        <IconButton onClick={() => handleCopyText(params.value as string)} size="small">
                          <FaCopy />
                        </IconButton>
                      </Tooltip>
                      <span>{params.value}</span>
                    </div>
                  ),
                },
                {
                  field: 'runId', headerName: 'Run ID', width: 120,
                  renderCell: (params) => (
                    <div className="flex items-center gap-2">
                      <Tooltip title="Copy Run ID">
                        <IconButton onClick={() => handleCopyText(params.value as string)} size="small">
                          <FaCopy />
                        </IconButton>
                      </Tooltip>
                      <span>{ellipsis(params.value as string, 10)}</span>
                    </div>
                  ),
                },
                {
                  field: 'createdAt',
                  headerName: 'Created At',
                  width: 200,
                  renderCell: (p) => (p.value ? new Date(p.value as string).toLocaleString() : ''),
                },
                {
                  field: 'success',
                  headerName: 'Success',
                  width: 100,
                  renderCell: (p) => (
                    <span className={p.value ? 'text-green-700' : 'text-red-700'}>
                      {p.value ? 'Yes' : 'No'}
                    </span>
                  ),
                },
                {
                  field: 'errorMsg',
                  headerName: 'Error Message',
                  width: 260,
                },
                {
                  field: 'logsSummary',
                  headerName: 'Logs (P/T/E)',
                  width: 160,
                  renderCell: (p) => {
                    const logs: any = (p.row as any)?.logs;
                    if (!logs) return '';
                    const total = logs.totalFiles ?? logs.total ?? '';
                    const processed = logs.processedFiles ?? logs.processed ?? '';
                    const errors = logs.errors ?? '';
                    return `${processed}/${total}/${errors}`;
                  },
                },
                {
                  field: 'logsAction',
                  headerName: 'Logs',
                  width: 120,
                  renderCell: (p) => (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => openLogsWindow(p.row as ExtractPerItemHistoryRow)}
                      disabled={!(p.row as any)?.logs}
                    >
                      View Logs
                    </Button>
                  ),
                },
                {
                  field: 'composite',
                  headerName: 'First-Last N Pages',
                  width: 130,
                  renderCell: (params) => `${params.row.firstNPages}-${params.row.lastNPages}`,
                },
                { field: 'reducePdfSizeAlso', headerName: 'Reduce Size', width: 120, renderCell: (p) => (p.value ? 'Yes' : 'No') },
              ]}
              getRowId={(row) => row._id}
              pageSizeOptions={[5, 10, 20]}
              pagination
              loading={detailLoading}
              initialState={{
                sorting: {
                  sortModel: [
                    { field: 'success', sort: 'asc' },
                    { field: 'createdAt', sort: 'desc' },
                  ],
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
    </div>
  );
};

export default PdfPageExtractionHistory;
