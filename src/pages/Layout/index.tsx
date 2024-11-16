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
        <Box className="px-4 flex flex-col">
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
