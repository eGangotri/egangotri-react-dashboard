import React, { ChangeEvent } from "react"
import { useState, useEffect } from "react"
import {
    DataGrid,
    type GridColDef,
    type GridPaginationModel,
    type GridFilterModel,
    GridToolbar,
} from "@mui/x-data-grid"
import { Button, Dialog, DialogTitle, DialogContent, Chip, IconButton, Box, RadioGroup, FormControlLabel, Typography, Radio, CircularProgress } from "@mui/material"
import { makeGetCall } from 'service/ApiInterceptor';
import { FaCopy } from "react-icons/fa";
import ExecComponent from "scriptsThruExec/ExecComponent";
import { ExecType } from "scriptsThruExec/ExecLauncherUtil";
import { verifyGDriveDwnldSuccessFolders } from "service/launchYarn";

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
    
    const [gDriveFileType, setGDriveFileType] = React.useState<number>(ExecType.DWNLD_PDFS_ONLY_FROM_GOOGLE_DRIVE);
    const [label, setLabel] = React.useState<string>("");
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

    const [apiResult, setApiResult] = useState<any>(null)
    const [apiLoading, setApiLoading] = useState(false)
    const [openApiResultDialog, setOpenApiResultDialog] = useState(false)
    const [apiError, setApiError] = useState<string | null>(null)

    const [filesPaginationModel, setFilesPaginationModel] = useState<GridPaginationModel>({
        page: 0,
        pageSize: 5,
    })

    const chooseGDriveFileType = (event: ChangeEvent<HTMLInputElement>) => {
        const _val = event.target.value;
        console.log("_val", _val)
        let _dwnldFileType;
        switch (Number(_val)) {
            case ExecType.DWNLD_PDFS_ONLY_FROM_GOOGLE_DRIVE:
                _dwnldFileType = ExecType.DWNLD_PDFS_ONLY_FROM_GOOGLE_DRIVE;
                break;
            case ExecType.DWNLD_ZIPS_ONLY_FROM_GOOGLE_DRIVE:
                _dwnldFileType = ExecType.DWNLD_ZIPS_ONLY_FROM_GOOGLE_DRIVE;
                break;
            case ExecType.DWNLD_ALL_FROM_GOOGLE_DRIVE:
                _dwnldFileType = ExecType.DWNLD_ALL_FROM_GOOGLE_DRIVE;
                break;
        }
        console.log("_dwnldFileType", _dwnldFileType);
        setGDriveFileType(_dwnldFileType || ExecType.DWNLD_PDFS_ONLY_FROM_GOOGLE_DRIVE);
        if (_dwnldFileType === ExecType.DWNLD_PDFS_ONLY_FROM_GOOGLE_DRIVE) {
            setLabel("PDFs");
        } else if (_dwnldFileType === ExecType.DWNLD_ZIPS_ONLY_FROM_GOOGLE_DRIVE) {
            setLabel("Zips");
        } else if (_dwnldFileType === ExecType.DWNLD_ALL_FROM_GOOGLE_DRIVE) {
            setLabel("All");
        }
    };
    const fetchGDriveDownloads = async (page: number, pageSize: number): Promise<FetchResponse> => {
        const response = await makeGetCall(`gDriveDownloadRoute/getGDriveDownloads?page=${page}&limit=${pageSize}`)
        console.log(`resp from fetchAggregates: ${JSON.stringify(response)}`)
        return response
    }

    useEffect(() => {
        const loadDownloads = async () => {
            try {
                const { data, totalItems } = await fetchGDriveDownloads(paginationModel.page + 1, paginationModel.pageSize)
                if (data) {
                    setDownloads(data)
                    setTotalItems(totalItems)
                }
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

    const handleApiCall = async (googleDriveLink: string, profileNameOrAbsPath: string, downloadType:string) => {
        setApiLoading(true)
        setApiError(null)
        try {
            const response = await verifyGDriveDwnldSuccessFolders(googleDriveLink, profileNameOrAbsPath, downloadType);
            setApiResult(response)
            setOpenApiResultDialog(true)
        } catch (error) {
            console.error("Error calling API:", error)
            setApiError(error instanceof Error ? error.message : "Unknown error occurred")
            setApiResult(null)
            setOpenApiResultDialog(true)
        } finally {
            setApiLoading(false)
        }
    }

    const handleCopyLink = (link: string) => {
        navigator.clipboard.writeText(link);
    };
    const columns: GridColDef[] = [
        {
            field: "googleDriveLink",
            headerName: "Google Drive Link",
            width: 200,
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
        { field: "profileNameOrAbsPath", headerName: "Profile/Path", width: 150, filterable: true },
        
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
            width: 150,
            filterable: true,
            renderCell: (params) => (
                <Button variant="contained" onClick={() => handleOpenMsg(params.value)}>
                    View Msg ({params?.value?.split(",").length})
                </Button>
            ),
        },
        {
            field: "files",
            headerName: "Files",
            width: 150,
            filterable: false,
            renderCell: (params) => (
                <Button variant="contained" onClick={() => handleOpenFiles(params.value)}>
                    View Files ({params.value.length})
                </Button>
            ),
        },
        {
            field: "apiCall",
            headerName: "API Action",
            width: 150,
            filterable: false,
            renderCell: (params) => (
                <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => handleApiCall(params.row.googleDriveLink, 
                        params.row.profileNameOrAbsPath,
                    params.row.downloadType)}
                    disabled={apiLoading}
                >
                    {apiLoading ? <CircularProgress size={24} /> : "Verify"}
                </Button>
            ),
        },
        {
            field: "quickStatus",
            headerName: "Quick Status",
            description: "Quick Status(Success-Count/ErrorCount/Total)",
            width: 100,
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
            field: "createdAt",
            headerName: "Created At",
            width: 200,
            filterable: true,
            renderCell: (params) => new Date(params?.value)?.toLocaleString(),
        },
        {
            field: "downloadType",
            headerName: "Type",
            width: 50,
            filterable: true,
            renderCell: (params) => params?.value?.toString()?.toUpperCase(),
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
            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                <ExecComponent
                    buttonText={`D/l ${label} from GDrive`}
                    placeholder='Enter Google Drive Link(s)/Identifiers as csv'
                    secondTextBoxPlaceHolder='Enter Profile or File Abs Path'
                    execType={gDriveFileType}
                    css={{ backgroundColor: "lightgreen", width: "450px" }}
                    css2={{ backgroundColor: "lightgreen", width: "450px" }}
                    reactComponent={<>
                        <RadioGroup aria-label="gDriveFileType" name="gDriveFileType" value={gDriveFileType} onChange={chooseGDriveFileType} row>
                            <FormControlLabel value={ExecType.DWNLD_PDFS_ONLY_FROM_GOOGLE_DRIVE} control={<Radio />} label="PDF-Only" />
                            <FormControlLabel value={ExecType.DWNLD_ZIPS_ONLY_FROM_GOOGLE_DRIVE} control={<Radio />} label="ZIP-ONLY" />
                            <FormControlLabel value={ExecType.DWNLD_ALL_FROM_GOOGLE_DRIVE} control={<Radio />} label="ALL" />
                        </RadioGroup>
                    </>}
                />
            </Box>
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

            {/* New Dialog for API Result */}
            <Dialog open={openApiResultDialog} onClose={() => setOpenApiResultDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>API Result</DialogTitle>
                <DialogContent className="max-h-96 overflow-y-auto">
                    {apiLoading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                            <CircularProgress />
                        </Box>
                    ) : apiError ? (
                        <Typography color="error">{apiError}</Typography>
                    ) : apiResult ? (
                        <Box>
                            <Typography variant="h6" gutterBottom>Result:</Typography>
                            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                {JSON.stringify(apiResult, null, 2)}
                            </pre>
                        </Box>
                    ) : (
                        <Typography>No result available</Typography>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default GDriveDownloadListing
