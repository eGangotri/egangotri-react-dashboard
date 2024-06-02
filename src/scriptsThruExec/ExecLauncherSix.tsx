import React, { ChangeEvent, useEffect, useState } from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import { ExecType } from './ExecLauncherUtil';
import { Button, Checkbox, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';


const ExecLauncherSix: React.FC = () => {
    const [gDriveExcelName, setGDriveExcelName] = useState('');
    const [localListingExcelName, setLocalListingExcelName] = useState('');
    const [gDriveIntegrityCheckExcel, setGDriveIntegrityCheckExcel] = useState(''); 

    const [includeFilePath, setIncludeFilePath] = useState(false);
    const [fileNameLongerCheck, setFileNameLongerCheck] = useState(ExecType.FILE_NAME_LENGTH);

    const handleIncludeFilePath = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIncludeFilePath(event.target.checked);
        setFileNameLongerCheck(event.target.checked === true ? ExecType.FILE_NAME_LENGTH_INCLUDING_PATH : ExecType.FILE_NAME_LENGTH);

    };

    const loadFromLocalStorage = () => {
        let storedValue = localStorage.getItem('gDriveExcelName');
        console.log(`loadFromLocalStorage called ${storedValue}`)
        if (storedValue) {
            setGDriveExcelName(storedValue || "-");
        }

        let storedValue2 = localStorage.getItem('localListingExcelName');
        console.log(`loadFromLocalStorage called ${storedValue2}`)
        if (storedValue2) {
            setLocalListingExcelName(storedValue2);
        }
    }

    const loadFromLocalStorage2 = () => {
        let storedValue = localStorage.getItem('gDriveIntegrityCheckExcel');
        console.log(`gDriveIntegrityCheckExcel called ${storedValue}`)
        if (storedValue) {
            setGDriveIntegrityCheckExcel(storedValue || "-");
        }
    }

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
                    buttonText="Find Top N longest File Names in Folder"
                    placeholder='Folder Abs Path? Not Tested. Not Functional Maybe?'
                    userInputOneInfo="Make Sure Snap2HTML.exe is set in the Path"
                    secondTextBoxPlaceHolder='TopN Files to Display'
                    css={{ width: "250px" }}
                    execType={fileNameLongerCheck}
                    reactComponent={<Box>
                        <FormControlLabel
                            control={<Checkbox checked={includeFilePath} onChange={handleIncludeFilePath} />}
                            label="ALL- Not Just PDFs"
                        />
                    </Box>}
                />
            </Box>

            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                <ExecComponent
                    buttonText="Compare G-Drive and Local Excel"
                    placeholder='Absolute Path to G-Drive Excel'
                    secondTextBoxPlaceHolder='Absolute Path to Local Excel'
                    execType={ExecType.COMPARE_G_DRIVE_AND_LOCAL_EXCEL}
                    css={{ minWidth: "33vw" }}
                    css2={{ minWidth: "35vw" }}
                    textBoxOneValue={gDriveExcelName}
                    textBoxTwoValue={localListingExcelName}
                    thirdButton={<Button variant="contained" color="primary" onClick={loadFromLocalStorage} sx={{ marginRight: "10px", marginBottom: "10px" }}>Load From Local Storage</Button>}
                />

                <ExecComponent
                    buttonText="Upload to G-Drive based on Missed Files in Diff Excel"
                    placeholder='Absolute Path to Diff Excel'
                    secondTextBoxPlaceHolder='G-Drive Link for upload'
                    execType={ExecType.UPLOAD_MISSED_TO_GDRIVE}
                    css={{ minWidth: "33vw" }}
                    textBoxOneValue={gDriveIntegrityCheckExcel}
                    thirdButton={<Button variant="contained" color="primary" onClick={loadFromLocalStorage2} sx={{ marginRight: "10px", marginBottom: "10px" }}>Load From Local Storage</Button>}

                />

            </Box>
        </Box>

    );
}

export default ExecLauncherSix;
