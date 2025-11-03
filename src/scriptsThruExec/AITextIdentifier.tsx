import React from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

const AITextIdentifier: React.FC = () => {

    return (
        <>
            <Typography variant="h5" gutterBottom>
                Misc
            </Typography>
            <Box display="flex" gap={4} mb={2} flexDirection="row">
                <Box display="flex" alignItems="center" gap={4} mb={2} flexDirection="row">
                    <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                        <ExecComponent buttonText="Rename PDFs with AI Text Identifier Output"
                            placeholder='Profile'
                            secondTextBoxPlaceHolder='Enter Complete Folder Path'
                            execType={0} />

                    </Box>
                </Box>
            </Box>
        </>
    );
}

export default AITextIdentifier;
