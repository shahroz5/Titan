import { Moment } from 'moment';

export interface LoadFileStatusListPayload {
  pageIndex: number;
  pageSize: number;
}
export interface LoadFileStatusListSuccessPayload {
  fileStatusList: FileStatusList[];
  totalElements: number;
}

export interface FileStatusList {
  fileId: string;
  fileName: string;
  processedDate: Moment;
  status: string;
  startTime: string;
  endTime: string;
  fileGroup: string;
  successCount: number;
  failureCount: number;
  totalCount: number;
  remarks?: string;
  // fileMasterName: null;
  // filePath: null;
  // fileServer: null;
  // sequenceNo: 5001;

  // errorLogFilePath: '/error_log/ITEM_GROUP_LEVEL_DISCOUNT/1947f1a3-af85-4ae5-ba32-f2e37ca82807.csv';
  // manualJob: true;
  // createdBy: 'commercial';
  // totalTime: 36;
  // warningCount: 0;
  // remarks: 'Imported Succesfully';
}
export interface NewFileUploadResponse {
  fileId: string;
  hasError: boolean;
  message: string;
  records?: NewFileUploadCount;
  errors?: any;
  uploadType?: string;
}

export interface NewFileUploadCount {
  errorLogId: string;
  failureCount: number;
  successCount: number;
  totalCount: number;
}
export interface DocumentUploadPayload {
  customerId?: number;
  docType: string;
  file: FormData;
  fileSubType?: string;
  fileType: string;
  id?: string;
}
export interface DocumentListPayload {
  customerId?: number;
  docType: string;
  fileType: string;
  id?: string;
  locationCode?: string;
}
export interface DocumentListResponse {
  id: string;
  name: string;
}

export interface FileData {
  id: string;
  name?: string;
  locationCode?: string;
}
export enum FileUploadTypeEnum {
  SYNC = 'sync',
  ASYNC = 'async'
}

export enum FileUploadTypeEnum {
  OFFLINE = 'OFFLINE',
  UPLOAD = 'UPLOAD'
}
