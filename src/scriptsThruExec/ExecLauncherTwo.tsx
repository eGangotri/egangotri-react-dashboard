import React, { useState } from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import { ExecType } from './util';
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
                    css={{ backgroundColor: "turquoise", width: "450px" }}
                />

                <ExecComponent buttonText="Login to Archive"
                    placeholder='Profiles as CSV'
                    execType={ExecType.LoginToArchive} />
            </Box>

            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
            </Box>
        </Box>
    );
}

export default ExecLauncherTwo;
