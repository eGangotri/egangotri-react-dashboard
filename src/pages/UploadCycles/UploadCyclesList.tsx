"use client"

import type React from "react"
import { useEffect, useState, useCallback } from "react"
import { DataGrid, type GridColDef, type GridRenderCellParams, type GridRowId } from "@mui/x-data-grid"
import { FaTrash, FaTimes } from 'react-icons/fa';
import { Typography, Box, Link, TextField, Select, MenuItem, FormControl, InputLabel, Button, SelectChangeEvent } from "@mui/material"
import type { UploadCycleTableData, UploadCycleTableDataDictionary } from "mirror/types"
import { deleteUploadCycleById, getDataForUploadCycle, makePostCallWithErrorHandling } from "service/BackendFetchService"
import { MAX_ITEMS_LISTABLE } from "utils/constants"
import { createBackgroundForRow } from "./utils"
import { ColorCodeInformationPanel } from "./ColorCodedInformationPanel"
import ConfirmDialog from "../../widgets/ConfirmDialog"
import { NestedTable } from "./UploadCycleListNestedTable"
import { ActionButtons } from "./UploadCycleListActionButton"
import { ResultDisplayPopover } from "../../widgets/ResultDisplayPopover"
import { launchUploader } from "service/launchGradle"
import { UPLOADS_USHERED_PATH } from "Routes/constants"
import { makeGetCall } from "service/ApiInterceptor";

type VerifiedFilter = "all" | "true" | "false" | "null"

