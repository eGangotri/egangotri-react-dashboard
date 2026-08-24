import React from "react"
import { getUploadStatusDataForUshered, makePostCallWithErrorHandling, verifyUploadStatusForUploadCycleId } from "service/BackendFetchService"
import { _launchGradlev2, launchGradleReuploadFailed } from "service/launchGradle"
import { launchYarnMoveToFreezeByUploadId } from "service/launchYarn"
import { Box, Button, Typography, CircularProgress } from "@mui/material"

import ExecResponsePanel from "scriptsThruExec/ExecResponsePanel"
import ItemsActionPanel, { ItemForAction } from "./ItemsActionPanel"
import { MAX_ITEMS_LISTABLE } from "utils/constants"

export const TASK_TYPE_ENUM = {
    VERIFY_UPLOAD_STATUS: "Verify Upload Status",
    FIND_MISSING: "Find Missing",
    REUPLOAD_FAILED: "Reupload of Failed-Items",
    REUPLOAD_MISSED: "Reupload of Missed-Items",
    ISOLATE_MISSING: "Isolate Missing",
    ISOLATE_UPLOAD_FAILED: "Isolate Upload Failed",
    DE_ISOLATE_UPLOAD_FAILED: "De-Isolate Upload Failed",
    MOVE_TO_FREEZE: "Move to Freeze",
}

interface UseUploadCycleActionsProps {
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    setPopoverTitle: (title: string) => void;
    setApiResult: (result: JSX.Element | null) => void;
    setPopoverAnchor: (anchor: HTMLButtonElement | null) => void;
    fetchData: () => void;
}

const getTitleFromPath = (filePath: string) => {
    const backslash = String.fromCharCode(92);
    const lastSep = Math.max(filePath.lastIndexOf('/'), filePath.lastIndexOf(backslash));
    const fileName = lastSep >= 0 ? filePath.slice(lastSep + 1) : filePath;
    const lastDot = fileName.lastIndexOf('.');
    return lastDot > 0 ? fileName.slice(0, lastDot) : fileName;
};

