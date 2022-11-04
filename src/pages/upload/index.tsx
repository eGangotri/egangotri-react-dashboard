import React, { useState, useEffect } from "react";
import Item from "model/Item";
import UploadsPanel from "pages/upload/UploadsPanel";
import FilterAsMultipleSelectChip from "./FilterAsMultiSelectchip";
import Stack from "@mui/material/Stack";

type UploadType = {
  items: Item[];
};

const Uploads: React.FC<UploadType> = ({ items }) => {

  console.log(`props  ${items.length}`);
  //console.log(`Services Backend Server is ${getServer()}`);

  const [uploadableItems, setUploadableItems] = useState<Item[]>(items);

  const profiles = Array.from(
    new Set(items?.map((item: Item) => item.archiveProfile))
  );

  const [filteredProfiles, setFilteredProfiles] = useState<string[]>([]);

  useEffect(() => {
    if (filteredProfiles.length) {
      const _uploadableItems = uploadableItems.filter((item: Item) =>
        filteredProfiles.includes(item.archiveProfile)
      );
      setUploadableItems(items);
      console.log(`_uploadableItems${_uploadableItems.length}`);
      console.log(`uploadableItems${uploadableItems.length}`);
      console.log(`filteredProfiles${filteredProfiles.length}`);
    } else {
      setUploadableItems(items);
    }
  }, [items, filteredProfiles]);

  return (
    <Stack spacing="2">
      <FilterAsMultipleSelectChip
        profiles={profiles}
        setFilteredProfiles={setFilteredProfiles}
      />
      Uploads
      <UploadsPanel items={uploadableItems}></UploadsPanel>
    </Stack>
  );
};

export default Uploads;
