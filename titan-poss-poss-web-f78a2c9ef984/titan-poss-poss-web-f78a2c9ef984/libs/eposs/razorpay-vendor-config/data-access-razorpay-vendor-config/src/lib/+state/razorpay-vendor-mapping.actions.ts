import { Action } from '@ngrx/store';
import {
  CustomErrors,
  UploadResponse,
  ConfigListingPayload,
  SortItem,
  RazorpayVendorSuccessList
} from '@poss-web/shared/models';

/**
 * The interface for Action payload
 */
export enum RazorpayVendorMappingActionTypes {
  FILE_UPLOAD = '[razorpay-vendor-mapping] File Upload',
  FILE_UPLOAD_SUCCESS = '[razorpay-vendor-mapping] File Upload Success',
  FILE_UPLOAD_FAILURE = '[razorpay-vendor-mapping] File Upload Failure',

  GET_VENDOR_LIST = '[razorpay-vendor-mapping] Get Vendor List',
  GET_VENDOR_LIST_SUCCESS = '[razorpay-vendor-mapping] Get Vendor List Success',
  GET_VENDOR_LIST_FAILURE = '[razorpay-vendor-mapping] Get Vendor List Failure',

  ERROR_LOG_DOWNLOAD = '[razorpay-vendor-mapping] Download Error Log',
  ERROR_LOG_DOWNLOAD_SUCCESS = '[razorpay-vendor-mapping] Download Error Log Success',
  ERROR_LOG_DOWNLOAD_FAILURE = '[razorpay-vendor-mapping] Download Error Log Failure',

  RESET_RESPONSE = '[razorpay-vendor-mapping] Reset Response'
}

/**
 * Data upload Actions
 */
export class FileUpload implements Action {
  readonly type = RazorpayVendorMappingActionTypes.FILE_UPLOAD;
  constructor(public payload: FormData) {}
}
export class FileUploadSuccess implements Action {
  readonly type = RazorpayVendorMappingActionTypes.FILE_UPLOAD_SUCCESS;
  constructor(public payload: UploadResponse) {}
}
export class FileUploadFailure implements Action {
  readonly type = RazorpayVendorMappingActionTypes.FILE_UPLOAD_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ErrorLogDownload implements Action {
  readonly type = RazorpayVendorMappingActionTypes.ERROR_LOG_DOWNLOAD;
  constructor(public payload: string) {}
}
export class ErrorLogDownloadSuccess implements Action {
  readonly type = RazorpayVendorMappingActionTypes.ERROR_LOG_DOWNLOAD_SUCCESS;
  constructor(public payload: any) {}
}
export class ErrorLogDownloadFailure implements Action {
  readonly type = RazorpayVendorMappingActionTypes.ERROR_LOG_DOWNLOAD_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class GetVendorList implements Action {
  readonly type = RazorpayVendorMappingActionTypes.GET_VENDOR_LIST;
  constructor(
    public payload: ConfigListingPayload,
    public sortField?: SortItem,
    public locationCode?: string
  ) {}
}
export class GetVendorListSuccess implements Action {
  readonly type = RazorpayVendorMappingActionTypes.GET_VENDOR_LIST_SUCCESS;
  constructor(public payload: RazorpayVendorSuccessList) {}
}
export class GetVendorListFailure implements Action {
  readonly type = RazorpayVendorMappingActionTypes.GET_VENDOR_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetResponse implements Action {
  readonly type = RazorpayVendorMappingActionTypes.RESET_RESPONSE;
}

/**
 *  Data Upload Action types
 */
export type RazorpayVendorConfigurationActions =
  | FileUpload
  | FileUploadSuccess
  | FileUploadFailure
  | ResetResponse
  | GetVendorList
  | GetVendorListSuccess
  | GetVendorListFailure
  | ErrorLogDownload
  | ErrorLogDownloadSuccess
  | ErrorLogDownloadFailure;
