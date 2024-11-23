import React from 'react';
import { Typography } from '@mui/material';
import { GREEN_TO_YELLOW_TEXT, RED_TO_YELLOW } from 'constants/colors';

export const ColorCodeInformationPanel = () => {
    return (
        <Typography variant="h6">
            <ul className="text-sm">
                <li className="text-yellow-500">Yellow Row Highlight Color implies Missed Uploads</li>
                <li className="bg-gradient-to-r from-yellow-800 to-red-800 bg-clip-text text-transparent">
                    Yellow-Red Gradient implies Failed Uploads & Missed Uploads</li>
                <li className="bg-gradient-to-r from-green-800 to-yellow-800 bg-clip-text text-transparent">
                    Green-Yellow Gradient implies No Failed Uploads but Missed Uploads</li>
                <li className="text-red-800">Burgundy Red implies Failed Uploads But not Missed</li>
                <li className="text-green-600">Green implies All Intended Uploads uploaded & verfied</li>
                <li>White implies All Uploaded but Actual Upload Verification not done.</li>
            </ul>
        </Typography>
    )
}