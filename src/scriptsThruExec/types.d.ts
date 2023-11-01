export type ExecComponentFormData = {
    userInput: string;
    userInputSecond?: string;
};

export type ExecComponentProps = {
    placeholder?: string;
    buttonText?: string;
    execType?: number;
    secondTextBox?: boolean;
    secondTextBoxPlaceHolder?: string;
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