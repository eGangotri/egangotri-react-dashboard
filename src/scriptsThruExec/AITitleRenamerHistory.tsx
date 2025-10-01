import React, { useState, useEffect } from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import { ExecType } from './ExecLauncherUtil';
import { Button, Dialog, DialogTitle, DialogContent, Chip, IconButton, Typography, CircularProgress } from '@mui/material';
import { AI_RENAMER_ABS_PATH_LOCAL_STORAGE_KEY, AI_RENAMER_REDUCED_PATH_LOCAL_STORAGE_KEY, AI_RENAMER_RENAMER_PATH_LOCAL_STORAGE_KEY } from 'service/consts';
import { DataGrid, GridColDef, GridFilterModel, GridPaginationModel, GridToolbar } from '@mui/x-data-grid';
import { makeGetCall } from 'service/ApiInterceptor';
import { FaCopy } from 'react-icons/fa';
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
      const response = await fetchRunDetails(selectedRunId, detailPaginationModel.page + 1, detailPaginationModel.pageSize)
      setDetailData(response.data)
      setTotalDetailItems(response.totalItems)
    }
    loadRunDetails();
  }, [selectedRunId])
  //, detailPaginationModel.page, detailPaginationModel.pageSize

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

  // Define columns for the grouped data DataGrid
  const groupedColumns: GridColDef[] = [
    {
      field: 'runId',
      headerName: 'Run ID',
      width: 300,
      filterable: true,
      renderCell: (params) => (
        <div className="flex items-center">
          <IconButton onClick={() => handleCopyText(params.value)} className="ml-2">
            <FaCopy />
          </IconButton>
          <Button onClick={() => handleOpenDetails(params.value)} variant="text" color="primary">
            {params.value}
          </Button>
        </div>
      ),
    },
    {
      field: 'commonRunId',
      headerName: 'Common Run Id',
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
    <div className="h-[600px] w-full">
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
      <div className="h-[400px] w-full mb-4">
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
          {detailData.length > 0 && (
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
    </div>
  );
}

export default AITitleRenamerHistory;
