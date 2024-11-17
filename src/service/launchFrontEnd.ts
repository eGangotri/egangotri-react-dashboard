import path from "path";
import { ExecResponseDetails } from "scriptsThruExec/types";
import { readFile } from 'xlsx';
import { writeFileSync } from 'fs';
import * as XLSX from 'xlsx';
import { read, utils } from 'xlsx';
import { getBackendServer } from "utils/constants";

//"

export const downloadFromExcelUsingFrontEnd = async (excelPath: string, column: string): Promise<ExecResponseDetails> => {
    handleExcel(excelPath, column);
    const xl = "https://archive.org/download/vedantaandadvaitasaivagamaofkashmiracomparitivestudydr.jaidevasingh/Vedanta And Advaita Saivagama of Kashmir A Comparitive Study - Dr. Jaideva Singh.pdf"
    const xlNamex = path.basename(xl);
    console.log(`xlNamex ${xlNamex}`)
    const urlObj = new URL(xl);
    const xlName = urlObj.pathname.split('/').pop() || "default.pdf";
    console.log(`xlName ${xlName}`)
    // await downloadPdf(
    //     xl, xlName);

    return {
        msg: "Implementation awaited",
        excelPath,
        column
    };
}

const handleExcel = (excelPath: string, column: string) => {
    const workbook = readFile(excelPath); // replace with your Excel file path
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    console.log(`jsonData ${JSON.stringify(jsonData)}`)
    return jsonData//.map(row => row[column]);
}

const downloadPdf = async (url: string, filename: string) => {
    const response = await fetch(getBackendServer() + url, {
        mode: 'cors'
    });
    const blob = await response.blob();

    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;

    link.dispatchEvent(
        new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        })
    );

    setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
};
