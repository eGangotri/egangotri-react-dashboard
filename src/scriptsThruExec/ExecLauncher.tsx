import React from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';

export enum ExecType {
    UploadPdfs = 1,
    MoveFolderContents = 2,
    ReverseMove = 3,
    UseBulkRenameConventions = 4
}
const ExecLauncher: React.FC = () => {

    return (
        <Box>
            <ExecComponent buttonText="Upload Pdfs for Profile"
                execType={ExecType.UploadPdfs} />

            <ExecComponent buttonText="Move Folder Contents"
                placeholder='Move QA-Passed-to-Pipeline'
                execType={ExecType.MoveFolderContents} />

            <ExecComponent buttonText="Reverse Move (Python)"
                execType={ExecType.ReverseMove} />

            <ExecComponent buttonText="Use Bulk Rename Conventions"
                placeholder='Use Bulk Rename Conventions'
                execType={ExecType.UseBulkRenameConventions} />
        </Box>
    );
}

export default ExecLauncher;
