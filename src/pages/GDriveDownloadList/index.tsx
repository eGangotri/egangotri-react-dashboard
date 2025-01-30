import type React from "react"
import { useState, useEffect } from "react"
import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
  type GridFilterModel,
  GridToolbar,
} from "@mui/x-data-grid"
import { Button, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, Chip } from "@mui/material"
import { makeGetCall } from "service/BackendFetchService"

// Types
interface ICompositeDocument {
  fileName: string
  filePath: string
  status: "queued" | "in-progress" | "completed" | "failed"
  msg: string
}

export interface QuickStatus {
  status?: string
  success_count?: number | string
  error_count?: number | string
  dl_wrong_size_count?: string
  totalPdfsToDownload?: number | string
  error?: string
}

interface IGDriveDownload {
  _id: string
  status: "queued" | "in-progress" | "completed" | "failed"
  createdAt: Date
  updatedAt: Date
  msg: string
  googleDriveLink: string
  profileNameOrAbsPath: string
  fileDumpFolder: string
  downloadType: string
  files: ICompositeDocument[]
  quickStatus: QuickStatus
}

interface FetchResponse {
  data: IGDriveDownload[]
  totalItems: number
}

const GDriveDownloadListing: React.FC = () => {
  const [downloads, setDownloads] = useState<IGDriveDownload[]>([])
  const [selectedFiles, setSelectedFiles] = useState<ICompositeDocument[]>([])
  const [openDialog, setOpenDialog] = useState(false)
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  })
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
  })
  const [totalItems, setTotalItems] = useState(0)

  const fetchGDriveDownloads = async (page: number, pageSize: number): Promise<{ data: any[]; totalItems: number }> => {
    const response = await makeGetCall(`gDriveDownloadRoute/getGDriveDownloads?page=${page}&limit=${pageSize}`)
    console.log(`resp from fetchAggregates: ${JSON.stringify(response)}`)
    return response
  }

  const [openMsgDialog, setOpenMsgDialog] = useState(false)
  const [selectedMsg, setSelectedMsg] = useState("")

  useEffect(() => {
    const loadDownloads = async () => {
      try {
        const { data, totalItems } = await fetchGDriveDownloads(paginationModel.page + 1, paginationModel.pageSize)
        setDownloads(data)
        setTotalItems(totalItems)
      } catch (error) {
        console.error("Error fetching GDrive downloads:", error)
      }
    }
    loadDownloads()
  }, [paginationModel.page, paginationModel.pageSize])

  const handleOpenFiles = (files: ICompositeDocument[]) => {
    setSelectedFiles(files)
    setOpenDialog(true)
  }

  const handleOpenMsg = (msg: string) => {
    setSelectedMsg(msg)
    setOpenMsgDialog(true)
  }

  const columns: GridColDef[] = [
    { field: "googleDriveLink", headerName: "Google Drive Link", width: 150, filterable: true },
    { field: "profileNameOrAbsPath", headerName: "Profile/Path", width: 150, filterable: true },
    { field: "fileDumpFolder", headerName: "Dump Folder", width: 150, filterable: true },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      filterable: true,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === "completed"
              ? "success"
              : params.value === "failed"
                ? "error"
                : params.value === "in-progress"
                  ? "warning"
                  : "default"
          }
        />
      ),
    },
    {
      field: "msg",
      headerName: "Msg",
      width: 100,
      filterable: true,
      renderCell: (params) => (
        <Button variant="contained" onClick={() => handleOpenMsg(params.value)}>
          View Msg
        </Button>
      ),
    },
    {
      field: "files",
      headerName: "Files",
      width: 120,
      filterable: false,
      renderCell: (params) => (
        <Button variant="contained" onClick={() => handleOpenFiles(params.value)}>
          View Files ({params.value.length})
        </Button>
      ),
    },
    {
      field: "quickStatus",
      headerName: "Quick Status(Success-Count/ErrorCount/Total)",
      width: 300,
      filterable: false,
      renderCell: (params) => {
        const { success_count = 0, error_count = 0, totalPdfsToDownload = 0 } = params.value || {}
        return (
          <div>
            {success_count}/<span className="text-red-500">{error_count}</span>/{totalPdfsToDownload}
          </div>
        )
      },
    },
    {
      field: "downloadType",
      headerName: "Type",
      width: 50,
      filterable: true,
      valueFormatter: (params) => params.value.toString().toUpperCase(),
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 200,
      filterable: true,
      valueFormatter: (params) => new Date(params.value).toLocaleString(),
    },
  ]

  return (
    <div className="h-[400px] w-full">
      <DataGrid
        rows={downloads}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 20]}
        pagination
        paginationMode="server"
        filterMode="server"
        filterModel={filterModel}
        onFilterModelChange={setFilterModel}
        rowCount={totalItems}
        getRowId={(row) => row._id}
        components={{
          Toolbar: GridToolbar,
        }}
        getRowClassName={(params) => {
          const { success_count = 0, totalPdfsToDownload = 0 } = params.row.quickStatus || {}
          if(success_count === 0 && totalPdfsToDownload === 0) return "bg-yellow-100"
          return success_count === totalPdfsToDownload ? "bg-green-100" : "bg-red-100"
        }}
      />
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Files</DialogTitle>
        <DialogContent>
          <List>
            {selectedFiles.map((file, index) => (
              <ListItem key={index}>
                <ListItemText primary={file.fileName} secondary={`Status: ${file.status} | Path: ${file.filePath}`} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
      <Dialog open={openMsgDialog} onClose={() => setOpenMsgDialog(false)}>
        <DialogTitle>Message</DialogTitle>
        <DialogContent>
          {selectedMsg.split(",").map((line, index) => (
            <p key={index}>{line.trim()}</p>
          ))}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default GDriveDownloadListing

