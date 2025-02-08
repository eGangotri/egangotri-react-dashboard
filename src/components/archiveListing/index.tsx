import React, { useEffect, useState } from "react";
import { DataGrid, GridPaginationModel } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import { makePostCall } from "mirror/utils";
import { ArchiveItem, archiveItemColumns } from "./constants";
import { useParams } from "react-router-dom";

const ArchiveItemList: React.FC = () => {
    const [items, setItems] = useState<ArchiveItem[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
    const { profile } = useParams<{ profile: string }>();

    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        page: 0,
        pageSize: 10,
    });

    useEffect(() => {
        fetchItems();
    }, []);


    const fetchItems = async () => {
        setLoading(true);
        console.log(`profile ${profile}`);
        try {
            const response = await makePostCall({
                page: paginationModel.page,
                limit: paginationModel.pageSize,
                sortField: "date",
                sortOrder: "asc",
            },
                `archiveItem/getArchiveItemPerProfile` + (profile ? `/${profile}` : ""));
            console.log(`resp from fetchItems(${profile}): ${JSON.stringify(response?.response?.[0]?.titleGDrive)}`);
            setLoading(false);
            if (response && response?.response && response?.response?.length > 0) {
                setItems(response?.response);
            }
            else {
                setItems([]);
            }
        } catch (error) {
            console.error("Error fetching items:", error);
        }
        finally {
            setLoading(false);
        }
    };
  
    // Handle pagination and sorting
    const handlePaginationChange = (model: GridPaginationModel) => {
        setPaginationModel(model);
    };

    return (
        <Box sx={{ height: 600, width: "100%", p: 2 }}>
            <Typography variant="h4" className="text-center mb-4">Archive Items</Typography>
            <DataGrid
                rows={items}
                columns={archiveItemColumns}
                pageSizeOptions={[10, 20, 50]}
                paginationModel={paginationModel}
                onPaginationModelChange={handlePaginationChange}
                loading={loading}
                disableRowSelectionOnClick
                sortingOrder={["asc", "desc"]}
                initialState={{
                    pagination: { paginationModel: { pageSize: 10, page: 0 } },
                }}
                getRowId={(row) => row.identifier} 
            />
        </Box>
    );
};

export default ArchiveItemList;
