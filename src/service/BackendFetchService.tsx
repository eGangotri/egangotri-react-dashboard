import { MAX_ITEMS_LISTABLE, backendServer } from "utils/constants";
import * as _ from 'lodash';
import { SelectedUploadItem } from "mirror/types"
import { ExecResponseDetails } from "scriptsThruExec/types";
import { makePostCall } from "mirror/utils";
const QUEUE_API_PREFIX = "itemsQueued";
const USHERED_API_PREFIX = "itemsushered";

export const chooseApiPrefix = (forQueues = false) => {
  return forQueues ? QUEUE_API_PREFIX : USHERED_API_PREFIX;
};

export const makeGetCall = async (resource: string) => {
  try {
    const response = await fetch(resource);
    console.log(`response ${JSON.stringify(response)}`);
    const respAsJson = await response.json();
    console.log(`respAsJson ${respAsJson.length}`);
    return respAsJson;
  }
  catch (err) {
    return {
      error: err
    };
  }
};


export const makePostCallWithErrorHandling = async (body: Record<string, unknown>, resource: string) => {
  const result = await makePostCall(body, backendServer + resource)
  const _result = result.response;
  console.log(`_result ${JSON.stringify(_result)}`)
  return {
    ...result
  } as ExecResponseDetails;
}

export const makePostCallForGenExcelForGDrive = async (body: Record<string, unknown>, resource: string) => {
  const result = await makePostCallWithErrorHandling(body, resource)
  let excelName = result?.["0"]?.excelName;
  console.log(`excelName ${excelName}`)
  if (excelName !== undefined) {
    // Store value
    localStorage.setItem('gDriveExcelName', excelName);
  }
  // Retrieve value
  let gDriveExcelName = localStorage.getItem('gDriveExcelName');
  console.log(`gDriveExcelName: ${gDriveExcelName}`);
  return result;
}

export const makePostCallForGenExcelForLocal = async (body: Record<string, unknown>, resource: string) => {
  const result = await makePostCallWithErrorHandling(body, resource)
  let excelName = result?.["0"]?.excelName;
  console.log(`excelName ${excelName}`)
  // Store value
  localStorage.setItem('localListingExcelName', excelName);

  // Retrieve value
  let value = localStorage.getItem('localListingExcelName');

  console.log(value); // Outputs: value
  console.log(`localListingExcelName: ${value}`);

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
    backendServer + `${chooseApiPrefix(forQueues)}/list?limit=${limit}${uploadCycleIdFilter}${filteredProfilesFilter}`
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
    backendServer +
    `${chooseApiPrefix(forQueues)}/listByProfile?limit=${limit}`;
  const result = await makeGetCall(resource);
  return result;
};


export const getDataForUploadCycle = async (
  limit: number,
  forQueues = false
) => {
  const resource =
    backendServer +
    `${chooseApiPrefix(forQueues)}/listForUploadCycle?limit=${limit}`;
  const result = await makeGetCall(resource);
  return result?.response || [];
};

export const verifyUploadStatus = async (
  selectedUploadItems: SelectedUploadItem[],
  forQueues = false
) => {
  const resource =
    backendServer +
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
    backendServer +
    `${chooseApiPrefix(forQueues)}/verifyUploadStatus?limit=${MAX_ITEMS_LISTABLE}`;
  const result = await makePostCall({ uploadCycleIdForVerification: uploadCycleId },
    resource);
  return result.response
};

