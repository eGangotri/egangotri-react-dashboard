import React, { useState } from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import { ExecType } from './ExecLauncherUtil';
import { Radio, RadioGroup, FormControlLabel, TextField, Checkbox, Typography } from '@mui/material';
import { ChangeEvent } from 'react';
import { ExecComponentFormData } from './types';
import { useForm } from 'react-hook-form';
import { IMG_TYPE_ANY, IMG_TYPE_CR2, IMG_TYPE_JPG, IMG_TYPE_PNG, IMG_TYPE_TIF } from './constants';
import { CheckBox } from '@mui/icons-material';

const ExecLauncherRefineFileDataTwo: React.FC = () => {
    const [imgType, setImgType] = useState(ExecType.JPG_TO_PDF);
    const [findBySizeType, setFindBySizeType] = useState(ExecType.DUPLICATES_BY_FILE_SIZE);
    const [duplicatesBySizeType, setDuplicatesBySizeType] = useState("1"); // or "2"
    const [moveItems, setMoveItems] = useState(false);
    const { register } = useForm<ExecComponentFormData>();

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const _val = event.target.value;
        console.log("ImgType: ", _val);
        setImgType(Number(_val));
    };

    const handleFindBySizeChange = (event: ChangeEvent<HTMLInputElement>) => {
        const _val = event.target.value;
        setDuplicatesBySizeType(_val);
        console.log("bySizeType: ", _val);
        setFindBySizeType(Number(`${ExecType.DUPLICATES_BY_FILE_SIZE_SUFFIX}${_val}${moveItems ? 1 : 0}`));
    };

    const handleMoveItemsChange = (event: ChangeEvent<HTMLInputElement>) => {
        const _checked = event.target.checked;
        console.log("moveItems: ", _checked);
        setMoveItems(_checked);
        setFindBySizeType(Number(`${ExecType.DUPLICATES_BY_FILE_SIZE_SUFFIX}${duplicatesBySizeType}${_checked ? 1 : 0}`));
    };

    const getLabelForFileBySizeType = () => {
        return findBySizeType.toString().includes(`${ExecType.DUPLICATES_BY_FILE_SIZE_SUFFIX}1`) ? "Duplicates" : "Disjoint Set";
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
                    buttonText={`Find ${getLabelForFileBySizeType()} by File Size`}
                    placeholder='Folder Abs Path'
                    secondTextBoxPlaceHolder='Folder Abs Path'
                    execType={findBySizeType}
                    css={{ width: "550px" }}
                    css2={{ width: "550px" }}
                    reactComponent={<>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Checkbox checked={moveItems} onChange={(e) => handleMoveItemsChange(e)} />
                            <Typography>Move {getLabelForFileBySizeType()} in Src</Typography>
                        </Box>
                        <RadioGroup aria-label="duplicatesBySizeType" name="duplicatesBySizeType" value={duplicatesBySizeType} onChange={handleFindBySizeChange} row>
                            <FormControlLabel value={"1"} control={<Radio />} label="Duplicates" />
                            <FormControlLabel value={"2"} control={<Radio />} label="Disjoint-Set" />
                        </RadioGroup>
                    </>} />


                <ExecComponent
                    buttonText="Check Integrity"
                    placeholder='Folder-Sub-Folder Count matches'
                    userInputOneInfo="Folder/Sub-Folders match file count"
                    execType={ExecType.CheckIntegrity}
                    css={{ width: "550px" }}
                    multiline2ndTf
                    fullWidth
                />

            </Box>
            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">

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
        </Box>
    );
}

export default ExecLauncherRefineFileDataTwo;
