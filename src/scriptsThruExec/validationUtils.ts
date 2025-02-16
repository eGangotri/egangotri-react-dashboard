import { ChangeEvent } from "react";

export const handleInputValidation = (e: ChangeEvent<HTMLInputElement>,
    setValidationCss: (p0: { backgroundColor: string; width: string; }) => void) => {

    const inputValue = e.target?.value
    console.log("inputValue", inputValue, `inputValue.includes("ab") ${inputValue.includes("ab")}`);
    if (inputValue.includes("/") || inputValue.includes("\\")) {
        setValidationCss({ backgroundColor: "red", width: "450px" });
    } else {
        setValidationCss({ backgroundColor: "lightgreen", width: "450px" });
    }
};
