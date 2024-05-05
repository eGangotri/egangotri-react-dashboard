import React from 'react';
import { Link, TableCell, TableRow } from "@mui/material";
import { UPLOADS_QUEUED_PATH, UPLOADS_USHERED_PATH } from "Routes";
import { ArchiveProfileAndCount, UploadCycleTableData } from "mirror/types";

type UploadCycleDataProp = {
    row: UploadCycleTableData,
    forQueue: boolean

}

export const ProfileAndCount: React.FC<UploadCycleDataProp> = ({ row, forQueue = false }) => {
    const archiveProfileAndCountMap = forQueue ? row.archiveProfileAndCountForQueue : row.archiveProfileAndCount;
    const _path = forQueue ? UPLOADS_QUEUED_PATH : UPLOADS_USHERED_PATH
    return (
        <>
            {
                archiveProfileAndCountMap?.map((arcProfAndCount: ArchiveProfileAndCount) =>
                (
                    <TableRow key={arcProfAndCount.archiveProfile}>
                        <TableCell className="centerAligned">
                            <Link href={`${_path}?uploadCycleId=${row.uploadCycleId}&archiveProfile=${arcProfAndCount.archiveProfile}`}>
                                {arcProfAndCount.archiveProfile}
                            </Link>
                        </TableCell>
                        <TableCell className="centerAligned">{arcProfAndCount.count}</TableCell>
                    </TableRow>
                )
                )
            }
        </>
    )
}