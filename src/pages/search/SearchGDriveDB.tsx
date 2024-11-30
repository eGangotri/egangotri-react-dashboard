import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Stack, Box, TextField, Button, CircularProgress, Typography } from '@mui/material';
import { DataGrid, GridPaginationModel } from '@mui/x-data-grid';
;
import { GDriveData } from './types';
import { SEARCH_GDRIVE_DB_COLUMNS, SearchDBProps, searchGoogleDrive } from './SearchGDriveDBConsts';


export const getPdfDownloadLink = (driveId: string) => {
    return `https://drive.usercontent.google.com/download?id=${driveId}&export=download&authuser=0&confirm=t`
}

const SearchGDriveDB = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm<SearchDBProps>();

    const [isLoading, setIsLoading] = useState(false);
    const [gDriveSearchData, setGDriveSearchData] = useState<GDriveData[]>([]);
    const [filteredData, setFilteredData] = useState<GDriveData[]>([]);

    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        page: 0,
        pageSize: 10,
    });
    const [filterTerm, setFilterTerm] = useState<string>(''); // watch doesn't work for filter because of onChange
    const _searchTerm = watch('searchTerm');


    const _filterData = async (filterTerm: string) => {
        if (!filterTerm || filterTerm?.trim() === "") {
            setFilteredData(gDriveSearchData);
            return gDriveSearchData
        }
        else {
            console.log(`filterTerm ${JSON.stringify(filterTerm)}`)
            const regex = new RegExp(filterTerm, 'i'); // 'i' makes it case insensitive
            const filteredData = gDriveSearchData.filter(item => regex.test(item.titleGDrive));
            setFilteredData(filteredData);
            return filteredData
        }
    };


    const resetData = () => {
        setFilteredData([]);
        setGDriveSearchData([]);
        setFilterTerm("")
        reset()
    }


    const onSubmit = async (searchItem: SearchDBProps) => {
        setIsLoading(true);
        const result = await searchGoogleDrive(searchItem.searchTerm);
        setGDriveSearchData([]);
        setFilteredData([]);  // Clear filtered data if no results
        if (result?.length > 0) {
            setGDriveSearchData(result);
            console.log(`filterValue ${filterTerm}`);
            if (filterTerm) {
                const _data = await _filterData(filterTerm);
                setFilteredData(_data);
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
                    <Stack direction="column" spacing={2}>
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
                            sx={{ width: "100%" }}
                            helperText={errors.searchTerm?.message}
                        />
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
                        <div><Typography>Search Term ({gDriveSearchData?.length}): {_searchTerm}</Typography></div>
                        <div><Typography>Current filter value({filteredData?.length}): {filterTerm}</Typography></div>
                        <Box sx={{ marginTop: "10px" }}>
                            <TextField variant="outlined"
                                placeholder="Filter Results"
                                {...register('filter')}
                                error={Boolean(errors.filter)}
                                sx={{ marginRight: "30px", marginBottom: "20px", width: "100%" }}
                                helperText={errors.filter?.message}
                                onChange={(e: React.FocusEvent<HTMLInputElement>) => {
                                    console.log(`e.target.value ${e.target.value}`)
                                    setFilterTerm(e.target.value);
                                    _filterData(e.target.value);

                                }}
                            />
                        </Box>
                    </Stack>
                </form>
            </Box>
            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={filteredData}
                    columns={SEARCH_GDRIVE_DB_COLUMNS}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[5, 10, 25]}
                    disableRowSelectionOnClick
                    getRowId={(row) => row.identifier}
                />
            </Box>
        </Stack>
    );
};

export default SearchGDriveDB;

