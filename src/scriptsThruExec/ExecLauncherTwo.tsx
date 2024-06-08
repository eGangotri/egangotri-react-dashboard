import React, { useState } from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import { ExecType } from './ExecLauncherUtil';
import { UPLOADABLE_EXCEL_V3 } from '../service/consts';
import { Button } from '@mui/material';

const ExecLauncherTwo: React.FC = () => {
    const [uploadableExcelV3, setUploadableExcelV3] = useState('');
    const loadFromLocalStorage = () => {
        let storedValue = localStorage.getItem(`${UPLOADABLE_EXCEL_V3}`);
        console.log(`loadFromLocalStorage called ${storedValue}`)
        if (storedValue) {
            setUploadableExcelV3(storedValue || "-");
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
                    userInputOneInfo="Excel File Format: Col1. Abs Path. Col2. Suject. Col 3. Description Col 4. Creator"
                    userInputThreeInfo="Range of Whole Numbers. Ex 1-10 (Optional).inclusive"
                    css={{ width: "250px" }}
                    css2={{ width: "450px" }}
                />

                <ExecComponent buttonText="Upload Pdfs to Archive for Profile via Excel V-3"
                    placeholder='Profile Name'
                    secondTextBoxPlaceHolder='Enter Excel Abs Path'
                    thirdTextBoxPlaceHolder='Range (eg. 1-00) (Optional).inclusive'
                    execType={ExecType.UploadPdfsViaExcelV3}
                    textBoxTwoValue={uploadableExcelV3}
                    userInputOneInfo="Excel File Format: Col1. Abs Path.Use http://localhost:3000/execLauncher2b Archive Uploadable Excel V-3 to create"
                    userInputThreeInfo="Range of Whole Numbers. Ex 1-10 (Optional).inclusive"
                    css={{ width: "250px" }}
                    css2={{ width: "450px" }}
                    thirdButton={<Button variant="contained" color="primary" onClick={loadFromLocalStorage} sx={{ marginRight: "10px", marginBottom: "10px" }}>Load From Local Storage</Button>}
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
