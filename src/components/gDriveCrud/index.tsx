import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Pagination, Select, MenuItem } from "@mui/material";
import { makePostCall } from "mirror/utils";
import { getBackendServer } from "utils/constants";

interface GDriveItem {
    _id: string;
    serialNo: string;
    titleGDrive: string;
    gDriveLink: string;
    truncFileLink: string;
    sizeWithUnits: string;
    sizeInBytes: string;
    folderName: string;
    createdTime: string;
    source: string;
    identifier: string;
    // add more fields as required
}

const GDriveItemList: React.FC = () => {
    const [items, setItems] = useState<GDriveItem[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [sortField, setSortField] = useState<string>("createdTime");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    useEffect(() => {
        fetchItems();
    }, [page, pageSize, sortField, sortOrder]);

    const fetchItems = async () => {
        try {
            const response = await makePostCall({
                page,
                limit: pageSize,
                sortField,
                sortOrder,
            },
                "googleDriveDB/getPerSource")
            console.log(`resp from fetchItems: ${JSON.stringify(response?.response?.[0]?.titleGDrive)}`);
            setItems(response?.response);
            setTotalPages(response?.response?.length || 0);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    const columns: GridColDef[] = [
        { field: "serialNo", headerName: "Serial No", width: 130 },
        { field: "titleGDrive", headerName: "Title", width: 200 },
        { field: "gDriveLink", headerName: "GDrive Link", width: 200 },
        { field: "sizeWithUnits", headerName: "Size", width: 120 },
        { field: "folderName", headerName: "Folder Name", width: 150 },
        { field: "createdTime", headerName: "Created Time", width: 150 },
        { field: "source", headerName: "Source", width: 150 },
        { field: "identifier", headerName: "Identifier", width: 150 },
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
                getRowId={(row) => row._id}
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

export default GDriveItemList;
