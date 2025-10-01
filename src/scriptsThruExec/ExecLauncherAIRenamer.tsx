import React, { useRef, useState } from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import { ExecType } from './ExecLauncherUtil';
import { Button, Typography, CircularProgress } from '@mui/material';
import TextField from '@mui/material/TextField';
import { AI_RENAMER_ABS_PATH_LOCAL_STORAGE_KEY, AI_RENAMER_REDUCED_PATH_LOCAL_STORAGE_KEY, AI_RENAMER_RENAMER_PATH_LOCAL_STORAGE_KEY } from 'service/consts';
import { replaceQuotes } from 'mirror/utils';
import { makePostCall } from 'service/ApiInterceptor';

const REFUCED_FILE_PATH_SUFFIX = "red"

const LauncherAIRenamer: React.FC = () => {
    const [filePath, setFilePath] = useState('');
    const [filePathForReducedPdfs, setFilePathForReducedPdfs] = useState('');
    const [absPathForAiRenamer, setAbsPathForAiRenamer] = useState('');
    const [reducedPathForAiRenamer, setReducedPathForAiRenamer] = useState('');
    const [renamerPathForAiRenamer, setRenamerPathForAiRenamer] = useState('');

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
    };
    const generateReducedPfdFolders = () => {
        const _filePath = replaceQuotes(filePath);
        if (_filePath.includes(",")) {
            const redPaths: string[] = []
            _filePath.split(",").forEach((path) => {
                redPaths.push(`${path}-${REFUCED_FILE_PATH_SUFFIX}`);
            })
            setFilePathForReducedPdfs(redPaths.join(","));
        }
        else {
            setFilePathForReducedPdfs(`${filePath}-${REFUCED_FILE_PATH_SUFFIX}`);
        }
    }

    // Dynamic text areas for combining PDFs
    const DynamicTextAreas: React.FC = () => {
        const [values, setValues] = useState<string[]>(['']);
        const [destFolder, setDestFolder] = useState<string>('');
        const inputsRef = useRef<Array<HTMLTextAreaElement | HTMLInputElement | HTMLDivElement | null>>([]);

        const focusIndex = (idx: number) => {
            requestAnimationFrame(() => {
                const el = inputsRef.current[idx];
                if (el) el.focus();
            });
        };

        const handleChange = (idx: number, val: string) => {
            setValues((prev) => {
                const next = [...prev];
                next[idx] = val;
                return next;
            });
            // If user typed into the last textarea and it's now non-empty, add a new one and focus it
            const isLast = idx === values.length - 1;
            if (isLast && val.trim() !== '') {
                setValues((prev) => [...prev, '']);
                focusIndex(idx + 1);
            }
        };

        const handlePaste = (_idx: number, _e: React.ClipboardEvent) => {
            // No-op; rely on onChange to detect content and add one new textarea
        };

        function quotedLineToCsv(s: string): string {
            const re = /"((?:[^"\\]|\\.)*)"/g; // capture quoted segments, allow escapes
            const items: string[] = [];
            let m: RegExpExecArray | null;
            while ((m = re.exec(s)) !== null) {
                // Unescape common sequences: \" -> ", \\ -> \
                const item = m[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\');
                items.push(item);
            }
            return items.join(',');
        }

        const handleSubmit = async () => {
            // Convert each textarea's quoted items into a CSV string
            const cleaned: string[] = values
                .map((v) => quotedLineToCsv(v))
                .filter((v) => v.trim() !== '');
            // Use destFolder to avoid unused-state lint and for developer visibility
            console.log('Destination folder for merged PDFs:', destFolder);
            if (destFolder === "") {
                alert("Please enter valid paths for Destination folder for merged PDFs");
                return;
            }

            if (cleaned.length === 0) {
                alert("Please enter valid paths for merged PDFs");
                return;
            }
            const response = await makePostCall({
                "destFolder": destFolder,
                "pdfPaths": cleaned
            }, `pythonScripts/mergeMutliplePdfs`);
            console.log("response", JSON.stringify(response));
            alert(`response ${JSON.stringify(response)}`);
        };

        const [isSubmitting, setIsSubmitting] = useState(false);

        const handleConfirmAndSubmit = async () => {
            // Use existing confirmation mechanism (simple confirm dialog)
            const ok = window.confirm('Proceed to combine PDFs into one?');
            if (!ok) return;
            try {
                setIsSubmitting(true);
                await handleSubmit();
            } finally {
                setIsSubmitting(false);
            }
        };

        const handleReset = () => {
            setValues(['']);
            focusIndex(0);
        };

        return (
            <Box display="flex" flexDirection="column" gap={2}>
                {values.map((val, idx) => (
                    <TextField
                        key={idx}
                        inputRef={(el) => (inputsRef.current[idx] = el)}
                        value={val}
                        onChange={(e) => handleChange(idx, e.target.value)}
                        onPaste={(e) => handlePaste(idx, e)}
                        multiline
                        minRows={2}
                        maxRows={6}
                        fullWidth
                        placeholder={idx === 0 ? 'Paste strings here...' : 'Continue typing or pasting...'}
                    />
                ))}
                <TextField
                    value={destFolder}
                    onChange={(e) => setDestFolder(e.target.value)}
                    fullWidth
                    placeholder={"folder to move merged pdfs to"}
                />
                <Box display="flex" gap={2} mt={1}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleConfirmAndSubmit}
                        startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                        disabled={isSubmitting}
                    >
                        Combine PDFs into One
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleReset}>
                        Reset
                    </Button>
                </Box>
            </Box>
        );
    };

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
            setRenamerPathForAiRenamer(storedRenamerValue)
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
                    thirdButton={<Button
                        variant="contained"
                        color="primary"
                        onClick={generateReducedPfdFolders}
                        sx={{ marginRight: "10px", marginBottom: "10px" }}>Generate Reduced PDF Folders</Button>}
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
                    multiline1stTf
                    multiline2ndTf
                    multiline3rdTf
                    rows1stTf={4}
                    rows2ndTf={4}
                    textBoxTwoValue={reducedPathForAiRenamer}
                    textBoxThreeValue={renamerPathForAiRenamer}
                    thirdButton={<Button
                        variant="contained"
                        color="primary"
                        onClick={loadSrcAndReducedPDFNamesFromLocalStorage}
                        sx={{ marginRight: "10px", marginBottom: "10px" }}>Load From Local Storage</Button>}
                />
            </Box>

            <Box sx={{ minWidth: '50vw' }}>
                <DynamicTextAreas />
            </Box>
        </Box >

    );
}

export default LauncherAIRenamer;
