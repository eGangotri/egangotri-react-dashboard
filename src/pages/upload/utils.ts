import { SelectedUploadItem } from "mirror/types"

export const getArchiveProfiles = (items: Item[]): string[] => {
  const itemsAsSet = new Set(items?.map((item: Item) => item.archiveProfile));
  console.log(`itemsAsSet ${JSON.stringify(itemsAsSet)}`);
  return Array.from(itemsAsSet);
};

export const validateArchiveUrls = (itemIds: SelectedUploadItem[]): void => {
  console.log(`validateArchiveUrls call to backend with ${itemIds.length} items`)
}

export const itemToSelectedUploadItem = (item: Item, isValid = true) => {
  return {
    id: item._id,
    archiveId: `${item.archiveItemId}`,
    isValid
  } as SelectedUploadItem
}