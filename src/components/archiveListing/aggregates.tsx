import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { makeGetCall } from 'service/BackendFetchService';
import { archiveItemAggregateColumns, ArchiveItemAggregateType, archiveItemColumns } from './constants';


const ArchiveItemAggregates: React.FC = () => {
    const [items, setItems] = useState<ArchiveItemAggregateType[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [sortField, setSortField] = useState<string>("firstItemCreatedTime");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    useEffect(() => {
        fetchAggregates();
    }, [page, pageSize, sortField, sortOrder]);
    
    const fetchAggregates = async () => {
        try {
            const response = await makeGetCall(
                "archiveItem/archiveDBStatsByProfile")
            console.log(`resp from fetchAggregates: ${JSON.stringify(response)}`);
            setItems(response?.response);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };
    
    return (
        <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
                rows={items.map((item, index) => ({ ...item, id: index }))}
                columns={archiveItemAggregateColumns}
                pageSize={pageSize}
                rowsPerPageOptions={[5, 10, 20]}
                pagination
                sortingOrder={['asc', 'desc']}
            />
        </Box>
    );
};

export default ArchiveItemAggregates;
