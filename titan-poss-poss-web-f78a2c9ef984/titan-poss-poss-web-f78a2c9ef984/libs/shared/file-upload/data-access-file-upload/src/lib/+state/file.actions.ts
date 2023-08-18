import {
  CustomErrors,
  DocumentUploadPayload,
  NewFileUploadResponse,
  LoadFileStatusListPayload,
  LoadFileStatusListSuccessPayload,
  DocumentListPayload,
  DocumentListResponse,
  FileData
} from '@poss-web/shared/models';
import { Action } from '@ngrx/store';
export enum FileActionTypes {
  //EPOSS
  FILE_UPLOAD = '[File-Status] File Upload',
  FILE_UPLOAD_SUCCESS = '[File-Status] File Upload Success',
  FILE_UPLOAD_FAILURE = '[File-Status] File Upload Failure',

  //POSS
  DOCUMENT_UPLOAD = '[File] Document Upload',
  DOCUMENT_UPLOAD_SUCCESS = '[File] Document Upload Success',
  DOCUMENT_UPLOAD_FAILURE = '[File] Document Upload Failure',

  LOAD_DOCS_LIST = '[File] Load Docs List',
  LOAD_DOCS_LIST_SUCCESS = '[File] Load Docs List Success',
  LOAD_DOCS_LIST_FAILURE = '[File] Load Docs List Failure',

  LOAD_DOCUMENT_URL_BY_ID = '[File] Load Document Url By Id',
  LOAD_DOCUMENT_URL_BY_ID_SUCCESS = '[File] Load Document Url By Id Success',
  LOAD_DOCUMENT_URL_BY_ID_FAILURE = '[File] Load Document Url By Id Failure',

  GET_UPLOADED_FILE_IDS = '[File] Get Uploaded File Ids',

  DELETE_DOCUMENT = '[File] Delete Document',
  DELETE_DOCUMENT_SUCCESS = '[File] Delete Document Success',
  DELETE_DOCUMENT_FAILURE = '[File] Delete Document Failure',

  LOAD_FILE_STATUS_LIST = '[File-Status] Load File Status',
  LOAD_FILE_STATUS_LIST_SUCCESS = '[File-Status] Load File Status Success',
  LOAD_FILE_STATUS_LIST_FAILURE = '[File-Status] Load File Status Failure',

  ERROR_LOG_DOWNLOAD = '[File-Status] Download Error Log',
  ERROR_LOG_DOWNLOAD_SUCCESS = '[File-Status] Download Error Log Success',
  ERROR_LOG_DOWNLOAD_FAILURE = '[File-Status] Download Error Log Failure',

  RESET_File_TYPE = '[File-Status] Reset File Type',

  PDF_File_DOWNLOAD = '[File-Status] Download Pdf File',
  PDF_File_DOWNLOAD_SUCCESS = '[File-Status] Download Pdf File Success',
  PDF_File_DOWNLOAD_FAILURE = '[File-Status] Download Pdf File Failure',

