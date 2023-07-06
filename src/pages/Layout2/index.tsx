import React, { PropsWithChildren } from "react";

import Header from "./Header";
import Footer from "./Footer";
import {
    Box,
} from "@mui/material";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <><Header />
            {children}
            <Box className="footer">
                <Footer />
            </Box>
        </>
    );
};

export default Layout;
