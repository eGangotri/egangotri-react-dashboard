import { ObjectId } from "mongodb";

export interface ArchiveProfileAndCount {
    archiveProfile: string;
    count: number;
}
export interface UploadCycleArchiveProfile {
    archiveProfile?: string;
    archiveProfilePath ?:string;
    count?: number;
    titles?: string[];
    absolutePaths?: string[];
}

export interface ArchiveProfileAndAbsPath {
    archiveProfile: string;
    title?: string;
    absolutePaths?: string;

}

export interface UploadCycleTableData {
    uploadCycleId: string;
    countIntended?: number;
    mode?: string;
    archiveProfileAndCountIntended?: UploadCycleArchiveProfile[];
    archiveProfileAndCount: ArchiveProfileAndCount[];
    datetimeUploadStarted: Date | string;
    totalCount: number;
    archiveProfileAndCountForQueue?: ArchiveProfileAndCount[];
    totalQueueCount?: number;
    dateTimeQueueUploadStarted?: Date;
    allUploadVerified ?:boolean;
    moveToFreeze ?:boolean;
}

export interface UploadCycleTableDataDictionary {
    uploadCycle: UploadCycleTableData;
}

export interface UploadCycleTableDataResponse {
    response: UploadCycleTableDataDictionary[]
}

export interface SelectedUploadItem {
    id: number | string;
    archiveId: string;
    isValid?: boolean;
}
export interface SelectedUploadItemResponse {
    status: string,
    results: SelectedUploadItem[]
}

export interface RenamePdfFormData {
    originalPdfName: string;
    title: string;
    author: string;
    publisher: string;
    year: string;
    era: 'AH' | 'CE' | 'Vikrami' | 'Shaka' | 'Bangabda';
    editor: string;
    commentator: string;
    translator: string;
    language: 'English' | 'Hindi' | 'Sanskrit' | 'Kannada' | 'Telugu' | 'Urdu' | 'Persian' | 'Other';
    otherLanguage?: string;
}