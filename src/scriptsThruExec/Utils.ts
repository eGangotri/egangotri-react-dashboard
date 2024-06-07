import { makePostCallForGenExcelForLocal, makePostCallWithErrorHandling } from "service/BackendFetchService";
import { ExecType } from "./ExecLauncherUtil";
import { ExecResponseDetails } from "./types";

export const handleYarnListingGeneration = async (execType: ExecType, dataUserInput: string) => {

    let _resp: ExecResponseDetails = {}

    switch (execType) {
        case ExecType.GenListingsofLocalFolderAsPdfYarn:
            console.log("GenListingsofLocalFolderAsPdfYarn", dataUserInput)
            _resp = await makePostCallWithErrorHandling({
                argFirst: dataUserInput,
                pdfsOnly: true,
                withStats: false,
            },
                `yarnListMaker/createListingsOfLocalFolder`);
            break;

        case ExecType.GenListingsofLocalFolderAsPdfWithStatsYarn:
            console.log("GenListingsofLocalFolderAsPdfWithStatsYarn", dataUserInput)
            _resp = await makePostCallWithErrorHandling({
                argFirst: dataUserInput,
                pdfsOnly: true,
                withStats: true,
            },
                `yarnListMaker/createListingsOfLocalFolder`);
            break;

        case ExecType.GenListingsofLocalFolderAsAllYarn:
            console.log("GenListingsofLocalFolderAsAllYarn", dataUserInput)
            //need to save in local storage
            _resp = await makePostCallForGenExcelForLocal({
                argFirst: dataUserInput,
                pdfsOnly: false,
                withStats: false,
            },
                `yarnListMaker/createListingsOfLocalFolder`);
            break;

        case ExecType.GenListingsofLocalFolderAsAllWithStatsYarn:
            console.log("GenListingsofLocalFolderAsAllWithStatsYarn", dataUserInput)
            _resp = await makePostCallWithErrorHandling({
                argFirst: dataUserInput,
                pdfsOnly: false,
                withStats: true,
            },
                `yarnListMaker/createListingsOfLocalFolder`);
            break;


        case ExecType.GenListingsofLocalPdfFolderAsLinksYarn:
            console.log("GenListingsofLocalFolderAsLinksYarn", dataUserInput)
            _resp = await makePostCallWithErrorHandling({
                argFirst: dataUserInput,
                onlyInfoNoExcel: true,
                withStats: false,
                pdfsOnly: true,
            },
                `yarnListMaker/createListingsOfLocalFolder`);
            break;

        case ExecType.GenListingsWithStatsofPdfLocalFolderAsLinksYarn:
            _resp = await makePostCallWithErrorHandling({
                argFirst: dataUserInput,
                withStats: true,
                onlyInfoNoExcel: true,
                pdfsOnly: true,
            },
                `yarnListMaker/createListingsOfLocalFolder`);
            break;

        case ExecType.GenListingsofAllLocalFolderAsLinksYarn:
            _resp = await makePostCallWithErrorHandling({
                argFirst: dataUserInput,
                withStats: false,
                onlyInfoNoExcel: true,
                pdfsOnly: false,
            },
                `yarnListMaker/createListingsOfLocalFolder`);
            break;

        case ExecType.GenListingsWithStatsofAllLocalFolderAsLinksYarn:
            _resp = await makePostCallWithErrorHandling({
                argFirst: dataUserInput,
                withStats: true,
                onlyInfoNoExcel: true,
                pdfsOnly: false,
            },
                `yarnListMaker/createListingsOfLocalFolder`);
            break;

    }

    return _resp;
}