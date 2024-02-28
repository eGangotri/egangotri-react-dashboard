import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';

export type ExecComponentFormData = {
    userInput: string;
    userInputSecond?: string;
    userInputSecond3?: string;
};

export type ExecComponentProps = {
    placeholder?: string;
    buttonText?: string;
    execType?: number;
    secondTextBoxPlaceHolder?: string;
    reactComponent ?: JSX.Element;
    css?: SxProps<Theme>;
};

export type ExecResponse = {
    response: ExecResponseDetails
}

export type ExecResponseDetails = {
    [key: string]: string | number | boolean | null; // Replace with your actual types
    status?: string;
    success_count?: number;
    error_count?: number;
    totalPdfsToDownload?: number;
    results?: string[];
}


export type ArchiveLinkResponseDetails = {
    [key: string]: string | number | boolean | null; // Replace with your actual types
    status?: string;
    success_count?: number;
    error_count?: number;
    totalPdfsToDownload?: number;
    results?: string[];
}