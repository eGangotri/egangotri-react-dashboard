import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper,
    TablePagination,
    Link, Typography,
    Button, Box, Popover, Stack, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import "pages/UploadCycles/UploadCycles.css"
import * as _ from 'lodash';
import moment from 'moment';

type DialogProps = {
    openDialog: boolean;
    handleClose: () => void
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
    invokeFuncOnClick?: (event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => Promise<void>
    invokeFuncOnClick2?: () => void;
    confirmDialogMsg?: string;
}

const ConfirmDialog: React.FC<DialogProps> = ({ openDialog,
    handleClose,
    setOpenDialog,
    invokeFuncOnClick,
    invokeFuncOnClick2,
    confirmDialogMsg = "Do you want to proceed?" }) => {

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!openDialog) {
            setIsSubmitting(false);
        }
    }, [openDialog]);

    const handleYesClick = async (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        if (invokeFuncOnClick) {
            await invokeFuncOnClick(e);
        }
    };

    const handleYesClick2 = () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        if (invokeFuncOnClick2) {
            invokeFuncOnClick2();
        }
    };

    return (
        <Dialog open={openDialog} onClose={handleClose}>
            <DialogTitle>Confirmation</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {confirmDialogMsg}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpenDialog(false)} color="primary" disabled={isSubmitting}>
                    No
                </Button>
                {invokeFuncOnClick ?
                    <Button onClick={handleYesClick} color="primary" autoFocus disabled={isSubmitting}>
                        Yes
                    </Button> : <></>
                }
                {invokeFuncOnClick2 ?
                    <Button onClick={handleYesClick2} color="primary" autoFocus disabled={isSubmitting}>
                        Yes
                    </Button> : <></>
                }
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmDialog;