import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper,
    TablePagination,
    Link, Typography,
    Button, Box, Popover, Stack, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import "pages/UploadCycles/UploadCycles.css"
import * as _ from 'lodash';
import moment from 'moment';

import { getUploadStatusDataForUshered, verifyUploadStatusForUploadCycleId } from "service/BackendFetchService";

import { DD_MM_YYYY_WITH_TIME_FORMAT } from 'utils/utils';
import { getDataForUploadCycle, getUploadStatusData } from 'service/BackendFetchService';
import { ArchiveProfileAndCount, ArchiveProfileAndCountAndTitles, ArchiveProfileAndTitle, SelectedUploadItem, SelectedUploadItemResponse, UploadCycleTableData, UploadCycleTableDataDictionary, UploadCycleTableDataResponse } from 'mirror/types';
import { UPLOADS_QUEUED_PATH, UPLOADS_USHERED_PATH } from 'Routes';
import { MAX_ITEMS_LISTABLE } from 'utils/constants';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import Tooltip from '@mui/material/Tooltip';
import { BURGUNDY_RED, DARK_RED, ERROR_RED, LIGHT_RED, SUCCESS_GREEN, WHITE_SMOKE } from 'constants/colors';
import Spinner from 'widgets/Spinner';
import { launchGradleReuploadFailed, launchGradleReuploadMissed } from 'service/launchGradle';
import UploadDialog from './UploadDialog';
import { launchYarnMoveToFreeze } from 'service/launchYarn';
import ExecResponsePanel from 'scriptsThruExec/ExecResponsePanel';


