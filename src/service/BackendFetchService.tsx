import { AI_SERVER, getBackendServer, MAX_ITEMS_LISTABLE } from "utils/constants";
import * as _ from 'lodash';
import { SelectedUploadItem } from "mirror/types"
import { ExecResponseDetails } from "scriptsThruExec/types";
import { makePostCall } from "mirror/utils";
import { ALL_NOT_JUST_PDF_SUFFIX, COMBINATION_EXCEL_PATH_LOCAL_STORAGE_KEY, GDRIVE_EXCEL_NAME_LOCAL_STORAGE_KEY, LOCAL_LISTING_EXCEL_LOCAL_STORAGE_KEY, REDUCED_SUFFIX, TOP_N_FILE_LOCAL_STORAGE_KEY, UPLOADABLE_EXCELS_V1, UPLOADABLE_EXCELS_V1_PROFILES, UPLOADABLE_EXCELS_V3, UPLOADABLE_EXCELS_V3_PROFILES } from "./consts";
const QUEUE_API_PREFIX = "itemsQueued";
const USHERED_API_PREFIX = "itemsushered";

export const chooseApiPrefix = (forQueues = false) => {
  return forQueues ? QUEUE_API_PREFIX : USHERED_API_PREFIX;
};

export const makeGetCall = async (resource: string) => {
  try {
    const response = await fetch(getBackendServer() + resource);
    console.log(`response ${JSON.stringify(response)}`);
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    else {
      console.log(`response not ok ${response.statusText}`)
      return {
        success: false,
        error: response.statusText
      };
    }
  }
  catch (error) {
    const err = error as Error;
    console.log(`catch err ${err.message}`)
    return {
      success: false,
      error: "Exception thrown. May be Backend Server down." + err.message
    };
  }
};


export const makePostCallWithErrorHandling = async (body: Record<string, unknown>, resource: string) => {
  const result = await makePostCall(body, resource)
  console.log(`result.response ${JSON.stringify(result.response)}`)

  return {
    ...result
  } as ExecResponseDetails;
}





export const makePostCallForGenExcelForGDrive = async (body: Record<string, unknown>, resource: string) => {
  const result = await makePostCallWithErrorHandling(body, resource)
  const response = result?.response;
  const _reduced = response?.reduced === "Yes";
  const _allNotJustPdfs = response?.allNotJustPdfs === "Yes";

  console.log(`makePostCallForGenExcelForGDrive: ${JSON.stringify(result)} 
  _reduced ${_reduced} _allNotJustPdfs ${_allNotJustPdfs}`)
  let excelName = response?.["0"]?.excelName;

  let localStorageKey = GDRIVE_EXCEL_NAME_LOCAL_STORAGE_KEY;
  if (_reduced) {
    localStorageKey = localStorageKey + REDUCED_SUFFIX;
  }
  if (_allNotJustPdfs) {
    localStorageKey = localStorageKey + ALL_NOT_JUST_PDF_SUFFIX;
  }

  console.log(`makePostCallForGenExcelForGDrive:excelName ${excelName} for storing in ${localStorageKey}`)
  if (excelName !== undefined) {
    // Store value
    localStorage.setItem(localStorageKey, excelName);
  }
  // Retrieve value
  let gDriveExcelName = localStorage.getItem(localStorageKey);
  console.log(`gDriveExcelName: ${gDriveExcelName}`);
  return result;
}

export const makePostCallForGenExcelForLocal = async (body: Record<string, unknown>, resource: string) => {
  const result = await makePostCallWithErrorHandling(body, resource)
  let excelName = result?.["0"]?.excelName;
  console.log(`excelName ${excelName}`)
  // Store value
  localStorage.setItem(LOCAL_LISTING_EXCEL_LOCAL_STORAGE_KEY, excelName);

  // Retrieve value
  let value = localStorage.getItem(LOCAL_LISTING_EXCEL_LOCAL_STORAGE_KEY);

  console.log(value); // Outputs: value
  console.log(`${LOCAL_LISTING_EXCEL_LOCAL_STORAGE_KEY}: ${value}`);

  return result;
}

export const makePostCallForTopN = async (body: Record<string, unknown>, resource: string) => {
  const result = await makePostCallWithErrorHandling(body, resource)
  let dumpFolder = result?.response?._results?.dumpFolder;

  console.log(`dumpFolder ${dumpFolder}`)
  // Store value
  localStorage.setItem(TOP_N_FILE_LOCAL_STORAGE_KEY, dumpFolder);

  // Retrieve value
  let value = localStorage.getItem(TOP_N_FILE_LOCAL_STORAGE_KEY);

  console.log(`destRootFolder: ${value}`);

  return result;
}

export const makePostCallForCreateUploadableExcelV1 = async (body: Record<string, unknown>, resource: string) => {
  const result = await makePostCallWithErrorHandling(body, resource)
  let excels = result?.response?.excelFileNames;
  let profiles = result?.response?.profiles;
  console.log(`excelName ${excels}`);

  // Store value
  localStorage.setItem(UPLOADABLE_EXCELS_V1, excels);
  localStorage.setItem(UPLOADABLE_EXCELS_V1_PROFILES, profiles);

  // Retrieve value
  let value = localStorage.getItem(UPLOADABLE_EXCELS_V1);
  let value2 = localStorage.getItem(UPLOADABLE_EXCELS_V1_PROFILES);

  console.log(`${UPLOADABLE_EXCELS_V1} ${value} ${UPLOADABLE_EXCELS_V1_PROFILES} ${value2}`);
  return result;
}

