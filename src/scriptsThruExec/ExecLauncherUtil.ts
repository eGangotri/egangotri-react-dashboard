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
import { makePostCallForGenExcelForGDrive, makePostCallWithErrorHandling, verifyUploadStatusForUploadCycleId } from "service/BackendFetchService";
import { downloadFromExcelUsingFrontEnd } from "service/launchFrontEnd";
import { replaceQuotes } from "mirror/utils";
import { handleYarnListingGeneration } from "./Utils";

export enum ExecType {
  UploadPdfs = 1,
  UploadPdfsViaExcelV1 = 111,
  UploadPdfsViaExcelV3 = 112,
  UploadPdfsViaAbsPath = 113,
  MoveFolderContents = 2,
  ReverseMove = 31,
  SNAP_TO_HTML = 32,
  LONGER_THANKTHRESHOLD = 33,
  LoginToArchive = 4,
  UseBulkRenameConventions = 5,
  DownloadGoogleDriveLink = 6,
  DownloadFilesFromExcel = 61,
  DirectoryCompare = 62,

  GenExcelOfArchiveLinkCombo1 = 1000,
  GenExcelOfArchiveLinkCombo2 = 1001,

  GenExcelOfArchiveLinkCombo3 = 1010,
  GenExcelOfArchiveLinkCombo4 = 1011,

  GenExcelOfArchiveLinkCombo5 = 1100,
  GenExcelOfArchiveLinkCombo6 = 1101,

  GenExcelOfArchiveLinkCombo7 = 1110,
  GenExcelOfArchiveLinkCombo8 = 1111,

  GenExcelOfGoogleDriveLinkPdfOnly = 811,
  GenExcelOfGoogleDriveLinkForAll = 812,
  GenExcelOfGoogleDriveLinkForReduced = 82,

  GenListingsofLocalFolderAsPdf = 91,
  GenListingsofLocalFolderAsAll = 92,

  GenListingsofLocalFolderAsPdfYarn = 2000,
  GenListingsofLocalFolderAsPdfWithStatsYarn = 2001,
  GenListingsofLocalFolderAsAllYarn = 2002,
  GenListingsofLocalFolderAsAllWithStatsYarn = 2003,
  GenListingsofLocalPdfFolderAsLinksYarn = 2004,
  GenListingsWithStatsofPdfLocalFolderAsLinksYarn = 2005,
  GenListingsofAllLocalFolderAsLinksYarn = 2006,
  GenListingsWithStatsofAllLocalFolderAsLinksYarn = 2007,

  GenExcelofAbsPathsFromProfile = 963,
  GenExcelofAbsPathsForAllFileTypesFromProfile = 964,
  AddHeaderFooter = 10,
  MoveToFreeze = 11,
  DownloadArchivePdfs = 12,
  VANITIZE = 100,
  GET_FIRST_N_PAGES = 200,
  COMBINE_GDRIVE_AND_REDUCED_PDF_DRIVE_EXCELS = 201,
  DUMP_GDRIVE_COMBO_EXCEL_TO_MONGO = 202,
  DUMP_ARCHIVE_EXCEL_TO_MONGO = 203,
  MARK_AS_UPLOADED_ENTRIES_IN_ARCHIVE_EXCEL = 204,
  IDENTIFY_UPLOAD_MISSED_BY_UPLOAD_CYCLE_ID = 205,
  IDENTIFY_FAILED_BY_UPLOAD_CYCLE_ID = 206,
  REUPLOAD_USING_JSON = 207,
  REUPLOAD_FAILED_USING_UPLOAD_CYCLE_ID = 208,
  REUPLOAD_MISSED_USING_UPLOAD_CYCLE_ID = 209,

  COMPARE_UPLOADS_VIA_EXCEL_V1_WITH_ARCHIVE_ORG = 210,
  COMPARE_UPLOADS_VIA_EXCEL_V3_WITH_ARCHIVE_ORG = 211,

  COMPARE_G_DRIVE_AND_LOCAL_EXCEL = 212,

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

  if (execType >= 1000 && execType < 2000) {
    const execAsString = execType.toString()
    _resp = await launchArchiveExcelDownload(dataUserInput, dataUserInput2,
      dataUserInput3, execAsString[1] === "1", execAsString[2] === "1", execAsString[3] === "1");
  }

  else if (execType >= 2000) {
    _resp = await handleYarnListingGeneration(execType, dataUserInput);
  }

