import React, { useState } from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ExecType } from './util';
import { Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material';
import { ChangeEvent } from 'react';

const ExecLauncherTwo: React.FC = () => {
    const [genListingOfLocalFolder, setGenListingOfLocalFolder] = useState<number>(ExecType.GenListingsofLocalFolderAsPdf);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const _val = event.target.value;
        console.log("_val", _val)
        const _listingType = _val === `${ExecType.GenListingsofLocalFolderAsAll}` ? ExecType.GenListingsofLocalFolderAsAll : ExecType.GenListingsofLocalFolderAsPdf
        console.log("_listingType", _listingType)
        setGenListingOfLocalFolder(_listingType);
    };

    return (
        <Box display="flex" gap={4} mb={2} flexDirection="row">
            <Box display="flex" alignItems="center" gap={4} mb={2} flexDirection="column">
                <ExecComponent buttonText="jpeg to pdf"
                    execType={ExecType.UploadPdfs} />

                <ExecComponent buttonText="Vanitize Folder Contents"
                    placeholder='Vanitize'
                    execType={ExecType.MoveFolderContents_PROFILE} />
            </Box>

            <Box display="flex" gap={4} mb={2} flexDirection="column">
                <ExecComponent buttonText="Add Header/Footer to PDFs"
                    execType={ExecType.AddHeaderFooter} />

                <ExecComponent buttonText="List Files in Folder"
                    placeholder='Folder Path'
                    execType={genListingOfLocalFolder}
                    reactComponent={<>
                        <RadioGroup aria-label="fileType" name="fileType" value={genListingOfLocalFolder} onChange={handleChange} row>
                            <FormControlLabel value={ExecType.GenListingsofLocalFolderAsPdf} control={<Radio />} label="PDF-ONLY" />
                            <FormControlLabel value={ExecType.GenListingsofLocalFolderAsAll} control={<Radio />} label="ALL" />
                        </RadioGroup>
                    </>}
                />
            </Box>

            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                <ExecComponent
                    buttonText="Upload Pdfs to Archive"
                    placeholder='Enter Google Drive Link'
                    secondTextBoxPlaceHolder='Enter Destination Folder'
                    execType={ExecType.DownloadGoogleDriveLink} />


                <ExecComponent
                    buttonText="Create Archive Excel"
                    placeholder='Archive Link(s) or Profile Name(s) as csv'
                    execType={ExecType.GenExcelOfArchiveLink} />

                <ExecComponent
                    buttonText='Gradle Move to _freeze'
                    placeholder='profiles as csv'
                    execType={ExecType.MoveToFreeze} />
            </Box>
        </Box>
    );
}

export default ExecLauncherTwo;
