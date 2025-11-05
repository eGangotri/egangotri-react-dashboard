import React, { ChangeEvent, useMemo } from "react"
import { useState, useEffect } from "react"
import {
    DataGrid,
    type GridColDef,
    type GridPaginationModel,
    type GridFilterModel,
    GridToolbar,
    type GridRenderCellParams,
} from "@mui/x-data-grid"
import { Button, Dialog, DialogTitle, DialogContent, Chip, IconButton, Box, RadioGroup, FormControlLabel, Typography, Radio, CircularProgress } from "@mui/material"
import { makeGetCall, makePostCall } from 'service/ApiInterceptor';
import { FaCopy } from "react-icons/fa";
import ExecComponent from "scriptsThruExec/ExecComponent";
import { ExecType } from "scriptsThruExec/ExecLauncherUtil";
import { FOLDER_OF_UNZIPPED_IMGS } from "service/consts";
import { IMG_TYPE_CR2, IMG_TYPE_JPG, IMG_TYPE_PNG, IMG_TYPE_TIF } from "scriptsThruExec/constants";
import { csvize } from "scriptsThruExec/Utils";
import { buildDeterministicColorMap, colorForKey } from "utils/color";

// Interface for folder info
interface IFolderInfo {
    folder_path: string;
    has_images: boolean;
    image_count: number;
    pdf_generated: boolean;
    pdf_path: string;
    pdf_page_count: number;
    pages_match_images: boolean;
    folderErrors: string[];
    error_count: number;
    status: string;
}

// Interface for memory stats
interface IMemoryStats {
    initial_mb: number;
    peak_mb: number;
    final_mb: number;
    net_change_mb: number;
}

// Interface for paths
interface IPaths {
    source: string;
    destination: string;
}

// Interface for summary
interface ISummary {
    folders_with_images: number;
    pdfs_created: number;
    pdfs_skipped: number;
    error_count: number;
    failed_images_count: number;
    successful_images_count: number;
    time_taken_seconds: number;
}

// Main interface for the Image to PDF History document
export interface IImageToPdfHistory {
    commonRunId: string;
    total_folders: number;
    folders_detail: IFolderInfo[];
    summary: ISummary;
    memory_stats: IMemoryStats;
    mongo_doc_id?: string;
    paths: IPaths;
    createdAt?: Date;
    updatedAt?: Date;
    _id?: string;
}

interface FetchResponse {
    entries: IImageToPdfHistory[]
    totalItems: number
}

// Columns for the folder details DataGrid (shown in popup)
const folderDetailsColumns: GridColDef[] = [
    { field: 'folder_path', headerName: 'Folder Path', width: 300 },
    { field: 'image_count', headerName: 'Images', width: 100, type: 'number' },
    {
        field: 'pdf_generated',
        headerName: 'PDF Generated',
        width: 130,
        renderCell: (params: GridRenderCellParams<IFolderInfo>) => (
            <Chip
                label={params.value ? 'Yes' : 'No'}
                color={params.value ? 'success' : 'default'}
                size="small"
            />
        )
    },
    { field: 'pdf_path', headerName: 'PDF Path', width: 300 },
    { field: 'pdf_page_count', headerName: 'Pages', width: 100, type: 'number' },
    {
        field: 'pages_match_images',
        headerName: 'Match',
        width: 100,
        renderCell: (params: GridRenderCellParams<IFolderInfo>) => (
            <Chip
                label={params.value ? 'Yes' : 'No'}
                color={params.value ? 'success' : 'warning'}
                size="small"
            />
        )
    },
    {
        field: 'status',
        headerName: 'Status',
        width: 120,
        renderCell: (params: GridRenderCellParams<IFolderInfo>) => (
            <Chip
                label={params.value}
                color={params.value === 'success' ? 'success' : 'error'}
                size="small"
            />
        )
    },
    { field: 'error_count', headerName: 'Errors', width: 100, type: 'number' }
];

