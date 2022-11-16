import React from "react";
import { DAY_MONTH_YEAR_HOUR_MIN_FORMAT } from "utils/date-constants";
import format from "date-fns/format";
import ItemToolTip from "./ItemTooltip";

type UploadPropsType = {
  item: Item;
  forQueues:boolean;
};


const UploadItem: React.FC<UploadPropsType> = ({ item, forQueues = false }) => {
  //console.log(`item ${JSON.stringify(props)} ${item}`);
  //direction: "rtl",
  const archiveLink = `https://archive.org/details/${item?.archiveItemId}`
  return (
    <>
      <tr key={item._id}>
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
        {!forQueues && 
        <td>
        {item.archiveItemId &&
        <ItemToolTip input={archiveLink} url={true} />
        }
        </td> }

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
    </>
  );
};

export default UploadItem;
