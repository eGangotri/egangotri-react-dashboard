import moment from 'moment';
import { FaDownload } from 'react-icons/fa';
import ItemToolTip, { ellipsis } from 'widgets/ItemTooltip';
import { getGDrivePdfDownloadLink } from 'mirror/GoogleDriveUtilsCommonCode';
import { makePostCall } from 'mirror/utils'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

const DD_MM_YYYY_WITH_TIME_FORMAT = 'DD/MM/YYYY HH:mm';
const DD_MM_YYYY_FORMAT = 'DD/MM/YYYY';

export interface SearchDBProps {
    searchTerm: string
    filter?: string
}

export async function searchGoogleDrive(searchTerm: string) {
    const resource =
        `googleDriveDB/search`;

    const data = await makePostCall({ searchTerm },
        resource);

    console.log(`data size:${data?.response?.length}`);
    return data.response;
}

export const SEARCH_GDRIVE_DB_COLUMNS: GridColDef[] = [
    {
        field: 'thumbnail',
        headerName: 'Thumbnail',
        width: 150,
        renderCell: (params: GridRenderCellParams) => (
            <div className="w-full h-auto transition-transform duration-300 transform hover:scale-200"
            >            <img
                    src={`https://drive.google.com/thumbnail?id=${params.row.identifierTruncFile}`}
                    referrerPolicy="no-referrer"
                    alt={ellipsis(`https://lh3.googleusercontent.com/d/${params.row.identifierTruncFile}?authuser=0`) as string}
                    className="w-full h-full transition-transform duration-300 transform hover:scale-200"
                />
            </div>

        ),
    },
    {
        field: 'titleGDrive',
        headerName: 'Title - Google Drive',
        width: 450,
        renderCell: (params: GridRenderCellParams) => (
            <ItemToolTip input={params.value} noEllipsis={true} />
        ),
    },
    {
        field: 'gDriveLink',
        headerName: 'Google Drive Link',
        width: 200,
        renderCell: (params: GridRenderCellParams) => (
            <ItemToolTip
                input={params.value}
                url={true}
                reactComponent={
                    <FaDownload
                        onClick={() => {
                            window.open(getGDrivePdfDownloadLink(params.row.identifier), '_blank');
                        }}
                    />
                }
            />
        ),
    },
    {
        field: 'truncFileLink',
        headerName: 'First and Last 10 Pages',
        width: 200,
        renderCell: (params: GridRenderCellParams) => (
            <ItemToolTip
                input={params.value}
                url={true}
                reactComponent={
                    <FaDownload
                        onClick={() => {
                            window.open(getGDrivePdfDownloadLink(params.row.identifierTruncFile), '_blank');
                        }}
                    />
                }
            />
        ),
    },
    { field: 'pageCount', headerName: 'Page Count', width: 100 },
    {
        field: 'sizeWithUnits',
        headerName: 'Size With Units',
        width: 150,
        renderCell: (params: GridRenderCellParams) => (
            <ItemToolTip input={params.value} />
        ),
    },
    {
        field: 'createdTime',
        headerName: 'Date',
        width: 120,
        valueGetter: (params: GridRenderCellParams) =>
            moment(params.value).format(DD_MM_YYYY_FORMAT),
    },
    { field: 'source', headerName: 'Source', width: 130 },
];