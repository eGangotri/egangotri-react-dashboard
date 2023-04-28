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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name: string, profileName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      profileName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

type FilterAsMultipleSelectChipPropsType = {
  profiles: string[];
  setFilteredProfiles: React.Dispatch<React.SetStateAction<string[]>>;
};

const FilterAsMultipleSelectChip: React.FC<
  FilterAsMultipleSelectChipPropsType
> = ({ profiles, setFilteredProfiles }) => {
  const theme = useTheme();
  const [profileNames, setprofileNames] = React.useState<string[]>([]);

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
    <Box sx={{margin: "20px 0px"}}>
      <FormControl sx={{ width: WIDTH_OF_WIDGETS }}>
        <InputLabel id="demo-multiple-checkbox-label">Filter By Profile</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={profileNames}
          onChange={handleChange}
          input={<OutlinedInput label="Profiles" />}
          // renderValue={(selected) => (
          //   <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          //     {selected.map((value) => (
          //       <Chip label={value} onDelete={handleDelete} />
          //     ))}
            
          //   </Box>

          // )}
          renderValue={(selected) => {
            console.log(`selected ${selected}`) 
            return "";//selected.join(', ')
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
              <Box sx={{ width: "250px" }}>{profile}</Box>
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
