import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Button, Box, Typography, TextField } from '@mui/material';
import { DateRangePicker } from '@mui/lab';
import * as XLSX from 'xlsx';
import { useSearchParams } from 'react-router-dom';
import { getUploadStatusData } from 'service/BackendFetchService';
import { MAX_ITEMS_LISTABLE } from 'utils/constants';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

const columns: GridColDef[] = [
  { field: '_id', headerName: 'ID', width: 150 },
  { field: 'archiveProfile', headerName: 'Archive Profile', width: 150 },
  { field: 'uploadLink', headerName: 'Upload Link', width: 300 },
  { field: 'localPath', headerName: 'Local Path', width: 300 },
  { field: 'title', headerName: 'Title', width: 300 },
  { field: 'uploadCycleId', headerName: 'Upload Cycle ID', width: 200 },
  { field: 'archiveItemId', headerName: 'Archive Item ID', width: 200 },
  { field: 'csvName', headerName: 'CSV Name', width: 100 },
  { field: 'uploadFlag', headerName: 'Upload Flag', width: 100, type: 'boolean' },
  { field: 'datetimeUploadStarted', headerName: 'Upload Started', width: 200 },
  { field: 'createdAt', headerName: 'Created At', width: 200 },
  { field: 'updatedAt', headerName: 'Updated At', width: 200 },
];

interface UploadsType {
  forQueues: boolean
}

const Uploads: React.FC<UploadsType> = ({ forQueues = false }) => {
  const [data, setData] = useState<Item[]>([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [archiveProfileFilter, setArchiveProfileFilter] = useState('');
  const [titleFilter, setTitleFilter] = useState('');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Manuscripts');
    XLSX.writeFile(workbook, 'manuscripts.xlsx');
  };

  const [searchParams, _] = useSearchParams();

  const fetchMyAPI = async () => {
    const uploadCycleIdParam: string = searchParams.get('uploadCycleId') || "";
    const archiveProfileParam: string = searchParams?.get('archiveProfile') || "";

    const uploadStatusData: ItemListResponseType = await getUploadStatusData(MAX_ITEMS_LISTABLE,
      forQueues,
      uploadCycleIdParam
    );
    return uploadStatusData?.response;
  };

  useEffect(() => {
    (async () => {
      const _data = await fetchMyAPI() || [];
      setData(_data.map(x => ({ id: x._id, ...x })));
      const uniqueProfiles = Array.from(new Set<string>(_data?.map(x => x.archiveProfile)));
      console.log(`uniqueProfiles: ${Array.from(uniqueProfiles)}`)
    })();
  }, []);

  const handleFilterChange = () => {
    const filteredData = rows2.filter(row => {
      const matchesArchiveProfile = archiveProfileFilter ? row.archiveProfile.includes(archiveProfileFilter) : true;
      const matchesTitle = titleFilter ? row.title.includes(titleFilter) : true;
      const matchesDateRange = dateRange[0] && dateRange[1] ? 
        new Date(row.createdAt) >= dateRange[0] && new Date(row.createdAt) <= dateRange[1] : true;
      return matchesArchiveProfile && matchesTitle && matchesDateRange;
    });
    setData(filteredData);
  };

  useEffect(() => {
    handleFilterChange();
  }, [archiveProfileFilter, titleFilter, dateRange]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ height: 600, width: '100%' }}>
        <Typography variant="h4" gutterBottom>
          Manuscript Listing
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <TextField
            label="Archive Profile"
            value={archiveProfileFilter}
            onChange={(e) => setArchiveProfileFilter(e.target.value)}
            variant="outlined"
            sx={{ mr: 2 }}
          />
          <TextField
            label="Title"
            value={titleFilter}
            onChange={(e) => setTitleFilter(e.target.value)}
            variant="outlined"
            sx={{ mr: 2 }}
          />
          <DateRangePicker
            startText="Created At Start"
            endText="Created At End"
            value={dateRange}
            onChange={(newValue) => setDateRange(newValue)}
            renderInput={(startProps, endProps) => (
              <>
                <TextField {...startProps} variant="outlined" sx={{ mr: 2 }} />
                <TextField {...endProps} variant="outlined" />
              </>
            )}
          />
          <Button variant="contained" color="primary" onClick={downloadExcel}>
            Download Excel
          </Button>
        </Box>
        <DataGrid rows={data} columns={columns} pagination
          pageSizeOptions={[10, 20, 50]}
          checkboxSelection
        />
      </Box>
    </LocalizationProvider>
  );
};

export default Uploads;