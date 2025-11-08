import React, { useState } from "react"
import {
    Button,
    Stack,
    Popover,
    Typography,
    IconButton,
    Paper,
    Box
} from "@mui/material"
import { makePostCallWithErrorHandling, verifyUploadStatusForUploadCycleId } from "service/BackendFetchService"
import ConfirmDialog from "../../widgets/ConfirmDialog"
import { FaCopy, FaTimes } from "react-icons/fa"
import { _launchGradlev2, launchGradleReuploadFailed } from "service/launchGradle"
import { launchYarnMoveToFreezeByUploadId } from "service/launchYarn"
import { profile } from "console"
import { UploadCycleTableData } from "mirror/types"
import InfoIconWithTooltip from "widgets/InfoIconWithTooltip"
import { ERROR_RED } from "constants/colors"
import { DD_MM_YYYY_WITH_TIME_FORMAT } from "utils/utils"
import moment from "moment"
import { ResultDisplayPopover } from "../../widgets/ResultDisplayPopover"
import Spinner from "widgets/Spinner"

const TASK_TYPE_ENUM = {
    VERIFY_UPLOAD_STATUS: "Verify Upload Status",
    FIND_MISSING: "Find Missing",
    REUPLOAD_FAILED: "Reupload of Failed-Items",
    REUPLOAD_MISSED: "Reupload of Missed-Items",
    ISOLATE_MISSING: "Isolate Missing",
    MOVE_TO_FREEZE: "Move to Freeze",
}

