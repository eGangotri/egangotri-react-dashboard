import React from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import { ExecType } from './ExecLauncherUtil';
import { Typography } from '@mui/material';


const ExecLauncherFive: React.FC = () => {
    return (
        <Box display="flex" gap={4} mb={2} flexDirection="row">

            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                <ExecComponent
                    buttonText="Create G-Drive Excel"
                    placeholder='Enter Google Drive Link(s)/Identifiers as csv'
                    secondTextBoxPlaceHolder='Enter Folder Name (not path)'
                    execType={ExecType.GenExcelOfGoogleDriveLink} />
            </Box>

            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                <ExecComponent
                    buttonText="Get First and Last N Pages"
                    placeholder='Absolute Path to PDFs Folder(s) as CSV'
                    secondTextBoxPlaceHolder='Absolute Path to Destination Folder'
                    thirdTextBoxPlaceHolder='N Pages to Extract from Start and End'
                    thirdTextBoxDefaultValue={"10"}
                    execType={ExecType.GET_FIRST_N_PAGES}
                    css2={{ width: "100%" }}
                    css3={{ marginTop: "30px", width: "100%" }}
                />



            </Box>

            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                <ExecComponent
                    buttonText="Combine G Drive and Reduced PDF Drive Excels"
                    placeholder='Absolute Path to Main Excel'
                    secondTextBoxPlaceHolder='Absolute Path to Secondary Excel'
                    //  thirdTextBoxPlaceHolder='Optional Output Excel Path'
                    execType={ExecType.COMBINE_GDRIVE_AND_REDUCED_PDF_DRIVE_EXCELS}
                    css2={{ width: "100%" }}
                //  css3={{marginTop: "30px", width: "100%"}}
                />
                <Box>
                    <Typography variant="h6" component="div" gutterBottom>
                        <ol>
                            <li>1. Generate Excel of Google Drive Links</li>
                            <li>2. Create Reduced PDFs with First and Last 10 Pages</li>
                            <li>Manual Task. Dump Reduced PDFs to Google Drive</li>
                            <li>3. Generate Excel of Reduced PDFs</li>
                            <li>4. Combine Excel in Step 5 with 1</li>
                        </ol>
                    </Typography>
                </Box>
            </Box>
        </Box>

    );
}

export default ExecLauncherFive;
