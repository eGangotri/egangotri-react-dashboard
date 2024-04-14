import React from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import { ExecType } from './util';
import { Typography } from '@mui/material';


const ExecLauncherFive: React.FC = () => {
    return (
        <Box display="flex" gap={4} mb={2} flexDirection="row">

            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                <ExecComponent
                    buttonText="Create Drive Excel"
                    placeholder=' C:\_catalogWork\_collation\_googleDriveExcels\Treasures'
                    secondTextBoxPlaceHolder='Enter Folder Name (not path)'
                    execType={ExecType.GenExcelOfGoogleDriveLink} />

                <ExecComponent
                    buttonText="C:\_catalogWork\_collation\local\Treasures"
                    placeholder='C:\_catalogWork\_collation\local\Treasures'
                    secondTextBoxPlaceHolder='Enter Folder Name (not path)'
                    execType={ExecType.GenExcelOfGoogleDriveLink} />

            </Box>

            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                <ExecComponent
                    buttonText="Get First and Last N Pages"
                    placeholder='Absolute Path to PDFs Folder(s) as CSV'
                    secondTextBoxPlaceHolder='Absolute Path to Destination Folder'
                    thirdTextBoxPlaceHolder='N Pages to Extract from Start and End'
                    thirdTextBoxDefaultValue={"9"}
                    execType={ExecType.GET_FIRST_N_PAGES}
                    css2={{ width: "100%" }}
                    css3={{ marginTop: "30px", width: "100%" }}
                />

                <ExecComponent
                    buttonText="Create Drive excel for Reduced PDFs Link"
                    placeholder='C:\_catalogWork\_collation\_catReducedDrivePdfExcels'
                    secondTextBoxPlaceHolder='Enter Folder Name (not path)'
                    execType={ExecType.GenExcelOfGoogleDriveLink}
                />
                <ExecComponent
                    buttonText="Combine G Drive and Reduced PDF Drive Excels"
                    placeholder='Absolute Path to Main Excel'
                    secondTextBoxPlaceHolder='Absolute Path to Secondary Excel'
                    //  thirdTextBoxPlaceHolder='Optional Output Excel Path'
                    execType={ExecType.COMBINE_GDRIVE_AND_REDUCED_PDF_DRIVE_EXCELS}
                    css2={{ width: "100%" }}
                //  css3={{marginTop: "30px", width: "100%"}}
                />

            </Box>

            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                <ExecComponent
                    buttonText="Combine Main and Reduced Excel Data"
                    placeholder='C:\_catalogWork\_collation\_catCombinedExcels\Treasures 60'
                    secondTextBoxPlaceHolder='Enter Folder Name (not path)'
                    execType={ExecType.GenExcelOfGoogleDriveLink} />
                <Box>
                    <Typography variant="h6" component="div" gutterBottom>
                        <ol>
                            <li>1. Generate Excel of Google Drive Links</li>
                            <li>2. Generate Excel of Corresponding Local Files</li>
                            <li>?. Do we combine G-Drive/Local Excels</li>
                            <li>3. Create Reduced PDFs with First and Last 10 Pages</li>
                            <li>4. Dump Reduced PDFs to Google Drive</li>
                            <li>5. Generate Excel of Reduced PDFs</li>
                            <li>6. Combine Excel in Step 5 with 1</li>
                        </ol>
                    </Typography>
                </Box>
            </Box>
        </Box>

    );
}

export default ExecLauncherFive;
