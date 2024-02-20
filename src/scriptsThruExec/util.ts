import { launchArchiveExcelDownload, launchBulkRename, launchGoogleDriveDownload, launchGoogleDriveExcelListing, launchGradleMoveToFreeze, launchLocalFolderListing, launchReverseMove, launchUploader, loginToArchive } from "service/launchGradle";
import { ExecComponentFormData, ExecResponse, ExecResponseDetails } from "./types";

export enum ExecType {
  UploadPdfs = 1,
  MoveFolderContents = 2,
  ReverseMove = 3,
  LoginToArchive = 4,
  UseBulkRenameConventions = 5,
  DownloadGoogleDriveLink = 6,
  GenExcelOfArchiveLink = 7,
  GenExcelOfGoogleDriveLink = 8,
  GenListingsofLocalFolder = 9,
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
    case ExecType.MoveFolderContents:
      _resp = await launchGradleMoveToFreeze(dataUserInput);
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
      _resp = await launchGoogleDriveExcelListing(dataUserInput);
      break;
    case ExecType.GenListingsofLocalFolder:
      _resp = await launchLocalFolderListing(dataUserInput);
      break;
    default:
      _resp = {}
      // Handle unknown execType value
      break;
  }
  return _resp;
}