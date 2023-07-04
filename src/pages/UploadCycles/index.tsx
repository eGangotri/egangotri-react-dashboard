import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';
import "pages/UploadCycles/UploadCycles.css"
import moment from 'moment';
import { DD_MM_YYYY_WITH_TIME_FORMAT } from 'utils/utils';

interface ArchiveProfileAndCount {
    archiveProfile: string;
    count: number;
}

interface Data {
    uploadCycleId: number;
    archiveProfileAndCount: ArchiveProfileAndCount[];
    dateTimeUploadStarted: Date;
    totalCount: number;
}


const UploadCycles = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortedData, setSortedData] = useState<Data[]>([]);

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, sortedData?.length - page * rowsPerPage);

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSort = (column: keyof Data) => {
        const sorted = [...sortedData].sort((a, b) => {
            if (a[column] < b[column]) return -1;
            if (a[column] > b[column]) return 1;
            return 0;
        });
        setSortedData(sorted);
    };


    async function fetchMyAPI() {
        return [
            {
                uploadCycleId: 1, archiveProfileAndCount:
                    [{ archiveProfile: 'VT', count: 20 },
                    { archiveProfile: 'SPS', count: 43 }],
                dateTimeUploadStarted: new Date(),
                totalCount: 63
            },
            {
                uploadCycleId: 2,
                archiveProfileAndCount: [{ archiveProfile: 'JAMMU', count: 23 }],
                dateTimeUploadStarted: new Date(),
                totalCount: 23
            },
            {
                uploadCycleId: 3,
                archiveProfileAndCount: [{ archiveProfile: 'KM', count: 4 }],
                dateTimeUploadStarted: new Date(),
                totalCount: 4
            },
        ];

    }

    useEffect(() => {
        (async () => {
            const _data = await fetchMyAPI();
            console.log(`after _data ${JSON.stringify(_data)}`);
            setSortedData(_data);
        })();
    }, []);

    // conso

    return (
        <div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell onClick={() => handleSort('uploadCycleId')}>Upload Cycle Id</TableCell>
                            <TableCell>Profile and Upload Count</TableCell>
                            <TableCell onClick={() => handleSort('dateTimeUploadStarted')}>Time Started</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(rowsPerPage > 0
                            ? sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : sortedData
                        ).map((row: Data) => (
                            <TableRow key={row.uploadCycleId}>
                                <TableCell>{row.uploadCycleId}</TableCell>
                                <TableCell>
                                    <Table>
                                        <TableBody>
                                            {row.archiveProfileAndCount.map((arcProfAndCount: ArchiveProfileAndCount) =>
                                            (
                                                <TableRow>
                                                    <TableCell className="centerAligned">{row.archiveProfileAndCount[0].archiveProfile}</TableCell>
                                                    <TableCell className="centerAligned">{row.archiveProfileAndCount[0].count}</TableCell>
                                                </TableRow>
                                            )
                                            )
                                            }
                                        </TableBody>
                                    </Table>
                                </TableCell>
                                <TableCell>{row.totalCount}</TableCell>
                                <TableCell>{moment(row.dateTimeUploadStarted).format(DD_MM_YYYY_WITH_TIME_FORMAT)}</TableCell>
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
