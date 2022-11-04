import React from "react";
import Item from "model/Item";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { DAY_MONTH_YEAR_HOUR_MIN_FORMAT } from "utils/date-constants";
import format from "date-fns/format";

type UploadPropsType = {
  item: Item;
};

const DEFAULT_COUNT_FOR_ELLIPSIS = 20;

const ellipsis = (input: string, alphabetCount = DEFAULT_COUNT_FOR_ELLIPSIS) => {
  return input.length > alphabetCount
    ? `${input.substring(0, alphabetCount)}...`
    : input;
};

const reverseEllipsis = (input: string, alphabetCount = DEFAULT_COUNT_FOR_ELLIPSIS) => {
  return input.length > alphabetCount
    ? `...${input.substring(input.length - alphabetCount)}`
    : input;
};

type ItemToolTipPropsType = {
  input: string;
  alphabetCount?: number;
  reverse?: boolean;
  url?: boolean;
};

const ItemToolTip: React.FC<ItemToolTipPropsType> = ({
  input,
  alphabetCount = DEFAULT_COUNT_FOR_ELLIPSIS,
  reverse = false,
  url = false
}) => {
    const withEllipsis = reverse
    ? reverseEllipsis(input, alphabetCount)
    : ellipsis(input, alphabetCount)
  return (
    <Tooltip title={input} arrow placement="right">
      {url ? 
      <Link href={input} target="_blank">{withEllipsis}</Link>
      :<Typography>
        {withEllipsis}
      </Typography>}
    </Tooltip>
  );
};

const UploadItem: React.FC<UploadPropsType> = ({ item }) => {
  //console.log(`item ${JSON.stringify(props)} ${item}`);
  //direction: "rtl",

  return (
    <>
      <tr key={item._id}>
        <td>
          <ItemToolTip input={`${item._id}`} alphabetCount={5}/>
        </td>
        <td>{item.archiveProfile}</td>
        <td>
          <ItemToolTip input={item.uploadLink} url={true}/>
        </td>
        <td>
          <ItemToolTip input={item.localPath} reverse={true} />
        </td>
        <td>
          <ItemToolTip input={item.title} alphabetCount={50} />
        </td>
        <td>{item.csvName}</td>
        <td>{item.uploadCycleId}</td>
        <td>{format(new Date(item.datetimeUploadStarted), DAY_MONTH_YEAR_HOUR_MIN_FORMAT)}</td>
        <td>
          <button>Run Item # {item._id}</button>
        </td>
      </tr>
    </>
  );
};

export default UploadItem;
