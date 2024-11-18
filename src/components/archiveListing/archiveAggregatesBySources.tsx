import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridPaginationModel, GridRowHeightParams, GridValueGetterParams } from '@mui/x-data-grid';
import { Container } from '@mui/material';
import { aggregatesBySourcesColumns, AggregatesBySourcesType } from './constants';
import { makeGetCall } from 'service/BackendFetchService';


const AggregatesBySources = () => {
  const [items, setItems] = useState<AggregatesBySourcesType[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [sortField, setSortField] = useState<string>("sources");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  // Handle pagination and sorting
  const handlePaginationChange = (model: GridPaginationModel) => {
    setPaginationModel(model);
  };
  useEffect(() => {
    fetchAggregates();
  }, [page, pageSize, sortField, sortOrder]);

  const fetchAggregates = async () => {
    try {
      setLoading(true);
      const response = await makeGetCall(
        "archiveItem/archiveDBStatsBySources")
      console.log(`resp from fetchAggregates: ${JSON.stringify(response)}`);
      setItems(response?.response);
      setLoading(false);
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
  const getRowHeight = (params:GridRowHeightParams) => {
    const accts = params.model.accts;
    const lines = Math.ceil(accts.length / 3);
    return lines * 24 + 16; // Adjust the multiplier and padding as needed
};
  return (
    <Container>
      <DataGrid
        rows={items.map((item, index) => ({ id: index, ...item }))}
        columns={aggregatesBySourcesColumns}
        pagination
        autoHeight
        pageSizeOptions={[10, 20, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationChange}
        loading={loading}
        rowHeight={100}
        disableRowSelectionOnClick
        sortingOrder={["asc", "desc"]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10, page: 0 } },
        }}
        getRowHeight={getRowHeight}

      />
    </Container>
  );
};

export default AggregatesBySources;