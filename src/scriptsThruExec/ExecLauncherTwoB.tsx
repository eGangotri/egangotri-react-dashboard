import React, { useState } from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import { ExecType } from './ExecLauncherUtil';
import { FormControlLabel, Checkbox } from '@mui/material';

const ExecLauncherTwoB: React.FC = () => {
    const [dontGenerateCheck, setDontGenerateCheck] = useState(false);
    const [listingsOnly, setListingsOnly] = useState(false);
    const [archiveExcelExecType, setArchiveExcelExecType] = useState(ExecType.GenExcelOfArchiveLink);

    const handleDontGenerateCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDontGenerateCheck(event.target.checked);
        setArchiveExcelExecType(_archiveExcelExecType({
            dontGenerateCheck: event.target.checked,
            listingsOnly: listingsOnly
        }));
    };
    const handleListingsOnly = (event: React.ChangeEvent<HTMLInputElement>) => {
        setListingsOnly(event.target.checked);
        setArchiveExcelExecType(_archiveExcelExecType({
            dontGenerateCheck: dontGenerateCheck,
            listingsOnly: event.target.checked
        }));
    };

    const _archiveExcelExecType = (options: { dontGenerateCheck: boolean, listingsOnly: boolean }): number => {
        let retType = ExecType.GenExcelOfArchiveLink;
        if (options.listingsOnly === true) {
            retType = (options.dontGenerateCheck ?
                ExecType.GenExcelOfArchiveLinkLimitedFieldsWithListing : ExecType.GenExcelOfArchiveLinkListingOnly);
        }
        else if (options.dontGenerateCheck === true) {
            retType = ExecType.GenExcelOfArchiveLinkLimitedFields
        }
        return retType;
    }
    return (
        <Box display="flex" gap={4} mb={2} flexDirection="row">
            <Box display="flex" alignItems="center" gap={4} mb={2} flexDirection="column">

                <ExecComponent
                    buttonText="Create Archive Excel"
                    placeholder='Space/Comma-Separated Archive Link(s) or Identifier(s)'
                    execType={archiveExcelExecType}
                    css={{ width: "450px" }}
                    userInputOneInfo="Enter Archive Link(s) or Identifier(s) as CSV or Space-Separated"
                    userInputThreeInfo="YYYY/MM/DD-YYYY/MM/DD (Optional). Example 2021/01/01-2021/01/31"
                    thirdTextBoxPlaceHolder='Date Range (Optional)'
                    reactComponent={<Box>
                        <FormControlLabel
                            control={<Checkbox checked={dontGenerateCheck} onChange={handleDontGenerateCheck} />}
                            label="Dont Generate Direct Downloadable Links (Blazing Fast)"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={listingsOnly} onChange={handleListingsOnly} />}
                            label="Listings Only"
                        />
                    </Box>}
                />
                <ExecComponent
                    buttonText="Download All Pdfs from Archive"
                    placeholder='Space/Comma-Separated Archive Link(s) or Identifier(s)'
                    secondTextBoxPlaceHolder='Enter Profile or File Abs Path for Dumping PDFs'
                    execType={ExecType.DownloadArchivePdfs}
                    css={{ width: "450px" }}
                />

            </Box>

            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                <ExecComponent buttonText="Mark Uploaded In Archive Excel post verification"
                    placeholder='Profile Name Or Upload CycleId'
                    secondTextBoxPlaceHolder='Enter Excel Abs Path'
                    execType={ExecType.MARK_AS_UPLOADED_ENTRIES_IN_ARCHIVE_EXCEL}
                    userInputOneInfo="Excel File Format: Col1. Abs Path. Col2. Suject. Col 3. Description Col 4. Creator Col5 . uploadFlag"
                    css={{ width: "250px" }}
                    css2={{ width: "450px" }}
                />

                <ExecComponent
                    buttonText="Dump Archive-DB Excel Entries to MongoDB"
                    placeholder='Absolute Path to Archive Excel Folder'
                    execType={ExecType.DUMP_ARCHIVE_EXCEL_TO_MONGO}
                    userInputOneInfo="It will pick the latest Excel from the Folders"
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
                
                <ExecComponent
                 buttonText="Compare UploadsViaExcel-V1 against Archive.org"
                    placeholder='Enter UploadCycleId'
                    execType={ExecType.COMPARE_UPLOADS_VIA_EXCEL_WITH_ARCHIVE_ORG}
                    css={{ width: "350px" }}
                />
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

export default ExecLauncherTwoB;
