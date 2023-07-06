import { Box, Stack, Typography } from "@mui/material";
import React, { useRef, useState } from "react";

//import Icon from "components/common/Icons";



const Header = () => {
    return (
        <Box component="div">
            {/* <Icon icon="gangotri" height="100px" width="220px" /> */}
            <Typography variant="h3" sx={{paddingBottom:"30px"}}>eGangotri Daily Work Report</Typography>
        </Box>
    )
}
export default Header