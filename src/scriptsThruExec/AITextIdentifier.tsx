import React from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import { ExecType } from './ExecLauncherUtil';
import { Link, Typography } from '@mui/material';

const AITextIdentifier: React.FC = () => {

    return (
        <>
            <Typography variant="h5" gutterBottom>
                <Link href=" https://cloud.google.com/vision/"> https://cloud.google.com/vision/</Link>
            </Typography>
            <Box display="flex" gap={4} mb={2} flexDirection="row">
                <Box display="flex" alignItems="center" gap={4} mb={2} flexDirection="row">
                    <Box display="flex" alignItems="center" gap={4} mb={2} flexDirection="column">
                        <ExecComponent buttonText="OCR on PDFs"
                            execType={ExecType.AI_TEXT_IDENTIFIER}
                            placeholder='Profile'
                            secondTextBoxPlaceHolder='Enter Complete Folder Path'
                        />

                        <ExecComponent
                            buttonText="Run AI Text Identifier"
                            placeholder='Profile'
                            secondTextBoxPlaceHolder='Enter Complete Folder Path'
                            execType={ExecType.AI_TEXT_IDENTIFIER}

                        />
                    </Box>

                    <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                        <ExecComponent buttonText="Rename PDFs with AI Text Identifier Output"
                            placeholder='Profile'
                            secondTextBoxPlaceHolder='Enter Complete Folder Path'
                            execType={ExecType.AI_TEXT_IDENTIFIER} />

                    </Box>
                </Box>
            </Box>
        </>
    );
}

export default AITextIdentifier;
