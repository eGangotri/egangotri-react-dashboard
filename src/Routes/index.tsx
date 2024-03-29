import ProtectedRoute from 'ProtectedRoute';
import UploadCycles from 'pages/UploadCycles';
import Uploads from 'pages/upload';
import FileMover from 'pages/widget/fileMover';
import ExecLauncher from 'scriptsThruExec/ExecLauncher';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ExecLauncherTwo from 'scriptsThruExec/ExecLauncherTwo';
import TallyUploadedData from 'scriptsThruExec/TallyUploadedData';
import Tiff2Pdf from 'scriptsThruExec/Tiff2Pdf';
import AITextIdentifier from 'scriptsThruExec/AITextIdentifier';

export const LANDING_PAGE_PATH = "/"
export const UPLOADS_USHERED_PATH = "/uploadsUshered";
export const UPLOADS_QUEUED_PATH = "/uploadsQueued";
export const UPLOAD_CYCLES_PATH = "/uploadCycles";
export const EXEC_LAUNCHER_PATH = "/execLauncher";
export const EXEC_LAUNCHER_TWO_PATH = "/execLauncher2";
export const TALLY_UPLOADED_DATA = "/tallyData";
export const FILE_MOVER_PATH = "/fileMover";
export const TIFF_2_PDF = "/tiff2pdf";
export const AI_TEXT_IDENTIFIER = "/ai";
const DashboardRoutes: React.FC = () => (
    <Routes>
        <Route path="/test" element={<>TestAreaWithoutLayout</>} />
        <Route element={<ProtectedRoute />}>
            {<Route path={LANDING_PAGE_PATH} element={<UploadCycles />} />}
            {<Route path={UPLOADS_USHERED_PATH} element={<Uploads forQueues={false} />} />}
            {<Route path={UPLOADS_QUEUED_PATH} element={<Uploads forQueues={true} />} />}
            {<Route path={EXEC_LAUNCHER_PATH} element={<ExecLauncher />} />}
            {<Route path={EXEC_LAUNCHER_TWO_PATH} element={<ExecLauncherTwo />} />}
            {<Route path={TALLY_UPLOADED_DATA} element={<TallyUploadedData />} />}
            {<Route path={TIFF_2_PDF} element={<Tiff2Pdf />} />}
            {<Route path={AI_TEXT_IDENTIFIER} element={<AITextIdentifier />} />}
            {<Route path={FILE_MOVER_PATH} element={<FileMover />} />}
        </Route>
    </Routes>
);

export default DashboardRoutes;
