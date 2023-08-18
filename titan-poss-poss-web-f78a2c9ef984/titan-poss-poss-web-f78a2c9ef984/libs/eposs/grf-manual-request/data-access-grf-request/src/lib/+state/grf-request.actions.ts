import { Action } from '@ngrx/store';
import {
  CashMemoDetailsRequestPayload,
  CashMemoDetailsResponse,
  CmApprovalRequestPayload,
  ApprovalRequest,
  CustomErrors,
  CashMemoItemDetails,
  CashMemoItemDetailsRequestPayload,
  FileUploadDownloadPayload,
  FileUploadLists,
  grfRequestListPayload,
  GRFRequestList,
  GRFRequestDetailsPayload
} from '@poss-web/shared/models';

export enum GrfRequestActionTypes {
  LOAD_GRF_REQUEST_LIST = '[Manual-Grf-Request]Load GRFRequest List',
  LOAD_GRF_REQUEST_LIST_SUCCESS = '[Manual-Grf-Request]Load GRFRequest List Success',
  LOAD_GRF_REQUEST_LIST_FAILURE = '[Manual-Grf-Request]Load GRFRequest List Failure',

  LOAD_GRF_REQUEST_DETAILS = '[Manual-Grf-Request]Load GRFRequest Details',
  LOAD_GRF_REQUEST_DETAILS_SUCCESS = '[Manual-Grf-Request]Load GRFRequest Details Success',
  LOAD_GRF_REQUEST_DETAILS_FAILURE = '[Manual-Grf-Request]Load GRFRequest Details Failure',

  LOAD_GRF_PRODUCT_LIST = '[Manual-Grf-Request]Load GRFProduct List',
  LOAD_GRF_PRODUCT_LIST_SUCCESS = '[Manual-Grf-Request]Load GRFProduct List Success',
  LOAD_GRF_PRODUCT_LIST_FAILURE = '[Manual-Grf-Request]Load GRFProduct List Failure',

  LOAD_GRF_PRODUCT_DETAILS = '[Manual-Grf-Request]Load GRFProduct Details',
  LOAD_GRF_PRODUCT_DETAILS_SUCCESS = '[Manual-Grf-Request]Load GRFProduct Details Success',
  LOAD_GRF_PRODUCT_DETAILS_FAILURE = '[Manual-Grf-Request]Load GRFProduct Details Failure',

  GRF_APPROVAL_REQUEST = '[Manual-Grf-Request]GRF Approval Request',
  GRF_APPROVAL_REQUEST_SUCCESS = '[Manual-Grf-Request]GRF Approval Request Success',
  GRF_APPROVAL_REQUEST_FAILURE = '[Manual-Grf-Request]GRF Approval Request Failure',

  CONFIRM_MANUAL_GRF = '[Manual-Grf-Request] Confirm Manual GRF',
  CONFIRM_MANUAL_GRF_SUCCESS = '[Manual-Grf-Request] Confirm Manual GRF Success',
  CONFIRM_MANUAL_GRF_FAILURE = '[Manual-Grf-Request] Confirm Manual GRF Failure',

  FILE_UPLOAD_LIST = '[Manual-Grf-Request] File Upload List',
  FILE_UPLOAD_LIST_SUCCESS = 'Manual-Grf-Request] File Upload List Success',
  FILE_UPLOAD_LIST_FAILURE = '[Manual-Grf-Request] File Upload List Failure',

  FILE_DOWNLOAD_URL = '[Manual-Grf-Request] File Download Url',
  FILE_DOWNLOAD_URL_SUCCESS = '[Manual-Grf-Request] File Download Url Success',
  FILE_DOWNLOAD_URL_FAILURE = '[Manual-Grf-Request] File Download Url Failure',

  CLEAR_GRF_REQUEST_LIST = '[Manual-Grf-Request]Clear GRFRequest List',
  CLEAR_GRF_REQUEST_DETAILS = '[Manual-Grf-Request]Clear GRFRequest Details'
}

