import React from "react";

import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

const DEFAULT_COUNT_FOR_ELLIPSIS = 20;

const ellipsis = (
  input: string,
  alphabetCount = DEFAULT_COUNT_FOR_ELLIPSIS
) => {
  return input.length > alphabetCount
    ? `${input.substring(0, alphabetCount)}...`
    : input;
};

const reverseEllipsis = (
  input: string,
  alphabetCount = DEFAULT_COUNT_FOR_ELLIPSIS
) => {
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
  url = false,
}) => {
  const withEllipsis = reverse
    ? reverseEllipsis(input, alphabetCount)
    : ellipsis(input, alphabetCount);
  return (
    <Tooltip title={input} arrow placement="right">
      {url ? (
        <Link href={input} target="_blank">
          {withEllipsis}
        </Link>
      ) : (
        <Typography>{withEllipsis}</Typography>
      )}
    </Tooltip>
  );
};

export default ItemToolTip