const getColumns = (handleViewDetails: (entry: IImageToPdfHistory) => void, commonRunIdColorMap: Record<string, { bg: string; color: string; border: string }>): GridColDef[] => [

    {
        field: 'commonRunId',
        headerName: 'Common Run Id',
        width: 150,
        sortable: false,
        filterable: false,
        renderCell: (params: GridRenderCellParams<IImageToPdfHistory>) => {

            const v = String(params.value ?? '');
            const { bg, color, border } = commonRunIdColorMap[v] || colorForKey(v);
            return (
                <Chip
                    label={v}
                    size="small"
                    sx={{ bgcolor: bg, color, fontWeight: 600, border: `1px solid ${border}` }}
                    onClick={() => handleViewDetails(params.row)}
                />
            );
        }
    },
    { field: 'total_folders', headerName: 'Total Folders', width: 200, type: 'number' },
    {
        field: 'total_folders_including_empty',
        headerName: 'Total Folders Including Empty', width: 200, type: 'number'
    },
    {
        field: 'summary',
        headerName: 'Summary',
        width: 200,
        renderCell: (params: GridRenderCellParams<IImageToPdfHistory>) => (
            <div>
                <div>PDFs Created: {params.row.summary.pdfs_created}</div>
                <div>Errors: {params.row.summary.error_count}</div>
                <div>Time: {params.row.summary.time_taken_seconds}s</div>
            </div>
        )
    },
    {
        field: 'source',
        headerName: 'Source',
        width: 200,
        renderCell: (params: GridRenderCellParams<IImageToPdfHistory>) => (
            <div>{params.row.paths.source}</div>
        )
    },
    {
        field: 'destination',
        headerName: 'Destination',
        width: 200,
        renderCell: (params: GridRenderCellParams<IImageToPdfHistory>) => (
            <div>{params.row.paths.destination}</div>
        )
    },
    {
        field: 'memory_stats',
        headerName: 'Memory (MB)',
        width: 200,
        renderCell: (params: GridRenderCellParams<IImageToPdfHistory>) => (
            <div>
                <div>Peak: {params.row.memory_stats.peak_mb}</div>
                <div>Net Change: {params.row.memory_stats.net_change_mb}</div>
            </div>
        )
    },
    {
        field: 'createdAt',
        headerName: 'Created',
        width: 180,
        renderCell: (params: GridRenderCellParams<IImageToPdfHistory>) =>
            params.value ? new Date(params.value).toLocaleString() : ''
    }
];

