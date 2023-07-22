import React, { useState } from "react";
import UploadItem from "pages/upload/UploadItem";
import Stack from "@mui/material/Stack";
import TablePagination from "@mui/material/TablePagination";
import { Checkbox } from "@mui/material";
import Button from "@mui/material/Button";
import { verifyUploadStatus } from "service/UploadDataRetrievalService";

type UploadType = {
  items: Item[];
  forQueues: boolean;
  selectedRows: number[];
  setSelectedRows: React.Dispatch<React.SetStateAction<number[]>>;
};

const UploadsPanel: React.FC<UploadType> = ({ items, forQueues = false, selectedRows, setSelectedRows }) => {
  const [page, setPage] = useState(10);
  const [rowsPerPage, setRowsPerPage] = useState(100);

  const _verifyUploadStatus = () => {
    console.log(` selectedRows ${selectedRows}`)
    verifyUploadStatus(selectedRows?.join(","))
  }

  const itemsSlicesByRowsPerPageLimit = items?.slice(0,rowsPerPage);
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
      <Button
        sx={{ width: 300, color: "primary" }}
        onClick={_verifyUploadStatus}
        variant="contained"
        size="large">Verify Upload Status</Button>
      <table>
        <thead>
          <tr key="0">
            <th>
              <Checkbox
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  console.log(`Header.target.checked ${e.target.checked} ${selectedRows?.length}`);
                  setSelectedRows(
                    e.target.checked
                      ? itemsSlicesByRowsPerPageLimit.map((item) => item._id)
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
