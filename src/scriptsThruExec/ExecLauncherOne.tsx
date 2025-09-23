import React, { ChangeEvent, useState } from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import { ExecType } from './ExecLauncherUtil';
import * as XLSX from 'xlsx';
import { Button, Checkbox, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import { ALL_NOT_JUST_PDF_SUFFIX, GDRIVE_EXCEL_NAME_LOCAL_STORAGE_KEY, LOCAL_LISTING_EXCEL_LOCAL_STORAGE_KEY } from 'service/consts';


const ExecLauncherOne: React.FC = () => {
    const [excelGDrive, setExcelGDrive] = React.useState<number>(ExecType.GenExcelOfGoogleDriveLinkPdfOnly);
    const [gDriveFileType, setGDriveFileType] = React.useState<number>(ExecType.DWNLD_PDFS_ONLY_FROM_GOOGLE_DRIVE);
    const [label, setLabel] = React.useState<string>("");
    const [verfiyGDrive, setVerifyGDrive] = React.useState<number>(ExecType.VERIFY_G_DRIVE_PDF_DOWNLOAD);
    const [verifyGDriveFileType, setVerifyGDriveFileType] = React.useState<number>(1);

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

    const chooseGDriveFileType = (event: ChangeEvent<HTMLInputElement>) => {
        const _val = event.target.value;
        console.log("_val", _val)
        let _dwnldFileType;
        switch (Number(_val)) {
            case ExecType.DWNLD_PDFS_ONLY_FROM_GOOGLE_DRIVE:
                _dwnldFileType = ExecType.DWNLD_PDFS_ONLY_FROM_GOOGLE_DRIVE;
                break;
            case ExecType.DWNLD_ZIPS_ONLY_FROM_GOOGLE_DRIVE:
                _dwnldFileType = ExecType.DWNLD_ZIPS_ONLY_FROM_GOOGLE_DRIVE;
                break;
            case ExecType.DWNLD_ALL_FROM_GOOGLE_DRIVE:
                _dwnldFileType = ExecType.DWNLD_ALL_FROM_GOOGLE_DRIVE;
                break;
        }
        console.log("_dwnldFileType", _dwnldFileType);
        setGDriveFileType(_dwnldFileType || ExecType.DWNLD_PDFS_ONLY_FROM_GOOGLE_DRIVE);
        if (_dwnldFileType === ExecType.DWNLD_PDFS_ONLY_FROM_GOOGLE_DRIVE) {
            setLabel("PDFs");
        } else if (_dwnldFileType === ExecType.DWNLD_ZIPS_ONLY_FROM_GOOGLE_DRIVE) {
            setLabel("Zips");
        } else if (_dwnldFileType === ExecType.DWNLD_ALL_FROM_GOOGLE_DRIVE) {
            setLabel("All");
        }
    };


    const [verifyBySizeOnly, setVerifyBySizeOnly] = useState(false);
    const handleVerifyBySizeOnly = (event: React.ChangeEvent<HTMLInputElement>) => {
        setVerifyBySizeOnly(event.target.checked);
        _setVerifyGDriveFileTypeAndSizeOnlyflag(String(verifyGDriveFileType));
    };
    const chooseVerifyGDriveFileType = (event: ChangeEvent<HTMLInputElement>) => {
        const _val = event.target.value;
        console.log("_val", _val)
        _setVerifyGDriveFileTypeAndSizeOnlyflag(_val);
        setVerifyGDriveFileType(Number(_val));
    };

    const _setVerifyGDriveFileTypeAndSizeOnlyflag = (_verfiyGDriveFileType: string) => {
        let _verifyFileType;
        switch (Number(_verfiyGDriveFileType)) {
            case 1:
                _verifyFileType = verifyBySizeOnly ? ExecType.VERIFY_G_DRIVE_PDF_DOWNLOAD_SIZE_ONLY : ExecType.VERIFY_G_DRIVE_PDF_DOWNLOAD;
                break;
            case 2:
                _verifyFileType = verifyBySizeOnly ? ExecType.VERIFY_G_DRIVE_ZIP_DOWNLOAD_SIZE_ONLY : ExecType.VERIFY_G_DRIVE_ZIP_DOWNLOAD;
                break;
            case 3:
                _verifyFileType = verifyBySizeOnly ? ExecType.VERIFY_G_DRIVE_ALL_DOWNLOAD_SIZE_ONLY : ExecType.VERIFY_G_DRIVE_ALL_DOWNLOAD;
                break;
        }
        console.log("_dwnldFileType", _verifyFileType);
        setVerifyGDrive(_verifyFileType || ExecType.VERIFY_G_DRIVE_PDF_DOWNLOAD);
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

    const [validationCss, setValidationCss] = React.useState({
        backgroundColor: "lightgreen",
        width: "450px"
    });


    const [validationCss2, setValidationCss2] = React.useState({
        backgroundColor: "lightgreen",
        width: "450px"
    });


    const [gDriveExcelName, setGDriveExcelName] = useState('');
    const [localListingExcelName, setLocalListingExcelName] = useState('');
    const loadFromLocalStorage = () => {
        let storedValue = localStorage.getItem(`${GDRIVE_EXCEL_NAME_LOCAL_STORAGE_KEY}${ALL_NOT_JUST_PDF_SUFFIX}`);

        console.log(`loadFromLocalStorage called ${storedValue}`)
        if (storedValue) {
            setGDriveExcelName(storedValue || "-");
        }

        let storedValue2 = localStorage.getItem(LOCAL_LISTING_EXCEL_LOCAL_STORAGE_KEY);
        console.log(`loadFromLocalStorage called ${storedValue2}`)
        if (storedValue2) {
            setLocalListingExcelName(storedValue2);
        }
    }


    const handleInputChange = (inputValue: string, num = 1) => {
        console.log("inputValue", inputValue, `inputValue.includes("ab") ${inputValue.includes("ab")}`);
        if (num === 1) {
            if (inputValue.includes("/") || inputValue.includes("\\")) {
                setValidationCss({ backgroundColor: "red", width: "450px" });
            } else {
                setValidationCss({ backgroundColor: "lightgreen", width: "450px" });
            }
        }
        else {
            if (inputValue.includes("/") || inputValue.includes("\\")) {
                setValidationCss2({ backgroundColor: "red", width: "450px" });
            } else {
                setValidationCss2({ backgroundColor: "lightgreen", width: "450px" });
            }
        }
    };


    return (
        <Box display="flex" gap={4} mb={2} flexDirection="row">
            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                <ExecComponent
                    buttonText={`D/l ${label} from GDrive`}
                    placeholder='Enter Google Drive Link(s)/Identifiers as csv'
                    secondTextBoxPlaceHolder='Enter Profile or File Abs Path'
                    execType={gDriveFileType}
                    css={{ backgroundColor: "lightgreen", width: "450px" }}
                    css2={{ backgroundColor: "lightgreen", width: "450px" }}
                    reactComponent={<>
                        <RadioGroup aria-label="gDriveFileType" name="gDriveFileType" value={gDriveFileType} onChange={chooseGDriveFileType} row>
                            <FormControlLabel value={ExecType.DWNLD_PDFS_ONLY_FROM_GOOGLE_DRIVE} control={<Radio />} label="PDF-Only" />
                            <FormControlLabel value={ExecType.DWNLD_ZIPS_ONLY_FROM_GOOGLE_DRIVE} control={<Radio />} label="ZIP-ONLY" />
                            <FormControlLabel value={ExecType.DWNLD_ALL_FROM_GOOGLE_DRIVE} control={<Radio />} label="ALL" />
                        </RadioGroup>
                    </>}
                />
                <Typography variant="body1" gutterBottom>
                    <p>Warning. Some G-drive-dwnld-ed folders dont delete.</p>
                    <p>Use 7Zip Del to delete or from cmd prompt from:</p>
                    <p>File:  del "C:\path\to\your\file.txt"</p>
                    <p>Folder: rmdir /s /q "D:\_playground\FILE_PATH"</p>
                </Typography>
                <ExecComponent
                    execType={verfiyGDrive}
                    css={{ minWidth: "450px" }}
                    css2={{ minWidth: "450px" }}
                    buttonText="Verify Task:D/l Tasks from GDrive"
                    placeholder='Enter Google Drive Link(s)/Identifiers as csv'
                    secondTextBoxPlaceHolder='Enter Profile or File Abs Path'
                    reactComponent={<>
                        <Box>
                            <FormControlLabel
                                control={<Checkbox checked={verifyBySizeOnly} onChange={handleVerifyBySizeOnly} />}
                                label="Verify by Size Only"
                            />
                        </Box>
                        <RadioGroup aria-label="verifyGDriveFileType" name="verifyGDriveFileType"
                            value={verifyGDriveFileType}
                            onChange={chooseVerifyGDriveFileType} row>
                            <FormControlLabel value={1} control={<Radio />} label="PDF-Only" />
                            <FormControlLabel value={2} control={<Radio />} label="ZIP-ONLY" />
                            <FormControlLabel value={3} control={<Radio />} label="ALL" />
                        </RadioGroup></>}

                />
            </Box>

            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                <ExecComponent
                    buttonText="Create G-Drive Cataloger Version Excel"
                    placeholder='Enter Google Drive Link(s)/Identifiers as csv'
                    secondTextBoxPlaceHolder='Enter Folder Name (not path)'
                    execType={excelGDrive}
                    css={{ minWidth: "23vw", width: "450px" }}
                    css2={validationCss}
                    onInputChange={handleInputChange}
                    userInputTwoInfoNonMandatory="Only Folder Name not Path"
                    reactComponent={<>
                        <RadioGroup aria-label="excelGDrive" name="excelGDrive" value={excelGDrive} onChange={chooseGDriveExcelType} row>
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
                    css2={validationCss2}
                    onInputChange={(x) => handleInputChange(x, 2)}
                    userInputTwoInfoNonMandatory="Only Folder Name not Path"
                />

            </Box>

            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                <ExecComponent buttonText="List all Files in Local Folder as Excel - PNPM"
                    placeholder='Folder Path or Freezed Profile'
                    execType={ExecType.GenListingsofLocalFolderAsAllYarn}
                />

                <ExecComponent
                    buttonText="Compare G-Drive and Local Excel"
                    placeholder='Absolute Path to G-Drive Excel'
                    secondTextBoxPlaceHolder='Absolute Path to Local Excel'
                    execType={ExecType.COMPARE_G_DRIVE_AND_LOCAL_EXCEL}
                    css={{ minWidth: "33vw" }}
                    css2={{ minWidth: "35vw" }}
                    textBoxOneValue={gDriveExcelName}
                    textBoxTwoValue={localListingExcelName}
                    thirdButton={<Button variant="contained" color="primary" onClick={loadFromLocalStorage} sx={{ marginRight: "10px", marginBottom: "10px" }}>Load From Local Storage</Button>}
                />
            </Box>
        </Box>

    );
}

export default ExecLauncherOne;
