import React, { useState } from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import { ExecType } from './ExecLauncherUtil';

const ExecLauncherTwo: React.FC = () => {
    return (
        <Box display="flex" gap={4} mb={2} flexDirection="row">
            <Box display="flex" alignItems="center" gap={4} mb={2} flexDirection="column">

                <ExecComponent buttonText="Login to Archive"
                    placeholder='Profiles as CSV'
                    execType={ExecType.LoginToArchive} />

                <ExecComponent buttonText="Upload Pdfs to Archive for Profile via Excel"
                    placeholder='Profile Name'
                    secondTextBoxPlaceHolder='Enter Excel Abs Path'
                    thirdTextBoxPlaceHolder='Range (eg. 1-00) (Optional).inclusive'
                    execType={ExecType.UploadPdfsViaExcel}
                    userInputOneInfo="Excel File Format: Col1. Abs Path. Col2. Suject. Col 3. Description Col 4. Creator"
                    userInputThreeInfo="Range of Whole Numbers. Ex 1-10 (Optional).inclusive"
                    css={{ width: "250px" }}
                    css2={{ width: "450px" }}
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
