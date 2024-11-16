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
import ExecLauncherSix from 'scriptsThruExec/ExecLauncherSix';
import Login from 'pages/GoogleLogin';
import RenamePdfs from 'scriptsThruExec/RenamePdfs';
import ExecLauncherZip from 'scriptsThruExec/ExecLauncherZip';
import GDriveItemList from 'components/gDriveCrud';
import {
    FILE_MOVER_PATH,
    EXEC_LAUNCHER_PATH,
    UPLOADS_QUEUED_PATH,
    UPLOADS_USHERED_PATH,
    LANDING_PAGE_PATH,
    EXEC_LAUNCHER_TWO_PATH,
    EXEC_LAUNCH_FOUR_B_PATH,
    TIFF_2_PDF,
    AI_TEXT_IDENTIFIER,
    EXEC_LAUNCHER_THREE_PATH,
    EXEC_LAUNCHER_FOUR_PATH,
    SEARCH_ARCHIVE_DB_PATH,
    SEARCH_G_DRIVE_DB_PATH,
    G_DRIVE_LISTING_MAKER_PATH,
    G_DRIVE_UPLOAD_INTEGRITY_CHECK_PATH,
    EXEC_LAUNCHER_TWO_B_PATH,
    EXEC_LAUNCHER_TWO_C_PATH,
    RENAME_PDFS,
    EXEC_LAUNCHER_ZIP_PATH,
    G_DRIVE_CRUD_PATH
  } from './constants';
const DashboardRoutes: React.FC = () => {
    const isLocalhost = true; //window.location.hostname === 'localhost';
    const allFrags = (
        <>
            {<Route path={LANDING_PAGE_PATH} element={<UploadCycles />} />}
            {<Route path={UPLOADS_USHERED_PATH} element={<Uploads forQueues={false} />} />}
            {<Route path={UPLOADS_QUEUED_PATH} element={<Uploads forQueues={true} />} />}
            {<Route path={EXEC_LAUNCHER_PATH} element={<ExecLauncher />} />}
            {<Route path={EXEC_LAUNCHER_ZIP_PATH} element={<ExecLauncherZip />} />}
            {<Route path={EXEC_LAUNCHER_TWO_PATH} element={<ExecLauncherTwo />} />}
            {<Route path={EXEC_LAUNCHER_TWO_B_PATH} element={<ExecLauncherTwoB />} />}
            {<Route path={EXEC_LAUNCHER_TWO_C_PATH} element={<ExecLauncherTwoC />} />}
            {<Route path={EXEC_LAUNCHER_THREE_PATH} element={<ExecLauncherThree />} />}
            {<Route path={EXEC_LAUNCHER_FOUR_PATH} element={<ExecLauncherFour />} />}
            {<Route path={EXEC_LAUNCH_FOUR_B_PATH} element={<ExecLauncher4B />} />}
            {<Route path={TIFF_2_PDF} element={<Tiff2Pdf />} />}
            {<Route path={AI_TEXT_IDENTIFIER} element={<AITextIdentifier />} />}
            {<Route path={FILE_MOVER_PATH} element={<FileMover />} />}
            {<Route path={TIFF_2_PDF} element={<Tiff2Pdf />} />}
            {<Route path={SEARCH_ARCHIVE_DB_PATH} element={<SearchArchiveDB />} />}
            {<Route path={SEARCH_G_DRIVE_DB_PATH} element={<SearchGDriveDB />} />}
            {<Route path={G_DRIVE_LISTING_MAKER_PATH} element={<ExecLauncherFive />} />}
            {<Route path={G_DRIVE_UPLOAD_INTEGRITY_CHECK_PATH} element={<ExecLauncherSix />} />}
            {<Route path={G_DRIVE_CRUD_PATH} element={<GDriveItemList />} />}
            {<Route path={RENAME_PDFS} element={<RenamePdfs />} />}
        </>
    );

    return (
        <Routes>
            <Route path="/test" element={<>TestAreaWithoutLayout</>} />
            {isLocalhost ? (
                <Route element={<ProtectedRoute />}>
                    {allFrags}
                </Route>
            ) : (
                <Route element={<Login />}>
                    {/* <Route element={<ProtectedRoute />}> */}
                        {allFrags}
                    {/* </Route> */}
                </Route>
            )}
        </Routes>
    );
}

export default DashboardRoutes;
