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
                    thirdTextBoxPlaceHolder='Optional Abs Path to 3rd Pdf if exists'
                    execType={ExecType.MERGE_PDFS_PYTHON}
                    css={{ minWidth: "453vw" }}
                    css2={{ minWidth: "453vw" }}
                />
            </Box>
        </Box>

    );
}

export default PdfUtil;
