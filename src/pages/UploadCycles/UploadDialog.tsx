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
    invokeFuncOnClick?: (event: React.MouseEvent<HTMLButtonElement|HTMLDivElement>) => Promise<void>
    invokeFuncOnClick2?: () => void;
}

const UploadDialog: React.FC<DialogProps> = ({ openDialog,
    handleClose,
    setOpenDialog,
    invokeFuncOnClick,
    invokeFuncOnClick2 }) => {
    return (
        <Dialog open={openDialog} onClose={handleClose}>
            <DialogTitle>Confirmation</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Do you want to proceed?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpenDialog(false)} color="primary">
                    No
                </Button>
                {invokeFuncOnClick ?
                    <Button onClick={(e) => invokeFuncOnClick != null && invokeFuncOnClick(e)} color="primary" autoFocus>
                        Yes
                    </Button> :<></>
                }
                   {invokeFuncOnClick2 ?
                    <Button onClick={(e) => invokeFuncOnClick2 != null && invokeFuncOnClick2()} color="primary" autoFocus>
                        Yes
                    </Button> :<></>
                }
            </DialogActions>
        </Dialog>
    )
}

export default UploadDialog;