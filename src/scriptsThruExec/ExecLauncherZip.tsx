import React, { ChangeEvent, useState } from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import { ExecType } from './ExecLauncherUtil';
import * as XLSX from 'xlsx';
import { FOLDER_OF_UNZIPPED_IMGS, FOLDER_TO_UNZIP } from 'service/consts';
import { Button, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import { unzipFolders } from 'service/launchYarn';
import { IMG_TYPE_ANY, IMG_TYPE_JPG, IMG_TYPE_PNG, IMG_TYPE_TIF } from './constants';


const ExecLauncherZip: React.FC = () => {
    const [flatten, setFlatten] = useState<boolean>(true);
    const [folderToUnzip, setFolderToUnzip] = useState<string>("");
    const [folderOfUnzippedImgs, setFolderOfUnzippedImgs] = useState<string>("");

    const [imgType, setImgType] = useState(ExecType.ANY_IMG_TYPE_TO_PDF);
    const [imgTypeForVerification, setImgTypeForVerification] = useState(ExecType.VERIFY_IMG_TO_PDF_SUCCESS_ANY);
    const [excelGDrive, setExcelGDrive] = React.useState<number>(ExecType.GenExcelOfGoogleDriveLinkPdfOnly);
    const [mergeType, setMergeType] = React.useState<number>(ExecType.MERGE_PDFS_MERGE_ALL);

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

    const chooseMergeType = (event: ChangeEvent<HTMLInputElement>) => {
        const _val = event.target.value;
        console.log("_val", _val)
        let _listingType;
        switch (Number(_val)) {
            case ExecType.MERGE_PDFS_MERGE_ALL:
                _listingType = ExecType.MERGE_PDFS_MERGE_ALL;
                break;
            case ExecType.MERGE_PDFS_MERGE_PER_FOLDER:
                _listingType = ExecType.MERGE_PDFS_MERGE_PER_FOLDER;
                break;
        }
        console.log("_listingType", _listingType);
        setMergeType(_listingType || ExecType.MERGE_PDFS_MERGE_ALL);
    };

    const handleChangeImgFilesToPdf = (event: ChangeEvent<HTMLInputElement>) => {
        const _val = event.target.value;
        console.log("ImgType: ", _val);
        setImgType(Number(_val));
    };
    const handleChangeImgFilesForVerificationToPdf = (event: ChangeEvent<HTMLInputElement>) => {
        const _val = event.target.value;
        console.log("ImgType: ", _val);
        setImgTypeForVerification(Number(_val));
    };
    

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFlatten(event.target.checked);
    };


    // ...

    const [items, setItems] = useState([]);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event?.target?.files || []
        const file0 = (file?.length || 0) > 0 ? file[0] : null;
        await readExcel(file0);
        console.log("items", JSON.stringify(items))
    };

    const readExcelXX = (file: File | null) => {
        if (!file) return;
        const promise = new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);

            fileReader.onload = (e) => {
                const bufferArray = e.target?.result;

                const wb = XLSX.read(bufferArray, { type: 'buffer' });

                const wsname = wb.SheetNames[0];

                const ws = wb.Sheets[wsname];

                const data = XLSX.utils.sheet_to_json(ws);

                resolve(data);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        promise.then((d: any) => {
            setItems(d);
        });
    };

    const loadFolderToUnzipFromLocalStorage = () => {
        let storedValue = localStorage.getItem(FOLDER_TO_UNZIP);

        console.log(`loadFromLocalStorage called ${storedValue}`)
        if (storedValue) {
            setFolderToUnzip(storedValue);
        }
    }

    const loadFolderOfUnzippedImgFilesFromLocalStorage = () => {
        let storedValue = localStorage.getItem(FOLDER_OF_UNZIPPED_IMGS);

        console.log(`loadFromLocalStorage called ${storedValue}`)
        if (storedValue) {
            setFolderOfUnzippedImgs(storedValue);
        }
    }

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

                <ExecComponent
                    buttonText="Verify Unzipped Files->Pdf successful"
                    placeholder='Folder Abs Path'
                    execType={imgTypeForVerification}
                    textBoxOneValue={folderOfUnzippedImgs}
                    css={{ backgroundColor: "violet", width: "450px" }}
                    reactComponent={<>
                        <RadioGroup aria-label="imgTypeForVerification" name="imgTypeForVerification" value={imgTypeForVerification} onChange={handleChangeImgFilesForVerificationToPdf} row>
                            <FormControlLabel value={ExecType.VERIFY_IMG_TO_PDF_SUCCESS_ANY} control={<Radio />} label={IMG_TYPE_ANY} />
                            <FormControlLabel value={ExecType.VERIFY_IMG_TO_PDF_SUCCESS_JPG} control={<Radio />} label={IMG_TYPE_JPG} />
                            <FormControlLabel value={ExecType.VERIFY_IMG_TO_PDF_SUCCESS_PNG} control={<Radio />} label={IMG_TYPE_PNG} />
                            <FormControlLabel value={ExecType.VERIFY_IMG_TO_PDF_SUCCESS_TIF} control={<Radio />} label={IMG_TYPE_TIF} />
                        </RadioGroup>
                    </>}
                    thirdButton={<Button
                        variant="contained"
                        color="primary"
                        onClick={loadFolderToUnzipFromLocalStorage}
                        sx={{ marginRight: "10px", marginBottom: "10px" }}>Load From Local Storage</Button>}
                 
                />
            </Box>

            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                <ExecComponent
                    buttonText="D/l Zips from GDrive"
                    placeholder='Enter Google Drive Link(s)/Identifiers as csv'
                    secondTextBoxPlaceHolder='Enter Profile or File Abs Path'
                    execType={ExecType.DownloadGoogleDriveLinkAsZip}
                    css={{ backgroundColor: "violet", width: "450px" }}
                    css2={{ backgroundColor: "violet", width: "450px" }}
                />
                <ExecComponent
                    buttonText="Unzip all Zip Files"
                    placeholder='Folder Abs Path'
                    thirdButton={<Button
                        variant="contained"
                        color="primary"
                        onClick={loadFolderToUnzipFromLocalStorage}
                        sx={{ marginRight: "10px", marginBottom: "10px" }}>Load From Local Storage</Button>}
                    textBoxOneValue={folderToUnzip}
                    css={{ backgroundColor: "violet", width: "450px" }}
                    css2={{ backgroundColor: "violet", width: "450px" }}
                    execType={ExecType.UnzipAllFiles} />

                <ExecComponent
                    buttonText="Img Files(any/jpg/png/tiff) to pdf"
                    placeholder='Folder Abs Path'
                    execType={imgType}
                    reactComponent={<>
                        <RadioGroup aria-label="fileType" name="fileType" value={imgType} onChange={handleChangeImgFilesToPdf} row>
                            <FormControlLabel value={ExecType.ANY_IMG_TYPE_TO_PDF} control={<Radio />} label="ANY" />
                            <FormControlLabel value={ExecType.JPG_TO_PDF} control={<Radio />} label={IMG_TYPE_JPG} />
                            <FormControlLabel value={ExecType.PNG_TO_PDF} control={<Radio />} label="PNG" />
                            <FormControlLabel value={ExecType.TIFF_TO_PDF} control={<Radio />} label="TIFF" />
                        </RadioGroup>
                    </>}
                    thirdButton={<Button
                        variant="contained"
                        color="primary"
                        onClick={loadFolderOfUnzippedImgFilesFromLocalStorage}
                        sx={{ marginRight: "10px", marginBottom: "10px" }}>Load From Local Storage</Button>}
                    textBoxOneValue={folderOfUnzippedImgs}
                    css={{ backgroundColor: "violet", width: "450px" }}
                    css2={{ backgroundColor: "violet", width: "450px" }}
                />

            </Box>

            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                <ExecComponent
                    buttonText="Merge Pdfs in Folder"
                    placeholder='Folder Abs Path'
                    execType={mergeType}
                    textBoxOneValue={folderToUnzip}
                    css={{ width: "450px" }}
                    reactComponent={<>
                        <RadioGroup aria-label="mergeType" name="mergeType" value={mergeType} onChange={chooseMergeType} row>
                            <FormControlLabel value={ExecType.MERGE_PDFS_MERGE_ALL} control={<Radio />} label="Merge All" />
                            <FormControlLabel value={ExecType.MERGE_PDFS_MERGE_PER_FOLDER} control={<Radio />} label="Merge Per Folder" />
                        </RadioGroup>
                    </>} />

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
                    buttonText="Download from GDrive Excel-
                    Not Ready"
                    placeholder='Enter Google Drive Link(s)/Identifiers as csv'
                    secondTextBoxPlaceHolder='Enter Folder Name (not path)'
                    execType={ExecType.GenExcelOfGoogleDriveLinkPdfOnly}
                    reactComponent={<>
                        <input type="file" onChange={handleFileChange} />
                    </>}
                    css={{ width: "450px" }}
                    css2={{ backgroundColor: "lightgreen", width: "450px" }}
                />

            </Box>
        </Box>

    );
}

export default ExecLauncherZip;
