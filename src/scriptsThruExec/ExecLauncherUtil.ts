import {
  launchLocalFolderListingForAll,
  launchLocalFolderListingForPdf, launchBulkRename,
  launchReverseMove, launchUploader, loginToArchive,
  _launchGradlev2
} from "service/launchGradle";

import {
  addHeaderFooter,
  downloadGDriveItemsViaExcel,
  launchAllArchiveItemsDownloadViaExcel,
  launchAllFromGoogleDriveDownload,
  launchArchiveExcelDownload,
  launchArchivePdfDownload,
  launchGoogleDriveDownload,
  launchGoogleDriveZipDownload,
  launchImgFilesToPdf,
  launchVanitizeModule,
  launchYarnMoveToFreeze,
  launchYarnMoveToFreezeByUploadId,
  launchYarnQaToDestFileMover,
  makePostCallToPath,
  unzipFolders,
  verifyGDriveDwnldSuccessFolders,
  verifyImgToPdfSuccess,
  verifyUnzipFolders
} from "service/launchYarn";

import { ExecComponentFormData, ExecResponseDetails } from "./types";
import { makePostCallForCombineGDriveAndReducedPdfExcels, makePostCallForCreateUploadableExcelV1, makePostCallForCreateUploadableExcelV3, makePostCallForGDriveExcelTrack, makePostCallForGenExcelForGDrive, makePostCallForTopN, makePostCallWithErrorHandling, verifyUploadStatusForUploadCycleId } from "service/BackendFetchService";
import { downloadFromExcelUsingFrontEnd } from "service/launchFrontEnd";
import { replaceQuotes } from "mirror/utils";
import { handleYarnListingGeneration } from "./Utils";
import { IMG_TYPE_ANY, IMG_TYPE_JPG, IMG_TYPE_PNG, IMG_TYPE_TIF } from "./constants";
import { ALL_TYPE, PDF_TYPE, ZIP_TYPE } from "mirror/CommonConstants";

export enum ExecType {
  UploadPdfs = 1,
  UploadPdfsViaExcelV1 = 111,
  UploadPdfsViaExcelV3 = 112,
  UploadPdfsViaAbsPath = 113,
  MoveFolderContents = 2,
  MoveMultipleFilesAsCSVtoFolderOrProfile = 21,
  ReverseMove = 31,
  SNAP_TO_HTML = 32,
  FILE_NAME_LENGTH = 33,
  FILE_NAME_LENGTH_INCLUDING_PATH = 34,
  DUPLICATES_BY_FILE_SIZE = 35,
  DISJOINT_SET_BY_FILE_SIZE = 351,
  RENAME_NON_ASCII_FILE_NAMES_IN_FOLDER = 36,
  JPG_TO_PDF = 37,
  PNG_TO_PDF = 38,
  TIFF_TO_PDF = 39,
  CR2_TO_PDF = 391,
  ANY_IMG_TYPE_TO_PDF = 40,
  LoginToArchive = 4,
  UseBulkRenameConventions = 5,
  DWNLD_PDFS_ONLY_FROM_GOOGLE_DRIVE = 6,
  DWNLD_ZIPS_ONLY_FROM_GOOGLE_DRIVE = 662,
  DWNLD_ALL_FROM_GOOGLE_DRIVE = 663,
  UNZIP_ALL_FILES = 6630,
  VERIFY_UNZIP_ALL_FILES = 6631,
  MERGE_PDFS_MERGE_ALL = 664,
  MERGE_PDFS_MERGE_PER_FOLDER = 665,
  VERIFY_IMG_TO_PDF_SUCCESS_ANY = 667,
  VERIFY_IMG_TO_PDF_SUCCESS_JPG = 668,
  VERIFY_IMG_TO_PDF_SUCCESS_PNG = 669,
  VERIFY_IMG_TO_PDF_SUCCESS_TIF = 700,
  VERIFY_CR2_TO_PDF_SUCCESS_TIF = 7007,

  VERIFY_G_DRIVE_PDF_DOWNLOAD = 701,
  VERIFY_G_DRIVE_ZIP_DOWNLOAD = 702,
  VERIFY_G_DRIVE_ALL_DOWNLOAD = 703,

