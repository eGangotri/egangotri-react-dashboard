import { backendServer } from 'utils/constants';
import { makePostCall } from './BackendFetchService';
import { ArchiveProfileAndTitle } from 'mirror/types';
import { ExecResponseDetails } from 'scriptsThruExec/types';

import { utils, writeFile } from 'xlsx';
import os from 'os';
import path from 'path';

export async function launchUploader(profiles: string) {
    return launchGradle(profiles, 'launchUploader')
}

export async function launchGradleMoveToFreeze(profiles: string) {
    return launchGradle(profiles, 'moveToFreeze')
}

export async function launchGradleReuploadMissed(reuploadables: ArchiveProfileAndTitle[]) {
    return launchGradleWithPostData(reuploadables, 'reuploadMissed')
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

export async function launchGradle(profiles: string, gradleTask: string) {
    const _url = `${backendServer}execLauncher/${gradleTask}?profiles=${profiles}`
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
    const res = await fetch(_url);
    const jsonResp = res.json()
    console.log(`res ${JSON.stringify(jsonResp)}`);
    return jsonResp;
}

export async function launchGradleWithPostData(
    data: ArchiveProfileAndTitle[],
    gradleTask: string) {

    const _url = `${backendServer}execLauncher/${gradleTask}`;
    const result = await makePostCall({
        itemsForReupload: data
    }, _url);
    return result.response
}
