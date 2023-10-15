import React from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';

export enum ExecType {
    UploadPdfs = 1,
    MoveFolderContents = 2,
    ReverseMove = 3,
    LoginToArchive = 4,
    UseBulkRenameConventions = 5,
    DownloadGoogleDriveLink = 6,
}

const ExecLauncher: React.FC = () => {

    return (
        <Box display="flex" gap={4} mb={2} flexDirection="row">
            <Box display="flex" alignItems="center" gap={4} mb={2} flexDirection="column">
                <ExecComponent buttonText="Upload Pdfs for Profile"
                    execType={ExecType.UploadPdfs} />

                <ExecComponent buttonText="Move Folder Contents"
                    placeholder='Move QA-Passed-to-Pipeline'
                    execType={ExecType.MoveFolderContents} />

                <ExecComponent buttonText="Reverse Move (Python)"
                    execType={ExecType.ReverseMove} />

                <ExecComponent buttonText="Login to Archive"
                    placeholder='Login to Archive'
                    execType={ExecType.LoginToArchive} />

                <ExecComponent buttonText="Use Bulk Rename Conventions"
                    placeholder='Use Bulk Rename Conventions'
                    execType={ExecType.UseBulkRenameConventions} />
            </Box>

            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                <ExecComponent buttonText="Download from Drive Link"
                    placeholder='Enter Google Drive Link'
                    execType={ExecType.DownloadGoogleDriveLink} />
            </Box>
        </Box>
    );
}

export default ExecLauncher;
