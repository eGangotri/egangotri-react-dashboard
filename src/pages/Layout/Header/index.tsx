import { Typography } from "@mui/material";
import React  from "react";

const Header: React.FC<{ title: string }> = ({ title }) => {
    return (
        <header style={{ textAlign: "center" }} className='Header'>
            <Typography variant="h5">{title}</Typography>
        </header>
    )
}

export default Header