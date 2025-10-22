import React, { useState } from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import { ExecType } from './ExecLauncherUtil';
import { Checkbox, FormControlLabel } from '@mui/material';



const PdfUtil: React.FC = () => {
    const [corruptionCheck, setCorruptionCheck] = React.useState<number>(ExecType.CORRUPTION_CHECK_QUICK);
    const [deepCheckFlag, setDeepCheckFlag] = useState(false);
    const handleDeepCheckFlag = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDeepCheckFlag(event.target.checked);
        setCorruptionCheck(event.target.checked ? ExecType.CORRUPTION_CHECK_DEEP : ExecType.CORRUPTION_CHECK_QUICK);
    };
    return (
        <>
            <Box display="flex" gap={4} mb={2} flexDirection="row">
                <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                    <ExecComponent
                        buttonText="Check for Corrupt PDFs"
                        placeholder='Folder or Profile'
                        execType={corruptionCheck}
                        css={{ minWidth: "50vw" }}
                        reactComponent={<>
                            <Box>
                                <FormControlLabel
                                    control={<Checkbox checked={deepCheckFlag} onChange={handleDeepCheckFlag} />}
                                    label="Deep Check"
                                />
                            </Box>
                        </>}
                    />
                </Box>
            </Box>
        </>

    );
}

export default PdfUtil;
