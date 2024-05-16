import React, { useState } from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import { ExecType } from './ExecLauncherUtil';

const ExecLauncherSix: React.FC = () => {

    return (
        <Box display="flex" gap={4} mb={2} flexDirection="row">
            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                <ExecComponent
                    buttonText="Find Files longer than Threshhold"
                    placeholder='Folder Abs Path'
                    userInputOneInfo="Make Sure Snap2HTML.exe is set in the Path"
                    secondTextBoxPlaceHolder='Enter Threshhold value'
                    css={{ width: "250px" }}
                    execType={ExecType.SNAP_TO_HTML} />
            </Box>
        </Box>
    );
}

export default ExecLauncherSix;
