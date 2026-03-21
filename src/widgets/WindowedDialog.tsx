import React, { useState } from 'react';
import { Dialog, DialogTitle, Box, IconButton, DialogProps, Typography } from '@mui/material';
import { FaWindowMinimize, FaWindowMaximize, FaWindowRestore, FaTimes } from 'react-icons/fa';

export interface WindowedDialogProps extends Omit<DialogProps, 'title'> {
    title?: React.ReactNode;
    onCloseDialog?: () => void;
}

const WindowedDialog: React.FC<WindowedDialogProps> = (props) => {
    const { title, children, onCloseDialog, maxWidth, fullWidth, open, ...rest } = props;
    const [state, setState] = useState<'normal' | 'minimized' | 'maximized'>('normal');

    React.useEffect(() => {
        if (!open) {
            setState('normal');
        }
    }, [open]);

    const handleClose = () => {
        if (onCloseDialog) {
            onCloseDialog();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onCloseDialog}
            fullScreen={state === 'maximized'}
            maxWidth={state === 'minimized' ? 'xs' : maxWidth}
            fullWidth={fullWidth}
            hideBackdrop={state === 'minimized'}
            disableEnforceFocus={state === 'minimized'}
            sx={state === 'minimized' ? {
                pointerEvents: 'none',
                '& .MuiDialog-container': {
                    alignItems: 'flex-end',
                    justifyContent: 'flex-end',
                    pointerEvents: 'none',
                },
                '& .MuiPaper-root': {
                    pointerEvents: 'auto',
                    m: 2,
                    mb: 0,
                    width: 350,
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                }
            } : {}}
            {...rest}
        >
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f0f0f0', borderBottom: '1px solid #ddd' }}>
                <Box sx={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {typeof title === 'string' ? <Typography variant="h6">{title}</Typography> : title}
                </Box>
                <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                    <IconButton size="small" onClick={() => setState(state === 'minimized' ? 'normal' : 'minimized')}>
                        <FaWindowMinimize size={14} />
                    </IconButton>
                    <IconButton size="small" onClick={() => setState(state === 'maximized' ? 'normal' : 'maximized')}>
                        {state === 'maximized' ? <FaWindowRestore size={14} /> : <FaWindowMaximize size={14} />}
                    </IconButton>
                    <IconButton size="small" onClick={handleClose}>
                        <FaTimes size={14} />
                    </IconButton>
                </Box>
            </DialogTitle>
            <Box sx={{ display: state === 'minimized' ? 'none' : 'block', p: 0 }}>
                {children}
            </Box>
        </Dialog>
    );
};

export default WindowedDialog;
