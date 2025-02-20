import React, { useState } from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import { ExecType } from './ExecLauncherUtil';
import { Radio, RadioGroup, FormControlLabel, TextField } from '@mui/material';
import { ChangeEvent } from 'react';
import { ExecComponentFormData } from './types';
import { useForm } from 'react-hook-form';
import { IMG_TYPE_ANY, IMG_TYPE_JPG, IMG_TYPE_PNG, IMG_TYPE_TIF } from './constants';

const ExecLauncherFour: React.FC = () => {
    const [imgType, setImgType] = useState(ExecType.JPG_TO_PDF);
    const [findBySizeType, setFindBySizeType] = useState(ExecType.DUPLICATES_BY_FILE_SIZE);
    const { register } = useForm<ExecComponentFormData>();

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const _val = event.target.value;
        console.log("ImgType: ", _val);
        setImgType(Number(_val));
    };

    const handleFindBySizeChange = (event: ChangeEvent<HTMLInputElement>) => {
        const _val = event.target.value;
        console.log("bySizeType: ", _val);
        setFindBySizeType(Number(_val));
    };

    return (
        <Box display="flex" gap={4} mb={2} flexDirection="row">
            <Box display="flex" alignItems="center" gap={4} mb={2} flexDirection="column">

                <ExecComponent buttonText="Vanitize Folder or Profile"
                    placeholder='Vanitize'
                    thirdTextBoxPlaceHolder='Suffix to add to Pdf'
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
                            <FormControlLabel value={ExecType.ANY_IMG_TYPE_TO_PDF} control={<Radio />} label={IMG_TYPE_ANY} />
                            <FormControlLabel value={ExecType.JPG_TO_PDF} control={<Radio />} label={IMG_TYPE_JPG} />
                            <FormControlLabel value={ExecType.PNG_TO_PDF} control={<Radio />} label={IMG_TYPE_PNG} />
                            <FormControlLabel value={ExecType.TIFF_TO_PDF} control={<Radio />} label={IMG_TYPE_TIF} />
                            <FormControlLabel value={ExecType.TIFF_TO_PDF} control={<Radio />} label={IMG_TYPE_TIF} />
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
                    buttonText={`Find ${findBySizeType == ExecType.DUPLICATES_BY_FILE_SIZE ? "Duplicates" : "Disjoint Set"} by File Size`}
                    placeholder='Folder Abs Path'
                    secondTextBoxPlaceHolder='Folder Abs Path'
                    execType={findBySizeType}
                    css={{ width: "550px" }}
                    css2={{ width: "550px" }}
                    reactComponent={<>
                        <RadioGroup aria-label="findBySizeType" name="findBySizeType" value={findBySizeType} onChange={handleFindBySizeChange} row>
                            <FormControlLabel value={ExecType.DUPLICATES_BY_FILE_SIZE} control={<Radio />} label="Duplicates" />
                            <FormControlLabel value={ExecType.DISJOINT_SET_BY_FILE_SIZE} control={<Radio />} label="Disjoint-Set" />
                        </RadioGroup>
                    </>} />

                <ExecComponent
                    buttonText="Move Multiple Files by Abs. Path"
                    placeholder='Profile Name or Absolute Path as Dest'
                    execType={ExecType.MoveMultipleFilesAsCSVtoFolderOrProfile}
                    secondTextBoxPlaceHolder='CSV of Abs. Paths for Moving'
                    css={{ width: "550px" }}
                    css2={{ width: "550px" }}
                    multiline2ndTf
                    fullWidth
                    rows2ndTf={8}
                />

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

                <ExecComponent
                    buttonText="Rename Non-ASCII File Names in Folder"
                    placeholder='Folder Abs Path'
                    secondTextBoxPlaceHolder='Script Tamil, Kannada etc'
                    css={{ width: "250px" }}
                    execType={ExecType.RENAME_NON_ASCII_FILE_NAMES_IN_FOLDER} />
            </Box>

        </Box>
    );
}

export default ExecLauncherFour;
