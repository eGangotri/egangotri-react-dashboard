import ProtectedRoute from 'ProtectedRoute';
import UploadCycles from 'pages/UploadCycles';
import Uploads from 'pages/upload';
import FileMover from 'pages/widget/fileMover';
import ExecLauncher from 'scriptsThruExec/ExecLauncher';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

export const LANDING_PAGE_PATH = "/"
export const UPLOADS_USHERED_PATH = "/uploadsUshered";
export const UPLOADS_QUEUED_PATH = "/uploadsQueued";
export const UPLOAD_CYCLES_PATH = "/uploadCycles";
export const EXEC_LAUNCHER_PATH = "/execLauncher";
export const FILE_MOVER_PATH = "/fileMover";

const DashboardRoutes: React.FC = () => (
    <Routes>
        <Route path="/test" element={<>TestAreaWithoutLayout</>} />
        <Route element={<ProtectedRoute />}>
            {<Route path={LANDING_PAGE_PATH} element={<UploadCycles />} />}
            {<Route path={UPLOADS_USHERED_PATH} element={<Uploads forQueues={false} />} />}
            {<Route path={UPLOADS_QUEUED_PATH} element={<Uploads forQueues={true} />} />}
            {<Route path={EXEC_LAUNCHER_PATH} element={<ExecLauncher />} />}
            {<Route path={FILE_MOVER_PATH} element={<FileMover />} />}
        </Route>
    </Routes>
);

export default DashboardRoutes;
