import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { Pagination, Select, MenuItem } from "@mui/material";
import { makePostCall } from "mirror/utils";
import { useParams } from 'react-router-dom';
import Spinner from "widgets/Spinner";
import { GDriveItem, gDriveItemColumns } from "./constants";

const GDriveItemList: React.FC = () => {
    const [items, setItems] = useState<GDriveItem[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [sortField, setSortField] = useState<string>("createdTime");
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

    const { src } = useParams<{ src: string }>();

    useEffect(() => {
        fetchItems();
    }, [page, pageSize, sortField, sortOrder]);

    const fetchItems = async () => {
        setIsLoading(true);
        try {
            const response = await makePostCall({
                page,
                limit: pageSize,
                sortField,
                sortOrder,
            },
                `googleDriveDB/getPerSource` + (src ? `/${src}` : ""));
            console.log(`resp from fetchItems(${src}): ${JSON.stringify(response?.response?.[0]?.titleGDrive)}`);
            setIsLoading(false);
            if (response && response?.response && response?.response?.length > 0) {
                setItems(response?.response);
                setTotalPages(response?.response?.length || 0);
            }
            else {
                setItems([]);
                setTotalPages(0);
            }
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
                columns={gDriveItemColumns}
                pagination
                loading={isLoading}
                onSortModelChange={handleSortModelChange}
                getRowId={(row) => row._id}
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

export default GDriveItemList;
