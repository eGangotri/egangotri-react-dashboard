import { backendServer } from "utils/constants";

export const makeGetCall = async (resource: string) => {
  const response = await fetch(resource);
  console.log(`response ${JSON.stringify(response)}`);
  const respAsJson = await response.json();
  console.log(`respAsJson ${respAsJson.length}`);
  return respAsJson;
};

export const getUploadStatusData = async (limit: number) => {
  const resource = backendServer + `itemsQueued/list?limit=${limit}`;
  const result = await makeGetCall(resource);
  return result
};


export const getUploadStatusDataByProfile = async (limit: number) => {
  const resource = backendServer + `itemsQueued/listByProfile?limit=${limit}`;
  const result = await makeGetCall(resource);
  return result};

export async function getUploadStatusData3() {
  const resource = backendServer + "itemsQueued/list?limit=1";
  const result = await makeGetCall(resource);
  return result
}
