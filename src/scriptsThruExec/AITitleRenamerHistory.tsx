import React, { useState, useEffect, useMemo } from 'react';
import ExecComponent from './ExecComponent';
import ExecResponsePanel from './ExecResponsePanel';
import Box from '@mui/material/Box';
import { ExecType } from './ExecLauncherUtil';
import { Button, Dialog, DialogTitle, DialogContent, Chip, IconButton, Typography, CircularProgress, TextField, Tooltip } from '@mui/material';
import { buildDeterministicColorMap, colorForKey } from '../utils/color';
import { AI_RENAMER_ABS_PATH_LOCAL_STORAGE_KEY, AI_RENAMER_REDUCED_PATH_LOCAL_STORAGE_KEY, AI_RENAMER_RENAMER_PATH_LOCAL_STORAGE_KEY } from 'service/consts';
import { DataGrid, GridColDef, GridFilterModel, GridPaginationModel, GridToolbar } from '@mui/x-data-grid';
import { makeGetCall, makePostCall } from 'service/ApiInterceptor';
import { FaCopy } from 'react-icons/fa';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { ellipsis } from 'widgets/ItemTooltip';
// No need for path module

// Types
interface PdfTitleRename {
  _id: {
    $oid: string;
  };
  runId: string;
  srcFolder: string;
  reducedFolder: string;
  outputFolder: string;
  batchIndex: number;
  indexInBatch: number;
  originalFilePath: string;
  reducedFilePath: string;
  fileName: string;
  extractedMetadata: string;
  applyButtonClicked: boolean;
  cleanupButtonClicked: boolean;
  __v: number;
  createdAt: {
    $date: string;
  };
  updatedAt: {
    $date: string;
  };
}

interface GroupedRenameData {
  commonRunId: string;
  runId: string;
  count: number;
  _id: string;
  createdAt: string;
}

interface FetchResponse {
  data: GroupedRenameData[];
  totalItems: number;
}

interface FetchRunDetailsResponse {
  data: PdfTitleRename[];
  totalItems: number;
}

