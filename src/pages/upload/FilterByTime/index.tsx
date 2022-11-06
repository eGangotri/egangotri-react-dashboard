import React, { useState, KeyboardEvent } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { subDays } from "date-fns";
import { formatWithTInMiddle } from "utils/utils";
import { Height } from "@mui/icons-material";
import { PRIMARY_BLUE } from "constants/colors";
import { WIDTH_OF_WIDGETS } from "utils/constants";

const endTimeDefaultValue = formatWithTInMiddle(new Date(), false);
const startTimeDefaultValue = formatWithTInMiddle(subDays(new Date(), 30));

type FilterByTimePropType = {
  setStartTimeValues: React.Dispatch<React.SetStateAction<Date>>;
  setEndTimeValues: React.Dispatch<React.SetStateAction<Date>>;
  handleClick: (applyFilter:boolean) => void;
  applyFilter:boolean;
  setApplyFilter:React.Dispatch<React.SetStateAction<boolean>>;
};

const widgetStyles = { width: WIDTH_OF_WIDGETS, marginRight:"20px" };
const FilterByTime: React.FC<FilterByTimePropType> = ({
  setStartTimeValues,
  setEndTimeValues,
  handleClick,
  applyFilter,
  setApplyFilter
}) => {

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    start = true
  ) => {
    const { value } = event.target;

    console.log(`handleChange value ${value}`);

    start
      ? setStartTimeValues(new Date(value))
      : setEndTimeValues(new Date(value));
  };

  const toggleTimeFilter = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    // const value = event.target.value;
    // console.log(`toggleTimeFilter value ${value}`);
    const newApplyFilter = !applyFilter;
    handleClick(newApplyFilter)
    setApplyFilter(newApplyFilter);
  };

  return (
    <Box sx={{display:"flex", justifyContent:"flex-start", flexDirection:"row"}}>
      <TextField
        id="datetime-local"
        label="Start Time"
        type="datetime-local"
        defaultValue={startTimeDefaultValue}
        sx={widgetStyles}
        onChange={(e) =>
         { console.log( typeof e);
          handleChange(e)}
        }
        InputLabelProps={{
          shrink: true,
        }}
      />

      <TextField
        id="datetime-local-end"
        label="End Time"
        type="datetime-local"
        defaultValue={endTimeDefaultValue}
        sx={widgetStyles}
        onChange={(e) => handleChange(e,false)} 
        InputLabelProps={{
          shrink: true,
        }}
      />

      <Button variant="contained" onClick={e=> toggleTimeFilter(e)} 
      
      sx={{...widgetStyles, height:"50px", backgroundColor:PRIMARY_BLUE}}
      >
        {(applyFilter ? "Apply" : "Remove") + " Date Filter"}
      </Button>
    </Box>
  );
};

export default FilterByTime;
