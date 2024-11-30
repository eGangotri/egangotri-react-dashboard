import React, { PropsWithChildren } from "react";

import Header from "./Header";
import Footer from "./Footer";
import {
    Box,
} from "@mui/material";
import TopPanel from "../../pages/TopPanel";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {

    return (
        <Box className="px-4 flex flex-col min-h-screen">
            <Header title="eGangotri Dashboard" />
            <TopPanel />
            <div className="flex-grow">
                {children}
            </div>
            <Footer />
        </Box>
    );
};

export default Layout;
