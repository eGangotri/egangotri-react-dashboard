import React from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import { ExecType } from './util';


const ExecLauncherFive: React.FC = () => {
    return (
        <Box display="flex" gap={4} mb={2} flexDirection="row">

            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                <ExecComponent
                    buttonText="Create Drive Excel"
                    placeholder='Enter Google Drive Link(s)/Identifiers as csv C:\_catalogWork\_collation\_googleDriveExcels\Treasures'
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
                    buttonText="C:\_catalogWork\_reducedPdfs"
                    placeholder='C:\_catalogWork\_reducedPdfs'
                    secondTextBoxPlaceHolder='Enter Folder Name (not path)'
                    execType={ExecType.GenExcelOfGoogleDriveLink}
                    reactComponent={<>
                        <input type="file" onChange={handleFileChange} />
                    </>}
                />


                <ExecComponent
                    buttonText="C:\_catalogWork\_collation\_catReducedLocalPdfExcels\Treasures (2674)"
                    placeholder='C:\_catalogWork\_collation\_catReducedLocalPdfExcels\Treasures (2674)'
                    secondTextBoxPlaceHolder='Enter Folder Name (not path)'
                    execType={ExecType.GenExcelOfGoogleDriveLink}
                    reactComponent={<>
                        <input type="file" onChange={handleFileChange} />
                    </>}
                />


                <ExecComponent
                    buttonText="C:\_catalogWork\_collation\_catReducedDrivePdfExcels"
                    placeholder='C:\_catalogWork\_collation\_catReducedDrivePdfExcels'
                    secondTextBoxPlaceHolder='Enter Folder Name (not path)'
                    execType={ExecType.GenExcelOfGoogleDriveLink}
                    reactComponent={<>
                        <input type="file" onChange={handleFileChange} />
                    </>}
                />
            </Box>

            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                <ExecComponent
                    buttonText="C:\_catalogWork\_collation\_catCombinedExcels\Treasures 60"
                    placeholder='C:\_catalogWork\_collation\_catCombinedExcels\Treasures 60'
                    secondTextBoxPlaceHolder='Enter Folder Name (not path)'
                    execType={ExecType.GenExcelOfGoogleDriveLink} />
            </Box>
        </Box>

    );
}

export default ExecLauncherFive;
