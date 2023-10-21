import React, { useState, useEffect } from "react";
import UploadsPanel from "pages/upload/UploadsPanel";
import FilterAsMultipleSelectChip from "pages/upload/FilterAsMultiSelectchip";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import * as _ from 'lodash';

import {
  getUploadStatusData,
} from "service/UploadDataRetrievalService";
import { getArchiveProfiles, validateArchiveUrls } from "./utils";
import { isAfter, isBefore } from "date-fns";
import { FaRegTrashAlt } from "react-icons/fa";

import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRange } from '@mui/x-date-pickers-pro';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import moment from 'moment';
import { DD_MM_YYYY_FORMAT } from "utils/utils";

import { MAX_ITEMS_LISTABLE } from "utils/constants";
import { useSearchParams } from 'react-router-dom'
import { SelectedUploadItem } from "mirror/types"

interface UploadsType {
  forQueues: boolean
}

const Uploads: React.FC<UploadsType> = ({ forQueues = false }) => {
  const [searchParams, _] = useSearchParams()

  const [profiles, setProfiles] = useState<string[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<string[]>([]);

  const [applyFilter, setApplyFilter] = useState<boolean>(false);

  const [uploadableItems, setUploadableItems] = useState<Item[]>([]);

  const [startTimeValues, setStartTimeValues] = useState<Date>(new Date());
  const [endTimeValues, setEndTimeValues] = useState<Date>(new Date());

  const [selectedRows, setSelectedRows] = useState<SelectedUploadItem[]>([]);


  const [selectedStartDate, setSelectedStartDate] = React.useState<string | null>(null);
  const [selectedEndDate, setSelectedEndDate] = React.useState<string | null>(null);

  const fetchMyAPI = async () => {
    const uploadCycleIdParam:string = searchParams.get('uploadCycleId') || "";
    const archiveProfileParam:string = searchParams?.get('archiveProfile') || "";
    const _profiles = archiveProfileParam?.length > 0 ? [archiveProfileParam] : filteredProfiles;

    const uploadStatusData: ItemListResponseType = await getUploadStatusData(MAX_ITEMS_LISTABLE,
      forQueues,
      uploadCycleIdParam,
      _profiles)
    return uploadStatusData?.response;
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
    (async () => {
      const _data = await fetchMyAPI() || [];
      setUploadableItems(_data);
      const uniqueProfiles = Array.from(new Set<string>(_data?.map(x => x.archiveProfile)));
      console.log(`uniqueProfiles: ${Array.from(uniqueProfiles)}`)
      setProfiles(uniqueProfiles)
      setFilteredProfiles(uniqueProfiles)
      console.log(`--filteredProfiles: ${profiles}`)
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const _data = await fetchMyAPI() || [];
      setUploadableItems(_data);
      console.log(`:filteredProfiles: ${profiles}`)
    })();
  }, [filteredProfiles]);

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
      </Box>

      <Typography variant="h4" sx={{ padding: "25px 0 25px 0" }}>Uploads[{uploadableItems?.length} ({selectedRows?.length} selected)]</Typography>
      <UploadsPanel
        items={uploadableItems}
        forQueues={forQueues}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}></UploadsPanel>
    </Stack>
  );
};

export default Uploads;
