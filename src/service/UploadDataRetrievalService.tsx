import { backendServer } from "utils/constants";

const QUEUE_API_PREFIX = "itemsQueued";
const USHERED_API_PREFIX = "itemsushered";

const chooseApiPrefix = (forQueues = false) => {
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
    const data = await response.json();
    return data;
  }
  catch (err) {
    return {
      error: err
    };
  }
};

export const getUploadStatusData = async (limit: number, forQueues = false) => {
  const resource =
    backendServer + `${chooseApiPrefix(forQueues)}/list?limit=${limit}`;
  const result = await makeGetCall(resource);
  return result;
};

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
  return result?.response;
};

export const verifyUploadStatus = async (
  dataAsCSV: string,
  forQueues = false
) => {
  const resource =
    backendServer +
    `${chooseApiPrefix(forQueues)}/verifyUploadStatus`;
  const result = await makePostCall({
    verifiableUploads: dataAsCSV
  }, resource);
  return result;
};

