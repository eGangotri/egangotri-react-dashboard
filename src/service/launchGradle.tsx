import { backendServer } from 'utils/constants';
import { ArchiveProfileAndAbsPath } from 'mirror/types';

import { utils, writeFile } from 'xlsx';
import os from 'os';
import path from 'path';
import { makePostCall } from 'mirror/utils';

export async function launchUploader(profiles: string, optionalParams: string = "") {
    return launchGradle(profiles, 'launchUploader',optionalParams)
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

export async function launchLocalFolderListingForPdf(params: string) {
    return _launchGradlev2({
        "argFirst": params,
        "pdfsOnly": "true"
    }, 'bookTitles')
}

export async function launchGradle(profiles: string, gradleTask: string, optionalParams: string="") {
    const _url = `${backendServer}execLauncher/${gradleTask}?profiles=${profiles}&optionalParams=${optionalParams}`
    console.log(`_url ${_url}`);
    const res = await fetch(_url);
    const jsonResp = res.json()
    console.log(`res ${JSON.stringify(jsonResp)}`);
    return jsonResp;
}

export async function _launchGradle(argFirst: string, gradleTask: string) {
    const _url = `${backendServer}execLauncher/${gradleTask}?argFirst=${argFirst}`
    console.log(`_url ${_url}`);
    const res = await fetch(_url);
    const jsonResp = res.json()
    console.log(`res ${JSON.stringify(jsonResp)}`);
    return jsonResp;
}


export async function _launchGradlev2(args: { [key: string]: string }, gradleTask: string) {
    const params = new URLSearchParams(args).toString();
    const _url = `${backendServer}execLauncher/${gradleTask}?${params}`
    console.log(`_url ${_url}`);
    try {
        const response = await fetch(_url);
        if (response.ok) {
            const jsonResp = response.json()
            console.log(`_launchGradlev2: res ${JSON.stringify(jsonResp)}`);
            return jsonResp
        }
        else {
            console.log(`response not ok ${response.statusText}`)
            return {
                success: false,
                error: response.statusText
            };
        }
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

    const _url = `${backendServer}execLauncher/${gradleTask}`;
    const result = await makePostCall({
        itemsForReupload: data
    }, _url);
    return result.response
}
