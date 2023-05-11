export const getArchiveProfiles = (items: Item[]):string[] => {
  const itemsAsSet = new Set(items?.map((item: Item) => item.archiveProfile));
  console.log(`itemsAsSet ${JSON.stringify(itemsAsSet)}`);
  return Array.from(itemsAsSet);
};

export const validateArchiveUrls = (itemIds: number[]):void => {
  console.log(`validateArchiveUrls call to backend with ${itemIds.length} items`)
}