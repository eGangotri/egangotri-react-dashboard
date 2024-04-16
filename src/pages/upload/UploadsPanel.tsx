import React, { useState } from "react";
import UploadItem from "pages/upload/UploadItem";
import Stack from "@mui/material/Stack";
import TablePagination from "@mui/material/TablePagination";
import { Alert, Box, Checkbox, Collapse, IconButton, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { verifyUploadStatus } from "service/BackendFetchService";
import { SelectedUploadItem } from "mirror/types"
import { itemToSelectedUploadItem } from "./utils";
import { FaCheck } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import Spinner from "widgets/Spinner";

import * as _ from 'lodash';
import { ERROR_RED, SUCCESS_GREEN } from "constants/colors";
import { GridCloseIcon } from "@mui/x-data-grid";

type UploadType = {
  items: Item[];
  forQueues: boolean;
  selectedRows: SelectedUploadItem[];
  setSelectedRows: React.Dispatch<React.SetStateAction<SelectedUploadItem[]>>;
};

const UploadsPanel: React.FC<UploadType> = ({ items, forQueues = false, selectedRows, setSelectedRows }) => {
  const [page, setPage] = useState(10);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [failCount, setFailCount] = useState(-1);
  const [alertOpen, setAlertOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const _verifyUploadStatus = async () => {
    setFailCount(-1);
    if(selectedRows.length === 0){
      setAlertOpen(true);
      return;
    }
    else {
      setAlertOpen(false);
    }
    setIsLoading(true);
    const result = await verifyUploadStatus(selectedRows);
    setIsLoading(false);
    setSelectedRows(result);
    const validResults = _.countBy(result, (row) => {
      return row.isValid ? 'success' : 'failure';
    });
    setFailCount(validResults.failure)
    console.log(`result ${JSON.stringify(result)}`);
  }

  const itemsSlicesByRowsPerPageLimit = items?.slice(0, rowsPerPage);
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Stack spacing="2">
      {isLoading && <Spinner />}

      <Box>
      <Collapse in={alertOpen}>
        <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setAlertOpen(false);
              }}
            >
              <GridCloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          Pls. check atleast one item to proceed with verification
        </Alert>
      </Collapse>
      <Button
          sx={{ width: 300, color: "primary" }}
          onClick={_verifyUploadStatus}
          variant="contained"
          size="large">Verify Upload Status</Button>
        <Box sx={{ display: `${failCount === -1 ? 'none' : 'inline'}` }}>
          <IconButton>
            {failCount > 0 ? <FaCheck color={ERROR_RED} /> : <FaTimes color={SUCCESS_GREEN} />}
          </IconButton>
          <Typography component="span" color={failCount > 0 ? ERROR_RED : SUCCESS_GREEN}>{failCount > 0 ? `(${failCount} item(s) failed verification)` : "All Checked Uploads were valid"}</Typography>
        </Box>
      </Box>
      <table>
        <thead>
          <tr key="0">
            <th>
              <Checkbox
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  console.log(`Header.target.checked ${e.target.checked} ${selectedRows?.length}`);
                  setSelectedRows(
                    e.target.checked
                      ? itemsSlicesByRowsPerPageLimit.map((item) => itemToSelectedUploadItem(item))
                      : []
                  );
                }}
              />
            </th>
            <th>Index</th>
            <th>Upload CycleId</th>
            <th>ArchiveProfile</th>
            <th>Title</th>
            <th>Datetime Upload Started</th>
            {!forQueues && <th>Archive Url</th>}
            <th>Upload Link</th>
            <th>Local Path</th>
            <th>Csv Name</th>
            <th>createdAt</th>
            <th>Rerun</th>
          </tr>
        </thead>
        <tbody>
          {items?.length > 0
            ? itemsSlicesByRowsPerPageLimit?.map((item: Item) => {
              return (
                <UploadItem
                  item={item}
                  key={item._id}
                  forQueues={forQueues}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                />
              );
            })
            : ""}
        </tbody>
      </table>
    </Stack>
  );
};

export default UploadsPanel;