  DownloadFilesFromExcel_Via_Front_End = 61,
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
  GenExcelOfGoogleDriveLinkForRenameFilesExcel = 83,
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
  MoveToFreeze_FOR_UPLOAD_ID = 110,
  DownloadArchivePdfs = 12,
  DownloadAllArchiveItemsViaExcel = 121,
  DownloadAllGDriveItemsViaExcel = 122,
  VANITIZE = 100,
  RENAME_FIES_VIA_EXCEL = 101,

  GET_FIRST_N_PAGES_PYTHON = 200,
  COPY_ALL_PDFS_PYTHON = 200300,
  GET_FIRST_N_PAGES_GRADLE = 200200,
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
  BL_EAP_WORK = 214,

  AI_TEXT_IDENTIFIER = 215,

  CONVERT_MULTIPLE_TXT_FILE_SCRIPTS = 216,
  CONVERT_TEXT_SCRIPT = 217
}

export enum Tif2PdfExecType {
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
  const dataUserInput2Mandatory = replaceQuotes(data.userInputSecond || "")?.trim();
  const dataUserInput3NonMandatory = replaceQuotes(data.userInputThird || "")?.trim();
  console.log(`data.userInput ${dataUserInput} 
  dataUserInput2 ${dataUserInput2Mandatory}
  dataUserInput3 ${dataUserInput3NonMandatory}
  `);

  if (execType >= 1000 && execType < 2000) {
    const execAsString = execType.toString()
    _resp = await launchArchiveExcelDownload(dataUserInput, dataUserInput2Mandatory,
      dataUserInput3NonMandatory, execAsString[1] === "1", execAsString[2] === "1", execAsString[3] === "1");
  }

  else if (execType >= 2000 && execType <= 2111) {
    _resp = await handleYarnListingGeneration(execType, dataUserInput);
  }

