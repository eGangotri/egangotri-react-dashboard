import React from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText } from "@mui/material"

interface FileTransferPopupProps {
  open: boolean
  onClose: () => void
  files: string[]
  title: string
}

export function FileTransferPopup({ open, onClose, files, title }: FileTransferPopupProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <List>
          {files.map((file, index) => (
            <ListItem key={index}>
              <ListItemText primary={file} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

