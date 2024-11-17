import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Pagination, Typography } from "@mui/material";
import { formatMem, } from "mirror/utils";
import { makeGetCall } from "service/BackendFetchService";
import { Link } from "react-router-dom";
import { G_DRIVE_ITEM_LIST_PATH } from "Routes/constants";

interface GDriveItemAggregate {
    sizeInBytes: string;
    firstItemCreatedTime: string;
    source: string;
    totalPageCount: number;
    count: number;
}

const GDriveItemAggregates: React.FC = () => {
    const [items, setItems] = useState<GDriveItemAggregate[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [sortField, setSortField] = useState<string>("firstItemCreatedTime");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    useEffect(() => {
        fetchAggregates();
    }, [page, pageSize, sortField, sortOrder]);

    const fetchAggregates = async () => {
        try {
            const response = await makeGetCall(
                "googleDriveDB/gdriveDBAggregatedBySource")
            console.log(`resp from fetchAggregates: ${JSON.stringify(response)}`);
            setItems(response?.response);
            setTotalPages(response?.response?.length || 0);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    const columns: GridColDef[] = [
        {
            field: "source",
            headerName: "Source",
            width: 150,
            renderCell: (params) => (
                <Link to={`${window.location.origin}${G_DRIVE_ITEM_LIST_PATH}/${params.value}`} className="text-blue-500 underline">
                    {params.value}
                </Link>
            )
        },
        {
            field: "totalSizeInBytes",
            headerName: "Total Size",
            width: 120,
            renderCell: (params) => (
                <Typography>{formatMem(params.value)}</Typography>
            )
        },
        { field: "firstItemCreatedTime", headerName: "First Created Time", width: 150 },
        { field: "totalPageCount", headerName: "Total Page Count", width: 150 },
        { field: "count", headerName: "Total Items", width: 150 },
    ];

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
                columns={columns}
                pagination
                pageSize={pageSize}
                rowsPerPageOptions={[5, 10, 20]}
                onPageChange={(params) => setPage(params.page)}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                sortingOrder={["asc", "desc"]}
                onSortModelChange={handleSortModelChange}
                getRowId={(row) => row.source}
                autoHeight
                disableColumnMenu
            />
            <Pagination
                count={totalPages}
                page={page}
                onChange={(event, value) => setPage(value)}
                className="mt-4"
            />
        </div>
    );
};

export default GDriveItemAggregates;
