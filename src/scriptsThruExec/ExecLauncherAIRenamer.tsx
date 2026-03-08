import React, { useRef, useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import { ExecType } from './ExecLauncherUtil';
import { Button, Typography, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress } from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { makePostCall } from 'service/ApiInterceptor';
import { makePostCallWithErrorHandling } from 'service/BackendFetchService';
import ExecPopover from './ExecPopover';
import ExecResponsePanel from './ExecResponsePanel';
import { AI_RENAMER_ABS_PATH_LOCAL_STORAGE_KEY, AI_RENAMER_REDUCED_PATH_LOCAL_STORAGE_KEY, AI_RENAMER_RENAMER_PATH_LOCAL_STORAGE_KEY } from 'service/consts';
import HistoryIcon from '@mui/icons-material/History';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { AI_TITLE_RENAMER_HISTORY_PATH } from 'Routes/constants';
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

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const queryPath = searchParams.get('path');

    const [promptDialogOpen, setPromptDialogOpen] = useState(false);
    const [extractionPrompt, setExtractionPrompt] = useState("");
    const [promptLoading, setPromptLoading] = useState(false);

    const [customRunLoading, setCustomRunLoading] = useState(false);
    const [mainRunLoading, setMainRunLoading] = useState(false);
    const [apiResult, setApiResult] = useState<any>(null);
    const [anchorElApi, setAnchorElApi] = useState<HTMLButtonElement | null>(null);

    useEffect(() => {
        if (queryPath) {
            setFilePath(queryPath);
            //  setAbsPathForAiRenamer(queryPath);
        }
    }, [queryPath]);

    const handleFetchPrompt = async () => {
        try {
            setPromptLoading(true);
            const customPrompt = localStorage.getItem("PDF_METADATA_EXTRACTION_PROMPT");
            if (customPrompt) {
                setExtractionPrompt(customPrompt);
                setPromptDialogOpen(true);
                return;
            } else {
                const res = await makePostCall({}, "ai/getMetadataExtractionPrompt");
                if (res?.response?.PDF_METADATA_EXTRACTION_PROMPT) {
                    setExtractionPrompt(res.response.PDF_METADATA_EXTRACTION_PROMPT);
                    setPromptDialogOpen(true);
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setPromptLoading(false);
        }
    };

    const handleSavePrompt = () => {
        localStorage.setItem("PDF_METADATA_EXTRACTION_PROMPT", extractionPrompt);
        setPromptDialogOpen(false);
    };

    const handleDeletePrompt = () => {
        if (window.confirm("Are you sure you want to delete the prompt from local storage?")) {
            localStorage.removeItem("PDF_METADATA_EXTRACTION_PROMPT");
            setExtractionPrompt("");
        }
    };

    const handleRunCustomPrompt = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const promptFromStorage = localStorage.getItem("PDF_METADATA_EXTRACTION_PROMPT");
        if (!promptFromStorage) {
            alert("No custom prompt found in local storage. Please fetch and save a prompt first.");
            return;
        }

        setAnchorElApi(e.currentTarget);
        try {
            setCustomRunLoading(true);
            const dataUserInput = replaceQuotes(absPathForAiRenamer);
            const dataUserInput2Mandatory = replaceQuotes(reducedPathForAiRenamer);
            const dataUserInput3NonMandatory = replaceQuotes(filePathForRenamerPdfs);

            const res = await makePostCallWithErrorHandling({
                srcFolder: dataUserInput,
                reducedFolder: dataUserInput2Mandatory,
                outputSuffix: dataUserInput3NonMandatory,
                metadataExtractionPrompt: promptFromStorage
            }, `ai/aiRenamer`);
            setApiResult(<ExecResponsePanel response={res} execType={ExecType.AI_RENAMER} />);
        } catch (err) {
            console.error(err);
            setApiResult(null);
        } finally {
            setCustomRunLoading(false);
        }
    };

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
                redPaths.push(`${path?.trim()}-${REDUCED_FILE_PATH_SUFFIX}`);
            })
            setFilePathForReducedPdfs(redPaths.join(","));
        }
        else {
            setFilePathForReducedPdfs(`${filePath?.trim()}-${REDUCED_FILE_PATH_SUFFIX}`);
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
                    buttonText={`Get First and Last N Pages-Python (${filePath ? (filePath.split(',').length) : 0})`}
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
                    confirmDialogMsg="Do you want pages extracted? Tip: Make sure Ghostscript is installed for comnpression"
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
                        <Tooltip title="Copy both paths to AI Renamer">
                            <IconButton
                                color="primary"
                                onClick={() => {
                                    setAbsPathForAiRenamer(filePath);
                                    setReducedPathForAiRenamer(filePathForReducedPdfs);
                                }}
                                sx={{ marginBottom: "10px" }}
                            >
                                <ArrowForwardIcon />
                            </IconButton>
                        </Tooltip>
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
                    buttonText={`AI Renamer(${absPathForAiRenamer ? (absPathForAiRenamer.split(',').length) : 0})`}
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
                    externalLoading={customRunLoading}
                    onLoadingChange={setMainRunLoading}
                    thirdButton={
                        <>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={loadSrcAndReducedPDFNamesFromLocalStorage}
                                sx={{ marginRight: "10px", marginBottom: "10px" }}>Load From Local Storage
                            </Button>
                            <Box>
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
                            </Box>
                            <Box>
                                <Tooltip title="Go to AI Title Renamer History">
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => navigate(`${AI_TITLE_RENAMER_HISTORY_PATH}`)}
                                        sx={{ marginRight: "10px", marginBottom: "10px" }}
                                        startIcon={<HistoryIcon />}
                                    >
                                        History
                                    </Button>
                                </Tooltip>
                                <Tooltip title="Run AI Renamer with Local Prompt">
                                    <Button
                                        variant="contained"
                                        color="warning"
                                        onClick={handleRunCustomPrompt}
                                        disabled={customRunLoading || mainRunLoading}
                                        startIcon={customRunLoading ? <CircularProgress size={16} /> : <PlayArrowIcon />}
                                        sx={{ marginRight: "10px", marginBottom: "10px" }}
                                    >
                                        Run Custom
                                    </Button>
                                </Tooltip>
                                <Tooltip title="Fetch Metadata Extraction Prompt">
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={handleFetchPrompt}
                                        disabled={promptLoading}
                                        startIcon={promptLoading ? <CircularProgress size={16} color="inherit" /> : <EditNoteIcon />}
                                        sx={{ marginRight: "10px", marginBottom: "10px" }}
                                    >
                                        Prompt
                                    </Button>
                                </Tooltip>
                                <Tooltip title="Delete Prompt from Local Storage">
                                    <IconButton
                                        color="error"
                                        onClick={handleDeletePrompt}
                                        sx={{ marginBottom: "10px" }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </>
                    }
                />
            </Box>
            <Dialog open={promptDialogOpen} onClose={() => setPromptDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Edit Extraction Prompt</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="PDF Metadata Extraction Prompt"
                        type="text"
                        fullWidth
                        multiline
                        rows={10}
                        variant="outlined"
                        value={extractionPrompt}
                        onChange={(e) => setExtractionPrompt(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPromptDialogOpen(false)} color="inherit">Cancel</Button>
                    <Button onClick={handleSavePrompt} color="primary" variant="contained">Save to Local Storage</Button>
                </DialogActions>
            </Dialog>

            <ExecPopover
                id={anchorElApi ? 'api-result-popover' : undefined}
                open={Boolean(anchorElApi)}
                anchorEl={anchorElApi}
                onClose={() => setAnchorElApi(null)}
            >
                {apiResult}
            </ExecPopover>
        </Box >

    );
}

export default LauncherAIRenamer;
