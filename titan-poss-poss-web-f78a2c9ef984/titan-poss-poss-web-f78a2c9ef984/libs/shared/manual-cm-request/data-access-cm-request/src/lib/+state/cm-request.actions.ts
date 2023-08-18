import { Action } from '@ngrx/store';
import {
  CashMemoDetailsRequestPayload,
  CashMemoDetailsResponse,
  CmApprovalRequestPayload,
  ApprovalRequest,
  CmRequestDetailsPayload,
  CmRequestList,
  CmRequestListPayload,
  CustomErrors,
  CashMemoItemDetails,
  CashMemoItemDetailsRequestPayload,
  FileUploadDownloadPayload,
  FileUploadLists,
  StatusTypesEnum
} from '@poss-web/shared/models';

export enum CmRequestActionTypes {
  LOAD_CM_REQUEST_LIST = '[Manual-Cm-Request]Load CMRequest List',
  LOAD_CM_REQUEST_LIST_SUCCESS = '[Manual-Cm-Request]Load CMRequest List Success',
  LOAD_CM_REQUEST_LIST_FAILURE = '[Manual-Cm-Request]Load CMRequest List Failure',

  LOAD_CM_REQUEST_DETAILS = '[Manual-Cm-Request]Load CMRequest Details',
  LOAD_CM_REQUEST_DETAILS_SUCCESS = '[Manual-Cm-Request]Load CMRequest Details Success',
  LOAD_CM_REQUEST_DETAILS_FAILURE = '[Manual-Cm-Request]Load CMRequest Details Failure',

  LOAD_CM_PRODUCT_LIST = '[Manual-Cm-Request]Load CMProduct List',
  LOAD_CM_PRODUCT_LIST_SUCCESS = '[Manual-Cm-Request]Load CMProduct List Success',
  LOAD_CM_PRODUCT_LIST_FAILURE = '[Manual-Cm-Request]Load CMProduct List Failure',

  LOAD_CM_PRODUCT_DETAILS = '[Manual-Cm-Request]Load CMProduct Details',
  LOAD_CM_PRODUCT_DETAILS_SUCCESS = '[Manual-Cm-Request]Load CMProduct Details Success',
  LOAD_CM_PRODUCT_DETAILS_FAILURE = '[Manual-Cm-Request]Load CMProduct Details Failure',

  CM_APPROVAL_REQUEST = '[Manual-Cm-Request]CM Approval Request',
  CM_APPROVAL_REQUEST_SUCCESS = '[Manual-Cm-Request]CM Approval Request Success',
  CM_APPROVAL_REQUEST_FAILURE = '[Manual-Cm-Request]CM Approval Request Failure',

  CONFIRM_MANUAL_CM = '[Manual-Cm-Request] Confirm Manual CM',
  CONFIRM_MANUAL_CM_SUCCESS = '[Manual-Cm-Request] Confirm Manual CM Success',
  CONFIRM_MANUAL_CM_FAILURE = '[Manual-Cm-Request] Confirm Manual CM Failure',

  FILE_UPLOAD_LIST = '[Manual-Cm-Request] File Upload List',
  FILE_UPLOAD_LIST_SUCCESS = 'Manual-Cm-Request] File Upload List Success',
  FILE_UPLOAD_LIST_FAILURE = '[Manual-Cm-Request] File Upload List Failure',

  FILE_DOWNLOAD_URL = '[Manual-Cm-Request] File Download Url',
  FILE_DOWNLOAD_URL_SUCCESS = '[Manual-Cm-Request] File Download Url Success',
  FILE_DOWNLOAD_URL_FAILURE = '[Manual-Cm-Request] File Download Url Failure',

  CLEAR_CM_REQUEST_LIST = '[Manual-Cm-Request]Clear CMRequest List',
  CLEAR_CM_REQUEST_DETAILS = '[Manual-Cm-Request]Clear CMRequest Details',
  CLEAR_CM_REQUEST_PRODUCT_DETAILS = '[Manual-Cm-Request]Clear CMRequest Product Details',

  SET_DROPDOWN_VALUE = '[Manual-Cm-Request] Set Dropdown Values',

}

