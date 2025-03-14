import { Link } from "react-router-dom";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { ARCHIVE_ITEM_LIST_PATH } from "Routes/constants";
import { formatMem } from "mirror/utils";
import { Box, Chip, Stack, Typography } from "@mui/material";
import { ReactNode } from "react";

export interface ArchiveItem {
  link: string;
  allDownloadsLinkPage: string;
  pdfDownloadLink: string;
  pageCount: string;
  originalTitle: string;
  titleArchive: string;
  size: string;
  sizeFormatted: string;
  subject: string;
  description: string;
  date: string;
  acct: string;
  identifier: string;
  type: string;
  mediaType: string;
  emailUser: string;
  source?: string;
}

export interface ArchiveItemAggregateType {
  totalSize: number;
  totalPageCount: number;
  emailUsers: string[];
  sources: string[];
  firstLowestDate: string;
  acct: string;
}

export const archiveItemAggregateColumns: GridColDef[] = [
  {
    field: 'acct',
    headerName: 'Account',
    width: 150,
    renderCell: (params) => (
      <Link to={`${window.location.origin}${ARCHIVE_ITEM_LIST_PATH}/${params.value}`} className="text-blue-500 underline">
        {params.value}
      </Link>
    )

  },
  { field: 'totalSize', headerName: 'Total Size', width: 180, sortable: true },
  { field: 'totalPageCount', headerName: 'Total Page Count', width: 180, sortable: true },
  {
    field: 'emailUsers',
    headerName: 'Email Users',
    width: 250,
    valueGetter: (params: any) => params.row.emailUsers.join(', '),
  },
  {
    field: 'sources',
    headerName: 'Sources',
    width: 150,
    valueGetter: (params: any) => params.row.sources.join(', '),
  },
  { field: 'firstLowestDate', headerName: 'First Lowest Date', width: 150 },
];

export
  const archiveItemColumns: GridColDef[] = [
    { field: "originalTitle", headerName: "Title", width: 200, sortable: true },
    { field: "subject", headerName: "Subject", width: 150, sortable: true },
    { field: "description", headerName: "Description", width: 300, sortable: true },
    { field: "pageCount", headerName: "Pages", width: 100, sortable: true },
    { field: "sizeFormatted", headerName: "Size", width: 120, sortable: true },
    { field: "date", headerName: "Date", width: 150, sortable: true },
    { field: "type", headerName: "Type", width: 100, sortable: true },
  ];


export interface AggregatesBySourcesType {
  totalSize: number;
  totalPageCount: number;
  accts: string[];
  source: string;
}



export const aggregatesBySourcesColumns: GridColDef[] = [
  { field: 'source', headerName: 'Source', width: 150 },
  {
    field: 'totalSize', headerName: 'Total Size', width: 150,
    renderCell: (params) =>
      <Typography>{formatMem(params.value)}</Typography>
  },
  { field: 'totalPageCount', headerName: 'Total Page Count', width: 150 },
  {
    field: "acctsCount",
    headerName: "Accounts-Count",
    width: 150,
    renderCell: (params) => {
      return (<Typography>{params.row.accts.length}</Typography>);
    }
  },
  {
    field: 'accts',
    headerName: 'Accounts',
    width: 600,
    renderCell: (params: GridRenderCellParams) => {
      const _accts = params.row.accts;
      const _acctsAsLinks: ReactNode[] = _accts.map((acct: string) => (
        <Chip label={acct}
          component="a" href={`${window.location.origin}${ARCHIVE_ITEM_LIST_PATH}/${acct}`} clickable />
      ));
      const lists: ReactNode[] = [];
      for (let i = 0; i < _acctsAsLinks.length; i += 4) {
        const _slices = _acctsAsLinks.slice(i, i + 4);
        lists.push(_slices);
      }
      return (<Stack gap={2} className="py-1 my-1 space-y-2">
        <ul className="space-y-2">
          {lists.map((list, index) => (
            <li key={index} className="list-none">
              {list}
            </li>
          ))}
        </ul>
      </Stack>);
    },
  },
];

