import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Stack, Box, TextField, Button, CircularProgress, Typography } from '@mui/material';
import { DataGrid, GridPaginationModel } from '@mui/x-data-grid';
import { ArchiveData, SearchDBProps } from '../types';
import { SEARCH_ARCHIVE_DB_COLUMNS, searchArchiveDatabase } from './utils';
import ArchiveProfileSelector from '../ArchiveProfileSelector';
import { SEARCH_GDRIVE_DB_COLUMNS } from '../SearchGDriveDB/utils';


export const getPdfDownloadLink = (driveId: string) => {
    return `https://drive.usercontent.google.com/download?id=${driveId}&export=download&authuser=0&confirm=t`
}

const SearchArchiveDB = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm<SearchDBProps>();

    const [isLoading, setIsLoading] = useState(false);
    const [archiveProfiles, setArchiveProfiles] = useState<string[]>([]);

    const [archiveData, setArchiveData] = useState<ArchiveData[]>([]);
    const [filteredData, setFilteredData] = useState<ArchiveData[]>([]);

    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        page: 0,
        pageSize: 10,
    });
    const [filterTerm, setFilterTerm] = useState<string>(''); // watch doesn't work for filter because of onChange
    const _searchTerm = watch('searchTerm');


    const _filterData = (filterTerm: string, data: ArchiveData[]) => {
        if (!filterTerm || filterTerm?.trim() === "") {
            return data;
        } else {
            const regex = new RegExp(filterTerm, 'i');
            return data.filter(item => regex.test(item.originalTitle));
        }
    }

    const resetData = () => {
        setFilteredData([]);
        setArchiveData([]);
        setFilterTerm("")
        setArchiveProfiles([]);
        reset()
    }

    const onSubmit = async (searchItem: SearchDBProps) => {
        setIsLoading(true);
        const result = await searchArchiveDatabase(searchItem.searchTerm);
        setArchiveData([]);
        setFilteredData([]);  // Clear filtered data if no results
        if (result?.length > 0) {
            setArchiveData(result);
            console.log(`filterTerm ${filterTerm}`);
            if (filterTerm) {
                setFilteredData(_filterData(filterTerm, result));
            }
            else {
                setFilteredData(result);  // Set filtered data immediately
            }
        }
        setIsLoading(false);
    };

    return (
        <Stack spacing={2} sx={{ width: '100%' }}>
            <Box display="flex" alignItems="center" gap={4} mb={2}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack direction="row" spacing={2}>
                        <Box className="flex">
                            <TextField
                                variant="outlined"
                                placeholder="New Search"
                                {...register('searchTerm', {
                                    required: "This field is required",
                                    minLength: {
                                        value: 3,
                                        message: "This field requires a minimum of 3 characters"
                                    }
                                })}
                                error={Boolean(errors.searchTerm)}
                                className="mr-4 mb-5 w-full"
                                helperText={errors.searchTerm?.message}
                            />
                            <div className="ml-4">({archiveData?.length})</div>
                        </Box>
                        <Box className={"mt-2 flex"} >
                            <TextField variant="outlined"
                                placeholder="Filter Results"
                                {...register('filter')}
                                error={Boolean(errors.filter)}
                                className="mr-4 mb-5 w-full"
                                helperText={errors.filter?.message}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const newFilterTerm = e.target.value;
                                    setFilterTerm(newFilterTerm);
                                    setFilteredData(_filterData(newFilterTerm, archiveData));
                                }}
                            />
                            <div className='ml-4'>({filteredData?.length})</div>
                        </Box>
                        <ArchiveProfileSelector archiveProfiles={archiveProfiles} setFilteredData={setFilteredData} filteredData={filteredData} />
                        <Box>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                sx={{ marginRight: "10px" }}
                                disabled={isLoading}
                            >
                                {isLoading ? <CircularProgress size={24} /> : 'Search'}
                            </Button>
                            <Button variant="contained" color="primary" type="reset" onClick={() => resetData()}>
                                Reset
                            </Button>
                        </Box>
                    </Stack>
                </form>
            </Box>
            <Box sx={{ width: '100%' }}>
                <DataGrid
                    rows={filteredData}
                    columns={SEARCH_ARCHIVE_DB_COLUMNS}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[10, 25, 50]}
                    disableRowSelectionOnClick
                    getRowId={(row) => row.identifier}
                    autoHeight
                />
            </Box>
        </Stack>
    );
};

export default SearchArchiveDB;

