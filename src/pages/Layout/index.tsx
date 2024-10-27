import React, { PropsWithChildren } from "react";

import Header from "./Header";
import Footer from "./Footer";
import {
    Box,
} from "@mui/material";
import TopPanel from "pages/TopPanel";
import { useRecoilState } from "recoil";
import { loginToken } from "pages/Dashboard";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {

    return (
        <Box sx={{paddingLeft:"40px"}}>
        <Header title="eGangotri Dashboard"/>
        <TopPanel />
            {children}
            <Box className="footer">
                <Footer />
            </Box>
        </Box>
    );
};

export default Layout;
