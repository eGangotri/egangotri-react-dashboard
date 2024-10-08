import ProtectedRoute from 'ProtectedRoute';
import UploadCycles from 'pages/UploadCycles';
import Uploads from 'pages/upload';
import FileMover from 'pages/widget/fileMover';
import ExecLauncher from 'scriptsThruExec/ExecLauncherOne';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ExecLauncherTwo from 'scriptsThruExec/ExecLauncherTwo';
import ExecLauncher4B from 'scriptsThruExec/ExecLauncher4B';
import Tiff2Pdf from 'scriptsThruExec/Tiff2Pdf';
import AITextIdentifier from 'scriptsThruExec/AITextIdentifier';
import ExecLauncherThree from 'scriptsThruExec/ExecLauncherThree';
import ExecLauncherFour from 'scriptsThruExec/ExecLauncherFour';
import SearchArchiveDB from 'pages/search/SearchArchiveDB';
import SearchGDriveDB from 'pages/search/SearchGDriveDB';
import ExecLauncherFive from 'scriptsThruExec/ExecLauncherFive';
import ExecLauncherTwoB from 'scriptsThruExec/ExecLauncherTwoB';
import ExecLauncherTwoC from 'scriptsThruExec/ExecLauncherTwoC';
import ExecLauncherSeven from 'scriptsThruExec/ExecLauncherSix';
import ExecLauncherSix from 'scriptsThruExec/ExecLauncherSix';
import Login from 'pages/GoogleLogin';
import RenamePdfs from 'scriptsThruExec/RenamePdfs';

export const LANDING_PAGE_PATH = "/"
export const UPLOADS_USHERED_PATH = "/uploadsUshered";
export const UPLOADS_QUEUED_PATH = "/uploadsQueued";
export const UPLOAD_CYCLES_PATH = "/uploadCycles";
export const EXEC_LAUNCHER_PATH = "/execLauncher";
export const EXEC_LAUNCHER_TWO_PATH = "/execLauncher2";
export const EXEC_LAUNCHER_TWO_B_PATH = "/execLauncher2b";
export const EXEC_LAUNCHER_TWO_C_PATH = "/execLauncher2c";
export const EXEC_LAUNCHER_THREE_PATH = "/execLauncher3";
export const EXEC_LAUNCHER_FOUR_PATH = "/execLauncher4a";
export const EXEC_LAUNCH_FOUR_B_PATH = "/execLauncher4b";
export const FILE_MOVER_PATH = "/fileMover";
export const SEARCH_ARCHIVE_DB_PATH = "/searchArchiveDB";
export const SEARCH_G_DRIVE_DB_PATH = "/searchGDriveDB";
export const G_DRIVE_LISTING_MAKER_PATH = "/GDriveListingMaker";
export const G_DRIVE_UPLOAD_INTEGRITY_CHECK_PATH = "/GDriveUploadIntegrityCheck";
export const RENAME_PDFS = "/renamePdfs";

export const TIFF_2_PDF = "/tiff2pdf";
export const AI_TEXT_IDENTIFIER = "/ai";

const DashboardRoutes: React.FC = () => (
    <Routes>
        <Route path="/test" element={<>TestAreaWithoutLayout</>} />
        <Route element={<Login />} >
            {<Route path={EXEC_LAUNCHER_PATH} element={<ExecLauncher />} />}
        </Route>
        {/* <Route path="/login" element={<Login />} />  */}

        <Route element={<ProtectedRoute />}>
            {<Route path={LANDING_PAGE_PATH} element={<UploadCycles />} />}
            {<Route path={UPLOADS_USHERED_PATH} element={<Uploads forQueues={false} />} />}
            {<Route path={UPLOADS_QUEUED_PATH} element={<Uploads forQueues={true} />} />}
            {/* {<Route path={EXEC_LAUNCHER_PATH} element={<ExecLauncher />} />} */}
            {<Route path={EXEC_LAUNCHER_TWO_PATH} element={<ExecLauncherTwo />} />}
            {<Route path={EXEC_LAUNCHER_TWO_B_PATH} element={<ExecLauncherTwoB />} />}
            {<Route path={EXEC_LAUNCHER_TWO_C_PATH} element={<ExecLauncherTwoC />} />}
            {<Route path={EXEC_LAUNCHER_THREE_PATH} element={<ExecLauncherThree />} />}
            {<Route path={EXEC_LAUNCHER_FOUR_PATH} element={<ExecLauncherFour />} />}
            {<Route path={EXEC_LAUNCH_FOUR_B_PATH} element={<ExecLauncher4B />} />}
            {<Route path={TIFF_2_PDF} element={<Tiff2Pdf />} />}
            {<Route path={AI_TEXT_IDENTIFIER} element={<AITextIdentifier />} />}
            {<Route path={FILE_MOVER_PATH} element={<FileMover />} />}
            {<Route path={SEARCH_ARCHIVE_DB_PATH} element={<SearchArchiveDB />} />}
            {<Route path={SEARCH_G_DRIVE_DB_PATH} element={<SearchGDriveDB />} />}
            {<Route path={G_DRIVE_LISTING_MAKER_PATH} element={<ExecLauncherFive />} />}
            {<Route path={G_DRIVE_UPLOAD_INTEGRITY_CHECK_PATH} element={<ExecLauncherSix />} />}
            {<Route path={RENAME_PDFS} element={<RenamePdfs />} />}
            
        </Route>
    </Routes>
);

export default DashboardRoutes;
