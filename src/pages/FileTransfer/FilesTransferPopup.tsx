import React from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText, IconButton, Tooltip } from "@mui/material"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"

interface FileTransferPopupProps {
  open: boolean
  onClose: () => void
  files: string[]
  title: string
}

export function FileTransferPopup({ open, onClose, files, title }: FileTransferPopupProps) {
  const handleCopyAll = () => {
    navigator.clipboard.writeText(files.join('\n'));
  };

  const handleCopyAsCommaSeparated = () => {
    navigator.clipboard.writeText(files.join(', '));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {title}
        <div>
          <Tooltip title="Copy All">
            <IconButton
              size="small"
              onClick={handleCopyAll}
              sx={{ marginLeft: 2 }}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Copy as Comma Separated">
            <IconButton
              size="small"
              onClick={handleCopyAsCommaSeparated}
              sx={{ marginLeft: 2 }}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Button onClick={onClose} sx={{ marginLeft: 2 }}>Close</Button>
        </div>
      </DialogTitle>
      <DialogContent dividers>
        <List>
          {files.map((file, index) => (
            <ListItem key={index}>
              <ListItemText primary={file} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  )
}