import React, { useState } from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import { ExecType } from './ExecLauncherUtil';
import { Radio, RadioGroup, FormControlLabel, FormControl, Checkbox } from '@mui/material';
import { ChangeEvent } from 'react';
import { CheckBox } from '@mui/icons-material';

const ExecLauncherFourB: React.FC = () => {
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
                    buttonText="Conver all .txt encodings in Folder"
                    placeholder='Folder Full Path'
                    secondTextBoxPlaceHolder='Encoding From'
                    thirdTextBoxPlaceHolder='Encoding To'
                    execType={ExecType.CONVERT_MULTIPLE_TXT_FILE_SCRIPTS}
                    userInputOneInfo="any folder with multiple .txt in any number of subfolders"
                    userInputTwoInfoNonMandatory="Case Sensitive.Encoding From. Example 'Devanagari'. Names from https://www.aksharamukha.com/explore"
                    userInputThreeInfoNonMandatory="Case Sensitive.Encoding From. Example 'Roman'.  Names from https://www.aksharamukha.com/explore"
                    css={{ width: "250px" }}
                    css2={{ width: "450px" }}
                />

                <ExecComponent
                    buttonText="Conver Script"
                    placeholder='Text to Convert'
                    secondTextBoxPlaceHolder='Encoding From'
                    thirdTextBoxPlaceHolder='Encoding To'
                    execType={ExecType.CONVERT_TEXT_SCRIPT}
                    userInputOneInfo="any folder with multiple .txt in any number of subfolders"
                    userInputTwoInfoNonMandatory="Case Sensitive.Encoding From. Example 'Devanagari'. Names from https://www.aksharamukha.com/explore"
                    userInputThreeInfoNonMandatory="Case Sensitive.Encoding To. Example 'Roman'.  Names from https://www.aksharamukha.com/explore"
                    css={{ width: "250px" }}
                    css2={{ width: "450px" }}
                />


            </Box>
        </Box>

    );
}

export default ExecLauncherFourB;
