import { backendServer } from 'utils/constants';
import { makePostCall } from './UploadDataRetrievalService';

export async function launchUploader(profiles: string) {
    return launchGradle(profiles, 'launchUploader')
}

export async function launchGradleMoveToFreeze(profiles: string) {
    return launchGradle(profiles, 'moveToFreeze')
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

export async function launchGoogleDriveDownload(googleDriveLink: string, profile: string) {
    const resource =
        backendServer +
        `yarn/downloadFromGoogleDrive`;

    const result = await makePostCall({
        "googleDriveLink": googleDriveLink,
        "profile": profile
    },
        resource);
    return result.response
}


export async function launchGradle(profiles: string, gradleTask: string) {
    const _url = `${backendServer}execLauncher/${gradleTask}?profiles=${profiles}`
    console.log(`_url ${_url}`);
    const res = await fetch(_url);
    const jsonResp = res.json()
    console.log(`res ${JSON.stringify(jsonResp)}`);
    return jsonResp;
}
;
