import type React from "react"
import { useEffect, useState } from "react"
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid"
import {
    Typography, Box, Table, TableBody, TableCell,
    TableHead, TableRow, Button, Stack, Link
} from "@mui/material"
import type { UploadCycleTableData, UploadCycleTableDataDictionary, ArchiveProfileAndCount } from "mirror/types"
import { deleteUploadCycleById, getDataForUploadCycle, verifyUploadStatusForUploadCycleId } from "service/BackendFetchService"
import { MAX_ITEMS_LISTABLE } from "utils/constants"
import { createBackgroundForRow } from "./utils"
import { ColorCodeInformationPanel } from "./ColorCodedInformationPanel"
import { FaTrash } from "react-icons/fa"
import UploadDialog from "./UploadDialog"
import { NestedTable } from "./UploadCycleListNestedTable"
import { ActionButtons } from "./UploadCycleListActionButton"
import { UploadCycleListPopover } from "./UploadCycleListPopover"


const UploadCyclesList: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [data, setData] = useState<UploadCycleTableData[]>([])
    const [openDialog, setOpenDialog] = useState(false)
    const [deletableUploadCycleId, setDeletableUploadCycleId] = useState<string>("");
    const [popoverAnchor, setPopoverAnchor] = useState<HTMLButtonElement | null>(null)
    const [popoverContent, setPopoverContent] = useState<string>("")
    const [reactComponent, setReactComponent] = useState<JSX.Element>(<></>)

    const handleClick = (event: React.MouseEvent, _uploadCycleId: string) => {
        event.stopPropagation()
        setOpenDialog(true)
        setDeletableUploadCycleId(_uploadCycleId)
    }

    const handleConfirm = async () => {
        //console.log("Delete confirmed for Upload Cycle ID:", params.row.uploadCycleId)
        // Implement the actual delete action here
        setOpenDialog(false)
        handleDelete()
    }
    
    const handleDelete = async () => {
        const _uploadCycleId = deletableUploadCycleId;
        setDeletableUploadCycleId("");
        console.log("Delete clicked ", _uploadCycleId);
        setIsLoading(true);
        const _resp = await deleteUploadCycleById(_uploadCycleId);
        console.log(`result ${JSON.stringify(_resp)}`);
        setIsLoading(false);
        setPopoverContent(JSON.stringify(_resp, null, 2))
        setPopoverAnchor(document.getElementById(`delete-button-${_uploadCycleId}`) as HTMLButtonElement)
        fetchData();
    }

  

    const columns: GridColDef[] = [
        {
            field: "uploadCycleId",
            headerName: "Upload Cycle ID",
            width: 220,
            renderCell: (params: GridRenderCellParams<UploadCycleTableData>) => {
                return (
                    <>
                        <Link href="#">
                            {params.row.uploadCycleId}
                        </Link>

                    </>
                )
            },
        },
        {
            field: "archiveProfileAndCount",
            headerName: "Archive Profile Details",
            width: 300,
            renderCell: (params: GridRenderCellParams<UploadCycleTableData>) => (
                <NestedTable data={params.row || []} />
            ),
        },
        {
            field: "combinedCounts",
            headerName: "Counts (Queued/Intended/Total)",
            width: 250,
            renderCell: (params: GridRenderCellParams<UploadCycleTableData>) => {
                const totalCount = params.row.totalCount || 0
                const queueCount = params.row.totalQueueCount || 0
                const intendedCount = params.row.countIntended || 0
                return (
                    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>{`${queueCount}/${intendedCount}/${totalCount}`}</Typography>
                        <ActionButtons uploadCycleId={params.row.uploadCycleId}
                            row={params.row}
                            isLoading={isLoading}
                            setIsLoading={setIsLoading}
                            fetchData={fetchData} />
                    </Box>
                )
            },
        },
        {
            field: "totalCount",
            headerName: "Total Count",
            width: 100,
            renderCell: (params: GridRenderCellParams<UploadCycleTableData>) => {
                return (
                    <>
                        <div 
                        id={`delete-button-${params.row.uploadCycleId}`}
                        onClick={(e) => handleClick(e, params.row.uploadCycleId)} className="cursor-pointer inline-block ml-2 flex items-center">
                            {params.value}
                            <FaTrash className="ml-1" />
                        </div>
                        <UploadCycleListPopover uploadCycleId={params.row.uploadCycleId} row={params.row}
                            popoverAnchor={popoverAnchor}
                            setPopoverAnchor={setPopoverAnchor}
                            popoverContent={popoverContent}
                            actionType={"Delete Results"}
                            reactComponent={reactComponent}
                            setReactComponent={setReactComponent} />
                    </>
                )
            },
        },
        { field: "datetimeUploadStarted", headerName: "Upload Started", width: 180 },
        { field: "mode", headerName: "Mode", width: 100 },
    ]


    async function fetchUploadCycles() {
        const dataForUploadCycle: UploadCycleTableDataDictionary[] = await getDataForUploadCycle(MAX_ITEMS_LISTABLE)

        return dataForUploadCycle?.map((item) => ({
            id: item.uploadCycle.uploadCycleId,
            ...item.uploadCycle,
        }))
    }

    async function fetchData() {
        setIsLoading(true)
        const data = await fetchUploadCycles()
        setData(data)
        setIsLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, []) //Fixed: Added empty dependency array to useEffect

    return (
        <>
            <ColorCodeInformationPanel />
            <Box sx={{ height: 600, width: "100%" }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Upload Cycles
                </Typography>
                <DataGrid
                    rows={data}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    pageSizeOptions={[5, 10, 25]}
                    checkboxSelection
                    disableRowSelectionOnClick
                    loading={isLoading}
                    getRowHeight={() => "auto"}
                    getEstimatedRowHeight={() => 200}
                    getRowClassName={(params) => createBackgroundForRow(params.row)}
                />
            </Box>
            <UploadDialog
                openDialog={openDialog}
                handleClose={() => setOpenDialog(false)}
                setOpenDialog={setOpenDialog}
                invokeFuncOnClick2={handleConfirm}
            />
        </>
    )
}

export default UploadCyclesList
