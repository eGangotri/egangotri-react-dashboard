import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
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

  return (
    <Container>
      <DataGrid
        rows={items.map((item, index) => ({ id: index, ...item }))}
        columns={aggregatesBySourcesColumns}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
        rowsPerPageOptions={[5, 10, 20]}
        pagination
        autoHeight
      />
    </Container>
  );
};

export default AggregatesBySources;