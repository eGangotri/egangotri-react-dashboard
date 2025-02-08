import React, { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Button, Box, Typography } from '@mui/material';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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

const rows = [
  {
    _id: "67a48ae532bd5668b43eefd5",
    archiveProfile: "PZ",
    uploadLink: "https://archive.org/upload?description=Peerzada%20Muhammad%20Ashraf%20Collection,%20Srinagar\nFilename: 'Manuscript 34 - Saundarya Lahari (Shankaracharya), Rudra Mantras, Bhagavad Gita and others Sharada Manuscript - Mohd. Ashraf Peerzada Collection - Mohd Ashraf Peerzada Collection'&subject=Peerzada Muhammad Ashraf Collection, Srinagar, Funded-By-IKS-MoE,IKS-Peerzada&creator=eGangotri",
    localPath: "F:\\_Treasures78\\_data\\iks\\pz\\_vanitized\\Manuscript 34 - Saundarya Lahari (Shankaracharya), Rudra Mantras, Bhagavad Gita and others Sharada Manuscript - Mohd. Ashraf Peerzada Collection - Mohd Ashraf Peerzada Collection.pdf",
    title: "Manuscript 34 - Saundarya Lahari (Shankaracharya), Rudra Mantras, Bhagavad Gita and others Sharada Manuscript - Mohd. Ashraf Peerzada Collection - Mohd Ashraf Peerzada Collection",
    uploadCycleId: "2e3a28cb-9ea1-4538-af81-6aed993372a3",
    archiveItemId: "uwod_manuscript-34-saundarya-lahari-shankaracharya-rudra-mantras-bhagavad-gita-and-ot",
    csvName: "X",
    uploadFlag: true,
    datetimeUploadStarted: "2025-02-06T10:11:49.471Z",
    createdAt: "2025-02-06T10:11:49.472Z",
    updatedAt: "2025-02-06T17:12:21.729Z",
    __v: 0
  },
  // Add other manuscript objects here...
];

const Uploads: React.FC = () => {
  const [data, setData] = useState(rows);

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Manuscripts');
    XLSX.writeFile(workbook, 'manuscripts.xlsx');
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [columns.map(col => col.headerName)],
      body: data.map(row => columns.map(col => row[col.field])),
    });
    doc.save('manuscripts.pdf');
  };

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Manuscript Listing
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button variant="contained" color="primary" onClick={downloadExcel}>
          Download Excel
        </Button>
        <Button variant="contained" color="secondary" onClick={downloadPDF}>
          Download PDF
        </Button>
      </Box>
      <DataGrid rows={data} columns={columns} pagination pageSizeOptions={[10, 20, 50]} />
    </Box>
  );
};

export default Uploads;