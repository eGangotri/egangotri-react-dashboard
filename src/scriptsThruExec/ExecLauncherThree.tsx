import React, { useState } from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import { ExecType } from './ExecLauncherUtil';
import { Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { ChangeEvent } from 'react';

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
        const _listingType = Number(_val);
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
                    />
                </Box>

                <ExecComponent
                    buttonText='Move to freeze'
                    placeholder='profiles as csv'
                    execType={ExecType.MoveToFreeze} />

            </Box>

            <Box display="flex" gap={4} mb={2} flexDirection="column">
                <ExecComponent buttonText="List Files in Folder as Excel - Yarn(Slow)"
                    placeholder='Folder Path or Freezed Profile'
                    execType={genListingOfLocalFolderYarn}
                    css={{ width: "40vw" }}
                    reactComponent={<>
                        <RadioGroup aria-label="fileType" name="fileType" value={genListingOfLocalFolderYarn} onChange={handleChangeYarn} row>
                            <div className="grid grid-cols-2">
                                <FormControlLabel value={ExecType.GenListingsofLocalFolderAsPdfYarn} control={<Radio />} label="PDF-ONLY WITH EXCEL" />
                                <FormControlLabel value={ExecType.GenListingsofLocalFolderAsAllYarn} control={<Radio />} label="ALL WITH EXCEL" />
                                <FormControlLabel value={ExecType.GenListingsofLocalFolderAsPdfWithStatsYarn} control={<Radio />} label="PDF-ONLY-WITH EXCEL & STATS" />
                                <FormControlLabel value={ExecType.GenListingsofLocalFolderAsAllWithStatsYarn} control={<Radio />} label="ALL WITH EXCEL & STATS" />
                                <FormControlLabel value={ExecType.GenListingsofLocalPdfFolderAsLinksYarn} control={<Radio />} label="PDF-ONLY-WITH-LISTING ONLY" />
                                <FormControlLabel value={ExecType.GenListingsofAllLocalFolderAsLinksYarn} control={<Radio />} label="ALL-LISTING ONLY" />
                                <FormControlLabel value={ExecType.GenListingsWithStatsofPdfLocalFolderAsLinksYarn} control={<Radio />} label="PDF-ONLY-LISTING & STATS" />
                                <FormControlLabel value={ExecType.GenListingsWithStatsofAllLocalFolderAsLinksYarn} control={<Radio />} label="ALL-LISTING & STATS" />
                            </div>
                        </RadioGroup>
                    </>}
                />

                <ExecComponent buttonText="List Files in Folder-Gradle(Fast)"
                    placeholder='Folder Path or Freezed Profile AS CSV'
                    execType={genListingOfLocalFolder}
                    css={{ width: "40vw" }}
                    reactComponent={<>
                        <RadioGroup aria-label="fileType" name="fileType" value={genListingOfLocalFolder} onChange={handleChange} row>
                            <FormControlLabel value={ExecType.GenListingsofLocalFolderAsPdf} control={<Radio />} label="PDF-ONLY" />
                            <FormControlLabel value={ExecType.GenListingsofLocalFolderAsAll} control={<Radio />} label="ALL" />
                        </RadioGroup>
                    </>}
                />
            </Box>

            <Box display="flex" gap={4} mb={2} flexDirection="column">

                <ExecComponent buttonText="Directory Compare"
                    placeholder='Source Directory'
                    secondTextBoxPlaceHolder="Dest Directory"
                    execType={ExecType.DirectoryCompare}
                    css={{ width: "25vw" }}
                    css2={{ width: "25vw" }}
                />

                <ExecComponent buttonText="Download (IN PROGRESS ONLY)"
                    placeholder='Download Files from Excel - Using Frond End'
                    secondTextBoxPlaceHolder="Excel Column Corresponding to Downloadable"
                    execType={ExecType.DownloadFilesFromExcel_Via_Front_End}
                    css={{ width: "25vw" }}
                    css2={{ width: "25vw" }}
                />

            </Box>
        </Box>
    );
}

export default ExecLauncherThree;