export class LoadGrfRequestList implements Action {
  readonly type = GrfRequestActionTypes.LOAD_GRF_REQUEST_LIST;
  constructor(public payload: grfRequestListPayload) {}
}
export class LoadGrfRequestListSuccess implements Action {
  readonly type = GrfRequestActionTypes.LOAD_GRF_REQUEST_LIST_SUCCESS;
  constructor(public payload: GRFRequestList[]) {}
}
export class LoadGrfRequestListFailure implements Action {
  readonly type = GrfRequestActionTypes.LOAD_GRF_REQUEST_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadGrfRequestDetails implements Action {
  readonly type = GrfRequestActionTypes.LOAD_GRF_REQUEST_DETAILS;
  constructor(public payload: GRFRequestDetailsPayload) {}
}
export class LoadGrfRequestDetailsSuccess implements Action {
  readonly type = GrfRequestActionTypes.LOAD_GRF_REQUEST_DETAILS_SUCCESS;
  constructor(public payload: any) {}
}
export class LoadGrfRequestDetailsFailure implements Action {
  readonly type = GrfRequestActionTypes.LOAD_GRF_REQUEST_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadGrfProductList implements Action {
  readonly type = GrfRequestActionTypes.LOAD_GRF_PRODUCT_LIST;
  constructor(public payload: CashMemoDetailsRequestPayload) {}
}
export class LoadGrfProductListSuccess implements Action {
  readonly type = GrfRequestActionTypes.LOAD_GRF_PRODUCT_LIST_SUCCESS;
  constructor(public payload: CashMemoDetailsResponse) {}
}
export class LoadGrfProductListFailure implements Action {
  readonly type = GrfRequestActionTypes.LOAD_GRF_PRODUCT_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadGrfProductDetails implements Action {
  readonly type = GrfRequestActionTypes.LOAD_GRF_PRODUCT_DETAILS;
  constructor(public payload: CashMemoItemDetailsRequestPayload) {}
}
export class LoadGrfProductDetailsSuccess implements Action {
  readonly type = GrfRequestActionTypes.LOAD_GRF_PRODUCT_DETAILS_SUCCESS;
  constructor(public payload: CashMemoItemDetails[]) {}
}
export class LoadGrfProductDetailsFailure implements Action {
  readonly type = GrfRequestActionTypes.LOAD_GRF_PRODUCT_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class GrfApprovalRequest implements Action {
  readonly type = GrfRequestActionTypes.GRF_APPROVAL_REQUEST;
  constructor(public payload: CmApprovalRequestPayload) {}
}
export class GrfApprovalRequestSuccess implements Action {
  readonly type = GrfRequestActionTypes.GRF_APPROVAL_REQUEST_SUCCESS;
  constructor(public payload: ApprovalRequest) {}
}
export class GrfApprovalRequestFailure implements Action {
  readonly type = GrfRequestActionTypes.GRF_APPROVAL_REQUEST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ConfirmManualGRF implements Action {
  readonly type = GrfRequestActionTypes.CONFIRM_MANUAL_GRF;
  constructor(readonly payload: CashMemoDetailsRequestPayload) {}
}

export class ConfirmManualGRFSuccess implements Action {
  readonly type = GrfRequestActionTypes.CONFIRM_MANUAL_GRF_SUCCESS;
  constructor(readonly payload: CashMemoDetailsResponse) {}
}

export class ConfirmManualGRFFailure implements Action {
  readonly type = GrfRequestActionTypes.CONFIRM_MANUAL_GRF_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class FileUploadList implements Action {
  readonly type = GrfRequestActionTypes.FILE_UPLOAD_LIST;
  constructor(public payload: FileUploadDownloadPayload) {}
}

export class FileUploadListSuccess implements Action {
  readonly type = GrfRequestActionTypes.FILE_UPLOAD_LIST_SUCCESS;
  constructor(public payload: FileUploadLists[]) {}
}

export class FileUploadListFailure implements Action {
  readonly type = GrfRequestActionTypes.FILE_UPLOAD_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class FileDownloadUrl implements Action {
  readonly type = GrfRequestActionTypes.FILE_DOWNLOAD_URL;
  constructor(public payload: { id: string; locationCode: string }) {}
}

export class FileDownloadUrlSuccess implements Action {
  readonly type = GrfRequestActionTypes.FILE_DOWNLOAD_URL_SUCCESS;
  constructor(public payload: string) {}
}

export class FileDownloadUrlFailure implements Action {
  readonly type = GrfRequestActionTypes.FILE_DOWNLOAD_URL_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ClearGrfRequestList implements Action {
  readonly type = GrfRequestActionTypes.CLEAR_GRF_REQUEST_LIST;
}

export class ClearGrfRequestDetails implements Action {
  readonly type = GrfRequestActionTypes.CLEAR_GRF_REQUEST_DETAILS;
}

export type GrfRequestActions =
  | LoadGrfRequestList
  | LoadGrfRequestListSuccess
  | LoadGrfRequestListFailure
  | LoadGrfRequestDetails
  | LoadGrfRequestDetailsSuccess
  | LoadGrfRequestDetailsFailure
  | LoadGrfProductList
  | LoadGrfProductListSuccess
  | LoadGrfProductListFailure
  | LoadGrfProductDetails
  | LoadGrfProductDetailsSuccess
  | LoadGrfProductDetailsFailure
  | GrfApprovalRequest
  | GrfApprovalRequestSuccess
  | GrfApprovalRequestFailure
  | ConfirmManualGRF
  | ConfirmManualGRFSuccess
  | ConfirmManualGRFFailure
  | FileUploadList
  | FileUploadListSuccess
  | FileUploadListFailure
  | FileDownloadUrl
  | FileDownloadUrlSuccess
  | FileDownloadUrlFailure
  | ClearGrfRequestList
  | ClearGrfRequestDetails;
