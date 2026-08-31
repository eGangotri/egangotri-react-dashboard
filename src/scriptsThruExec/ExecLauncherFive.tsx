import React, { useState } from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import { ExecType } from './ExecLauncherUtil';
import { Button, Link, Typography } from '@mui/material';
import {
    COMBINATION_EXCEL_PATH_LOCAL_STORAGE_KEY,
    GDRIVE_EXCEL_NAME_LOCAL_STORAGE_KEY,
    REDUCED_SUFFIX, TOP_N_FILE_LOCAL_STORAGE_KEY
} from 'service/consts';
import GDriveCatalogerExcelComponent from './GDriveCatalogerExcelComponent';

const loadStoredValue = (key: string, setter: (value: string) => void) => {
    const storedValue = localStorage.getItem(key);
    if (storedValue) {
        setter(storedValue);
    }
};

const LoadFromLocalStorageButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <Button variant="contained" color="primary" onClick={onClick}
        sx={{ marginRight: "10px", marginBottom: "10px" }}>Load From Local Storage</Button>
);

const ExecLauncherFive: React.FC = () => {
    const [allPDFExcelName, setAllPDFExcelName] = useState('');
    const [reducedPDFExcelName, setReducedPDFExcelName] = useState('');
    const [topNFileDumpPath, setTopNFileDumpPath] = useState('');
    const [combinationExcelPath, setCombinationExcelPath] = useState('');
    const [validationCss, setValidationCss] = useState({
        backgroundColor: "lightgreen",
        width: "450px"
    });

    const handleInputChange = (inputValue: string) => {
        const isValid = /\.xlsx["']?$/.test(inputValue);
        console.log(`handleInputChange ${isValid}`)
        setValidationCss({ backgroundColor: isValid ? "lightgreen" : "red", width: "450px" });
    };

    const loadFromLocalStorage = () => {
        loadStoredValue(GDRIVE_EXCEL_NAME_LOCAL_STORAGE_KEY, setAllPDFExcelName);
        loadStoredValue(`${GDRIVE_EXCEL_NAME_LOCAL_STORAGE_KEY}${REDUCED_SUFFIX}`, setReducedPDFExcelName);
    };

    const loadTopNPathFromLocalStorage = () =>
        loadStoredValue(TOP_N_FILE_LOCAL_STORAGE_KEY, setTopNFileDumpPath);

    const loadComboExcelFromLocalStorage = () =>
        loadStoredValue(COMBINATION_EXCEL_PATH_LOCAL_STORAGE_KEY, setCombinationExcelPath);

    return (
        <Box display="flex" gap={4} mb={2} flexDirection="row">

            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                <GDriveCatalogerExcelComponent />
                <Box>
                    <Typography variant="h6" component="div" gutterBottom>
                        <ol>
                            <li>0.1a. (Manual) snap2html</li>
                            <li>0.1b. (Manual) Txt/Excel/CSV Via <Link href="/execLauncher3"></Link> 'List Files in Folders(Gradle)' Task</li>
                            <li>0.1c. (Manual) dump 1a/1b to the corresponding Treasure in local. Dump Local to G-Drive
                                <Link href="https://drive.google.com/drive/folders/1F7j5eP-sMGav_D4amCbWiqWjpe2Zz4x1" className="px-1">here</Link>
                            </li>
                            <li>0.1d. (Manual) Take Success Upload of 1c as screenshot and put in Local and G-Driv</li>
                            <li>1a. Generate Excel of Google Drive Links</li>
                            <li>2. Create Reduced PDFs with First and Last 10 Pages</li>
                            <li>2b. Manual Task. Dump Reduced PDFs to Google Drive here
                                <Link href="https://drive.google.com/drive/folders/0B574J2laJW2nfngzbjRNTnI2LXVMdjBYZFlWNTFXNm91ZUhaUHRzXzE1THRBLWVVTkRhTUk?resourcekey=0-NZqne5a21LtT83vy_2Y4ug&usp=drive_link" className="px-1">here</Link>
                            </li>
                            <li>3. Generate Excel of Reduced PDFs</li>
                            <li>4. Combine Excel in Step 5 with 1</li>
                            <li>5 Upload to Mongo</li>
                        </ol>
                    </Typography>
                </Box>
            </Box>

            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">

                <ExecComponent
                    buttonText="Find Missing Page Count"
                    placeholder='Excel Path'
                    userInputOneInfo='Excel for GDrive Pdf List Error Check for Missing Page Count Entries & repopulation'
                    execType={ExecType.FindMissingPageCountInExcelAndRepopulate}
                    css={validationCss}
                    onInputChange={handleInputChange}
                />
                <ExecComponent
                    buttonText="Get First and Last N Pages-Python"
                    placeholder='Absolute Path to PDFs Folder(s) as CSV'
                    secondTextBoxPlaceHolder='"reduced", unless stated otherwise'
                    thirdTextBoxPlaceHolder='N Pages. Ex. 10 or 10-20'
                    userInputThreeInfoNonMandatory='N Pages. Use - to specify diff. First and Last Values Ex. 10-20'
                    thirdTextBoxDefaultValue={"25"}
                    execType={ExecType.GET_FIRST_N_PAGES_PYTHON}
                    css={{ minWidth: "23vw" }}
                    css2={{ minWidth: "23vw" }}
                    css3={{ marginTop: "30px", minWidth: "23vw" }}
                    thirdButton={<LoadFromLocalStorageButton onClick={loadTopNPathFromLocalStorage} />}
                />
                <Box>
                    {topNFileDumpPath && <Typography variant="h6" component="div" gutterBottom>Path to Reduced PDFs {topNFileDumpPath} for dumping to G-Drive</Typography>}
                </Box>

                <ExecComponent
                    buttonText="Get First and Last N Pages-Gradle"
                    placeholder='Absolute Path to PDFs Folder(s) as CSV'
                    secondTextBoxPlaceHolder='"reduced", unless stated otherwise'
                    thirdTextBoxPlaceHolder='N Pages. Ex. 10 or 10-20'
                    userInputThreeInfoNonMandatory='N Pages. Use - to specify diff. First and Last Values Ex. 10-20'
                    thirdTextBoxDefaultValue={"20"}
                    execType={ExecType.GET_FIRST_N_PAGES_PYTHON}
                    css={{ minWidth: "23vw" }}
                    css2={{ minWidth: "23vw" }}
                    css3={{ marginTop: "30px", minWidth: "23vw" }}
                    multiline1stTf
                    rows1stTf={4}
                    thirdButton={<LoadFromLocalStorageButton onClick={loadTopNPathFromLocalStorage} />}
                    reactComponent={
                        <div>Can be run concurrently??</div>
                    }

                />
                <Box></Box>
            </Box>

            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                <ExecComponent
                    buttonText="Combine G Drive and Reduced PDF Drive Excels"
                    placeholder='Absolute Path to G-Drive-Main Excel Folder'
                    secondTextBoxPlaceHolder='Absolute Path to G-Drive Reduced Pdf Excel Folder'
                    //  thirdTextBoxPlaceHolder='Optional Output Excel Path'
                    execType={ExecType.COMBINE_GDRIVE_AND_REDUCED_PDF_DRIVE_EXCELS}
                    css={{ minWidth: "33vw" }}
                    css2={{ minWidth: "35vw" }}
                    userInputOneInfo="It will pick the latest Excel from the Folders"
                    textBoxOneValue={allPDFExcelName}
                    textBoxTwoValue={reducedPDFExcelName}
                    thirdButton={<LoadFromLocalStorageButton onClick={loadFromLocalStorage} />}
                //  css3={{marginTop: "30px", width: "100%"}}
                />

                <ExecComponent
                    buttonText="Dump Combination Excel to MongoDB**"
                    placeholder='Absolute Path to Combination Excel Folder'
                    execType={ExecType.DUMP_GDRIVE_COMBO_EXCEL_TO_MONGO}
                    css={{ minWidth: "33vw" }}
                    userInputOneInfo="It will pick the latest Excel from the Folders"
                    textBoxOneValue={combinationExcelPath}
                    thirdButton={<LoadFromLocalStorageButton onClick={loadComboExcelFromLocalStorage} />}
                //  css3={{marginTop: "30px", width: "100%"}}
                />
                <Typography>
                    ***You can run this for multiple excels in a folder.<br></br>
                    pnpm run excelFolderToMongoGDrive "C:\path\to\your\folder_with_excels"
                </Typography>
            </Box>
        </Box>

    );
}

export default ExecLauncherFive;
