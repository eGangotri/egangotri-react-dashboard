"use client"

import type React from "react"
import {
    Table, TableBody, TableCell,
    TableHead, TableRow, Link
} from "@mui/material"
import type {  ArchiveProfileAndCount } from "mirror/types"
import { UPLOADS_USHERED_PATH } from "Routes/constants"


export const NestedTable: React.FC<{ data: ArchiveProfileAndCount[], uploadCycleId: string }> = ({ data, uploadCycleId }) => (
    <Table size="small">
        <TableHead>
            <TableRow>
                <TableCell>Archive Profile</TableCell>
                <TableCell>Count</TableCell>
                <TableCell>Upload Success</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {data.map((item, index) => (
                <TableRow key={index}>
                    <TableCell>
                        <Link href={`${UPLOADS_USHERED_PATH}?uploadCycleId=${uploadCycleId}&archiveProfile=${item.archiveProfile}`}>
                            {item.archiveProfile}
                        </Link></TableCell>
                    <TableCell>{item.count}</TableCell>
                    <TableCell>{item.uploadSuccessCount}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
)