const AITitleRenamerHistory: React.FC = () => {
  const [groupedData, setGroupedData] = useState<GroupedRenameData[]>([]);
  const [detailData, setDetailData] = useState<PdfTitleRename[]>([]);
  const [openDetailDialog, setOpenDetailDialog] = useState<boolean>(false);
  const [selectedRunId, setSelectedRunId] = useState<string>('');
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalDetailItems, setTotalDetailItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const [resultOpen, setResultOpen] = useState<boolean>(false);
  const [resultTitle, setResultTitle] = useState<string>('');
  const [resultBody, setResultBody] = useState<any>(null);

  // Pagination state
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
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

  // State for error messages
  const [error, setError] = useState<string | null>(null);

  // State for cleanup folder textfield
  const [cleanupTOFolder, setCleanupTOFolder] = useState<string>('NAGITHA');

  // API calls
  const fetchGroupedRenameData = async (page: number, pageSize: number): Promise<FetchResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await makeGetCall(`ai/getAllTitleRenamedViaAIListGroupedByRunId?page=${page}&limit=${pageSize}`);
      console.log(`Response from fetchGroupedRenameData: ${JSON.stringify(response)}`);
      return response;
    } catch (error) {
      console.error('Error fetching grouped rename data:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch rename data');
      return { data: [], totalItems: 0 };
    } finally {
      setLoading(false);
    }
  };

  const fetchRunDetails = async (runId: string, page: number, pageSize: number): Promise<FetchRunDetailsResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await makeGetCall(`ai/getAllTitleRenamedViaAIList/${runId}?page=${page}&limit=${pageSize}`);
      console.log(`Response from fetchRunDetails: ${JSON.stringify(response)}`);
      return response;
    } catch (error) {
      console.error('Error fetching run details:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch run details');
      return { data: [], totalItems: 0 };
    } finally {
      setLoading(false);
    }
  };

  // Load grouped data on initial load and pagination/filter changes
  useEffect(() => {
    const loadGroupedData = async () => {
      try {
        const { data, totalItems } = await fetchGroupedRenameData(paginationModel.page + 1, paginationModel.pageSize);
        if (data) {
          setGroupedData(data);
          setTotalItems(totalItems);
        }
      } catch (error) {
        console.error('Error loading grouped data:', error);
      }
    };
    loadGroupedData();
  }, [paginationModel.page, paginationModel.pageSize]);


  useEffect(() => {
    const loadRunDetails = async () => {
      if (!selectedRunId) {
        return;
      }

      const response = await fetchRunDetails(
        selectedRunId,
        detailPaginationModel.page + 1,
        detailPaginationModel.pageSize
      );
      setDetailData(response.data);
      setTotalDetailItems(response.totalItems);
    }
    loadRunDetails();
  }, [selectedRunId, detailPaginationModel.page, detailPaginationModel.pageSize])
  // Detail view should refetch when either the selected run or the pagination changes

  // Handle opening detail view
  const handleOpenDetails = (runId: string) => {
    setSelectedRunId(runId);
    setOpenDetailDialog(true);
    setDetailPaginationModel({
      page: 0,
      pageSize: 10
    });
  };

  // Handle copying text to clipboard
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Get filename from path
  const getFileName = (filePath: string) => {
    // Simple function to extract filename from path
    const parts = filePath.split(/[\\\/]/);
    return parts[parts.length - 1];
  };

  // Deterministic color for a given key to visually distinguish different IDs

  // Map each visible commonRunId to a unique color to avoid collisions within the dataset
  const commonRunIdColorMap = useMemo(() => {
    const ids = Array.from(new Set((groupedData || []).map((g) => String(g.commonRunId ?? ''))));
    return buildDeterministicColorMap(ids);
  }, [groupedData]);

  // Define columns for the grouped data DataGrid
  const groupedColumns: GridColDef[] = [
    {
      field: 'runId',
      headerName: 'Run ID',
      width: 200,
      filterable: true,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <IconButton onClick={() => handleCopyText(params.value)} className="ml-2">
            <FaCopy />
          </IconButton>
          <Button onClick={() => handleOpenDetails(params.value)} variant="text" color="primary">
            {ellipsis(params.value, 15)}
          </Button>
        </div>
      ),
    },
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
      field: 'srcFolder',
      headerName: 'Source Folder',
      width: 100,
      filterable: true,
    },
    {
      field: 'count',
      headerName: 'Files',
      width: 100,
      filterable: true,
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 200,
      filterable: true,
      renderCell: (params) => new Date(params.value).toLocaleString(),
    },
    {
      field: 'action',
      headerName: 'Apply Metadata to Original Files',
      width: 230,
      filterable: false,
      sortable: false,
      renderCell: (params) => (
        <Button
          size="small"
          variant="contained"
          disabled={!!actionLoading[params.row.runId] || params.row.applyButtonClicked}
          onClick={async () => {
            const runId = params.row.runId;
            const ok = window.confirm(`Are you sure you want to apply metadata to original files for runId=${runId}?`);
            if (!ok) return;
            try {
              setActionLoading((m) => ({ ...m, [runId]: true }));
              const res = await makePostCall({}, `ai/copyMetadataToOriginalFiles/${runId}`);
              console.log('Trigger response:', JSON.stringify(res));
              setResultTitle(`Copy Metadata triggered for runId=${runId}`);
              setResultBody(res);
              setResultOpen(true);
            } catch (e) {
              console.error(e);
              setResultTitle('Copy Metadata error');
              setResultBody({ error: e instanceof Error ? e.message : 'Unknown error' });
              setResultOpen(true);
            } finally {
              setActionLoading((m) => ({ ...m, [runId]: false }));
            }
          }}
        >
          {actionLoading[params.row.runId] ? (
            <>
              <CircularProgress size={16} color="inherit" style={{ marginRight: 6 }} />
              Running...
            </>
          ) : (
            'Apply'
          )}
        </Button>
      ),
    },
    {
      field: 'cleanup',
      headerName: 'Cleanup Reduced/Renamer Folders',
      width: 400,
      filterable: false,
      sortable: false,
      renderCell: (params) => (
        <>
          <Button
            size="small"
            variant="contained"
            disabled={!!actionLoading[params.row.runId] || params.row.cleanupButtonClicked}
            onClick={async () => {
              const runId = params.row.runId;
              const ok = window.confirm(`Are you sure you want to cleanup Reduced/Renamer folders for runId=${runId}?`);
              if (!ok) return;
              try {
                setActionLoading((m) => ({ ...m, [runId]: true }));
                const res = await makePostCall({ profile: cleanupTOFolder }, `ai/cleanupRedRenamerFilers/${runId}`);
                console.log('Trigger response:', JSON.stringify(res));
                setResultTitle(`Cleanup triggered for runId=${runId}`);
                setResultBody(res);
                setResultOpen(true);
              } catch (e) {
                console.error(e);
                setResultTitle('Cleanup error');
                setResultBody({ error: e instanceof Error ? e.message : 'Unknown error' });
                setResultOpen(true);
              } finally {
                setActionLoading((m) => ({ ...m, [runId]: false }));
              }
            }}
          >
            {actionLoading[params.row.runId] ? (
              <>
                <CircularProgress size={16} color="inherit" style={{ marginRight: 6 }} />
                Running...
              </>
            ) : (
              'Cleanup'
            )}
          </Button>
          <TextField
            size="small"
            variant="outlined"
            placeholder="Cleanup TO Folder"
            value={cleanupTOFolder}
            onChange={(e) => setCleanupTOFolder(e.target.value)}
            sx={{ ml: 1, minWidth: 200 }}
          />
          <Tooltip title="Use Folder/Profile for sub-folder under Profile use %PROFILE%/subFolder" arrow>
            <IconButton size="small" sx={{ ml: 0.5 }}>
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  // Define columns for the detail view DataGrid
  const detailColumns: GridColDef[] = [

    {
      field: 'fileName',
      headerName: 'File Name',
      width: 200,
      filterable: true,
    },
    {
      field: 'extractedMetadata',
      headerName: 'Extracted Metadata',
      width: 400,
      filterable: true,
      renderCell: (params) => (
        <div className="flex items-center">
          <IconButton onClick={() => handleCopyText(params.value)} className="ml-2">
            <FaCopy />
          </IconButton>
          <span>{params.value}</span>
        </div>
      ),
    },
    {
      field: 'batchIndex',
      headerName: 'Batch',
      width: 70,
      filterable: true,
    },
    {
      field: 'indexInBatch',
      headerName: 'Index',
      width: 70,
      filterable: true,
    },
    {
      field: 'originalFilePath',
      headerName: 'Original Path',
      width: 250,
      filterable: true,
      renderCell: (params) => (
        <div className="flex items-center">
          <IconButton onClick={() => handleCopyText(params.value)} className="ml-2">
            <FaCopy />
          </IconButton>
          <span>{params.value}</span>
        </div>
      ),
    },
    {
      field: 'reducedFilePath',
      headerName: 'Reduced Path',
      width: 250,
      filterable: true,
      renderCell: (params) => (
        <div className="flex items-center">
          <IconButton onClick={() => handleCopyText(params.value)} className="ml-2">
            <FaCopy />
          </IconButton>
          <span>{params.value}</span>
        </div>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 200,
      filterable: true,
      renderCell: (params) => {
        return new Date(params.row.createdAt).toLocaleString()
      }
    },
  ];

  return (
    <div className="h-[1200px] w-full">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" component="h2">
          AI PDF Title Renamer History
        </Typography>
      </Box>

      {/* Error message display */}
      {error && (
        <Box sx={{ mb: 2, p: 1, bgcolor: '#ffebee', borderRadius: 1 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      {/* Main DataGrid showing grouped data by runId */}
      <div className="h-[800px] w-full mb-4">
        <DataGrid
          rows={groupedData}
          columns={groupedColumns}
          getRowId={(row) => row._id}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 20]}
          pagination
          paginationMode="server"
          filterMode="server"
          filterModel={filterModel}
          onFilterModelChange={setFilterModel}
          rowCount={totalItems}
          loading={loading}
          slots={{
            toolbar: GridToolbar,
          }}
        />
      </div>

      {/* Dialog for detail view */}
      <Dialog open={openDetailDialog} onClose={() => setOpenDetailDialog(false)} maxWidth="xl" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Details for Run: {selectedRunId}</Typography>
            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                onClick={() => {
                  console.log(`selectedRunId: ${selectedRunId}`);
                }}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                disabled={loading}
              >
                Refresh
              </Button>
              <Button variant="contained" onClick={() => setOpenDetailDialog(false)}>Close</Button>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {/* Error message display in dialog */}
          {error && (
            <Box sx={{ mb: 2, p: 1, bgcolor: '#ffebee', borderRadius: 1 }}>
              <Typography color="error">{error}</Typography>
            </Box>
          )}

          {/* Summary info */}
          {detailData?.length > 0 && (
            <Box sx={{ mb: 2, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="subtitle1">
                Source Folder: {detailData[0].srcFolder}
              </Typography>
              <Typography variant="subtitle1">
                Reduced Folder: {detailData[0].reducedFolder}
              </Typography>
              <Typography variant="subtitle1">
                Output Folder: {detailData[0].outputFolder}
              </Typography>
            </Box>
          )}

          <div className="h-[500px] w-full">
            <DataGrid
              rows={detailData}
              columns={detailColumns}
              getRowId={(row) => row._id + Math.random()}
              paginationModel={detailPaginationModel}
              onPaginationModelChange={setDetailPaginationModel}
              pageSizeOptions={[5, 10, 20]}
              pagination
              paginationMode="server"
              filterMode="server"
              filterModel={detailFilterModel}
              onFilterModelChange={setDetailFilterModel}
              rowCount={totalDetailItems}
              loading={loading}
              slots={{
                toolbar: GridToolbar,
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={resultOpen} onClose={() => setResultOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">{resultTitle || 'Result'}</Typography>
            <Button variant="outlined" onClick={() => setResultOpen(false)}>Close</Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          {resultBody && <ExecResponsePanel response={resultBody} execType={ExecType.AI_RENAMER} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AITitleRenamerHistory;
