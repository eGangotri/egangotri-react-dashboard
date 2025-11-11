import React, { ChangeEvent, useMemo } from "react"
import { useState, useEffect } from "react"
import {
    DataGrid,
    type GridColDef,
    type GridPaginationModel,
    type GridFilterModel,
    GridToolbar,
} from "@mui/x-data-grid"
import { Button, Dialog, DialogTitle, DialogContent, Chip, IconButton, Box, RadioGroup, FormControlLabel, Typography, Radio, CircularProgress, DialogActions } from "@mui/material"
import ExecPopover from 'scriptsThruExec/ExecPopover';
import { makeGetCall } from 'service/ApiInterceptor';
import { FaCopy } from "react-icons/fa";
import ExecComponent from "scriptsThruExec/ExecComponent";
import { ExecType } from "scriptsThruExec/ExecLauncherUtil";
import { redownloadFromGDrive, verifyGDriveDwnldSuccessFolders } from "service/launchYarn";
import { buildDeterministicColorMap, colorForKey } from "utils/color";
import ExecResponsePanel from "scriptsThruExec/ExecResponsePanel";

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
    gDriveRootFolder?: string
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
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
    const [confirmTargetId, setConfirmTargetId] = useState<string>("")
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
    const [anchorElApi, setAnchorElApi] = useState<HTMLButtonElement | null>(null)

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
        const sorted = [...files].sort((a, b) => (a.status === "failed" ? 0 : 1) - (b.status === "failed" ? 0 : 1))
        setSelectedFiles(sorted.map((file, index) => ({ ...file, id: index.toString() })))
        setOpenDialog(true)
    }

    const handleOpenMsg = (msg: string) => {
        setSelectedMsg(msg)
        setOpenMsgDialog(true)
    }

    const handleGDriveDwnldVerification = async (e: React.MouseEvent<HTMLButtonElement>, id: string = "") => {
        setAnchorElApi(e.currentTarget)
        try {
            const response = await verifyGDriveDwnldSuccessFolders(id);
            setApiLoading(true)
            setApiResult(<ExecResponsePanel response={response} execType={gDriveFileType} />);
        } catch (error) {
            console.error("Error calling API:", error)
            setApiResult(null)
        } finally {
            setApiLoading(false)
        }
    }


    const handleConfirm = async (id: string) => {
        setConfirmDialogOpen(false)
        handleRedownload(id)
    }
    const handleRedownload = async (id: string) => {
        try {
            const response = await redownloadFromGDrive(id);
            setApiLoading(true)
            setApiResult(<ExecResponsePanel response={response} execType={gDriveFileType} />);
        } catch (error) {
            console.error("Error calling API:", error)
            setApiResult(null)
        } finally {
            setApiLoading(false)
        }
    }

    const handleCopyLink = (link: string) => {
        navigator.clipboard.writeText(link);
    };

    // Build a deterministic color map for visible commonRunId values
    const commonRunIdColorMap = useMemo(() => {
        const ids = Array.from(new Set((downloads || []).map((r) => String((r as any)?.commonRunId ?? ''))));
        return buildDeterministicColorMap(ids);
    }, [downloads]);

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
        {
            field: "gDriveRootFolder",
            headerName: "Root Folder",
            width: 250,
            filterable: true,
            renderCell: (params) => {
                const _path = (params.row.profileNameOrAbsPath === params.row.fileDumpFolder) ? params.row.fileDumpFolder : `${params.row.profileNameOrAbsPath} - ${params.row.fileDumpFolder}` + `/${params.row.gDriveRootFolder}`;
                return (
                    <div className="flex items-center">
                        <IconButton onClick={() => handleCopyLink(_path)} className="ml-2">
                            <FaCopy />
                        </IconButton>
                        {_path}
                    </div>
                );
            },
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
            field: "runId",
            headerName: "Run ID",
            width: 150,
            filterable: true,
            renderCell: (params) => params?.value?.toString() || "-",
        },
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
            width: 200,
            filterable: false,
            renderCell: (params) => (
                <>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={(e) => handleGDriveDwnldVerification(e, params.row._id)}
                        disabled={apiLoading}
                    >
                        {apiLoading ? <CircularProgress size={24} /> : "Verify"}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ ml: 1 }}
                        onClick={(e) => { setAnchorElApi(e.currentTarget); setConfirmTargetId(params.row._id); setConfirmDialogOpen(true); }}
                        disabled={apiLoading || (params.row.verify === undefined || params.row.verify === true)}
                    >
                        {apiLoading ? <CircularProgress size={24} /> : "Re-D/L"}
                    </Button>
                </>

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
                        {success_count}/<span className="text-red-500">{error_count}</span>/{totalPdfsToDownload} ({params?.row?.downloadType?.toString()?.toUpperCase()})
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
                    css={{ backgroundColor: "lightgreen", width: "90vw" }}
                    css2={{ backgroundColor: "lightgreen", width: "90vw" }}
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
                    if (params.row.verify === false) {
                        return "bg-red-500"
                    }
                    if (params.row.verify === true) {
                        return "bg-green-500"
                    }
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

            <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
                <DialogTitle>Confirm Re-download</DialogTitle>
                <DialogContent>
                    Are you sure you want to re-download this item?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDialogOpen(false)} color="inherit">No</Button>
                    <Button onClick={() => handleConfirm(confirmTargetId)} color="primary" variant="contained">Yes</Button>
                </DialogActions>
            </Dialog>

            <ExecPopover
                id={anchorElApi ? 'api-result-popover' : undefined}
                open={Boolean(anchorElApi)}
                anchorEl={anchorElApi}
                onClose={() => { setAnchorElApi(null); }}
            >
                {apiLoading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                        <CircularProgress />
                    </Box>
                ) : apiResult}
            </ExecPopover>

            <>
                <br></br>
                <br></br>
            </>
        </div>
    )
}

export default GDriveDownloadListing
