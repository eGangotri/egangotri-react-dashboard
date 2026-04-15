import React from "react"
import { makePostCallWithErrorHandling, verifyUploadStatusForUploadCycleId } from "service/BackendFetchService"
import { _launchGradlev2, launchGradleReuploadFailed } from "service/launchGradle"
import { launchYarnMoveToFreezeByUploadId } from "service/launchYarn"
import { Box, Button, Typography, CircularProgress } from "@mui/material"
import { ERROR_RED } from "constants/colors"
import ExecResponsePanel from "scriptsThruExec/ExecResponsePanel"

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
                <Box sx={{ mt: 2 }}>
                    <ExecResponsePanel response={missed} />
                </Box>
            </Box>
        );
        setApiResult(missingTitlesPanel);
    }, [isLoading, setApiResult]);

    React.useEffect(() => {
        if (lastMissedData) {
            updateMissedTitlesResult(lastMissedData);
        }
    }, [isLoading, lastMissedData, updateMissedTitlesResult]);

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
        setPopoverTitle(TASK_TYPE_ENUM.FIND_MISSING)
        try {
            const missed = await makePostCallWithErrorHandling({
                uploadCycleId: uploadCycleId,
            }, `uploadCycle/getUploadQueueUploadUsheredMissed`);
            const missedData = missed?.response?.missedData;

            const el = document.getElementById(anchorId);
            if (el) setPopoverAnchor(el as HTMLButtonElement);

            if (missedData) {
                // const missingTitlesPanel = (
                //     <>
                //         {(missedData && missedData.length > 0) ?
                //             <>
                //                 {row && (
                //                     <Box sx={{ paddingBottom: "10px" }}>
                //                         <Typography variant="subtitle2">Action options for {uploadCycleId} available in ActionButtons component.</Typography>
                //                     </Box>
                //                 )}
                //                 <Typography variant="h6">Missing Titles for {uploadCycleId}</Typography>
                //                 {
                //                     missedData?.map((_data: { archiveProfile: string, missedCount: string, missed: string[] }, index: number) => {
                //                         return (
                //                             <Box key={index} sx={{ mt: 1 }}>
                //                                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>({index + 1}) {_data.archiveProfile} ({_data.missedCount})</Typography>
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

    const handleReupload = async (uploadCycleId: string) => {
        const anchorId = getAnchorId(uploadCycleId, TASK_TYPE_ENUM.REUPLOAD_FAILED);
        setIsLoading(true);
        setLastMissedData(null);
        setPopoverTitle(TASK_TYPE_ENUM.REUPLOAD_FAILED)
        try {
            const _resp = await launchGradleReuploadFailed(uploadCycleId);
            setApiResult(<ExecResponsePanel response={_resp} />);
            const el = document.getElementById(anchorId);
            if (el) setPopoverAnchor(el as HTMLButtonElement);
            fetchData();
        } catch (error: any) {
            console.error("Error reuploading failed items:", error);
            setApiResult(<ExecResponsePanel response={{ error: error?.message || String(error) }} />);
            setPopoverAnchor(document.getElementById(anchorId) as HTMLButtonElement)
        } finally {
            setIsLoading(false);
        }
    };

    const handleIsolateUploadFailures = async (uploadCycleId: string) => {
        const anchorId = getAnchorId(uploadCycleId, TASK_TYPE_ENUM.ISOLATE_UPLOAD_FAILED);
        setIsLoading(true);
        setLastMissedData(null);
        setPopoverTitle(TASK_TYPE_ENUM.ISOLATE_UPLOAD_FAILED)
        try {
            const _res = await _launchGradlev2({
                uploadCycleId: uploadCycleId,
            }, "isolateUploadFailedViaUploadCycleId")
            setApiResult(<ExecResponsePanel response={_res} />);
            const el = document.getElementById(anchorId);
            if (el) setPopoverAnchor(el as HTMLButtonElement);
        } catch (error: any) {
            console.error("Error isolating upload failures:", error);
            setApiResult(<ExecResponsePanel response={{ error: error?.message || String(error) }} />);
            const el = document.getElementById(anchorId);
            if (el) setPopoverAnchor(el as HTMLButtonElement);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeIsolateUploadFailures = async (profile: string) => {
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

    return {
        handleVerifyUploadStatus,
        handleFindMissing,
        handleReupload,
        handleIsolateUploadFailures,
        handleDeIsolateUploadFailures,
        handleMoveToFreeze,
        handleIsolateMissing,
        handleLaunchReuploadMissed
    };
};
