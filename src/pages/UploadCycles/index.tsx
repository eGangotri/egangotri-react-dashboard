import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Link } from '@mui/material';
import "pages/UploadCycles/UploadCycles.css"
import moment from 'moment';
import { DD_MM_YYYY_WITH_TIME_FORMAT } from 'utils/utils';
import { getDataForUploadCycle } from 'service/UploadDataRetrievalService';
import { ArchiveProfileAndCount, UploadCycleTableData, UploadCycleTableDataDictionary, UploadCycleTableDataResponse } from 'mirror/types';
import { UPLOADS_USHERED_PATH } from 'Routes';
import { MAX_ITEMS_LISTABLE } from 'utils/constants';

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
            if (a[column] < b[column]) return -1;
            if (a[column] > b[column]) return 1;
            return 0;
        });
        setSortedData(sorted);
    };


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
                            <TableCell onClick={() => handleSort('uploadCycleId')}>Upload Cycle Id</TableCell>
                            <TableCell>Profile and Upload Count</TableCell>
                            <TableCell onClick={() => handleSort('totalCount')}>Total Count</TableCell>
                            <TableCell onClick={() => handleSort('datetimeUploadStarted')}>Time Started</TableCell>
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
                                <TableCell>
                                    <Table>
                                        <TableBody>
                                            {row.archiveProfileAndCount.map((arcProfAndCount: ArchiveProfileAndCount) =>
                                            (
                                                <TableRow key={arcProfAndCount.archiveProfile}>
                                                    <TableCell className="centerAligned">{arcProfAndCount.archiveProfile}</TableCell>
                                                    <TableCell className="centerAligned">{arcProfAndCount.count}</TableCell>
                                                </TableRow>
                                            )
                                            )
                                            }
                                        </TableBody>
                                    </Table>
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
