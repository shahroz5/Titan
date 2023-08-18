import { Action } from '@ngrx/store';
import {
  CustomErrors,
  UploadResponse,
  UnipayConfigurationList,
  ConfigListingPayload,
  SortItem
} from '@poss-web/shared/models';

/**
 * The interface for Action payload
 */
export enum RazorpayConfigurationActionTypes {
  FILE_UPLOAD = '[razorpay-access-mapping] File Upload',
  FILE_UPLOAD_SUCCESS = '[razorpay-access-mapping] File Upload Success',
  FILE_UPLOAD_FAILURE = '[razorpay-access-mapping] File Upload Failure',

  GET_ACCESS_LIST = '[razorpay-access-mapping] Get Access List',
  GET_ACCESS_LIST_SUCCESS = '[razorpay-access-mapping] Get Access List Success',
  GET_ACCESS_LIST_FAILURE = '[razorpay-access-mapping] Get Access List Failure',

  ERROR_LOG_DOWNLOAD = '[razorpay-access-mapping] Download Error Log',
  ERROR_LOG_DOWNLOAD_SUCCESS = '[razorpay-access-mapping] Download Error Log Success',
  ERROR_LOG_DOWNLOAD_FAILURE = '[razorpay-access-mapping] Download Error Log Failure',

  RESET_RESPONSE = '[razorpay-access-mapping] Reset Response'
}

/**
 * Data upload Actions
 */
export class FileUpload implements Action {
  readonly type = RazorpayConfigurationActionTypes.FILE_UPLOAD;
  constructor(public payload: FormData) {}
}
export class FileUploadSuccess implements Action {
  readonly type = RazorpayConfigurationActionTypes.FILE_UPLOAD_SUCCESS;
  constructor(public payload: UploadResponse) {}
}
export class FileUploadFailure implements Action {
  readonly type = RazorpayConfigurationActionTypes.FILE_UPLOAD_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ErrorLogDownload implements Action {
  readonly type = RazorpayConfigurationActionTypes.ERROR_LOG_DOWNLOAD;
  constructor(public payload: string) {}
}
export class ErrorLogDownloadSuccess implements Action {
  readonly type = RazorpayConfigurationActionTypes.ERROR_LOG_DOWNLOAD_SUCCESS;
  constructor(public payload: any) {}
}
export class ErrorLogDownloadFailure implements Action {
  readonly type = RazorpayConfigurationActionTypes.ERROR_LOG_DOWNLOAD_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class GetAccessList implements Action {
  readonly type = RazorpayConfigurationActionTypes.GET_ACCESS_LIST;
  constructor(
    public payload: ConfigListingPayload,
    public sortField?: SortItem,
    public locationCode?: string
  ) {}
}
export class GetAccessListSuccess implements Action {
  readonly type = RazorpayConfigurationActionTypes.GET_ACCESS_LIST_SUCCESS;
  constructor(public payload: UnipayConfigurationList) {}
}
export class GetAccessListFailure implements Action {
  readonly type = RazorpayConfigurationActionTypes.GET_ACCESS_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetResponse implements Action {
  readonly type = RazorpayConfigurationActionTypes.RESET_RESPONSE;
}

/**
 *  Data Upload Action types
 */
export type RazorpayConfigurationActions =
  | FileUpload
  | FileUploadSuccess
  | FileUploadFailure
  | ResetResponse
  | GetAccessList
  | GetAccessListFailure
  | GetAccessListSuccess
  | ErrorLogDownload
  | ErrorLogDownloadSuccess
  | ErrorLogDownloadFailure;
