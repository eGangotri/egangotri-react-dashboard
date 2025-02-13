import type React from "react"
import { useState } from "react"
import {
    Button, Stack
} from "@mui/material"
import { verifyUploadStatusForUploadCycleId } from "service/BackendFetchService"
import UploadDialog from "./UploadDialog"

const TASK_TYPE_ENUM = {
    VERIFY_UPLOAD_STATUS: "Verify Upload Status",
    FIND_MISSING: "Find Missing",
    REUPLOAD_FAILED: "Reupload Failed",
    MOVE_TO_FREEZE: "Move to Freeze",
}

export const ActionButtons: React.FC<{ uploadCycleId: string }> = ({ uploadCycleId }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [openDialog, setOpenDialog] = useState(false)
    const [actionType, setActionType] = useState("")

    const handleClick = (buttonText: string,) => {
        setActionType(buttonText)
        setOpenDialog(true)
    }

    const _verifyUploadStatus = async (
    ) => {
        // setIsLoading(true);
        const result = await verifyUploadStatusForUploadCycleId(uploadCycleId);
        console.log(`_verifyUploadStatus:result ${JSON.stringify(result)}`);
        //setIsLoading(false);
        // setFailedUploadsForPopover(<ExecResponsePanel response={result} />);
        // setAnchorEl3(currentTarget);
    };

    const handleConfirm = async () => {
        console.log(`Confirmed: ${actionType} for Upload Cycle ID: ${uploadCycleId}`)
        // Implement the actual action here
        if (actionType === TASK_TYPE_ENUM.VERIFY_UPLOAD_STATUS) {
            console.log(`Confirmed: ${actionType} for Upload Cycle ID: ${uploadCycleId}`)
            _verifyUploadStatus();
        }
        setOpenDialog(false)
    }

    return (
        <>
            <Stack spacing={0.5}>
                <Button variant="outlined" size="small" onClick={() => handleClick(TASK_TYPE_ENUM.VERIFY_UPLOAD_STATUS)}>
                    Verify Upload Status
                </Button>
                <Button variant="outlined" size="small" onClick={() => handleClick("Find Missing")}>
                    Find Missing
                </Button>
                <Button variant="outlined" size="small" onClick={() => handleClick("Reupload Failed")}>
                    Reupload Failed
                </Button>
                <Button variant="outlined" size="small" onClick={() => handleClick("Move to Freeze")}>
                    Move to Freeze
                </Button>
            </Stack>
            <UploadDialog
                openDialog={openDialog}
                handleClose={() => setOpenDialog(false)}
                setOpenDialog={setOpenDialog}
                invokeFuncOnClick={handleConfirm}
            />
        </>
    )
}

