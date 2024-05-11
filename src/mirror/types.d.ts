import { ObjectId } from "mongodb";

export interface ArchiveProfileAndCount {
    archiveProfile: string;
    count: number;
}
export interface UploadCycleArchiveProfile {
    archiveProfile?: string;
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
