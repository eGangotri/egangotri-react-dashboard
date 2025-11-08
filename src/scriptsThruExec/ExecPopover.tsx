import React from 'react';
import { Popover, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export interface ExecPopoverProps {
  id?: string;
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  children?: React.ReactNode;
}

const ExecPopover: React.FC<ExecPopoverProps> = ({ id, open, anchorEl, onClose, children }) => {
  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      sx={{
        width: '80%',
        height: '80%',
      }}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
    >
      <Box sx={{ p: 2, width: '80%', height: '10%' }}>
        <Typography sx={{ p: 2 }}>
          {children}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
    </Popover>
  );
};

export default ExecPopover;
