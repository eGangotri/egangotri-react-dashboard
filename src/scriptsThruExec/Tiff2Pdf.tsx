import React from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import { Tif2PdfExecType } from './util';

const Tiff2Pdf: React.FC = () => {

    return (
        <Box display="flex" gap={4} mb={2} flexDirection="row">
            <Box display="flex" alignItems="center" gap={4} mb={2} flexDirection="row">
                <Box display="flex" alignItems="center" gap={4} mb={2} flexDirection="column">
                    <ExecComponent buttonText="1. yarn run convert"
                        execType={Tif2PdfExecType.STEP1} />

                    <ExecComponent buttonText="2. yarn run tally-post-conversion ( with TALLY_FOR_FOLDERS)"
                        execType={Tif2PdfExecType.STEP2} />

                    <ExecComponent buttonText="3. gradle merge(mega)"
                        execType={Tif2PdfExecType.STEP3} />

                </Box>

                <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                    <ExecComponent buttonText="4. yarn run move-merged-pdfs"
                        execType={Tif2PdfExecType.STEP4} />

                    <ExecComponent buttonText="5. yarn run tally-post-conversion ( with TALLY_FOR_PDFS )Checks Numbers of Items in Sync Only"
                        execType={Tif2PdfExecType.STEP5} />

                    <ExecComponent buttonText="6. gradle tally(mega) ( checks pageCount corresponds to image count)"
                        execType={Tif2PdfExecType.STEP6} />
                </Box>
            </Box>
        </Box>
    );
}

export default Tiff2Pdf;