const UploadCycles = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortedData, setSortedData] = useState<UploadCycleTableData[]>([]);
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [anchorEl2, setAnchorEl2] = React.useState<HTMLButtonElement | null>(null);
    const [anchorEl3, setAnchorEl3] = React.useState<HTMLButtonElement | null>(null);
    const [anchorEl4, setAnchorEl4] = React.useState<HTMLButtonElement | null>(null);
    const [anchorElReuploadMissed, setAnchorElReuploadMissed] = React.useState<HTMLButtonElement | null>(null);
    const [anchorElReuploadFailed, setAnchorElReuploadFailed] = React.useState<HTMLButtonElement | null>(null);

    const [titlesForPopover, setTitlesForPopover] = useState(<></>);
    const [failedUploadsForPopover, setFailedUploadsForPopover] = useState(<></>);
    const [moveToFreezeRespPopover, setMoveToFreezeRespPopover] = useState(<></>);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [openDialogForReuploadMissed, setOpenDialogForReuploadMissed] = useState<boolean>(false);
    const [openDialogForReuploadFailed, setOpenDialogForReuploadFailed] = useState<boolean>(false);
    const [chosenProfilesForMove, setChosenProfilesForMove] = useState<string[]>([]);
    const [reuploadables, setReuploadables] = useState<UploadCycleTableData>();
    
    const handleTitleClick = (event: React.MouseEvent<HTMLButtonElement>, titles: string[]) => {
        const _titles = (
            <>
                {titles?.map((title, index) => <Box>({index + 1}) {title.replaceAll(".pdf", "")}</Box>)}
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

    const _verifyUploadStatus = async (event: React.MouseEvent<HTMLButtonElement>,
        _uploadCycleId: string
    ) => {
        const currentTarget = event.currentTarget
        setIsLoading(true);
        const result: SelectedUploadItemResponse = await verifyUploadStatusForUploadCycleId(_uploadCycleId);
        console.log(`result ${JSON.stringify(result)}`);
        setIsLoading(false);
        const failedUploads = result.results.filter((item: SelectedUploadItem) => !item.isValid);
        const noFailedUploads = failedUploads.length === 0;
        const failedUploadListPanel = (
            <Box sx={{ marginY: "30px" }}>
                <h4>
                    <Typography>{result.status}</Typography>
                    <Typography sx={{ color: noFailedUploads ? SUCCESS_GREEN : DARK_RED }}>{noFailedUploads ? "No Failed Uploads" : "Following Items Failed Upload:"}</Typography>
                </h4>
                {result.results?.map((item, index) =>
                    !item.isValid && <Box sx={{ color: ERROR_RED }}>({index + 1}) {item.archiveId.replaceAll(".pdf", "")}</Box>
                )}

            </Box>
        )

        // setFailedUploadsForPopover(<ExecResponsePanel response={result} />);

        setFailedUploadsForPopover(failedUploadListPanel);
        setAnchorEl3(currentTarget);
    };

    const showDialog = (event: React.MouseEvent<HTMLButtonElement>, profiles: string[]) => {
        setOpenDialog(true);
        setChosenProfilesForMove(profiles);
    }

    const showDialogReuploadMissed = (event: React.MouseEvent<HTMLButtonElement>, row: UploadCycleTableData) => {
        setOpenDialogForReuploadMissed(true);
        setReuploadables(row);
    }

    const showDialogFailed = (event: React.MouseEvent<HTMLButtonElement>, row: UploadCycleTableData) => {
        setOpenDialogForReuploadFailed(true);
        setReuploadables(row)
    }

    const moveToFreeze = async (event: React.MouseEvent<HTMLButtonElement>) => {
        const currentTarget = event.currentTarget
        setOpenDialog(false)
        console.log(`_profiles ${chosenProfilesForMove} ${JSON.stringify(chosenProfilesForMove)}`)
        setIsLoading(true);
        const _resp = await launchYarnMoveToFreeze(
            {
                profileAsCSV: chosenProfilesForMove.join(","),
                flatten: "true"
            }
        )
        setIsLoading(false);
        const moveToFreezeRespPanel = (
            <ExecResponsePanel response={_resp} />
        )
        setMoveToFreezeRespPopover(moveToFreezeRespPanel);
        setAnchorEl4(currentTarget);
    }


    const findMissingTitles = async (row: UploadCycleTableData | undefined) => {
        return (await findMissingTitlesWithProfile(row))?.map(x => x.title)
    }

    /**
    * 
    * @param row strangely items in row?.archiveProfileAndCountIntended
    * sometimes have an extra space in the end, its imp. to trim
    * @returns 
    */
    const findMissingTitlesWithProfile = async (row: UploadCycleTableData | undefined) => {
        const uploadStatusData: ItemListResponseType = await getUploadStatusDataForUshered(MAX_ITEMS_LISTABLE,
            row?.uploadCycleId);


        // Extract pairs of titles and archiveProfile
        const data = row?.archiveProfileAndCountIntended || [];

        const itemsIntended: ArchiveProfileAndTitle[] = data.flatMap(item =>
            item.titles ? item.titles.map(title => ({
                archiveProfile: item.archiveProfile,
                title: title.replace(".pdf", "").trim()
            })) : []
        );

        const itemsUshered: ArchiveProfileAndTitle[] = uploadStatusData?.response?.map((x: Item) => {
            return {
                archiveProfile: x?.archiveProfile,
                title: x?.title.trim() || ""
            }
        }) || [];

        const missing = _.differenceWith(itemsIntended, itemsUshered, _.isEqual);

        console.log(`missingPairs: ${JSON.stringify(missing)}`);
        return missing
    }

    const findMissingAndSetInPopover = async (event: React.MouseEvent<HTMLButtonElement>, row: UploadCycleTableData) => {
        const currentTarget = event.currentTarget
        console.log("findMissing: eventCurTarget" + currentTarget)
        const missing = await findMissingTitles(row);
        const missingTitlesPanel = (
            <>
                {missing?.map((title, index) => <Box sx={{ color: ERROR_RED }}>({index + 1}) {title}</Box>)}
            </>
        )
        setTitlesForPopover(missingTitlesPanel);
        setAnchorEl2(currentTarget);
        console.log(`_titles: ${event.currentTarget} ${JSON.stringify(missingTitlesPanel)}`)
    };


    const reuploadFailed = async (event: React.MouseEvent<HTMLButtonElement>) => {
        const currentTarget = event.currentTarget
        setOpenDialogForReuploadFailed(false)
        setIsLoading(true);
        const _resp = await launchGradleReuploadFailed(reuploadables?.uploadCycleId || "");
        setIsLoading(false);
        console.log(JSON.stringify(_resp))
        const responsePanel = (
            <>
                <Typography>Gradle Logs</Typography>
                {_resp?.response?.split("\n").map((item: string, index: number) => {
                    return (<Box sx={{ color: SUCCESS_GREEN }}>({index + 1}) {item}</Box>)
                })
                }
            </>
        )
        setMoveToFreezeRespPopover(responsePanel);
        setAnchorElReuploadMissed(currentTarget);
    }

    const reuploadMissed = async (event: React.MouseEvent<HTMLButtonElement>) => {
        const currentTarget = event.currentTarget
        console.log("reuploadMissing: eventCurTarget" + currentTarget)
        setOpenDialogForReuploadMissed(false)
        const missing = await findMissingTitlesWithProfile(reuploadables);
        setIsLoading(true);
        const _resp = await launchGradleReuploadMissed(missing)
        setIsLoading(false);
        console.log(JSON.stringify(_resp))
        const moveToFreezeRespPanel = (
            <>
                <Typography>Gradle Logs</Typography>
                {_resp?.response?.split("\n").map((item: string, index: number) => {
                    return (<Box sx={{ color: SUCCESS_GREEN }}>({index + 1}) {item}</Box>)
                })
                }
            </>
        )
        // setMoveToFreezeRespPopover(moveToFreezeRespPanel);
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

    const checkCountEquality = (row: UploadCycleTableData) => {
        const hasUploadCycleGlobalValues = (row?.countIntended || 0) > 0;
        const equality = hasUploadCycleGlobalValues ? ((row?.totalCount === row?.totalQueueCount) && (row?.countIntended === row?.totalQueueCount)) : (row?.totalCount === row?.totalQueueCount)
        return {
            hasUploadCycleGlobalValues,
            //            equality: equality || row.allUploadVerified === false
            equality: row?.allUploadVerified === true
        }
    }

    const TableRowCellForEqualityCount: React.FC<{ row: UploadCycleTableData }> = ({ row }) => {
        const { hasUploadCycleGlobalValues, equality } = checkCountEquality(row);
        const equalityLabel =
            hasUploadCycleGlobalValues ? (
                <>{row?.countIntended} == {row?.totalCount} == {row?.totalQueueCount} </>
            ) : <>{row?.totalCount} == {row?.totalQueueCount}</>
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
                        {!equality ? <>
                            <Button
                                variant="contained"
                                onClick={async (e: React.MouseEvent<HTMLButtonElement>) => await findMissingAndSetInPopover(e, row)}
                                size="small"
                                sx={{ color: "#f38484", width: "200px", marginTop: "10px" }}
                                disabled={isLoading}
                            >
                                Find Missing (Unqueued/Unushered)
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
                        </> : <></>}
                    </Typography>
                    <Typography component="span">
                        {!equality ? <>
                            <Button
                                variant="contained"
                                onClick={async (e) => showDialogFailed(e, row)}
                                size="small"
                                sx={{ color: "#f38484", width: "200px", marginTop: "10px" }}
                                disabled={isLoading}
                            >
                                Reupload Failed (Queued/Ushered/But Didnt Make it)
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
                        </> : <></>}


                    </Typography>
                    <Typography component="span">
                        <Button
                            variant="contained"
                            onClick={(e) => showDialog(e, row.archiveProfileAndCount.map((arcProfAndCount: ArchiveProfileAndCount) => arcProfAndCount.archiveProfile))}
                            size="small"
                            sx={{ width: "200px", marginTop: "10px" }}
                            disabled={isLoading}
                        >
                            Yarn Move to Freeze
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
        const hasUploadCycleGlobalValues = (row?.countIntended || 0) > 0;
        const uploadstats =
            hasUploadCycleGlobalValues ? (
                <Box key={row.uploadCycleId}>
                    {row.countIntended}

                    {row?.archiveProfileAndCountIntended?.map((archiveProfileAndCount: ArchiveProfileAndCountAndTitles) => (
                        <Box>
                            <Typography component="span">{archiveProfileAndCount.archiveProfile} </Typography>
                            <Typography component="span">{archiveProfileAndCount.count}</Typography>

                            <Typography component="div" sx={{ fontWeight: 600 }}>
                                <Button
                                    variant='contained'
                                    onClick={(e) => handleTitleClick(e, archiveProfileAndCount?.titles || [])}
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
            ) : <>-</>
        return (
            <TableCell sx={{ verticalAlign: "top" }} key={row.uploadCycleId}>
                {uploadstats}
            </TableCell>
        )
    }

    const TableHeaderCellForEqualityCount: React.FC = () => {

        const infoText = (
            <>
                <Typography>Four Set of Checks</Typography>
                <Typography>The Intended Count at the Beginning of the Cycle(If this is higher then find the missine one by going to Titles)</Typography>
                <Typography>Count of Items Queued</Typography>
                <Typography>Count of Items Ushered</Typography>
                <Typography>Finally Check for All Items properly uploaded post-ushering(Verify Upload Status)</Typography>
            </>
        )

        return (
            <TableCell>Intended/Ushered/Queued Equality
                <Tooltip title={infoText}>
                    <IconButton aria-label="info"><InfoIcon />
                    </IconButton>
                </Tooltip>
                <Typography>Intended count == Queued Count == Ushered Count. Then Manual Upload Verifcation</Typography>
            </TableCell>
        )
    }


    const TableHeaderCellForUploadCycleStats: React.FC = () => {
        return (
            <TableCell>Uploads Intended
                <Tooltip title="Right at the time uploads are initiated a snapshot of the Total Intended Count, Profile Name and Titles is taken. This column is for that reading">
                    <IconButton aria-label="info"><InfoIcon />
                    </IconButton>
                </Tooltip>
            </TableCell>
        )
    }

    type UploadCycleDataProp = {
        row: UploadCycleTableData,
        forQueue: boolean

    }
    const ProfileAndCount: React.FC<UploadCycleDataProp> = ({ row, forQueue = false }) => {
        const archiveProfileAndCountMap = forQueue ? row.archiveProfileAndCountForQueue : row.archiveProfileAndCount;
        const _path = forQueue ? UPLOADS_QUEUED_PATH : UPLOADS_USHERED_PATH
        return (
            <>
                {
                    archiveProfileAndCountMap?.map((arcProfAndCount: ArchiveProfileAndCount) =>
                    (
                        <TableRow key={arcProfAndCount.archiveProfile}>
                            <TableCell className="centerAligned">
                                <Link href={`${_path}?uploadCycleId=${row.uploadCycleId}&archiveProfile=${arcProfAndCount.archiveProfile}`}>
                                    {arcProfAndCount.archiveProfile}
                                </Link>
                            </TableCell>
                            <TableCell className="centerAligned">{arcProfAndCount.count}</TableCell>
                        </TableRow>
                    )
                    )
                }
            </>
        )
    }

    async function fetchUploadCycles() {
        const dataForUploadCycle: UploadCycleTableDataDictionary[] = await getDataForUploadCycle(MAX_ITEMS_LISTABLE);
        return dataForUploadCycle;
    }

    const createBackgroundForRow = (row: UploadCycleTableData) => {
        if (row?.countIntended !== row?.totalCount) {
            return {
                backgroundColor: `${LIGHT_RED}`
            }
        }

        if (row?.allUploadVerified === true) {
            return {
                backgroundColor: `${SUCCESS_GREEN}`
            }
        }
        if (row?.allUploadVerified === false) {
            return {
                backgroundColor: `${BURGUNDY_RED}`
            }
        }
    }

    useEffect(() => {
        (async () => {
            const _data = await fetchUploadCycles();
            setSortedData(_data.map(x => x.uploadCycle));
        })();
    }, []);

    return (
        <Stack spacing="2">
            {isLoading && <Spinner />}
            <Typography variant="h6">
                <ul>
                    <li style={{ color: LIGHT_RED }}>Light Red Row Highlight Color implies Intended Count mismatch</li>
                    <li style={{ color: BURGUNDY_RED }}>Burgundy Red implies Failed Uploads</li>
                    <li style={{ color: SUCCESS_GREEN }}>Green implies All Intended Uploads uploaded and verfied</li>
                    <li>White implies All Uploaded but Actual Upload Verification not done.</li>
                </ul>

            </Typography>
            <div>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
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
                                <TableRow key={row.uploadCycleId} sx={createBackgroundForRow(row)}>
                                    <TableCell sx={{ verticalAlign: "top" }}>
                                        <Link href={`${UPLOADS_USHERED_PATH}?uploadCycleId=${row.uploadCycleId}`}>{row.uploadCycleId}</Link>
                                    </TableCell>
                                    <TableRowCellForUploadCycleGlobalStats row={row} />
                                    <TableCell sx={{ verticalAlign: "top" }}>
                                        <Table>
                                            <TableBody>
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
                                    <TableCell sx={{ verticalAlign: "top" }}>{row.totalCount}</TableCell>
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
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={sortedData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </div>
            <UploadDialog openDialog={openDialog}
                handleClose={handleClose}
                setOpenDialog={setOpenDialog}
                invokeFuncOnClick={moveToFreeze} />

            <UploadDialog openDialog={openDialogForReuploadMissed}
                handleClose={handleClose}
                setOpenDialog={setOpenDialogForReuploadMissed}
                invokeFuncOnClick={reuploadMissed} />

            <UploadDialog openDialog={openDialogForReuploadFailed}
                handleClose={handleClose}
                setOpenDialog={setOpenDialogForReuploadFailed}
                invokeFuncOnClick={reuploadFailed} />
        </Stack>
    );
};


export default UploadCycles;
