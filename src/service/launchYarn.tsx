import { backendServer } from 'utils/constants';
import { makePostCallWithErrorHandling } from './BackendFetchService';
import { ExecResponseDetails } from 'scriptsThruExec/types';
import { makePostCall } from 'mirror/utils';
import { FOLDER_OF_UNZIPPED_IMGS, FOLDER_TO_UNZIP } from './consts';

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
        ignoreFolder: "proc"
    }, `yarn/downloadFromGoogleDrive`)
    return result;
}

export async function launchGoogleDriveZipDownload(googleDriveLink: string,
    profile: string): Promise<ExecResponseDetails> {
    const jsonData = await makePostCallWithErrorHandling({
        "googleDriveLink": googleDriveLink,
        "profile": profile,
        ignoreFolder: "proc"
    }, `yarn/downloadZipFromGoogleDrive`)

    console.log(`result ${JSON.stringify(jsonData)}`)

    const destPaths = new Set(
        jsonData?.response?.flatMap((response: { results: { destPath: string }[] }) =>
            response?.results?.map((result: { destPath: string }) => result?.destPath) ?? []
        ) ?? []
    );
    const unzipFolder = [...destPaths].join(', ');
    console.log(`unzipFolder ${unzipFolder}`)
    // Store value
    localStorage.setItem(FOLDER_TO_UNZIP, unzipFolder);

    // Retrieve value
    let value = localStorage.getItem(FOLDER_TO_UNZIP);

    console.log(`FOLDER_TO_UNZIP: ${value}`);

    return jsonData;
}

export async function launchImgFilesToPdf(folder: string,
    imgType: string = "JPG"): Promise<ExecResponseDetails> {
    const jsonData = await makePostCallWithErrorHandling({
        folder: folder,
        imgType: imgType,
    }, `fileUtil/imgFilesToPdf`)

    console.log(`result ${JSON.stringify(jsonData)}`)


    return jsonData;
}


export async function unzipFolders(folder: string): Promise<ExecResponseDetails> {
    const jsonData = await makePostCallWithErrorHandling({
        "folder": folder,
        ignoreFolder: "proc"
    }, `yarn/unzipAllFolders`)

    console.log(`result ${JSON.stringify(jsonData)}`)

    const unzippedImgFiles: Set<string> = new Set(
        jsonData.response
            .map((item: { unzipFolder: string }) => item.unzipFolder)
    );

    const unzipFolder = [...unzippedImgFiles].join(', ');
    console.log(`unzippedImgFiles ${unzipFolder}`)
    // Store value
    localStorage.setItem(FOLDER_OF_UNZIPPED_IMGS, unzipFolder);

    // Retrieve value
    let value = localStorage.getItem(FOLDER_OF_UNZIPPED_IMGS);

    console.log(`FOLDER_OF_UNZIPPED_IMGS: ${value}`);
    return jsonData;
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

export async function launchYarnMoveToFreezeByUploadId(
    postParams: Record<string, unknown>): Promise<ExecResponseDetails> {

    const resource =
        backendServer +
        `yarn/yarnMoveFilesInListToFreeze`;
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

export async function launchAllArchiveItemsDownloadViaExcel(archiveLink: string, profileOrFilePath: string): Promise<ExecResponseDetails> {
    const resource =
        backendServer +
        `yarnArchive/downloadArchiveItemsViaExcel`;

    if (!archiveLink.trim().includes(',') && /\s/.test(archiveLink.trim())) {
        archiveLink = archiveLink.split(' ').join(',');
        console.log(`archiveLink ${JSON.stringify(archiveLink)}`)
    }

    const result = await makePostCall({
        "excelPath": archiveLink,
        "profileOrPath": profileOrFilePath
    }, resource);

    const _result = result.response;
    console.log(`_result ${JSON.stringify(_result)}`)
    return {
        ..._result
    } as ExecResponseDetails;
}
