import { FormatStrikethrough as FormatStrikethroughIcon } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { DISPOSE_TOGGLE_CLASS } from "./constants";

export const getDisposeActionColumn = (params: any, handleDisposeRow: (id: string, e: any) => void) => {
    const isDisposed: boolean = !!params.row.disposed;

    return (
        <div className="flex items-center justify-center h-full">
            <Tooltip title={isDisposed ? "Click to Restore" : "Mark as Disposed"} arrow>
                <IconButton
                    size="small"
                    className={DISPOSE_TOGGLE_CLASS}
                    onClick={(e) => handleDisposeRow(params.row._id, e as any)}
                    sx={{
                        color: isDisposed ? "error.main" : "action.disabled",
                        transition: "color 0.2s ease",
                        "&:hover": {
                            color: isDisposed ? "error.dark" : "text.primary",
                            bgcolor: isDisposed ? "error.light" : "action.hover",
                        },
                    }}
                >
                    <FormatStrikethroughIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        </div>
    );
};