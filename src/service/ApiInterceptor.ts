import { formatTime } from "mirror/utils";
import { originalMakeGetCall, originalMakePostCall } from "./BackendFetchService";

const makeCall = async (callFunction: Function, ...args: any[]) => {
    const startTime = performance.now();
    const result = await callFunction(...args);
    const endTime = performance.now();
    const timeTaken = endTime - startTime;
    console.log(`timeTaken for ${args[1] || args[0]} ${formatTime(timeTaken)}`);

    if (result.response) {
        if (!Array.isArray(result.response)) {
            const origResp = result.response;
            return {
                response: {
                    timeTaken: formatTime(timeTaken),
                    ...origResp,
                }
            }
        }
        return {
            timeTaken: formatTime(timeTaken),
            ...result,
        }
    }
    return {
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