const UploadCyclesList: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [data, setData] = useState<UploadCycleTableData[]>([])
    const [selectedRows, setSelectedRows] = useState<GridRowId[]>([]);
    const [filteredData, setFilteredData] = useState<UploadCycleTableData[]>([])
    const [openDialog, setOpenDialog] = useState(false)
    const [deletableUploadCycleId, setDeletableUploadCycleId] = useState<string>("")

    const closeAllChrome = async () => {
        if (window.confirm('Are you sure you want to close all Chrome instances?')) {
            try {
                const resp = await makeGetCall('/launchCmd/closeAllChrome')
                alert("Chrome instances closed successfully.")

            } catch (error) {
                alert("Error closing Chrome.")
                console.error('Error closing Chrome:', error);
            }
        }
    }
    const [popoverAnchor, setPopoverAnchor] = useState<HTMLButtonElement | null>(null)
    const [popoverContent, setPopoverContent] = useState<string>("")
    const [popoverTitle, setPopoverTitle] = useState<string>("")
    const [filterValue, setFilterValue] = useState<string>("")
    const [verifiedFilter, setVerifiedFilter] = useState<VerifiedFilter>("all")

    const handleClick = (event: React.MouseEvent, _uploadCycleId: string) => {
        event.stopPropagation()
        setOpenDialog(true)
        setDeletableUploadCycleId(_uploadCycleId)
    }

    const handleConfirm = async () => {
        setOpenDialog(false)
        handleDelete()
    }

    const handleDelete = async () => {
        const _uploadCycleId = deletableUploadCycleId
        setDeletableUploadCycleId("")
        console.log("Delete clicked ", _uploadCycleId)
        setIsLoading(true);
        setPopoverTitle("Delete Results")
        try {
            const _resp = await deleteUploadCycleById(_uploadCycleId)
            console.log(`result ${JSON.stringify(_resp)}`)
            setPopoverContent(JSON.stringify(_resp, null, 2))
            setPopoverAnchor(document.getElementById(`delete-button-${_uploadCycleId}`) as HTMLButtonElement)
        } catch (error) {
            console.error("Error deleting upload cycle:", error)
            setPopoverContent(`Error deleting upload cycle: ${error}`)
            setPopoverAnchor(document.getElementById(`delete-button-${_uploadCycleId}`) as HTMLButtonElement)
        } finally {
            setIsLoading(false)
            fetchData()
        }
    }

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setFilterValue(value)
        applyFilters(value.toLowerCase(), verifiedFilter)
    }

    const handleVerifiedFilterChange = (event: SelectChangeEvent<VerifiedFilter>) => {
        const value = event.target.value as VerifiedFilter
        setVerifiedFilter(value)
        applyFilters(filterValue, value)
    }

    const applyFilters = (textFilter: string, verifiedStatus: VerifiedFilter) => {
        const filtered = data.filter((item) => {
            const matchesText =
                item.uploadCycleId.toLowerCase().includes(textFilter) ||
                item.archiveProfileAndCount.some((profile) => profile.archiveProfile.toLowerCase().includes(textFilter))

            let matchesVerified = true
            if (verifiedStatus !== "all") {
                if (verifiedStatus === "null") {
                    matchesVerified = item.allUploadVerified === null
                } else {
                    matchesVerified = item.allUploadVerified === (verifiedStatus === "true")
                }
            }

            return matchesText && matchesVerified
        })
        setFilteredData(filtered)
    }

    const columns: GridColDef[] = [
        {
            field: "uploadCycleId",
            headerName: "Upload Cycle ID",
            width: 220,
            renderCell: (params: GridRenderCellParams<UploadCycleTableData>) => {
                return (
                    <>
                        <Link href={`${UPLOADS_USHERED_PATH}?uploadCycleId=${params.row.uploadCycleId}`}>
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
            renderCell: (params: GridRenderCellParams<UploadCycleTableData>) => <NestedTable data={params.row || []} />,
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
                        <ActionButtons
                            uploadCycleId={params.row.uploadCycleId}
                            row={params.row}
                            isLoading={isLoading}
                            setIsLoading={setIsLoading}
                            fetchData={fetchData}
                        />
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
                            onClick={(e) => handleClick(e, params.row.uploadCycleId)}
                            className="cursor-pointer inline-block ml-2 flex items-center"
                        >
                            {params.value}
                            <FaTrash className="ml-1" />
                        </div>
                        <ResultDisplayPopover
                            popoverAnchor={popoverAnchor}
                            setPopoverAnchor={setPopoverAnchor}
                            popoverContent={popoverContent}
                            actionType={popoverTitle}
                        />
                    </>
                )
            },
        },
        { field: "datetimeUploadStarted", headerName: "Upload Started", width: 180 },
        { field: "mode", headerName: "Mode", width: 100 },
        {
            field: "allUploadVerified",
            headerName: "All Upload Verified",
            width: 150,
            renderCell: (params: GridRenderCellParams<UploadCycleTableData>) => {
                return <Typography>{params.value === null ? "N/A" : params.value.toString()}</Typography>
            },
        },
        {
            field: "uploadCenter",
            headerName: "Upload Center",
            width: 150,
            renderCell: (params: GridRenderCellParams<UploadCycleTableData>) => {
                return <Typography>{params.row.uploadCenter === null ? "N/A" : params.row.uploadCenter?.toString()}</Typography>
            },
        }
    ]

    const fetchUploadCycles = useCallback(async () => {
        try {
            const dataForUploadCycle: UploadCycleTableDataDictionary[] = await getDataForUploadCycle(MAX_ITEMS_LISTABLE)
            return dataForUploadCycle?.map((item) => ({
                id: item.uploadCycle.uploadCycleId,
                ...item.uploadCycle,
            }))
        } catch (error) {
            console.error("Error fetching upload cycles:", error)
            return [] // Return an empty array in case of error
        }
    }, [])

    const fetchData = useCallback(async () => {
        setIsLoading(true)
        try {
            const fetchedData = await fetchUploadCycles()
            setData(fetchedData)
            setFilteredData(fetchedData)
        } catch (error) {
            console.error("Error fetching data:", error)
            // Handle error appropriately, e.g., display an error message
        } finally {
            setIsLoading(false)
        }
    }, [])

    const [profilesCsv, setProfilesCsv] = useState("")
    const [extraDescription, setExtraDescription] = useState("")

    const uploadToArchive = async () => {
        const optionalParams = extraDescription?.trim() === "" ? {} : {
            subjectDesc:
                extraDescription
        }
        setIsLoading(true)
        try {
            const _resp = await launchUploader(profilesCsv, optionalParams);
            console.log(`result ${JSON.stringify(_resp)}`)
            setPopoverContent(JSON.stringify(_resp, null, 2))
            setPopoverAnchor(document.getElementById("profiles-csv") as HTMLButtonElement)
            setPopoverTitle("Upload Results")
        } catch (error) {
            console.error("Error uploading:", error)
            setPopoverContent(`Error uploading: ${error}`)
            setPopoverAnchor(document.getElementById("profiles-csv") as HTMLButtonElement)
            setPopoverTitle("Upload Results")
        } finally {
            setIsLoading(false)
            fetchData()
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const reset = () => {
        setFilterValue("")
        setVerifiedFilter("all")
        setProfilesCsv("")
        setExtraDescription("")
    }

    return (
        <>
            <Box sx={{ height: 400, width: '100%' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Upload Cycles
                </Typography>
                <Box sx={{ display: 'flex', gap: 4, mt: 4 }}>
                    <Box>
                        <Box sx={{ flex: 1 }}>
                            <TextField
                                id="profiles-csv"
                                label="Profiles as CSV"
                                value={profilesCsv}
                                onChange={(e) => setProfilesCsv(e.target.value)}
                                sx={{ mb: 2, mr: 2 }}
                            />
                            <TextField
                                label="Optional Extra Subject/Description"
                                value={extraDescription}
                                onChange={(e) => setExtraDescription(e.target.value)}
                                sx={{ mb: 2, mr: 2 }}
                            />
                            <Button variant="contained"
                                color="primary" onClick={uploadToArchive}
                                sx={{ mt: 1 }}
                                disabled={isLoading}>
                                Upload PDFs to Archive for profile
                            </Button>
                        </Box>

                        <Box sx={{ display: "flex", gap: 2, mb: 2, mr: 2 }}>
                            <TextField
                                label="Filter by Archive Profile or Upload Cycle ID"
                                variant="outlined"
                                value={filterValue}
                                sx={{ mb: 2, mr: 2 }}
                                onChange={handleFilterChange}
                            />
                            <FormControl variant="outlined" sx={{ minWidth: 200, mb: 2, mr: 2 }}>
                                <InputLabel id="verified-filter-label">All Upload Verified</InputLabel>
                                <Select
                                    labelId="verified-filter-label"
                                    value={verifiedFilter}
                                    onChange={handleVerifiedFilterChange}
                                    label="All Upload Verified"
                                >
                                    <MenuItem value="all">All</MenuItem>
                                    <MenuItem value="true">Verified</MenuItem>
                                    <MenuItem value="false">Not Verified</MenuItem>
                                    <MenuItem value="null">N/A</MenuItem>
                                </Select>
                            </FormControl>
                            <Button variant="contained"
                                color="primary"
                                onClick={() => reset()}
                                sx={{ my: 1 }}
                                disabled={isLoading}>
                                Reset
                            </Button>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 'fit-content' }}>
                        <Button variant="contained" color="error" onClick={closeAllChrome} startIcon={<FaTimes />}
                            sx={{ width: 200, height: 40 }}
                        >
                            Close All Chrome
                        </Button>
                        <ColorCodeInformationPanel />
                    </Box>
                </Box>
                <DataGrid
                    rows={filteredData}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    pageSizeOptions={[8, 10, 25]}
                    checkboxSelection
                    disableRowSelectionOnClick
                    loading={isLoading}
                    getRowHeight={() => "auto"}
                    getEstimatedRowHeight={() => 200}
                    getRowClassName={(params) => createBackgroundForRow(params.row)}
                />
            </Box>
            <ConfirmDialog
                openDialog={openDialog}
                handleClose={() => setOpenDialog(false)}
                setOpenDialog={setOpenDialog}
                invokeFuncOnClick2={handleConfirm}
            />
        </>
    );
}

export default UploadCyclesList;