export const useUploadCycleActions = ({
    isLoading,
    setIsLoading,
    setPopoverTitle,
    setApiResult,
    setPopoverAnchor,
    fetchData
}: UseUploadCycleActionsProps) => {

    const [lastMissedData, setLastMissedData] = React.useState<any>(null);

    const updateMissedTitlesResult = React.useCallback((data: any) => {
        if (!data) return;
        const { uploadCycleId, missedData, missed } = data;
        const archiveProfile = missedData && missedData.length > 0 ? missedData[0].archiveProfile : "";
        const missingTitlesPanel = (
            <Box>
                {(missedData && missedData.length > 0) ?
                    <>
                        <Box sx={{ paddingBottom: "30px" }}>
                            <Button
                                variant="contained"
                                onClick={() => handleLaunchReuploadMissed(uploadCycleId)}
                                size="small"
                                sx={{ width: "200px", marginTop: "20px", marginRight: "20px" }}
                                disabled={isLoading}
                                startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : null}
                            >
                                Reupload Missed
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => handleIsolateMissing(uploadCycleId)}
                                size="small"
                                sx={{ width: "200px", marginTop: "20px" }}
                                disabled={isLoading}
                                startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : null}
                            >
                                Isolate Missed
                            </Button>
                        </Box>
                        <ItemsActionPanel
                            title={`Missing Titles for Profile: ${archiveProfile} and Id ${uploadCycleId}`}
                            items={(missedData || []).flatMap((_data: { archiveProfile: string, missedCount: string, missed: string[] }) =>
                                (_data.missed || []).map((item: string): ItemForAction => ({
                                    absPath: item,
                                    alreadyUploaded: false,
                                    archiveProfile: archiveProfile
                                })))}
                            disabled={isLoading}
                            onReupload={(archiveProfile, absPath, anchor) => handleSingleUpload(uploadCycleId, archiveProfile, absPath, anchor)}
                            onIsolate={(archiveProfile, absPath, anchor) => handleSingleIsolate(archiveProfile, absPath, anchor)}
                        />
                    </> :
                    <Typography>No Missing Titles for Profile: ${archiveProfile} and Upload Cycle with Id: {uploadCycleId}</Typography>
                }
                <Box sx={{ mt: 2 }}>
                    <ExecResponsePanel response={missed} />
                </Box>
            </Box >
        );
        setApiResult(missingTitlesPanel);
    }, [isLoading, setApiResult]);

    React.useEffect(() => {
        if (lastMissedData) {
            updateMissedTitlesResult(lastMissedData);
        }
    }, [isLoading, lastMissedData, updateMissedTitlesResult]);

    const [lastFailedData, setLastFailedData] = React.useState<any>(null);

    const updateFailedItemsResult = React.useCallback((data: any) => {
        if (!data) return;
        const { uploadCycleId, failedItems, summary } = data;

        const profile = failedItems?.length > 0 ? failedItems[0]?.archiveProfile : ""
        const failedItemsPanel = (
            <Box>
                {(failedItems && failedItems.length > 0) ?
                    <>
                        <Box sx={{ paddingBottom: "30px" }}>
                            <Button
                                variant="contained"
                                onClick={() => handleReupload(uploadCycleId)}
                                size="small"
                                sx={{ width: "200px", marginTop: "20px", marginRight: "20px" }}
                                disabled={isLoading}
                                startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : null}
                            >
                                Reupload Failed
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => handleIsolateUploadFailures(uploadCycleId)}
                                size="small"
                                sx={{ width: "200px", marginTop: "20px" }}
                                disabled={isLoading}
                                startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : null}
                            >
                                Isolate Failed
                            </Button>
                        </Box>
                        <ItemsActionPanel
                            title={`Failed Items for (${profile}) with Id: ${uploadCycleId}`}
                            items={(failedItems || []).map((item: any): ItemForAction => ({
                                absPath: item.localPath,
                                alreadyUploaded: false,
                                archiveProfile: profile
                            }))}
                            disabled={isLoading}
                            onReupload={(archiveProfile, absPath, anchor) => handleSingleUpload(uploadCycleId, archiveProfile, absPath, anchor)}
                            onIsolate={(archiveProfile, absPath, anchor) => handleSingleIsolate(archiveProfile, absPath, anchor)}
                        />
                    </> :
                    <Typography>No Failed Items for Profile ${profile} with Upload Cycle Id: {uploadCycleId}</Typography>
                }
                <Box sx={{ mt: 2 }}>
                    <ExecResponsePanel response={summary} />
                </Box>
            </Box>
        );
        setApiResult(failedItemsPanel);
    }, [isLoading, setApiResult]);

    React.useEffect(() => {
        if (lastFailedData) {
            updateFailedItemsResult(lastFailedData);
        }
    }, [isLoading, lastFailedData, updateFailedItemsResult]);

    const getAnchorId = (uploadCycleId: string, taskType: string) => {
        switch (taskType) {
            case TASK_TYPE_ENUM.VERIFY_UPLOAD_STATUS:
                return `verify-button-${uploadCycleId}`;
            case TASK_TYPE_ENUM.FIND_MISSING:
            case TASK_TYPE_ENUM.ISOLATE_MISSING:
            case TASK_TYPE_ENUM.REUPLOAD_MISSED:
                return `find-missing-button-${uploadCycleId}`;
            case TASK_TYPE_ENUM.REUPLOAD_FAILED:
                return `reupload-button-${uploadCycleId}`;
            case TASK_TYPE_ENUM.ISOLATE_UPLOAD_FAILED:
                return `isolate-failures-button-${uploadCycleId}`;
            case TASK_TYPE_ENUM.DE_ISOLATE_UPLOAD_FAILED:
                return `de-isolate-failures-button-${uploadCycleId}`;
            case TASK_TYPE_ENUM.MOVE_TO_FREEZE:
                return `freeze-button-${uploadCycleId}`;
            default:
                return `button-${uploadCycleId}`;
        }
    }

    const handleVerifyUploadStatus = async (uploadCycleId: string) => {
        const anchorId = getAnchorId(uploadCycleId, TASK_TYPE_ENUM.VERIFY_UPLOAD_STATUS);
        setIsLoading(true);
        setLastMissedData(null);
        setPopoverTitle(TASK_TYPE_ENUM.VERIFY_UPLOAD_STATUS)
        try {
            const result = await verifyUploadStatusForUploadCycleId(uploadCycleId);
            setApiResult(<ExecResponsePanel response={result} />);
            const el = document.getElementById(anchorId);
            if (el) setPopoverAnchor(el as HTMLButtonElement);
            fetchData();
        } catch (error: any) {
            console.error("Error verifying upload status:", error);
            setApiResult(<ExecResponsePanel response={{ error: error?.message || String(error) }} />);
            setPopoverAnchor(document.getElementById(anchorId) as HTMLButtonElement)
        } finally {
            setIsLoading(false);
        }
    };

    const handleFindMissing = async (uploadCycleId: string, row?: any) => {
        const anchorId = getAnchorId(uploadCycleId, TASK_TYPE_ENUM.FIND_MISSING);
        setIsLoading(true);
        setLastFailedData(null);
        setPopoverTitle(TASK_TYPE_ENUM.FIND_MISSING)
        try {
            const missed = await makePostCallWithErrorHandling({
                uploadCycleId: uploadCycleId,
            }, `uploadCycle/getUploadQueueUploadUsheredMissed`);
            const missedData = missed?.response?.missedData;

            const el = document.getElementById(anchorId);
            if (el) setPopoverAnchor(el as HTMLButtonElement);

            if (missedData) {
                setLastMissedData({ uploadCycleId, missedData, missed });
            } else {
                setApiResult(<ExecResponsePanel response={missed} />);
                setLastMissedData(null);
            }
        } catch (error: any) {
            console.error("Error finding missing titles:", error);
            setApiResult(<ExecResponsePanel response={{ error: error?.message || String(error) }} />);
            const el = document.getElementById(anchorId);
            if (el) setPopoverAnchor(el as HTMLButtonElement);
            setLastMissedData(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleShowUploadFailures = async (uploadCycleId: string) => {
        const anchorId = getAnchorId(uploadCycleId, TASK_TYPE_ENUM.REUPLOAD_FAILED);
        setIsLoading(true);
        setLastMissedData(null);
        setPopoverTitle(TASK_TYPE_ENUM.REUPLOAD_FAILED)
        try {
            const usheredItems = await getUploadStatusDataForUshered(MAX_ITEMS_LISTABLE, uploadCycleId);
            const allItems: any[] = usheredItems?.response || [];
            const failedItems = allItems.filter((item: any) => item.uploadFlag !== true);
            const summary = {
                uploadCycleId,
                totalUsheredCount: allItems.length,
                failedCount: failedItems.length
            };
            const el = document.getElementById(anchorId);
            if (el) setPopoverAnchor(el as HTMLButtonElement);
            setLastFailedData({ uploadCycleId, failedItems, summary });
        } catch (error: any) {
            console.error("Error fetching failed items:", error);
            setApiResult(<ExecResponsePanel response={{ error: error?.message || String(error) }} />);
            setPopoverAnchor(document.getElementById(anchorId) as HTMLButtonElement)
            setLastFailedData(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReupload = async (uploadCycleId: string) => {
        const anchorId = getAnchorId(uploadCycleId, TASK_TYPE_ENUM.REUPLOAD_FAILED);
        setIsLoading(true);
        setLastMissedData(null);
        // We keep lastFailedData so the panel updates with loading state
        setPopoverTitle(TASK_TYPE_ENUM.REUPLOAD_FAILED)
        try {
            const _resp = await launchGradleReuploadFailed(uploadCycleId);
            setApiResult(<ExecResponsePanel response={_resp} />);
            const el = document.getElementById(anchorId);
            if (el) setPopoverAnchor(el as HTMLButtonElement);
            fetchData();
            setLastFailedData(null); // Clear now that we have a final result
        } catch (error: any) {
            console.error("Error reuploading failed items:", error);
            setApiResult(<ExecResponsePanel response={{ error: error?.message || String(error) }} />);
            setPopoverAnchor(document.getElementById(anchorId) as HTMLButtonElement)
            setLastFailedData(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleIsolateUploadFailures = async (uploadCycleId: string) => {
        const anchorId = getAnchorId(uploadCycleId, TASK_TYPE_ENUM.ISOLATE_UPLOAD_FAILED);
        setIsLoading(true);
        setLastMissedData(null);
        // We keep lastFailedData so the panel updates with loading state
        setPopoverTitle(TASK_TYPE_ENUM.ISOLATE_UPLOAD_FAILED)
        try {
            const _res = await _launchGradlev2({
                uploadCycleId: uploadCycleId,
            }, "isolateUploadFailedViaUploadCycleId")
            setApiResult(<ExecResponsePanel response={_res} />);
            const el = document.getElementById(anchorId);
            if (el) setPopoverAnchor(el as HTMLButtonElement);
            setLastFailedData(null); // Clear now that we have a final result
        } catch (error: any) {
            console.error("Error isolating upload failures:", error);
            setApiResult(<ExecResponsePanel response={{ error: error?.message || String(error) }} />);
            const el = document.getElementById(anchorId);
            if (el) setPopoverAnchor(el as HTMLButtonElement);
            setLastFailedData(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeIsolateFailedUploads = async (profile: string) => {
        const anchorId = getAnchorId(profile, TASK_TYPE_ENUM.DE_ISOLATE_UPLOAD_FAILED);
        setIsLoading(true);
        setLastMissedData(null);
        setPopoverTitle(TASK_TYPE_ENUM.DE_ISOLATE_UPLOAD_FAILED)
        try {
            const _res = await _launchGradlev2({
                profile: profile,
            }, "deIsolateByProfile")
            setApiResult(<ExecResponsePanel response={_res} />);
            const el = document.getElementById(anchorId);
            if (el) setPopoverAnchor(el as HTMLButtonElement);
        } catch (error: any) {
            console.error("Error de-isolating upload failures:", error);
            setApiResult(<ExecResponsePanel response={{ error: error?.message || String(error) }} />);
            const el = document.getElementById(anchorId);
            if (el) setPopoverAnchor(el as HTMLButtonElement);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMoveToFreeze = async (uploadCycleId: string) => {
        const anchorId = getAnchorId(uploadCycleId, TASK_TYPE_ENUM.MOVE_TO_FREEZE);
        setIsLoading(true);
        setLastMissedData(null);
        setPopoverTitle(TASK_TYPE_ENUM.MOVE_TO_FREEZE)
        try {
            const _resp = await launchYarnMoveToFreezeByUploadId({
                uploadCycleId: uploadCycleId,
                flatten: "true"
            });
            setApiResult(<ExecResponsePanel response={_resp} />);
            const el = document.getElementById(anchorId);
            if (el) setPopoverAnchor(el as HTMLButtonElement);
            fetchData();
        } catch (error: any) {
            console.error("Error moving to freeze:", error);
            setApiResult(<ExecResponsePanel response={{ error: error?.message || String(error) }} />);
            const el = document.getElementById(anchorId);
            if (el) setPopoverAnchor(el as HTMLButtonElement);
        } finally {
            setIsLoading(false);
        }
    };

    const handleIsolateMissing = async (uploadCycleId: string) => {
        const anchorId = getAnchorId(uploadCycleId, TASK_TYPE_ENUM.ISOLATE_MISSING);
        setIsLoading(true);
        setPopoverTitle(TASK_TYPE_ENUM.ISOLATE_MISSING)
        try {
            const _res = await _launchGradlev2({
                uploadCycleId: uploadCycleId,
            }, "isolateMissingViaUploadCycleId")
            setApiResult(<ExecResponsePanel response={_res} />);
            const el = document.getElementById(anchorId);
            if (el) setPopoverAnchor(el as HTMLButtonElement);
        } catch (error: any) {
            console.error("Error isolating missing:", error);
            setApiResult(<ExecResponsePanel response={{ error: error?.message || String(error) }} />);
            const el = document.getElementById(anchorId);
            if (el) setPopoverAnchor(el as HTMLButtonElement);
        } finally {
            setIsLoading(false);
        }
    }

    const handleLaunchReuploadMissed = async (uploadCycleId: string) => {
        const anchorId = getAnchorId(uploadCycleId, TASK_TYPE_ENUM.REUPLOAD_MISSED);
        setIsLoading(true);
        // We keep lastMissedData so the panel updates with loading state
        setPopoverTitle(TASK_TYPE_ENUM.REUPLOAD_MISSED)
        try {
            const _res = await _launchGradlev2({
                uploadCycleId: uploadCycleId,
            }, "reuploadMissedViaUploadCycleId")
            setApiResult(<ExecResponsePanel response={_res} />);
            const el = document.getElementById(anchorId);
            if (el) setPopoverAnchor(el as HTMLButtonElement);
            fetchData();
            setLastMissedData(null); // Clear now that we have a final result
        } catch (error: any) {
            console.error("Error launching reupload missed:", error);
            setApiResult(<ExecResponsePanel response={{ error: error?.message || String(error) }} />);
            const el = document.getElementById(anchorId);
            if (el) setPopoverAnchor(el as HTMLButtonElement);
            setLastMissedData(null);
        } finally {
            setIsLoading(false);
        }
    }

    const handleSingleUpload = async (uploadCycleId: string, archiveProfile: string, absPath: string, anchor: HTMLButtonElement) => {
        setIsLoading(true);
        setPopoverTitle("Single Upload")
        try {
            const _res = await makePostCallWithErrorHandling({
                uploadCycleId,
                itemsForReupload: [{ archiveProfile, absolutePath: absPath, uploadCycleId: uploadCycleId }]
            }, 'execLauncher/reuploadMissedByProfileAndAbsPath');
            setApiResult(<ExecResponsePanel response={_res} />);
            setPopoverAnchor(anchor);
        } catch (error: any) {
            console.error("Error uploading single item:", error);
            setApiResult(<ExecResponsePanel response={{ error: error?.message || String(error) }} />);
            setPopoverAnchor(anchor);
        } finally {
            setIsLoading(false);
        }
    }

    const handleSingleIsolate = async (archiveProfile: string, absPath: string, anchor: HTMLButtonElement) => {
        setIsLoading(true);
        setPopoverTitle("Isolate Missed")
        try {
            const _res = await _launchGradlev2({
                gradleArgs: `${archiveProfile} # '${absPath} '`,
            }, "isolateMissingViaAbsPath");
            setApiResult(<ExecResponsePanel response={_res} />);
            setPopoverAnchor(anchor);
        } catch (error: any) {
            console.error("Error isolating single item:", error);
            setApiResult(<ExecResponsePanel response={{ error: error?.message || String(error) }} />);
            setPopoverAnchor(anchor);
        } finally {
            setIsLoading(false);
        }
    }

    return {
        handleVerifyUploadStatus,
        handleFindMissing,
        handleShowUploadFailures,
        handleReupload,
        handleIsolateUploadFailures,
        handleDeIsolateUploadFailures: handleDeIsolateFailedUploads,
        handleMoveToFreeze,
        handleIsolateMissing,
        handleLaunchReuploadMissed
    };
};
