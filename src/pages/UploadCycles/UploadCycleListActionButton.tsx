import React, { useState } from "react"
import {
    Button,
    Stack,
    Popover,
    Typography,
    IconButton,
    Paper,
    Box,
    Icon
} from "@mui/material"
import ConfirmDialog from "../../widgets/ConfirmDialog"
import { UploadCycleTableData } from "mirror/types"
import InfoIconWithTooltip from "widgets/InfoIconWithTooltip"
import { ResultDisplayPopover } from "../../widgets/ResultDisplayPopover"
import { useUploadCycleActions, TASK_TYPE_ENUM } from "./useUploadCycleActions"
import { calcRowUploadFailures } from "./utils"
import ExecPopover from 'scriptsThruExec/ExecPopover';
import ExecResponsePanel from "scriptsThruExec/ExecResponsePanel";

interface ActionButtonsProps {
    uploadCycleId: string,
    row: UploadCycleTableData,
    isLoading: boolean,
    setIsLoading: (value: boolean) => void,
    fetchData: () => void
}

export const ActionButtonsDiscard: React.FC<ActionButtonsProps> = ({ uploadCycleId, row, isLoading, setIsLoading, fetchData }) => {
    const [openDialog, setOpenDialog] = useState(false)
    const [actionType, setActionType] = useState("")
    const [popoverAnchor, setPopoverAnchor] = useState<HTMLButtonElement | null>(null)
    const [apiResult, setApiResult] = useState<JSX.Element | null>(null)
    const [loading2, setLoading2] = useState(false);

    const confirm = (type: string) => {
        setActionType(type)
        setOpenDialog(true)
    }

    const {
        handleVerifyUploadStatus,
        handleFindMissing,
        handleReupload,
        handleIsolateUploadFailures,
        handleMoveToFreeze,
        handleIsolateMissing,
        handleLaunchReuploadMissed
    } = useUploadCycleActions({
        setIsLoading,
        setPopoverTitle: setActionType,
        setApiResult,
        setPopoverAnchor,
        fetchData
    });

    const handleConfirm = async () => {
        console.log(`Confirmed: ${actionType} for Upload Cycle ID: ${uploadCycleId}`)
        setOpenDialog(false)

        try {
            if (actionType === TASK_TYPE_ENUM.VERIFY_UPLOAD_STATUS) {
                await handleVerifyUploadStatus(uploadCycleId);
            } else if (actionType === TASK_TYPE_ENUM.FIND_MISSING) {
                await handleFindMissing(uploadCycleId);
            } else if (actionType === TASK_TYPE_ENUM.REUPLOAD_FAILED) {
                await handleReupload(uploadCycleId);
            } else if (actionType === TASK_TYPE_ENUM.REUPLOAD_MISSED) {
                await handleLaunchReuploadMissed(uploadCycleId);
            } else if (actionType === TASK_TYPE_ENUM.MOVE_TO_FREEZE) {
                await handleMoveToFreeze(uploadCycleId);
            } else if (actionType === TASK_TYPE_ENUM.ISOLATE_MISSING) {
                await handleIsolateMissing(uploadCycleId);
            } else if (actionType === TASK_TYPE_ENUM.ISOLATE_UPLOAD_FAILED) {
                await handleIsolateUploadFailures(uploadCycleId);
            }
        } catch (error) {
            console.error(`Error executing ${actionType}:`, error);
        }
    }

    return (
        <>
            <Stack spacing={0.5}>
                <Button
                    id={`verify-button-${uploadCycleId}`}
                    variant="outlined"
                    size="small"
                    onClick={(event) => confirm(TASK_TYPE_ENUM.VERIFY_UPLOAD_STATUS)}
                >
                    Verify Upload Status
                </Button>
                <Button
                    id={`find-missing-button-${uploadCycleId}`}
                    variant="outlined"
                    size="small"
                    disabled={isLoading || ((row.countIntended || 0) === (row?.totalQueueCount || 0))}
                    onClick={(event) => confirm(TASK_TYPE_ENUM.FIND_MISSING)}
                >
                    -Find Missing ({(row.countIntended || 0) - (row?.totalQueueCount || 0)}/{row.countIntended})
                    <InfoIconWithTooltip input="Find Missing (Unqueued/Unushered) Failure Type 1" />
                </Button>
                <Box sx={{ display: 'flex', gap: 0.5, width: '100%' }}>
                    <Button
                        id={`reupload-button-${uploadCycleId}`}
                        variant="outlined"
                        size="small"
                        onClick={(event) => confirm(TASK_TYPE_ENUM.REUPLOAD_FAILED)}
                        disabled={isLoading || (row.allUploadVerified === true)}
                        sx={{ flex: 5, height: 32, minHeight: 32, paddingY: 0 }}
                    >
                        Reupload {calcRowUploadFailures(row)}
                        <InfoIconWithTooltip input="Reupload Failed (Queued/Ushered/But Didnt Make it). Failure Type 2" />
                    </Button>
                    <Button
                        id={`isolate-failures-button-${uploadCycleId}`}
                        variant="outlined"
                        size="small"
                        onClick={(event) => confirm(TASK_TYPE_ENUM.ISOLATE_UPLOAD_FAILED)}
                        disabled={isLoading || (row.allUploadVerified === true)}
                        sx={{ flex: 1, height: 32, minHeight: 32, paddingY: 0 }}

                    >
                        <InfoIconWithTooltip input="Isolate Upload Failed" />
                    </Button>
                </Box>
                <Button
                    id={`freeze-button-${uploadCycleId}`}
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
            <ExecPopover
                open={Boolean(popoverAnchor)}
                anchorEl={popoverAnchor}
                onClose={() => setPopoverAnchor(null)}
            >
                {apiResult && (
                    <Box>
                        <Typography variant="h6" sx={{ mb: 2 }}>{actionType}</Typography>
                        {apiResult}
                    </Box>
                )}
            </ExecPopover>

        </>
    )
}