  else {
    switch (execType) {
      case ExecType.UploadPdfs:
        _resp = await launchUploader(dataUserInput);

        // _resp = await _launchGradlev2({
        //   profiles: dataUserInput
        // }, "launchUploader");
        break;

      case ExecType.UploadPdfsViaExcelV1:
        _resp = await _launchGradlev2(
          {
            profile: dataUserInput,
            excelPath: replaceQuotes(dataUserInput2),
            uploadCycleId: dataUserInput3
          }, "launchUploaderViaExcelV1");
        break;

      case ExecType.UploadPdfsViaExcelV3:
        _resp = await _launchGradlev2(
          {
            profile: dataUserInput,
            excelPath: replaceQuotes(dataUserInput2),
            range: dataUserInput3
          }, "launchUploaderViaExcelV3");
        break;

      case ExecType.REUPLOAD_USING_JSON:
        _resp = await _launchGradlev2({
          gradleArgs: `'${replaceQuotes(dataUserInput)}','${dataUserInput3}'`,
        }, "launchUploaderViaJson");
        break;

      case ExecType.REUPLOAD_FAILED_USING_UPLOAD_CYCLE_ID:
        _resp = await _launchGradlev2({
          uploadCycleId: replaceQuotes(dataUserInput),
        }, "launchUploaderViaUploadCycleId");
        break;

      case ExecType.REUPLOAD_MISSED_USING_UPLOAD_CYCLE_ID:
        _resp = await _launchGradlev2({
          uploadCycleId: replaceQuotes(dataUserInput),
        }, "launchUploaderForMissedViaUploadCycleId");
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


      case ExecType.DirectoryCompare:
        _resp = await makePostCallWithErrorHandling({
          "srcDir": dataUserInput,
          "destDir": data.userInputSecond,
        }, `yarn/compareDirectories`);
        break;

      case ExecType.GenExcelOfGoogleDriveLinkPdfOnly:
        _resp = await makePostCallForGenExcelForGDrive({
          "googleDriveLink": dataUserInput,
          "folderName": data.userInputSecond || "D:\\",
          "reduced": false,
          "allNotJustPdfs": false
        }, `yarnListMaker/getGoogleDriveListing`);
        break;

      case ExecType.GenExcelOfGoogleDriveLinkForAll:
        _resp = await makePostCallForGenExcelForGDrive({
          "googleDriveLink": dataUserInput,
          "folderName": data.userInputSecond || "D:\\",
          "reduced": false,
          "ignoreFolder": "",
          "allNotJustPdfs": true,
        }, `yarnListMaker/getGoogleDriveListing`);
        break;

      case ExecType.GenExcelOfGoogleDriveLinkForReduced:
        _resp = await makePostCallWithErrorHandling({
          "googleDriveLink": dataUserInput,
          "folderName": data.userInputSecond || "D:\\",
          "reduced": true,
          "allNotJustPdfs": false
        }, `yarnListMaker/getGoogleDriveListing`);
        break;


      case ExecType.GenListingsofLocalFolderAsPdf:
        _resp = await launchLocalFolderListingForPdf(dataUserInput);
        break;

      case ExecType.GenListingsofLocalFolderAsAll:
        _resp = await launchLocalFolderListingForAll(dataUserInput);
        break;


      case ExecType.GenExcelofAbsPathsFromProfile:
        _resp = await makePostCallWithErrorHandling({
          profile: dataUserInput,
          allNotJustPdfs: false,
        },
          `yarnExcel/createExcelOfAbsPathFromProfile`);
        break;

      case ExecType.GenExcelofAbsPathsForAllFileTypesFromProfile:
        _resp = await makePostCallWithErrorHandling({
          profile: dataUserInput,
          allNotJustPdfs: true,
        },
          `yarnExcel/createExcelOfAbsPathFromProfile`);
        break;

      case ExecType.SNAP_TO_HTML:
        _resp = await _launchGradlev2({
          rootFolder: `${dataUserInput}`,
        }, "snap2html");
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

      case ExecType.IDENTIFY_UPLOAD_MISSED_BY_UPLOAD_CYCLE_ID:
        _resp = await makePostCallWithErrorHandling({
          uploadCycleIdForVerification: dataUserInput,
        }, `yarnArchive/verifyUploadStatus`);
        break;

      case ExecType.IDENTIFY_FAILED_BY_UPLOAD_CYCLE_ID:
        _resp = await makePostCallWithErrorHandling({
          uploadCycleId: replaceQuotes(dataUserInput),
        }, `uploadCycleRoute/getUploadQueueUploadUsheredMissed`);
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
      case ExecType.COMPARE_UPLOADS_VIA_EXCEL_V1_WITH_ARCHIVE_ORG:
        _resp = await makePostCallWithErrorHandling({
          profileName: replaceQuotes(dataUserInput).trim(),
          mainExcelPath: replaceQuotes(dataUserInput2).trim(),
          archiveExcelPath: replaceQuotes(dataUserInput3).trim(),
        },
          `yarnArchive/compareUploadsViaExcelV1WithArchiveOrg`);
        break;

      case ExecType.COMPARE_UPLOADS_VIA_EXCEL_V3_WITH_ARCHIVE_ORG:
        _resp = await makePostCallWithErrorHandling({
          profileName: replaceQuotes(dataUserInput).trim(),
          mainExcelPath: replaceQuotes(dataUserInput2).trim(),
          archiveExcelPath: replaceQuotes(dataUserInput3).trim(),
        },
          `yarnArchive/compareUploadsViaExcelV3WithArchiveOrg`);
        break;

      case ExecType.COMPARE_G_DRIVE_AND_LOCAL_EXCEL:
        _resp = await makePostCallWithErrorHandling({
          gDriveExcel: replaceQuotes(dataUserInput).trim(),
          localExcel: replaceQuotes(dataUserInput2).trim(),
        },
          `searchGDriveDB/compareGDriveAndLocalExcel`);
        break;

      default:
        _resp = {}
        // Handle unknown execType value
        break;
    }
  }
  return _resp;
}