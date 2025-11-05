import React, { ChangeEvent, useState } from 'react';
import ExecComponent from './ExecComponent';
import { ExecType } from './ExecLauncherUtil';
import GDriveExcelOptions from './GDriveExcelOptions';

const GDriveCatalogerExcelComponent: React.FC = () => {
    const [excelGDrive, setExcelGDrive] = useState<number>(ExecType.GenExcelOfGoogleDriveLinkPdfOnly);
    const [validationCss, setValidationCss] = useState({
        backgroundColor: "lightgreen",
        width: "450px"
    });

    const chooseGDriveExcelType = (event: ChangeEvent<HTMLInputElement>) => {
        const _val = event.target.value;
        console.log("_val", _val);
        let _listingType;
        switch (Number(_val)) {
            case ExecType.GenExcelOfGoogleDriveLinkPdfOnly:
                _listingType = ExecType.GenExcelOfGoogleDriveLinkPdfOnly;
                break;
            case ExecType.GenExcelOfGoogleDriveLinkPdfOnlyManuVersion:
                _listingType = ExecType.GenExcelOfGoogleDriveLinkPdfOnlyManuVersion;
                break;
            case ExecType.GenExcelOfGoogleDriveLinkPdfOnlyMinimalVersion:
                _listingType = ExecType.GenExcelOfGoogleDriveLinkPdfOnlyMinimalVersion;
                break;
            case ExecType.GenExcelOfGoogleDriveLinkForAll:
                _listingType = ExecType.GenExcelOfGoogleDriveLinkForAll;
                break;
            case ExecType.GenExcelOfGoogleDriveLinkForRenameFilesExcel:
                _listingType = ExecType.GenExcelOfGoogleDriveLinkForRenameFilesExcel;
                break;
            case ExecType.GenExcelOfGoogleDriveLinkForReduced:
                _listingType = ExecType.GenExcelOfGoogleDriveLinkForReduced;
                break;
        }
        console.log("_listingType", _listingType);
        setExcelGDrive(_listingType || ExecType.GenExcelOfGoogleDriveLinkPdfOnly);
    };

    const handleInputChange = (inputValue: string) => {
        console.log("inputValue", inputValue, `inputValue.includes("ab") ${inputValue.includes("ab")}`);
        if (inputValue.includes("/") || inputValue.includes("\\")) {
            setValidationCss({ backgroundColor: "red", width: "450px" });
        } else {
            setValidationCss({ backgroundColor: "lightgreen", width: "450px" });
        }
    };

    return (
        <ExecComponent
            buttonText="Create G-Drive Cataloger Version Excel"
            placeholder='Enter Google Drive Link(s)/Identifiers as csv'
            secondTextBoxPlaceHolder='Enter Folder Name (not path)'
            execType={excelGDrive}
            css={{ minWidth: "23vw", width: "450px" }}
            css2={validationCss}
            onInputChange={handleInputChange}
            userInputTwoInfoNonMandatory="Only Folder Name not Path"
            reactComponent={<GDriveExcelOptions value={excelGDrive} onChange={chooseGDriveExcelType} />}
        />
    );
};

export default GDriveCatalogerExcelComponent;
