import { Action } from '@ngrx/store';
import {
  CashMemoDetailsRequestPayload,
  CashMemoDetailsResponse,
  AbManualApprovalRequestPayload,
  ApprovalRequest,
  AbManualRequestDetailsPayload,
  AbManualRequestList,
  AbManualRequestListPayload,
  CustomErrors,
  AbManualItemDetails,
  CashMemoItemDetailsRequestPayload,
  HistoryFiltersData,
  FileUploadDownloadPayload,
  FileUploadLists
} from '@poss-web/shared/models';

export enum AbManualRequestActionTypes {
  LOAD_AbManual_REQUEST_LIST = '[AB MANUAL REQUESTS]Load AbManualRequest List',
  LOAD_AbManual_REQUEST_LIST_SUCCESS = '[AB MANUAL REQUESTS]Load AbManualRequest List Success',
  LOAD_AbManual_REQUEST_LIST_FAILURE = '[AB MANUAL REQUESTS]Load AbManualRequest List Failure',

  LOAD_AbManual_REQUEST_DETAILS = '[AB MANUAL REQUESTS]Load AbManualRequest Details',
  LOAD_AbManual_REQUEST_DETAILS_SUCCESS = '[AB MANUAL REQUESTS]Load AbManualRequest Details Success',
  LOAD_AbManual_REQUEST_DETAILS_FAILURE = '[AB MANUAL REQUESTS]Load AbManualRequest Details Failure',

  LOAD_AbManual_PRODUCT_LIST = '[AB MANUAL REQUESTS]Load AbManualProduct List',
  LOAD_AbManual_PRODUCT_LIST_SUCCESS = '[AB MANUAL REQUESTS]Load AbManualProduct List Success',
  LOAD_AbManual_PRODUCT_LIST_FAILURE = '[AB MANUAL REQUESTS]Load AbManualProduct List Failure',

  LOAD_AbManual_PRODUCT_DETAILS = '[AB MANUAL REQUESTS]Load AbManualProduct Details',
  LOAD_AbManual_PRODUCT_DETAILS_SUCCESS = '[AB MANUAL REQUESTS]Load AbManualProduct Details Success',
  LOAD_AbManual_PRODUCT_DETAILS_FAILURE = '[AB MANUAL REQUESTS]Load AbManualProduct Details Failure',

  LOAD_PRODUCT_DETAILS = '[AB MANUAL REQUESTS]Load Product Details',
  LOAD_PRODUCT_DETAILS_SUCCESS = '[AB MANUAL REQUESTS]Load Product Details Success',
  LOAD_PRODUCT_DETAILS_FAILURE = '[AB MANUAL REQUESTS]Load Product Details Failure',

  AbManual_APPROVAL_REQUEST = '[AB MANUAL REQUESTS]AbManual Approval Request',
  AbManual_APPROVAL_REQUEST_SUCCESS = '[AB MANUAL REQUESTS]AbManual Approval Request Success',
  AbManual_APPROVAL_REQUEST_FAILURE = '[AB MANUAL REQUESTS]AbManual Approval Request Failure',

  CONFIRM_MANUAL_AbManual = '[AB MANUAL REQUESTS] Confirm Manual AbManual',
  CONFIRM_MANUAL_AbManual_SUCCESS = '[AB MANUAL REQUESTS] Confirm Manual AbManual Success',
  CONFIRM_MANUAL_AbManual_FAILURE = '[AB MANUAL REQUESTS] Confirm Manual AbManual Failure',

  CLEAR_AbManual_REQUEST_LIST = '[AB MANUAL REQUESTS]Clear AbManualRequest List',
  CLEAR_AbManual_REQUEST_DETAILS = '[AB MANUAL REQUESTS]Clear AbManualRequest Details',

  LOAD_HISTORY_FILTER_DATA = '[AB MANUAL REQUESTS] Load History Dates ',
  RESET_FILTER = '[AB MANUAL REQUESTS] Reset FILTER',

