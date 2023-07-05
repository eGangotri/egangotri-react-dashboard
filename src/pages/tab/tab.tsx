import React from "react";
import { Tabs, Tab, Typography, Box, AppBar, Theme } from "@mui/material";

import Uploads from "pages/upload";
import UploadCycles from 'pages/UploadCycles';
import GradleLauncher from "gradle/gradleLauncher";
import FileMover from "pages/widget/fileMover";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const SimpleTabs:React.FC = () => {

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<any>, newValue: number) => {
    console.log(`event ${event}`)
    setValue(newValue);
  };

  return (
    <div>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="eGangotri-react-Dashboard"
          sx={{
            color:"blueviolet",
            "& button.Mui-selected" : {color:"white"}
          }}
        >
          <Tab label="Uploads (Ushered)" {...a11yProps(0)} />
          <Tab label="Uploads (Queued)" {...a11yProps(1)} />
          <Tab label="Upload Cycle Tables" {...a11yProps(2)} />
          <Tab label="Gradle Launcher" {...a11yProps(3)} />
          <Tab label="Data Table" {...a11yProps(4)} />
          <Tab label="File Mover" {...a11yProps(5)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Uploads forQueues={false}/>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <Uploads forQueues={true}/>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <UploadCycles/>
      </TabPanel>
      <TabPanel value={value} index={3}>
        Gradle CLI
        <div>
          <GradleLauncher />
        </div>
      </TabPanel>

      <TabPanel value={value} index={4}>
        <FileMover />
      </TabPanel>
    </div>
  );
}

export default SimpleTabs
