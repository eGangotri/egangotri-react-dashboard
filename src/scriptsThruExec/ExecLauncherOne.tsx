import React, { ChangeEvent, useState } from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import { ExecType } from './ExecLauncherUtil';
import * as XLSX from 'xlsx';
import { FOLDER_OF_UNZIPPED_IMGS, FOLDER_TO_UNZIP } from 'service/consts';
import { Button, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import { unzipFolders } from 'service/launchYarn';


const ExecLauncherOne: React.FC = () => {
    const [flatten, setFlatten] = useState<boolean>(true);
    const [folderToUnzip, setFolderToUnzip] = useState<string>("");
    const [folderOfUnzippedImgs, setFolderOfUnzippedImgs] = useState<string>("");

    const [imgType, setImgType] = useState(ExecType.JPG_TO_PDF);
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

    const handleChangeImgFilesToPdf = (event: ChangeEvent<HTMLInputElement>) => {
        const _val = event.target.value;
        console.log("ImgType: ", _val);
        setImgType(Number(_val));
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
                    css2={{ backgroundColor: "lightgreen" }} />
                    <Typography variant="body1" gutterBottom>
                        <p>Warning. Some G-drive-dwnl-ed folders dont delete.</p>
                        <p>Use To delete them from cmd prompt:  rmdir /s /q "D:\_playground\FILE_PATH"</p>
                    </Typography>

            </Box>

            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                <ExecComponent
                    buttonText="D/l Zips from GDrive"
                    placeholder='Enter Google Drive Link(s)/Identifiers as csv'
                    secondTextBoxPlaceHolder='Enter Profile or File Abs Path'
                    execType={ExecType.DownloadGoogleDriveLinkAsZip}
                    css={{ backgroundColor: "lightgreen", width: "450px" }}
                    css2={{ backgroundColor: "lightgreen" }} />

                <ExecComponent
                    buttonText="Unzip all Zip Files"
                    placeholder='Folder Abs Path'
                    thirdButton={<Button
                        variant="contained"
                        color="primary"
                        onClick={loadFolderToUnzipFromLocalStorage}
                        sx={{ marginRight: "10px", marginBottom: "10px" }}>Load From Local Storage</Button>}
                    textBoxOneValue={folderToUnzip}

                    execType={ExecType.UnzipAllFiles} />

                <ExecComponent
                    buttonText="Img Files(jpg/png/tiff) to pdf"
                    placeholder='Folder Abs Path'
                    execType={imgType}
                    reactComponent={<>
                        <RadioGroup aria-label="fileType" name="fileType" value={imgType} onChange={handleChangeImgFilesToPdf} row>
                            <FormControlLabel value={ExecType.JPG_TO_PDF} control={<Radio />} label="JPG" />
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
                />
            </Box>

            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">

                <ExecComponent
                    buttonText="Create G-Drive Excel"
                    placeholder='Enter Google Drive Link(s)/Identifiers as csv'
                    secondTextBoxPlaceHolder='Enter Folder Name (not path)'
                    execType={excelGDrive}
                    css={{ minWidth: "23vw" }}
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
                />
            </Box>
        </Box>

    );
}

export default ExecLauncherOne;
