import type React from "react"
import { useState, useEffect } from "react"
import {
    DataGrid,
    type GridColDef,
    type GridPaginationModel,
    type GridFilterModel,
    GridToolbar,
} from "@mui/x-data-grid"
import { Button, Dialog, DialogTitle, DialogContent, Chip, IconButton } from "@mui/material"
import { makeGetCall } from "service/BackendFetchService"
import { FaCopy } from "react-icons/fa";

// Types
interface ICompositeDocument {
    id: string
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

    const [openMsgDialog, setOpenMsgDialog] = useState(false)
    const [selectedMsg, setSelectedMsg] = useState("")

    const [filesPaginationModel, setFilesPaginationModel] = useState<GridPaginationModel>({
        page: 0,
        pageSize: 5,
    })

    const fetchGDriveDownloads = async (page: number, pageSize: number): Promise<FetchResponse> => {
        const response = await makeGetCall(`gDriveDownloadRoute/getGDriveDownloads?page=${page}&limit=${pageSize}`)
        console.log(`resp from fetchAggregates: ${JSON.stringify(response)}`)
        return response
    }

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
    }, [paginationModel.page, paginationModel.pageSize]) // Added fetchGDriveDownloads to dependencies

    const handleOpenFiles = (files: ICompositeDocument[]) => {
        setSelectedFiles(files.map((file, index) => ({ ...file, id: index.toString() })))
        setOpenDialog(true)
    }

    const handleOpenMsg = (msg: string) => {
        setSelectedMsg(msg)
        setOpenMsgDialog(true)
    }
    const handleCopyLink = (link: string) => {
        navigator.clipboard.writeText(link);
        alert("Link copied to clipboard!");
      };
    const columns: GridColDef[] = [
        {
            field: "googleDriveLink",
            headerName: "Google Drive Link",
            width: 150,
            filterable: true,
            renderCell: (params) => (
                <div className="flex items-center">
                    <IconButton onClick={() => handleCopyLink(params.value)} className="ml-2">
                        <FaCopy />
                    </IconButton>
                    <a href={params.value} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                        {params.value}
                    </a>
                </div>
            ),
        },
        { field: "profileNameOrAbsPath", headerName: "Profile/Path", width:150 , filterable: true },
        { field: "fileDumpFolder", headerName: "Dump Folder", width: 250, filterable: true },
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

    const fileColumns: GridColDef[] = [
        { field: "fileName", headerName: "File Name", width: 200, filterable: true },
        { field: "filePath", headerName: "File Path", width: 300, filterable: true },
        {
            field: "status",
            headerName: "Status",
            width: 120,
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
        { field: "msg", headerName: "Message", width: 200, filterable: true },
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
                slots={{
                    toolbar: GridToolbar,
                }}
                getRowClassName={(params) => {
                    const { success_count = 0, totalPdfsToDownload = 0 } = params.row.quickStatus || {}
                    if (success_count === 0 && totalPdfsToDownload === 0) return "bg-yellow-100"
                    return success_count === totalPdfsToDownload ? "bg-green-100" : "bg-red-100"
                }}
            />
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Files</DialogTitle>
                <DialogContent>
                    <div className="h-[400px] w-full">
                        <DataGrid
                            rows={selectedFiles}
                            columns={fileColumns}
                            paginationModel={filesPaginationModel}
                            onPaginationModelChange={setFilesPaginationModel}
                            pageSizeOptions={[5, 10, 20]}
                            pagination
                            slots={{
                                toolbar: GridToolbar,
                            }}
                        />
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog open={openMsgDialog} onClose={() => setOpenMsgDialog(false)}>
                <DialogTitle>Message</DialogTitle>
                <DialogContent className="max-h-96 overflow-y-auto">
                    {selectedMsg.split(",").map((line, index) => (
                        <p key={index}>{index + 1}). {line.trim()}</p>
                    ))}
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default GDriveDownloadListing

