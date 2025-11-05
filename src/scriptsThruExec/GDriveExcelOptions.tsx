import React, { ChangeEvent } from 'react';
import { Box, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import { ExecType } from './ExecLauncherUtil';

interface GDriveExcelOptionsProps {
    value: number;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const GDriveExcelOptions: React.FC<GDriveExcelOptionsProps> = ({ value, onChange }) => {
    return (
        <RadioGroup aria-label="excelGDrive" name="excelGDrive" value={value} onChange={onChange} row>
            <Box display="flex" flexDirection="column">
                <Typography>PDF-Only</Typography>
                <FormControlLabel value={ExecType.GenExcelOfGoogleDriveLinkPdfOnly} control={<Radio />} label="Detailed" />
                <FormControlLabel value={ExecType.GenExcelOfGoogleDriveLinkPdfOnlyManuVersion} control={<Radio />} label="Manu Version" />
                <FormControlLabel value={ExecType.GenExcelOfGoogleDriveLinkPdfOnlyMinimalVersion} control={<Radio />} label="Minimal Version" />
            </Box>
            <Box display="flex" flexDirection="column">
                <Typography>All</Typography>
                <FormControlLabel value={ExecType.GenExcelOfGoogleDriveLinkForAll} control={<Radio />} label="ALL" />
                <FormControlLabel value={ExecType.GenExcelOfGoogleDriveLinkForRenameFilesExcel} control={<Radio />} label="Renamer" />
                <FormControlLabel value={ExecType.GenExcelOfGoogleDriveLinkForReduced} control={<Radio />} label="REDUCED" />
            </Box>
        </RadioGroup>
    );
};

export default GDriveExcelOptions;
