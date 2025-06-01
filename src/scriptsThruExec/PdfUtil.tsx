import React, { ChangeEvent, useState } from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import { ExecType } from './ExecLauncherUtil';
import { Button, Checkbox, FormControlLabel, Link, Radio, RadioGroup, Typography } from '@mui/material';
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

    const [corruptionCheck, setCorruptionCheck] = React.useState<number>(ExecType.CORRUPTION_CHECK_QUICK);
    const [deepCheckFlag, setDeepCheckFlag] = useState(false);
    const handleDeepCheckFlag = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDeepCheckFlag(event.target.checked);
        setCorruptionCheck(event.target.checked ? ExecType.CORRUPTION_CHECK_DEEP : ExecType.CORRUPTION_CHECK_QUICK);
    };
    return (
        <>
            <Box display="flex" gap={4} mb={2} flexDirection="row">
                <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                    <ExecComponent
                        buttonText="Merge PDF"
                        placeholder='Absolute Path to Pdf-1'
                        secondTextBoxPlaceHolder='Absolute Path to Pdf-2'
                        thirdTextBoxPlaceHolder='Optional Abs Path to 3rd Pdf if exists'
                        execType={ExecType.MERGE_PDFS_PYTHON}
                        css={{ minWidth: "53vw" }}
                        css2={{ minWidth: "53vw" }}
                        css3={{ minWidth: "53vw" }}
                    />
                </Box>
            </Box>

            <Box display="flex" gap={4} mb={2} flexDirection="row">
                <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                    <ExecComponent
                        buttonText="Check for Corrupt PDFs"
                        placeholder='Folder or Profile'
                        execType={corruptionCheck}
                        css={{ minWidth: "53vw" }}
                        reactComponent={<>
                            <Box>
                                <FormControlLabel
                                    control={<Checkbox checked={deepCheckFlag} onChange={handleDeepCheckFlag} />}
                                    label="Deep Check"
                                />
                            </Box>
                        </>}
                    />
                </Box>
            </Box>
        </>

    );
}

export default PdfUtil;
