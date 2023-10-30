type ExecComponentFormData = {
    userInput: string;
    userInputSecond?: string;
};

type ExecComponentProps = {
    placeholder?: string;
    buttonText?: string;
    execType?: number;
    secondTextBox?: boolean;
    secondTextBoxPlaceHolder?: string;
};