import React, { ChangeEvent, useState } from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import { ExecType } from './ExecLauncherUtil';
import * as XLSX from 'xlsx';
import { FOLDER_OF_UNZIPPED_IMGS, FOLDER_TO_UNZIP } from 'service/consts';
import { FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';


const ExecLauncherOne: React.FC = () => {
    const [mergeType, setMergeType] = React.useState<number>(ExecType.MERGE_PDFS_MERGE_ALL);
    const [folderToUnzip, setFolderToUnzip] = useState<string>("");
    const [excelGDrive, setExcelGDrive] = React.useState<number>(ExecType.GenExcelOfGoogleDriveLinkPdfOnly);

    const chooseGDriveExcelType = (event: ChangeEvent<HTMLInputElement>) => {
        const _val = event.target.value;
        console.log("_val", _val)
        let _listingType;
        switch (Number(_val)) {
            case ExecType.GenExcelOfGoogleDriveLinkPdfOnly:
                _listingType = ExecType.GenExcelOfGoogleDriveLinkPdfOnly;
                break;
            case ExecType.GenExcelOfGoogleDriveLinkForAll:
                _listingType = ExecType.GenExcelOfGoogleDriveLinkForAll;
                break;
            case ExecType.GenExcelOfGoogleDriveLinkForRenameFilesExcel:
                _listingType = ExecType.GenExcelOfGoogleDriveLinkForRenameFilesExcel;
                break;
            case ExecType.GenExcelOfGoogleDriveLinkForReduced:
                _listingType = ExecType.GenExcelOfGoogleDriveLinkForReduced;
                break;
        }
        console.log("_listingType", _listingType);
        setExcelGDrive(_listingType || ExecType.GenExcelOfGoogleDriveLinkPdfOnly);
    };



    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event?.target?.files || []
        const file0 = (file?.length || 0) > 0 ? file[0] : null;
        await readExcel(file0);
    };

    const readExcel = async (file: File | null) => {
        if (!file) return;
        try {
            const fileReader = new FileReader();
            const readedFile = await new Promise((resolve, reject) => {
                fileReader.onload = (e) => resolve(e.target?.result);
                fileReader.onerror = reject;
                fileReader.readAsArrayBuffer(file);
            });

            const wb = XLSX.read(readedFile, { type: 'buffer' });

            const wsname = wb.SheetNames[0];

            const ws = wb.Sheets[wsname];
            console.log("ws", JSON.stringify(ws))
            const data = XLSX.utils.sheet_to_json(ws);

            return data;
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <Box display="flex" gap={4} mb={2} flexDirection="row">

            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                <ExecComponent
                    buttonText="D/l Pdfs from GDrive"
                    placeholder='Enter Google Drive Link(s)/Identifiers as csv'
                    secondTextBoxPlaceHolder='Enter Profile or File Abs Path'
                    execType={ExecType.DownloadGoogleDriveLinkPdfs}
                    css={{ backgroundColor: "lightgreen", width: "450px" }}
                    css2={{ backgroundColor: "lightgreen", width: "450px" }} />
                <Typography variant="body1" gutterBottom>
                    <p>Warning. Some G-drive-dwnld-ed folders dont delete.</p>
                    <p>Use 7Zip Del to delete or from cmd prompt from:</p>
                    <p>File:  del "C:\path\to\your\file.txt"</p>
                    <p>Folder: rmdir /s /q "D:\_playground\FILE_PATH"</p>
                </Typography>
            </Box>

            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                <ExecComponent
                    buttonText="Create G-Drive Excel"
                    placeholder='Enter Google Drive Link(s)/Identifiers as csv'
                    secondTextBoxPlaceHolder='Enter Folder Name (not path)'
                    execType={excelGDrive}
                    css={{ minWidth: "23vw", width: "450px" }}
                    css2={{ backgroundColor: "lightgreen", width: "450px" }}
                    reactComponent={<>
                        <RadioGroup aria-label="fileType" name="fileType" value={excelGDrive} onChange={chooseGDriveExcelType} row>
                            <FormControlLabel value={ExecType.GenExcelOfGoogleDriveLinkPdfOnly} control={<Radio />} label="PDF-Only" />
                            <FormControlLabel value={ExecType.GenExcelOfGoogleDriveLinkForAll} control={<Radio />} label="ALL" />
                            <FormControlLabel value={ExecType.GenExcelOfGoogleDriveLinkForRenameFilesExcel} control={<Radio />} label="Renamer" />
                            <FormControlLabel value={ExecType.GenExcelOfGoogleDriveLinkForReduced} control={<Radio />} label="REDUCED" />
                        </RadioGroup>
                    </>}
                />

                <ExecComponent
                    buttonText="Download from GDrive Excel"
                    placeholder='Enter Excel Path'
                    secondTextBoxPlaceHolder='Enter Folder Name (not path)'
                    execType={ExecType.DownloadAllGDriveItemsViaExcel}
                    css={{ width: "450px" }}
                    css2={{ backgroundColor: "lightgreen", width: "450px" }}
                />

            </Box>
        </Box>

    );
}

export default ExecLauncherOne;
