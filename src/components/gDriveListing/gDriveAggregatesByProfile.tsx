import React, { useEffect, useState } from "react";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "utils/constants";
import { DataGrid, GridPaginationModel, GridToolbar, GridSearchIcon } from "@mui/x-data-grid";
import { TextField, InputAdornment, Box, Typography } from "@mui/material";
import { makeGetCall } from 'service/ApiInterceptor';
import { gDriveAggregateCol, GDriveItemAggregate } from "./constants";

const GDriveItemAggregates: React.FC = () => {
    const [items, setItems] = useState<GDriveItemAggregate[]>([]);
    const [filteredItems, setFilteredItems] = useState<GDriveItemAggregate[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [sortField, setSortField] = useState<string>("firstItemCreatedTime");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        page: 0,
        pageSize: 10,
    });

    // Handle pagination and sorting
    const handlePaginationChange = (model: GridPaginationModel) => {
        setPaginationModel(model);
        setPage(model.page + 1);
        setPageSize(model.pageSize);
    };

    useEffect(() => {
        fetchAggregates();
    }, [page, pageSize, sortField, sortOrder]);

    const fetchAggregates = async () => {
        try {
            setIsLoading(true);
            const response = await makeGetCall(
                "googleDriveDB/gdriveDBAggregatedBySource")
            console.log(`resp from fetchAggregates: ${JSON.stringify(response)}`);
            setIsLoading(false);

            setItems(response?.response || []);
            setTotalPages(response?.response?.length || 0);
        } catch (error) {
            console.error("Error fetching items:", error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (items && items.length > 0) {
            const lowSearch = searchTerm.toLowerCase();
            const filtered = items?.filter(item =>
                (item.source?.toLowerCase() || "").includes(lowSearch)
            );
            setFilteredItems(filtered);
        } else {
            setFilteredItems([]);
        }
    }, [items, searchTerm]);

    const handleSortModelChange = (sortModel: any) => {
        if (sortModel.length > 0) {
            const { field, sort } = sortModel[0];
            setSortField(field);
            setSortOrder(sort as "asc" | "desc");
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className="p-4">
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <TextField
                    variant="outlined"
                    placeholder="Search by Source..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    size="small"
                    sx={{ width: 400 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <GridSearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <Typography variant="body2" color="textSecondary">
                    Showing {filteredItems.length} of {items.length} aggregates
                </Typography>
            </Box>
            <DataGrid
                rows={filteredItems}
                columns={gDriveAggregateCol}
                onSortModelChange={handleSortModelChange}
                getRowId={(row) => row.source}
                loading={isLoading}
                autoHeight
                disableColumnMenu
                pageSizeOptions={DEFAULT_PAGE_SIZE_OPTIONS}
                paginationModel={paginationModel}
                onPaginationModelChange={handlePaginationChange}
                disableRowSelectionOnClick
                sortingOrder={["asc", "desc"]}
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                    toolbar: {
                        showQuickFilter: false // We have our own search box
                    }
                }}
                initialState={{
                    pagination: { paginationModel: { pageSize: 10, page: 0 } },
                }}
            />
        </div>
    );
};

export default GDriveItemAggregates;
