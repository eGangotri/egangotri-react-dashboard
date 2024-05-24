import React, { ChangeEvent } from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import { ExecType } from './ExecLauncherUtil';
import { FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';


const ExecLauncherFive: React.FC = () => {
    const [excelGDrive, setExcelGDrive] = React.useState<number>(ExecType.GenExcelOfGoogleDriveLinkPdfOnly);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const _val = event.target.value;
        console.log("_val", _val)
        let _listingType;
        switch (Number(_val)) {
            case ExecType.GenExcelOfGoogleDriveLinkPdfOnly:
                _listingType = ExecType.GenExcelOfGoogleDriveLinkPdfOnly;
                break;
            case ExecType.GenExcelOfGoogleDriveLinkForReduced:
                _listingType = ExecType.GenExcelOfGoogleDriveLinkForReduced;
                break;
        }
        console.log("_listingType", _listingType);
        setExcelGDrive(_listingType || ExecType.GenExcelOfGoogleDriveLinkPdfOnly);
    };
    return (
        <Box display="flex" gap={4} mb={2} flexDirection="row">

            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                <ExecComponent
                    buttonText="Create G-Drive Excel"
                    placeholder='Enter Google Drive Link(s)/Identifiers as csv'
                    secondTextBoxPlaceHolder='Enter Folder Name (not path)'
                    execType={excelGDrive}
                    css={{ minWidth: "23vw" }}
                    reactComponent={<>
                        <RadioGroup aria-label="fileType" name="fileType" value={excelGDrive} onChange={handleChange} row>
                            <FormControlLabel value={ExecType.GenExcelOfGoogleDriveLinkPdfOnly} control={<Radio />} label="ALL" />
                            <FormControlLabel value={ExecType.GenExcelOfGoogleDriveLinkForReduced} control={<Radio />} label="REDUCED" />
                        </RadioGroup>
                    </>}
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

            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                <ExecComponent
                    buttonText="Get First and Last N Pages"
                    placeholder='Absolute Path to PDFs Folder(s) as CSV'
                    secondTextBoxPlaceHolder='Absolute Path to Destination Folder'
                    thirdTextBoxPlaceHolder='N Pages to Extract from Start and End'
                    thirdTextBoxDefaultValue={"10"}
                    execType={ExecType.GET_FIRST_N_PAGES}
                    css={{ minWidth: "23vw" }}
                    css2={{ minWidth: "23vw" }}
                    css3={{ marginTop: "30px", minWidth: "23vw" }}
                />
            </Box>

            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                <ExecComponent
                    buttonText="Combine G Drive and Reduced PDF Drive Excels"
                    placeholder='Absolute Path to Main Excel Folder'
                    secondTextBoxPlaceHolder='Absolute Path to Secondary Excel Folder'
                    //  thirdTextBoxPlaceHolder='Optional Output Excel Path'
                    execType={ExecType.COMBINE_GDRIVE_AND_REDUCED_PDF_DRIVE_EXCELS}
                    css={{ minWidth: "33vw" }}
                    css2={{ minWidth: "35vw" }}
                    userInputOneInfo="It will pick the latest Excel from the Folders"
                //  css3={{marginTop: "30px", width: "100%"}}
                /> 

                <ExecComponent
                    buttonText="Dump Combination Excel to MongoDB"
                    placeholder='Absolute Path to Combination Excel Folder'
                    execType={ExecType.DUMP_GDRIVE_COMBO_EXCEL_TO_MONGO}
                    css={{ minWidth: "33vw" }}
                    userInputOneInfo="It will pick the latest Excel from the Folders"
                //  css3={{marginTop: "30px", width: "100%"}}
                />
            </Box>
        </Box>

    );
}

export default ExecLauncherFive;
