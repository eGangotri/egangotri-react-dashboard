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

        </Box>
    );
}

export default ExecLauncherFourB;
