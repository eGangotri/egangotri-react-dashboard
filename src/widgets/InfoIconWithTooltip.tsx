import React, { ReactElement } from "react";

import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { Box, IconButton } from "@mui/material";
import { FaCopy, FaInfoCircle } from "react-icons/fa";
import { blueGrey } from "@mui/material/colors";
import { ItemToolTipPropsType } from "./types";

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

const InfoIconWithTooltip: React.FC<ItemToolTipPropsType> = ({
  input,
}) => {
  return (
    <Tooltip title={input} arrow placement="right">
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <FaInfoCircle color="primary" />
      </Box>
    </Tooltip>
  );
};

export default InfoIconWithTooltip
