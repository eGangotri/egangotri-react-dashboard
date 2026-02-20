import React, { ChangeEvent, useMemo } from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import {
    DataGrid,
    type GridColDef,
    type GridPaginationModel,
    type GridFilterModel,
    GridToolbar,
    type GridRowId,
} from "@mui/x-data-grid"
import { Button, Dialog, DialogTitle, DialogContent, Chip, IconButton, Box, RadioGroup, FormControlLabel, Typography, Radio, CircularProgress, DialogActions } from "@mui/material"
import ExecPopover from 'scriptsThruExec/ExecPopover';
import { makeGetCall } from 'service/ApiInterceptor';
import { makePostCallWithErrorHandling } from "service/BackendFetchService";
import { FaCopy, FaTrash, FaBrain } from "react-icons/fa";
import ExecComponent from "scriptsThruExec/ExecComponent";
import { ExecType } from "scriptsThruExec/ExecLauncherUtil";
import { redownloadFromGDrive, verifyGDriveDwnldSuccessFolders } from "service/launchYarn";
import { buildDeterministicColorMap, colorForKey } from "utils/color";
import ExecResponsePanel from "scriptsThruExec/ExecResponsePanel";
import Spinner from "widgets/Spinner";
import { ellipsis } from "widgets/ItemTooltip";
import { LAUNCH_AI_RENAMER_PATH } from "Routes/constants";
import path from "path";

// Types
interface ICompositeDocument {
    id: string
    fileName: string
    filePath: string
    googleDriveLink?: string
    googleDrivePath?: string
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
    quickStatus: QuickStatus | QuickStatus[]
}

interface FetchResponse {
    data: IGDriveDownload[]
    totalItems: number
}


