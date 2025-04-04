import React, { ReactElement } from "react";

import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { Box, IconButton } from "@mui/material";
import { FaCopy } from "react-icons/fa";
import { blueGrey } from "@mui/material/colors";
import { ItemToolTipLabelPropsType, ItemToolTipPropsType } from "./types";

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

const ItemToolTipLabel: React.FC<ItemToolTipLabelPropsType> = ({ url, input, noEllipsis, withEllipsis
}) => {
  return (
    url ? (
      <Link href={input} target="_blank">
        {noEllipsis ? input : withEllipsis}
      </Link>
    ) : (
      <Typography>{noEllipsis ? input : withEllipsis}</Typography>
    )
  );
}

const ItemToolTip: React.FC<ItemToolTipPropsType> = ({
  input,
  alphabetCount = DEFAULT_COUNT_FOR_ELLIPSIS,
  reverse = false,
  url = false,
  noEllipsis = false,
  reactComponent
}) => {
  const withEllipsis = reverse
    ? reverseEllipsis(input, alphabetCount)
    : ellipsis(input, alphabetCount);
  return (
    <Tooltip title={input} arrow placement="right">
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <ItemToolTipLabel url={url} input={input} noEllipsis={noEllipsis} withEllipsis={withEllipsis} />
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
          reactComponent && <Box component="span" sx={{ paddingLeft: "5px", backgroundColor: blueGrey }}>{reactComponent}</Box>
        }
      </Box>
    </Tooltip>
  );
};

export default ItemToolTip
