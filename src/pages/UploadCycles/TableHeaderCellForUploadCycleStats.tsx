import { IconButton, TableCell, Tooltip } from '@mui/material'
import React from 'react'
import InfoIcon from '@mui/icons-material/Info';

export const TableHeaderCellForUploadCycleStats: React.FC = () => {
    return (
        <TableCell>Uploads Intended
            <Tooltip title="Right at the time uploads are initiated a snapshot of the Total Intended Count, Profile Name and Titles is taken. This column is for that reading">
                <IconButton aria-label="info"><InfoIcon />
                </IconButton>
            </Tooltip>
        </TableCell>
    )
}

