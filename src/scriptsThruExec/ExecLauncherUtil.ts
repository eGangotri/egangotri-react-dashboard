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
import { makePostCallForCombineGDriveAndReducedPdfExcels, makePostCallForCreateUploadableExcelV1, makePostCallForCreateUploadableExcelV3, makePostCallForGDriveExcelTrack, makePostCallForGenExcelForGDrive, makePostCallForTopN, makePostCallWithErrorHandling, verifyUploadStatusForUploadCycleId } from "service/BackendFetchService";
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
  FILE_NAME_LENGTH = 33,
  FILE_NAME_LENGTH_INCLUDING_PATH = 34,
  DUPLICATES_BY_FILE_SIZE = 35,
  RENAME_NON_ASCII_FILE_NAMES_IN_FOLDER = 36,
  JPG_TO_PDF = 37,
  PNG_TO_PDF = 38,
  TIFF_TO_PDF = 39,
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


  GenExcelV1ofAbsPathsFromProfile = 9000,
  GenExcelV1ofAbsPathsForAllFileTypesFromProfile = 9001,


  GenExcelV3ofAbsPathsFromProfile = 965,
  GenExcelV3ofAbsPathsForAllFileTypesFromProfile = 966,

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
  UPLOAD_MISSED_TO_GDRIVE = 213,

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
  const dataUserInput = replaceQuotes(data.userInput)?.trim();
  const dataUserInput2 = replaceQuotes(data.userInputSecond || "")?.trim();
  const dataUserInput3 = replaceQuotes(data.userInputThird || "")?.trim();
  console.log(`data.userInput ${dataUserInput} 
  dataUserInput2 ${dataUserInput2}
  dataUserInput3 ${dataUserInput3}
  `);

  if (execType >= 1000 && execType < 2000) {
    const execAsString = execType.toString()
    _resp = await launchArchiveExcelDownload(dataUserInput, dataUserInput2,
      dataUserInput3, execAsString[1] === "1", execAsString[2] === "1", execAsString[3] === "1");
  }

  else if (execType >= 2000 && execType <= 2111) {
    _resp = await handleYarnListingGeneration(execType, dataUserInput);
  }

  else if (execType >= 9000 && execType <= 9110) {
    const execAsString = execType.toString()

    _resp = await makePostCallForCreateUploadableExcelV1({
      profiles: dataUserInput,
      script: dataUserInput3,
      allNotJustPdfs: execAsString[1] === "1",
      useFolderNameAsDesc: execAsString[2] === "1",
    },
      `yarnExcel/createExcelV1OfAbsPathFromProfile`);

    // _resp = await makePostCallForCreateUploadableExcelV1({
    //   profiles: dataUserInput,
    //   allNotJustPdfs: true,
    // },
    //   `yarnExcel/createExcelV1OfAbsPathFromProfile`);
  }
  else {
    switch (execType) {
      case ExecType.UploadPdfs:
        _resp = await launchUploader(dataUserInput, dataUserInput2);

        // _resp = await _launchGradlev2({
        //   profiles: dataUserInput
        // }, "launchUploader");
        break;

      case ExecType.UploadPdfsViaExcelV1:
        _resp = await _launchGradlev2(
          {
            profile: dataUserInput,
            excelPath: dataUserInput2,
            uploadCycleId: dataUserInput3
          }, "launchUploaderViaExcelV1");
        break;

      case ExecType.UploadPdfsViaExcelV3:
        _resp = await _launchGradlev2(
          {
            profiles: dataUserInput,
            excelPaths: dataUserInput2,
            range: dataUserInput3
          }, "launchUploaderViaExcelV3");
        break;

      case ExecType.REUPLOAD_USING_JSON:
        _resp = await _launchGradlev2({
          gradleArgs: `'${dataUserInput}','${dataUserInput3}'`,
        }, "launchUploaderViaJson");
        break;

      case ExecType.REUPLOAD_FAILED_USING_UPLOAD_CYCLE_ID:
        _resp = await _launchGradlev2({
          uploadCycleId: dataUserInput,
        }, "launchUploaderViaUploadCycleId");
        break;

      case ExecType.REUPLOAD_MISSED_USING_UPLOAD_CYCLE_ID:
        _resp = await _launchGradlev2({
          uploadCycleId: dataUserInput,
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
          "destDir": dataUserInput2,
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
        _resp = await makePostCallForGenExcelForGDrive({
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

      case ExecType.GenExcelV3ofAbsPathsFromProfile:
        _resp = await makePostCallForCreateUploadableExcelV3({
          profiles: dataUserInput,
          allNotJustPdfs: false,
        },
          `yarnExcel/createExcelV3OfAbsPathFromProfile`);
        break;

      case ExecType.GenExcelV3ofAbsPathsForAllFileTypesFromProfile:
        _resp = await makePostCallForCreateUploadableExcelV3({
          profiles: dataUserInput,
          allNotJustPdfs: true,
        },
          `yarnExcel/createExcelV3OfAbsPathFromProfile`);
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
        _resp = await makePostCallForTopN({
          srcFolders: dataUserInput,
          destRootFolder: dataUserInput2,
          nPages: dataUserInput3,
        }, `yarnListMaker/getFirstAndLastNPages`);
        break;

      case ExecType.FILE_NAME_LENGTH:
        _resp = await makePostCallWithErrorHandling({
          folder: dataUserInput,
          topN: dataUserInput2,
          includePathInCalc: false
        },
          `fileUtil/topLongFileNames`,);
        break;


      case ExecType.FILE_NAME_LENGTH_INCLUDING_PATH:
        _resp = await makePostCallWithErrorHandling({
          folder: dataUserInput,
          topN: dataUserInput2,
          includePathInCalc: true
        },
          `fileUtil/topLongFileNames`,);
        break;

      case ExecType.DUPLICATES_BY_FILE_SIZE:
        _resp = await makePostCallWithErrorHandling({
          folder1: dataUserInput,
          folder2: dataUserInput2,
        },
          `fileUtil/duplicatesByFileSize`,);
        break;

      case ExecType.RENAME_NON_ASCII_FILE_NAMES_IN_FOLDER:
        _resp = await makePostCallWithErrorHandling({
          folder: dataUserInput,
          script: dataUserInput2,
        },
          `fileUtil/renameNonAsciiFiles`,);
        break;

      case ExecType.JPG_TO_PDF:
        _resp = await makePostCallWithErrorHandling({
          folder: dataUserInput,
          imgType: "JPG",
        },
          `fileUtil/imgFilesToPdf`);
        break;

      case ExecType.PNG_TO_PDF:
        _resp = await makePostCallWithErrorHandling({
          folder: dataUserInput,
          imgType: "PNG",
        },
          `fileUtil/imgFilesToPdf`);
        break;

      case ExecType.TIFF_TO_PDF:
        _resp = await makePostCallWithErrorHandling({
          folder: dataUserInput,
          imgType: "TIFF",
        },
          `fileUtil/imgFilesToPdf`);
        break;

      case ExecType.COMBINE_GDRIVE_AND_REDUCED_PDF_DRIVE_EXCELS:
        _resp = await makePostCallForCombineGDriveAndReducedPdfExcels(
          {
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
          uploadCycleId: dataUserInput,
        }, `uploadCycleRoute/getUploadQueueUploadUsheredMissed`);
        break;


      case ExecType.MARK_AS_UPLOADED_ENTRIES_IN_ARCHIVE_EXCEL:
        _resp = await makePostCallWithErrorHandling({
          pathOrUploadCycleId: dataUserInput,
          archiveExcelPath: dataUserInput2,
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
          profileName: dataUserInput,
          mainExcelPath: dataUserInput2,
          archiveExcelPath: dataUserInput3,
        },
          `yarnArchive/compareUploadsViaExcelV1WithArchiveOrg`);
        break;

      case ExecType.COMPARE_UPLOADS_VIA_EXCEL_V3_WITH_ARCHIVE_ORG:
        _resp = await makePostCallWithErrorHandling({
          profileName: dataUserInput,
          mainExcelPath: dataUserInput2,
          archiveExcelPath: dataUserInput3,
        },
          `yarnArchive/compareUploadsViaExcelV3WithArchiveOrg`);
        break;

      case ExecType.COMPARE_G_DRIVE_AND_LOCAL_EXCEL:
        _resp = await makePostCallForGDriveExcelTrack({
          gDriveExcel: dataUserInput,
          localExcel: dataUserInput2,
        },
          `searchGDriveDB/compareGDriveAndLocalExcel`);
        break;

      case ExecType.UPLOAD_MISSED_TO_GDRIVE:
        _resp = await makePostCallWithErrorHandling({
          diffExcel: dataUserInput,
          gDriveRoot: dataUserInput2,
        },
          `searchGDriveDB/uploadToGDriveBasedOnDiffExcel`);
        break;

      default:
        _resp = {}
        // Handle unknown execType value
        break;
    }
  }
  return _resp;
}