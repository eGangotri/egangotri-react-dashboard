import { launchBulkRename, launchGoogleDriveDownload, launchGradleMoveToFreeze, launchReverseMove, launchUploader, loginToArchive } from "service/launchGradle";

export enum ExecType {
  UploadPdfs = 1,
  MoveFolderContents = 2,
  ReverseMove = 3,
  LoginToArchive = 4,
  UseBulkRenameConventions = 5,
  DownloadGoogleDriveLink = 6,
}
export const invokeFuncBasedOnExecType = async (execType: ExecType, data: ExecComponentFormData) => {
  let _resp = {}
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
    default:
      // Handle unknown execType value
      break;
  }
}