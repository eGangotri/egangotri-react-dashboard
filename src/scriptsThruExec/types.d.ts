import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';

export type ExecComponentFormData = {
    userInput: string;
    userInputSecond?: string;
    userInputThird?: string;
};

export type ExecComponentProps = {
    placeholder?: string;
    buttonText?: string;
    execType?: number;
    secondTextBoxPlaceHolder?: string;
    thirdTextBoxPlaceHolder?: string;
    secondTextBoxDefaultValue?: string;
    thirdTextBoxDefaultValue?: string;
    reactComponent?: JSX.Element;
    css?: SxProps<Theme>;
    css2?: SxProps<Theme>;
    css3?: SxProps<Theme>;
    userInputOneInfo?: string;
    userInputTwoInfoNonMandatory?: string;
    userInputThreeInfoNonMandatory?: string;
    secondComponentRequired?: boolean
    textBoxOneValue?: string;
    textBoxTwoValue?: string;
    textBoxThreeValue?: string;
    thirdButton?: JSX.Element;
    multiline1stTf?: boolean;
    multiline2ndTf?: boolean;
    multiline3rdTf?: boolean;
    fullWidth?: boolean;
    rows1stTf?: number;
    rows2ndTf?: number;
    onInputChange?: (inputValue: string) => void; // Add the callback function prop
    onInputChangeSecond?: (inputValue: string) => void; // Add the callback function prop for the second text field
    onCompleted?: (response: any) => void;
    validationPattern?: RegExp;
    validationMessage?: string;
    confirmDialogMsg?: string;
};

export type ExecResponse = {
    response: ExecResponseDetails | ExecResponseDetails[]
}

export type ExecResponseDetails = {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    [key: string]: string | number | boolean | null | any; // Replace with your actual types
    status?: string;
    success_count?: number;
    error_count?: number;
    totalPdfsToDownload?: number;
    success?: boolean;
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    results?: any[];
}


export type ArchiveLinkResponseDetails = {
    [key: string]: string | number | boolean | null; // Replace with your actual types
    status?: string;
    success_count?: number;
    error_count?: number;
    totalPdfsToDownload?: number;
    results?: string[];
}