  RESET_RESPONSE = '[File-Status] Reset Response',
  CLEAR_FILE_LSIT = '[File-Status] Clear FileList'
}
export class LoadFileStatusList implements Action {
  readonly type = FileActionTypes.LOAD_FILE_STATUS_LIST;
  constructor(public payload: LoadFileStatusListPayload) {}
}
export class LoadFileStatusListSuccess implements Action {
  readonly type = FileActionTypes.LOAD_FILE_STATUS_LIST_SUCCESS;
  constructor(public payload: LoadFileStatusListSuccessPayload) {}
}
export class LoadFileStatusListFailure implements Action {
  readonly type = FileActionTypes.LOAD_FILE_STATUS_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class FileUpload implements Action {
  readonly type = FileActionTypes.FILE_UPLOAD;
  constructor(
    public payload: FormData,
    public fileGroup?: string,
    public param?: string,
    public appType?: string,
    public isServicePoss?: boolean,
  ) {}
}
export class FileUploadSuccess implements Action {
  readonly type = FileActionTypes.FILE_UPLOAD_SUCCESS;
  constructor(public payload: NewFileUploadResponse) {}
}
export class FileUploadFailure implements Action {
  readonly type = FileActionTypes.FILE_UPLOAD_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class DocumentUpload implements Action {
  readonly type = FileActionTypes.DOCUMENT_UPLOAD;
  constructor(public payload: DocumentUploadPayload) {}
}

export class DocumentUploadSuccess implements Action {
  readonly type = FileActionTypes.DOCUMENT_UPLOAD_SUCCESS;
  constructor(public payload: string) {}
}

export class DocumentUploadFailure implements Action {
  readonly type = FileActionTypes.DOCUMENT_UPLOAD_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadDocumentList implements Action {
  readonly type = FileActionTypes.LOAD_DOCS_LIST;
  constructor(public payload: DocumentListPayload) {}
}
export class LoadDocumentListSuccess implements Action {
  readonly type = FileActionTypes.LOAD_DOCS_LIST_SUCCESS;
  constructor(public payload: DocumentListResponse[]) {}
}
export class LoadDocumentListFailure implements Action {
  readonly type = FileActionTypes.LOAD_DOCS_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadDocumentUrlById implements Action {
  readonly type = FileActionTypes.LOAD_DOCUMENT_URL_BY_ID;
  constructor(public payload: string, public locationCode?: string) {}
}
export class LoadDocumentUrlByIdSuccess implements Action {
  readonly type = FileActionTypes.LOAD_DOCUMENT_URL_BY_ID_SUCCESS;
  constructor(public payload: string) {}
}
export class LoadDocumentUrlByIdFailure implements Action {
  readonly type = FileActionTypes.LOAD_DOCUMENT_URL_BY_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class DeleteDocument implements Action {
  readonly type = FileActionTypes.DELETE_DOCUMENT;
  constructor(public payload: string) {}
}
export class DeleteDocumentSuccess implements Action {
  readonly type = FileActionTypes.DELETE_DOCUMENT_SUCCESS;

}
export class DeleteDocumentFailure implements Action {
  readonly type = FileActionTypes.DELETE_DOCUMENT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class GetUploadedFileIds implements Action {
  readonly type = FileActionTypes.GET_UPLOADED_FILE_IDS;
  constructor(public payload: any) {}
}
export class ErrorLogDownload implements Action {
  readonly type = FileActionTypes.ERROR_LOG_DOWNLOAD;
  constructor(public id: string, public fileGroup: string) {}
}
export class ErrorLogDownloadSuccess implements Action {
  readonly type = FileActionTypes.ERROR_LOG_DOWNLOAD_SUCCESS;
}
export class ErrorLogDownloadFailure implements Action {
  readonly type = FileActionTypes.ERROR_LOG_DOWNLOAD_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetFileType implements Action {
  readonly type = FileActionTypes.RESET_File_TYPE;
  constructor(public payload: boolean) {}
}

export class PdfFileDownload implements Action {
  readonly type = FileActionTypes.PDF_File_DOWNLOAD;
  constructor(public payload: FileData) {}
}
export class PdfFileDownloadSuccess implements Action {
  readonly type = FileActionTypes.PDF_File_DOWNLOAD_SUCCESS;
}
export class PdfFileDownloadFailure implements Action {
  readonly type = FileActionTypes.PDF_File_DOWNLOAD_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class ResetResponse implements Action {
  readonly type = FileActionTypes.RESET_RESPONSE;
}
export class ClearFileList implements Action {
  readonly type = FileActionTypes.CLEAR_FILE_LSIT;
  constructor(public payload: boolean) {}
}
export type FileActions =
  | FileUpload
  | FileUploadSuccess
  | FileUploadFailure
  | DocumentUpload
  | DocumentUploadSuccess
  | DocumentUploadFailure
  | LoadDocumentList
  | LoadDocumentListSuccess
  | LoadDocumentListFailure
  | LoadDocumentUrlById
  | LoadDocumentUrlByIdSuccess
  | LoadDocumentUrlByIdFailure
  | DeleteDocument
  | DeleteDocumentSuccess
  | DeleteDocumentFailure
  | GetUploadedFileIds
  | LoadFileStatusList
  | LoadFileStatusListSuccess
  | LoadFileStatusListFailure
  | ErrorLogDownload
  | ErrorLogDownloadSuccess
  | ErrorLogDownloadFailure
  | PdfFileDownload
  | PdfFileDownloadSuccess
  | PdfFileDownloadFailure
  | ResetResponse
  | ClearFileList
  | ResetFileType;
