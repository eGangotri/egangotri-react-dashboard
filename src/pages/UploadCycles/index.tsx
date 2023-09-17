import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper,
    TablePagination,
    Link, Typography,
    Button, Box, Popover, Stack
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import "pages/UploadCycles/UploadCycles.css"
import * as _ from 'lodash';
import moment from 'moment';

import { verifyUploadStatusForUploadCycleId } from "service/UploadDataRetrievalService";

import { DD_MM_YYYY_WITH_TIME_FORMAT } from 'utils/utils';
import { getDataForUploadCycle, getUploadStatusData } from 'service/UploadDataRetrievalService';
import { ArchiveProfileAndCount, ArchiveProfileAndCountAndTitles, SelectedUploadItem, UploadCycleTableData, UploadCycleTableDataDictionary, UploadCycleTableDataResponse } from 'mirror/types';
import { UPLOADS_QUEUED_PATH, UPLOADS_USHERED_PATH } from 'Routes';
import { MAX_ITEMS_LISTABLE } from 'utils/constants';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import Tooltip from '@mui/material/Tooltip';
import { DARK_RED, ERROR_RED, LIGHT_RED, SUCCESS_GREEN, WHITE_SMOKE } from 'constants/colors';
import { ellipsis } from 'pages/upload/ItemTooltip';
import Spinner from 'widgets/Spinner';
import { launchGradle } from 'service/launchUploader';


const UploadCycles = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortedData, setSortedData] = useState<UploadCycleTableData[]>([]);
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [anchorEl2, setAnchorEl2] = React.useState<HTMLButtonElement | null>(null);
    const [anchorEl3, setAnchorEl3] = React.useState<HTMLButtonElement | null>(null);
    const [anchorEl4, setAnchorEl4] = React.useState<HTMLButtonElement | null>(null);

    const [titlesForPopover, setTitlesForPopover] = useState(<></>);
    const [failedUploadsForPopover, setFailedUploadsForPopover] = useState(<></>);
    const [moveToFreezeRespPopover, setMoveToFreezeRespPopover] = useState(<></>);

    const [isLoading, setIsLoading] = useState<boolean>(false);

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
    };

    const open = Boolean(anchorEl);
    const open2 = Boolean(anchorEl2);
    const open3 = Boolean(anchorEl3);
    const open4 = Boolean(anchorEl4);
    console.log(`open ${open} ${open2} ${open3} ${open4}`);

    const id = open ? 'simple-popover' : undefined;
    const id2 = open2 ? 'simple-popover2' : undefined;
    const id3 = open3 ? 'simple-popover3' : undefined;
    const id4 = open4 ? 'simple-popover4' : undefined;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, sortedData?.length - page * rowsPerPage);

    const _verifyUploadStatus = async (event: React.MouseEvent<HTMLButtonElement>, _uploadCycleId: string) => {
        const currentTarget = event.currentTarget
        setIsLoading(true);
        const result: SelectedUploadItem[] = await verifyUploadStatusForUploadCycleId(_uploadCycleId);
        setIsLoading(false);
        const failedUploadListPanel = (
            <>
                <h4>Following Items Failed Upload</h4>
                {result?.map((item, index) =>
                    !item.isValid && <Box sx={{ color: ERROR_RED }}>({index + 1}) {item.archiveId.replaceAll(".pdf", "")}</Box>
                )}
            </>
        )
        setFailedUploadsForPopover(failedUploadListPanel);
        setAnchorEl3(currentTarget);
        console.log(`result ${JSON.stringify(result)}`);
    };

    const moveToFreeze = async (event: React.MouseEvent<HTMLButtonElement>, archiveProfileAndCount: ArchiveProfileAndCount[]) => {
        const currentTarget = event.currentTarget
        const _profiles = archiveProfileAndCount.map((arcProfAndCount: ArchiveProfileAndCount) => arcProfAndCount.archiveProfile);
        console.log(`_profiles ${_profiles}`)
        setIsLoading(true);
        const _resp = await launchGradle(_profiles.join(","))
        setIsLoading(false);
        const moveToFreezeRespPanel = (
            <>
                {_resp}
            </>
        )
        setMoveToFreezeRespPopover(moveToFreezeRespPanel);
        setAnchorEl4(currentTarget);
        console.log(`_tiles: ${event.currentTarget} ${JSON.stringify(moveToFreezeRespPanel)}`)
    }
    
    const findMissing = async (event: React.MouseEvent<HTMLButtonElement>, row: UploadCycleTableData) => {
        const currentTarget = event.currentTarget
        console.log("findMissing: eventCurTarget" + currentTarget)
        const uploadStatusData: ItemListResponseType = await getUploadStatusData(MAX_ITEMS_LISTABLE,
            true,
            row.uploadCycleId);
        const _titlesIntended = row?.archiveProfileAndCountIntended?.flatMap(x => x?.titles?.map(y => y.replace(".pdf", ""))) || []
        const _titlesUshered = uploadStatusData?.response?.map((x: Item) => x?.title || "")
        const missing = _titlesIntended?.filter((item) => !_titlesUshered?.includes(item || ""));
        const missingTitlesPanel = (
            <>
                {missing?.map((title, index) => <Box sx={{ color: ERROR_RED }}>({index + 1}) {title}</Box>)}
            </>
        )
        setTitlesForPopover(missingTitlesPanel);
        setAnchorEl2(currentTarget);
        console.log(`_tiles: ${event.currentTarget} ${JSON.stringify(missingTitlesPanel)}`)
    };

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
            equality
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
                                onClick={async (e: React.MouseEvent<HTMLButtonElement>) => await findMissing(e, row)}
                                size="small"
                                sx={{ color: "#f38484", width: "200px", marginTop: "10px" }}
                            >
                                Find Missing
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
                        <Button
                            variant="contained"
                            onClick={(e) => moveToFreeze(e, row.archiveProfileAndCount)}
                            size="small"
                            sx={{ width: "200px", marginTop: "10px" }}
                        >
                            Gradle Move to Freeze
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
                <>
                    {row.countIntended}

                    {row?.archiveProfileAndCountIntended?.map((archiveProfileAndCount: ArchiveProfileAndCountAndTitles) => (
                        <Box>
                            <Typography component="span">{archiveProfileAndCount.archiveProfile} </Typography>
                            <Typography component="span">{archiveProfileAndCount.count}</Typography>

                            <Typography component="div" sx={{ fontWeight: 600 }}>
                                <Button variant='contained'
                                    onClick={(e) => handleTitleClick(e, archiveProfileAndCount?.titles || [])}>
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
                </>
            ) : <>-</>
        return (
            <TableCell sx={{ verticalAlign: "top" }}>
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

    useEffect(() => {
        (async () => {
            const _data = await fetchUploadCycles();
            setSortedData(_data.map(x => x.uploadCycle));
        })();
    }, []);

    return (
        <Stack spacing="2">
            {isLoading && <Spinner />}

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
                                <TableRow key={row.uploadCycleId} sx={{ backgroundColor: `${row?.countIntended !== row?.totalCount ? LIGHT_RED : ""}` }}>
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
        </Stack>
    );
};


export default UploadCycles;
