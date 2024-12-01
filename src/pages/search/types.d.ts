export interface ArchiveData {
    link: string,
    allDownloadsLinkPage: string,
    pdfDownloadLink: string,
    originalTitle: string,
    titleArchive: string,
    description: string,
    subject: string,
    date: string,
    acct: string,
    identifier: string,
    pageCount: number,
    type: string,
    mediaType: string,
    size: string,
    sizeFormatted: string
}


export interface GDriveData {
    serialNo: string,
    titleGDrive: string,
    gDriveLink: string,
    identifier:string,
    truncFileLink: string,
    identifierTruncFile:string,
    textType: string,
    titleinEnglish: string,
    titleOriginalScript: string,
    subTitle: string,
    author: string,
    editor: string,
    languages: string,
    script: string,
    subect: string,
    publisher: string,
    edition: string,
    placePub: string,
    yearPub: string,
    pageCount: number,
    isbn: string,
    remarks: string,
    commentaries: string,
    commentator: string,
    series: string,
    sizeWithUnits: string,
    sizeInBytes: string,
    folderName: string,
    thumbnail: string,
    createdTime: string,
    source: string,
}

export interface SearchDBProps {
    searchTerm: string
    filter?: string
}