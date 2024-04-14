import { MAX_ITEMS_LISTABLE, backendServer } from "utils/constants";
import * as _ from 'lodash';
import { SelectedUploadItem } from "mirror/types"
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

export const makePostCall = async (body: Record<string, unknown>, resource: string) => {
  const requestOptions: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };

  try {
    const response = await fetch(resource, requestOptions);
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    else {
      return {
        error: {
          status: response.status,
          statusText: response?.statusText
        }
      }
    }
  }
  catch (err) {
    return {
      error: err
    };
  }
};

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