const ImgToPdfListing: React.FC = () => {
    const [folderOfUnzippedImgs, setFolderOfUnzippedImgs] = useState<string>("");
    const [downloads, setDownloads] = useState<IImageToPdfHistory[]>([])
    // const [selectedFiles, setSelectedFiles] = useState<ICompositeDocument[]>([])
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

    // State for folder details dialog
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
    const [selectedEntry, setSelectedEntry] = useState<IImageToPdfHistory | null>(null)

    const handleViewDetails = (entry: IImageToPdfHistory) => {
        setSelectedEntry(entry)
        setOpenDetailsDialog(true)
    }

    const handleCloseDetailsDialog = () => {
        setOpenDetailsDialog(false)
        setSelectedEntry(null)
    }

    const fetchImgFilesToPdf = async (page: number, pageSize: number): Promise<FetchResponse> => {
        const response = await makePostCall({ page, pageSize }, `imgToPdf/getAllImgToPdfEntries`)
        return response
    }

    useEffect(() => {
        const loadImgToPdfHistories = async () => {
            try {
                const { entries, totalItems } = await fetchImgFilesToPdf(paginationModel.page + 1, paginationModel.pageSize)
                if (entries) {
                    setDownloads(entries)
                    setTotalItems(totalItems)
                }
            } catch (error) {
                console.error("Error fetching GDrive downloads:", error)
            }
        }
        loadImgToPdfHistories()
    }, [paginationModel.page, paginationModel.pageSize]) // Added fetchGDriveDownloads to dependencies



    const handleOpenMsg = (msg: string) => {
        setSelectedMsg(msg)
        setOpenMsgDialog(true)
    }

    const handleCopyLink = (link: string) => {
        navigator.clipboard.writeText(link);
    };

    const [imgType, setImgType] = useState(ExecType.ANY_IMG_TYPE_TO_PDF);

    const loadFolderOfUnzippedImgFilesFromLocalStorage = () => {
        let storedValue = localStorage.getItem(FOLDER_OF_UNZIPPED_IMGS);

        console.log(`loadFromLocalStorage called ${storedValue}`)
        if (storedValue) {
            setFolderOfUnzippedImgs(storedValue);
        }
    }

    const handleChangeImgFilesToPdf = (event: ChangeEvent<HTMLInputElement>) => {
        const _val = event.target.value;
        console.log("ImgType: ", _val);
        setImgType(Number(_val));
    };

    const commonRunIdColorMap = useMemo(() => {
        const ids = Array.from(new Set((downloads || []).map((r) => String((r as any)?.commonRunId ?? ''))));
        return buildDeterministicColorMap(ids);
    }, [downloads]);

    return (
        <div className="h-[400px] w-full">
            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">

                <ExecComponent
                    buttonText="Img Files(any/jpg/png/tiff) to pdf"
                    placeholder='Folder Abs Path'
                    execType={imgType}
                    secondTextBoxPlaceHolder='Dest Folder Abs Path'
                    onInputChange={setFolderOfUnzippedImgs}
                    reactComponent={<>
                        <RadioGroup aria-label="fileType" name="fileType" value={imgType} onChange={handleChangeImgFilesToPdf} row>
                            <FormControlLabel value={ExecType.ANY_IMG_TYPE_TO_PDF} control={<Radio />} label="ANY" />
                            <FormControlLabel value={ExecType.JPG_TO_PDF} control={<Radio />} label={IMG_TYPE_JPG} />
                            <FormControlLabel value={ExecType.PNG_TO_PDF} control={<Radio />} label={IMG_TYPE_PNG} />
                            <FormControlLabel value={ExecType.TIFF_TO_PDF} control={<Radio />} label={IMG_TYPE_TIF} />
                            <FormControlLabel value={ExecType.CR2_TO_PDF} control={<Radio />} label={IMG_TYPE_CR2} />
                        </RadioGroup>
                    </>}

                    thirdButton={
                        <><Button
                            variant="contained"
                            color="primary"
                            onClick={loadFolderOfUnzippedImgFilesFromLocalStorage}
                            sx={{ marginRight: "10px", marginBottom: "10px" }}>Load From Local Storage</Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setFolderOfUnzippedImgs(csvize(folderOfUnzippedImgs))}
                                sx={{ marginRight: "10px", marginBottom: "10px" }}>CSVize</Button>

                        </>
                    }
                    textBoxOneValue={folderOfUnzippedImgs}
                    css={{ backgroundColor: "violet", width: "800px" }}
                    css2={{ backgroundColor: "violet", width: "450px" }}
                />
            </Box>
            <DataGrid
                rows={downloads}
                columns={getColumns(handleViewDetails, commonRunIdColorMap)}
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
            />

            {/* Folder Details Dialog */}
            <Dialog
                open={openDetailsDialog}
                onClose={handleCloseDetailsDialog}
                maxWidth="xl"
                fullWidth
            >
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">Folder Details</Typography>
                        <IconButton onClick={handleCloseDetailsDialog}>
                            ✕
                        </IconButton>
                    </Box>
                    {selectedEntry && (
                        <Box mt={2}>
                            <Typography variant="body2" color="textSecondary">
                                Source: {selectedEntry.paths.source}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Destination: {selectedEntry.paths.destination}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Created: {selectedEntry.createdAt ? new Date(selectedEntry.createdAt).toLocaleString() : 'N/A'}
                            </Typography>
                        </Box>
                    )}
                </DialogTitle>
                <DialogContent>
                    {selectedEntry && (
                        <Box sx={{ height: 500, width: '100%' }}>
                            <DataGrid
                                rows={selectedEntry.folders_detail.map((folder, index) => ({
                                    ...folder,
                                    id: index
                                }))}
                                columns={folderDetailsColumns}
                                pageSizeOptions={[5, 10, 20]}
                                pagination
                                initialState={{
                                    pagination: { paginationModel: { pageSize: 10 } },
                                }}
                                slots={{
                                    toolbar: GridToolbar,
                                }}
                                getRowClassName={(params) =>
                                    params.row.status === 'success' ? 'bg-green-50' : 'bg-red-50'
                                }
                            />
                        </Box>
                    )}
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default ImgToPdfListing
