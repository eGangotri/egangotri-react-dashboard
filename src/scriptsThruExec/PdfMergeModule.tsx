import React, { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import { Button, Typography, CircularProgress } from '@mui/material';
import TextField from '@mui/material/TextField';
import { makePostCall } from 'service/ApiInterceptor';
import PdfMergeHistoryTracker from './PdfMergeHistoryTracker';
import PdfUtil from './PdfUtil';

const PdfMergeModule: React.FC = () => {
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
                        placeholder={idx === 0 ? 'File Paths in set of 2-3 to merge' : 'Continue typing or pasting...'}
                    />
                ))}
                <TextField
                    value={destFolder}
                    onChange={(e) => setDestFolder(e.target.value)}
                    fullWidth
                    placeholder={"Folder to move discardable pre-merge pdfs to"}
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

    return (
        <Box display="flex" gap={4} mb={2} flexDirection="row">
            <Box sx={{ minWidth: '45vw' }}>
                <Box sx={{ mt: 5 }}>
                    <DynamicTextAreas />
                </Box>
                <Box sx={{ mt: 5 }}>
                    <PdfUtil/>
                </Box>
            </Box>
            
            <Box sx={{ minWidth: '45vw' }}>
                <PdfMergeHistoryTracker/>
            </Box>
        </Box >

    );
}

export default PdfMergeModule;
