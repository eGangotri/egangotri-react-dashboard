import React from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { ExecType } from './ExecLauncherUtil';
import { Typography } from '@mui/material';

const TallyUploadedData: React.FC = () => {

    return (
        <Box display="flex" flexDirection="column">

            <Box className="one" sx={{ paddingBottom: "50px" }}>
                <h1>Uploaded Data Tally Excel</h1>
                <Link href="https://docs.google.com/spreadsheets/d/1lP17ArzUQCS_ZUUqJavoq9UHoYGrDcI5bLM-UKo6GDU/edit#gid=0" color="primary" underline="always" target="_blank" rel="noreferrer">
                    https://docs.google.com/spreadsheets/d/1lP17ArzUQCS_ZUUqJavoq9UHoYGrDcI5bLM-UKo6GDU/edit#gid=0
                </Link>
            </Box>
            <Box>
                <Box display="flex" alignItems="start" gap={4} mb={2} flexDirection="row">
                    <Box display="flex" alignItems="start" gap={4} mb={2} flexDirection="column">
                        <ExecComponent buttonText="Gen. Excel of Pdfs in Hard Drive"
                            placeholder="Enter Folder Abs. Path"
                            execType={ExecType.UploadPdfs} />

                        <ExecComponent buttonText="Gen. Excel of Pdfs in G-Drive"
                            placeholder="Enter G-Drive Path"
                            execType={ExecType.UploadPdfs} />
                    </Box>

                    <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                        <ExecComponent buttonText="Gen. Reduced PDF"
                            placeholder="Enter Folder Abs. Path"
                            execType={ExecType.UploadPdfs} />

                        <ExecComponent buttonText="Gen. Excel of Reduced PDF in Hard Drive"
                            placeholder="Enter Folder Abs. Path"
                            execType={ExecType.UploadPdfs} />

                        <ExecComponent buttonText="Gen. Excel of Reduced PDF in G-Drive"
                            placeholder="Enter G-Drive Path"
                            execType={ExecType.UploadPdfs} />
                    </Box>
                </Box>

            </Box>
        </Box>
    );
}

export default TallyUploadedData;
