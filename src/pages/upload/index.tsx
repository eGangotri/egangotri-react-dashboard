"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { DataGrid, type GridColDef } from "@mui/x-data-grid"
import { Button, Box, Typography, TextField } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import * as XLSX from "xlsx"
import { getUploadStatusData } from "../../service/BackendFetchService"
import { MAX_ITEMS_LISTABLE } from "../../utils/constants"
import { useSearchParams } from "react-router-dom"


const columns: GridColDef[] = [
  { field: "_id", headerName: "ID", width: 150 },
  { field: "archiveProfile", headerName: "Archive Profile", width: 150 },
  { field: "uploadLink", headerName: "Upload Link", width: 300 },
  { field: "localPath", headerName: "Local Path", width: 300 },
  { field: "title", headerName: "Title", width: 300 },
  { field: "uploadCycleId", headerName: "Upload Cycle ID", width: 200 },
  { field: "archiveItemId", headerName: "Archive Item ID", width: 200 },
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
}

const Uploads: React.FC<UploadsType> = ({ forQueues = false }) => {
  const [data, setData] = useState<Item[]>([])
  const [archiveProfileFilter, setArchiveProfileFilter] = useState("")
  const [titleFilter, setTitleFilter] = useState("")
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Manuscripts")
    XLSX.writeFile(workbook, "manuscripts.xlsx")
  }

  const [searchParams] = useSearchParams()

  const fetchMyAPI = async () => {
    const uploadCycleIdParam: string =  searchParams?.get("uploadCycleId") || ""
    const archiveProfileParam: string = searchParams?.get("archiveProfile") || ""

    const uploadStatusData = await getUploadStatusData(MAX_ITEMS_LISTABLE, forQueues, uploadCycleIdParam, archiveProfileParam?.length > 0 ? [archiveProfileParam] : undefined)
    return uploadStatusData?.response
  }

  useEffect(() => {
    ;(async () => {
      const _data = (await fetchMyAPI()) || []
      setData(_data.map((x: Item) => ({ id: x._id, ...x })))
      const uniqueProfiles = Array.from(new Set<string>(_data?.map((x: Item) => x.archiveProfile)))
      console.log(`_data ${_data.length} ${data[0]} uniqueProfiles: ${Array.from(uniqueProfiles)}`)
    })()
  }, []) // Added fetchMyAPI to dependencies

  const handleFilterChange = () => {
    const filteredData = data.filter((row) => {
      const matchesArchiveProfile = archiveProfileFilter ? row.archiveProfile.includes(archiveProfileFilter) : true
      const matchesTitle = titleFilter ? row.title.includes(titleFilter) : true
      const matchesDateRange =
        startDate && endDate ? new Date(row.createdAt) >= startDate && new Date(row.createdAt) <= endDate : true
      return matchesArchiveProfile && matchesTitle && matchesDateRange
    })
    setData(filteredData)
  }

  useEffect(() => {
    handleFilterChange()
  }, [archiveProfileFilter, titleFilter, startDate, endDate, data]) // Added data to dependencies

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ height: 600, width: "100%" }}>
        <Typography variant="h4" gutterBottom>
          Manuscript Listing
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
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
          <DatePicker label="Created At Start" value={startDate} onChange={(newValue) => setStartDate(newValue)} />
          <DatePicker label="Created At End" value={endDate} onChange={(newValue) => setEndDate(newValue)} />
          <Button variant="contained" color="primary" onClick={downloadExcel}>
            Download Excel
          </Button>
        </Box>
        <DataGrid
          rows={data}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 20, 50]}
          checkboxSelection
        />
      </Box>
    </LocalizationProvider>
  )
}

export default Uploads

