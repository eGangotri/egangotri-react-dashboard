import React, { useState, useEffect } from "react";
import UploadsPanel from "pages/upload/UploadsPanel";
import FilterAsMultipleSelectChip from "pages/upload/FilterAsMultiSelectchip";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";


import {
  getUploadStatusData,
} from "service/UploadDataRetrievalService";
import { getArchiveProfiles, validateArchiveUrls } from "./utils";
import { isAfter, isBefore } from "date-fns";
import * as _ from 'lodash';
import { FaRegTrashAlt } from "react-icons/fa";

import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRange } from '@mui/x-date-pickers-pro';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import moment from 'moment';
import { DD_MM_YYYY_FORMAT } from "utils/utils";

interface UploadsType {
  forQueues: boolean
}

const Uploads: React.FC<UploadsType> = ({ forQueues = false }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [profiles, setProfiles] = useState<string[]>([]);
  const [applyFilter, setApplyFilter] = useState<boolean>(false);


  const [selectedStartDate, setSelectedStartDate] = React.useState<string | null>(null);
  const [selectedEndDate, setSelectedEndDate] = React.useState<string | null>(null);

  //console.log(`Services Backend Server is ${getServer()}`);

  async function fetchMyAPI() {
    const uploadStatusData: ItemListResponseType = await getUploadStatusData(100, forQueues);
    if (uploadStatusData?.response) {
      const _tmpFiltered = uploadStatusData?.response.filter((item: Item) => {
        return (item.uploadCycleId !== 'X' && !_.isEmpty(item.uploadCycleId));
      })
      //setItems(_tmpFiltered || []);
      console.log(`_tmpFiltered ${JSON.stringify(_tmpFiltered)}`);
    }
    console.log(`uploadStatusData?.length:  ${uploadStatusData?.response?.length}`);
    console.log(`uploadStatusData?.response: ${JSON.stringify(uploadStatusData?.response)}`);
    setItems(uploadStatusData?.response || []);
  }

  useEffect(() => {
    (async () => {
      await fetchMyAPI();
      console.log(`after getUploadStatusData ${JSON.stringify(items)}`);
      setProfiles(getArchiveProfiles(items));
    })();
  }, []);

  // console.log(`after getUploadStatusData ${JSON.stringify(data.length)}`);

  const [uploadableItems, setUploadableItems] = useState<Item[]>(items);

  const [filteredProfiles, setFilteredProfiles] = useState<string[]>([]);

  const [startTimeValues, setStartTimeValues] = useState<Date>(new Date());
  const [endTimeValues, setEndTimeValues] = useState<Date>(new Date());

  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const handleClick = () => {
    // 👇️ take parameter passed from Child component
    if (applyFilter) {
      const _uploadableItems = uploadableItems.filter((item: Item) =>
        isAfter(new Date(item.datetimeUploadStarted), new Date(startTimeValues))
        &&
        isBefore(new Date(item.datetimeUploadStarted), new Date(endTimeValues),)
      );
      console.log("startTimeValues: " + startTimeValues + new Date(startTimeValues));
      console.log("endTimeValues: " + endTimeValues);
      console.log("applyFilter: " + applyFilter);
      setUploadableItems(_uploadableItems);
    }
    else {
      setUploadableItems(items);
    }
  };

  const generateReport = async () => {
    console.log(`generateReport`);
    // setIsLoading(true);
    // if(_loggedUserRole === SUPERADMIN_ROLE || _loggedUserRole === ADMIN_ROLE){
    //     await sendFilteredFormToServerGet(operators, centers, selectedStartDate, selectedEndDate);
    // } 
    // else {
    //     await sendFilteredFormToServerGetForBasicUser(_loggedUser, selectedStartDate, selectedEndDate);
    // }
    // setIsLoading(false);
  }

  const [dayRangeValue, setDayRangeValue] = React.useState<DateRange<Dayjs | null>>([
    dayjs(null),
    dayjs(null),
  ]);

  const clearResults = () => {
    setDayRangeValue([
      dayjs(null),
      dayjs(null),
    ]);
    setSelectedStartDate(null);
    setSelectedEndDate(null);
  };

  const onDatePickerChange = (newDayRangeValue: DateRange<Dayjs>) => {
    console.log(`newValue ${newDayRangeValue[0]}`)
    const _newValue = moment(newDayRangeValue[0]?.toDate());
    setSelectedStartDate(_newValue.format(DD_MM_YYYY_FORMAT));
    console.log(`newValue ${newDayRangeValue[1]}`)
    setSelectedEndDate(moment(newDayRangeValue[1]?.toDate()).format(DD_MM_YYYY_FORMAT) || null);
    setDayRangeValue(newDayRangeValue);
  }
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
      </Box>
     
      <Box sx={{ justifyContent: "flexStart" }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DateRangePicker', 'DateRangePicker']}>
          <DemoItem label="Filter by Time: " component="DateRangePicker">
            <DateRangePicker
              sx={{ width: "500px" }}
              value={dayRangeValue}
              onChange={(newValue: DateRange<Dayjs>) => onDatePickerChange(newValue)}
            />
          </DemoItem>
        </DemoContainer>
      </LocalizationProvider>
      </Box>
     
      <Box sx={{ justifyContent: "flexStart", padding: "10px 0" }}>
      <Button
        variant="contained"
        endIcon={<FaRegTrashAlt style={{ color: "primary" }} />}
        onClick={() => clearResults()}
        sx={{ width: "100px", textAlign: "left", padding: "10px 10px 10px 10px" }}
      >
        Clear
      </Button>
      <Button
          sx={{ width: 300, color: "primary", marginLeft:"10px"}}
          onClick={() => validateArchiveUrls(selectedRows)}
          variant="contained"
          size="large">Validate All Archive URLs</Button>
      </Box>

      <Typography variant="h4" sx={{ padding: "25px 0 25px 0" }}>Uploads</Typography>
      <UploadsPanel
        items={uploadableItems}
        forQueues={forQueues}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}></UploadsPanel>
    </Stack>
  );
};

export default Uploads;
