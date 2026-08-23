import {
    Table, TableBody, TableCell,
    TableRow, Link,
    IconButton,
    Tooltip,
    Typography
} from "@mui/material"
import { MdList } from "react-icons/md";
import type { ArchiveProfileAndCount, UploadCycleArchiveProfile, UploadCycleTableData } from "mirror/types"
import { UPLOADS_USHERED_PATH } from "Routes/constants"
import React from "react";
import { getCachedValue, getUploadStatusDataForUshered, makePostCallWithErrorHandling } from "../../service/BackendFetchService";
import { _launchGradlev2 } from "../../service/launchGradle";
import ItemsActionPanel, { ItemForAction } from "./ItemsActionPanel";
import { MAX_ITEMS_LISTABLE } from "../../utils/constants";
import ConfirmDialog from "../../widgets/ConfirmDialog";
import ExecPopover from "../../scriptsThruExec/ExecPopover";
import ExecResponsePanel from "../../scriptsThruExec/ExecResponsePanel";

const normalizePath = (p: string) => p?.replace(/\\/g, "/").toLowerCase();


export const NestedTable: React.FC<{ data: UploadCycleTableData }> = ({ data }) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [panelContent, setPanelContent] = React.useState<JSX.Element | null>(null);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [pending, setPending] = React.useState<{ archiveProfile: string, absolutePaths: string[], anchor: HTMLButtonElement } | null>(null);

    const handleTitleClick = (event: React.MouseEvent<HTMLButtonElement>, archiveProfile: string, absolutePaths: string[]) => {
        setPending({ archiveProfile, absolutePaths, anchor: event.currentTarget });
        setOpenDialog(true);
    };

    const handleSingleReupload = async (archiveProfile: string, absPath: string) => {
        setIsLoading(true);
        try {
            const _res = await makePostCallWithErrorHandling({
                uploadCycleId: data.uploadCycleId,
                itemsForReupload: [{ archiveProfile, absolutePath: absPath, uploadCycleId: data.uploadCycleId }]
            }, 'execLauncher/reuploadMissedByProfileAndAbsPath');
            setPanelContent(<ExecResponsePanel response={_res} />);
        } catch (error: any) {
            setPanelContent(<ExecResponsePanel response={{ error: error?.message || String(error) }} />);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSingleIsolate = async (archiveProfile: string, absPath: string) => {
        setIsLoading(true);
        try {
            const _res = await _launchGradlev2({
                gradleArgs: `${archiveProfile} # '${absPath} '`,
            }, "isolateMissingViaAbsPath");
            setPanelContent(<ExecResponsePanel response={_res} />);
        } catch (error: any) {
            setPanelContent(<ExecResponsePanel response={{ error: error?.message || String(error) }} />);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirm = async () => {
        setOpenDialog(false);
        if (!pending) return;
        const { archiveProfile, absolutePaths, anchor } = pending;
        setIsLoading(true);
        try {
            const usheredItems = await getUploadStatusDataForUshered(MAX_ITEMS_LISTABLE, data.uploadCycleId, [archiveProfile]);
            const uploadedPaths = new Set<string>(
                (usheredItems?.response || [])
                    .filter((item: any) => item.uploadFlag === true)
                    .map((item: any) => normalizePath(item.localPath))
            );
            const itemsForAction: ItemForAction[] = absolutePaths.map((absPath) => ({
                archiveProfile,
                absPath,
                alreadyUploaded: uploadedPaths.has(normalizePath(absPath))
            }));
            const panel = (
                <ItemsActionPanel
                    title={`Items for ${data.uploadCycleId}`}
                    items={itemsForAction}
                    onReupload={(profile, absPath) => handleSingleReupload(profile, absPath)}
                    onIsolate={(profile, absPath) => handleSingleIsolate(profile, absPath)}
                />
            );
            setPanelContent(panel);
            setAnchorEl(anchor);
        } catch (error: any) {
            setPanelContent(<ExecResponsePanel response={{ error: error?.message || String(error) }} />);
            setAnchorEl(anchor);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Table size="small">
                <TableBody>
                    {data?.archiveProfileAndCountIntended?.map((archiveProfileAndCount: UploadCycleArchiveProfile,
                        index: number) => (
                        <TableRow key={index}>
                            <TableCell>
                                <Tooltip title={getCachedValue(archiveProfileAndCount.archiveProfile||"") || "No cached info"}>
                                    <Link href={`${UPLOADS_USHERED_PATH}?uploadCycleId=${data.uploadCycleId}&archiveProfile=${archiveProfileAndCount.archiveProfile}`}>
                                        {archiveProfileAndCount.archiveProfile}
                                    </Link>
                                </Tooltip>
                                <Tooltip title="Fetch All Titles">
                                    <IconButton
                                        onClick={(e) => handleTitleClick(e, archiveProfileAndCount?.archiveProfile || "", archiveProfileAndCount?.absolutePaths || [])}
                                        color="primary"
                                        size="medium"
                                        sx={{ ml: 1 }}
                                        disabled={isLoading}
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
            <ConfirmDialog
                openDialog={openDialog}
                handleClose={() => setOpenDialog(false)}
                setOpenDialog={setOpenDialog}
                invokeFuncOnClick2={handleConfirm}
            />
            <ExecPopover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
            >
                {panelContent}
            </ExecPopover>
        </>
    )
}