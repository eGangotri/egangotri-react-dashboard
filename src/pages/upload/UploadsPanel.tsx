import React, { useState } from "react";
import UploadItem from "pages/upload/UploadItem";
import Stack from "@mui/material/Stack";
import TablePagination from '@mui/material/TablePagination';

type UploadType = {
  items: Item[];
  forQueues:boolean
};

const UploadsPanel: React.FC<UploadType> = ({ items, forQueues = false }) => {
  const [page, setPage] = useState(10);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Stack spacing="2">
    <TablePagination
      component="div"
      count={100}
      page={page}
      onPageChange={handleChangePage}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={handleChangeRowsPerPage}
/>
      <table>
        <thead>
          <tr key="0">
            <th>Index</th>
            <th>Upload CycleId</th>
            <th>ArchiveProfile</th>
            <th>Title</th>
            <th>Datetime Upload Started</th>
            {!forQueues && <th>Archive Url</th> }
            <th>Upload Link</th>
            <th>Local Path</th>
            <th>Csv Name</th>
            <th>createdAt</th>
            <th>Rerun</th>
          </tr>
        </thead>
        <tbody>
          {items?.length > 0
            ? items?.slice(rowsPerPage)?.map((item: Item) => {
                return <UploadItem item={item} key={item._id} forQueues={forQueues} />;
              })
            : ""}
        </tbody>
      </table>
    </Stack>
  );
};

export default UploadsPanel;
