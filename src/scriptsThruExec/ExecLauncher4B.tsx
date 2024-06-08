import React, { useState } from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import { ExecType } from './ExecLauncherUtil';
import { Radio, RadioGroup, FormControlLabel, FormControl, Checkbox } from '@mui/material';
import { ChangeEvent } from 'react';
import { CheckBox } from '@mui/icons-material';

const ExecLauncherFourB: React.FC = () => {
    const [imgType, setImgType] = useState(ExecType.JPG_TO_PDF);


    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const _val = event.target.value;
        console.log("ImgType: ", _val);
        setImgType(Number(_val));
    };

    return (
        <Box display="flex" gap={4} mb={2} flexDirection="row">
            <Box display="flex" alignItems="center" gap={4} mb={2} flexDirection="column">

                <ExecComponent buttonText="Vanitize Folder or Profile"
                    placeholder='Vanitize'
                    execType={ExecType.VANITIZE} />

                <ExecComponent buttonText="Use Bulk Rename Conventions"
                    placeholder='Use Bulk Rename Conventions'
                    execType={ExecType.UseBulkRenameConventions} />
            </Box>


            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                <ExecComponent
                    buttonText="Img Files(jpg/png/tiff) to pdf"
                    placeholder='Folder Abs Path' 
                    execType={imgType}
                    reactComponent={<>
                        <RadioGroup aria-label="fileType" name="fileType" value={imgType} onChange={handleChange} row>
                            <FormControlLabel value={ExecType.JPG_TO_PDF} control={<Radio />} label="JPG" />
                            <FormControlLabel value={ExecType.PNG_TO_PDF} control={<Radio />} label="PNG" />
                            <FormControlLabel value={ExecType.TIFF_TO_PDF} control={<Radio />} label="TIFF" />
                        </RadioGroup>
                    </>} />
                <ExecComponent
                    buttonText="Add Header/Footer to PDFs"
                    placeholder='Folder Abs Path'
                    secondTextBoxPlaceHolder='Folder Abs Path'
                    execType={ExecType.AddHeaderFooter} />
            </Box>

            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">

                <ExecComponent
                    buttonText="Find Duplicates by File Size"
                    placeholder='Folder Abs Path'
                    secondTextBoxPlaceHolder='Folder Abs Path'
                    css={{ width: "250px" }}
                    execType={ExecType.DUPLICATES_BY_FILE_SIZE} />

                <ExecComponent
                    buttonText="Rename Non-ASCII File Names in Folder"
                    placeholder='Folder Abs Path'
                    secondTextBoxPlaceHolder='Script Tamil, Kannada etc'
                    css={{ width: "250px" }}
                    execType={ExecType.RENAME_NON_ASCII_FILE_NAMES_IN_FOLDER} />
            </Box>
            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">

                <ExecComponent
                    buttonText="Snap2HTML"
                    placeholder='Folder Abs Path'
                    userInputOneInfo="Make Sure Snap2HTML.exe is set in the Path"
                    css={{ width: "250px" }}
                    execType={ExecType.SNAP_TO_HTML} />

                <ExecComponent buttonText="Reverse Move (Python)"
                    execType={ExecType.ReverseMove} />

            </Box>

        </Box>
    );
}

export default ExecLauncherFourB;
