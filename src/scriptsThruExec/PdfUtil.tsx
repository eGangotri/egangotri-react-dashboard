import React, { useState } from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import { ExecType } from './ExecLauncherUtil';
import { Checkbox, FormControlLabel } from '@mui/material';



const PdfUtil: React.FC = () => {
    const [corruptionCheck, setCorruptionCheck] = React.useState<number>(ExecType.CORRUPTION_CHECK_QUICK);
    const [deepCheckFlag, setDeepCheckFlag] = useState(false);
    const [isolateFlag, setIsolateFlag] = useState(false);

    const adjustCorruptionCheck = (_deepCheckFlag: boolean, _isolateFlag: boolean) => {
        if (_isolateFlag) {
            if (_deepCheckFlag) {
                setCorruptionCheck(ExecType.CORRUPTION_CHECK_DEEP_ISOLATE);
            } else {
                setCorruptionCheck(ExecType.CORRUPTION_CHECK_QUICK_ISOLATE);
            }
        } else {
            if (_deepCheckFlag) {
                setCorruptionCheck(ExecType.CORRUPTION_CHECK_DEEP);
            } else {
                setCorruptionCheck(ExecType.CORRUPTION_CHECK_QUICK);
            }
        }
        console.log(`corruptionCheck(${_deepCheckFlag}, ${_isolateFlag}) ${corruptionCheck} deepCheckFlag ${deepCheckFlag} isolateFlag ${isolateFlag}`)
    }
    const handleDeepCheckFlag = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDeepCheckFlag(event.target.checked);
        adjustCorruptionCheck(event.target.checked, isolateFlag);
    };

    const handleIsolateFlag = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsolateFlag(event.target.checked);
        adjustCorruptionCheck(deepCheckFlag, event.target.checked);

    };
    return (
        <>
            <Box display="flex" gap={4} mb={2} flexDirection="row">
                <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                    <ExecComponent
                        buttonText="Check for Corrupt PDFs"
                        placeholder='Folder or Profile'
                        execType={corruptionCheck}
                        css={{ minWidth: "45vw" }}
                        reactComponent={<>
                            <Box>
                                <Box>
                                <FormControlLabel
                                    control={<Checkbox checked={deepCheckFlag} onChange={handleDeepCheckFlag} />}
                                    label="Deep Check"
                                />
                                </Box>
                                <Box>
                                <FormControlLabel
                                    control={<Checkbox checked={isolateFlag} onChange={handleIsolateFlag} />}
                                    label="Isolate"
                                />
                                </Box>
                            </Box>
                        </>}
                    />
                </Box>
            </Box>
        </>

    );
}

export default PdfUtil;
