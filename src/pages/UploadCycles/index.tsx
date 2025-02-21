import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper,
    TablePagination,
    Link, Typography,
    Button, Box, Popover, Stack
} from '@mui/material';
import "pages/UploadCycles/UploadCycles.css"
import * as _ from 'lodash';
import moment from 'moment';
import { deleteUploadCycleById, makePostCallWithErrorHandling, verifyUploadStatusForUploadCycleId } from "service/BackendFetchService";
import { FaTrash } from 'react-icons/fa';
import { DD_MM_YYYY_WITH_TIME_FORMAT } from 'utils/utils';
import { getDataForUploadCycle } from 'service/BackendFetchService';
import { ArchiveProfileAndCount, UploadCycleArchiveProfile, UploadCycleTableData, UploadCycleTableDataDictionary } from 'mirror/types';
import { UPLOADS_USHERED_PATH } from 'Routes/constants';
import { MAX_ITEMS_LISTABLE } from 'utils/constants';
import { ERROR_RED, SUCCESS_GREEN } from 'constants/colors';
import Spinner from 'widgets/Spinner';
import { _launchGradlev2, launchGradleReuploadFailed } from 'service/launchGradle';
import ConfirmDialog from '../../widgets/ConfirmDialog';
import { launchYarnMoveToFreezeByUploadId } from 'service/launchYarn';
import ExecResponsePanel from 'scriptsThruExec/ExecResponsePanel';
import { ExecResponse, ExecResponseDetails } from 'scriptsThruExec/types';
import { checkCountEquality, createBackgroundForRow } from './utils';
import { ProfileAndCount } from './ProfileAndCount';
import { TableHeaderCellForEqualityCount } from './TableHeaderCellForEqualityCount';
import { TableHeaderCellForUploadCycleStats } from './TableHeaderCellForUploadCycleStats';
import { ColorCodeInformationPanel } from './ColorCodedInformationPanel';
import path from 'path';
import InfoIconWithTooltip from 'widgets/InfoIconWithTooltip';
import ItemToolTip, { ellipsis } from 'widgets/ItemTooltip';