  FILE_UPLOAD_LIST = '[AB MANUAL REQUESTS] File Upload List',
  FILE_UPLOAD_LIST_SUCCESS = '[AB MANUAL REQUESTS] File Upload List Success',
  FILE_UPLOAD_LIST_FAILURE = '[AB MANUAL REQUESTS] File Upload List Failure',

  FILE_DOWNLOAD_URL = '[AB MANUAL REQUESTS] File Download Url',
  FILE_DOWNLOAD_URL_SUCCESS = '[AB MANUAL REQUESTS] File Download Url Success',
  FILE_DOWNLOAD_URL_FAILURE = '[AB MANUAL REQUESTS] File Download Url Failure'
}

export class LoadAbManualRequestList implements Action {
  readonly type = AbManualRequestActionTypes.LOAD_AbManual_REQUEST_LIST;
  constructor(public payload: AbManualRequestListPayload) {}
}
export class LoadAbManualRequestListSuccess implements Action {
  readonly type = AbManualRequestActionTypes.LOAD_AbManual_REQUEST_LIST_SUCCESS;
  constructor(public payload: AbManualRequestList[]) {}
}
export class LoadAbManualRequestListFailure implements Action {
  readonly type = AbManualRequestActionTypes.LOAD_AbManual_REQUEST_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadAbManualRequestDetails implements Action {
  readonly type = AbManualRequestActionTypes.LOAD_AbManual_REQUEST_DETAILS;
  constructor(public payload: AbManualRequestDetailsPayload) {}
}
export class LoadAbManualRequestDetailsSuccess implements Action {
  readonly type =
    AbManualRequestActionTypes.LOAD_AbManual_REQUEST_DETAILS_SUCCESS;
  constructor(public payload: any) {}
}
export class LoadAbManualRequestDetailsFailure implements Action {
  readonly type =
    AbManualRequestActionTypes.LOAD_AbManual_REQUEST_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadAbManualProductList implements Action {
  readonly type = AbManualRequestActionTypes.LOAD_AbManual_PRODUCT_LIST;
  constructor(public payload: CashMemoDetailsRequestPayload) {}
}
export class LoadAbManualProductListSuccess implements Action {
  readonly type = AbManualRequestActionTypes.LOAD_AbManual_PRODUCT_LIST_SUCCESS;
  constructor(public payload: CashMemoDetailsResponse) {}
}
export class LoadAbManualProductListFailure implements Action {
  readonly type = AbManualRequestActionTypes.LOAD_AbManual_PRODUCT_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadAbManualProductDetails implements Action {
  readonly type = AbManualRequestActionTypes.LOAD_AbManual_PRODUCT_DETAILS;
  constructor(public payload: CashMemoItemDetailsRequestPayload) {}
}
export class LoadAbManualProductDetailsSuccess implements Action {
  readonly type =
    AbManualRequestActionTypes.LOAD_AbManual_PRODUCT_DETAILS_SUCCESS;
  constructor(public payload: AbManualItemDetails[]) {}
}
export class LoadAbManualProductDetailsFailure implements Action {
  readonly type =
    AbManualRequestActionTypes.LOAD_AbManual_PRODUCT_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadProductDetails implements Action {
  readonly type = AbManualRequestActionTypes.LOAD_PRODUCT_DETAILS;
  constructor(public payload: any) {}
}
export class LoadProductDetailsSuccess implements Action {
  readonly type = AbManualRequestActionTypes.LOAD_PRODUCT_DETAILS_SUCCESS;
  constructor(public payload: any) {}
}
export class LoadProductDetailsFailure implements Action {
  readonly type = AbManualRequestActionTypes.LOAD_PRODUCT_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class AbManualApprovalRequest implements Action {
  readonly type = AbManualRequestActionTypes.AbManual_APPROVAL_REQUEST;
  constructor(public payload: AbManualApprovalRequestPayload) {}
}
export class AbManualApprovalRequestSuccess implements Action {
  readonly type = AbManualRequestActionTypes.AbManual_APPROVAL_REQUEST_SUCCESS;
  constructor(public payload: ApprovalRequest) {}
}
export class AbManualApprovalRequestFailure implements Action {
  readonly type = AbManualRequestActionTypes.AbManual_APPROVAL_REQUEST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ConfirmManualAbManual implements Action {
  readonly type = AbManualRequestActionTypes.CONFIRM_MANUAL_AbManual;
  constructor(readonly payload: CashMemoDetailsRequestPayload) {}
}

export class ConfirmManualAbManualSuccess implements Action {
  readonly type = AbManualRequestActionTypes.CONFIRM_MANUAL_AbManual_SUCCESS;
  constructor(readonly payload: CashMemoDetailsResponse) {}
}

export class ConfirmManualAbManualFailure implements Action {
  readonly type = AbManualRequestActionTypes.CONFIRM_MANUAL_AbManual_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class ClearAbManualRequestList implements Action {
  readonly type = AbManualRequestActionTypes.CLEAR_AbManual_REQUEST_LIST;
}

export class ClearAbManualRequestDetails implements Action {
  readonly type = AbManualRequestActionTypes.CLEAR_AbManual_REQUEST_DETAILS;
}
export class RESETFILTER implements Action {
  readonly type = AbManualRequestActionTypes.RESET_FILTER;
}

export class LoadHistoryFilterData implements Action {
  readonly type = AbManualRequestActionTypes.LOAD_HISTORY_FILTER_DATA;
  constructor(public payload: HistoryFiltersData) {}
}

export class FileUploadList implements Action {
  readonly type = AbManualRequestActionTypes.FILE_UPLOAD_LIST;
  constructor(public payload: FileUploadDownloadPayload) {}
}

export class FileUploadListSuccess implements Action {
  readonly type = AbManualRequestActionTypes.FILE_UPLOAD_LIST_SUCCESS;
  constructor(public payload: FileUploadLists[]) {}
}

export class FileUploadListFailure implements Action {
  readonly type = AbManualRequestActionTypes.FILE_UPLOAD_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class FileDownloadUrl implements Action {
  readonly type = AbManualRequestActionTypes.FILE_DOWNLOAD_URL;
  constructor(public payload: { id: string; locationCode: string }) {}
}

export class FileDownloadUrlSuccess implements Action {
  readonly type = AbManualRequestActionTypes.FILE_DOWNLOAD_URL_SUCCESS;
  constructor(public payload: string) {}
}

export class FileDownloadUrlFailure implements Action {
  readonly type = AbManualRequestActionTypes.FILE_DOWNLOAD_URL_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type AbManualRequestActions =
  | LoadAbManualRequestList
  | LoadAbManualRequestListSuccess
  | LoadAbManualRequestListFailure
  | LoadAbManualRequestDetails
  | LoadAbManualRequestDetailsSuccess
  | LoadAbManualRequestDetailsFailure
  | LoadAbManualProductList
  | LoadAbManualProductListSuccess
  | LoadAbManualProductListFailure
  | LoadAbManualProductDetails
  | LoadAbManualProductDetailsSuccess
  | LoadAbManualProductDetailsFailure
  | LoadProductDetails
  | LoadProductDetailsSuccess
  | LoadProductDetailsFailure
  | AbManualApprovalRequest
  | AbManualApprovalRequestSuccess
  | AbManualApprovalRequestFailure
  | ConfirmManualAbManual
  | ConfirmManualAbManualSuccess
  | ConfirmManualAbManualFailure
  | ClearAbManualRequestList
  | ClearAbManualRequestDetails
  | LoadHistoryFilterData
  | FileUploadList
  | FileUploadListSuccess
  | FileUploadListFailure
  | FileDownloadUrl
  | FileDownloadUrlSuccess
  | FileDownloadUrlFailure
  | RESETFILTER;
