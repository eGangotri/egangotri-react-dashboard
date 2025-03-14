import React, { ChangeEvent, useState } from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import { ExecType } from './ExecLauncherUtil';
import { Button, FormControlLabel, Link, Radio, RadioGroup, Typography } from '@mui/material';
import {
    COMBINATION_EXCEL_PATH_LOCAL_STORAGE_KEY,
    GDRIVE_EXCEL_NAME_LOCAL_STORAGE_KEY,
    REDUCED_SUFFIX, TOP_N_FILE_LOCAL_STORAGE_KEY
} from 'service/consts';


const PdfUtil: React.FC = () => {
    const [excelGDrive, setExcelGDrive] = React.useState<number>(ExecType.GenExcelOfGoogleDriveLinkPdfOnly);

    const [validationCss, setValidationCss] = React.useState({
        backgroundColor: "lightgreen",
        width: "450px"
    });

    return (
        <Box display="flex" gap={4} mb={2} flexDirection="row">
    
            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                <ExecComponent
                    buttonText="Merge PDF"
                    placeholder='Absolute Path to Pdf-1'
                    secondTextBoxPlaceHolder='Absolute Path to Pdf-1'
                    execType={ExecType.GET_FIRST_N_PAGES_PYTHON}
                    css={{ minWidth: "23vw" }}
                    css2={{ minWidth: "23vw" }}
                    css3={{ marginTop: "30px", minWidth: "23vw" }}
                />
            </Box>

            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
               
             
            </Box>
        </Box>

    );
}

export default PdfUtil;
