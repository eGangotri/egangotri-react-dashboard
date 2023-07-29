import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Link, Typography } from '@mui/material';
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


const UploadCycles = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortedData, setSortedData] = useState<UploadCycleTableData[]>([]);

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, sortedData?.length - page * rowsPerPage);

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


    const TableCellForEqualityCount: React.FC = () => {
        return (
            <TableCell>Ushered/Queued Eqality
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

    async function fetchMyAPI() {
        const dataForUploadCycle: UploadCycleTableDataDictionary[] = await getDataForUploadCycle(MAX_ITEMS_LISTABLE);
        return dataForUploadCycle;
    }

    useEffect(() => {
        (async () => {
            const _data = await fetchMyAPI();
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
                            <TableCell>Profile and Upload Count ( Ushered )</TableCell>
                            <TableCell>Profile and Upload Count ( Queued )</TableCell>
                            <TableCellForEqualityCount />
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
                                <TableCell className="centerAligned" sx={(row?.totalCount === row?.totalQueueCount) ? { color: SUCCESS_GREEN } : { color: ERROR_RED }}>
                                    <Typography>{row?.totalCount} == {row?.totalQueueCount}</Typography>
                                </TableCell>
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