export const makePostCallForCreateUploadableExcelV3 = async (body: Record<string, unknown>, resource: string) => {
  const result = await makePostCallWithErrorHandling(body, resource)
  let excels = result?.response?.excelFileNames;
  let profiles = result?.response?.profiles;
  console.log(`excelName ${excels}`)
  // Store value
  localStorage.setItem(UPLOADABLE_EXCELS_V3, excels);
  localStorage.setItem(UPLOADABLE_EXCELS_V3_PROFILES, profiles);

  // Retrieve value
  let value = localStorage.getItem(UPLOADABLE_EXCELS_V3);
  let value2 = localStorage.getItem(UPLOADABLE_EXCELS_V3_PROFILES);

  console.log(`${UPLOADABLE_EXCELS_V3} ${value} ${UPLOADABLE_EXCELS_V3_PROFILES} ${value2}`);

  return result;
}


export const makePostCallForCombineGDriveAndReducedPdfExcels = async (body: Record<string, unknown>, resource: string) => {
  const result = await makePostCallWithErrorHandling(body, resource)
  let excelName = result?.response?._results?.xlsxFileNameWithPath;
  console.log(`excelName ${excelName}`)
  // Store value
  localStorage.setItem(COMBINATION_EXCEL_PATH_LOCAL_STORAGE_KEY, excelName);

  // Retrieve value
  let value = localStorage.getItem(COMBINATION_EXCEL_PATH_LOCAL_STORAGE_KEY);

  console.log(`${COMBINATION_EXCEL_PATH_LOCAL_STORAGE_KEY} ${value}`);

  return result;
}



export const makePostCallForGDriveExcelTrack = async (body: Record<string, unknown>, resource: string) => {
  const result = await makePostCallWithErrorHandling(body, resource);

  let excelName = result?.response?.excelName;
  console.log(`excelName ${JSON.stringify(excelName)}`)
  // Store value
  if (excelName) {
    localStorage.setItem('gDriveIntegrityCheckExcel', excelName);
    // Retrieve value
    let value = localStorage.getItem('gDriveIntegrityCheckExcel');
    console.log(`gDriveIntegrityCheckExcel: ${value}`);
  }
  return result;
}

export const getUploadStatusData = async (limit: number,
  forQueues = false,
  uploadCycleId = "",
  filteredProfiles: string[] = []) => {
  const uploadCycleIdFilter = _.isEmpty(uploadCycleId) ? "" : `&uploadCycleId=${uploadCycleId}`
  const filteredProfilesFilter = _.isEmpty(filteredProfiles) ? "" : `&archiveProfile=${filteredProfiles.join(",")}`
  const resource =
    `${chooseApiPrefix(forQueues)}/list?limit=${limit}${uploadCycleIdFilter}${filteredProfilesFilter}`
  const result = await makeGetCall(resource);
  return result;
};
export const getUploadStatusDataForQueues = async (limit: number,
  uploadCycleId = "",
  filteredProfiles: string[] = []) => {
  return getUploadStatusData(limit, true, uploadCycleId, filteredProfiles)
}

export const getUploadStatusDataForUshered = async (limit: number,
  uploadCycleId = "",
  filteredProfiles: string[] = []) => {
  return getUploadStatusData(limit, false, uploadCycleId, filteredProfiles)

}

export const getUploadStatusDataByProfile = async (
  limit: number,
  forQueues = false
) => {
  const resource =
    `${chooseApiPrefix(forQueues)}/listByProfile?limit=${limit}`;
  const result = await makeGetCall(resource);
  return result;
};


export const getDataForUploadCycle = async (
  limit: number,
  forQueues = false
) => {
  const resource =
    `${chooseApiPrefix(forQueues)}/listForUploadCycle?limit=${limit}`;
  const result = await makeGetCall(resource);
  return result?.response || [];
};

export const verifyUploadStatus = async (
  selectedUploadItems: SelectedUploadItem[],
  forQueues = false
) => {
  const resource =
    `${chooseApiPrefix(forQueues)}/verifyUploadStatus?limit=${MAX_ITEMS_LISTABLE}`;
  const result = await makePostCall({ uploadsForVerification: [...selectedUploadItems] },
    resource);
  return result.response
};

export const verifyUploadStatusForUploadCycleId = async (
  uploadCycleId: string,
  forQueues = false
) => {
  const resource =
    `${chooseApiPrefix(forQueues)}/verifyUploadStatus?limit=${MAX_ITEMS_LISTABLE}`;
  const result = await makePostCall({ uploadCycleIdForVerification: uploadCycleId },
    resource);
  return result.response
};

export const deleteUploadCycleById = async (
  uploadCycleId: string
) => {
  const result =
    await makePostCallWithErrorHandling({
      "uploadCycleId": uploadCycleId,
    }, `uploadCycle/deleteUploadCycleById`);

  return result;
};

