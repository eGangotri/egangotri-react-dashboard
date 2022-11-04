import React from "react";
import Item from "model/Item";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

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
};

const ItemToolTip: React.FC<ItemToolTipPropsType> = ({
  input,
  alphabetCount = DEFAULT_COUNT_FOR_ELLIPSIS,
  reverse = false,
}) => {
  return (
    <Tooltip title={input} arrow placement="right">
      <Typography>
        {reverse
          ? reverseEllipsis(input, alphabetCount)
          : ellipsis(input, alphabetCount)}
      </Typography>
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
          <ItemToolTip input={item.uploadLink} />
        </td>
        <td>
          <ItemToolTip input={item.localPath} reverse={true} />
        </td>
        <td>
          <ItemToolTip input={item.title} />
        </td>
        <td>{item.csvName}</td>
        <td>{item.uploadCycleId}</td>
        <td>{item.datetimeUploadStarted}</td>
        <td>
          <button>Run Item # {item._id}</button>
        </td>
      </tr>
    </>
  );
};

export default UploadItem;
