import { ObjectId } from "mongodb";

export interface ArchiveProfileAndCount {
    archiveProfile: string;
    count: number;
}

export interface ArchiveProfileAndCountAndTitles {
    archiveProfile: string;
    count: number;
    titles?: string[];
}

export interface UploadCycleTableData {
    uploadCycleId: string;
    countIntended?: number;
    archiveProfileAndCountIntended?: ArchiveProfileAndCountAndTitles[];
    archiveProfileAndCount: ArchiveProfileAndCount[];
    datetimeUploadStarted: Date|string;
    totalCount: number;
    archiveProfileAndCountForQueue?: ArchiveProfileAndCount[];
    totalQueueCount?:number;
    dateTimeQueueUploadStarted?:Date;
}

export interface UploadCycleTableDataDictionary {
    uploadCycle: UploadCycleTableData;
}

export interface UploadCycleTableDataResponse {
    response: UploadCycleTableDataDictionary[]
}

export interface SelectedUploadItem {
    id:any;
    archiveId:string;
    isValid?: boolean;
}