import * as React from "react";
import { Theme, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import { WIDTH_OF_WIDGETS } from "utils/constants";
import { MenuProps } from "utils/widgetUtils";


type FilterAsMultipleSelectChipPropsType = {
  profiles: string[];
  setFilteredProfiles: React.Dispatch<React.SetStateAction<string[]>>;
};

const FilterAsMultipleSelectChip: React.FC<
  FilterAsMultipleSelectChipPropsType
> = ({ profiles, setFilteredProfiles }) => {
  const theme = useTheme();
  const [profileNames, setprofileNames] = React.useState<string[]>(profiles);

  const handleChange = (event: SelectChangeEvent<typeof profileNames>) => {
    const {
      target: { value },
    } = event;
    // On autofill we get a stringified value.
    const _profiles = typeof value === "string" ? value.split(",") : value;
    console.log(`handleChange:_profiles ${_profiles}`)
    setprofileNames(_profiles);
    setFilteredProfiles(_profiles);
  };

  return (
    <Box sx={{ margin: "20px 0px" }}>
      <FormControl sx={{ width: WIDTH_OF_WIDGETS }}>
        <InputLabel id="demo-multiple-checkbox-label">Filter By Profile</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={profileNames}
          onChange={handleChange}
          input={<OutlinedInput label="Profiles" />}
          renderValue={(selected) => {
            return selected.join(', ')
          }
          }
          MenuProps={MenuProps}
        >
          {profiles.map((profile: string) => (
            <MenuItem
              key={profile}
              value={profile}
              style={getStyles(profile, profileNames, theme)}
            >
              <Checkbox checked={profileNames.indexOf(profile) > -1} />
              <ListItemText primary={profile} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default FilterAsMultipleSelectChip;
