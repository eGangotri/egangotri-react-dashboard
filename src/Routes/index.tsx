import ProtectedRoute from 'ProtectedRoute';
import GradleLauncher from 'gradle/gradleLauncher';
import UploadCycles from 'pages/UploadCycles';
import Uploads from 'pages/upload';
import FileMover from 'pages/widget/fileMover';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

export const LANDING_PAGE_PATH = "/"
export const UPLOADS_USHERED = "/uploadsUshered";
export const UPLOADS_QUEUED = "/uploadsUshered";
export const UPLOAD_CYCLES = "/uploadCycles";
export const GRADLE_LAUNCHER_PATH = "/gradleLauncher";
export const FILE_MOVER_PATH = "/fileMover";

const DWRRoutes: React.FC = () => (
    <Routes>
        <Route path="/test" element={<>TestAreaWithoutLayout</>} />
        <Route element={<ProtectedRoute />}>
            {<Route path={LANDING_PAGE_PATH} element={<Uploads forQueues={false}/>} />}
            {<Route path={UPLOADS_USHERED} element={<Uploads forQueues={false}/>} />}
            {<Route path={UPLOADS_QUEUED} element={<Uploads forQueues={true}/>} />}
            {<Route path={UPLOAD_CYCLES} element={<UploadCycles />} />}
            {<Route path={GRADLE_LAUNCHER_PATH} element={<GradleLauncher />} />}
            {<Route path={FILE_MOVER_PATH} element={<FileMover />} />}
        </Route>
    </Routes>
);

export default DWRRoutes;
