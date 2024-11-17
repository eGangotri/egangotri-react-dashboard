import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
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
            {isLoading && <Spinner />}
            <DataGrid
                rows={items}
                columns={gDriveItemColumns}
                pagination
                pageSize={pageSize}
                rowsPerPageOptions={[5, 10, 20]}
                onPageChange={(params:any) => setPage(params.page)}
                onPageSizeChange={(newPageSize:number) => setPageSize(newPageSize)}
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