interface ActionButtonsProps {
    uploadCycleId: string,
    row: UploadCycleTableData,
    isLoading: boolean,
    setIsLoading: (value: boolean) => void,
    fetchData: () => void
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ uploadCycleId, row, isLoading, setIsLoading, fetchData }) => {
    const [openDialog, setOpenDialog] = useState(false)
    const [actionType, setActionType] = useState("")
    const [popoverAnchor, setPopoverAnchor] = useState<HTMLButtonElement | null>(null)
    const [popoverContent, setPopoverContent] = useState<string>("")
    const [reactComponent, setReactComponent] = useState<JSX.Element>(<></>)
    const [loading2, setLoading2] = useState(false);

    const calcRowUploadFailures = (row: UploadCycleTableData) => {
        const rowSucess = row.archiveProfileAndCount.reduce((acc, curr) => acc + (curr?.uploadSuccessCount || 0), 0)
        const rowFailures = row.totalCount - rowSucess;
        return `(${rowFailures}/${row.totalCount})`;
    }

    const confirm = (buttonText: string) => {
        setActionType(buttonText)
        setOpenDialog(true)
    }

    const _verifyUploadStatus = async () => {
        setIsLoading(true);
        const result = await verifyUploadStatusForUploadCycleId(uploadCycleId);
        console.log(`_verifyUploadStatus:result ${JSON.stringify(result)}`);
        setIsLoading(false);
        setPopoverContent(JSON.stringify(result, null, 2))
        setPopoverAnchor(document.getElementById('verify-upload-status-button') as HTMLButtonElement)
    };

    const launchReuploadMissed = async (uploadCycleId: string) => {
        setLoading2(true);
        const _res = await _launchGradlev2({
            uploadCycleId: uploadCycleId,
        }, "reuploadMissedViaUploadCycleId")
        console.log(`_res ${JSON.stringify(_res)}`)
        setLoading2(false);
        setPopoverContent(JSON.stringify(_res, null, 2))
        setPopoverAnchor(document.getElementById('find-missing-button') as HTMLButtonElement)
    }

       const _isolateMissing = async (uploadCycleId: string) => {
        setLoading2(true);
        const _res = await _launchGradlev2({
            uploadCycleId: uploadCycleId,
        }, "isolateMissingViaUploadCycleId")
        console.log(`_res ${JSON.stringify(_res)}`)
        setLoading2(false);
        setPopoverContent(JSON.stringify(_res, null, 2))
        setPopoverAnchor(document.getElementById('find-missing-button') as HTMLButtonElement)
    }
    
    const _findMissing = async () => {
        setIsLoading(true);
        const missedData = await findMissingTitles();
        console.log(`missedData ${missedData.length} ${JSON.stringify(missedData)}`)
        setIsLoading(false);
        const missingTitlesPanel = (
            <>
                {(missedData && missedData.length > 0) ?
                    <>
                        <Box sx={{ paddingBottom: "30px" }}>
                            <Button
                                variant="contained"
                                onClick={() => confirm(TASK_TYPE_ENUM.REUPLOAD_MISSED)}
                                size="small"
                                sx={{ width: "200px", marginTop: "20px" }}
                                disabled={loading2}>Reupload Missing ({(row.countIntended || 0) - (row?.totalQueueCount || 0)}/{row.countIntended})
                            </Button>
                        </Box>
                        <Box sx={{ paddingBottom: "30px" }}>
                            <Button
                                variant="contained"
                                onClick={() => confirm(TASK_TYPE_ENUM.ISOLATE_MISSING)}
                                size="small"
                                sx={{ width: "200px", marginTop: "20px" }}
                                disabled={loading2 || row.countIntended === 0}>Isolate Missing ({(row.countIntended || 0) - (row?.totalQueueCount || 0)}/{row.countIntended})
                            </Button>
                        </Box>
                        {
                            <>
                                <Typography>Missing Titles for {row.uploadCycleId}</Typography>
                                {
                                    missedData?.map((_data: { archiveProfile: string, missedCount: string, missed: string[] }, index: number) => {
                                        return (
                                            <>
                                                <Typography>({index + 1}) {_data.archiveProfile} ({_data.missedCount})</Typography>
                                                <Box sx={{ color: ERROR_RED }}>
                                                    {_data.missed.map((item: string, index2: number) => {
                                                        return (<Box>({index + 1}.{index2 + 1}) {item}</Box>)
                                                    })}
                                                </Box>
                                            </>
                                        )
                                    })
                                }
                            </>

                        }
                    </> :
                    <Typography>No Missing Titles for Upload Cycle with Id: {row.uploadCycleId} {missedData}</Typography>
                }
            </>);
        setReactComponent(missingTitlesPanel)
        setPopoverContent(JSON.stringify(missedData, null, 2))
        setPopoverAnchor(document.getElementById('find-missing-button') as HTMLButtonElement)
    };

    const _reuploadFailed = async () => {
        setIsLoading(true);
        const _resp = await launchGradleReuploadFailed(uploadCycleId || "");
        setIsLoading(false);
        setPopoverContent(JSON.stringify(_resp, null, 2))
        setPopoverAnchor(document.getElementById('reupload-failed-button') as HTMLButtonElement)
    };

    const findMissingTitles = async () => {
        const missed = await makePostCallWithErrorHandling({
            uploadCycleId: uploadCycleId,
        }, `uploadCycle/getUploadQueueUploadUsheredMissed`);
        console.log(`missed ${JSON.stringify(missed)}`)
        return missed?.response?.missedData
    }

    const _moveToFreeze = async () => {
        setIsLoading(true);
        const _resp = await launchYarnMoveToFreezeByUploadId({
            // profileAsCSV: profile,
            uploadCycleId: uploadCycleId,
            flatten: "true"
        });
        setIsLoading(false);
        setPopoverContent(JSON.stringify(_resp, null, 2))
        setPopoverAnchor(document.getElementById('move-to-freeze-button') as HTMLButtonElement)
    };

    const handleConfirm = async () => {
        console.log(`Confirmed: ${actionType} for Upload Cycle ID: ${uploadCycleId}`)
        setOpenDialog(false)
        
        // Set appropriate loading state immediately based on action type
        if (actionType === TASK_TYPE_ENUM.REUPLOAD_MISSED) {
            setLoading2(true);
        } else {
            setIsLoading(true);
        }
        
        try {
            if (actionType === TASK_TYPE_ENUM.VERIFY_UPLOAD_STATUS) {
                await _verifyUploadStatus();
                fetchData();
            } else if (actionType === TASK_TYPE_ENUM.FIND_MISSING) {
                await _findMissing();
            } else if (actionType === TASK_TYPE_ENUM.REUPLOAD_FAILED) {
                await _reuploadFailed();
                fetchData();
            } else if (actionType === TASK_TYPE_ENUM.REUPLOAD_MISSED) {
                await launchReuploadMissed(uploadCycleId);
                fetchData();
            } else if (actionType === TASK_TYPE_ENUM.MOVE_TO_FREEZE) {
                await _moveToFreeze();
                fetchData();
            } else if (actionType === TASK_TYPE_ENUM.ISOLATE_MISSING) {
                await _isolateMissing(uploadCycleId);
                fetchData();
            }
        } catch (error) {
            console.error(`Error executing ${actionType}:`, error);
        } finally {
            // Reset loading states in case they weren't reset in the individual functions
            if (actionType === TASK_TYPE_ENUM.REUPLOAD_MISSED) {
                setLoading2(false);
            } else {
                setIsLoading(false);
            }
        }
    }

    return (
        <>
            <Stack spacing={0.5}>
                <Button
                    id="verify-upload-status-button"
                    variant="outlined"
                    size="small"
                    onClick={(event) => confirm(TASK_TYPE_ENUM.VERIFY_UPLOAD_STATUS)}
                >
                    Verify Upload Status
                </Button>
                <Button
                    id="find-missing-button"
                    variant="outlined"
                    size="small"
                    disabled={isLoading || ((row.countIntended || 0) === (row?.totalQueueCount || 0))}
                    onClick={(event) => confirm(TASK_TYPE_ENUM.FIND_MISSING)}
                >
                    Find Missing ({(row.countIntended || 0) - (row?.totalQueueCount || 0)}/{row.countIntended})
                    <InfoIconWithTooltip input="Find Missing (Unqueued/Unushered) Failure Type 1" />
                </Button>
                <Button
                    id="reupload-failed-button"
                    variant="outlined"
                    size="small"
                    onClick={(event) => confirm(TASK_TYPE_ENUM.REUPLOAD_FAILED)}
                    disabled={isLoading || (row.allUploadVerified === true)}
                >
                    Reupload Failed {calcRowUploadFailures(row)}
                    <InfoIconWithTooltip input="Reupload Failed (Queued/Ushered/But Didnt Make it). Failure Type 2" />
                </Button>
                <Button
                    id="move-to-freeze-button"
                    variant="outlined"
                    size="small"
                    onClick={(event) => confirm(TASK_TYPE_ENUM.MOVE_TO_FREEZE)}
                    disabled={isLoading || (row?.moveToFreeze === true)}
                >
                    Move to Freeze
                    <InfoIconWithTooltip input="pnpm move Uploaded items to Freeze folder and disable this button" />
                </Button>
            </Stack>
            <ConfirmDialog
                openDialog={openDialog}
                handleClose={() => setOpenDialog(false)}
                setOpenDialog={setOpenDialog}
                invokeFuncOnClick={handleConfirm}
            />
            <ResultDisplayPopover 
                popoverAnchor={popoverAnchor} 
                setPopoverAnchor={setPopoverAnchor} 
                popoverContent={popoverContent} 
                actionType={actionType} 
                reactComponent={reactComponent} 
                setReactComponent={setReactComponent}
                loading={loading2}
            />

        </>
    )
}
