import ProtectedRoute from 'ProtectedRoute';
import SimpleTabs from 'pages/tab/tab';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

export const LANDING_PAGE_PATH = "/"
export const DELIVERABLE_REPORTS_PATH = "/reports";
export const CATALOG_PATH = "/catalog";

const DWRRoutes: React.FC = () => (
    <Routes>
        <Route path="/test" element={<>TestAreaWithoutLayout</>} />
        <Route element={<ProtectedRoute />}>
            {<Route path={LANDING_PAGE_PATH} element={<SimpleTabs />} />}
            {/* {<Route path={DELIVERABLE_REPORTS_PATH} element={<DeliverableReports />} />}
            {<Route path={CATALOG_PATH} element={<CatalogReport />} />} */}
        </Route>
    </Routes>
);

export default DWRRoutes;
