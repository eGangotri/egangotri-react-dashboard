import React, { useState } from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import { ExecType } from './ExecLauncherUtil';
import { FormControlLabel, Checkbox } from '@mui/material';

const ExecLauncherTwoC: React.FC = () => {
    return (
        <Box display="flex" gap={4} mb={2} flexDirection="row">
            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                <ExecComponent buttonText="Mark Uploaded In Archive Excel post verification"
                    placeholder='Profile Name Or Upload CycleId'
                    secondTextBoxPlaceHolder='Enter Excel Abs Path'
                    execType={ExecType.MARK_AS_UPLOADED_ENTRIES_IN_ARCHIVE_EXCEL}
                    userInputOneInfo="Excel File Format: Col1. Abs Path. Col2. Suject. Col 3. Description Col 4. Creator Col5 . uploadFlag"
                    css={{ width: "250px" }}
                    css2={{ width: "450px" }}
                />
            </Box>

            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                <ExecComponent buttonText="Identify Upload-Failed By Upload Cycle Id"
                    placeholder='Enter UploadCycleId'
                    execType={ExecType.IDENTIFY_UPLOAD_MISSED_BY_UPLOAD_CYCLE_ID}
                    css={{ width: "350px" }}
                />
                <ExecComponent buttonText="Identify Missed By Upload Cycle Id"
                    placeholder='Enter UploadCycleId'
                    execType={ExecType.IDENTIFY_FAILED_BY_UPLOAD_CYCLE_ID}
                    css={{ width: "350px" }}
                />

            </Box>
            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                <ExecComponent
                    buttonText="Compare UploadsViaExcel-V1 against Archive.org"
                    placeholder='Absolute Path to UploadsViaExcel-V1 Excel'
                    execType={ExecType.COMPARE_UPLOADS_VIA_EXCEL_WITH_ARCHIVE_ORG}
                    secondTextBoxPlaceHolder='Absolute Path to archive.org Excel(s) as CSV'
                    css={{ minWidth: "33vw" }}
                    css2={{ minWidth: "35vw" }}
                //  css3={{marginTop: "30px", width: "100%"}}
                />
            </Box>
        </Box>
    );
}

export default ExecLauncherTwoC;
