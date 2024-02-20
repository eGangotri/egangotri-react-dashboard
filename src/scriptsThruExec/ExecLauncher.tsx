import React from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import UploadDialog from 'pages/UploadCycles/UploadDialog';
import { ExecType } from './util';

const ExecLauncher: React.FC = () => {

    return (
        <Box display="flex" gap={4} mb={2} flexDirection="row">
            <Box display="flex" alignItems="center" gap={4} mb={2} flexDirection="column">
                <ExecComponent buttonText="Upload Pdfs for Profile"
                    execType={ExecType.UploadPdfs} />

                <ExecComponent buttonText="Move Folder Contents"
                    placeholder='Move QA-Passed-to-Pipeline'
                    execType={ExecType.MoveFolderContents} />

                <Typography>Make Dialog and Popover for gradle console display</Typography>

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
                <ExecComponent
                    buttonText="Download Pdfs"
                    placeholder='Enter Google Drive Link'
                    secondTextBox={true}
                    secondTextBoxPlaceHolder='Enter Destination Folder'
                    execType={ExecType.DownloadGoogleDriveLink} />

                <ExecComponent
                    buttonText="Create Drive Excel"
                    placeholder='Enter Google Drive Link'
                    secondTextBox={true}
                    secondTextBoxPlaceHolder='Enter Folder Name (not path)'
                    execType={ExecType.GenExcelOfGoogleDriveLink} />
            </Box>
        </Box>
    );
}

export default ExecLauncher;
