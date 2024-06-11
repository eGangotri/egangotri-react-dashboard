import React, { useState } from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import { ExecType } from './ExecLauncherUtil';
import { UPLOADABLE_EXCELS_V1, UPLOADABLE_EXCELS_V1_PROFILES, UPLOADABLE_EXCELS_V3, UPLOADABLE_EXCELS_V3_PROFILES } from '../service/consts';
import { Button } from '@mui/material';

const ExecLauncherTwo: React.FC = () => {
    const [uploadableExcelV3Profiles, setUploadableExcelV3Profiles] = useState('');
    const [uploadablesExcelV3, setUploadablesExcelV3] = useState('');
    
    const [uploadableExcelV1Profiles, setUploadableExcelV1Profiles] = useState('');
    const [uploadablesExcelV1, setUploadablesExcelV1] = useState('');

    const loadFromLocalStorageForV3 = () => {
        let storedValue = localStorage.getItem(`${UPLOADABLE_EXCELS_V3_PROFILES}`);
        let storedValue2 = localStorage.getItem(`${UPLOADABLE_EXCELS_V3}`);
        console.log(`loadFromLocalStorage called ${storedValue}`)
        if (storedValue) {
            setUploadableExcelV3Profiles(storedValue || "-");
        }
        if (storedValue2) {
            setUploadablesExcelV3(storedValue2 || "-");
        }
    }
    const loadFromLocalStorageForV1 = () => {
        let storedValue = localStorage.getItem(`${UPLOADABLE_EXCELS_V1_PROFILES}`);
        let storedValue2 = localStorage.getItem(`${UPLOADABLE_EXCELS_V1}`);
        console.log(`loadFromLocalStorage called ${storedValue}`)
        if (storedValue) {
            setUploadableExcelV1Profiles(storedValue || "-");
        }
        if (storedValue2) {
            setUploadablesExcelV1(storedValue2 || "-");
        }
    }
    
    return (
        <Box display="flex" gap={4} mb={2} flexDirection="row">
            <Box display="flex" alignItems="center" gap={4} mb={2} flexDirection="column">

                <ExecComponent buttonText="Upload Pdfs to Archive for Profile via Excel V-1"
                    placeholder='Profile Name'
                    secondTextBoxPlaceHolder='Enter Excel Abs Path'
                    thirdTextBoxPlaceHolder='Range (eg. 1-00) (Optional).inclusive'
                    execType={ExecType.UploadPdfsViaExcelV1}
                    textBoxOneValue={uploadableExcelV1Profiles}
                    textBoxTwoValue={uploadablesExcelV1}
                    userInputOneInfo="Excel File Format: Col1. Abs Path. Col2. Suject. Col 3. Description Col 4. Creator"
                    userInputThreeInfo="Range of Whole Numbers. Ex 1-10 (Optional).inclusive"
                    css={{ width: "250px" }}
                    css2={{ width: "450px" }}
                    thirdButton={<Button variant="contained" color="primary" onClick={loadFromLocalStorageForV1} sx={{ marginRight: "10px", marginBottom: "10px" }}>Load From Local Storage</Button>}
                />

                <ExecComponent buttonText="Upload Pdfs to Archive for Profile via Excel V-3"
                    placeholder='Profile Name'
                    secondTextBoxPlaceHolder='Enter Excel Abs Path'
                    thirdTextBoxPlaceHolder='Range (eg. 1-00) (Optional).inclusive'
                    execType={ExecType.UploadPdfsViaExcelV3}
                    textBoxOneValue={uploadableExcelV3Profiles}
                    textBoxTwoValue={uploadablesExcelV3}
                    userInputOneInfo="Excel File Format: Col1. Abs Path.Use http://localhost:3000/execLauncher2b Archive Uploadable Excel V-3 to create"
                    userInputThreeInfo="Range of Whole Numbers. Ex 1-10 (Optional).inclusive"
                    css={{ width: "250px" }}
                    css2={{ width: "450px" }}
                    thirdButton={<Button variant="contained" color="primary" onClick={loadFromLocalStorageForV3} sx={{ marginRight: "10px", marginBottom: "10px" }}>Load From Local Storage</Button>}
                />
            </Box>

            <Box display="flex" gap={4} mb={2} flexDirection="column">
                <ExecComponent buttonText="Upload Pdfs to Archive for Profile"
                    placeholder='Profiles as CSV'
                    execType={ExecType.UploadPdfs}
                    css={{ backgroundColor: "turquoise", width: "250px" }}
                />
                <ExecComponent buttonText="Upload Pdfs to Archive for Profile via Path"
                    placeholder='Profile Name'
                    secondTextBoxPlaceHolder='Enter File Abs Path as CSV'
                    execType={ExecType.UploadPdfsViaAbsPath}
                    css={{ width: "250px" }}
                    css2={{ width: "450px" }}
                />
            </Box>

            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                <ExecComponent buttonText="Reupload Upload Attmepted But Failed Using Upload Cycle Id"
                    placeholder='Enter UploadCycleId'
                    execType={ExecType.REUPLOAD_FAILED_USING_UPLOAD_CYCLE_ID}
                    userInputOneInfo="Run 'Verify Uploads' first."
                    css={{ width: "250px" }}
                />

                <ExecComponent buttonText="Reupload Queuing-Ushering-Missed Using Upload Cycle Id"
                    placeholder='Enter UploadCycleId'
                    execType={ExecType.REUPLOAD_MISSED_USING_UPLOAD_CYCLE_ID}
                    userInputOneInfo="Run 'Verify Uploads' first."
                    css={{ width: "250px" }}
                />

                <ExecComponent buttonText="Reupload Using MongoDB Json"
                    placeholder='Enter Json Abs Path'
                    execType={ExecType.REUPLOAD_USING_JSON}
                    userInputOneInfo="Run 'Verify Uploads'. Then From Mongo DB filter using UploadCycleId extract JSON "
                    thirdTextBoxPlaceHolder='Range (eg. 1-00) (Optional).inclusive'
                    css={{ width: "250px" }}
                    userInputThreeInfo="Range of Whole Numbers. Ex 1-10 (Optional).inclusive"
                />
            </Box>
        </Box>
    );
}

export default ExecLauncherTwo;
