import { ArchiveProfileAndAbsPath } from 'mirror/types';

import { makeGetCall ,makePostCall} from './ApiInterceptor';

export async function launchUploader(profiles: string, optionalParams: { [key: string]: any } = {}) {
    return launchGradle(profiles, 'launchUploader', optionalParams)
}

export async function launchGradleMoveToFreeze(profiles: string) {
    return launchGradle(profiles, 'moveToFreeze')
}

export async function launchGradleReuploadMissed(reuploadables: ArchiveProfileAndAbsPath[]) {
    return launchGradleWithPostData(reuploadables, 'reuploadMissedByProfileAndAbsPath')
}

export async function launchGradleReuploadFailed(uploadCycleId: string) {
    return _launchGradlev2({ uploadCycleId }, 'reuploadFailed')
}

export async function launchReverseMove(profiles: string) {
    return launchGradle(profiles, 'reverseMove')
}

export async function loginToArchive(profiles: string) {
    return launchGradle(profiles, 'loginToArchive')
}

export async function launchBulkRename(profiles: string) {
    return launchGradle(profiles, 'bulkRename')
}

export async function launchLocalFolderListingForAll(params: string) {
    return _launchGradlev2({
        "argFirst": params,
        "pdfsOnly": "false"

    }, 'bookTitles')
}

const extractValue = (text: string, pattern: RegExp): string => {
    const match = text?.match(pattern);
    return match ? match[1] : 'Not found';
  };

export async function launchLocalFolderListingForPdf(params: string) {
    const jsonResp = await _launchGradlev2({
        "argFirst": params,
        "pdfsOnly": "true"
    }, 'bookTitles')

    const totalPages = extractValue(jsonResp?.response.stdout, /Total Pages:\s*([\d,]+)/);
    const totalFileCount = extractValue(jsonResp?.response.stdout, /Total File Count:\s*(\d+)/);
    console.log(`totalPages ${totalPages}`);
    return { totalPages, totalFileCount,response: jsonResp.response }
}

export async function launchGradle(profiles: string, gradleTask: string, optionalParams: { [key: string]: any } = {}) {
    const params = Object.keys(optionalParams).length === 0 ? "" : new URLSearchParams(optionalParams).toString();
    console.log(`optionalParams ${JSON.stringify(optionalParams)} params ${params}`);

    const _url = `execLauncher/${gradleTask}?profiles=${profiles}&${params}`
    console.log(`_url ${_url}`);
    const jsonResp = await makeGetCall(_url);
    return jsonResp;
}

export async function _launchGradle(argFirst: string, gradleTask: string) {
    const _url = `execLauncher/${gradleTask}?argFirst=${argFirst}`
    console.log(`_url ${_url}`);
    const jsonResp = await makeGetCall(_url);
    return jsonResp;
}


export async function _launchGradlev2(args: { [key: string]: string }, gradleTask: string) {
    const params = new URLSearchParams(args).toString();
    const _url = `execLauncher/${gradleTask}?${params}`
    console.log(`_url ${_url}`);
    try {
        const response = await makeGetCall(_url);
        return response;
    }
    catch (error) {
        const err = error as Error;
        console.log(`catch err ${err.message}`)
        return {
            success: false,
            error: "Exception thrown. May be Backend Server down." + err.message
        };
    }
}

export async function launchGradleWithPostData(
    data: ArchiveProfileAndAbsPath[],
    gradleTask: string) {

    const _url = `execLauncher/${gradleTask}`;
    const result = await makePostCall({
        itemsForReupload: data
    }, _url);
    return result.response
}
