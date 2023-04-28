import React from "react";
import { Box } from "@mui/material";
import TransferList from "pages/widget/trransferList";
import { FilePicker } from "components/file-picker";

const FileMover: React.FC = () => {
  return (
    <Box>
      <TransferList />
      <div className="App">
      <FilePicker accept="*.*"uploadURL={"http://dlptest.com/http-post/"} />
      </div>
    </Box>
  );
};

export default FileMover;
