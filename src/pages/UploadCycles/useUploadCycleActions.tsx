import React from "react"
import { makePostCallWithErrorHandling, verifyUploadStatusForUploadCycleId } from "service/BackendFetchService"
import { _launchGradlev2, launchGradleReuploadFailed } from "service/launchGradle"
import { launchYarnMoveToFreezeByUploadId } from "service/launchYarn"
import { Box, Button, Typography } from "@mui/material"
import { ERROR_RED } from "constants/colors"

export const TASK_TYPE_ENUM = {
    VERIFY_UPLOAD_STATUS: "Verify Upload Status",
    FIND_MISSING: "Find Missing",
    REUPLOAD_FAILED: "Reupload of Failed-Items",
    REUPLOAD_MISSED: "Reupload of Missed-Items",
    ISOLATE_MISSING: "Isolate Missing",
    ISOLATE_UPLOAD_FAILED: "Isolate Upload Failed",
    MOVE_TO_FREEZE: "Move to Freeze",
}

interface UseUploadCycleActionsProps {
    setIsLoading: (loading: boolean) => void;
    setPopoverTitle: (title: string) => void;
    setPopoverContent: (content: string) => void;
    setPopoverAnchor: (anchor: HTMLButtonElement | null) => void;
    setReactComponent?: (component: JSX.Element) => void;
    fetchData: () => void;
}

export const useUploadCycleActions = ({
    setIsLoading,
    setPopoverTitle,
    setPopoverContent,
    setPopoverAnchor,
    setReactComponent,
    fetchData
}: UseUploadCycleActionsProps) => {

    const handleVerifyUploadStatus = async (uploadCycleId: string, anchorId: string) => {
        setIsLoading(true);
        setPopoverTitle(TASK_TYPE_ENUM.VERIFY_UPLOAD_STATUS)
        try {
            const result = await verifyUploadStatusForUploadCycleId(uploadCycleId);
            setPopoverContent(JSON.stringify(result, null, 2))
            setPopoverAnchor(document.getElementById(anchorId) as HTMLButtonElement)
            fetchData();
        } catch (error) {
            console.error("Error verifying upload status:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFindMissing = async (uploadCycleId: string, anchorId: string, row?: any) => {
        setIsLoading(true);
        setPopoverTitle(TASK_TYPE_ENUM.FIND_MISSING)
        try {
            const missed = await makePostCallWithErrorHandling({
                uploadCycleId: uploadCycleId,
            }, `uploadCycle/getUploadQueueUploadUsheredMissed`);
            const missedData = missed?.response?.missedData;

            setPopoverContent(JSON.stringify(missedData || missed, null, 2))
            setPopoverAnchor(document.getElementById(anchorId) as HTMLButtonElement)

            if (setReactComponent && missedData) {
                const missingTitlesPanel = (
                    <>
                        {(missedData && missedData.length > 0) ?
                            <>
                                {row && (
                                    <Box sx={{ paddingBottom: "10px" }}>
                                        <Typography variant="subtitle2">Action options for {uploadCycleId} available in ActionButtons component.</Typography>
                                    </Box>
                                )}
                                <Typography variant="h6">Missing Titles for {uploadCycleId}</Typography>
                                {
                                    missedData?.map((_data: { archiveProfile: string, missedCount: string, missed: string[] }, index: number) => {
                                        return (
                                            <Box key={index} sx={{ mt: 1 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>({index + 1}) {_data.archiveProfile} ({_data.missedCount})</Typography>
                                                <Box sx={{ color: ERROR_RED, ml: 2 }}>
                                                    {_data.missed.map((item: string, index2: number) => {
                                                        return (<Typography key={index2} variant="caption" sx={{ display: 'block' }}>({index + 1}.{index2 + 1}) {item}</Typography>)
                                                    })}
                                                </Box>
                                            </Box>
                                        )
                                    })
                                }
                            </> :
                            <Typography>No Missing Titles for Upload Cycle with Id: {uploadCycleId}</Typography>
                        }
                    </>
                );
                setReactComponent(missingTitlesPanel);
            }
        } catch (error) {
            console.error("Error finding missing titles:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReupload = async (uploadCycleId: string, anchorId: string) => {
        setIsLoading(true);
        setPopoverTitle(TASK_TYPE_ENUM.REUPLOAD_FAILED)
        try {
            const _resp = await launchGradleReuploadFailed(uploadCycleId);
            setPopoverContent(JSON.stringify(_resp, null, 2))
            setPopoverAnchor(document.getElementById(anchorId) as HTMLButtonElement)
            fetchData();
        } catch (error) {
            console.error("Error reuploading failed items:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleIsolateUploadFailures = async (uploadCycleId: string, anchorId: string) => {
        setIsLoading(true);
        setPopoverTitle(TASK_TYPE_ENUM.ISOLATE_UPLOAD_FAILED)
        try {
            const _res = await _launchGradlev2({
                uploadCycleId: uploadCycleId,
            }, "isolateUploadFailedViaUploadCycleId")
            setPopoverContent(JSON.stringify(_res, null, 2))
            setPopoverAnchor(document.getElementById(anchorId) as HTMLButtonElement)
        } catch (error) {
            console.error("Error isolating upload failures:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMoveToFreeze = async (uploadCycleId: string, anchorId: string) => {
        setIsLoading(true);
        setPopoverTitle(TASK_TYPE_ENUM.MOVE_TO_FREEZE)
        try {
            const _resp = await launchYarnMoveToFreezeByUploadId({
                uploadCycleId: uploadCycleId,
                flatten: "true"
            });
            setPopoverContent(JSON.stringify(_resp, null, 2))
            setPopoverAnchor(document.getElementById(anchorId) as HTMLButtonElement)
            fetchData();
        } catch (error) {
            console.error("Error moving to freeze:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleIsolateMissing = async (uploadCycleId: string, anchorId: string) => {
        setIsLoading(true);
        setPopoverTitle(TASK_TYPE_ENUM.ISOLATE_MISSING)
        try {
            const _res = await _launchGradlev2({
                uploadCycleId: uploadCycleId,
            }, "isolateMissingViaUploadCycleId")
            setPopoverContent(JSON.stringify(_res, null, 2))
            setPopoverAnchor(document.getElementById(anchorId) as HTMLButtonElement)
        } catch (error) {
            console.error("Error isolating missing:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleLaunchReuploadMissed = async (uploadCycleId: string, anchorId: string) => {
        setIsLoading(true);
        setPopoverTitle(TASK_TYPE_ENUM.REUPLOAD_MISSED)
        try {
            const _res = await _launchGradlev2({
                uploadCycleId: uploadCycleId,
            }, "reuploadMissedViaUploadCycleId")
            setPopoverContent(JSON.stringify(_res, null, 2))
            setPopoverAnchor(document.getElementById(anchorId) as HTMLButtonElement)
            fetchData();
        } catch (error) {
            console.error("Error launching reupload missed:", error);
        } finally {
            setIsLoading(false);
        }
    }

    return {
        handleVerifyUploadStatus,
        handleFindMissing,
        handleReupload,
        handleIsolateUploadFailures,
        handleMoveToFreeze,
        handleIsolateMissing,
        handleLaunchReuploadMissed
    };
};
