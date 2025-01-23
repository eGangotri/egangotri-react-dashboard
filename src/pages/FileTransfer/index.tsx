import React, { useState, useEffect } from "react"
import { DataGrid, type GridColDef, type GridValueGetterParams } from "@mui/x-data-grid"
import { Box, Typography } from "@mui/material"

interface JsonData {
  _id: { $oid: string }
  src: string
  dest: string
  destFolderOrProfile: string
  success: boolean
  msg: string
  errorList: string[]
  fileCollisionsResolvedByRename: string[]
  filesMoved: string[]
  createdAt: { $date: string }
  updatedAt: { $date: string }
  __v: number
}

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "src", headerName: "Source", width: 200 },
  { field: "dest", headerName: "Destination", width: 200 },
  { field: "destFolderOrProfile", headerName: "Folder/Profile", width: 150 },
  { field: "success", headerName: "Success", width: 100, type: "boolean" },
  { field: "msg", headerName: "Message", width: 300 },
  {
    field: "errorCount",
    headerName: "Error Count",
    width: 120,
    valueGetter: (params: GridValueGetterParams) => params.row.errorList.length,
  },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 200,
    valueGetter: (params: GridValueGetterParams) => new Date(params.row.createdAt.$date).toLocaleString(),
  },
]

export default function FileTransferList() {
  const [data, setData] = useState<JsonData[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await fetch("/api/data")
        // const jsonData = await response.json()
        // setData(jsonData)
        const mockData = [{
            "_id": {
              "$oid": "6703ea360d49d5017921cd39"
            },
            "src": "D:\\_Treasures75\\_data\\iks\\kangri",
            "dest": "D:\\_Treasures75\\_freeze\\iks\\kangri",
            "destFolderOrProfile": "KANGRI",
            "success": false,
            "msg": "206 files moved from Source dir D:\\_Treasures75\\_data\\iks\\kangri to target dir D:\\_Treasures75\\_freeze\\iks\\kangri.\n        \n0 files had collisions resolved by renaming.\n        \n1 files had errors while moving",
            "errorList": [
              "Exception thrown while moving file D:\\_Treasures75\\_data\\iks\\kangri\\Sampada 2 No 2,No 3,No 4,No 5,No 6,No 7,No 8,No 9,No 10,No 11,No12 A Journal Feb Delhi 1958 - Ashok Prakashan Mandir.pdf to D:\\_Treasures75\\_freeze\\iks\\kangri \nError: ENOENT: no such file or directory, rename 'D:\\_Treasures75\\_data\\iks\\kangri\\Sampada 2 No 2,No 3,No 4,No 5,No 6,No 7,No 8,No 9,No 10,No 11,No12 A Journal Feb Delhi 1958 - Ashok Prakashan Mandir.pdf' -> 'D:\\_Treasures75\\_freeze\\iks\\kangri\\Sampada 2 No 2,No 3,No 4,No 5,No 6,No 7,No 8,No 9,No 10,No 11,No12 A Journal Feb Delhi 1958 - Ashok Prakashan Mandir.pdf'",
              "Exception thrown while moving file D:\\_Treasures75\\_data\\iks\\kangri\\Sampada No 2,No 3,No 4,No 5,No 6,No 7,No 8,No 9,No 10,No 11,No 12 A Journal Feb Delhi 1958 - Ashok Prakashan Mandir.pdf to D:\\_Treasures75\\_freeze\\iks\\kangri \nError: ENOENT: no such file or directory, rename 'D:\\_Treasures75\\_data\\iks\\kangri\\Sampada No 2,No 3,No 4,No 5,No 6,No 7,No 8,No 9,No 10,No 11,No 12 A Journal Feb Delhi 1958 - Ashok Prakashan Mandir.pdf' -> 'D:\\_Treasures75\\_freeze\\iks\\kangri\\Sampada No 2,No 3,No 4,No 5,No 6,No 7,No 8,No 9,No 10,No 11,No 12 A Journal Feb Delhi 1958 - Ashok Prakashan Mandir.pdf'",
              "Exception thrown while moving file D:\\_Treasures75\\_data\\iks\\kangri\\SaraswatiPart 6 No 1,No 2,No 3,No 4,No 5,No 6,No 7,No 8,No 9,No 10,No 11,No 12 ed by Mahaveerprasad Dwivedi Allhabad - Indian Press.pdf to D:\\_Treasures75\\_freeze\\iks\\kangri \nError: ENOENT: no such file or directory, rename 'D:\\_Treasures75\\_data\\iks\\kangri\\SaraswatiPart 6 No 1,No 2,No 3,No 4,No 5,No 6,No 7,No 8,No 9,No 10,No 11,No 12 ed by Mahaveerprasad Dwivedi Allhabad - Indian Press.pdf' -> 'D:\\_Treasures75\\_freeze\\iks\\kangri\\SaraswatiPart 6 No 1,No 2,No 3,No 4,No 5,No 6,No 7,No 8,No 9,No 10,No 11,No 12 ed by Mahaveerprasad Dwivedi Allhabad - Indian Press.pdf'"
            ],
            "fileCollisionsResolvedByRename": [],
            "filesMoved": [],
            "createdAt": {
              "$date": "2024-10-07T14:03:34.754Z"
            },
            "updatedAt": {
              "$date": "2024-10-07T14:03:34.754Z"
            },
            "__v": 0
          },{
            "_id": {
              "$oid": "6703ea360d49d5017921cd39"
            },
            "src": "D:\\_Treasures75\\_data\\iks\\kangri",
            "dest": "D:\\_Treasures75\\_freeze\\iks\\kangri",
            "destFolderOrProfile": "KANGRI",
            "success": false,
            "msg": "206 files moved from Source dir D:\\_Treasures75\\_data\\iks\\kangri to target dir D:\\_Treasures75\\_freeze\\iks\\kangri.\n        \n0 files had collisions resolved by renaming.\n        \n1 files had errors while moving",
            "errorList": [
              "Exception thrown while moving file D:\\_Treasures75\\_data\\iks\\kangri\\Sampada 2 No 2,No 3,No 4,No 5,No 6,No 7,No 8,No 9,No 10,No 11,No12 A Journal Feb Delhi 1958 - Ashok Prakashan Mandir.pdf to D:\\_Treasures75\\_freeze\\iks\\kangri \nError: ENOENT: no such file or directory, rename 'D:\\_Treasures75\\_data\\iks\\kangri\\Sampada 2 No 2,No 3,No 4,No 5,No 6,No 7,No 8,No 9,No 10,No 11,No12 A Journal Feb Delhi 1958 - Ashok Prakashan Mandir.pdf' -> 'D:\\_Treasures75\\_freeze\\iks\\kangri\\Sampada 2 No 2,No 3,No 4,No 5,No 6,No 7,No 8,No 9,No 10,No 11,No12 A Journal Feb Delhi 1958 - Ashok Prakashan Mandir.pdf'",
              "Exception thrown while moving file D:\\_Treasures75\\_data\\iks\\kangri\\Sampada No 2,No 3,No 4,No 5,No 6,No 7,No 8,No 9,No 10,No 11,No 12 A Journal Feb Delhi 1958 - Ashok Prakashan Mandir.pdf to D:\\_Treasures75\\_freeze\\iks\\kangri \nError: ENOENT: no such file or directory, rename 'D:\\_Treasures75\\_data\\iks\\kangri\\Sampada No 2,No 3,No 4,No 5,No 6,No 7,No 8,No 9,No 10,No 11,No 12 A Journal Feb Delhi 1958 - Ashok Prakashan Mandir.pdf' -> 'D:\\_Treasures75\\_freeze\\iks\\kangri\\Sampada No 2,No 3,No 4,No 5,No 6,No 7,No 8,No 9,No 10,No 11,No 12 A Journal Feb Delhi 1958 - Ashok Prakashan Mandir.pdf'",
              "Exception thrown while moving file D:\\_Treasures75\\_data\\iks\\kangri\\SaraswatiPart 6 No 1,No 2,No 3,No 4,No 5,No 6,No 7,No 8,No 9,No 10,No 11,No 12 ed by Mahaveerprasad Dwivedi Allhabad - Indian Press.pdf to D:\\_Treasures75\\_freeze\\iks\\kangri \nError: ENOENT: no such file or directory, rename 'D:\\_Treasures75\\_data\\iks\\kangri\\SaraswatiPart 6 No 1,No 2,No 3,No 4,No 5,No 6,No 7,No 8,No 9,No 10,No 11,No 12 ed by Mahaveerprasad Dwivedi Allhabad - Indian Press.pdf' -> 'D:\\_Treasures75\\_freeze\\iks\\kangri\\SaraswatiPart 6 No 1,No 2,No 3,No 4,No 5,No 6,No 7,No 8,No 9,No 10,No 11,No 12 ed by Mahaveerprasad Dwivedi Allhabad - Indian Press.pdf'"
            ],
            "fileCollisionsResolvedByRename": [],
            "filesMoved": [],
            "createdAt": {
              "$date": "2024-10-07T14:03:34.754Z"
            },
            "updatedAt": {
              "$date": "2024-10-07T14:03:34.754Z"
            },
            "__v": 0
          },{
            "_id": {
              "$oid": "6703ea360d49d5017921cd39"
            },
            "src": "D:\\_Treasures75\\_data\\iks\\kangri",
            "dest": "D:\\_Treasures75\\_freeze\\iks\\kangri",
            "destFolderOrProfile": "KANGRI",
            "success": false,
            "msg": "206 files moved from Source dir D:\\_Treasures75\\_data\\iks\\kangri to target dir D:\\_Treasures75\\_freeze\\iks\\kangri.\n        \n0 files had collisions resolved by renaming.\n        \n1 files had errors while moving",
            "errorList": [
              "Exception thrown while moving file D:\\_Treasures75\\_data\\iks\\kangri\\Sampada 2 No 2,No 3,No 4,No 5,No 6,No 7,No 8,No 9,No 10,No 11,No12 A Journal Feb Delhi 1958 - Ashok Prakashan Mandir.pdf to D:\\_Treasures75\\_freeze\\iks\\kangri \nError: ENOENT: no such file or directory, rename 'D:\\_Treasures75\\_data\\iks\\kangri\\Sampada 2 No 2,No 3,No 4,No 5,No 6,No 7,No 8,No 9,No 10,No 11,No12 A Journal Feb Delhi 1958 - Ashok Prakashan Mandir.pdf' -> 'D:\\_Treasures75\\_freeze\\iks\\kangri\\Sampada 2 No 2,No 3,No 4,No 5,No 6,No 7,No 8,No 9,No 10,No 11,No12 A Journal Feb Delhi 1958 - Ashok Prakashan Mandir.pdf'",
              "Exception thrown while moving file D:\\_Treasures75\\_data\\iks\\kangri\\Sampada No 2,No 3,No 4,No 5,No 6,No 7,No 8,No 9,No 10,No 11,No 12 A Journal Feb Delhi 1958 - Ashok Prakashan Mandir.pdf to D:\\_Treasures75\\_freeze\\iks\\kangri \nError: ENOENT: no such file or directory, rename 'D:\\_Treasures75\\_data\\iks\\kangri\\Sampada No 2,No 3,No 4,No 5,No 6,No 7,No 8,No 9,No 10,No 11,No 12 A Journal Feb Delhi 1958 - Ashok Prakashan Mandir.pdf' -> 'D:\\_Treasures75\\_freeze\\iks\\kangri\\Sampada No 2,No 3,No 4,No 5,No 6,No 7,No 8,No 9,No 10,No 11,No 12 A Journal Feb Delhi 1958 - Ashok Prakashan Mandir.pdf'",
              "Exception thrown while moving file D:\\_Treasures75\\_data\\iks\\kangri\\SaraswatiPart 6 No 1,No 2,No 3,No 4,No 5,No 6,No 7,No 8,No 9,No 10,No 11,No 12 ed by Mahaveerprasad Dwivedi Allhabad - Indian Press.pdf to D:\\_Treasures75\\_freeze\\iks\\kangri \nError: ENOENT: no such file or directory, rename 'D:\\_Treasures75\\_data\\iks\\kangri\\SaraswatiPart 6 No 1,No 2,No 3,No 4,No 5,No 6,No 7,No 8,No 9,No 10,No 11,No 12 ed by Mahaveerprasad Dwivedi Allhabad - Indian Press.pdf' -> 'D:\\_Treasures75\\_freeze\\iks\\kangri\\SaraswatiPart 6 No 1,No 2,No 3,No 4,No 5,No 6,No 7,No 8,No 9,No 10,No 11,No 12 ed by Mahaveerprasad Dwivedi Allhabad - Indian Press.pdf'"
            ],
            "fileCollisionsResolvedByRename": [],
            "filesMoved": [],
            "createdAt": {
              "$date": "2024-10-07T14:03:34.754Z"
            },
            "updatedAt": {
              "$date": "2024-10-07T14:03:34.754Z"
            },
            "__v": 0
          }]
        setData(mockData);
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  const rows = data.map((item) => ({
    id: item._id.$oid,
    ...item,
  }))

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <Typography variant="h4" component="h1" gutterBottom>
        JSON Array Listing
      </Typography>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 5, page: 0 },
          },
        }}
        pageSizeOptions={[5, 10, 25]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  )
}

