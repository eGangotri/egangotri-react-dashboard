import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { ArchiveData } from './types';

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

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

interface ArchiveProfileSelectorProps {
  archiveProfiles: string[]
  setFilteredData: React.Dispatch<React.SetStateAction<ArchiveData[]>>
  filteredData: ArchiveData[]
}

const ArchiveProfileSelector: React.FC<ArchiveProfileSelectorProps> = ({ archiveProfiles, setFilteredData, filteredData }) => {

  const theme = useTheme();
  const [chosenArchiveProfiles, setChosenArchiveProfiles] = React.useState<string[]>([]);
  const [origFilteredData, setOrigFilteredData] = React.useState<ArchiveData[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof chosenArchiveProfiles>) => {
    const {
      target: { value },
    } = event;
    const _newChosenProfiles = typeof value === 'string' ? value.split(',') : value
    setChosenArchiveProfiles(
      // On autofill we get a stringified value.
      _newChosenProfiles
    );

    console.log(`chosenArhiveProfiles ${_newChosenProfiles} /${JSON.stringify(filteredData[0])}`)
    origFilteredData
    const _filteredData = filteredData.filter(item => _newChosenProfiles.includes(item.acct));
    console.log(`chosenArhiveProfiles ${_newChosenProfiles} /${JSON.stringify(_filteredData[0])}`)
    setFilteredData(_filteredData);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-chip-label">Chip</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={chosenArchiveProfiles}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected?.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {archiveProfiles.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, chosenArchiveProfiles, theme)}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default ArchiveProfileSelector;