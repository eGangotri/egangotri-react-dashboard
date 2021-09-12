import React, { useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Uploads from '../upload/Uploads';
import {getUploadStatusData} from '../service/UploadDataRetrievalService';
import {useEffect} from "react";
import Item from '../model/Item';


interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
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

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function SimpleTabs() {
  const [data, setData] = useState<Item[]>([]);
  
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };
  console.log(`before getUploadStatusData`)

  useEffect(() => {
    async function fetchMyAPI() {
        setData(await getUploadStatusData());
      }
      fetchMyAPI();
    }, []);
    console.log(`after getUploadStatusData ${JSON.stringify(data)}`)

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="Uploads" {...a11yProps(0)} />
          <Tab label="Gradle" {...a11yProps(1)} />
          <Tab label="Misc" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
      <Uploads items={data}></Uploads>
      </TabPanel>

      <TabPanel value={value} index={1}>
        Gradle CLI
      </TabPanel>

      <TabPanel value={value} index={2}>
        Misc
      </TabPanel>
    </div>
  );
}
