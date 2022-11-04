import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { subDays } from "date-fns";
import { formatWithTInMiddle } from "utils/utils";

const endTimeDefaultValue = formatWithTInMiddle(new Date(), false);
const startTimeDefaultValue = formatWithTInMiddle(subDays(new Date(), 30));

type FilterByTimePropTime = {
    setTimeValues:  React.Dispatch<React.SetStateAction<Date[]>>
}

const FilterByTime: React.FC<FilterByTimePropTime> = ({setTimeValues}) => {
  const [applyTimeFilter, setApplyTimeFilter] = useState<boolean>(true);
  const handleChange = () => {
    console.log("...")
    setApplyTimeFilter(!applyTimeFilter);
    setTimeValues([]);
  }

  return (
    <Stack component="form" noValidate spacing={3}>
      <TextField
        id="datetime-local"
        label="Start Time"
        type="datetime-local"
        defaultValue={startTimeDefaultValue}
        sx={{ width: 250 }}
        InputLabelProps={{
          shrink: true,
        }}
      />

      <TextField
        id="datetime-local2"
        label="End Time"
        type="datetime-local"
        defaultValue={endTimeDefaultValue}
        sx={{ width: 250 }}
        InputLabelProps={{
          shrink: true,
        }}
      />

      <Button variant="contained" onClick={handleChange}>
        {(applyTimeFilter?"Apply":"Remove") + "Date Filter"}
      </Button>
    </Stack>
  );
};

export default FilterByTime;
