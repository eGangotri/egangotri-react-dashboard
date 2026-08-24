import React, { useState } from "react";
import { Box, Typography, IconButton, Tooltip, Button, Stack } from "@mui/material";
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import Search from "@mui/icons-material/Search";
import CloudUpload from "@mui/icons-material/CloudUpload";
import FilterList from "@mui/icons-material/FilterList";
import ContentCopy from "@mui/icons-material/ContentCopy";
import { ERROR_RED, SUCCESS_GREEN } from "constants/colors";

export const getArchiveSearchUrl = (filePath: string) => {
    const backslash = String.fromCharCode(92);
    const lastSep = Math.max(filePath.lastIndexOf('/'), filePath.lastIndexOf(backslash));
    const fileName = lastSep >= 0 ? filePath.slice(lastSep + 1) : filePath;
    const lastDot = fileName.lastIndexOf('.');
    const nameWithoutExt = lastDot > 0 ? fileName.slice(0, lastDot) : fileName;
    const queryName = nameWithoutExt.split('-')[0];
    return `https://archive.org/search?query=${encodeURIComponent(queryName)}`;
};

export interface ItemForAction {
    absPath: string;
    archiveProfile: string
    alreadyUploaded?: boolean;
}

interface ItemsActionPanelProps {
    title: string;
    items: ItemForAction[];
    disabled?: boolean;
    onReupload: (archiveProfile: string, absPath: string, anchor: HTMLButtonElement) => void;
    onIsolate: (archiveProfile: string, absPath: string, anchor: HTMLButtonElement) => void;
}

const ItemsActionPanel: React.FC<ItemsActionPanelProps> = ({ title, items, disabled = false, onReupload, onIsolate }) => {
    const handleCopyJson = async () => {
        try {
            await navigator.clipboard.writeText(JSON.stringify({ title, items }, null, 2));
            console.log('JSON copied to clipboard');
        } catch (err) {
            console.error('Failed to copy JSON: ', err);
        }
    };

    const [copySuccess, setCopySuccess] = useState<string | null>(null);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopySuccess(text);
            setTimeout(() => setCopySuccess(null), 2000);
        });
    };


    const handleCopyText = async () => {
        try {
            let text = `${title}\n\n`;
            items.forEach((x, index) => {
                text += `(${index + 1}) ${x.absPath}\n`;
            });
            await navigator.clipboard.writeText(text);
            console.log('Text copied to clipboard');
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const rows = items.map((item, index) => ({
        id: index,
        serialNo: index + 1,
        ...item
    }));

    const columns: GridColDef[] = [
        { field: "serialNo", headerName: "#", width: 20 },
        {
            field: "actions",
            headerName: "Actions",
            width: 110,
            sortable: false,
            filterable: false,
            renderCell: (params: GridRenderCellParams) => (
                <Box display="flex" alignItems="center">
                    <Tooltip title="Search in archive">
                        <IconButton
                            size="small"
                            href={getArchiveSearchUrl(params.row.absPath)}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Search />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={params.row.alreadyUploaded ? "Already uploaded" : "Reupload"}>
                        <span>
                            <IconButton
                                size="small"
                                disabled={disabled || params.row.alreadyUploaded === true}
                                onClick={(event) => onReupload(params.row.archiveProfile, params.row.absPath, event.currentTarget as HTMLButtonElement)}
                            >
                                <CloudUpload />
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Tooltip title="Isolate">
                        <span>
                            <IconButton
                                size="small"
                                disabled={disabled}
                                onClick={(event) => onIsolate(params.row.archiveProfile, params.row.absPath, event.currentTarget as HTMLButtonElement)}
                            >
                                <FilterList />
                            </IconButton>
                        </span>
                    </Tooltip>
                </Box>
            ),
        },
        {
            field: "absPath", headerName: "Absolute Path",
            flex: 1,
            minWidth: 300,
            renderCell: (params: GridRenderCellParams) => (
                <>
                    <Tooltip title={copySuccess === params.value ? "Copied!" : "Copy Link"}>
                        <IconButton
                            size="small"
                            onClick={() => handleCopy(params.value)}
                            color={copySuccess === params.value ? "success" : "default"}
                        >
                            <ContentCopy fontSize="small" />
                            <Typography variant="caption">{params.value}</Typography>

                        </IconButton>
                    </Tooltip>
                </>
            ),
        },
        {
            field: "alreadyUploaded",
            headerName: "Uploaded",
            width: 50,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="caption">{params.value ? "Yes" : "No"}</Typography>
            ),
        },
    ];

    return (
        <Box>
            <Typography variant="h6">{title}</Typography>
            <Stack direction="row" spacing={2} sx={{ my: 1 }}>
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ContentCopy />}
                    onClick={handleCopyJson}
                >
                    Copy JSON
                </Button>
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ContentCopy />}
                    onClick={handleCopyText}
                >
                    Copy Text
                </Button>
            </Stack>
            <Box sx={{ width: '100%', '& .not-uploaded-row': { color: ERROR_RED }, '& .uploaded-row': { color: SUCCESS_GREEN } }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    autoHeight
                    density="compact"
                    disableRowSelectionOnClick
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 25 },
                        },
                    }}
                    pageSizeOptions={[25, 50, 100]}
                    getRowClassName={(params) => params.row.alreadyUploaded ? "uploaded-row" : "not-uploaded-row"}
                />
            </Box>
        </Box>
    );
};

export default ItemsActionPanel;
