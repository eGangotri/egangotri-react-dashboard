import React, { useState } from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import { ExecType } from './ExecLauncherUtil';
import { FormControlLabel, Checkbox } from '@mui/material';

const ExecLauncherTwoB: React.FC = () => {
    const [dontGenerateCheck, setDontGenerateCheck] = useState(false);
    const [listingsOnly, setListingsOnly] = useState(false);
    const [inAscOrder, setInAscOrder] = useState(false);
    const [archiveExcelExecType, setArchiveExcelExecType] = useState(ExecType.GenExcelOfArchiveLinkCombo1);

    const [allNotJustPdfs, setAllNotJustPdfs] = useState(false);
    const [uploadableExcelType, setUplodableExcelType] = useState(ExecType.GenExcelofAbsPathsFromProfile);

    const handleAllNotJustPdfs = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAllNotJustPdfs(event.target.checked);
        setUplodableExcelType(_uploadableExcelCreateType(event.target.checked));

    };

    const handleDontGenerateCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDontGenerateCheck(event.target.checked);
        setArchiveExcelExecType(_archiveExcelExecType({
            dontGenerateCheck: event.target.checked,
            listingsOnly: listingsOnly,
            ascOrder: inAscOrder
        }));
    };

    const handleListingsOnly = (event: React.ChangeEvent<HTMLInputElement>) => {
        setListingsOnly(event.target.checked);
        setArchiveExcelExecType(_archiveExcelExecType({
            dontGenerateCheck: dontGenerateCheck,
            listingsOnly: event.target.checked,
            ascOrder: inAscOrder
        }));
    };

    const handleAscOrder = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInAscOrder(event.target.checked);
        setArchiveExcelExecType(_archiveExcelExecType({
            dontGenerateCheck: dontGenerateCheck,
            listingsOnly: listingsOnly,
            ascOrder: event.target.checked
        }));
    };

    const _uploadableExcelCreateType = (all:boolean):number => {
        return all === true ? ExecType.GenExcelofAbsPathsForAllFileTypesFromProfile : ExecType.GenExcelofAbsPathsFromProfile;
    }
    const _archiveExcelExecType = (options: { dontGenerateCheck: boolean, listingsOnly: boolean, ascOrder: boolean }): number => {
        let retType = "1";
        retType += options.dontGenerateCheck === true ? "1" : "0";
        retType += options.listingsOnly === true ? "1" : "0";
        retType += options.ascOrder === true ? "1" : "0";
        console.log("retType: ", retType);
        return parseInt(retType);
    }
    return (
        <Box display="flex" gap={4} mb={2} flexDirection="row">
            <Box display="flex" alignItems="center" gap={4} mb={2} flexDirection="column">

                <ExecComponent buttonText="Login to Archive"
                    placeholder='Profiles as CSV'
                    execType={ExecType.LoginToArchive} />

                <ExecComponent buttonText="Create Uploadable-Excel"
                    placeholder='Profile Name'
                    userInputOneInfo="It will take all Abs Paths of PDFs in the Folder or Profile and create Excel for Uploads"
                    execType={uploadableExcelType}
                    reactComponent={<Box>
                        <FormControlLabel
                            control={<Checkbox checked={allNotJustPdfs} onChange={handleAllNotJustPdfs} />}
                            label="ALL- Not Just PDFs"
                        />
                    </Box>}
                />
            </Box>


            <Box display="flex" alignItems="center" gap={4} mb={2} flexDirection="column">

                <ExecComponent
                    buttonText="D/l archive.org Data As Excel"
                    placeholder='Space/Comma-Separated Archive Link(s) or Identifier(s)'
                    execType={archiveExcelExecType}
                    css={{ width: "450px" }}
                    userInputOneInfo="Enter Archive Link(s) or Identifier(s) as CSV or Space-Separated"
                    userInputThreeInfo="YYYY/MM/DD-YYYY/MM/DD (Optional). Example 2021/01/01-2021/01/31"
                    secondTextBoxPlaceHolder='Number of Items (Optional)'
                    secondComponentRequired={false}
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
                        <FormControlLabel
                            control={<Checkbox checked={inAscOrder} onChange={handleAscOrder} />}
                            label="In Asc Order"
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
                <ExecComponent
                    buttonText="Dump Archive-DB Excel Entries to MongoDB"
                    placeholder='Absolute Path to Archive Excel Folder'
                    execType={ExecType.DUMP_ARCHIVE_EXCEL_TO_MONGO}
                    userInputOneInfo="It will pick the latest Excel from the Folders"
                />
            </Box>
        </Box>
    );
}

export default ExecLauncherTwoB;
