import React from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

import Uploads from "pages/upload";

import GradleLauncher from "gradle/gradleLauncher";
import DataTable from "pages/widget/dataTable";
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

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

const SimpleTabs:React.FC = () => {

  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<any>, newValue: number) => {
    console.log(`event ${event}`)
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="Uploads (Ushered)" {...a11yProps(0)} />
          <Tab label="Uploads (Queued)" {...a11yProps(1)} />
          <Tab label="Gradle Launcher" {...a11yProps(2)} />
          <Tab label="Data Table" {...a11yProps(3)} />
          <Tab label="File Mover" {...a11yProps(4)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Uploads forQueues={false}/>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <Uploads forQueues={true}/>
      </TabPanel>

      <TabPanel value={value} index={2}>
        Gradle CLI
        <div>
          <GradleLauncher />
        </div>
      </TabPanel>

      <TabPanel value={value} index={3}>
        <DataTable />
      </TabPanel>

      <TabPanel value={value} index={4}>
        <FileMover />
      </TabPanel>
    </div>
  );
}

export default SimpleTabs
