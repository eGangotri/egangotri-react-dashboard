import React, { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import { Button, Typography, CircularProgress, FormControlLabel } from '@mui/material';
import TextField from '@mui/material/TextField';
import { makePostCall } from 'service/ApiInterceptor';
import PdfMergeHistoryTracker from './PdfMergeHistoryTracker';
import PdfUtil from './PdfUtil';
import ExecComponent from './ExecComponent';
import { ExecType } from './ExecLauncherUtil';

const PdfRepairModule: React.FC = () => {

    return (
        <Box display="flex" gap={4} mb={2} flexDirection="row">
            <Box sx={{ minWidth: '45vw' }}>
                <Box sx={{ mt: 5 }}>
                    <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                        <ExecComponent
                            buttonText="Repair All PDFs"
                            placeholder='Enter Folder Path of corrupted Pdfs'
                            execType={ExecType.REPAIR_PDF}
                            userInputOneInfo='Path specified will be repaired and dumped into a new folder with -repaired as suffix'
                            css={{
                                width: "450px"
                            }}
                        />
                    </Box>
                </Box>
                <Box sx={{ mt: 5 }}>
                    <PdfUtil />
                </Box>
            </Box>


        </Box >

    );
}

export default PdfRepairModule;
