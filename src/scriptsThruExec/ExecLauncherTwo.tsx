import React, { useState } from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import { ExecType } from './util';
import { Radio, RadioGroup, FormControlLabel, FormControl, Checkbox } from '@mui/material';
import { ChangeEvent } from 'react';
import { CheckBox } from '@mui/icons-material';

const ExecLauncherTwo: React.FC = () => {
    const [genListingOfLocalFolder, setGenListingOfLocalFolder] = useState<number>(ExecType.GenListingsofLocalFolderAsPdf);
    const [checked, setChecked] = useState(false);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const _val = event.target.value;
        console.log("_val", _val)
        const _listingType = _val === `${ExecType.GenListingsofLocalFolderAsAll}` ? ExecType.GenListingsofLocalFolderAsAll : ExecType.GenListingsofLocalFolderAsPdf
        console.log("_listingType", _listingType)
        setGenListingOfLocalFolder(_listingType);
    };

    const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
    };

    return (
        <Box display="flex" gap={4} mb={2} flexDirection="row">
            <Box display="flex" alignItems="center" gap={4} mb={2} flexDirection="column">

                <ExecComponent
                    buttonText="Create Archive Excel"
                    placeholder='Space/Comma-Separated Archive Link(s) or Identifier(s)'
                    execType={checked === true ? ExecType.GenExcelOfArchiveLinkLimitedFields : ExecType.GenExcelOfArchiveLink}
                    css={{ width: "450px" }}
                    reactComponent={<Box>
                        <FormControlLabel
                            control={<Checkbox checked={checked} onChange={handleCheck} />}
                            label="Dont Generate Direct Downloadable Links (Blazing Fast)"
                        />
                    </Box>}
                />

                <ExecComponent
                    buttonText="Download All Pdfs from Archive"
                    placeholder='Space/Comma-Separated Archive Link(s) or Identifier(s)'
                    secondTextBoxPlaceHolder='Enter Profile or File Abs Path'
                    execType={ExecType.DownloadArchivePdfs}
                    css={{ width: "450px" }}

                />

            </Box>

            <Box display="flex" gap={4} mb={2} flexDirection="column">
                <ExecComponent buttonText="Add Header/Footer to PDFs"
                    execType={ExecType.AddHeaderFooter} />

                <ExecComponent buttonText="List Files in Folder"
                    placeholder='Folder Path or Freezed Profile'
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
                <ExecComponent buttonText="jpeg to pdf"
                    execType={ExecType.UploadPdfs} />

                <ExecComponent buttonText="Vanitize Folder or Profile"
                    placeholder='Vanitize'
                    execType={ExecType.VANITIZE} />

                <ExecComponent
                    buttonText='Gradle Move to _freeze'
                    placeholder='profiles as csv'
                    execType={ExecType.MoveToFreeze} />
            </Box>
        </Box>
    );
}

export default ExecLauncherTwo;
