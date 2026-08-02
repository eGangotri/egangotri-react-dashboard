import React, { useState } from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import { ExecType } from './ExecLauncherUtil';
import { FormControlLabel, Checkbox } from '@mui/material';

const ExecForPdfExcelRenaming: React.FC = () => {
    return (
        <Box display="flex" gap={4} mb={2} flexDirection="row">
            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                 <ExecComponent buttonText="Rename Files via Excel. Abs Path->New Name "
                    placeholder='Excel File Path'
                    secondTextBoxPlaceHolder='Dash Separated Column Indices. 1-based. Ex. 2-3'
                    execType={ExecType.RENAME_FIES_VIA_EXCEL_TWO_COL}
                    userInputOneInfo='Give an Abs. Path (desired 1st Col. in Excel), give a new file name(desired 2nd Col. in Excel). find the abs. path renamed'
                    userInputTwoInfoNonMandatory="Dash Separated Numbers for 1-based Excel Col. Index. Ex. 2-3. 2 Should be an ab. path, 3 should be new name. Col. 2 will be renamed as Col. 3"
                    css={{ width: "400px" }}
                    css2={{ width: "400px" }}
                    css3={{ width: "400px" }}
                />

                 <ExecComponent buttonText="Rename Files via Excel"
                                    placeholder='Excel File Path'
                                    secondTextBoxPlaceHolder='Profile or Abs Path'
                                    thirdTextBoxPlaceHolder='Dash Separated Column Indices. Fill Only for Non Fixed Model'
                                    execType={ExecType.RENAME_FIES_VIA_EXCEL}
                                    userInputTwoInfoNonMandatory="Predefined Columns and Indices. Follow Static Model. Leave below blank"
                                    userInputThreeInfoNonMandatory={`Specify Dash Separated Column Indexes with first for Orig Title Second for New Title.
                                        if you leave this COl. empty then it will call 
                                        and expect fixed structure of excel
                                        POST /fileUtil/renameFilesViaExcel
                                         {
                                            "excelPath": "C:\\path\\to\\rename.xlsx",
                                            "folderOrProfile": "PROFILE_NAME or folder path",
                                            }
                                        if you fill it with numeric-Numeric ( ex. 2-3)
                                        POST /fileUtil/renameFilesViaExcelUsingSpecifiedColumns
                                            {
                                            "excelPath": "C:\\path\\to\\rename.xlsx",
                                            "folderOrProfile": "PROFILE_NAME or folder path",
                                            "columns": "2-3"
                                            }
                
                                            folderOrProfile shall be the location of the Col.1 files
                                            column 2 holds the original filename, column 3 holds the new name (both 1-based positions in the sheet).
                                            Col-1 & 2 should be both just names not abs. paths.
                                            Caveat. the code works on unique name searches so multiple same name files will be ignored.
                `}
                
                                    css={{ width: "400px" }}
                                    css2={{ width: "400px" }}
                                    css3={{ width: "400px" }}
                                />
            </Box>

            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
               

            </Box>
            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
              
            </Box>
        </Box>
    );
}

export default ExecForPdfExcelRenaming;
