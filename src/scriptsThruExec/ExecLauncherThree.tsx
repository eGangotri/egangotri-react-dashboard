import React, { useState } from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import { ExecType } from './ExecLauncherUtil';
import { Radio, RadioGroup, FormControlLabel, FormControl, Checkbox } from '@mui/material';
import { ChangeEvent } from 'react';
import { CheckBox } from '@mui/icons-material';

const ExecLauncherThree: React.FC = () => {
    const [genListingOfLocalFolder, setGenListingOfLocalFolder] = useState<number>(ExecType.GenListingsofLocalFolderAsPdf);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const _val = event.target.value;
        console.log("_val", _val)
        const _listingType = _val === `${ExecType.GenListingsofLocalFolderAsAll}` ? ExecType.GenListingsofLocalFolderAsAll : ExecType.GenListingsofLocalFolderAsPdf
        console.log("_listingType", _listingType)
        setGenListingOfLocalFolder(_listingType);
    };

    const [genListingOfLocalFolderYarn, setGenListingOfLocalFolderYarn] = useState<number>(ExecType.GenListingsofLocalFolderAsPdf);

    const handleChangeYarn = (event: ChangeEvent<HTMLInputElement>) => {
        const _val = event.target.value;
        console.log("_val", _val)
        let _listingType;
        switch (Number(_val)) {
            case ExecType.GenListingsofLocalFolderAsLinksYarn:
                _listingType = ExecType.GenListingsofLocalFolderAsLinksYarn;
                break;
            case ExecType.GenListingsofLocalFolderAsAllYarn:
                _listingType = ExecType.GenListingsofLocalFolderAsAllYarn;
                break;
            default:
                _listingType = ExecType.GenListingsofLocalFolderAsPdfYarn;
        }
        console.log("_listingType", _listingType);
        setGenListingOfLocalFolderYarn(_listingType);
    };

    return (
        <Box display="flex" gap={4} mb={2} flexDirection="row">
            <Box display="flex" alignItems="center" gap={4} mb={2} flexDirection="column">

                <Box display="flex" alignItems="center" gap={4} mb={2} flexDirection="column">
                    <ExecComponent
                        buttonText="Move Folder Contents"
                        placeholder='Src Path for Moving QA-Passed-to-Pipeline'
                        secondTextBoxPlaceHolder="Profile Name or Absolute Path"
                        execType={ExecType.MoveFolderContents}
                    // reactComponent={<Box>
                    //     { 
                    //     <FormControlLabel
                    //         control={<Checkbox checked={flatten} onChange={handleChange2} />}
                    //         label="Flatten Folder Contents"
                    //     /> }
                    // </Box>}
                    />
                </Box>

                <ExecComponent
                    buttonText='Move to _freeze'
                    placeholder='profiles as csv'
                    execType={ExecType.MoveToFreeze} />

            </Box>

            <Box display="flex" gap={4} mb={2} flexDirection="column">

                <ExecComponent buttonText="List Files in Folder as Excel - Yarn(Fast)"
                    placeholder='Folder Path or Freezed Profile'
                    execType={genListingOfLocalFolderYarn}
                    reactComponent={<>
                        <RadioGroup aria-label="fileType" name="fileType" value={genListingOfLocalFolderYarn} onChange={handleChangeYarn} row>
                            <FormControlLabel value={ExecType.GenListingsofLocalFolderAsPdfYarn} control={<Radio />} label="PDF-ONLY" />
                            <FormControlLabel value={ExecType.GenListingsofLocalFolderAsAllYarn} control={<Radio />} label="ALL" />
                            <FormControlLabel value={ExecType.GenListingsofLocalFolderAsLinksYarn} control={<Radio />} label="LISTING ONLY" />
                            <FormControlLabel value={ExecType.GenListingsWithStatsofLocalFolderAsLinksYarn} control={<Radio />} label="LISTING WITH STATS ONLY" />
                        </RadioGroup>
                    </>}
                />

                <ExecComponent buttonText="List Files in Folder-Gradle(Slow)"
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

            <Box display="flex" gap={4} mb={2} flexDirection="column">

                <ExecComponent buttonText="Download"
                    placeholder='Download Files from Excel - Using Frond End'
                    secondTextBoxPlaceHolder="Excel Column Corresponding to Downloadable"
                    execType={ExecType.DownloadFilesFromExcel}
                    css={{ width: "25vw" }}
                    css2={{ width: "25vw" }}
                />

            </Box>
        </Box>
    );
}

export default ExecLauncherThree;