const GDriveDownloadListing: React.FC = () => {
    const navigate = useNavigate();

    const [gDriveFileType, setGDriveFileType] = React.useState<number>(ExecType.DWNLD_PDFS_ONLY_FROM_GOOGLE_DRIVE);
    const [label, setLabel] = React.useState<string>("");
    const [downloads, setDownloads] = useState<IGDriveDownload[]>([])
    const [selectedFiles, setSelectedFiles] = useState<ICompositeDocument[]>([])
    const [openDialog, setOpenDialog] = useState(false)
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
    const [deleteConfirmDialogOpen, setDeleteConfirmDialogOpen] = useState(false)
    const [verifyDialogOpen, setVerifyDialogOpen] = useState(false)
    const [confirmTargetId, setConfirmTargetId] = useState<string>("")
    const [deleteTargetRunId, setDeleteTargetRunId] = useState<string>("")
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        page: 0,
        pageSize: 10,
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
        pageSize: 10
    })

    const [selectedIds, setSelectedIds] = useState<GridRowId[]>([])

    const [openQuickStatusDialog, setOpenQuickStatusDialog] = useState(false)
    const [selectedQuickStatus, setSelectedQuickStatus] = useState<QuickStatus[]>([])

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
    useEffect(() => {
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

    const handleGDriveDwnldVerification = async (id: string = "") => {
        try {
            setApiLoading(true)
            const response = await verifyGDriveDwnldSuccessFolders(id);
            setApiResult(<ExecResponsePanel response={response} execType={gDriveFileType} />);
            loadDownloads();
        } catch (error) {
            console.error("Error calling API:", error)
            setApiResult(null)
        } finally {
            setApiLoading(false)
        }
    }

    const verifyEligibleIds = useMemo(
        () =>
            selectedIds
                .map((id) => downloads.find((d) => d._id === id))
                .filter((row): row is IGDriveDownload => !!row)
                .map((row) => row._id),
        [selectedIds, downloads]
    )

    const redownloadEligibleIds = useMemo(
        () =>
            selectedIds
                .map((id) => downloads.find((d) => d._id === id))
                .filter((row) => row && (row as any).verify === false)
                .map((row) => (row as IGDriveDownload)._id),
        [selectedIds, downloads]
    )

    const handleBulkVerify = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (verifyEligibleIds.length === 0) return
        try {
            setAnchorElApi(e.currentTarget);
            setApiResult(null)
            setApiLoading(true)
            const response = await makePostCallWithErrorHandling({
                selectedIds: verifyEligibleIds,
            }, `gDrive/verifyLocalDownloadSameAsGDriveMulti`)
            setApiResult(<ExecResponsePanel response={response} execType={gDriveFileType} />);
            loadDownloads();
        } catch (error) {
            console.error("Error calling bulk verify API:", error)
            setApiResult(null)
        } finally {
            setApiLoading(false)
        }
    }

    const handleConfirm = async (e: React.MouseEvent<HTMLButtonElement>, id: string,
        forVerify: boolean = false) => {
        setAnchorElApi(e.currentTarget);
        setConfirmTargetId(id);
        setApiResult(null)
        if (forVerify) {
            setVerifyDialogOpen(false)
            handleGDriveDwnldVerification(id)
        } else {
            setConfirmDialogOpen(false)
            handleRedownload(id)
        }
    }
    const handleRedownload = async (id: string) => {
        try {
            setApiLoading(true)
            const response = await redownloadFromGDrive(id);
            setApiResult(<ExecResponsePanel response={response} execType={gDriveFileType} />);
        } catch (error) {
            console.error("Error calling API:", error)
            setApiResult(null)
        } finally {
            setApiLoading(false)
        }
    }

    const handleBulkRedownload = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (redownloadEligibleIds.length === 0) return
        try {
            setAnchorElApi(e.currentTarget);
            setApiResult(null)
            setApiLoading(true)
            const response = await makePostCallWithErrorHandling({
                selectedIds: redownloadEligibleIds,
            }, `gDrive/redownloadFromGDriveMulti`)
            setApiResult(<ExecResponsePanel response={response} execType={gDriveFileType} />);
        } catch (error) {
            console.error("Error calling bulk redownload API:", error)
            setApiResult(null)
        } finally {
            setApiLoading(false)
        }
    }

    const handleCopyLink = (link: string) => {
        navigator.clipboard.writeText(link);
    };

    const handleDeleteClick = (runId: string) => {
        setDeleteTargetRunId(runId);
        setDeleteConfirmDialogOpen(true);
    };

    const handleDeleteConfirm = async (e: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElApi(e.currentTarget);
        setDeleteConfirmDialogOpen(false);
        try {
            setApiLoading(true);
            const response = await makePostCallWithErrorHandling(
                { runId: deleteTargetRunId },
                'gDrive/softDeleteGDriveDownload'
            );
            setApiResult(<ExecResponsePanel response={response} execType={gDriveFileType} />);
            loadDownloads();
        } catch (error) {
            console.error("Error calling delete API:", error);
            setApiResult(null);
        } finally {
            setApiLoading(false);
        }
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
            field: "fileDumpFolder",
            headerName: "Local Folder",
            width: 150,
            filterable: true,
            renderCell: (params) => {
                return (
                    <div className="flex items-center">
                        <IconButton onClick={() => handleCopyLink(params.value)} className="ml-2">
                            <FaCopy />
                        </IconButton>
                        {params.value}
                    </div>
                );
            },
        },

        {
            field: "gDriveRootFolder",
            headerName: "GDrive Root Folder",
            width: 250,
            filterable: true,
            renderCell: (params) => {
                return (
                    <div className="flex items-center">
                        <IconButton onClick={() => handleCopyLink(params.value)} className="ml-2">
                            <FaCopy />
                        </IconButton>
                        {params.value}
                    </div>
                );
            },
        },
        {
            field: "combo",
            headerName: "Combo",
            width: 230,
            filterable: true,
            renderCell: (params) => {
                return (
                    <div className="flex items-center">
                        <IconButton
                            onClick={() => {
                                const comboPath = path.join(params.row.fileDumpFolder, params.row.gDriveRootFolder);
                                navigate(`${LAUNCH_AI_RENAMER_PATH}?path=${encodeURIComponent(comboPath)}`);
                            }}
                            className="ml-2"
                            title="Go to AI Renamer"
                        >
                            <FaBrain />
                        </IconButton>
                        <IconButton onClick={() => handleCopyLink(path.join(params.row.fileDumpFolder, params.row.gDriveRootFolder))} className="ml-2">
                            <FaCopy />
                        </IconButton>
                        {path.join(params.row.fileDumpFolder, params.row.gDriveRootFolder)}
                    </div>
                );
            },
        },
        {
            field: "totalCount",
            headerName: "Total Items",
            width: 100,
            filterable: true,
            renderCell: (params) => {
                return (
                    <div className="flex items-center">
                        {params.value}
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
            width: 80,
            filterable: true,
            renderCell: (params) => ellipsis(params?.value?.toString() || "-", 5),
        },
        {
            field: "apiCall",
            headerName: "API Action",
            width: 300,
            filterable: false,
            renderCell: (params) => (
                <>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={(e) => { setVerifyDialogOpen(true); setConfirmTargetId(params.row._id) }}
                        disabled={apiLoading}
                    >
                        {apiLoading ? <> <Spinner /></> : "Verify"}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ ml: 1 }}
                        onClick={(e) => { setConfirmDialogOpen(true); setConfirmTargetId(params.row._id); }}
                        disabled={apiLoading || (params.row.verify === undefined || params.row.verify === true)}
                    >
                        {apiLoading ? <Spinner /> : "Re-D/L"}
                    </Button>
                    <IconButton
                        color="error"
                        sx={{ ml: 1 }}
                        onClick={() => handleDeleteClick(params.row.runId)}
                        disabled={apiLoading}
                    >
                        <FaTrash />
                    </IconButton>
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
                const qsArray: QuickStatus[] = Array.isArray(params.value)
                    ? params.value
                    : params.value
                        ? [params.value]
                        : []
                const latest: QuickStatus | undefined = qsArray.length > 0 ? qsArray[qsArray.length - 1] : undefined
                const success_count = Number(latest?.success_count ?? 0)
                const error_count = Number(latest?.error_count ?? 0)
                const dl_wrong_size_count = Number(latest?.dl_wrong_size_count ?? 0)
                const totalPdfsToDownload = Number(latest?.totalPdfsToDownload ?? 0)
                const combinedErrors = error_count + dl_wrong_size_count
                return (
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                            setSelectedQuickStatus(qsArray)
                            setOpenQuickStatusDialog(true)
                        }}
                    >
                        {success_count}/
                        <span className="text-red-500">{combinedErrors}</span>/
                        {totalPdfsToDownload} ({params?.row?.downloadType?.toString()?.toUpperCase()})
                    </Button>
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
            field: "googleDriveLink",
            headerName: "GDrive Link",
            width: 120,
            filterable: true,
            renderCell: (params) => params.value ? (
                <div className="flex items-center">
                    <IconButton onClick={() => handleCopyLink(params.value)} size="small">
                        <FaCopy />
                    </IconButton>
                    <a href={params.value} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline ml-1">
                        Open
                    </a>
                </div>
            ) : "-",
        },
        { field: "googleDrivePath", headerName: "GDrive Path", width: 200, filterable: true },
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
        <div className="h-[800px] w-full">
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
            {selectedIds.length > 0 && (
                <Box display="flex" gap={2} mb={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={apiLoading || verifyEligibleIds.length === 0}
                        onClick={handleBulkVerify}
                    >
                        {apiLoading ? <Spinner /> : `Verify (${verifyEligibleIds.length})`}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={apiLoading || redownloadEligibleIds.length === 0}
                        onClick={handleBulkRedownload}
                    >
                        {apiLoading ? <Spinner /> : `Re-DL (${redownloadEligibleIds.length})`}
                    </Button>
                </Box>
            )}
            <DataGrid
                rows={downloads}
                columns={columns}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[10, 15, 20]}
                pagination
                paginationMode="server"
                filterMode="server"
                filterModel={filterModel}
                onFilterModelChange={setFilterModel}
                rowCount={totalItems}
                getRowId={(row) => row._id}
                checkboxSelection
                disableRowSelectionOnClick
                onRowSelectionModelChange={(model) => {
                    setSelectedIds([...model])
                }}
                slots={{
                    toolbar: GridToolbar,
                }}
                getRowClassName={(params) => {
                    const qsVal = params.row.quickStatus
                    const qsArray: QuickStatus[] = Array.isArray(qsVal)
                        ? qsVal
                        : qsVal
                            ? [qsVal]
                            : []
                    const latest: QuickStatus | undefined = qsArray.length > 0 ? qsArray[qsArray.length - 1] : undefined
                    const success_count = Number(latest?.success_count ?? 0)
                    const totalPdfsToDownload = Number(latest?.totalPdfsToDownload ?? 0)
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

            <Dialog open={openQuickStatusDialog} onClose={() => setOpenQuickStatusDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Quick Status Details</DialogTitle>
                <DialogContent>
                    <div className="h-[300px] w-full">
                        <DataGrid
                            rows={selectedQuickStatus.map((qs, index) => ({
                                id: index.toString(),
                                success_count: qs.success_count ?? 0,
                                error_count: qs.error_count ?? 0,
                                dl_wrong_size_count: qs.dl_wrong_size_count ?? 0,
                                totalPdfsToDownload: qs.totalPdfsToDownload ?? 0,
                                status: qs.status ?? "",
                            }))}
                            columns={[
                                { field: "id", headerName: "#", width: 60 },
                                { field: "status", headerName: "Status", width: 200 },
                                { field: "success_count", headerName: "Success", width: 100 },
                                { field: "error_count", headerName: "Error", width: 100 },
                                { field: "dl_wrong_size_count", headerName: "DL Wrong Size", width: 130 },
                                { field: "totalPdfsToDownload", headerName: "Total PDFs", width: 120 },
                            ]}
                            pageSizeOptions={[5, 10]}
                            pagination
                        />
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
                <DialogTitle>Confirm Re-download</DialogTitle>
                <DialogContent>
                    Are you sure you want to re-download this item?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDialogOpen(false)} color="inherit">No</Button>
                    <Button onClick={(e) => handleConfirm(e, confirmTargetId)} color="primary" variant="contained">Yes</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={verifyDialogOpen} onClose={() => setVerifyDialogOpen(false)}>
                <DialogTitle>Confirm Verify </DialogTitle>
                <DialogContent>
                    Are you sure you want to verify this item?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setVerifyDialogOpen(false)} color="inherit">No</Button>
                    <Button onClick={(e) => handleConfirm(e, confirmTargetId, true)} color="primary" variant="contained">Yes</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={deleteConfirmDialogOpen} onClose={() => setDeleteConfirmDialogOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this run ({deleteTargetRunId})?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmDialogOpen(false)} color="inherit">No</Button>
                    <Button onClick={(e) => handleDeleteConfirm(e)} color="error" variant="contained">Yes</Button>
                </DialogActions>
            </Dialog>

            <ExecPopover
                id={anchorElApi ? 'api-result-popover' : undefined}
                open={Boolean(anchorElApi)}
                anchorEl={anchorElApi}
                onClose={() => { setAnchorElApi(null); }}
            >
                {apiResult &&
                    <Box>
                        {apiResult}
                    </Box>
                }
            </ExecPopover>

            <>
                <br></br>
                <br></br>
            </>
        </div>
    )
}

export default GDriveDownloadListing
