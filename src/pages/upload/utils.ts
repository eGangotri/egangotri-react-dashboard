export const getArchiveProfiles = (items: Item[]) => {
  const itemsAsSet = new Set(items?.map((item: Item) => item.archiveProfile));
  console.log(`itemsAsSet ${JSON.stringify(itemsAsSet)}`);
  return Array.from(itemsAsSet);
};

export const validateArchiveUrls = (archiveUrls: string[] = 
  ["https://archive.org/details/HUIM_tajika-nilakanthi-satika-sodaharana-praramyate-sanskrit-1888-mumbai-sri-venkates1",
"https://archive.org/details/HUIM_tajika-nilakanthi-satika-sodaharana-praramyate-sanskrit-1888-mumbai-sri-venkates"]
  ) => {
  console.log("In Progress");
  const invalidItems: string[] = [];
  archiveUrls.forEach(async (archiveUrl: string) => {
    try {
      const res = await fetch(archiveUrl);
      console.log("status ", res.status)
    }
    catch (e) {
      invalidItems.push(archiveUrl);
      console.log("\nFailed Link (${MISSED_OUT_USHERED_ITEMS.size()} of $testableLinksCount): \"${entry.archiveLink}\" @ ${i}..")
    }
  })
}