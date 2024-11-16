import { Box, Button, Paper, Stack, Table, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Link, TablePagination, TableBody, Select, OutlinedInput, Checkbox, ListItemText, MenuItem, SelectChangeEvent, useTheme } from '@mui/material';
import moment from 'moment';
import ItemToolTip from 'widgets/ItemTooltip';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { DD_MM_YYYY_WITH_TIME_FORMAT } from 'utils/utils';
import Spinner from 'widgets/Spinner';
import ArchiveProfileSelector from './ArchiveProfileSelector';
import { ArchiveData } from './types';
import { FaDownload } from "react-icons/fa";
import { makePostCall } from 'mirror/utils';

const generateThumbnail = (identifier: string) => {
    return `https://archive.org/services/img/${identifier}`;

}

interface SearchDBProps {
    searchTerm: string
    filter?: string
}

const SearchArchiveDB = () => {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [archiveProfiles, setArchiveProfiles] = React.useState<string[]>([]);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<SearchDBProps>();
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortedData, setSortedData] = useState<ArchiveData[]>([]);
    const [filteredData, setFilteredData] = useState<ArchiveData[]>([]);
    const [page, setPage] = useState(0);
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredData?.length - page * rowsPerPage);

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleArchiveProfileChange = (event: SelectChangeEvent<typeof archiveProfiles>) => {

        console.log(`handleArchiveProfileChange:event.target.value ${event.target.value}`)
    }

    const handleSort = (column: keyof ArchiveData) => {
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
        setArchiveProfiles([]);
    }

    const onSubmit = async (searchItem: SearchDBProps) => {
        setIsLoading(true);
        const result = await fetchData(searchItem.searchTerm);
        if (result?.length > 0) {
            setSortedData(result);
            setFilteredData(result);
            const _profiles = result.map((item: ArchiveData) => item.acct);
            setArchiveProfiles(Array.from(new Set<string>(_profiles)));
        }
        setIsLoading(false);
    };

    const filterData = async (filterTerm: string) => {
        if (!filterTerm || filterTerm?.trim() === "") {
            setFilteredData(sortedData);
        }
        console.log(`filterTerm ${JSON.stringify(filterTerm)}`)
        const regex = new RegExp(filterTerm, 'i'); // 'i' makes it case insensitive
        const filteredData = sortedData.filter(item => regex.test(item.originalTitle));
        setFilteredData(filteredData);
    };

    async function fetchData(searchTerm: string) {
        const resource =
            `searchArchivesDB/search`;

        const data = await makePostCall({ searchTerm },
            resource);
        console.log(`data ${JSON.stringify(data)}`);
        return data.response;
    }

    const theme = useTheme();

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
                        <ArchiveProfileSelector archiveProfiles={archiveProfiles} setFilteredData={setFilteredData} filteredData={filteredData} />
                        {isLoading && <Spinner />}

                        <Box sx={{ marginTop: "10px" }}>
                            <Button variant="contained" color="primary" type="submit" sx={{ marginRight: "10px" }}>
                                Search
                            </Button>
                            <Button variant="contained" color="primary" type="reset" onClick={() => resetData()}>
                                Reset
                            </Button>
                        </Box>
                        <Box sx={{ marginTop: "10px" }}>
                            <TextField variant="outlined"
                                placeholder="Filter Results"
                                {...register('filter')}
                                error={Boolean(errors.filter)}
                                sx={{ marginRight: "30px", marginBottom: "20px", width: "100%" }}
                                helperText={errors.filter?.message}
                                onChange={(e: React.FocusEvent<HTMLInputElement>) => {
                                    console.log(`e.target.value ${e.target.value}`)
                                    filterData(e.target.value);
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
                                <TableCell onClick={() => handleSort('link')}><Link>Pdf View Link</Link></TableCell>
                                <TableCell onClick={() => handleSort('allDownloadsLinkPage')}><Link>All Downloads Link Page</Link></TableCell>
                                <TableCell onClick={() => handleSort('originalTitle')}><Link>Original Title</Link></TableCell>
                                <TableCell onClick={() => handleSort('titleArchive')}><Link>Title-Archive</Link></TableCell>
                                <TableCell onClick={() => handleSort('date')}><Link>Archive.org Upload Date</Link></TableCell>
                                <TableCell onClick={() => handleSort('acct')}><Link>Acct</Link></TableCell>
                                <TableCell>Page Count</TableCell>
                                <TableCell onClick={() => handleSort('sizeFormatted')}><Link>Size Formatted</Link></TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(rowsPerPage > 0
                                ? filteredData?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : filteredData
                            )?.map((row: ArchiveData) => (
                                <TableRow key={row.link}>
                                    <TableCell>
                                        <img src={generateThumbnail(row.identifier)} alt={row.originalTitle} />
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: "top" }}>
                                        <ItemToolTip input={row.link} url={true}
                                            reactComponent={<FaDownload onClick={() => {
                                                window.open(row.pdfDownloadLink, '_blank');
                                            }}></FaDownload>}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: "top" }}>
                                        <ItemToolTip input={row.allDownloadsLinkPage} url={true} />
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: "top" }}>
                                        <ItemToolTip input={row.originalTitle} />
                                    </TableCell>


                                    <TableCell sx={{ verticalAlign: "top" }}>
                                        <ItemToolTip input={row.titleArchive} />
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: "top" }}>{moment(row.date).format(DD_MM_YYYY_WITH_TIME_FORMAT)}</TableCell>
                                    <TableCell sx={{ verticalAlign: "top" }}>
                                        <ItemToolTip input={row.acct} />
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: "top" }}>
                                        {row.pageCount}
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: "top" }}>
                                        <ItemToolTip input={row.sizeFormatted} />
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
export default SearchArchiveDB;