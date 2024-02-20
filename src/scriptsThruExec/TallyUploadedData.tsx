import React from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ExecType } from './util';

const TallyUploadedData: React.FC = () => {

    return (
        <Box display="flex" gap={4} mb={2} flexDirection="row">
            <Box display="flex" alignItems="center" gap={4} mb={2} flexDirection="row">
                <Box >
                    <Typography>
                        <a color="blue" href="https://docs.google.com/spreadsheets/d/1lP17ArzUQCS_ZUUqJavoq9UHoYGrDcI5bLM-UKo6GDU/edit#gid=0"
                            target="_blank" rel="noreferrer"
                        >https://docs.google.com/spreadsheets/d/1lP17ArzUQCS_ZUUqJavoq9UHoYGrDcI5bLM-UKo6GDU/edit#gid=0</a>
                    </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={4} mb={2} flexDirection="column">
                    <ExecComponent buttonText="Generate Excel of Pdfs for Hard Drive"
                        execType={ExecType.UploadPdfs} />

                    <ExecComponent buttonText="Generate Excel of Pdfs for Google Drive"
                        execType={ExecType.UploadPdfs} />

                    <ExecComponent buttonText="Generated Reduced PDF"
                        execType={ExecType.UploadPdfs} />


                </Box>

                <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                    <ExecComponent buttonText="Generated Excel of Reduced PDF in Hard Drive"
                        execType={ExecType.UploadPdfs} />

                    <ExecComponent buttonText="Generated Excel of Reduced PDF in Google Drive"
                        execType={ExecType.UploadPdfs} />
                </Box>
            </Box>
        </Box>
    );
}

export default TallyUploadedData;
