import React, { useState, useEffect } from "react";
import Item from "model/Item";
import UploadItem from "pages/upload/UploadItem";
import Stack from "@mui/material/Stack";

type UploadType = {
  items: Item[];
};

const UploadsPanel: React.FC<UploadType> = ({ items }) => {
  return (
    <Stack spacing="2">
      <table>
        <thead>
          <tr key="0">
            <th>Index</th>
            <th>ArchiveProfile</th>
            <th>Title</th>
            <th>Datetime Upload Started</th>
            <th>Upload Link</th>
            <th>Local Path</th>
            <th>Csv Name</th>
            <th>Upload CycleId</th>
            <th>createdAt</th>
            <th>Rerun</th>
          </tr>
        </thead>
        <tbody>
          {items?.length > 0
            ? items?.map((item: Item) => {
                return <UploadItem item={item} key={item._id} />;
              })
            : ""}
        </tbody>
      </table>
    </Stack>
  );
};

export default UploadsPanel;
