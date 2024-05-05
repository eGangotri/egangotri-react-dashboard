import React from 'react';
import { IconButton, TableCell, Tooltip, Typography } from "@mui/material"
import InfoIcon from '@mui/icons-material/Info';

export const TableHeaderCellForEqualityCount: React.FC = () => {

    const infoText = (
        <>
            <Typography>Four Set of Checks</Typography>
            <Typography>The Intended Count at the Beginning of the Cycle(If this is higher then find the missine one by going to Titles)</Typography>
            <Typography>Count of Items Queued</Typography>
            <Typography>Count of Items Ushered</Typography>
            <Typography>Finally Check for All Items properly uploaded post-ushering(Verify Upload Status)</Typography>
        </>
    )

    return (
        <TableCell>Intended/Ushered/Queued Equality
            <Tooltip title={infoText}>
                <IconButton aria-label="info"><InfoIcon />
                </IconButton>
            </Tooltip>
            <Typography>Intended count == Queued Count == Ushered Count. Then Manual Upload Verifcation</Typography>
        </TableCell>
    )
}
