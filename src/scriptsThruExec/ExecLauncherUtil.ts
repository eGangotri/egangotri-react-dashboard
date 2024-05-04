import {
  launchLocalFolderListingForAll,
  launchLocalFolderListingForPdf, launchBulkRename,
  launchReverseMove, launchUploader, loginToArchive,
  _launchGradlev2
} from "service/launchGradle";

import {
  addHeaderFooter,
  launchArchiveExcelDownload,
  launchArchivePdfDownload,
  launchGoogleDriveDownload,
  launchVanitizeModule,
  launchYarnMoveToFreeze,
  launchYarnQaToDestFileMover,
  makePostCallToPath
} from "service/launchYarn";

import { ExecComponentFormData, ExecResponseDetails } from "./types";
import { makePostCallWithErrorHandling } from "service/BackendFetchService";
import { downloadFromExcelUsingFrontEnd } from "service/launchFrontEnd";
import { replaceQuotes } from "mirror/utils";

export enum ExecType {
  UploadPdfs = 1,
  UploadPdfsViaExcel = 111,
  UploadPdfsViaAbsPath = 113,
  MoveFolderContents = 2,
  ReverseMove = 3,
  LoginToArchive = 4,
  UseBulkRenameConventions = 5,
  DownloadGoogleDriveLink = 6,
  DownloadFilesFromExcel = 61,
  DirectoryCompare = 62,
  GenExcelOfArchiveLink = 71,
  GenExcelOfArchiveLinkLimitedFields = 72,
  GenExcelOfArchiveLinkLimitedFieldsWithListing = 721,
  GenExcelOfArchiveLinkListingOnly = 722,
  GenExcelOfGoogleDriveLink = 81,
  GenExcelOfGoogleDriveLinkForReduced = 82,
  GenListingsofLocalFolderAsPdf = 91,
  GenListingsofLocalFolderAsAll = 92,
  GenListingsofLocalFolderAsPdfYarn = 93,
  GenListingsofLocalFolderAsPdfWithStatsYarn = 931,
  GenListingsofLocalFolderAsAllYarn = 94,
  GenListingsofLocalFolderAsAllWithStatsYarn = 941,
  GenListingsofLocalPdfFolderAsLinksYarn = 95,
  GenListingsWithStatsofPdfLocalFolderAsLinksYarn = 96,
  GenListingsofAllLocalFolderAsLinksYarn = 961,
  GenListingsWithStatsofAllLocalFolderAsLinksYarn = 962,
  AddHeaderFooter = 10,
  MoveToFreeze = 11,
  DownloadArchivePdfs = 12,
  VANITIZE = 100,
  GET_FIRST_N_PAGES = 200,
  COMBINE_GDRIVE_AND_REDUCED_PDF_DRIVE_EXCELS = 201,
  DUMP_GDRIVE_COMBO_EXCEL_TO_MONGO = 202,
  DUMP_ARCHIVE_EXCEL_TO_MONGO = 203,
  MARK_AS_UPLOADED_ENTRIES_IN_ARCHIVE_EXCEL = 204,
  REUPLOAD_USING_JSON = 205
}

export enum Tif2PdfExecType {
  STEP1 = 1,
  STEP2 = 2,
  STEP3 = 3,
  STEP4 = 4,
  STEP5 = 5,
  STEP6 = 6,
}

