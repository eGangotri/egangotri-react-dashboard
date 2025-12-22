import {
    Table, TableBody, TableCell,
    TableHead, TableRow, Link,
    Button,
    Box,
    IconButton,
    Tooltip,
    Typography
} from "@mui/material"
import { MdList } from "react-icons/md";
import type { ArchiveProfileAndCount, UploadCycleArchiveProfile, UploadCycleTableData } from "mirror/types"
import { UPLOADS_USHERED_PATH } from "Routes/constants"
import path from 'path';
import React from "react";
import { ResultDisplayPopover } from "../../widgets/ResultDisplayPopover";


export const NestedTable: React.FC<{ data: UploadCycleTableData }> = ({ data }) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [titlesForPopover, setTitlesForPopover] = React.useState<string>("");
    const handleTitleClick = (event: React.MouseEvent<HTMLButtonElement>, absolutePaths: string[]) => {
        const _titles = (
            <>
                {absolutePaths?.map((absPath, index) => <Box>({index + 1}) {path.basename(absPath)}</Box>)}
            </>
        )
        setTitlesForPopover(absolutePaths?.map((absPath, index) => `(${index + 1}) ${path.basename(absPath)}`).join("\n"));
        console.log("handleTitleClick: " + event.currentTarget)
        setAnchorEl(event.currentTarget);
    };

    return (
        <>
            <Table size="small">
                <TableBody>
                    {data?.archiveProfileAndCountIntended?.map((archiveProfileAndCount: UploadCycleArchiveProfile,
                        index: number) => (
                        <TableRow key={index}>
                            <TableCell>
                                <Link href={`${UPLOADS_USHERED_PATH}?uploadCycleId=${data.uploadCycleId}&archiveProfile=${archiveProfileAndCount.archiveProfile}`}>
                                    {archiveProfileAndCount.archiveProfile}
                                </Link>
                                <Tooltip title="Fetch All Titles">
                                    <IconButton
                                        onClick={(e) => handleTitleClick(e, archiveProfileAndCount?.absolutePaths || [])}
                                        color="primary"
                                        size="medium"
                                        sx={{ ml: 1 }}

                                    >
                                        <MdList />
                                        <Typography variant="caption" sx={{ ml: 0.5 }}>
                                            ({archiveProfileAndCount.count})
                                        </Typography>
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <ResultDisplayPopover popoverAnchor={anchorEl}
                setPopoverAnchor={setAnchorEl}
                popoverContent={titlesForPopover} actionType="Titles" />
        </>
    )
}