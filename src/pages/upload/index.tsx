import React, { useState, useEffect } from "react";
import Item from "model/Item";
import UploadsPanel from "pages/upload/UploadsPanel";
import FilterAsMultipleSelectChip from "pages/upload/FilterAsMultiSelectchip";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import FilterByTime from "./FilterByTime";
import {
  getUploadStatusData,
  getUploadStatusDataByProfile,
} from "service/UploadDataRetrievalService";
import { getArchiveProfiles } from "./utils";
import { isAfter, isBefore } from "date-fns";

const Uploads: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [profiles, setProfiles] = useState<string[]>([]);

  //console.log(`Services Backend Server is ${getServer()}`);

  async function fetchMyAPI() {
    const uploadStatusData = await getUploadStatusData(100);
    //console.log(`uploadStatsuData?.length  ${uploadStatusData?.response?.length}`);
    setItems(uploadStatusData?.response || []);
  }

  useEffect(() => {
    (async () => {
      fetchMyAPI();
      console.log(`after getUploadStatusData ${JSON.stringify(items)}`);
      setProfiles(getArchiveProfiles(items));
    })();
  }, []);

  //  console.log(`after getUploadStatusData ${JSON.stringify(data.length)}`);

  const [uploadableItems, setUploadableItems] = useState<Item[]>(items);

  const [filteredProfiles, setFilteredProfiles] = useState<string[]>([]);

  const [startTimeValues, setStartTimeValues] = useState<Date>(new Date());
  const [endTimeValues, setEndTimeValues] = useState<Date>(new Date());

  const handleClick = (applyFilter:boolean) => {
    // 👇️ take parameter passed from Child component
    if(applyFilter){
      const _uploadableItems = uploadableItems.filter((item: Item) =>
      isAfter(new Date(item.datetimeUploadStarted),new Date(startTimeValues))
      && 
       isBefore(new Date(item.datetimeUploadStarted),new Date(endTimeValues), )
    );
    console.log("startTimeValues: " + startTimeValues + new Date(startTimeValues));
    console.log("endTimeValues: " + endTimeValues);
    console.log("applyFilter: " + applyFilter);
    setUploadableItems(_uploadableItems);
    }
    else{
      setUploadableItems(items);
    }
  };
  useEffect(() => {
    setProfiles(getArchiveProfiles(items));
    console.log(`profiles  ${profiles}`);
    //console.log(`items  ${items}`);

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
    <Stack spacing="2" sx={{ display: "flex" }}>
      <Box sx={{ justifyContent: "flexStart" }}>
        <FilterAsMultipleSelectChip
          profiles={profiles}
          setFilteredProfiles={setFilteredProfiles}
        />
        <FilterByTime
          setStartTimeValues={setStartTimeValues}
          setEndTimeValues={setEndTimeValues}
          handleClick={handleClick}
        />
      </Box>
      Uploads
      <UploadsPanel items={uploadableItems}></UploadsPanel>
    </Stack>
  );
};

export default Uploads;
