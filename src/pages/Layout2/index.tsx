import React, { PropsWithChildren } from "react";

import Header from "./Header";
import Footer from "./Footer";
import {
    Box,
} from "@mui/material";
import TopPanel from "pages/TopPanel";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <>
        <Header title="eGangotri Dashboard"/>
        <TopPanel />
            {children}
            <Box className="footer">
                <Footer />
            </Box>
        </>
    );
};

export default Layout;
