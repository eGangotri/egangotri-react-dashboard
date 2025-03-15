import React, { useState } from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText, IconButton, Tooltip, TextField, InputAdornment } from "@mui/material"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import SearchIcon from "@mui/icons-material/Search"

interface FileTransferPopupProps {
  open: boolean
  onClose: () => void
  files: string[]
  title: string
}

export function FileTransferPopup({ open, onClose, files, title }: FileTransferPopupProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredFiles = files.filter(file => 
    file.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyAll = () => {
    navigator.clipboard.writeText(filteredFiles.join('\n'));
  };

  const handleCopyAsCommaSeparated = () => {
    navigator.clipboard.writeText(filteredFiles.join(', '));
  };

  const handleCopyFilenamesAsCSV = () => {
    const filenames = filteredFiles.map(file => {
      // Extract filename with extension from the full path
      const parts = file.split(/[\/\\]/); // Split by both forward and backward slashes
      return parts[parts.length - 1]; // Get the last part which is the filename
    });
    navigator.clipboard.writeText(filenames.join(', '));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {title}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ marginRight: 2, width: '200px' }}
          />
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
          <Tooltip title="Copy Filenames as CSV">
            <IconButton
              size="small"
              onClick={handleCopyFilenamesAsCSV}
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
          {filteredFiles.map((file, index) => (
            <ListItem key={index}>
              <ListItemText primary={file} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  )
}