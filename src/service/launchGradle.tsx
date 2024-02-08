import { backendServer } from 'utils/constants';
import { makePostCall } from './UploadDataRetrievalService';
import { ArchiveProfileAndTitle } from 'mirror/types';
import { ExecResponseDetails } from 'scriptsThruExec/types';

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



export async function launchArchiveExcelDownload(archiveLink: string): Promise<boolean> {
    const resource =
        backendServer +
        `yarn/getArchiveListing`;

    const requestOptions: RequestInit = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "archiveLink": archiveLink
        }),
    };

    const response = await fetch(resource, requestOptions);

    // Assuming the response is a blob
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'links.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return true
}

export async function launchGradle(profiles: string, gradleTask: string) {
    const _url = `${backendServer}execLauncher/${gradleTask}?profiles=${profiles}`
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
