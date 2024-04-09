import React, { ReactElement } from "react";

import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { Box, IconButton } from "@mui/material";
import { FaCopy } from "react-icons/fa";

const DEFAULT_COUNT_FOR_ELLIPSIS = 20;

export const ellipsis = (
  input: string | number,
  alphabetCount = DEFAULT_COUNT_FOR_ELLIPSIS
) => {
  const inputAsString = input?.toString();
  return inputAsString?.length > alphabetCount
    ? `${inputAsString?.substring(0, alphabetCount)}...`
    : input;
};

export const reverseEllipsis = (
  input: string,
  alphabetCount = DEFAULT_COUNT_FOR_ELLIPSIS
) => {
  return input.length > alphabetCount
    ? `...${input?.substring(input.length - alphabetCount)}`
    : input;
};

type ItemToolTipPropsType = {
  input: string;
  alphabetCount?: number;
  reverse?: boolean;
  url?: boolean;
  reactComponent?: ReactElement
};

const ItemToolTip: React.FC<ItemToolTipPropsType> = ({
  input,
  alphabetCount = DEFAULT_COUNT_FOR_ELLIPSIS,
  reverse = false,
  url = false,
  reactComponent
}) => {
  const withEllipsis = reverse
    ? reverseEllipsis(input, alphabetCount)
    : ellipsis(input, alphabetCount);
  return (
    <Tooltip title={input} arrow placement="right">
      <Box>
        {url ? (
          <Link href={input} target="_blank">
            {withEllipsis}
          </Link>
        ) : (
          <Typography>{withEllipsis}</Typography>
        )}
        <div className="flex items-center">
          <IconButton
            aria-label="copy"
            color="inherit"
            size="small"
            onClick={async () => {
              await navigator.clipboard.writeText(input);
            }}
          >
            <FaCopy fontSize="inherit" />
          </IconButton>
          {
            reactComponent && <span className="pl-3 border-red-500">{reactComponent}</span>
          }
        </div>
      </Box>
    </Tooltip>
  );
};

export default ItemToolTip