export class LoadCmRequestList implements Action {
  readonly type = CmRequestActionTypes.LOAD_CM_REQUEST_LIST;
  constructor(public payload: CmRequestListPayload) {}
}
export class LoadCmRequestListSuccess implements Action {
  readonly type = CmRequestActionTypes.LOAD_CM_REQUEST_LIST_SUCCESS;
  constructor(public payload: CmRequestList[]) {}
}
export class LoadCmRequestListFailure implements Action {
  readonly type = CmRequestActionTypes.LOAD_CM_REQUEST_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadCmRequestDetails implements Action {
  readonly type = CmRequestActionTypes.LOAD_CM_REQUEST_DETAILS;
  constructor(public payload: CmRequestDetailsPayload) {}
}
export class LoadCmRequestDetailsSuccess implements Action {
  readonly type = CmRequestActionTypes.LOAD_CM_REQUEST_DETAILS_SUCCESS;
  constructor(public payload: any) {}
}
export class LoadCmRequestDetailsFailure implements Action {
  readonly type = CmRequestActionTypes.LOAD_CM_REQUEST_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadCmProductList implements Action {
  readonly type = CmRequestActionTypes.LOAD_CM_PRODUCT_LIST;
  constructor(public payload: CashMemoDetailsRequestPayload) {}
}
export class LoadCmProductListSuccess implements Action {
  readonly type = CmRequestActionTypes.LOAD_CM_PRODUCT_LIST_SUCCESS;
  constructor(public payload: CashMemoDetailsResponse) {}
}
export class LoadCmProductListFailure implements Action {
  readonly type = CmRequestActionTypes.LOAD_CM_PRODUCT_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadCmProductDetails implements Action {
  readonly type = CmRequestActionTypes.LOAD_CM_PRODUCT_DETAILS;
  constructor(public payload: CashMemoItemDetailsRequestPayload) {}
}
export class LoadCmProductDetailsSuccess implements Action {
  readonly type = CmRequestActionTypes.LOAD_CM_PRODUCT_DETAILS_SUCCESS;
  constructor(public payload: CashMemoItemDetails[]) {}
}
export class LoadCmProductDetailsFailure implements Action {
  readonly type = CmRequestActionTypes.LOAD_CM_PRODUCT_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class CmApprovalRequest implements Action {
  readonly type = CmRequestActionTypes.CM_APPROVAL_REQUEST;
  constructor(public payload: CmApprovalRequestPayload) {}
}
export class CmApprovalRequestSuccess implements Action {
  readonly type = CmRequestActionTypes.CM_APPROVAL_REQUEST_SUCCESS;
  constructor(public payload: ApprovalRequest) {}
}
export class CmApprovalRequestFailure implements Action {
  readonly type = CmRequestActionTypes.CM_APPROVAL_REQUEST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ConfirmManualCM implements Action {
  readonly type = CmRequestActionTypes.CONFIRM_MANUAL_CM;
  constructor(readonly payload: CashMemoDetailsRequestPayload) {}
}

export class ConfirmManualCMSuccess implements Action {
  readonly type = CmRequestActionTypes.CONFIRM_MANUAL_CM_SUCCESS;
  constructor(readonly payload: CashMemoDetailsResponse) {}
}

export class ConfirmManualCMFailure implements Action {
  readonly type = CmRequestActionTypes.CONFIRM_MANUAL_CM_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class FileUploadList implements Action {
  readonly type = CmRequestActionTypes.FILE_UPLOAD_LIST;
  constructor(public payload: FileUploadDownloadPayload) {}
}

export class FileUploadListSuccess implements Action {
  readonly type = CmRequestActionTypes.FILE_UPLOAD_LIST_SUCCESS;
  constructor(public payload: FileUploadLists[]) {}
}

export class FileUploadListFailure implements Action {
  readonly type = CmRequestActionTypes.FILE_UPLOAD_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class FileDownloadUrl implements Action {
  readonly type = CmRequestActionTypes.FILE_DOWNLOAD_URL;
  constructor(public payload: { id: string; locationCode: string }) {}
}

export class FileDownloadUrlSuccess implements Action {
  readonly type = CmRequestActionTypes.FILE_DOWNLOAD_URL_SUCCESS;
  constructor(public payload: string) {}
}

export class FileDownloadUrlFailure implements Action {
  readonly type = CmRequestActionTypes.FILE_DOWNLOAD_URL_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ClearCmRequestList implements Action {
  readonly type = CmRequestActionTypes.CLEAR_CM_REQUEST_LIST;
}

export class ClearCmRequestDetails implements Action {
  readonly type = CmRequestActionTypes.CLEAR_CM_REQUEST_DETAILS;
}

export class ClearCmRequestProductDetails implements Action {
  readonly type = CmRequestActionTypes.CLEAR_CM_REQUEST_PRODUCT_DETAILS;
}

export class SetDropownValues implements Action {
  readonly type = CmRequestActionTypes.SET_DROPDOWN_VALUE;
  constructor(public payload: StatusTypesEnum) {}
}

export type CmRequestActions =
  | LoadCmRequestList
  | LoadCmRequestListSuccess
  | LoadCmRequestListFailure
  | LoadCmRequestDetails
  | LoadCmRequestDetailsSuccess
  | LoadCmRequestDetailsFailure
  | LoadCmProductList
  | LoadCmProductListSuccess
  | LoadCmProductListFailure
  | LoadCmProductDetails
  | LoadCmProductDetailsSuccess
  | LoadCmProductDetailsFailure
  | CmApprovalRequest
  | CmApprovalRequestSuccess
  | CmApprovalRequestFailure
  | ConfirmManualCM
  | ConfirmManualCMSuccess
  | ConfirmManualCMFailure
  | FileUploadList
  | FileUploadListSuccess
  | FileUploadListFailure
  | FileDownloadUrl
  | FileDownloadUrlSuccess
  | FileDownloadUrlFailure
  | ClearCmRequestList
  | ClearCmRequestDetails
  | ClearCmRequestProductDetails
  | SetDropownValues;
