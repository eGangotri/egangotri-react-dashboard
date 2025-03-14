import type React from "react"
import { useEffect, useState, useCallback } from "react"
import { DataGrid, type GridColDef } from "@mui/x-data-grid"
import { useGridApiRef } from "@mui/x-data-grid"
import { Button, Box, Typography, TextField, Grid, Alert } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import * as XLSX from "xlsx"
import { getUploadStatusData, verifyUploadStatus } from "../../service/BackendFetchService"
import { MAX_ITEMS_LISTABLE } from "../../utils/constants"
import { useSearchParams } from "react-router-dom"
import ItemToolTip from "widgets/ItemTooltip"
import { createArchiveLink } from "mirror"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import InfoIconWithTooltip from "widgets/InfoIconWithTooltip"
import moment from "moment"
import { DD_MM_YYYY_WITH_TIME_FORMAT } from "utils/utils"

interface SelectedUploadItem {
  id: string
  archiveId: string
  isValid?: boolean
}

interface VerificationResult {
  successCount: number
  failureCount: number
  status: string
  note: string
  failures: any[]
}
interface VerificationResponse {
  response: VerificationResult
}
const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 40 },
  {
    field: "uploadCycleId",
    headerName: "Upload Cycle ID",
    width: 100,
    renderCell: (params) => <ItemToolTip input={params.value} url={false} />,
  },
  { field: "archiveProfile", headerName: "Archive Profile", width: 150 },

  {
    field: "archiveItemId",
    headerName: "Archive Url",
    width: 200,
    renderCell: (params) => <ItemToolTip input={createArchiveLink(params.value)} url={true} />,
  },

  {
    field: "uploadLink",
    headerName: "Upload Link",
    width: 300,
    renderCell: (params) => <ItemToolTip input={params.value} url={true} />,
  },

  {
    field: "localPath",
    headerName: "Local Path",
    width: 300,
    renderCell: (params) => <ItemToolTip input={params.value} url={false} />,
  },
  { field: "title", headerName: "Title", width: 300 },
  { field: "csvName", headerName: "CSV Name", width: 100 },
  { field: "uploadFlag", headerName: "Upload Flag", width: 100, type: "boolean" },
  { field: "datetimeUploadStarted", headerName: "Upload Started", width: 200 },
  { field: "createdAt", headerName: "Created At", width: 200 },
  { field: "updatedAt", headerName: "Updated At", width: 200 },
]

interface UploadsType {
  forQueues: boolean
}

interface Item {
  id: string
  _id: string
  archiveProfile: string
  uploadLink: string
  localPath: string
  title: string
  uploadCycleId: string
  archiveItemId: string
  csvName: string
  uploadFlag: boolean
  datetimeUploadStarted: string
  createdAt: string
  updatedAt: string
  isValid?: boolean
}

