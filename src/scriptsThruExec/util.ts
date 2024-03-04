import {
  addHeaderFooter, launchArchiveExcelDownload, launchBulkRename,
  launchGoogleDriveDownload, launchGoogleDriveExcelListing, launchGradleMoveToFreeze,
  launchLocalFolderListingForAll,
  launchLocalFolderListingForPdf,
  launchReverseMove, launchUploader, launchYarnQaToDestFileMover, loginToArchive
} from "service/launchGradle";
import { ExecComponentFormData, ExecResponse, ExecResponseDetails } from "./types";

export enum ExecType {
  UploadPdfs = 1,
  MoveFolderContents_PROFILE = 21,
  MoveFolderContents_PATH = 22,
  ReverseMove = 3,
  LoginToArchive = 4,
  UseBulkRenameConventions = 5,
  DownloadGoogleDriveLink = 6,
  GenExcelOfArchiveLink = 7,
  GenExcelOfGoogleDriveLink = 8,
  GenListingsofLocalFolderAsPdf = 91,
  GenListingsofLocalFolderAsAll = 92,
  AddHeaderFooter = 10,
  MoveToFreeze = 11,
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
  console.log(`data.userInput ${dataUserInput}`);

  switch (execType) {
    case ExecType.UploadPdfs:
      _resp = await launchUploader(dataUserInput);
      break;

    case ExecType.MoveFolderContents_PROFILE:
      _resp = await launchYarnQaToDestFileMover({
        "qaPath": dataUserInput,
        "dest": data.userInputSecond || "",
        profile: "true",
        flatten: "true"
      });
      break;

    case ExecType.MoveFolderContents_PATH:
      _resp = await launchYarnQaToDestFileMover({
        qaPath: dataUserInput,
        "dest": data.userInputSecond || "",
        profile: "false",
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
      const dataUserInput2 = data.userInputSecond || "";
      _resp = await launchGoogleDriveDownload(dataUserInput, dataUserInput2);
      break;
    case ExecType.GenExcelOfArchiveLink:
      _resp = await launchArchiveExcelDownload(dataUserInput);
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
      _resp = await launchGradleMoveToFreeze(dataUserInput)
      break;
    default:
      _resp = {}
      // Handle unknown execType value
      break;
  }
  return _resp;
}