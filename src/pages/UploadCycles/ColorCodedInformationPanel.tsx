import React from 'react';
import { Typography } from '@mui/material';
import { BURGUNDY_RED, LIGHT_RED, SUCCESS_GREEN } from 'constants/colors';

export const ColorCodeInformationPanel = () => {
    return (
        <Typography variant="h6">
            <ul>
                <li style={{ color: LIGHT_RED }}>Light Red Row Highlight Color implies Intended Count mismatch</li>
                <li style={{ color: BURGUNDY_RED }}>Burgundy Red implies Failed Uploads</li>
                <li style={{ color: SUCCESS_GREEN }}>Green implies All Intended Uploads uploaded and verfied</li>
                <li>White implies All Uploaded but Actual Upload Verification not done.</li>
            </ul>
        </Typography>
    )
}