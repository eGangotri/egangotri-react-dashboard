import React, { useState, useEffect } from "react";
import Item from "model/Item";
import UploadsPanel from "pages/upload/UploadsPanel";
import FilterAsMultipleSelectChip from "pages/upload/FilterAsMultiSelectchip";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import FilterByTime from "./FilterByTime";


type UploadType = {
  items: Item[];
};

const Uploads: React.FC<UploadType> = ({ items }) => {

  console.log(`props  ${items.length}`);
  //console.log(`Services Backend Server is ${getServer()}`);
  
    const profiles = Array.from(
      new Set(items?.map((item: Item) => item.archiveProfile))
    );

  const [uploadableItems, setUploadableItems] = useState<Item[]>(items);

  const [filteredProfiles, setFilteredProfiles] = useState<string[]>([]);

  const [timeValues, setTimeValues] = useState<Date[]>([]);
  console.log(`profiles  ${profiles}`);

  useEffect(() => {
    if (filteredProfiles.length) {
      const _uploadableItems = items.filter((item: Item) =>
        filteredProfiles.includes(item.archiveProfile)
      );
      setUploadableItems(_uploadableItems);
      console.log(`_uploadableItems${_uploadableItems.length}`);
      console.log(`uploadableItems${uploadableItems.length}`);
      console.log(`filteredProfiles${filteredProfiles}`);
    } else {
      setUploadableItems(items);
    }
  }, [items, filteredProfiles]);

  return (
    <Stack spacing="2" sx={{display:"flex"}}>
      <Box sx={{justifyContent:"flexStart"}}>
        <FilterAsMultipleSelectChip
        profiles={profiles}
        setFilteredProfiles={setFilteredProfiles}
      />
      <FilterByTime setTimeValues={setTimeValues}/>
      </Box>
      Uploads
      <UploadsPanel items={uploadableItems}></UploadsPanel>
    </Stack>
  );
};

export default Uploads;
