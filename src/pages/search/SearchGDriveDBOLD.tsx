import React, { useEffect } from 'react'
import { Box, Button, Paper, Stack, Table, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Link, TablePagination, TableBody, Select, OutlinedInput, Checkbox, ListItemText, MenuItem, SelectChangeEvent, useTheme, CircularProgress } from '@mui/material';
import moment from 'moment';
import ItemToolTip, { ellipsis } from 'widgets/ItemTooltip';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { DD_MM_YYYY_WITH_TIME_FORMAT } from 'utils/utils';
import Spinner from 'widgets/Spinner';
import { GDriveData } from './types';
import { FaDownload } from "react-icons/fa";
import { getGDrivePdfDownloadLink } from 'mirror/GoogleDriveUtilsCommonCode';
import { makePostCall } from 'mirror/utils';

export const getPdfDownloadLink = (driveId: string) => {
    return `https://drive.usercontent.google.com/download?id=${driveId}&export=download&authuser=0&confirm=t`
}
interface SearchDBProps {
    searchTerm: string
    filter?: string
}

const SearchGDriveDBOld = () => {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const { register, handleSubmit, watch, getValues, formState: { errors }, reset } = useForm<SearchDBProps>({
        defaultValues: {
            searchTerm: '',
            filter: ''
        }
    });
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortedData, setSortedData] = useState<GDriveData[]>([]);
    const [filteredData, setFilteredData] = useState<GDriveData[]>([]);
    const [page, setPage] = useState(0);
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredData?.length - page * rowsPerPage);
    const [filterValue, setFilterValue] = useState<string>(''); // watch doesn't work for filter because of onChange
    const _searchTerm = watch('searchTerm');

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSort = (column: keyof GDriveData) => {
        const sorted = [...filteredData]?.sort((a, b) => {
            const aCom = a[column] || "";
            const bCol = b[column] || "";
            if (aCom < bCol) return -1;
            if (aCom > bCol) return 1;
            return 0;
        });
        setFilteredData(sorted);
    }

    const resetData = () => {
        setFilteredData([]);
        setSortedData([]);
        setFilterValue("")
        reset()
    }

    const onSubmit = async (searchItem: SearchDBProps) => {
        setIsLoading(true);
        const result = await fetchData(searchItem.searchTerm);
        setSortedData([]);
        setFilteredData([]);  // Clear filtered data if no results
        if (result?.length > 0) {
            setSortedData(result);
            console.log(`filterValue ${filterValue}`);
            if (filterValue) {
                const _data = await _filterData(filterValue);
                setFilteredData(_data);
            }
            else {
                setFilteredData(result);  // Set filtered data immediately
            }
        }
        setIsLoading(false);
    };

    const _filterData = async (filterTerm: string) => {
        if (!filterTerm || filterTerm?.trim() === "") {
            setFilteredData(sortedData);
            return sortedData
        }
        else {
            console.log(`filterTerm ${JSON.stringify(filterTerm)}`)
            const regex = new RegExp(filterTerm, 'i'); // 'i' makes it case insensitive
            const filteredData = sortedData.filter(item => regex.test(item.titleGDrive));
            setFilteredData(filteredData);
            return filteredData
        }
    };

    async function fetchData(searchTerm: string) {
        const resource =
            `googleDriveDB/search`;

        const data = await makePostCall({ searchTerm },
            resource);

        console.log(`data size:${data?.response?.length}`);
        return data.response;
    }

    return (
        <Stack spacing={2} sx={{ width: '100%' }}>
            <Box display="flex" alignItems="center" gap={4} mb={2}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack direction={"column"}>
                        <TextField variant="outlined"
                            placeholder="Search"
                            {...register('searchTerm', {
                                required: "This field is required",
                                minLength: {
                                    value: 3,
                                    message: "This field requires a minimum of 3 characters"
                                }
                            })}
                            error={Boolean(errors.searchTerm)}
                            sx={{ marginRight: "30px", marginBottom: "20px", width: "200%" }}
                            helperText={errors.searchTerm?.message}
                        />
                        <Box sx={{ marginTop: "10px" }}>
                            <Button
                                variant="contained"
                                color="primary" type="submit" sx={{ marginRight: "10px" }}
                                disabled={isLoading}
                            >
                                {isLoading ? <CircularProgress size={24} /> : 'Search'}
                            </Button>
                            <Button variant="contained" color="primary" type="reset" onClick={() => resetData()}>
                                Reset
                            </Button>
                        </Box>
                        <div><Typography>Search Term ({sortedData?.length}): {_searchTerm}</Typography></div>
                        <div><Typography>Current filter value({filteredData?.length}): {filterValue}</Typography></div>


                        <Box sx={{ marginTop: "10px" }}>
                            <TextField variant="outlined"
                                placeholder="Filter Results"
                                {...register('filter')}
                                error={Boolean(errors.filter)}
                                sx={{ marginRight: "30px", marginBottom: "20px", width: "100%" }}
                                helperText={errors.filter?.message}
                                onChange={(e: React.FocusEvent<HTMLInputElement>) => {
                                    console.log(`e.target.value ${e.target.value}`)
                                    _filterData(e.target.value);
                                    setFilterValue(e.target.value);

                                }}
                            />
                        </Box>
                    </Stack>
                </form>
            </Box >
            <Box>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Thumbnail</TableCell>
                                <TableCell onClick={() => handleSort('titleGDrive')}><Link>Title - Google Drive</Link></TableCell>
                                <TableCell onClick={() => handleSort('gDriveLink')}><Link>Google Drive Link</Link></TableCell>
                                <TableCell onClick={() => handleSort('truncFileLink')}><Link>First and Last 10 Pages</Link></TableCell>
                                <TableCell>Page Count</TableCell>
                                <TableCell onClick={() => handleSort('sizeWithUnits')}><Link>Size With Units</Link></TableCell>
                                <TableCell onClick={() => handleSort('createdTime')}><Link>Date</Link></TableCell>
                                <TableCell onClick={() => handleSort('source')}><Link>Source</Link></TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(rowsPerPage > 0
                                ? filteredData?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : filteredData
                            )?.map((row: GDriveData) => (
                                <TableRow key={row.titleGDrive}>
                                    <TableCell sx={{ verticalAlign: "top" }}>
                                        <img src={"https://drive.google.com/thumbnail?id=" + row.identifierTruncFile}
                                            referrerPolicy="no-referrer"
                                            alt={ellipsis(`https://lh3.googleusercontent.com/d/${row.identifierTruncFile}?authuser=0`) as string} />
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: "top" }}>
                                        <ItemToolTip input={row.titleGDrive} noEllipsis={true} />
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: "top" }}>
                                        <ItemToolTip input={row.gDriveLink} url={true}
                                            reactComponent={<FaDownload onClick={() => {
                                                window.open(getGDrivePdfDownloadLink(row.identifier), '_blank');
                                            }}></FaDownload>} />
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: "top" }}>
                                        <ItemToolTip input={row.truncFileLink} url={true} reactComponent={<FaDownload onClick={() => {
                                            window.open(getGDrivePdfDownloadLink(row.identifierTruncFile), '_blank');
                                        }}></FaDownload>} />
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: "top" }}>
                                        {row.pageCount}
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: "top" }}>
                                        <ItemToolTip input={row.sizeWithUnits} />
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: "top" }}>{moment(row.createdTime).format(DD_MM_YYYY_WITH_TIME_FORMAT)}</TableCell>
                                    <TableCell sx={{ verticalAlign: "top" }}>
                                        {row.source}
                                    </TableCell>
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
                    count={filteredData?.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Box>
        </Stack >
    )

}
export default SearchGDriveDBOld;