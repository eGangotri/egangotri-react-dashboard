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
import ConfirmDialog from "../../widgets/UploadDialog"
import Spinner from "widgets/Spinner"
import { FaCopy, FaTimes } from "react-icons/fa"
import { _launchGradlev2, launchGradleReuploadFailed } from "service/launchGradle"
import { launchYarnMoveToFreezeByUploadId } from "service/launchYarn"
import { profile } from "console"
import { UploadCycleTableData } from "mirror/types"
import InfoIconWithTooltip from "widgets/InfoIconWithTooltip"
import { ERROR_RED } from "constants/colors"
import { DD_MM_YYYY_WITH_TIME_FORMAT } from "utils/utils"
import moment from "moment"

export const UploadCycleListPopover: React.FC<{
    uploadCycleId: string,
    row: UploadCycleTableData,
    popoverAnchor: HTMLButtonElement | null,
    setPopoverAnchor: (anchor: HTMLButtonElement | null) => void,
    popoverContent: string,
    actionType: string,
    reactComponent?: JSX.Element,
    setReactComponent: (component: JSX.Element) => void

}> = ({ uploadCycleId, row, popoverAnchor, setPopoverAnchor, 
    popoverContent, actionType, reactComponent, setReactComponent }) => {

    const handleCopyContent = () => {
        navigator.clipboard.writeText(popoverContent)
    }

    const handleClosePopover = () => {
        setPopoverAnchor(null)
        setReactComponent(<></>);
    }

    return (<Popover
        open={Boolean(popoverAnchor)}
        anchorEl={popoverAnchor}
        onClose={handleClosePopover}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
        }
        }
        transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
        }}
    >
        <Paper className="p-4 max-w-md">
            <div className="flex justify-between items-center mb-2">
                <Typography variant="h6">{actionType} Result</Typography>
                <div>
                    <IconButton onClick={handleCopyContent} size="small" className="mr-2">
                        <FaCopy className="h-4 w-4" />
                    </IconButton>
                    <IconButton onClick={handleClosePopover} size="small">
                        <FaTimes className="h-4 w-4" />
                    </IconButton>
                </div>
            </div>
            <div className="max-h-96 overflow-auto">
                <pre className="whitespace-pre-wrap break-words">
                    {reactComponent}
                </pre>
            </div>
            <div className="max-h-96 overflow-auto">
                <pre className="whitespace-pre-wrap break-words">
                    <Typography variant="body2">Res. at {moment().format(DD_MM_YYYY_WITH_TIME_FORMAT)}:</Typography>
                    {popoverContent}
                </pre>
            </div>
        </Paper>
    </Popover >
    )
}