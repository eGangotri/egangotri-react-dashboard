import { Box, Button } from "@mui/material";
import { useState } from "react";
import { FileTransferPopup } from "./FilesTransferPopup";

export function FileWidget({ files, label }: { files: string[]; label: string }) {
    const [open, setOpen] = useState(false)

    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const nonEmptyFiles = files?.filter((file) => file !== "") || []

    return (
        <>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Button variant="outlined" size="small" onClick={handleOpen} disabled={nonEmptyFiles?.length === 0}>
                    View ({nonEmptyFiles?.length === 0 ? 0 : nonEmptyFiles?.length})
                </Button>
            </Box>
            <FileTransferPopup open={open} onClose={handleClose} files={nonEmptyFiles} title={label} />
        </>
    )
}
