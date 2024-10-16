import { Typography } from "@mui/material";
import React from "react";

const Header: React.FC<{ title: string }> = ({ title }) => {
    return (
        <header className="Header" style={{ textAlign: "center" }}>
            <Typography variant="h5" className="text-turquoise-900">{title}</Typography>
        </header>

    )
}

export default Header