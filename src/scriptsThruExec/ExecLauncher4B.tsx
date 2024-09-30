import React, { useState } from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import { ExecType } from './ExecLauncherUtil';
import { Button, Typography } from '@mui/material';

import {
    TOP_N_FILE_LOCAL_STORAGE_KEY
} from 'service/consts';

const ExecLauncher4B: React.FC = () => {
    const [topNFileDumpPath, setTopNFileDumpPath] = useState('');

    const loadTopNPathFromLocalStorage = () => {
        let storedValue = localStorage.getItem(TOP_N_FILE_LOCAL_STORAGE_KEY);
        console.log(`loadFromLocalStorage called ${storedValue}`)
        if (storedValue) {
            setTopNFileDumpPath(storedValue);
        }
    }

    return (
        <Box display="flex" gap={4} mb={2} flexDirection="row">
            <Box display="flex" alignItems="center" gap={4} mb={2} flexDirection="column">
                <ExecComponent
                    buttonText="Get First and Last N Pages"
                    placeholder='Absolute Path to PDFs Folder(s) as CSV'
                    secondTextBoxPlaceHolder='Absolute Path to Destination Folder'
                    thirdTextBoxPlaceHolder='N Pages to Extract from Start and End'
                    thirdTextBoxDefaultValue={"10"}
                    execType={ExecType.GET_FIRST_N_PAGES}
                    css={{ minWidth: "23vw" }}
                    css2={{ minWidth: "23vw" }}
                    css3={{ marginTop: "30px", minWidth: "23vw" }}

                />

                <Box>
                    {topNFileDumpPath && <Typography variant="h6" component="div" gutterBottom>Path to Top-N PDFs {topNFileDumpPath} for dumping to G-Drive</Typography>}
                </Box>

                <Box>
                    <Typography variant="h6" component="div" gutterBottom>
                        <ol>
                            <li>1. Create Reduced PDFs with First and Last n Pages</li>
                            <li>2. Manual Task. Dump Reduced PDFs to Google Drive</li>
                            <li>3. Generate Excel of Google Drive Links of Reduced PDF</li>
                            <li>4. Manual Task. Upload Pdf to Google Drive for Renamer</li>
                            <li>5. Download Excel and rename local files</li>
                        </ol>
                    </Typography>
                </Box>
            </Box>

            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                <ExecComponent
                    buttonText="Create G-Drive Excel Renamer-Version"
                    placeholder='Enter Google Drive Link(s)/Identifiers as csv'
                    secondTextBoxPlaceHolder='Enter Folder Name (not path)'
                    execType={ExecType.GenExcelOfGoogleDriveLinkForRenameFilesExcel}
                    css={{ minWidth: "23vw" }}
                    thirdButton={<Button
                        variant="contained"
                        color="primary"
                        onClick={loadTopNPathFromLocalStorage}
                        sx={{ marginRight: "10px", marginBottom: "10px" }}>Load From Local Storage</Button>}
                />

                <ExecComponent buttonText="Rename Files via Excel"
                    placeholder='Excel File Path'
                    secondTextBoxPlaceHolder='Profile or Abs Path'
                    execType={ExecType.RENAME_FIES_VIA_EXCEL}
                    css={{ width: "350px" }}
                    css2={{ width: "350px" }}
                />
            </Box>
            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                <ExecComponent
                    buttonText="Convert all .txt encodings in Folder"
                    placeholder='Folder Full Path'
                    secondTextBoxPlaceHolder='Encoding From'
                    thirdTextBoxPlaceHolder='Encoding To'
                    execType={ExecType.CONVERT_MULTIPLE_TXT_FILE_SCRIPTS}
                    userInputOneInfo="any folder with multiple .txt in any number of subfolders"
                    userInputTwoInfoNonMandatory="Case Sensitive.Encoding From. Example 'Devanagari'. Names from https://www.aksharamukha.com/explore"
                    userInputThreeInfoNonMandatory="Case Sensitive.Encoding From. Example 'Roman'.  Names from https://www.aksharamukha.com/explore"
                    css={{ width: "250px" }}
                    css2={{ width: "450px" }}
                />

                <ExecComponent
                    buttonText="Convert Script"
                    placeholder='Text to Convert'
                    secondTextBoxPlaceHolder='Encoding From'
                    thirdTextBoxPlaceHolder='Encoding To'
                    execType={ExecType.CONVERT_TEXT_SCRIPT}
                    userInputOneInfo="any folder with multiple .txt in any number of subfolders"
                    userInputTwoInfoNonMandatory="Case Sensitive.Encoding From. Example 'Devanagari'. Names from https://www.aksharamukha.com/explore"
                    userInputThreeInfoNonMandatory="Case Sensitive.Encoding To. Example 'Roman'.  Names from https://www.aksharamukha.com/explore"
                    css={{ width: "250px" }}
                    css2={{ width: "450px" }}
                />

                <ExecComponent buttonText="Use Bulk Rename Conventions"
                    placeholder='Use Bulk Rename Conventions'
                    execType={ExecType.UseBulkRenameConventions} />
            </Box>
        </Box>

    );
}

export default ExecLauncher4B;
