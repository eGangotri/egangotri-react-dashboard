import React, { ChangeEvent, useState } from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import UploadDialog from 'pages/UploadCycles/UploadDialog';
import { ExecType } from './util';
import { Checkbox, FormControlLabel, Radio, RadioGroup } from '@mui/material';

const ExecLauncher: React.FC = () => {
    const [profileOrPath, setProfileOrPath] = useState<number>(ExecType.MoveFolderContents_PROFILE);
    const [flatten, setFlatten] = useState<boolean>(true);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const _val = event.target.value;
        const _profileOrPath = _val === `${ExecType.MoveFolderContents_PROFILE}` ? ExecType.MoveFolderContents_PROFILE : ExecType.MoveFolderContents_PATH
        console.log("setProfileOrPath", _profileOrPath)
        setProfileOrPath(_profileOrPath);
    };

    const handleChange2 = (event: ChangeEvent<HTMLInputElement>) => {
        setFlatten(event.target.checked);
    };

    return (
        <Box display="flex" gap={4} mb={2} flexDirection="row">
            <Box display="flex" alignItems="center" gap={4} mb={2} flexDirection="column">
                <ExecComponent buttonText="Upload Pdfs for Profile"
                    execType={ExecType.UploadPdfs} />

                <ExecComponent
                    buttonText="Move Folder Contents"
                    placeholder='Src Path for Moving QA-Passed-to-Pipeline'
                    secondTextBox={true}
                    secondTextBoxPlaceHolder={profileOrPath === ExecType.MoveFolderContents_PROFILE ? 'Enter Profile' : 'Enter Dest Folder Path'}
                    execType={profileOrPath}
                    reactComponent={<>
                        <RadioGroup aria-label="fileType" name="fileType" value={profileOrPath} onChange={handleChange} row>
                            <FormControlLabel value={ExecType.MoveFolderContents_PROFILE} control={<Radio />} label="Profile" />
                            <FormControlLabel value={ExecType.MoveFolderContents_PATH} control={<Radio />} label="Path" />
                        </RadioGroup>

                        <FormControlLabel
                            control={<Checkbox checked={flatten} onChange={handleChange2} />}
                            label="Flatten Folder Contents"
                        />
                    </>}
                />
            </Box>

            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                <ExecComponent
                    buttonText="Download Pdfs"
                    placeholder='Enter Google Drive Link'
                    secondTextBox={true}
                    secondTextBoxPlaceHolder='Enter Destination Folder'
                    execType={ExecType.DownloadGoogleDriveLink}
                    css={{ backgroundColor: "lightgreen", color: "cyan" }} />

                <ExecComponent
                    buttonText="Create Drive Excel"
                    placeholder='Enter Google Drive Link'
                    secondTextBox={true}
                    secondTextBoxPlaceHolder='Enter Folder Name (not path)'
                    execType={ExecType.GenExcelOfGoogleDriveLink} />
            </Box>

            <Box display="flex" alignItems="center" gap={4} mb={2} flexDirection="column">

                <ExecComponent buttonText="Reverse Move (Python)"
                    execType={ExecType.ReverseMove} />

                <ExecComponent buttonText="Login to Archive"
                    placeholder='Login to Archive'
                    execType={ExecType.LoginToArchive} />

                <ExecComponent buttonText="Use Bulk Rename Conventions"
                    placeholder='Use Bulk Rename Conventions'
                    execType={ExecType.UseBulkRenameConventions} />
            </Box>
        </Box>

    );
}

export default ExecLauncher;
