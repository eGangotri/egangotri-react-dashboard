import {
  launchGradleMoveToFreeze,
  launchLocalFolderListingForAll,
  launchLocalFolderListingForPdf, launchBulkRename,
  launchReverseMove, launchUploader, loginToArchive
} from "service/launchGradle";

import {
  addHeaderFooter,
  launchArchiveExcelDownload, launchArchivePdfDownload,
  launchGoogleDriveDownload, launchGoogleDriveExcelListing, launchVanitizeModule, launchYarnMoveToFreeze, launchYarnQaToDestFileMover
} from "service/launchYarn";

import { ExecComponentFormData, ExecResponse, ExecResponseDetails } from "./types";

export enum ExecType {
  UploadPdfs = 1,
  MoveFolderContents = 2,
  ReverseMove = 3,
  LoginToArchive = 4,
  UseBulkRenameConventions = 5,
  DownloadGoogleDriveLink = 6,
  GenExcelOfArchiveLink = 71,
  GenExcelOfArchiveLinkLimitedFields = 72,
  GenExcelOfGoogleDriveLink = 8,
  GenListingsofLocalFolderAsPdf = 91,
  GenListingsofLocalFolderAsAll = 92,
  AddHeaderFooter = 10,
  MoveToFreeze = 11,
  DownloadArchivePdfs = 12,
  VANITIZE = 100
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
  console.log(`data.userInput ${dataUserInput} dataUserInput2 ${dataUserInput2}`);

  switch (execType) {
    case ExecType.UploadPdfs:
      _resp = await launchUploader(dataUserInput);
      break;

    case ExecType.MoveFolderContents:
      _resp = await launchYarnQaToDestFileMover({
        qaPath: dataUserInput,
        "dest": data.userInputSecond || "",
        flatten: "true"
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
    case ExecType.GenExcelOfArchiveLink:
      _resp = await launchArchiveExcelDownload(dataUserInput, false);
      break;
    case ExecType.GenExcelOfArchiveLinkLimitedFields:
      _resp = await launchArchiveExcelDownload(dataUserInput, true);
      break;
    case ExecType.GenExcelOfGoogleDriveLink:
      _resp = await launchGoogleDriveExcelListing(dataUserInput, data.userInputSecond || "D:\\");
      break;
    case ExecType.GenListingsofLocalFolderAsPdf:
      _resp = await launchLocalFolderListingForPdf(dataUserInput);
      break;

    case ExecType.GenListingsofLocalFolderAsAll:
      _resp = await launchLocalFolderListingForAll(dataUserInput);
      break;
    case ExecType.AddHeaderFooter:
      _resp = await addHeaderFooter(dataUserInput);
      break;
    case ExecType.MoveToFreeze:
      _resp = await launchYarnMoveToFreeze({
        profileAsCSV: "dataUserInput",        
        flatten: "true"
      });
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