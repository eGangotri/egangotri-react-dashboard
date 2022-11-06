import { backendServer } from "utils/constants";

const QUEUE_API_PREFIX = "itemsQueued";
const USHERED_API_PREFIX = "itemsushered";

const chooseApiPrefix = (forQueues = false) => {
  return forQueues ? QUEUE_API_PREFIX : USHERED_API_PREFIX;
};

export const makeGetCall = async (resource: string) => {
  const response = await fetch(resource);
  console.log(`response ${JSON.stringify(response)}`);
  const respAsJson = await response.json();
  console.log(`respAsJson ${respAsJson.length}`);
  return respAsJson;
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