  else if (execType >= 9000 && execType <= 9110) {
    const execAsString = execType.toString()

    _resp = await makePostCallForCreateUploadableExcelV1({
      profiles: dataUserInput,
      script: dataUserInput3NonMandatory,
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
        const optionalParams = dataUserInput3NonMandatory?.trim() === "" ? {} : {
          subjectDesc:
            dataUserInput3NonMandatory
        }
        console.log(`optionalParams ${JSON.stringify(optionalParams)} dataUserInput3NonMandatory${dataUserInput3NonMandatory}`)
        _resp = await launchUploader(dataUserInput, optionalParams);
        break;

      case ExecType.UploadPdfsViaExcelV1:
        _resp = await _launchGradlev2(
          {
            profile: dataUserInput,
            excelPath: dataUserInput2Mandatory,
            uploadCycleId: dataUserInput3NonMandatory
          }, "launchUploaderViaExcelV1");
        break;

      case ExecType.UploadPdfsViaExcelV3:
        _resp = await _launchGradlev2(
          {
            profiles: dataUserInput,
            excelPaths: dataUserInput2Mandatory,
            range: dataUserInput3NonMandatory
          }, "launchUploaderViaExcelV3");
        break;

      case ExecType.REUPLOAD_USING_JSON:
        _resp = await _launchGradlev2({
          gradleArgs: `'${dataUserInput}','${dataUserInput3NonMandatory}'`,
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
          gradleArgs: `${dataUserInput} # '${dataUserInput2Mandatory} '`,
        }, "launchUploaderViaAbsPath");
        break;

      case ExecType.MoveFolderContents:
        _resp = await launchYarnQaToDestFileMover({
          qaPath: dataUserInput,
          "dest": data.userInputSecond || "",
          flatten: true
        });
        break;

      case ExecType.MoveMultipleFilesAsCSVtoFolderOrProfile:
        console.log(`dataUserInput ${dataUserInput} 
          dataUserInput2Mandatory ${dataUserInput2Mandatory}`)
        _resp = await makePostCallWithErrorHandling({
          profileOrFolder: dataUserInput,
          absPathsAsCSV: dataUserInput2Mandatory,
        },
          `fileUtil/moveFilesAsCSVOfAbsPaths`,);
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

      case ExecType.DWNLD_PDFS_ONLY_FROM_GOOGLE_DRIVE:
        _resp = await launchGoogleDriveDownload(dataUserInput, dataUserInput2Mandatory);
        break;

      case ExecType.DWNLD_ZIPS_ONLY_FROM_GOOGLE_DRIVE:
        _resp = await launchGoogleDriveZipDownload(dataUserInput, dataUserInput2Mandatory);
        break;

      case ExecType.DWNLD_ALL_FROM_GOOGLE_DRIVE:
        _resp = await launchAllFromGoogleDriveDownload(dataUserInput, dataUserInput2Mandatory);
        break;

      case ExecType.VERIFY_G_DRIVE_PDF_DOWNLOAD:
        _resp = await verifyGDriveDwnldSuccessFolders(dataUserInput, dataUserInput2Mandatory, PDF_TYPE);
        break;

        case ExecType.VERIFY_G_DRIVE_ZIP_DOWNLOAD:
          _resp = await verifyGDriveDwnldSuccessFolders(dataUserInput, dataUserInput2Mandatory, ZIP_TYPE);
          break;

          case ExecType.VERIFY_G_DRIVE_ALL_DOWNLOAD:
            _resp = await verifyGDriveDwnldSuccessFolders(dataUserInput, dataUserInput2Mandatory, ALL_TYPE);
            break;
      
      case ExecType.UNZIP_ALL_FILES:
        _resp = await unzipFolders(dataUserInput);
        break;

      case ExecType.VERIFY_UNZIP_ALL_FILES:
        _resp = await verifyUnzipFolders(dataUserInput);
        break;

      case ExecType.MERGE_PDFS_MERGE_ALL:
        _resp = await makePostCallWithErrorHandling({
          folder: dataUserInput,
          mergeType: "MERGE_ALL",
        }, `execLauncher/mergePdfsGradleVersion`)
        break;

      case ExecType.MERGE_PDFS_MERGE_PER_FOLDER:
        _resp = await makePostCallWithErrorHandling({
          folder: dataUserInput,
          mergeType: "MERGE_PER_FOLDER",
        }, `execLauncher/mergePdfsGradleVersion`)
        break;

      case ExecType.VERIFY_IMG_TO_PDF_SUCCESS_ANY:
        _resp = await verifyImgToPdfSuccess(dataUserInput, IMG_TYPE_ANY)
        break;

      case ExecType.VERIFY_IMG_TO_PDF_SUCCESS_JPG:
        _resp = await verifyImgToPdfSuccess(dataUserInput, IMG_TYPE_JPG)
        break;

      case ExecType.VERIFY_IMG_TO_PDF_SUCCESS_PNG:
        _resp = await verifyImgToPdfSuccess(dataUserInput, IMG_TYPE_PNG)
        break;

      case ExecType.VERIFY_IMG_TO_PDF_SUCCESS_TIF:
        _resp = await verifyImgToPdfSuccess(dataUserInput, IMG_TYPE_TIF)
        break;

      //unimplemented  
      case ExecType.DownloadFilesFromExcel_Via_Front_End:
        _resp = await downloadFromExcelUsingFrontEnd(dataUserInput, dataUserInput2Mandatory);
        break;


      case ExecType.DirectoryCompare:
        _resp = await makePostCallWithErrorHandling({
          "srcDir": dataUserInput,
          "destDir": dataUserInput2Mandatory,
        }, `yarn/compareDirectories`);
        break;

      case ExecType.GenExcelOfGoogleDriveLinkPdfOnly:
        _resp = await makePostCallForGenExcelForGDrive({
          "googleDriveLink": dataUserInput,
          "folderName": data.userInputSecond || "D:\\",
          "reduced": false,
          "allNotJustPdfs": false
        }, `gDrive/getGoogleDriveListingAsExcel`);
        break;

      case ExecType.GenExcelOfGoogleDriveLinkForAll:
        _resp = await makePostCallForGenExcelForGDrive({
          "googleDriveLink": dataUserInput,
          "folderName": data.userInputSecond || "D:\\",
          "reduced": false,
          "ignoreFolder": "",
          "allNotJustPdfs": true,
        }, `gDrive/getGoogleDriveListingAsExcel`);
        break;

      case ExecType.GenExcelOfGoogleDriveLinkForReduced:
        _resp = await makePostCallForGenExcelForGDrive({
          "googleDriveLink": dataUserInput,
          "folderName": data.userInputSecond || "D:\\",
          "reduced": true,
          "allNotJustPdfs": false
        }, `gDrive/getGoogleDriveListingAsExcel`);
        break;

      case ExecType.GenExcelOfGoogleDriveLinkForRenameFilesExcel:
        _resp = await makePostCallForGenExcelForGDrive({
          "googleDriveLink": dataUserInput,
          "folderName": data.userInputSecond || "D:\\",
          "reduced": false,
          "pdfRenamerXlV2": true,
          "allNotJustPdfs": false
        }, `gDrive/getGoogleDriveListingAsExcel`);
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
          flatten: true,
          ignorePaths: ["dont"]
        });
        break;

      case ExecType.MoveToFreeze_FOR_UPLOAD_ID:
        _resp = await launchYarnMoveToFreezeByUploadId({
          profileAsCSV: dataUserInput,
          flatten: true,
          ignorePaths: ["dont"]
        });
        break;

      case ExecType.GET_FIRST_N_PAGES_PYTHON:
        _resp = await makePostCallForTopN({
          srcFolders: dataUserInput,
          destRootFolder: dataUserInput2Mandatory,
          nPages: dataUserInput3NonMandatory,
        }, `pythonScripts/getFirstAndLastNPages`);
        break;
        
        case ExecType.COPY_ALL_PDFS_PYTHON:
          _resp = await makePostCallForTopN({
            srcFolders: dataUserInput,
            destRootFolder: dataUserInput2Mandatory,
            nPages: dataUserInput3NonMandatory,
          }, `pythonScripts/copyAllPdfs`);
          break;
        
        //deprecated
        case ExecType.GET_FIRST_N_PAGES_GRADLE:
          _resp = await makePostCallWithErrorHandling({
            srcFolders: dataUserInput,
            destRootFolder: dataUserInput2Mandatory,
            nPages: dataUserInput3NonMandatory,
          }, `execLauncher/getFirstAndLastNPagesGradle`)
          break;

      case ExecType.FILE_NAME_LENGTH:
        _resp = await makePostCallWithErrorHandling({
          folder: dataUserInput,
          topN: dataUserInput2Mandatory,
          includePathInCalc: false
        },
          `fileUtil/topLongFileNames`,);
        break;


      case ExecType.FILE_NAME_LENGTH_INCLUDING_PATH:
        _resp = await makePostCallWithErrorHandling({
          folder: dataUserInput,
          topN: dataUserInput2Mandatory,
          includePathInCalc: true
        },
          `fileUtil/topLongFileNames`,);
        break;

      case ExecType.DUPLICATES_BY_FILE_SIZE:
        _resp = await makePostCallWithErrorHandling({
          folder1: dataUserInput,
          folder2: dataUserInput2Mandatory,
          findDisjoint: false
        },
          `fileUtil/findByFileSize`,);
        break;

      case ExecType.DISJOINT_SET_BY_FILE_SIZE:
        _resp = await makePostCallWithErrorHandling({
          folder1: dataUserInput,
          folder2: dataUserInput2Mandatory,
          findDisjoint: true
        },
          `fileUtil/findByFileSize`,);
        break;

      case ExecType.RENAME_NON_ASCII_FILE_NAMES_IN_FOLDER:
        _resp = await makePostCallWithErrorHandling({
          folder: dataUserInput,
          script: dataUserInput2Mandatory,
        },
          `fileUtil/renameNonAsciiFiles`,);
        break;

      case ExecType.JPG_TO_PDF:
        _resp = await launchImgFilesToPdf(dataUserInput, "JPG");
        break;

      case ExecType.PNG_TO_PDF:
        _resp = await launchImgFilesToPdf(dataUserInput, "PNG");
        break;

      case ExecType.TIFF_TO_PDF:
        _resp = await launchImgFilesToPdf(dataUserInput, "TIF");
        break;

      case ExecType.TIFF_TO_PDF:
          _resp = await launchImgFilesToPdf(dataUserInput, "CR2");
          break;
          
      case ExecType.ANY_IMG_TYPE_TO_PDF:
        _resp = await launchImgFilesToPdf(dataUserInput, "ANY");
        break;

      case ExecType.COMBINE_GDRIVE_AND_REDUCED_PDF_DRIVE_EXCELS:
        _resp = await makePostCallForCombineGDriveAndReducedPdfExcels(
          {
            mainExcelPath: dataUserInput,
            secondaryExcelPath: dataUserInput2Mandatory,
            destExcelPath: dataUserInput3NonMandatory,
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
          source:dataUserInput3NonMandatory
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
        }, `uploadCycle/getUploadQueueUploadUsheredMissed`);
        break;


      case ExecType.MARK_AS_UPLOADED_ENTRIES_IN_ARCHIVE_EXCEL:
        _resp = await makePostCallWithErrorHandling({
          pathOrUploadCycleId: dataUserInput,
          archiveExcelPath: dataUserInput2Mandatory,
        }, `yarnArchive/markAsUploadedEntriesInArchiveExcel`);
        break;

      case ExecType.DownloadArchivePdfs:
        _resp = await launchArchivePdfDownload(dataUserInput, dataUserInput2Mandatory)
        break;

      case ExecType.DownloadAllArchiveItemsViaExcel:
        _resp = await launchAllArchiveItemsDownloadViaExcel(dataUserInput, dataUserInput2Mandatory)
        break;

      case ExecType.DownloadAllGDriveItemsViaExcel:
        _resp = await downloadGDriveItemsViaExcel(dataUserInput, dataUserInput2Mandatory)
        break;

      case ExecType.VANITIZE:
        _resp = await launchVanitizeModule(dataUserInput, dataUserInput3NonMandatory)
        break;

      case ExecType.RENAME_FIES_VIA_EXCEL:
        _resp = await makePostCallWithErrorHandling({
          excelPath: dataUserInput,
          folderOrProfile: dataUserInput2Mandatory,
        }, `fileUtil/renameFilesViaExcel`);
        break;

      case ExecType.COMPARE_UPLOADS_VIA_EXCEL_V1_WITH_ARCHIVE_ORG:
        _resp = await makePostCallWithErrorHandling({
          profileName: dataUserInput,
          mainExcelPath: dataUserInput2Mandatory,
          archiveExcelPath: dataUserInput3NonMandatory,
        },
          `yarnArchive/compareUploadsViaExcelV1WithArchiveOrg`);
        break;

      case ExecType.COMPARE_UPLOADS_VIA_EXCEL_V3_WITH_ARCHIVE_ORG:
        _resp = await makePostCallWithErrorHandling({
          profileName: dataUserInput,
          mainExcelPath: dataUserInput2Mandatory,
          archiveExcelPath: dataUserInput3NonMandatory,
        },
          `yarnArchive/compareUploadsViaExcelV3WithArchiveOrg`);
        break;

      case ExecType.COMPARE_G_DRIVE_AND_LOCAL_EXCEL:
        _resp = await makePostCallForGDriveExcelTrack({
          gDriveExcel: dataUserInput,
          localExcel: dataUserInput2Mandatory,
        },
          `googleDriveDB/compareGDriveAndLocalExcel`);
        break;

      case ExecType.UPLOAD_MISSED_TO_GDRIVE:
        _resp = await makePostCallWithErrorHandling({
          diffExcel: dataUserInput,
          gDriveRoot: dataUserInput2Mandatory,
        },
          `googleDriveDB/uploadToGDriveBasedOnDiffExcel`);
        break;

      case ExecType.BL_EAP_WORK:
        _resp = await makePostCallWithErrorHandling({
          profileName: dataUserInput,
          excelOutputName: dataUserInput3NonMandatory,
        },
          `yarnArchive/generateEapExcelV1`);
        break;

      case ExecType.AI_TEXT_IDENTIFIER:
        _resp = await makePostCallWithErrorHandling({
          profileName: dataUserInput,
          folderPath: dataUserInput2Mandatory,
        },
          `ai/renamePdfsWithAI`);
        break;

      case ExecType.CONVERT_MULTIPLE_TXT_FILE_SCRIPTS:
        _resp = await makePostCallWithErrorHandling({
          folderPath: dataUserInput,
          scriptFrom: dataUserInput2Mandatory,
          scriptTo: dataUserInput3NonMandatory,
        },
          `fileUtil/convertMultipleTxtFileEncodings`);
        break;


      case ExecType.CONVERT_TEXT_SCRIPT:
        _resp = await makePostCallWithErrorHandling({
          text: dataUserInput,
          scriptFrom: dataUserInput2Mandatory,
          scriptTo: dataUserInput3NonMandatory,
        },
          `fileUtil/convertScript`);
        break;

      default:
        _resp = {}
        // Handle unknown execType value
        break;
    }
  }
  return _resp;
}