const Uploads: React.FC<UploadsType> = ({ forQueues = false }) => {
  const [data, setData] = useState<Item[]>([])
  const [filteredData, setFilteredData] = useState<Item[]>([])
  const [archiveProfileFilter, setArchiveProfileFilter] = useState("")
  const [titleFilter, setTitleFilter] = useState("")
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [shareableText, setShareableText] = useState("")
  const [verificationResults, setVerificationResults] = useState<VerificationResult>()
  const [selectedRowCount, setSelectedRowCount] = useState(0) // Added state for selected row count

  const gridApiRef = useGridApiRef()

  const [searchParams] = useSearchParams()

  const downloadExcel = () => {
    const selectedRowIds = gridApiRef.current?.getSelectedRows()
    const selectedItems = filteredData.filter(item => selectedRowIds?.has(item.id))
    const dataToExport = selectedItems.length > 0 ? selectedItems : filteredData
    const worksheet = XLSX.utils.json_to_sheet(dataToExport)
    const workbook = XLSX.utils.book_new()
    const timeComponent = moment(new Date()).format(DD_MM_YYYY_WITH_TIME_FORMAT);
    const fileName = `uploadListing-${timeComponent}.xlsx`
    XLSX.utils.book_append_sheet(workbook, worksheet, "Archive-Upload-Listing")
    XLSX.writeFile(workbook, fileName);
  }

  const fetchMyAPI = useCallback(async () => {
    const uploadCycleIdParam: string = searchParams.get("uploadCycleId") || ""
    const archiveProfileParam: string = searchParams.get("archiveProfile") || ""

    const uploadStatusData = await getUploadStatusData(
      MAX_ITEMS_LISTABLE,
      forQueues,
      uploadCycleIdParam,
      archiveProfileParam?.length > 0 ? [archiveProfileParam] : undefined,
    )
    return uploadStatusData?.response
  }, [searchParams, forQueues])

  useEffect(() => {
    ; (async () => {
      const _data = (await fetchMyAPI()) || []
      const formattedData = _data.map((x: any) => ({ id: x._id, ...x }))
      setData(formattedData)
      setFilteredData(formattedData)
      const uniqueProfiles = Array.from(new Set<string>(_data?.map((x: Item) => x.archiveProfile)))
      console.log(`_data ${_data.length} ${formattedData[0]} uniqueProfiles: ${Array.from(uniqueProfiles)}`)
    })()
  }, [fetchMyAPI])

  const handleFilterChangeO = useCallback(() => {
    const filtered = data.filter((row) => {
      const matchesArchiveProfile = archiveProfileFilter ? row.archiveProfile.includes(archiveProfileFilter) : true
      const matchesTitle = titleFilter ? row.title.includes(titleFilter) : true
      const matchesDateRange =
        startDate && endDate ? new Date(row.createdAt) >= startDate && new Date(row.createdAt) <= endDate : true
      return matchesArchiveProfile && matchesTitle && matchesDateRange
    })
    setFilteredData(filtered)
  }, [data, archiveProfileFilter, titleFilter, startDate, endDate])


  const matchesFilter = (row: Item) => {
    const matchesArchiveProfile = archiveProfileFilter ? row.archiveProfile.toLowerCase().includes(archiveProfileFilter.toLowerCase()) : true
    const matchesTitle = titleFilter ? row.title.toLowerCase().includes(titleFilter.toLowerCase()) : true

    const matchesDateRange =
      startDate && endDate ? new Date(row.createdAt) >= startDate && new Date(row.createdAt) <= endDate : true
    return matchesArchiveProfile && matchesTitle && matchesDateRange
  }

  const handleFilterChange = useCallback(() => {
    const filtered = data.filter(matchesFilter)
    setFilteredData(filtered)
  }, [data, archiveProfileFilter, titleFilter, startDate, endDate])


  useEffect(() => {
    handleFilterChange()
  }, [handleFilterChange])

  const handleReset = () => {
    setArchiveProfileFilter("")
    setTitleFilter("")
    setStartDate(null)
    setEndDate(null)
    setFilteredData(data)
    setVerificationResults(undefined)
    gridApiRef.current?.setRowSelectionModel([])
    setSelectedRowCount(0) // Reset selected row count
  }

  const formatShareableData = (textData: Item[]) => {
    const formattedResult = textData.map((item: Item, index: number) => {
      const _row = `(${index + 1}).${item.title}\n\n${createArchiveLink(item.archiveItemId)}`.toString();
      return _row;
    });
    console.log(`formattedResult: ${formattedResult.join("\n\n")}`);
    return formattedResult.join("\n\n");
  }
  const handleShareableText = () => {
    const selectedRowIds = gridApiRef.current?.getSelectedRows()
    const selectedItems = filteredData.filter(item => selectedRowIds?.has(item.id))
    const textData: Item[] = selectedItems.length > 0 ? selectedItems : filteredData;
    const textDataFormatted = formatShareableData(textData);
    setShareableText(textDataFormatted)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const handleCopyText = () => {
    navigator.clipboard.writeText(shareableText)
    handleCloseDialog()
  }

  const highlightRow = (item: Item) => {
    if ("uploadFlag" in item && item?.uploadFlag === false) {
      return "bg-red-600 text-black"
    } else if (item?.uploadFlag === null) {
      return "bg-yellow-600 text-black"
    } else {
      return "bg-green-600 text-black"
    }
  }

  const handleVerifyUploadStatus = async () => {
    const selectedRowIds = gridApiRef.current?.getSelectedRows()
    const selectedItems = filteredData.filter(item => selectedRowIds?.has(item.id))
    const rowsToVerify: Item[] = selectedItems.length > 0 ? selectedItems : filteredData
    const selectedUploadItems: SelectedUploadItem[] = rowsToVerify?.map((row: Item) => ({
      id: row.id,
      archiveId: row.archiveItemId,
      isValid: row.isValid,
    })) 
    const result = await verifyUploadStatus(selectedUploadItems)
    setVerificationResults(result)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ height: 600, width: "100%" }}>
        <Typography variant="h4" gutterBottom>
         Scanned Material Listing
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Archive Profile"
              value={archiveProfileFilter}
              onChange={(e) => setArchiveProfileFilter(e.target.value)}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Title"
              value={titleFilter}
              onChange={(e) => setTitleFilter(e.target.value)}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DatePicker
              label="Created At Start"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DatePicker
              label="Created At End"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Button variant="contained" color="secondary" onClick={handleReset} sx={{ mr: 2 }}>
            Reset
          </Button>
          <Button variant="contained" color="primary" onClick={handleShareableText} sx={{ mr: 2 }}>
            Shareable Text ({selectedRowCount || filteredData.length})
          </Button>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
            <Button variant="contained" color="primary" onClick={handleVerifyUploadStatus} sx={{ mr: 2 }}>
              Verify Upload Status ({selectedRowCount || filteredData.length})
            </Button>
            <InfoIconWithTooltip input="It will mark uploadFlag in DB permanently" />
          </Box>
          <Button variant="contained" color="primary" onClick={downloadExcel}>
            Download Excel ({selectedRowCount || filteredData.length})
          </Button>
        </Box>
        <Box>
          <Typography>
            <span className="text-black-500">White implies never checked.</span>
            <span className="text-yellow-500">Yellow implies never uploaded.</span>
            <span className="text-green-600">Green implies Verfied-Uploaded.</span>
            <span className="text-red-600">Red implies Upload Attempt Failed</span>
          </Typography>
        </Box>
        <Box>
          {verificationResults && (
            <>
              <Alert severity={verificationResults?.failureCount === 0 ? "success" : "error"} sx={{ mt: 2, mb: 2 }}>
                Verification Results: {verificationResults?.successCount} success, {verificationResults?.failureCount}{" "}
                failure
                {verificationResults?.failures?.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6">Failures</Typography>
                    <ul>
                      {verificationResults?.failures?.map((failure, index) => (
                        <li key={index}>{failure}</li>
                      ))}
                    </ul>
                  </Box>
                )}
                <Box>{verificationResults?.status}</Box>
                <Box>{verificationResults?.note}</Box>
              </Alert>
            </>
          )}
        </Box>
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={filteredData}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[10, 20, 50]}
            checkboxSelection
            getRowClassName={(params) => highlightRow(params.row)}
            apiRef={gridApiRef}
            onRowSelectionModelChange={(newSelectionModel) => {
              setSelectedRowCount(newSelectionModel.length)
            }}
          />
        </Box>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Shareable Text</DialogTitle>
          <DialogContent>
            <TextField
              multiline
              fullWidth
              rows={10}
              value={shareableText}
              variant="outlined"
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Close
            </Button>
            <Button onClick={handleCopyText} color="primary">
              Copy
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  )
}

export default Uploads
