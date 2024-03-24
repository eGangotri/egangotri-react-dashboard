import React, { ChangeEvent, useState } from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import { ExecType } from './util';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';

const ExecLauncher: React.FC = () => {
    const [flatten, setFlatten] = useState<boolean>(true);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
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
                    secondTextBoxPlaceHolder="Profile Name or Absolute Path"
                    execType={ExecType.MoveFolderContents}
                    // reactComponent={<Box>
                    //     { 
                    //     <FormControlLabel
                    //         control={<Checkbox checked={flatten} onChange={handleChange2} />}
                    //         label="Flatten Folder Contents"
                    //     /> }
                    // </Box>}
                />
            </Box>

            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                <ExecComponent
                    buttonText="Download Pdfs from GDrive"
                    placeholder='Enter Google Drive Link(s)/Identifiers as csv'
                    secondTextBoxPlaceHolder='Enter Profile or File Abs Path'
                    execType={ExecType.DownloadGoogleDriveLink}
                    css={{ backgroundColor: "lightgreen", width: "450px" }}
                    css2={{ backgroundColor: "lightgreen" }} />

                <ExecComponent
                    buttonText="Create Drive Excel"
                    placeholder='Enter Google Drive Link(s)/Identifiers as csv'
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
