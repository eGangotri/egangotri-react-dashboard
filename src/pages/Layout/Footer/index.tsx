import React from "react";
import { Typography, Box } from "@mui/material";

const Footer = () => {
    return (
        <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%"
        }}>
            <Typography variant="h5" className="text-turquoise-900">eGangotri Digital Preservation Trust</Typography>
        </Box>
    )
}
export default Footer