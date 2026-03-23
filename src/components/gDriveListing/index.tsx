import React, { useEffect, useState } from "react";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "utils/constants";
import { DataGrid, GridColDef, GridPaginationModel, GridToolbar, GridSearchIcon } from "@mui/x-data-grid";
import { TextField, InputAdornment, Box, Typography, IconButton, Tooltip, Link } from "@mui/material";
import { ContentCopy as ContentCopyIcon, OpenInNew as OpenInNewIcon } from "@mui/icons-material";
import { useParams } from 'react-router-dom';
import Spinner from "widgets/Spinner";
import { GDriveItem, G_DRIVE_ITEM_COLUMNS_BASE } from "./constants";
import { makePostCall } from "service/ApiInterceptor";
import { ellipsis } from "widgets/ItemTooltip";

const GDriveItemList: React.FC = () => {
    const RESULT_LIMIT = 5000
    const [items, setItems] = useState<GDriveItem[]>([]);
    const [filteredItems, setFilteredItems] = useState<GDriveItem[]>([]);
    const [localSearchTerm, setLocalSearchTerm] = useState<string>("");
    const [globalSearchTerm, setGlobalSearchTerm] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(RESULT_LIMIT);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [sortField, setSortField] = useState<string>("createdTime");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        page: 0,
        pageSize: 10,
    });

    const [copySuccess, setCopySuccess] = useState<string | null>(null);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopySuccess(text);
            setTimeout(() => setCopySuccess(null), 2000);
        });
    };

    const columns: GridColDef[] = G_DRIVE_ITEM_COLUMNS_BASE.map(col => {
        if (col.field === 'gDriveLink') {
            return {
                ...col,
                width: 230,
                renderCell: (params) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Tooltip title="Open Link">
                            <IconButton
                                size="small"
                                component="a"
                                href={params.value}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <OpenInNewIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={copySuccess === params.value ? "Copied!" : "Copy Link"}>
                            <IconButton
                                size="small"
                                onClick={() => handleCopy(params.value)}
                                color={copySuccess === params.value ? "success" : "default"}
                            >
                                <ContentCopyIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Typography variant="body2" color="textSecondary" >
                           { ellipsis(params.value)}
                        </Typography>
                    </Box>
                )
            };
        }
        return col;
    });

    // Handle pagination and sorting
    const handlePaginationChange = (model: GridPaginationModel) => {
        setPaginationModel(model);
        setPage(model.page + 1);
        setPageSize(model.pageSize);
    };

    const { src } = useParams<{ src: string }>();

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchItems();
        }, RESULT_LIMIT);
        return () => clearTimeout(timeoutId);
    }, [page, pageSize, sortField, sortOrder, globalSearchTerm]);

    const fetchItems = async () => {
        setIsLoading(true);
        try {
            let url = `googleDriveDB/getPerSource` + (src ? `/${src}` : "");
            if (globalSearchTerm.trim()) {
                url += `?searchTerm=${encodeURIComponent(globalSearchTerm.trim())}`;
            }

            const response = await makePostCall({
                page,
                limit: RESULT_LIMIT,
                sortField,
                sortOrder,
            }, url);
            console.log(`resp from fetchItems(${src}): ${JSON.stringify(response?.response?.[0]?.titleGDrive)}`);
            setIsLoading(false);
            if (response && response?.response && response?.response?.length > 0) {
                setItems(response?.response);
                // Note: The totalPages should ideally come from the backend total count
                setTotalPages(response?.totalCount || response?.response?.length || 0);
            }
            else {
                setItems([]);
                setTotalPages(0);
            }
        } catch (error) {
            console.error("Error fetching items:", error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (items) {
            const filtered = items.filter(item => {
                const lowSearch = localSearchTerm.toLowerCase();
                return (
                    (item.titleGDrive?.toLowerCase() || "").includes(lowSearch) ||
                    (item.folderName?.toLowerCase() || "").includes(lowSearch) ||
                    (item.source?.toLowerCase() || "").includes(lowSearch)
                );
            });
            setFilteredItems(filtered);
        } else {
            setFilteredItems([]);
        }
    }, [items, localSearchTerm]);

    const handleSortModelChange = (sortModel: any) => {
        if (sortModel.length > 0) {
            const { field, sort } = sortModel[0];
            setSortField(field);
            setSortOrder(sort as "asc" | "desc");
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLocalSearchTerm(event.target.value);
    };

    return (
        <div className="p-4">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2, mb: 3 }}>
                <TextField
                    variant="outlined"
                    placeholder="Search entire DB directly..."
                    value={globalSearchTerm}
                    onChange={(e) => setGlobalSearchTerm(e.target.value)}
                    size="small"
                    sx={{ width: 300 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <GridSearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField
                    variant="outlined"
                    placeholder="Filter current page..."
                    value={localSearchTerm}
                    onChange={handleSearchChange}
                    size="small"
                    sx={{ width: 300 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <GridSearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <Typography variant="body2" color="textSecondary">
                    Showing {filteredItems.length} of {items.length} items on this page
                </Typography>
            </Box>
            <DataGrid
                rows={filteredItems}
                columns={columns}
                pagination
                loading={isLoading}
                onSortModelChange={handleSortModelChange}
                getRowId={(row) => row._id}
                getRowClassName={(params) => params.row.disposed ? 'disposed-row' : 'disposed-row'}
                sx={{
                    '& .disposed-row': {
                        opacity: 0.6,
                    },
                    '& .disposed-row .MuiDataGrid-cell': {
                        textDecoration: 'line-through !important',
                        color: 'text.disabled !important',
                    },
                    '& .disposed-row .MuiTypography-root': {
                        textDecoration: 'line-through !important',
                        color: 'text.disabled !important',
                    },
                    '& .disposed-row a, & .disposed-row button': {
                        pointerEvents: 'none',
                    }
                }}
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

export default GDriveItemList;
