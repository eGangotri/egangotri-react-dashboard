import { backendServer } from 'utils/constants';
import { makePostCallWithErrorHandling } from './BackendFetchService';
import { ExecResponseDetails } from 'scriptsThruExec/types';
import { makePostCall } from 'mirror/utils';

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
    const result = await makePostCallWithErrorHandling({
        "googleDriveLink": googleDriveLink,
        "profile": profile,
        ignoreFolder: "XQAZSWQ"
    }, `yarn/downloadFromGoogleDrive`)
    return result;
}

export async function launchYarnQaToDestFileMover(
    postParams: Record<string, unknown>): Promise<ExecResponseDetails> {
    const resource =
        backendServer +
        `yarn/qaToDestFileMover`;

    const result = await makePostCall(postParams,
        resource);
    return result.response as ExecResponseDetails
}

export async function launchYarnMoveToFreeze(
    postParams: Record<string, unknown>): Promise<ExecResponseDetails> {
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
        `yarnListMaker/createListingsOfLocalFolder`;

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

    const result = await makePostCallWithErrorHandling({
        "googleDriveLink": googleDriveLink,
        "folderName": folderName
    }, `yarnListMaker/getGoogleDriveListing`);
    return result;
}

export async function launchArchiveExcelDownload(archiveLinks: string,
    maxItems: string,
    dateRange: string,
    limitedFields = false,
    onlyLinks = false,
    ascOrder = false):
    Promise<ExecResponseDetails> {
    if (!archiveLinks.trim().includes(',') && /\s/.test(archiveLinks.trim())) {
        archiveLinks = archiveLinks.trim().split(/\s+/).map((x: string) => x.trim()).join(',');
        console.log(`archiveLink ${JSON.stringify(archiveLinks)}`)
    }
    const result = await makePostCallWithErrorHandling({
        archiveLinks,
        maxItems,
        limitedFields,
        dateRange,
        onlyLinks,
        ascOrder
    }, `yarnArchive/getArchiveListing`)
    return result;
}


export async function launchGetFirstAndLastNPages(postParams: Record<string, string>): Promise<ExecResponseDetails> {
    const resource =
        backendServer +
        `yarnListMaker/getFirstAndLastNPages`;

    const result = await makePostCall(postParams,
        resource);
    return result.response as ExecResponseDetails
}


export async function makePostCallToPath(path: string, postParams: Record<string, string>): Promise<ExecResponseDetails> {
    const resource =
        backendServer + path;
    const result = await makePostCall(postParams,
        resource);
    return result.response as ExecResponseDetails
}

export async function launchArchivePdfDownload(archiveLink: string, profileOrFilePath: string): Promise<ExecResponseDetails> {
    const resource =
        backendServer +
        `yarnArchive/downloadArchivePdfs`;

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
