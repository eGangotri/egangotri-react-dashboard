import { backendServer } from 'utils/constants';
import { makePostCall } from './UploadDataRetrievalService';
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

export async function launchLocalFolderListing(argFirst: string) {
    return _launchGradle(argFirst, 'bookTitles')
}

export async function launchGoogleDriveDownload(googleDriveLink: string,
    profile: string): Promise<ExecResponseDetails> {
    const resource =
        backendServer +
        `yarn/downloadFromGoogleDrive`;

    const result = await makePostCall({
        "googleDriveLink": googleDriveLink,
        "profile": profile
    },
        resource);
    return result.response as ExecResponseDetails
}

export async function launchGoogleDriveExcelListing(googleDriveLink: string, folderName:string ): Promise<ExecResponseDetails> {
    const resource =
        backendServer +
        `yarn/getGoogleDriveListing`;

    const result = await makePostCall({
        "googleDriveLink": googleDriveLink,
        "folderName": folderName
    },
        resource);
    return result.response as ExecResponseDetails
}




export async function launchArchiveExcelDownload(archiveLink: string): Promise<ExecResponseDetails> {
    const resource =
        backendServer +
        `yarn/getArchiveListing`;

    const result = await makePostCall({
        "archiveLink": archiveLink
    }, resource);

    const _result = result.response;
    console.log(`_result ${JSON.stringify(_result)}`)
    if (_result?.success == true) {
        generateExcel(_result.links, _result.excelFileName);
        return {
            excelFileName: _result.excelFileName,
            linkCount: `${_result.links.length}`
        } as ExecResponseDetails;
    }
    else {
        return {
            excelFileName: "Error",
            linkCount: "Error"
        } as ExecResponseDetails;

    }
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

export async function launchGradleWithPostData(
    data: ArchiveProfileAndTitle[],
    gradleTask: string) {

    const _url = `${backendServer}execLauncher/${gradleTask}`;
    const result = await makePostCall({
        itemsForReupload: data
    }, _url);
    return result.response
}


interface LinkData {
    link: string;
    title: string;
}

const generateExcel = (data: LinkData[], excelfileName: string) => {
    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, `${excelfileName}`);

    const homeDirectory = os.homedir();
    const downloadDirectory = path.join(homeDirectory, 'Downloads');
    const filePath = path.join(downloadDirectory, `${excelfileName}.xlsx`);

    writeFile(workbook, filePath);
};