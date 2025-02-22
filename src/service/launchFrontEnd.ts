import path from "path";
import { ExecResponseDetails } from "scriptsThruExec/types";
import { readFile } from 'xlsx';
import * as XLSX from 'xlsx';

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

