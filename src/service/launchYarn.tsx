import { backendServer } from 'utils/constants';
import { makePostCall } from './UploadDataRetrievalService';
import { ArchiveProfileAndTitle } from 'mirror/types';
import { ExecResponseDetails } from 'scriptsThruExec/types';

export async function launchVanitizeModule(
    profile: string): Promise<ExecResponseDetails> {
    const resource =
        backendServer +
        `yarn/vanitizePdfs`;

    const result = await makePostCall({ profile },
        resource);
    return result.response as ExecResponseDetails
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

export async function launchYarnQaToDestFileMover(
    postParams: Record<string, string>): Promise<ExecResponseDetails> {
    const resource =
        backendServer +
        `yarn/qaToDestFileMover`;

    const result = await makePostCall(postParams,
        resource);
    return result.response as ExecResponseDetails
}

export async function launchYarnMoveToFreeze(
    postParams: Record<string, string>): Promise<ExecResponseDetails> {
    const resource =
        backendServer +
        `yarn/yarnMoveProfilesToFreeze`;

    const result = await makePostCall(postParams,
        resource);
    return result.response as ExecResponseDetails
}

export async function launchLocalFolderListingYarn(
    postParams: Record<string, string>): Promise<ExecResponseDetails> {
    console.log(`postParams ${JSON.stringify(postParams)}`)
    const resource =
        backendServer +
        `yarn/yarnGetTitleListings`;

    const result = await makePostCall(postParams,
        resource);
    return result.response as ExecResponseDetails
}


export async function addHeaderFooter(
    profile: string): Promise<ExecResponseDetails> {
    const resource =
        backendServer +
        `yarn/addHeaderFooter`;

    const result = await makePostCall({
        "profile": profile
    },
        resource);
    return result.response as ExecResponseDetails
}

export async function launchGoogleDriveExcelListing(googleDriveLink: string, folderName: string): Promise<ExecResponseDetails> {
    const resource =
        backendServer +
        `yarnListMaker/getGoogleDriveListing`;

    const result = await makePostCall({
        "googleDriveLink": googleDriveLink,
        "folderName": folderName
    },
        resource);
    return result.response as ExecResponseDetails
}

export async function launchArchiveExcelDownload(archiveLinks: string, limitedFields = false): Promise<ExecResponseDetails> {
    const resource =
        backendServer +
        `yarnListMaker/getArchiveListing`;

    if (!archiveLinks.trim().includes(',') && /\s/.test(archiveLinks.trim())) {
        archiveLinks = archiveLinks.split(/\s+/).join(',');
        console.log(`archiveLink ${JSON.stringify(archiveLinks)}`)
    }
    const result = await makePostCall({
        archiveLinks,
        limitedFields,
        onlyLinks: false
    }, resource);

    const _result = result.response;
    console.log(`_result ${JSON.stringify(_result)}`)
    return {
        ..._result
    } as ExecResponseDetails;
}


export async function launchGetFirstAndLastNPages(postParams: Record<string, string>): Promise<ExecResponseDetails> {
    const resource =
        backendServer +
        `yarnListMaker/getFirstAndLastNPages`;

    const result = await makePostCall(postParams,
        resource);
    return result.response as ExecResponseDetails
}

export async function launchArchivePdfDownload(archiveLink: string, profileOrFilePath: string): Promise<ExecResponseDetails> {
    const resource =
        backendServer +
        `yarn/downloadArchivePdfs`;

    if (!archiveLink.trim().includes(',') && /\s/.test(archiveLink.trim())) {
        archiveLink = archiveLink.split(' ').join(',');
        console.log(`archiveLink ${JSON.stringify(archiveLink)}`)
    }

    const result = await makePostCall({
        "archiveLink": archiveLink,
        "profile": profileOrFilePath
    }, resource);

    const _result = result.response;
    console.log(`_result ${JSON.stringify(_result)}`)
    return {
        ..._result
    } as ExecResponseDetails;
}
