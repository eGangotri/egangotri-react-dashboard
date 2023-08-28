interface ItemListResponseType {
  response?: (Item)[] | null;
}

interface Item {
  "_id": number,
  "archiveProfile": string;
  "uploadLink": string;
  "localPath": string;
  "title": string;
  "csvName": string;
  "uploadCycleId": string;
  "datetimeUploadStarted": string;
  "archiveItemId"?: string;
  "__v": number,
  "createdAt": string;
  "updatedAt": string;
}

