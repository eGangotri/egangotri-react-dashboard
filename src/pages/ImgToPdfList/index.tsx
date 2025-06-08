import React, { ChangeEvent } from "react"
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
import { redownloadFromGDrive, verifyGDriveDwnldSuccessFolders } from "service/launchYarn";
import { FOLDER_OF_UNZIPPED_IMGS } from "service/consts";
import { IMG_TYPE_CR2, IMG_TYPE_JPG, IMG_TYPE_PNG, IMG_TYPE_TIF } from "scriptsThruExec/constants";

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


const columns: GridColDef[] = [
    { field: 'total_folders', headerName: 'Total Folders', width: 130, type: 'number' },
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
        field: 'paths',
        headerName: 'Paths',
        width: 300,
        renderCell: (params: GridRenderCellParams<IImageToPdfHistory>) => (
            <div>
                <div>Source: {params.row.paths.source}</div>
                <div>Dest: {params.row.paths.destination}</div>
            </div>
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
        valueFormatter: (params: { value: Date | undefined }) => params.value ? new Date(params.value).toLocaleString() : ''
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

    const fetchImgFilesToPdf = async (page: number, pageSize: number): Promise<FetchResponse> => {
        const response = await makePostCall({ page, pageSize }, `imgToPdf/getAllImgToPdfEntries`)
        console.log(`resp from fetchImgFilesToPdf: ${JSON.stringify(response)}`)
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

    // const handleOpenFiles = (files: ICompositeDocument[]) => {
    //     setSelectedFiles(files.map((file, index) => ({ ...file, id: index.toString() })))
    //     setOpenDialog(true)
    // }

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
    return (
        <div className="h-[400px] w-full">
            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">

                <ExecComponent
                    buttonText="Img Files(any/jpg/png/tiff) to pdf"
                    placeholder='Folder Abs Path'
                    execType={imgType}
                    secondTextBoxPlaceHolder='Dest Folder Abs Path'
                    reactComponent={<>
                        <RadioGroup aria-label="fileType" name="fileType" value={imgType} onChange={handleChangeImgFilesToPdf} row>
                            <FormControlLabel value={ExecType.ANY_IMG_TYPE_TO_PDF} control={<Radio />} label="ANY" />
                            <FormControlLabel value={ExecType.JPG_TO_PDF} control={<Radio />} label={IMG_TYPE_JPG} />
                            <FormControlLabel value={ExecType.PNG_TO_PDF} control={<Radio />} label={IMG_TYPE_PNG} />
                            <FormControlLabel value={ExecType.TIFF_TO_PDF} control={<Radio />} label={IMG_TYPE_TIF} />
                            <FormControlLabel value={ExecType.CR2_TO_PDF} control={<Radio />} label={IMG_TYPE_CR2} />
                        </RadioGroup>
                    </>}
                    thirdButton={<Button
                        variant="contained"
                        color="primary"
                        onClick={loadFolderOfUnzippedImgFilesFromLocalStorage}
                        sx={{ marginRight: "10px", marginBottom: "10px" }}>Load From Local Storage</Button>}
                    textBoxOneValue={folderOfUnzippedImgs}
                    css={{ backgroundColor: "violet", width: "450px" }}
                    css2={{ backgroundColor: "violet", width: "450px" }}
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
                // getRowClassName={(params) => {
                //     const { success_count = 0, totalPdfsToDownload = 0 } = params.row.quickStatus || {}
                //     if (params.row.verify === false) {
                //         return "bg-red-500"
                //     }
                //     if (params.row.verify === true) {
                //         return "bg-green-500"
                //     }
                //     if (success_count === 0 && totalPdfsToDownload === 0) return "bg-yellow-100"
                //     return success_count === totalPdfsToDownload ? "bg-green-100" : "bg-red-100"
                // }}
            />
         
        </div>
    )
}

export default ImgToPdfListing
