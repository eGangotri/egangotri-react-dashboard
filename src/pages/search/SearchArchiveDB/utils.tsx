import moment from 'moment';
import { FaDownload } from 'react-icons/fa';
import ItemToolTip, { ellipsis } from 'widgets/ItemTooltip';
import { makePostCall } from 'mirror/utils'
import { GridColDef, GridRenderCellParams  } from '@mui/x-data-grid';
import { DD_MM_YYYY_FORMAT } from 'utils/utils';

const generateThumbnail = (identifier: string) => {
    return `https://archive.org/services/img/${identifier}`;
}

export async function searchArchiveDatabase(searchTerm: string) {
    const resource =
        `archiveItem/search`;

    const data = await makePostCall({ searchTerm },
        resource);
    console.log(`data ${JSON.stringify(data)}`);
    return data.response;
}

export const SEARCH_ARCHIVE_DB_COLUMNS: GridColDef[] = [
    {
      field: 'thumbnail',
      headerName: 'Thumbnail',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <img src={generateThumbnail(params.row.identifier)} alt={params.row.originalTitle} />
      ),
    },
    {
      field: 'link',
      headerName: 'Pdf View Link',
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <ItemToolTip
          input={params.value}
          url={true}
          reactComponent={
            <FaDownload
              onClick={() => {
                window.open(params.row.pdfDownloadLink, '_blank');
              }}
            />
          }
        />
      ),
    },
    {
      field: 'allDownloadsLinkPage',
      headerName: 'All Downloads Link Page',
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <ItemToolTip input={params.value} url={true} />
      ),
    },
    {
      field: 'originalTitle',
      headerName: 'Original Title',
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <ItemToolTip input={params.value} />
      ),
    },
    {
      field: 'titleArchive',
      headerName: 'Title-Archive',
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <ItemToolTip input={params.value} />
      ),
    },
    {
      field: 'date',
      headerName: 'Archive.org Upload Date',
      width: 200,
      valueGetter: (params: GridRenderCellParams) =>
        moment(params.value).format(DD_MM_YYYY_FORMAT),
    },
    {
      field: 'acct',
      headerName: 'Acct',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <ItemToolTip input={params.value} />
      ),
    },
    {
      field: 'pageCount',
      headerName: 'Page Count',
      width: 150,
      type: 'number',
    },
    {
      field: 'sizeFormatted',
      headerName: 'Size Formatted',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <ItemToolTip input={params.value} />
      ),
    },
  ];
