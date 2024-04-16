import React, { ChangeEvent, useState } from 'react';
import ExecComponent from './ExecComponent';
import Box from '@mui/material/Box';
import { ExecType } from './util';
import * as XLSX from 'xlsx';


const ExecLauncherOne: React.FC = () => {
    const [flatten, setFlatten] = useState<boolean>(true);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFlatten(event.target.checked);
    };


    // ...

    const [items, setItems] = useState([]);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event?.target?.files || []
        const file0 = (file?.length || 0) > 0 ? file[0] : null;
        await readExcel(file0);
        console.log("items", JSON.stringify(items))
    };

    const readExcelXX = (file: File | null) => {
        if (!file) return;
        const promise = new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);

            fileReader.onload = (e) => {
                const bufferArray = e.target?.result;

                const wb = XLSX.read(bufferArray, { type: 'buffer' });

                const wsname = wb.SheetNames[0];

                const ws = wb.Sheets[wsname];

                const data = XLSX.utils.sheet_to_json(ws);

                resolve(data);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        promise.then((d: any) => {
            setItems(d);
        });
    };

    const readExcel = async (file: File | null) => {
        if (!file) return;
        try {
            const fileReader = new FileReader();
            const readedFile = await new Promise((resolve, reject) => {
                fileReader.onload = (e) => resolve(e.target?.result);
                fileReader.onerror = reject;
                fileReader.readAsArrayBuffer(file);
            });

            const wb = XLSX.read(readedFile, { type: 'buffer' });

            const wsname = wb.SheetNames[0];

            const ws = wb.Sheets[wsname];
            console.log("ws", JSON.stringify(ws))
            const data = XLSX.utils.sheet_to_json(ws);

            return data;
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <Box display="flex" gap={4} mb={2} flexDirection="row">

            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                <ExecComponent
                    buttonText="Download Pdfs from GDrive"
                    placeholder='Enter Google Drive Link(s)/Identifiers as csv'
                    secondTextBoxPlaceHolder='Enter Profile or File Abs Path'
                    execType={ExecType.DownloadGoogleDriveLink}
                    css={{ backgroundColor: "lightgreen", width: "450px" }}
                    css2={{ backgroundColor: "lightgreen" }} />

            </Box>

            <Box display="flex" alignContent="start" gap={4} mb={2} flexDirection="column">
                <ExecComponent
                    buttonText="Create G-Drive Excel"
                    placeholder='Enter Google Drive Link(s)/Identifiers as csv'
                    secondTextBoxPlaceHolder='Enter Folder Name (not path)'
                    execType={ExecType.GenExcelOfGoogleDriveLink} />

                <ExecComponent
                    buttonText="Download from GDrive Excel"
                    placeholder='Enter Google Drive Link(s)/Identifiers as csv'
                    secondTextBoxPlaceHolder='Enter Folder Name (not path)'
                    execType={ExecType.GenExcelOfGoogleDriveLink}
                    reactComponent={<>
                        <input type="file" onChange={handleFileChange} />
                    </>}
                />
            </Box>
        </Box>

    );
}

export default ExecLauncherOne;
