
export const getArchiveProfiles = (items: Item[]) => {
  const itemsAsSet = new Set(items?.map((item: Item) => item.archiveProfile));
  console.log(`itemsAsSet ${JSON.stringify(itemsAsSet)}`);
  return Array.from(itemsAsSet);
};
