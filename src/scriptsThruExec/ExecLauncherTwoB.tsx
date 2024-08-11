import React, { useState } from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import { ExecType } from './ExecLauncherUtil';
import { FormControlLabel, Checkbox, Button } from '@mui/material';

const ExecLauncherTwoB: React.FC = () => {
    const [dontGenerateCheck, setDontGenerateCheck] = useState(false);
    const [listingsOnly, setListingsOnly] = useState(false);
    const [inAscOrder, setInAscOrder] = useState(false);
    const [archiveExcelExecType, setArchiveExcelExecType] = useState(ExecType.GenExcelOfArchiveLinkCombo1);

    const [allNotJustPdfsV1, setAllNotJustPdfsV1] = useState(false);
    const [allNotJustPdfsV3, setAllNotJustPdfsV3] = useState(false);
    const [useFolderNameAsDesc, setUseFolderNameAsDesc] = useState(false);

    const [uploadableExcelTypeV1, setUploadableExcelTypeV1] = useState(ExecType.GenExcelV1ofAbsPathsFromProfile);
    const [uploadableExcelTypeV3, setUploadableExcelTypeV3] = useState(ExecType.GenExcelV3ofAbsPathsFromProfile);

    const handleAllNotJustPdfsV3 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAllNotJustPdfsV3(event.target.checked);
        setUploadableExcelTypeV3(_uploadableExcelV3CreateType(event.target.checked));
    };

    const handleAllNotJustPdfsV1 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAllNotJustPdfsV1(event.target.checked);
        setUploadableExcelTypeV1(_uploadableExcelV1CreateType({
            allNotJustPdfsV1: event.target.checked,
            useFolderNameAsDesc: useFolderNameAsDesc
        }));
    };
    const handleUseFolderNameAsDesc = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUseFolderNameAsDesc(event.target.checked);
        setUploadableExcelTypeV1(_uploadableExcelV1CreateType({
            useFolderNameAsDesc: event.target.checked,
            allNotJustPdfsV1: allNotJustPdfsV1
        }));
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

    const _uploadableExcelV3CreateType = (all: boolean): number => {
        return all === true ? ExecType.GenExcelV3ofAbsPathsForAllFileTypesFromProfile : ExecType.GenExcelV3ofAbsPathsFromProfile;
    }

    const _uploadableExcelV1CreateType = (options: { allNotJustPdfsV1: boolean, useFolderNameAsDesc: boolean }): number => {
        let retType = "9";
        retType += options.allNotJustPdfsV1 === true ? "1" : "0";
        retType += options.useFolderNameAsDesc === true ? "1" : "0";
        retType += "0";
        console.log("retType: ", retType);
        return parseInt(retType);
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

                <ExecComponent buttonText="Create Uploadable-Excel-V1"
                    placeholder='Profile Name'
                    userInputOneInfo="It will take all Abs Paths of PDFs in the Folder or Profile and create Excel for Uploads"
                    execType={uploadableExcelTypeV1}
                    thirdTextBoxPlaceHolder='Enter Script for Folder/File-Name Converstions(Optional)'
                    userInputThreeInfoNonMandatory='For Converting any scripts in FileName or FolderName to Roman-Colloquial (Optional)'
                    reactComponent={<Box>
                        <FormControlLabel
                            control={<Checkbox checked={allNotJustPdfsV1} onChange={handleAllNotJustPdfsV1} />}
                            label="ALL- Not Just PDFs"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={useFolderNameAsDesc} onChange={handleUseFolderNameAsDesc} />}
                            label="Use Folder Name in Description"
                        />
                    </Box>}
                />

                <ExecComponent buttonText="Create Uploadable-Excel-V3"
                    placeholder='Profile Name'
                    userInputOneInfo="It will take all Abs Paths of PDFs in the Folder or Profile and create Excel for Uploads"
                    execType={uploadableExcelTypeV3}
                    reactComponent={<Box>
                        <FormControlLabel
                            control={<Checkbox checked={allNotJustPdfsV3} onChange={handleAllNotJustPdfsV3} />}
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
                    userInputThreeInfoNonMandatory="YYYY/MM/DD-YYYY/MM/DD (Optional). Example 2021/01/01-2021/01/31"
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
                <ExecComponent buttonText="Login to Archive"
                    placeholder='Profiles as CSV'
                    execType={ExecType.LoginToArchive} />

                <ExecComponent
                    buttonText="Dump Archive-DB Excel Entries to MongoDB"
                    placeholder='Absolute Path to Archive Excel Folder'
                    execType={ExecType.DUMP_ARCHIVE_EXCEL_TO_MONGO}
                    userInputOneInfo="It will pick the latest Excel from the Folders"
                />


                <ExecComponent buttonText="British Lib Work"
                    placeholder='Profile Name'
                    thirdTextBoxPlaceHolder='Excel Name only. No Path(Optional)'
                    execType={ExecType.BL_EAP_WORK}
                    css={{ width: "250px" }}
                    css3={{ width: "450px" }}
                />
            </Box>
        </Box>
    );
}

export default ExecLauncherTwoB;
