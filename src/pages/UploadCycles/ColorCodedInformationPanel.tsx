import React from 'react';
import { Typography } from '@mui/material';

export const ColorCodeInformationPanel = () => {
    return (
        <Typography variant="h6">
            <ul>
                <li className="text-yellow-500">Yellow Row Highlight Color implies Intended Count mismatch</li>
                <li className="text-red-800">Burgundy Red implies Failed Uploads</li>
                <li className="text-brown-600">Brown implies All Non-Missed uploaded and verfied but check for Missed</li>
                <li className="text-green-600">Green implies All Intended Uploads uploaded and verfied</li>
                <li>White implies All Uploaded but Actual Upload Verification not done.</li>
            </ul>
        </Typography>
    )
}