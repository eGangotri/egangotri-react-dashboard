import React, { ChangeEvent, useEffect, useState } from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import { ExecType } from './ExecLauncherUtil';
import { FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';


const ExecLauncherSix: React.FC = () => {
    const [gDriveExcelName, setGDriveExcelName] = useState('');

    useEffect(() => {
        let storedValue = localStorage.getItem('gDriveExcelName');
        console.log(`useEffect called ${storedValue}`)
        if (storedValue) {
            setGDriveExcelName(storedValue);
        }
    }, []);

    return (
        <Box display="flex" gap={4} mb={2} flexDirection="row">

            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                <ExecComponent
                    buttonText="Create G-Drive Excel"
                    placeholder='Enter Google Drive Link(s)/Identifiers as csv'
                    secondTextBoxPlaceHolder='Enter Folder Name (not path)'
                    execType={ExecType.GenExcelOfGoogleDriveLinkForAll}
                    css={{ minWidth: "23vw" }}
                />

                <Box>
                    <Typography variant="h6" component="div" gutterBottom>
                        <ol>
                            <li>1. Generate Excel of Google Drive Links</li>
                            <li>2. Generate Excel of Local</li>
                            <li>3. Compare Excel 1-2</li>
                        </ol>
                    </Typography>
                </Box>
            </Box>

            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                <ExecComponent buttonText="List all Files in Local Folder as Excel - Yarn"
                    placeholder='Folder Path or Freezed Profile'
                    execType={ExecType.GenListingsofLocalFolderAsAllYarn}
                />

                <ExecComponent
                    buttonText="Find Files longer than Threshhold"
                    placeholder='Folder Abs Path? Not Tested. Not Functional Maybe?'
                    userInputOneInfo="Make Sure Snap2HTML.exe is set in the Path"
                    secondTextBoxPlaceHolder='Enter Threshhold value'
                    css={{ width: "250px" }}
                    execType={ExecType.SNAP_TO_HTML} />
            </Box>

            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                <ExecComponent
                    buttonText="Compare G-Drive and Local Excel"
                    placeholder='Absolute Path to G-Drive Excel Folder'
                    secondTextBoxPlaceHolder='Absolute Path to Local Excel Folder'
                    execType={ExecType.COMPARE_G_DRIVE_AND_LOCAL_EXCEL}
                    css={{ minWidth: "33vw" }}
                    css2={{ minWidth: "35vw" }}
                    userInputOneInfo="It will pick the latest Excel from the Folders"
                />

            </Box>
        </Box>

    );
}

export default ExecLauncherSix;
