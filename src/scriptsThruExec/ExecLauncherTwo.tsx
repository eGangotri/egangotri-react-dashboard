import React, { useState } from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import { ExecType } from './ExecLauncherUtil';
import { Radio, RadioGroup, FormControlLabel, FormControl, Checkbox } from '@mui/material';
import { ChangeEvent } from 'react';
import { CheckBox } from '@mui/icons-material';

const ExecLauncherTwo: React.FC = () => {
    const [dontGenerateCheck, setDontGenerateCheck] = useState(false);

    const handleDontGenerateCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDontGenerateCheck(event.target.checked);
    };

    return (
        <Box display="flex" gap={4} mb={2} flexDirection="row">
            <Box display="flex" alignItems="center" gap={4} mb={2} flexDirection="column">
                <ExecComponent
                    buttonText="Create Archive Excel"
                    placeholder='Space/Comma-Separated Archive Link(s) or Identifier(s)'
                    execType={dontGenerateCheck === true ? ExecType.GenExcelOfArchiveLinkLimitedFields : ExecType.GenExcelOfArchiveLink}
                    css={{ width: "450px" }}
                    userInputOneInfo="Enter Archive Link(s) or Identifier(s) as CSV or Space-Separated"
                    reactComponent={<Box>
                        <FormControlLabel
                            control={<Checkbox checked={dontGenerateCheck} onChange={handleDontGenerateCheck} />}
                            label="Dont Generate Direct Downloadable Links (Blazing Fast)"
                        />
                    </Box>}
                />
                <ExecComponent
                    buttonText="Download All Pdfs from Archive"
                    placeholder='Space/Comma-Separated Archive Link(s) or Identifier(s)'
                    secondTextBoxPlaceHolder='Enter Profile or File Abs Path'
                    execType={ExecType.DownloadArchivePdfs}
                    css={{ width: "450px" }}

                />

            </Box>

            <Box display="flex" gap={4} mb={2} flexDirection="column">
                <ExecComponent buttonText="Upload Pdfs to Archive for Profile"
                    placeholder='Profiles as CSV'
                    execType={ExecType.UploadPdfs}
                    css={{ backgroundColor: "turquoise", width: "250px" }}
                />
                <ExecComponent buttonText="Upload Pdfs to Archive for Profile via Excel"
                    placeholder='Profile Name'
                    secondTextBoxPlaceHolder='Enter Excel Abs Path'
                    thirdTextBoxPlaceHolder='Range (eg. 1-00) (Optional)'
                    execType={ExecType.UploadPdfsViaExcel}
                    userInputOneInfo="Excel File Format: Col1. Abs Path. Col2. Suject. Col 3. Description Col 4. Creator"
                    userInputThreeInfo="Range of Whole Numbers. Ex 1-10 (Optional)"
                    css={{ width: "250px" }}
                    css2={{ width: "450px" }}
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
                <ExecComponent
                    buttonText="Dump Archive Excel to MongoDB"
                    placeholder='Absolute Path to Archive Excel Folder'
                    execType={ExecType.DUMP_ARCHIVE_EXCEL_TO_MONGO}
                    userInputOneInfo="It will pick the latest Excel from the Folders"
                />

                <ExecComponent buttonText="Login to Archive"
                    placeholder='Profiles as CSV'
                    execType={ExecType.LoginToArchive} />
            </Box>
        </Box>
    );
}

export default ExecLauncherTwo;