export enum AITextIdentifierExecType {
  STEP1 = 1,
  STEP2 = 2,
  STEP3 = 3,
  STEP4 = 4,
  STEP5 = 5,
  STEP6 = 6,
}
export const invokeFuncBasedOnExecType = async (execType: ExecType,
  data: ExecComponentFormData): Promise<ExecResponseDetails> => {
  let _resp: ExecResponseDetails = {}
  const dataUserInput = data.userInput;
  const dataUserInput2 = data.userInputSecond || "";
  const dataUserInput3 = data.userInputThird || "";
  console.log(`data.userInput ${dataUserInput} 
  dataUserInput2 ${dataUserInput2}
  dataUserInput3 ${dataUserInput3}
  `);

  switch (execType) {
    case ExecType.UploadPdfs:
      _resp = await launchUploader(dataUserInput);

      // _resp = await _launchGradlev2({
      //   profiles: dataUserInput
      // }, "launchUploader");
      break;

    case ExecType.UploadPdfsViaExcel:
      _resp = await _launchGradlev2({
        gradleArgs: `${dataUserInput},'${replaceQuotes(dataUserInput2)}','${dataUserInput3}'`,
      }, "launchUploaderViaExcel");
      console.log("UploadPdfsViaExcel", JSON.stringify(_resp))
      break;

    case ExecType.REUPLOAD_USING_JSON:
      _resp = await _launchGradlev2({
        gradleArgs: `'${replaceQuotes(dataUserInput)}','${dataUserInput3}'`,
      }, "launchUploaderViaJson");
      break;

    //launchUploaderViaAbsPath
    case ExecType.UploadPdfsViaAbsPath:
      _resp = await _launchGradlev2({
        gradleArgs: `${dataUserInput} # '${dataUserInput2} '`,
      }, "launchUploaderViaAbsPath");
      break;

    case ExecType.MoveFolderContents:
      _resp = await launchYarnQaToDestFileMover({
        qaPath: dataUserInput,
        "dest": data.userInputSecond || "",
        flatten: true
      });
      break;

    case ExecType.ReverseMove:
      _resp = await launchReverseMove(dataUserInput);
      break;

    case ExecType.LoginToArchive:
      _resp = await loginToArchive(dataUserInput);
      break;

    case ExecType.UseBulkRenameConventions:
      _resp = await launchBulkRename(dataUserInput);
      break;
    case ExecType.DownloadGoogleDriveLink:
      _resp = await launchGoogleDriveDownload(dataUserInput, dataUserInput2);
      break;

    case ExecType.DownloadFilesFromExcel:
      _resp = await downloadFromExcelUsingFrontEnd(dataUserInput, dataUserInput2);
      break;
    case ExecType.GenExcelOfArchiveLink:
      _resp = await launchArchiveExcelDownload(dataUserInput, dataUserInput3, false, false);
      break;
    case ExecType.GenExcelOfArchiveLinkLimitedFields:
      _resp = await launchArchiveExcelDownload(dataUserInput, dataUserInput3, true, false);
      break;

    case ExecType.GenExcelOfArchiveLinkLimitedFieldsWithListing:
      _resp = await launchArchiveExcelDownload(dataUserInput, dataUserInput3, true, true);
      break;
    case ExecType.GenExcelOfArchiveLinkListingOnly:
      _resp = await launchArchiveExcelDownload(dataUserInput, dataUserInput3, true, true);
      break;

    case ExecType.DirectoryCompare:
      _resp = await makePostCallWithErrorHandling({
        "srcDir": dataUserInput,
        "destDir": data.userInputSecond,
      }, `yarn/compareDirectories`);
      break;

    case ExecType.GenExcelOfGoogleDriveLink:
      _resp = await makePostCallWithErrorHandling({
        "googleDriveLink": dataUserInput,
        "folderName": data.userInputSecond || "D:\\",
        "reduced": false
      }, `yarnListMaker/getGoogleDriveListing`);
      break;

    case ExecType.GenExcelOfGoogleDriveLinkForReduced:
      _resp = await makePostCallWithErrorHandling({
        "googleDriveLink": dataUserInput,
        "folderName": data.userInputSecond || "D:\\",
        "reduced": true
      }, `yarnListMaker/getGoogleDriveListing`);
      break;


    case ExecType.GenListingsofLocalFolderAsPdf:
      _resp = await launchLocalFolderListingForPdf(dataUserInput);
      break;

    case ExecType.GenListingsofLocalFolderAsAll:
      _resp = await launchLocalFolderListingForAll(dataUserInput);
      break;

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
      _resp = await makePostCallWithErrorHandling({
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
        withLinks: true,
        withStats: false,
        pdfsOnly: true,
      },
        `yarnListMaker/createListingsOfLocalFolder`);
      break;

    case ExecType.GenListingsWithStatsofPdfLocalFolderAsLinksYarn:
      _resp = await makePostCallWithErrorHandling({
        argFirst: dataUserInput,
        withStats: true,
        withLinks: true,
        pdfsOnly: true,
      },
        `yarnListMaker/createListingsOfLocalFolder`);
      break;

    case ExecType.GenListingsofAllLocalFolderAsLinksYarn:
      _resp = await makePostCallWithErrorHandling({
        argFirst: dataUserInput,
        withStats: false,
        withLinks: true,
        pdfsOnly: false,
      },
        `yarnListMaker/createListingsOfLocalFolder`);
      break;

    case ExecType.GenListingsWithStatsofAllLocalFolderAsLinksYarn:
      _resp = await makePostCallWithErrorHandling({
        argFirst: dataUserInput,
        withStats: true,
        withLinks: true,
        pdfsOnly: false,
      },
        `yarnListMaker/createListingsOfLocalFolder`);
      break;


    case ExecType.AddHeaderFooter:
      _resp = await addHeaderFooter(dataUserInput);
      break;

    case ExecType.MoveToFreeze:
      _resp = await launchYarnMoveToFreeze({
        profileAsCSV: dataUserInput,
        flatten: true
      });
      break;

    case ExecType.GET_FIRST_N_PAGES:
      _resp = await makePostCallToPath(`yarnListMaker/getFirstAndLastNPages`, {
        srcFolders: dataUserInput,
        destRootFolder: dataUserInput2,
        nPages: dataUserInput3,
      });
      break;


    case ExecType.COMBINE_GDRIVE_AND_REDUCED_PDF_DRIVE_EXCELS:
      _resp = await makePostCallWithErrorHandling({
        mainExcelPath: dataUserInput,
        secondaryExcelPath: dataUserInput2,
        destExcelPath: dataUserInput3,
      },
        `yarnListMaker/combineGDriveAndReducedPdfExcels`);
      break;

    case ExecType.DUMP_GDRIVE_COMBO_EXCEL_TO_MONGO:
      _resp = await makePostCallWithErrorHandling({
        comboExcelPath: dataUserInput,
      }, `yarnListMaker/dumpGDriveExcelToMongo`);
      break;


    case ExecType.DUMP_ARCHIVE_EXCEL_TO_MONGO:
      _resp = await makePostCallWithErrorHandling({
        archiveExcelPath: dataUserInput,
      }, `yarnArchive/dumpArchiveExcelToMongo`);
      break;

    case ExecType.MARK_AS_UPLOADED_ENTRIES_IN_ARCHIVE_EXCEL:
      _resp = await makePostCallWithErrorHandling({
        pathOrUploadCycleId: replaceQuotes(dataUserInput),
        archiveExcelPath: replaceQuotes(dataUserInput2),
      }, `yarnArchive/markAsUploadedEntriesInArchiveExcel`);
      break;

    case ExecType.DownloadArchivePdfs:
      _resp = await launchArchivePdfDownload(dataUserInput, dataUserInput2)
      break;
    case ExecType.VANITIZE:
      _resp = await launchVanitizeModule(dataUserInput)
      break;
    default:
      _resp = {}
      // Handle unknown execType value
      break;
  }
  return _resp;
}