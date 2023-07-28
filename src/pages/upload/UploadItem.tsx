import React, { useState } from "react";
import { DAY_MONTH_YEAR_HOUR_MIN_FORMAT } from "utils/date-constants";
import format from "date-fns/format";
import ItemToolTip from "./ItemTooltip";
import { Box, Checkbox } from "@mui/material";
import * as _ from "lodash";
import { createArchiveLink } from "mirror";
import { SelectedUploadItem } from "mirror/types"

type UploadPropsType = {
  item: Item;
  forQueues: boolean;
  selectedRows?: SelectedUploadItem[];
  setSelectedRows?: React.Dispatch<React.SetStateAction<SelectedUploadItem[]>>;
};

const UploadItem: React.FC<UploadPropsType> = ({
  item,
  forQueues = false,
  selectedRows = [],
  setSelectedRows = null,
}) => {
  //console.log(`item ${JSON.stringify(props)} ${item}`);
  //direction: "rtl",
  const archiveLink = createArchiveLink(item?.archiveItemId);


  const handleRowClick = (id: number, _checked: boolean) => {
    if (_checked) {
      if (setSelectedRows) {
        const selectedRow = {
          id,
          archiveId: `${item.archiveItemId}`
        }
        setSelectedRows([selectedRow, ...selectedRows]);
      }
    } else {
      if (setSelectedRows) {
        setSelectedRows(_.remove(selectedRows, (row) => row.id !== id));
      }
    }
    console.log(`_checked ${_checked} ${selectedRows.length}`)
  };

  const isSelected = (id: number) => {
    //console.log(`id ${id}`)
    return selectedRows.map(x=>x.id).includes(id);
  };

  const isErroneous = (id: number) => {
    return !_.isEmpty(selectedRows.find(x=>x.id === id && x.isError === true));
  };

  return (
    <Box sx={{ backgroundColor: `${isErroneous(item._id) ? "red" : ""}` }}>
      <tr key={item._id}>
        <td>
          <Checkbox
            checked={isSelected(item._id)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleRowClick(item._id, e.target.checked)
            }
          />
        </td>
        <td>
          <ItemToolTip input={`${item._id}`} alphabetCount={5} />
        </td>
        <td>{item.uploadCycleId}</td>
        <td>{item.archiveProfile}</td>
        <td>
          <ItemToolTip input={item.title} alphabetCount={50} />
        </td>
        <td>
          {format(
            new Date(item.datetimeUploadStarted),
            DAY_MONTH_YEAR_HOUR_MIN_FORMAT
          )}
        </td>
        {!forQueues && (
          <td>
            {item.archiveItemId && (
              <ItemToolTip input={archiveLink} url={true} />
            )}
          </td>
        )}

        <td>
          <ItemToolTip input={item.uploadLink} url={true} />
        </td>
        <td>
          <ItemToolTip input={item.localPath} reverse={true} />
        </td>
        <td>{item.csvName}</td>
        <td>
          <button>Run Item # {item._id}</button>
        </td>
      </tr>
    </Box>
  );
};

export default UploadItem;
