import { Box, Button, Paper, Stack, Table, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Link, TablePagination, TableBody } from '@mui/material';
import { LIGHT_RED } from 'constants/colors';
import { UploadCycleTableData } from 'mirror/types';
import moment from 'moment';
import ItemToolTip from 'pages/upload/ItemTooltip';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { DD_MM_YYYY_WITH_TIME_FORMAT } from 'utils/utils';
import Spinner from 'widgets/Spinner';

interface ArchiveData {
    link: string,
    allDownloads: string,
    pdfDownloadLink: string,
    originalTitle: string,
    titleArchive: string,
    description: string,
    subject: string,
    date: string,
    acct: string,
    identifier: string,
    type: string,
    mediaType: string, size: string, sizeFormatted: string
}

interface SearchDBProps {
    searchTerm: string
}

const SearchDB = () => {

    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<SearchDBProps>();
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortedData, setSortedData] = useState<ArchiveData[]>([]);
    const [page, setPage] = useState(0);
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, sortedData?.length - page * rowsPerPage);

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSort = (column: keyof ArchiveData) => {
        const sorted = [...sortedData].sort((a, b) => {
            const aCom = a[column] || "";
            const bCol = b[column] || "";
            if (aCom < bCol) return -1;
            if (aCom > bCol) return 1;
            return 0;
        });
        setSortedData(sorted);
    }
    const onSubmit = async (searchItem: SearchDBProps) => {
        setIsLoading(true);
        console.log(`searchItem ${JSON.stringify(searchItem)}`)
        const regex = new RegExp(searchItem.searchTerm, 'i'); // 'i' makes it case insensitive
        const filteredData = sortedData.filter(item => regex.test(item.originalTitle));
        setSortedData(filteredData);
        setIsLoading(false);
    };

    async function fetchData() {
        // const response =
        //     await fetch('https://mocki.io/v1/72027344-f5b0-46a3-9dcc-8c7394070193');
        // const data = await response.json();
        const data: ArchiveData[] = [
            {
                link: 'https://archive.org/details/ShivaPuranaHindiPg.1371024NavalKishorePress',
                allDownloads: 'https://archive.org/download/ShivaPuranaHindiPg.1371024NavalKishorePress',
                pdfDownloadLink: 'https://archive.org/download/ShivaPuranaHindiPg.1371024NavalKishorePress/Shiva Purana Hindi Pg. 137 - 1024 - Naval Kishore Press.pdf',
                originalTitle: 'Shiva Purana Hindi Pg. 137 - 1024 - Naval Kishore Press',
                titleArchive: 'Shiva Purana Hindi Pg. 137 1024 Naval Kishore Press',
                description: 'Naval Kishore Press(1858-Present) Publications',
                subject: 'Naval Kishor Press Publications,नवल किशोर प्रेस प्रकाशन',
                date: '2017-05-10T14:19:56Z',
                acct: 'navalkishorepress',
                identifier: 'ShivaPuranaHindiPg.1371024NavalKishorePress',
                type: 'item',
                mediaType: 'texts',
                size: '5305052202',
                sizeFormatted: '4.94 GB'
            },
            {
                "link": "https://archive.org/details/VasantikaByGangaPrasadPandey1940NavalKishorePress",
                "allDownloads": "https://archive.org/download/VasantikaByGangaPrasadPandey1940NavalKishorePress",
                "pdfDownloadLink": "https://archive.org/download/VasantikaByGangaPrasadPandey1940NavalKishorePress/Vasantika by Ganga Prasad Pandey 1940 - Naval Kishore Press.pdf",
                "originalTitle": "Vasantika by Ganga Prasad Pandey 1940 - Naval Kishore Press",
                "titleArchive": "Vasantika By Ganga Prasad Pandey 1940 Naval Kishore Press",
                "description": "Naval Kishore Press(1858-Present) Publications",
                "subject": "Naval Kishor Press Publications,नवल किशोर प्रेस प्रकाशन",
                "date": "2017-05-10T12:30:07Z",
                "acct": "navalkishorepress",
                "identifier": "VasantikaByGangaPrasadPandey1940NavalKishorePress",
                "type": "item",
                "mediaType": "texts",
                "size": "165269984",
                "sizeFormatted": "157.61 MB"
            },
            {
                "link": "https://archive.org/details/UpanishadSarSangrahaWithEnglishTranslationOfRaiBahadurPt.Kashinath1933NavalKishorePress",
                "allDownloads": "https://archive.org/download/UpanishadSarSangrahaWithEnglishTranslationOfRaiBahadurPt.Kashinath1933NavalKishorePress",
                "pdfDownloadLink": "https://archive.org/download/UpanishadSarSangrahaWithEnglishTranslationOfRaiBahadurPt.Kashinath1933NavalKishorePress/Upanishad Sar Sangraha with English Translation of Rai Bahadur Pt. Kashinath 1933 - Naval Kishore Press.pdf",
                "originalTitle": "Upanishad Sar Sangraha with English Translation of Rai Bahadur Pt. Kashinath 1933 - Naval Kishore Press",
                "titleArchive": "Upanishad Sar Sangraha With English Translation Of Rai Bahadur Pt. Kashinath 1933 Naval Kishore Press",
                "description": "Naval Kishore Press(1858-Present) Publications",
                "subject": "Naval Kishor Press Publications,नवल किशोर प्रेस प्रकाशन",
                "date": "2017-05-10T12:24:49Z",
                "acct": "navalkishorepress",
                "identifier": "UpanishadSarSangrahaWithEnglishTranslationOfRaiBahadurPt.Kashinath1933NavalKishorePress",
                "type": "item",
                "mediaType": "texts",
                "size": "467168753",
                "sizeFormatted": "445.53 MB"
            }
        ];
        console.log(`data ${JSON.stringify(data)}`);
        return data;
    }

    useEffect(() => {
        (async () => {
            const _data = await fetchData();
            setSortedData(_data);
        })();
    }, []);

    return (
        <Stack spacing={2} sx={{ width: '100%' }}>
            <Box display="flex" alignItems="center" gap={4} mb={2}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack direction={"row"}>
                        <TextField variant="outlined"
                            placeholder="Search"
                            {...register('searchTerm', { required: "This field is required" })}
                            error={Boolean(errors.searchTerm)}
                            sx={{ marginRight: "30px", marginBottom: "20px", width: "200%" }}
                            helperText={errors.searchTerm?.message} />
                        {isLoading && <Spinner />}
                    </Stack>

                    <Box sx={{ marginTop: "10px" }}>
                        <Button variant="contained" color="primary" type="submit" sx={{ marginRight: "10px" }}>
                            Search
                        </Button>
                        <Button variant="contained" color="primary" type="reset" onClick={() => reset()}>
                            Reset
                        </Button>
                    </Box>
                </form>
            </Box>
            <Box>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell onClick={() => handleSort('link')}><Link>Link</Link></TableCell>
                                <TableCell onClick={() => handleSort('allDownloads')}><Link>All Downloads Link Page</Link></TableCell>
                                <TableCell onClick={() => handleSort('pdfDownloadLink')}><Link>Pdf Download Link</Link></TableCell>
                                <TableCell onClick={() => handleSort('originalTitle')}><Link>Original Title</Link></TableCell>
                                <TableCell onClick={() => handleSort('titleArchive')}><Link>Title-Archive</Link></TableCell>
                                <TableCell onClick={() => handleSort('description')}><Link>Description</Link></TableCell>
                                <TableCell onClick={() => handleSort('subject')}><Link>Subject</Link></TableCell>
                                <TableCell onClick={() => handleSort('date')}><Link>Date</Link></TableCell>
                                <TableCell onClick={() => handleSort('acct')}><Link>Acct</Link></TableCell>
                                <TableCell onClick={() => handleSort('identifier')}><Link>Identifier</Link></TableCell>
                                {/* <TableCell onClick={() => handleSort('type')}><Link>Type</Link></TableCell>
                                <TableCell onClick={() => handleSort('mediaType')}><Link>Media Type</Link></TableCell>
                                <TableCell onClick={() => handleSort('size')}><Link>Size</Link></TableCell> */}
                                <TableCell onClick={() => handleSort('sizeFormatted')}><Link>Size Formatted</Link></TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(rowsPerPage > 0
                                ? sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : sortedData
                            ).map((row: ArchiveData) => (
                                <TableRow key={row.link}>
                                    <TableCell sx={{ verticalAlign: "top" }}>
                                        <ItemToolTip input={row.link} url={true} />
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: "top" }}>
                                        <ItemToolTip input={row.allDownloads} url={true} />
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: "top" }}>
                                        <ItemToolTip input={row.pdfDownloadLink} url={true} />
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: "top" }}>
                                        <ItemToolTip input={row.originalTitle} />
                                    </TableCell>


                                    <TableCell sx={{ verticalAlign: "top" }}>
                                        <ItemToolTip input={row.titleArchive} />
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: "top" }}>
                                        <ItemToolTip input={row.description} />
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: "top" }}>
                                        <ItemToolTip input={row.subject} />
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: "top" }}>{moment(row.date).format(DD_MM_YYYY_WITH_TIME_FORMAT)}</TableCell>
                                    <TableCell sx={{ verticalAlign: "top" }}>
                                        <ItemToolTip input={row.acct} />
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: "top" }}>
                                        <ItemToolTip input={row.identifier} />
                                    </TableCell>
                                    {/* <TableCell sx={{ verticalAlign: "top" }}>
                                        <ItemToolTip input={row.type} />
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: "top" }}>
                                        <ItemToolTip input={row.mediaType} />
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: "top" }}>
                                        <ItemToolTip input={row.size} />
                                    </TableCell> */}
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
                    count={sortedData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Box>
        </Stack>
    )

}
export default SearchDB;