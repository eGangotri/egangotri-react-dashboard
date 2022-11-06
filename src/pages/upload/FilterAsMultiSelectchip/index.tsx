import * as React from "react";
import { Theme, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";

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
  const [profileName, setprofileName] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof profileName>) => {
    const {
      target: { value },
    } = event;
    // On autofill we get a stringified value.
    const _profiles = typeof value === "string" ? value.split(",") : value;
    setprofileName(_profiles);
    setFilteredProfiles(_profiles);
  };

  return (
    <Box sx={{margin: "20px 0px"}}>
      <FormControl sx={{ width: 300 }}>
        <InputLabel id="demo-multiple-chip-label">Filter By Profile</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={profileName}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Profiles" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {profiles.map((profile: string) => (
            <MenuItem
              key={profile}
              value={profile}
              style={getStyles(profile, profileName, theme)}
            >
              <Box sx={{ width: "250px" }}>{profile}</Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default FilterAsMultipleSelectChip;
