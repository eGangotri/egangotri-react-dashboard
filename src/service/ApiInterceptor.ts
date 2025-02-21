import { formatTime } from "mirror/utils";
import { originalMakeGetCall, originalMakePostCall } from "./BackendFetchService";

export const makeGetCall = async (resource: string) => {
    const startTime = performance.now();
    const response = await originalMakeGetCall(resource);
    const endTime = performance.now();
    const timeTaken = endTime - startTime;
    console.log(`timeTaken for ${resource} ${formatTime(timeTaken)}`);
    return {
        ...response,
        timeTaken: formatTime(timeTaken)
    };
};

export const makePostCall = async (body: Record<string, unknown>, resource: string) => {
    const startTime = performance.now();
    const response = await originalMakePostCall(body, resource);
    const endTime = performance.now();
    const timeTaken = endTime - startTime;
    console.log(`timeTaken for ${resource} ${formatTime(timeTaken)}`);
    return {
        ...response,
        timeTaken: formatTime(timeTaken)
    };
};