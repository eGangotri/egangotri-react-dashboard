import {
    Table, TableBody, TableCell,
    TableHead, TableRow, Link,
    Button,
    Box
} from "@mui/material"
import type { ArchiveProfileAndCount, UploadCycleArchiveProfile, UploadCycleTableData } from "mirror/types"
import { UPLOADS_USHERED_PATH } from "Routes/constants"
import path from 'path';
import React from "react";
import { UploadCycleListPopover } from "./UploadCycleListPopover";


export const NestedTable: React.FC<{ data: UploadCycleTableData }> = ({ data }) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [titlesForPopover, setTitlesForPopover] = React.useState<JSX.Element | null>(null);
    const handleTitleClick = (event: React.MouseEvent<HTMLButtonElement>, absolutePaths: string[]) => {
        const _titles = (
            <>
                {absolutePaths?.map((absPath, index) => <Box>({index + 1}) {path.basename(absPath)}</Box>)}
            </>
        )
        setTitlesForPopover(_titles);
        console.log("handleTitleClick: " + event.currentTarget)
        setAnchorEl(event.currentTarget);
    };

    return (
        <>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Archive Profile</TableCell>
                        <TableCell>Titles</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data?.archiveProfileAndCountIntended?.map((archiveProfileAndCount: UploadCycleArchiveProfile,
                        index: number) => (
                        <TableRow key={index}>
                            <TableCell>
                                <Link href={`${UPLOADS_USHERED_PATH}?uploadCycleId=${data.uploadCycleId}&archiveProfile=${archiveProfileAndCount.archiveProfile}`}>
                                    {archiveProfileAndCount.archiveProfile}
                                </Link></TableCell>
                            <TableCell>
                                <Button
                                    variant='contained'
                                    onClick={(e) => handleTitleClick(e, archiveProfileAndCount?.absolutePaths || [])}
                                //disabled={isLoading}
                                >
                                    Fetch All Titles ({archiveProfileAndCount.count})
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <UploadCycleListPopover uploadCycleId={data.uploadCycleId} row={data} popoverAnchor={anchorEl} setPopoverAnchor={setAnchorEl} popoverContent={titlesForPopover} actionType="Titles" />
        </>
    )
}