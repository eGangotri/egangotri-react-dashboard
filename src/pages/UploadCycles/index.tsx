import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper,
    TablePagination,
    Link, Typography,
    Button, Box
} from '@mui/material';
import "pages/UploadCycles/UploadCycles.css"
import * as _ from 'lodash';
import moment from 'moment';

import { DD_MM_YYYY_WITH_TIME_FORMAT } from 'utils/utils';
import { getDataForUploadCycle } from 'service/UploadDataRetrievalService';
import { ArchiveProfileAndCount, UploadCycleTableData, UploadCycleTableDataDictionary, UploadCycleTableDataResponse } from 'mirror/types';
import { UPLOADS_QUEUED_PATH, UPLOADS_USHERED_PATH } from 'Routes';
import { MAX_ITEMS_LISTABLE } from 'utils/constants';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import Tooltip from '@mui/material/Tooltip';
import { ERROR_RED, PRIMARY_BLUE, SUCCESS_GREEN } from 'constants/colors';
import { ellipsis } from 'pages/upload/ItemTooltip';


const UploadCycles = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortedData, setSortedData] = useState<UploadCycleTableData[]>([]);

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, sortedData?.length - page * rowsPerPage);

    const verifyUploadStatus = (event: React.MouseEvent<HTMLButtonElement> | null) => {
        alert("To be Implemented");
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

    const TableRowCellForEqualityCount: React.FC<{ row: UploadCycleTableData }> = ({ row }) => {
        const hasUploadCycleGlobalValues = (row?.countIntended || 0) > 0;
        const equality = hasUploadCycleGlobalValues ? ((row?.totalCount === row?.totalQueueCount) && (row?.countIntended === row?.totalQueueCount)) : (row?.totalCount === row?.totalQueueCount)
        const equalityLabel = hasUploadCycleGlobalValues ? `${row?.countIntended} == ${row?.totalCount} == ${row?.totalQueueCount}` : `${row?.totalCount} == ${row?.totalQueueCount}`;
        return (
            <TableCell className="centerAligned" sx={equality ? { color: SUCCESS_GREEN } : { color: ERROR_RED }}>
                <Typography>{equalityLabel}
                    <Typography component="span" sx={{ paddingLeft: "10px" }}>
                        <Button
                            variant="contained"
                            onClick={verifyUploadStatus}
                            sx={{ textAlign: "left", padding: "10px 10px 10px 10px" }}
                        >
                            Verify Upload Status
                        </Button>
                    </Typography>
                </Typography>
            </TableCell>
        )
    }

    const TableRowCellForUploadCycleGlobalStats: React.FC<{ row: UploadCycleTableData }> = ({ row }) => {
        const hasUploadCycleGlobalValues = (row?.countIntended || 0) > 0;
        const uploadstats2 = hasUploadCycleGlobalValues ? `${row.countIntended} /(${row.archiveProfileAndCountIntended?.map((x: ArchiveProfileAndCount) => `${x.archiveProfile}(${x.count})`).join(",")})` : "-";
        const uploadstats =
            hasUploadCycleGlobalValues ? (
                <>
                    {row.countIntended}

                    {row?.archiveProfileAndCountIntended?.map((x: ArchiveProfileAndCount) => (
                        <Box>
                            <Typography component="span">{x.archiveProfile} </Typography>
                            <Typography component="span">{x.count}</Typography>
                            <Tooltip title={
                                <>
                                {x?.titles?.map(y=>(
                                    <Box>{y.replaceAll(".pdf", "")}</Box>
                                ))}
                                </>
                            }>
                                <Typography component="div" sx={{fontWeight:600}}>Titles: {ellipsis(x?.titles?.join(",") || "")}</Typography>
                            </Tooltip>

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
                <Typography>Final Step to establish 100% uploading is click (Verfiy Upload Status) Button</Typography>
            </TableCell>
        )
    }


    const TableHeaderCellForUploadCycleStats: React.FC = () => {
        return (
            <TableCell>Uploads Intended
                <Tooltip title="This Column establishes that uploads meant to be dumped online (the Queue Count) is same as the ones that were actually attempted for upload(the Ushered Count)">
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
        const equality = row.totalCount === row.totalQueueCount ? "YES" : "NO";
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
        <div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell onClick={() => handleSort('uploadCycleId')}><Link>Upload Cycle Id</Link></TableCell>
                            <TableHeaderCellForUploadCycleStats />
                            <TableCell>( Ushered ) Stats </TableCell>
                            <TableCell>( Queued ) Stats </TableCell>
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
                            <TableRow key={row.uploadCycleId}>
                                <TableCell sx={{ verticalAlign: "top" }}>
                                    <Link href={`${UPLOADS_USHERED_PATH}?uploadCycleId=${row.uploadCycleId}`}>{row.uploadCycleId}</Link>
                                </TableCell>
                                <TableRowCellForUploadCycleGlobalStats row={row} />
                                <TableCell sx={{ verticalAlign: "top" }}>
                                    <Table>
                                        <TableBody>
                                            <ProfileAndCount row={row} forQueue={false} />
                                        </TableBody>
                                    </Table>
                                </TableCell>
                                <TableCell>
                                    <Table>
                                        <TableBody>
                                            <ProfileAndCount row={row} forQueue={true} />
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
    );
};


export default UploadCycles;