const UploadCycles = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortedData, setSortedData] = useState<UploadCycleTableData[]>([]);
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [anchorEl2, setAnchorEl2] = React.useState<HTMLButtonElement | null>(null);
    const [anchorEl3, setAnchorEl3] = React.useState<HTMLButtonElement | null>(null);
    const [anchorEl4, setAnchorEl4] = React.useState<HTMLButtonElement | HTMLDivElement | null>(null);
    const [anchorElReuploadMissed, setAnchorElReuploadMissed] = React.useState<HTMLButtonElement | null>(null);
    const [anchorElReuploadFailed, setAnchorElReuploadFailed] = React.useState<HTMLButtonElement | null>(null);

    const [titlesForPopover, setTitlesForPopover] = useState(<></>);
    const [failedUploadsForPopover, setFailedUploadsForPopover] = useState(<></>);
    const [moveToFreezeRespPopover, setMoveToFreezeRespPopover] = useState(<></>);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [openDialogForDelete, setOpenDialogForDelete] = useState<boolean>(false);
    const [openDialogForReuploadMissed, setOpenDialogForReuploadMissed] = useState<boolean>(false);
    const [openDialogForReuploadFailed, setOpenDialogForReuploadFailed] = useState<boolean>(false);
    const [chosenProfilesForMove, setChosenProfilesForMove] = useState<[string, string[]]>(["", []]);
    const [reuploadables, setReuploadables] = useState<UploadCycleTableData>();
    const [deletaleUploadCycleId, setDeletableUploadCycleId] = useState<string>("");
    
    const handleTitleClick = (event: React.MouseEvent<HTMLButtonElement>, absolutePaths: string[]) => {
        const _titles = (
            <>
                {absolutePaths?.map((absPath, index) => <Box>({index + 1}) {path.basename(absPath)}</Box>)}
            </>
        )
        setTitlesForPopover(_titles);
        console.log("handleTitleClick: " + event.currentTarget)
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setAnchorEl2(null);
        setAnchorEl3(null);
        setAnchorEl4(null);
        setAnchorElReuploadMissed(null);
        setAnchorElReuploadFailed(null);
    };

    const calcRowUploadFailures = (row: UploadCycleTableData) => {
        const rowSucess = row.archiveProfileAndCount.reduce((acc, curr) => acc + (curr?.uploadSuccessCount||0), 0)
        const rowFailures = row.totalCount - rowSucess;
        return `(${rowFailures}/${row.totalCount})`;
    }

    const open = Boolean(anchorEl);
    const open2 = Boolean(anchorEl2);
    const open3 = Boolean(anchorEl3);
    const open4 = Boolean(anchorEl4);
    const openReuploadMiss = Boolean(anchorElReuploadMissed);
    const openReuploadFail = Boolean(anchorElReuploadFailed);
    console.log(`open ${open} ${open2} ${open3} ${open4}`);

    const id = open ? 'simple-popover' : undefined;
    const id2 = open2 ? 'simple-popover2' : undefined;
    const idReuplodMissing = openReuploadMiss ? 'simple-popover-reupload-missing' : undefined;
    const idReuplodFailing = openReuploadFail ? 'simple-popover-failed-missing' : undefined;
    const id3 = open3 ? 'simple-popover3' : undefined;
    const id4 = open4 ? 'simple-popover4' : undefined;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, sortedData?.length - page * rowsPerPage);

    const handleDelete = async (event: React.MouseEvent<HTMLDivElement>) => {
        const _uploadCycleId = deletaleUploadCycleId;
        setDeletableUploadCycleId("");
        console.log("Delete clicked ", _uploadCycleId);
        const currentTarget = event.currentTarget
        setOpenDialogForDelete(false)
        setIsLoading(true);
        const _resp: ExecResponseDetails = await deleteUploadCycleById(_uploadCycleId);
        console.log(`result ${JSON.stringify(_resp)}`);
        fetchUploadCycleAndSort();
        setIsLoading(false);
        const moveToFreezeRespPanel = (
            <ExecResponsePanel response={_resp} />
        )
        setMoveToFreezeRespPopover(moveToFreezeRespPanel);
        setAnchorEl4(currentTarget);
    }

    const _verifyUploadStatus = async (event: React.MouseEvent<HTMLButtonElement>,
        _uploadCycleId: string
    ) => {
        const currentTarget = event.currentTarget
        setIsLoading(true);
        const result = await verifyUploadStatusForUploadCycleId(_uploadCycleId);
        console.log(`_verifyUploadStatus:result ${JSON.stringify(result)}`);
        setIsLoading(false);
        fetchUploadCycleAndSort();
        setFailedUploadsForPopover(<ExecResponsePanel response={result} />);
        setAnchorEl3(currentTarget);
    };

    const showDialog = (event: React.MouseEvent<HTMLButtonElement>, uploadCycleId: string, profiles: string[]) => {
        setOpenDialog(true);
        setChosenProfilesForMove([uploadCycleId, profiles]);
    }
    const showDialogForDelete = (event: React.MouseEvent<HTMLDivElement>, uploadCycleId: string) => {
        setDeletableUploadCycleId(uploadCycleId);
        setOpenDialogForDelete(true);
    }

    const showDialogReuploadMissed = (event: React.MouseEvent<HTMLButtonElement>, row: UploadCycleTableData) => {
        setOpenDialogForReuploadMissed(true);
        setReuploadables(row);
    }

    const showDialogForFailed = (event: React.MouseEvent<HTMLButtonElement>, row: UploadCycleTableData) => {
        setOpenDialogForReuploadFailed(true);
        setReuploadables(row)
    }

    const moveToFreeze = async (event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
        const currentTarget = event.currentTarget
        setOpenDialog(false)
        console.log(`_profiles ${chosenProfilesForMove} ${JSON.stringify(chosenProfilesForMove)}`)
        setIsLoading(true);
        const _resp = await launchYarnMoveToFreezeByUploadId({
            profileAsCSV: chosenProfilesForMove[1]?.join(","),
            uploadCycleId: chosenProfilesForMove[0],
            flatten: "true"
        });
        setIsLoading(false);
        fetchUploadCycleAndSort();
        const moveToFreezeRespPanel = (
            <ExecResponsePanel response={_resp} />
        )
        setMoveToFreezeRespPopover(moveToFreezeRespPanel);
        setAnchorEl4(currentTarget);
    }


    const findMissingTitles = async (row: UploadCycleTableData | undefined) => {
        const missed = await makePostCallWithErrorHandling({
            uploadCycleId: row?.uploadCycleId,
        }, `uploadCycle/getUploadQueueUploadUsheredMissed`);
        console.log(`missed ${JSON.stringify(missed)}`)
        return missed?.response?.missedData
    }

    const launchReuploadMissed = async (uploadCycleId: string) => {
        setIsLoading(true);
        handleClose();
        const _res = await _launchGradlev2({
            uploadCycleId: uploadCycleId,
        }, "reuploadMissedViaUploadCycleId")
        console.log(`_res ${JSON.stringify(_res)}`)
        setIsLoading(false);
        setTitlesForPopover(<>{_res}</>);
    }

    const findMissingAndSetInPopover = async (event: React.MouseEvent<HTMLButtonElement>, row: UploadCycleTableData) => {
        const currentTarget = event.currentTarget
        console.log("findMissing: eventCurTarget" + currentTarget)
        const missedData = await findMissingTitles(row);
        console.log(`missedData ${missedData.length} ${JSON.stringify(missedData)}`)

        const missingTitlesPanel = (
            <>
                {(missedData && missedData.length > 0) ?
                    <>
                        <Box sx={{ paddingBottom: "30px" }}>
                            <Button
                                variant="contained"
                                onClick={() => launchReuploadMissed(row.uploadCycleId)}
                                size="small"
                                sx={{ width: "200px", marginTop: "20px" }}
                                disabled={isLoading}>Reupload Missed</Button>
                        </Box>
                        {
                            <>
                                <Typography>Missing Titles for {row.uploadCycleId}</Typography>
                                {
                                    missedData?.map((_data: { archiveProfile: string, missedCount: string, missed: string[] }, index: number) => {
                                        return (
                                            <>
                                                <Typography>({index + 1}) {_data.archiveProfile} ({_data.missedCount})</Typography>
                                                <Box sx={{ color: ERROR_RED }}>
                                                    {_data.missed.map((item: string, index2: number) => {
                                                        return (<Box>({index + 1}.{index2 + 1}) {item}</Box>)
                                                    })}
                                                </Box>
                                            </>
                                        )
                                    })
                                }
                            </>

                        }
                    </> :
                    <Typography>No Missing Titles for Upload Cycle with Id: {row.uploadCycleId} {missedData}</Typography>
                }
            </>
        )
        setTitlesForPopover(missingTitlesPanel);
        setAnchorEl2(currentTarget);
    };

    const reuploadFailed = async (event: React.MouseEvent<HTMLButtonElement>) => {
        const currentTarget = event.currentTarget
        setOpenDialogForReuploadFailed(false)
        setIsLoading(true);
        const _resp = await launchGradleReuploadFailed(reuploadables?.uploadCycleId || "");
        const response = _resp.response;
        setIsLoading(false);
        console.log(JSON.stringify(_resp));
        const responsePanel = (
            <>
                <Typography>Gradle Logs</Typography>
                {response.success === false && <Typography sx={{ color: ERROR_RED }}>Error: {response.err}</Typography>}
                {response?.noFailedUploads ? <Typography>{response.msg}</Typography> : <ExecResponsePanel response={_resp} />}
                {response?.noFailedUploads === false &&
                    _resp?.response?.split("\n").map((item: string, index: number) => {
                        return (<Box sx={{ color: SUCCESS_GREEN }}>({index + 1}) {item}</Box>)
                    })
                }
            </>
        )
        setMoveToFreezeRespPopover(responsePanel);
        setAnchorElReuploadMissed(currentTarget);
    }

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSort = (column: keyof UploadCycleTableData) => {
        const sorted = [...sortedData].sort((a, b) => {
            const aCom = a[column] || "";
            const bCol = b[column] || "";
            if (aCom < bCol) return -1;
            if (aCom > bCol) return 1;
            return 0;
        });
        setSortedData(sorted);
    };


    const TableRowCellForEqualityCount: React.FC<{ row: UploadCycleTableData }> = ({ row }) => {
        const equality = checkCountEquality(row);
        console.log(`equality ${equality}`)
        const equalityLabel =
            (
                <>{row?.countIntended} == {row?.totalCount} == {row?.totalQueueCount} </>
            )
        const textColor = equality ? { color: SUCCESS_GREEN } : { color: ERROR_RED }
        return (
            <TableCell className="centerAligned" sx={{ verticalAlign: "top", ...textColor }}>
                <Stack spacing="2" sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <Typography sx={{ alignContent: "center" }}>{equalityLabel}</Typography>
                    <Typography component="span">
                        <Button
                            variant="contained"
                            onClick={(e) => _verifyUploadStatus(e, row.uploadCycleId)}
                            size="small"
                            sx={{ width: "200px" }}
                            disabled={isLoading}
                        >
                            Verify Upload Status
                        </Button>
                        <Popover
                            id={id3}
                            open={open3}
                            anchorEl={anchorEl3}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                        ><Typography sx={{ p: 2 }}>{failedUploadsForPopover}</Typography>
                        </Popover>
                    </Typography>
                    <Typography component="span">
                        <>
                            <Button
                                variant="contained"
                                onClick={async (e: React.MouseEvent<HTMLButtonElement>) => await findMissingAndSetInPopover(e, row)}
                                size="small"
                                sx={{ color: "#f38484", width: "200px", marginTop: "10px" }}
                                disabled={isLoading || ((row.countIntended || 0) === (row?.totalQueueCount || 0))}
                            >
                                Find Missing ({(row.countIntended || 0)-(row?.totalQueueCount || 0)}/{row.countIntended})
                                <InfoIconWithTooltip input="Find Missing (Unqueued/Unushered) Failure Type 1" />
                            </Button>

                            <Popover
                                id={id2}
                                open={open2}
                                anchorEl={anchorEl2}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                            ><Typography sx={{ p: 2 }}>{titlesForPopover}</Typography>
                            </Popover>
                        </>
                    </Typography>
                    <Typography component="span">
                        <>
                            <Button
                                variant="contained"
                                onClick={async (e) => showDialogForFailed(e, row)}
                                size="small"
                                sx={{ color: "#f38484", width: "200px", marginTop: "10px" }}
                                disabled={isLoading || (row.allUploadVerified === true)}
                            >
                                Reupload Failed { calcRowUploadFailures(row)}
                                <InfoIconWithTooltip input="Reupload Failed (Queued/Ushered/But Didnt Make it). Failure Type 2" />
                            </Button>
                            <Popover
                                id={idReuplodFailing}
                                open={openReuploadFail}
                                anchorEl={anchorElReuploadFailed}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                            ><Typography sx={{ p: 2 }}>{titlesForPopover}</Typography>
                            </Popover>
                        </>
                    </Typography>
                    <Typography component="span">
                        <Button
                            variant="contained"
                            onClick={(e) => showDialog(e, row.uploadCycleId, row.archiveProfileAndCount.map((arcProfAndCount: ArchiveProfileAndCount) => arcProfAndCount.archiveProfile))}
                            size="small"
                            sx={{ width: "200px", marginTop: "10px" }}
                            disabled={isLoading || (row?.moveToFreeze === true)}
                        >
                            pnpm Move-To-Freeze&nbsp;
                            <InfoIconWithTooltip input="pnpm move Uploaded items to Freeze folder and disable this button" />
                        </Button>
                        <Popover
                            id={id4}
                            open={open4}
                            anchorEl={anchorEl4}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                        ><Typography sx={{ p: 2 }}>{moveToFreezeRespPopover}</Typography>
                        </Popover>
                    </Typography>
                </Stack>
            </TableCell >
        )
    }

    const TableRowCellForUploadCycleGlobalStats: React.FC<{ row: UploadCycleTableData }> = ({ row }) => {
        const mode = row.mode?.split("-;");
        const modePanel = (
            <Box>
                {mode?.map((item: string) =>
                    <Typography>{item}</Typography>
                )}
            </Box>
        )
        const uploadstats =
            (
                <Box key={row.uploadCycleId}>
                    {row.countIntended}
                    <Typography>{modePanel}</Typography>
                    {row?.archiveProfileAndCountIntended?.map((archiveProfileAndCount: UploadCycleArchiveProfile) => (
                        <Box >
                            <Typography component="span">{archiveProfileAndCount.archiveProfile} </Typography>
                            <Typography component="div">
                                <ItemToolTip input={archiveProfileAndCount?.archiveProfilePath || ""} /></Typography>
                            <Typography component="span">{archiveProfileAndCount.count}</Typography>
                            <Typography component="div" sx={{ fontWeight: 600 }}>
                                <Button
                                    variant='contained'
                                    onClick={(e) => handleTitleClick(e, archiveProfileAndCount?.absolutePaths || [])}
                                    disabled={isLoading}
                                >
                                    Fetch All Titles
                                </Button>
                            </Typography>

                            <Popover
                                id={id}
                                open={open}
                                anchorEl={anchorEl}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                            >
                                <Typography sx={{ p: 2 }}>{titlesForPopover}</Typography>
                            </Popover>

                        </Box>
                    ))
                    }
                </Box>
            )
        return (
            <TableCell sx={{ verticalAlign: "top" }} key={row.uploadCycleId}>
                {uploadstats}
            </TableCell>
        )
    }

    async function fetchUploadCycles() {
        const dataForUploadCycle: UploadCycleTableDataDictionary[] = await getDataForUploadCycle(MAX_ITEMS_LISTABLE);
        return dataForUploadCycle;
    }

    async function fetchUploadCycleAndSort() {
        setIsLoading(true)
        const _data = await fetchUploadCycles();
        setSortedData(_data.map(x => x.uploadCycle));
        setIsLoading(false)
    }

    useEffect(() => {
        (async () => {
            fetchUploadCycleAndSort();
        })();
    }, []);

    return (
        <Stack spacing="2">
            {isLoading && <Spinner />}
            <ColorCodeInformationPanel />
            <div className='bg-black'>
                <TableContainer component={Paper}>
                    <TablePagination
                        rowsPerPageOptions={[10, 20, 50]}
                        component="div"
                        count={sortedData.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        className="bg-turquoise-50 text-turquoise-900"
                    />
                    <Table>
                        <TableHead>
                            <TableRow className="bg-gradient-to-r from-cyan-200 to-blue-300">
                                <TableCell onClick={() => handleSort('uploadCycleId')}><Link>Upload Cycle Id</Link></TableCell>
                                <TableHeaderCellForUploadCycleStats />
                                <TableCell>( Queued ) Stats </TableCell>
                                <TableCell>( Ushered ) Stats </TableCell>
                                <TableHeaderCellForEqualityCount />
                                <TableCell onClick={() => handleSort('totalCount')}><Link>Total Count</Link></TableCell>
                                <TableCell onClick={() => handleSort('datetimeUploadStarted')}><Link>Time Started</Link></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(rowsPerPage > 0
                                ? sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : sortedData
                            ).map((row: UploadCycleTableData) => (
                                <TableRow key={row.uploadCycleId} className={createBackgroundForRow(row)}>
                                    <TableCell sx={{ verticalAlign: "top" }}>
                                        <Link href={`${UPLOADS_USHERED_PATH}?uploadCycleId=${row.uploadCycleId}`}>{row.uploadCycleId}</Link>
                                    </TableCell>
                                    <TableRowCellForUploadCycleGlobalStats row={row} />
                                    <TableCell sx={{ verticalAlign: "top" }}>
                                        <Table>
                                            <TableBody className="text-sm">
                                                <ProfileAndCount row={row} forQueue={true} />
                                            </TableBody>
                                        </Table>
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: "top" }}>
                                        <Table>
                                            <TableBody>
                                                <ProfileAndCount row={row} forQueue={false} />
                                            </TableBody>
                                        </Table>
                                    </TableCell>
                                    <TableRowCellForEqualityCount row={row} />
                                    <TableCell sx={{ verticalAlign: "top" }}>
                                        {row.totalCount}
                                        <div
                                            onClick={(e) => showDialogForDelete(e, row.uploadCycleId)}
                                            style={{ cursor: 'pointer', display: 'inline-block', marginLeft: '10px' }}>
                                            <FaTrash />
                                        </div>
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: "top" }}>{moment(row.datetimeUploadStarted).format(DD_MM_YYYY_WITH_TIME_FORMAT)}</TableCell>
                                </TableRow>
                            ))}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 53 * emptyRows }}>
                                    <TableCell colSpan={3} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[10, 20, 50]}
                        component="div"
                        count={sortedData.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        className="bg-turquoise-50 text-turquoise-900"
                    />
                </TableContainer>
            </div>
            <ConfirmDialog openDialog={openDialog}
                handleClose={handleClose}
                setOpenDialog={setOpenDialog}
                invokeFuncOnClick={moveToFreeze} />

            <ConfirmDialog openDialog={openDialogForDelete}
                handleClose={handleClose}
                setOpenDialog={setOpenDialogForDelete}
                invokeFuncOnClick={handleDelete} />

            <ConfirmDialog openDialog={openDialogForReuploadMissed}
                handleClose={handleClose}
                setOpenDialog={setOpenDialogForReuploadMissed}
                invokeFuncOnClick={async () => { console.log("--") }} />

            <ConfirmDialog openDialog={openDialogForReuploadFailed}
                handleClose={handleClose}
                setOpenDialog={setOpenDialogForReuploadFailed}
                invokeFuncOnClick={reuploadFailed} />
        </Stack>
    );
};


export default UploadCycles;
