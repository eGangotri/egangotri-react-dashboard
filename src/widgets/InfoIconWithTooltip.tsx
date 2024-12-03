import React, { ReactElement } from "react";

import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { Box, IconButton } from "@mui/material";
import { FaCopy, FaInfoCircle } from "react-icons/fa";
import { blueGrey } from "@mui/material/colors";
import { ItemToolTipPropsType } from "./types";

const InfoIconWithTooltip: React.FC<ItemToolTipPropsType> = ({
  input,
}) => {
  return (
    <Tooltip title={input} arrow placement="right">
      <Box className="flex items-center m-1">
        <FaInfoCircle color="primary" />
      </Box>
    </Tooltip>
  );
};

export default InfoIconWithTooltip
