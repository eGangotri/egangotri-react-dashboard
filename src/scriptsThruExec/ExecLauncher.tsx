import React from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';


const ExecLauncher: React.FC = () => {

    return (
        <Box>
            <ExecComponent buttonText="Upload Pdfs for Profile" />
            <ExecComponent buttonText="Reverse Move (Python)" />
            <ExecComponent buttonText="Move Folder Contents" placeholder='Move QA-Passed-to-Pipeline' />
            <ExecComponent buttonText="Use Bulk Rename Conventions" placeholder='Use Bulk Rename Conventions' />
        </Box>
    );
}

export default ExecLauncher;
