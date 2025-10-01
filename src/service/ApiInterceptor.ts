import { formatTime } from "mirror/utils";
import { originalMakeGetCall, originalMakePostCall } from "./BackendFetchService";

const makeCall = async (callFunction: Function, ...args: any[]) => {
    const startTime = performance.now();
    const result = await callFunction(...args);
    const endTime = performance.now();
    const timeTaken = endTime - startTime;
    console.log(`timeTaken for ${args[1] || args[0]} ${formatTime(timeTaken)}`);

    return {
        date: new Date().toISOString(),
        timeTaken: formatTime(timeTaken),
        ...result
    };
};

export const makeGetCall = async (resource: string) => {
    return makeCall(originalMakeGetCall, resource);
};

export const makePostCall = async (body: Record<string, unknown>, resource: string) => {
    return makeCall(originalMakePostCall, body, resource);
}