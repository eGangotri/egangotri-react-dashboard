import { MAX_ITEMS_LISTABLE, backendServer } from "utils/constants";
import { chooseApiPrefix, makePostCall } from "./UploadDataRetrievalService";

export const reUploadOneItem = async (row: Item) => {
  const resource =
    backendServer +
    `${chooseApiPrefix(false)}/reUploadMissed?limit=${MAX_ITEMS_LISTABLE}`;
  const result = await makePostCall({
    itemsForReupload: [{
      archiveProfile: row.archiveProfile,
      localPath: row.localPath,
      uploadLink: row.uploadLink
    }]
  },
    resource);
  return result.response
};


export const uploadSingleItemViaGradle = async (row: Item) => {
  const uploadStatusData: ItemListResponseType = await reUploadOneItem(row);
  return uploadStatusData?.response;
}