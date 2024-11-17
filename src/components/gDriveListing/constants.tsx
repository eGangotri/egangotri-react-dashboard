import { Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { formatMem } from "mirror/utils";
import { Link } from "react-router-dom";
import { G_DRIVE_ITEM_LIST_PATH } from "Routes/constants";

export interface GDriveItemAggregate {
    sizeInBytes: string;
    firstItemCreatedTime: string;
    source: string;
    totalPageCount: number;
    count: number;
}

export 
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

export 
const gDriveItemColumns: GridColDef[] = [
    { field: "serialNo", headerName: "Serial No", width: 130 },
    { field: "titleGDrive", headerName: "Title", width: 200 },
    { field: "gDriveLink", headerName: "GDrive Link", width: 200 },
    { field: "sizeWithUnits", headerName: "Size", width: 120 },
    { field: "folderName", headerName: "Folder Name", width: 150 },
    { field: "createdTime", headerName: "Created Time", width: 150 },
    { field: "source", headerName: "Source", width: 150 },
    { field: "identifier", headerName: "Identifier", width: 150 },
];


export const gDriveAggregateCol: GridColDef[] = [
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
