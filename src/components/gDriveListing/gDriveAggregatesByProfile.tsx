import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { Pagination, Typography } from "@mui/material";
import { formatMem, } from "mirror/utils";
import { makeGetCall } from "service/BackendFetchService";
import { Link } from "react-router-dom";
import { G_DRIVE_ITEM_LIST_PATH } from "Routes/constants";
import { gDriveAggregateCol, GDriveItemAggregate } from "./constants";



const GDriveItemAggregates: React.FC = () => {
    const [items, setItems] = useState<GDriveItemAggregate[]>([]);
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

            setItems(response?.response);
            setTotalPages(response?.response?.length || 0);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    const handleSortModelChange = (sortModel: any) => {
        if (sortModel.length > 0) {
            const { field, sort } = sortModel[0];
            setSortField(field);
            setSortOrder(sort as "asc" | "desc");
        }
    };

    return (
        <div className="p-4">
            <DataGrid
                rows={items}
                columns={gDriveAggregateCol}
                onSortModelChange={handleSortModelChange}
                getRowId={(row) => row.source}
                loading={isLoading}
                autoHeight
                disableColumnMenu
                pageSizeOptions={[10, 20, 50]}
                paginationModel={paginationModel}
                onPaginationModelChange={handlePaginationChange}
                disableRowSelectionOnClick
                sortingOrder={["asc", "desc"]}
                initialState={{
                    pagination: { paginationModel: { pageSize: 10, page: 0 } },
                }}
            />
        </div>
    );
};

export default GDriveItemAggregates;
