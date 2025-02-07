import React, { useState } from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import { ExecType } from './ExecLauncherUtil';
import { Button, Link, Typography } from '@mui/material';

const ExecLauncher4B: React.FC = () => {
    const [filePath, setFilePath] = useState('');

    const [validationCss, setValidationCss] = React.useState({
        backgroundColor: "lightgreen",
        width: "450px"
    });
    const handleInputChange = (inputValue: string) => {
        console.log("inputValue", inputValue, `inputValue.includes("ab") ${inputValue.includes("ab")}`);
        if (inputValue.includes("/") || inputValue.includes("\\")) {
            setValidationCss({ backgroundColor: "red", width: "450px" });
        } else {
            setValidationCss({ backgroundColor: "lightgreen", width: "450px" });
        }
    };

    return (
        <Box display="flex" gap={4} mb={2} flexDirection="row">
            <Box display="flex" alignItems="center" gap={4} mb={2} flexDirection="column">
                <ExecComponent
                    buttonText="Get First and Last N Pages-Python"
                    placeholder='Absolute Path to PDFs Folder(s) as CSV'
                    secondTextBoxPlaceHolder='"reduced", unless you state otherwise'
                    thirdTextBoxPlaceHolder='N Pages. Ex. 10 or 10-20'
                    userInputThreeInfoNonMandatory='N Pages. Use - to specify diff. First and Last Values Ex. 10-20'
                    thirdTextBoxDefaultValue={"25"}
                    execType={ExecType.GET_FIRST_N_PAGES}
                    css={{ minWidth: "35vw" }}
                    css2={{ minWidth: "35vw" }}
                    css3={{ marginTop: "30px", minWidth: "23vw" }}
                    textBoxOneValue={filePath}
                    multiline1stTf
                    rows1stTf={4}
                />

                <Box>
                    <Typography variant="h6" component="div" gutterBottom>
                        <ol>
                            <li>1. Create Reduced PDFs with First and Last n Pages</li>
                            <li>2. Manual Task. Dump Reduced PDFs to Google Drive</li>
                            <li>Ex. this: <Link href='https://drive.google.com/drive/folders/1Z2l9PNGz4G5eJo37HmQssrVR0szQ6FVN'>Persian Renaming</Link></li>
                            <li>3. Generate Excel of Google Drive Links of Reduced PDF</li>
                            <li>4. Manual Task. Upload Pdf to Google Drive for Renamer</li>
                            <li>Explorable: Reading directly from G-Drive</li>
                            <li>5. Download Excel and rename local files</li>
                        </ol>
                    </Typography>
                </Box>
            </Box>

            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                <ExecComponent
                    buttonText="Create G-Drive Excel Renamer-Version"
                    placeholder='Enter Google Drive Link(s)/Identifiers as csv'
                    secondTextBoxPlaceHolder='Enter Folder Name (not path)'
                    execType={ExecType.GenExcelOfGoogleDriveLinkForRenameFilesExcel}
                    css={{ minWidth: "23vw" }}
                    css2={validationCss}
                    onInputChange={handleInputChange}
                    userInputTwoInfoNonMandatory="Only Folder Name not Path"

                />

                <ExecComponent buttonText="Rename Files via Excel"
                    placeholder='Excel File Path'
                    secondTextBoxPlaceHolder='Profile or Abs Path'
                    execType={ExecType.RENAME_FIES_VIA_EXCEL}
                    css={{ width: "350px" }}
                    css2={{ width: "350px" }}
                />
            </Box>
            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                <ExecComponent
                    buttonText="Convert all .txt encodings in Folder"
                    placeholder='Folder Full Path'
                    secondTextBoxPlaceHolder='Encoding From'
                    thirdTextBoxPlaceHolder='Encoding To'
                    execType={ExecType.CONVERT_MULTIPLE_TXT_FILE_SCRIPTS}
                    userInputOneInfo="any folder with multiple .txt in any number of subfolders"
                    userInputTwoInfoNonMandatory="Case Sensitive.Encoding From. Example 'Devanagari'. Names from https://www.aksharamukha.com/explore"
                    userInputThreeInfoNonMandatory="Case Sensitive.Encoding From. Example 'Roman'.  Names from https://www.aksharamukha.com/explore"
                    css={{ width: "250px" }}
                    css2={{ width: "450px" }}
                />

                <ExecComponent
                    buttonText="Convert Script"
                    placeholder='Text to Convert'
                    secondTextBoxPlaceHolder='Encoding From'
                    thirdTextBoxPlaceHolder='Encoding To'
                    execType={ExecType.CONVERT_TEXT_SCRIPT}
                    userInputOneInfo="any folder with multiple .txt in any number of subfolders"
                    userInputTwoInfoNonMandatory="Case Sensitive.Encoding From. Example 'Devanagari'. Names from https://www.aksharamukha.com/explore"
                    userInputThreeInfoNonMandatory="Case Sensitive.Encoding To. Example 'Roman'.  Names from https://www.aksharamukha.com/explore"
                    css={{ width: "250px" }}
                    css2={{ width: "450px" }}
                />

                <ExecComponent buttonText="Use Bulk Rename Conventions"
                    placeholder='Use Bulk Rename Conventions'
                    execType={ExecType.UseBulkRenameConventions} />
            </Box>
        </Box >

    );
}

export default ExecLauncher4B;
