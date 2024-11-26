import React, { useEffect, useState } from 'react';
import { DataGrid, GridPaginationModel, GridSearchIcon } from '@mui/x-data-grid';
import { Box, InputAdornment, TextField } from '@mui/material';
import { makeGetCall } from 'service/BackendFetchService';
import { archiveItemAggregateColumns, ArchiveItemAggregateType, archiveItemColumns } from './constants';


const ArchiveItemAggregates: React.FC = () => {
    const [items, setItems] = useState<ArchiveItemAggregateType[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [sortField, setSortField] = useState<string>("firstItemCreatedTime");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [loading, setLoading] = React.useState<boolean>(false);
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        page: 0,
        pageSize: 10,
    });
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredItems, setFilteredItems] = useState<ArchiveItemAggregateType[]>([]);

    // Handle pagination and sorting
    const handlePaginationChange = (model: GridPaginationModel) => {
        setPaginationModel(model);
    };
    useEffect(() => {
        fetchAggregates();
    }, [page, pageSize, sortField, sortOrder]);

    const fetchAggregates = async () => {
        try {
            setLoading(true);
            const response = await makeGetCall(
                "archiveItem/archiveDBStatsByProfile")
            console.log(`resp from fetchAggregates: ${JSON.stringify(response)}`);
            setItems(response?.response);
            setLoading(false);

        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };


    useEffect(() => {
        filterItems();
    }, [items, searchTerm]);


    const filterItems = () => {
        const filtered = items.filter((item) =>
            Object.values(item).some((value) =>
                value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredItems(filtered);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    return (
        <Box sx={{ height: 600, width: '100%' }}>
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-3">

                    <TextField
                        variant="outlined"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        sx={{ mb: 2 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <GridSearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>
            </div>
            <DataGrid
                rows={filteredItems.map((item, index) => ({ ...item, id: index }))}
                columns={archiveItemAggregateColumns}
                pageSizeOptions={[10, 20, 50]}
                paginationModel={paginationModel}
                onPaginationModelChange={handlePaginationChange}
                loading={loading}
                disableRowSelectionOnClick
                sortingOrder={["asc", "desc"]}
                initialState={{
                    pagination: { paginationModel: { pageSize: 10, page: 0 } },
                }}
            />
        </Box>
    );
};

export default ArchiveItemAggregates;
