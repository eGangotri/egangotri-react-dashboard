import React from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ExecType } from './util';

const ExecLauncherTwo: React.FC = () => {

    return (
        <Box display="flex" gap={4} mb={2} flexDirection="row">
            <Box display="flex" alignItems="center" gap={4} mb={2} flexDirection="column">
                <ExecComponent buttonText="jpeg to pdf"
                    execType={ExecType.UploadPdfs} />

                <ExecComponent buttonText="Vanitize Folder Contents"
                    placeholder='Vanitize'
                    execType={ExecType.MoveFolderContents} />

                <Typography>Make Dialog and Popover for gradle console display</Typography>
            </Box>

            <Box display="flex" gap={4} mb={2} flexDirection="column">
                <ExecComponent buttonText="Add Footer to PDFs"
                    execType={ExecType.ReverseMove} />

                <ExecComponent buttonText="List Files in Folder"
                    placeholder='Folder Path'
                    execType={ExecType.GenListingsofLocalFolder} />

                <ExecComponent buttonText="List Files in Goofle Drive"
                    placeholder='Google Drive Link'
                    execType={ExecType.GenExcelOfGoogleDriveLink} />
            </Box>

            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                <ExecComponent
                    buttonText="Upload Pdfs to Archive"
                    placeholder='Enter Google Drive Link'
                    secondTextBox={true}
                    secondTextBoxPlaceHolder='Enter Destination Folder'
                    execType={ExecType.DownloadGoogleDriveLink} />


                <ExecComponent
                    buttonText="Create Archive Excel"
                    placeholder='Archive Link'
                    execType={ExecType.GenExcelOfArchiveLink} />

                <ExecComponent
                    buttonText="Create Drive Excel"
                    placeholder='Enter Google Drive Link'
                    secondTextBox={true}
                    secondTextBoxPlaceHolder='Enter Folder Name'
                    execType={ExecType.GenExcelOfGoogleDriveLink} />
            </Box>
        </Box>
    );
}

export default ExecLauncherTwo;
