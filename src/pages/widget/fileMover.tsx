import React from "react";
import { Box } from "@mui/material";
import TransferList from "pages/widget/trransferList";

const FileMover: React.FC = () => {
  return (
    <Box>
      <TransferList />
      <div className="App">
        {//https://retool.com/blog/building-a-file-picker-component-in-react/
        //https://codesandbox.io/s/filepicker-new-forked-3mipw9?ref=retool.com&file=/src/logo.svg
        }
      </div>
    </Box>
  );
};

export default FileMover;
