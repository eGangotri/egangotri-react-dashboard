import React, { useState } from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import { ExecType } from './ExecLauncherUtil';
import { Button, Link, Typography } from '@mui/material';
import { AI_RENAMER_ABS_PATH_LOCAL_STORAGE_KEY, AI_RENAMER_REDUCED_PATH_LOCAL_STORAGE_KEY } from 'service/consts';

const ExecLauncherAIRenamer: React.FC = () => {
    const [filePath, setFilePath] = useState('');
    const [absPathForAiRenamer, setAbsPathForAiRenamer] = useState('');
    const [reducedPathForAiRenamer, setReducedPathForAiRenamer] = useState('');

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

    const loadSrcAndReducedPDFNamesFromLocalStorage = () => {

        let storedValue = localStorage.getItem(AI_RENAMER_ABS_PATH_LOCAL_STORAGE_KEY);
        let storedReducedValue = localStorage.getItem(AI_RENAMER_REDUCED_PATH_LOCAL_STORAGE_KEY);

        console.log(`loadFromLocalStorage called ${storedValue} ${storedReducedValue}`)
        if (storedValue) {
            setAbsPathForAiRenamer(storedValue)
        }
        if (storedReducedValue) {
            setReducedPathForAiRenamer(storedReducedValue)
        }
    }

    return (
        <Box display="flex" gap={4} mb={2} flexDirection="row">
            <Box display="flex" alignItems="center" gap={4} mb={2} flexDirection="column">
                <ExecComponent
                    buttonText="Get First and Last N Pages-Python"
                    placeholder='Absolute Path to PDFs Folder(s) as CSV'
                    secondTextBoxPlaceHolder='"reduced", unless stated otherwise'
                    thirdTextBoxPlaceHolder='N Pages. Ex. 10 or 10-20'
                    userInputThreeInfoNonMandatory='N Pages. Use - to specify diff. First and Last Values Ex. 10-20'
                    thirdTextBoxDefaultValue={"10"}
                    execType={ExecType.GET_FIRST_N_PAGES_PYTHON_FOR_AI_RENAMER}
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
                            <li>5. Send Original and Reduced Files to AI Renamer</li>
                        </ol>
                    </Typography>
                </Box>
            </Box>

            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                <ExecComponent
                    buttonText="AI Renamer"
                    placeholder='Absolute Path to PDFs Folder(s) as CSV'
                    secondTextBoxPlaceHolder='Absolute Path to Reduced PDFs Folder(s) as CSV'
                    thirdTextBoxPlaceHolder='Absolute Path of Renamed Pdfs Folder as CSV'
                    execType={ExecType.AI_RENAMER}
                    css={{ minWidth: "35vw" }}
                    css2={{ minWidth: "35vw" }}
                    css3={{ marginTop: "30px", minWidth: "23vw" }}
                    textBoxOneValue={absPathForAiRenamer}
                    multiline1stTf
                    rows1stTf={4}
                    textBoxTwoValue={reducedPathForAiRenamer}
                    thirdButton={<Button
                        variant="contained"
                        color="primary"
                        onClick={loadSrcAndReducedPDFNamesFromLocalStorage}
                        sx={{ marginRight: "10px", marginBottom: "10px" }}>Load From Local Storage</Button>}
                />
            </Box>
        </Box >

    );
}

export default ExecLauncherAIRenamer;
