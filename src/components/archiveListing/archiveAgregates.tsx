import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { Box } from '@mui/material';
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

    return (
        <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
                rows={items.map((item, index) => ({ ...item, id: index }))}
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
