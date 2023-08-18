import { Action } from '@ngrx/store';
import {
  CustomErrors,
  UploadResponse,
  GVStatusUpdateList,
  GVStatusListingPayload,
  SortItem,
  GVExtendValidity,
  GVStatusChange
} from '@poss-web/shared/models';

/**
 * The interface for Action payload
 */
export enum GVStatusUpdateActionTypes {
  FILE_UPLOAD = '[gv-status-update] File Upload',
  FILE_UPLOAD_SUCCESS = '[gv-status-update] File Upload Success',
  FILE_UPLOAD_FAILURE = '[gv-status-update] File Upload Failure',

  GET_GV_STATUS_LIST = '[gv-status-update] Get GV Status List',
  GET_GV_STATUS_LIST_SUCCESS = '[gv-status-update] Get GV Status List Success',
  GET_GV_STATUS_LIST_FAILURE = '[gv-status-update] Get GV Status List Failure',

  EXTEND_GV_STATUS = '[gv-status-update] Extend GV Status',
  EXTEND_GV_STATUS_SUCCESS = '[gv-status-update] Extend GV Status Success',
  EXTEND_GV_STATUS_FAILURE = '[gv-status-update] Extend GV Status Failure',


  CHANGE_GV_STATUS = '[gv-status-update] Change GV Status',
  CHANGE_GV_STATUS_SUCCESS = '[gv-status-update] Change GV Status Success',
  CHANGE_GV_STATUS_FAILURE = '[gv-status-update] Change GV Status Failure',

  ERROR_LOG_DOWNLOAD = '[gv-status-update] Download Error Log',
  ERROR_LOG_DOWNLOAD_SUCCESS = '[gv-status-update] Download Error Log Success',
  ERROR_LOG_DOWNLOAD_FAILURE = '[gv-status-update] Download Error Log Failure',

  RESET_RESPONSE = '[gv-status-update] Reset Response'
}

/**
 * Data upload Actions
 */
export class FileUpload implements Action {
  readonly type = GVStatusUpdateActionTypes.FILE_UPLOAD;
  constructor(public payload: FormData, public uploadType: string) {}
}
export class FileUploadSuccess implements Action {
  readonly type = GVStatusUpdateActionTypes.FILE_UPLOAD_SUCCESS;
  constructor(public payload: UploadResponse) {}
}
export class FileUploadFailure implements Action {
  readonly type = GVStatusUpdateActionTypes.FILE_UPLOAD_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ErrorLogDownload implements Action {
  readonly type = GVStatusUpdateActionTypes.ERROR_LOG_DOWNLOAD;
  constructor(public payload: string, public uploadType: string) {}
}
export class ErrorLogDownloadSuccess implements Action {
  readonly type = GVStatusUpdateActionTypes.ERROR_LOG_DOWNLOAD_SUCCESS;
  constructor(public payload: any) {}
}
export class ErrorLogDownloadFailure implements Action {
  readonly type = GVStatusUpdateActionTypes.ERROR_LOG_DOWNLOAD_FAILURE;
  constructor(public payload: CustomErrors) {}
}


export class GetGVStatusList implements Action {
  readonly type = GVStatusUpdateActionTypes.GET_GV_STATUS_LIST;
  constructor(
    public payload: GVStatusListingPayload,
    public sortField?: SortItem
  ) {}
}
export class GetGVStatusListSuccess implements Action {
  readonly type = GVStatusUpdateActionTypes.GET_GV_STATUS_LIST_SUCCESS;
  constructor(public payload: GVStatusUpdateList) {}
}
export class GetGVStatusListFailure implements Action {
  readonly type = GVStatusUpdateActionTypes.GET_GV_STATUS_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ExtendGVStatus implements Action {
  readonly type = GVStatusUpdateActionTypes.EXTEND_GV_STATUS;
  constructor(public payload: GVExtendValidity) {}
}
export class ExtendGVStatusSuccess implements Action {
  readonly type = GVStatusUpdateActionTypes.EXTEND_GV_STATUS_SUCCESS;
  constructor(public payload: GVStatusUpdateList) {}
}
export class ExtendGVStatusFailure implements Action {
  readonly type = GVStatusUpdateActionTypes.EXTEND_GV_STATUS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ChangeGVStatus implements Action {
  readonly type = GVStatusUpdateActionTypes.CHANGE_GV_STATUS;
  constructor(public payload: GVStatusChange) {}
}
export class ChangeGVStatusSuccess implements Action {
  readonly type = GVStatusUpdateActionTypes.CHANGE_GV_STATUS_SUCCESS;
  constructor(public payload: GVStatusUpdateList) {}
}
export class ChangeGVStatusFailure implements Action {
  readonly type = GVStatusUpdateActionTypes.CHANGE_GV_STATUS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetResponse implements Action {
  readonly type = GVStatusUpdateActionTypes.RESET_RESPONSE;
}

/**
 *  Data Upload Action types
 */
export type GVStatusActions =
  | FileUpload
  | FileUploadSuccess
  | FileUploadFailure
  | ResetResponse

  | GetGVStatusList
  | GetGVStatusListFailure
  | ExtendGVStatus
  | ExtendGVStatusSuccess
  | ExtendGVStatusFailure
  | GetGVStatusListSuccess
  | ChangeGVStatus
  | ChangeGVStatusSuccess
  | ChangeGVStatusFailure
  | ErrorLogDownload
  | ErrorLogDownloadSuccess
  | ErrorLogDownloadFailure;
