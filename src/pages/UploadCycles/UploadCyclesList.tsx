import type React from "react"
import { useEffect, useState } from "react"
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid"
import {
    Typography, Box, Table, TableBody, TableCell,
    TableHead, TableRow, Button, Stack, Link
} from "@mui/material"
import type { UploadCycleTableData, UploadCycleTableDataDictionary, ArchiveProfileAndCount } from "mirror/types"
import { getDataForUploadCycle, verifyUploadStatusForUploadCycleId } from "service/BackendFetchService"
import { MAX_ITEMS_LISTABLE } from "utils/constants"
import { createBackgroundForRow } from "./utils"
import { ColorCodeInformationPanel } from "./ColorCodedInformationPanel"
import Spinner from "widgets/Spinner"
import { FaTrash } from "react-icons/fa"
import UploadDialog from "./UploadDialog"
import { UPLOADS_USHERED_PATH } from "Routes/constants"
import { NestedTable } from "./UploadCycleListNestedTable"
import { ActionButtons } from "./UploadCycleListActionButton"

const columns: GridColDef[] = [
    {
        field: "uploadCycleId",
        headerName: "Upload Cycle ID",
        width: 220,
        renderCell: (params: GridRenderCellParams<UploadCycleTableData>) => {
            const [openDialog, setOpenDialog] = useState(false)

            const handleClick = (event: React.MouseEvent) => {
                event.preventDefault()
                setOpenDialog(true)
            }

            const handleConfirm = () => {
                alert(`Confirmed: Open Uploads for Upload Cycle ID: ${params.row.uploadCycleId}`)
                //   window.location.href = `${UPLOADS_USHERED_PATH}?uploadCycleId=${params.row.uploadCycleId}`
            }

            return (
                <>
                    <Link href="#" onClick={handleClick}>
                        {params.row.uploadCycleId}
                    </Link>
                    <UploadDialog
                        openDialog={openDialog}
                        handleClose={() => setOpenDialog(false)}
                        setOpenDialog={setOpenDialog}
                        invokeFuncOnClick2={handleConfirm}
                    />
                </>
            )
        },
    },
    {
        field: "archiveProfileAndCount",
        headerName: "Archive Profile Details",
        width: 300,
        renderCell: (params: GridRenderCellParams<UploadCycleTableData, ArchiveProfileAndCount[]>) => (
            <NestedTable data={params.value || []} uploadCycleId={params.row.uploadCycleId} />
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
                    <ActionButtons uploadCycleId={params.row.uploadCycleId} row={params.row}/>
                </Box>
            )
        },
    },
    {
        field: "totalCount",
        headerName: "Total Count",
        width: 100,
        renderCell: (params: GridRenderCellParams<UploadCycleTableData>) => {
            const [openDialog, setOpenDialog] = useState(false)

            const handleClick = (event: React.MouseEvent) => {
                event.stopPropagation()
                setOpenDialog(true)
            }

            const handleConfirm = async () => {
                console.log("Delete confirmed for Upload Cycle ID:", params.row.uploadCycleId)
                // Implement the actual delete action here
                setOpenDialog(false)
            }

            return (
                <>
                    <div onClick={handleClick} className="cursor-pointer inline-block ml-2 flex items-center">
                        {params.value}
                        <FaTrash className="ml-1" />
                    </div>
                    <UploadDialog
                        openDialog={openDialog}
                        handleClose={() => setOpenDialog(false)}
                        setOpenDialog={setOpenDialog}
                        invokeFuncOnClick={handleConfirm}
                    />
                </>
            )
        },
    },
    { field: "datetimeUploadStarted", headerName: "Upload Started", width: 180 },
    { field: "mode", headerName: "Mode", width: 100 },
]

const UploadCyclesList: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [data, setData] = useState<UploadCycleTableData[]>([])

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
            {isLoading && <Spinner />}
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
        </>
    )
}

export default UploadCyclesList

