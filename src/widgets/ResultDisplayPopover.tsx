import React from "react"
import {
    Button,
    Popover,
    Typography,
    IconButton,
    Paper,
    Box
} from "@mui/material"
import { FaCopy, FaTimes } from "react-icons/fa"
import moment from "moment"
import { DD_MM_YYYY_WITH_TIME_FORMAT } from "utils/utils"
import Spinner from "../widgets/Spinner"

export const ResultDisplayPopover: React.FC<{
    popoverAnchor: HTMLButtonElement | null,
    setPopoverAnchor: (anchor: HTMLButtonElement | null) => void,
    popoverContent: string,
    actionType: string,
    reactComponent?: JSX.Element,
    setReactComponent?: (component: JSX.Element) => void,
    loading?: boolean
}> = ({ popoverAnchor, setPopoverAnchor,
    popoverContent, actionType, reactComponent, setReactComponent, loading = false }) => {

        const handleCopyContent = () => {
            navigator.clipboard.writeText(popoverContent)
        }

        const handleClosePopover = () => {
            setPopoverAnchor(null)
            if (setReactComponent) {
                setReactComponent(<></>);
            }
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
                    <Typography variant="h6">{actionType}</Typography>
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
                        {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}><Spinner /></Box> : popoverContent}
                    </pre>
                </div>
            </Paper>
        </Popover >
        )
    }