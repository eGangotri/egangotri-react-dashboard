import React, { useRef, useState } from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import { ExecType } from './ExecLauncherUtil';
import { Button, Typography } from '@mui/material';
import { AI_RENAMER_ABS_PATH_LOCAL_STORAGE_KEY, AI_RENAMER_REDUCED_PATH_LOCAL_STORAGE_KEY, AI_RENAMER_RENAMER_PATH_LOCAL_STORAGE_KEY } from 'service/consts';
import { replaceQuotes } from 'mirror/utils';
import { csvize } from './Utils';

const REDUCED_FILE_PATH_SUFFIX = "red"
const RENAMER_FILE_PATH_SUFFIX = "renamer"

// Universal basename function that works with both Windows and Unix paths
const getBasename = (filePath: string): string => {
    // Handle both Windows (\) and Unix (/) path separators
    const lastBackslash = filePath.lastIndexOf('\\');
    const lastForwardSlash = filePath.lastIndexOf('/');
    const lastSeparator = Math.max(lastBackslash, lastForwardSlash);

    if (lastSeparator === -1) {
        // No path separator found, return the whole string
        return filePath;
    }

    return filePath.substring(lastSeparator + 1);
};

const LauncherAIRenamer: React.FC = () => {
    const [filePath, setFilePath] = useState('');
    const [filePathForReducedPdfs, setFilePathForReducedPdfs] = useState('');
    const [filePathForRenamerPdfs, setFilePathForRenamerPdfs] = useState('');
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
        // Keep local state in sync so the Generate button has the latest value
        setFilePath(inputValue);
        //handleFilePathChange
    };

    const generateReducedPfdFolders = () => {
        const _filePath = replaceQuotes(filePath);
        if (_filePath.includes(",")) {
            const redPaths: string[] = []
            _filePath.split(",").forEach((path) => {
                redPaths.push(`${path}-${REDUCED_FILE_PATH_SUFFIX}`);
            })
            setFilePathForReducedPdfs(redPaths.join(","));
        }
        else {
            setFilePathForReducedPdfs(`${filePath}-${REDUCED_FILE_PATH_SUFFIX}`);
        }
    }

    const generateRenamerFolders = () => {
        const _filePath = replaceQuotes(absPathForAiRenamer);
        console.log("generateRenamerFolders", _filePath);
        if (_filePath.includes(",")) {
            const renamerPaths: string[] = []
            _filePath.split(",").forEach((filePath) => {
                const filename = getBasename(filePath);
                console.log(`.filename ${filename}`)
                renamerPaths.push(`${filename}-${RENAMER_FILE_PATH_SUFFIX}`);
            })
            setFilePathForRenamerPdfs(renamerPaths.join(","));
            console.log("renamerPaths", renamerPaths);
        }
        else {
            const filename = getBasename(_filePath);
            setFilePathForRenamerPdfs(`${filename}-${RENAMER_FILE_PATH_SUFFIX}`);
        }
    }

    const handleAiRenamerAbsPathChange = (inputValue: string) => {
        setAbsPathForAiRenamer(inputValue);
    }

    const handleFilePathChange = (inputValue: string) => {
        setFilePath(inputValue);
    }

    const loadSrcAndReducedPDFNamesFromLocalStorage = () => {

        let storedValue = localStorage.getItem(AI_RENAMER_ABS_PATH_LOCAL_STORAGE_KEY);
        let storedReducedValue = localStorage.getItem(AI_RENAMER_REDUCED_PATH_LOCAL_STORAGE_KEY);
        let storedRenamerValue = localStorage.getItem(AI_RENAMER_RENAMER_PATH_LOCAL_STORAGE_KEY);

        console.log(`loadFromLocalStorage called ${storedValue} ${storedReducedValue} ${storedRenamerValue}`)
        if (storedValue) {
            setAbsPathForAiRenamer(storedValue)
        }
        if (storedReducedValue) {
            setReducedPathForAiRenamer(storedReducedValue)
        }
        if (storedRenamerValue) {
            setFilePathForRenamerPdfs(storedRenamerValue)
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
                    thirdTextBoxDefaultValue={"15-7"}
                    textBoxThreeValue={"15-7"}
                    execType={ExecType.GET_FIRST_N_PAGES_PYTHON_FOR_AI_RENAMER}
                    css={{ minWidth: "35vw" }}
                    css2={{ minWidth: "35vw" }}
                    css3={{ marginTop: "30px", minWidth: "23vw" }}
                    textBoxOneValue={filePath}
                    textBoxTwoValue={filePathForReducedPdfs}
                    multiline1stTf
                    multiline2ndTf
                    rows1stTf={4}
                    rows2ndTf={4}
                    onInputChange={handleInputChange}
                    thirdButton={<>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={generateReducedPfdFolders}
                            sx={{ marginRight: "10px", marginBottom: "10px" }}>Generate Reduced PDF Folders</Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setFilePath(csvize(filePath))}
                            sx={{ marginRight: "10px", marginBottom: "10px" }}>CSVize</Button>

                    </>}
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
                    thirdTextBoxPlaceHolder='Suffix for Output Folder (Default -renamer if left blank).'
                    execType={ExecType.AI_RENAMER}
                    css={{ minWidth: "50vw" }}
                    css2={{ minWidth: "50vw" }}
                    css3={{ marginTop: "30px", minWidth: "50vw" }}
                    textBoxOneValue={absPathForAiRenamer}
                    textBoxTwoValue={reducedPathForAiRenamer}
                    textBoxThreeValue={filePathForRenamerPdfs}
                    onInputChange={handleAiRenamerAbsPathChange}
                    multiline1stTf
                    multiline2ndTf
                    multiline3rdTf
                    rows1stTf={4}
                    rows2ndTf={4}
                    thirdButton={
                        <>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={loadSrcAndReducedPDFNamesFromLocalStorage}
                                sx={{ marginRight: "10px", marginBottom: "10px" }}>Load From Local Storage
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setAbsPathForAiRenamer(csvize(absPathForAiRenamer))}
                                sx={{ marginRight: "10px", marginBottom: "10px" }}>CSVize
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => generateRenamerFolders()}
                                sx={{ marginRight: "10px", marginBottom: "10px" }}>Generate Renamer Folders
                            </Button>
                        </>
                    }
                />
            </Box>
        </Box >

    );
}

export default LauncherAIRenamer;
