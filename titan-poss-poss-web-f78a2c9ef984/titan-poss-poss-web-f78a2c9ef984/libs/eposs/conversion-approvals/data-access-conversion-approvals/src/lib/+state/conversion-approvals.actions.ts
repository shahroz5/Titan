import { Action } from '@ngrx/store';
import {
  ConversionApprovalListingResponsePayload,
  ConversionApprovalRequestsListingPayload,
  CustomErrors,
  ImageReqPayload,
  ImageResponse,
  SelectedRequestDataResponse,
  SelectedRequestDetailsResponse,
  SelectedRequestPayload,
  UpdateApprovalRequestStatusPayload
} from '@poss-web/shared/models';

export enum ConversionApprovalsActionTypes {
  LOAD_APPROVAL_REQUESTS_LIST = '[Conversion Approvals] Load Approval Requests List',
  LOAD_APPROVAL_REQUESTS_LIST_SUCCESS = '[Conversion Approvals] Load Approval Requests List Success',
  LOAD_APPROVAL_REQUESTS_LIST_FAILURE = '[Conversion Approvals] Load Approval Requests List Failure',

  LOAD_MORE_APPROVAL_REQUESTS_LIST = '[Conversion Approvals] Load More Approval Requests List',
  LOAD_MORE_APPROVAL_REQUESTS_LIST_SUCCESS = '[Conversion Approvals] Load More Approval Requests List Success',
  LOAD_MORE_APPROVAL_REQUESTS_LIST_FAILURE = '[Conversion Approvals] Load More Approval Requests List Failure',

  LOAD_SELECTED_REQUEST = '[Conversion Approvals] Load Selected Request',
  LOAD_SELECTED_REQUEST_SUCCESS = '[Conversion Approvals] Load Selected Request Success',
  LOAD_SELECTED_REQUEST_FAILURE = '[Conversion Approvals] Load Selected Request Failure',

  LOAD_SELECTED_REQUEST_DATA = '[Conversion Approvals] Load Selected Requests Data',
  LOAD_SELECTED_REQUEST_DATA_SUCCESS = '[Conversion Approvals] Load Selected Requests Data Success',
  LOAD_SELECTED_REQUEST_DATA_FAILURE = '[Conversion Approvals] Load Selected Requests Data Failure',

  UPDATE_APPROVAL_REQUEST_STATUS = '[Conversion Approvals] Update Approval Request Status',
  UPDATE_APPROVAL_REQUEST_STATUS_SUCCESS = '[Conversion Approvals] Update Approval Request Status Success',
  UPDATE_APPROVAL_REQUEST_STATUS_FAILURE = '[Conversion Approvals] Update Approval Request Status Failure',

  RESET = '[Conversion Approvals] Reset State',

  //Image
  LOAD_THUMBNAIL_IMAGE_URL = '[ Conversion Approvals ] Load Thumbnail Image Url',
  LOAD_THUMBNAIL_IMAGE_URL_SUCCESS = '[ Conversion Approvals ] Load Thumbnail Image Url Success',
  LOAD_THUMBNAIL_IMAGE_URL_FAILURE = '[ Conversion Approvals ] Load Thumbnail Image Url Failure',

  LOAD_IMAGE_URL = '[ Conversion Approvals ] Load Image Url',
  LOAD_IMAGE_URL_SUCCESS = '[ Conversion Approvals ] Load Image Url Success',
  LOAD_IMAGE_URL_FAILURE = '[ Conversion Approvals ] Load Image Url Failure',

}

export class LoadApprovalRequestsList implements Action {
  readonly type = ConversionApprovalsActionTypes.LOAD_APPROVAL_REQUESTS_LIST;
  constructor(readonly payload: ConversionApprovalRequestsListingPayload) {}
}
export class LoadApprovalRequestsListSuccess implements Action {
  readonly type =
    ConversionApprovalsActionTypes.LOAD_APPROVAL_REQUESTS_LIST_SUCCESS;
  constructor(readonly payload: ConversionApprovalListingResponsePayload) {}
}
export class LoadApprovalRequestsListFailure implements Action {
  readonly type =
    ConversionApprovalsActionTypes.LOAD_APPROVAL_REQUESTS_LIST_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}
export class LoadMoreApprovalRequestsList implements Action {
  readonly type =
    ConversionApprovalsActionTypes.LOAD_MORE_APPROVAL_REQUESTS_LIST;
  constructor(readonly payload: ConversionApprovalRequestsListingPayload) {}
}
export class LoadMoreApprovalRequestsListSuccess implements Action {
  readonly type =
    ConversionApprovalsActionTypes.LOAD_MORE_APPROVAL_REQUESTS_LIST_SUCCESS;
  constructor(readonly payload: ConversionApprovalListingResponsePayload) {}
}
export class LoadMoreApprovalRequestsListFailure implements Action {
  readonly type =
    ConversionApprovalsActionTypes.LOAD_MORE_APPROVAL_REQUESTS_LIST_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadSelectedRequest implements Action {
  readonly type = ConversionApprovalsActionTypes.LOAD_SELECTED_REQUEST;
  constructor(public payload: SelectedRequestPayload) {}
}

export class LoadSelectedRequestSuccess implements Action {
  readonly type = ConversionApprovalsActionTypes.LOAD_SELECTED_REQUEST_SUCCESS;
  constructor(public payload: SelectedRequestDetailsResponse) {}
}
export class LoadSelectedRequestFailure implements Action {
  readonly type = ConversionApprovalsActionTypes.LOAD_SELECTED_REQUEST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadSelectedRequestData implements Action {
  readonly type = ConversionApprovalsActionTypes.LOAD_SELECTED_REQUEST_DATA;
  constructor(public payload: SelectedRequestPayload) {}
}
export class LoadSelectedRequestDataSuccess implements Action {
  readonly type =
    ConversionApprovalsActionTypes.LOAD_SELECTED_REQUEST_DATA_SUCCESS;
  constructor(public payload: SelectedRequestDataResponse) {}
}
export class LoadSelectedRequestDataFailure implements Action {
  readonly type =
    ConversionApprovalsActionTypes.LOAD_SELECTED_REQUEST_DATA_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateApprovalRequestStatus implements Action {
  readonly type = ConversionApprovalsActionTypes.UPDATE_APPROVAL_REQUEST_STATUS;
  constructor(public payload: UpdateApprovalRequestStatusPayload) {}
}
export class UpdateApprovalRequestStatusSuccess implements Action {
  readonly type =
    ConversionApprovalsActionTypes.UPDATE_APPROVAL_REQUEST_STATUS_SUCCESS;
  constructor(public payload: SelectedRequestDetailsResponse) {}
}
export class UpdateApprovalRequestStatusFailure implements Action {
  readonly type =
    ConversionApprovalsActionTypes.UPDATE_APPROVAL_REQUEST_STATUS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetState implements Action {
  readonly type = ConversionApprovalsActionTypes.RESET;
}

// Image for Request Sent 
export class LoadThumbnailImageUrl implements Action {
  readonly type = ConversionApprovalsActionTypes.LOAD_THUMBNAIL_IMAGE_URL;
  constructor(public payload: ImageReqPayload) {}
}
export class LoadThumbnailImageUrlSuccess implements Action {
  readonly type = ConversionApprovalsActionTypes.LOAD_THUMBNAIL_IMAGE_URL_SUCCESS;
  constructor(public payload:  ImageResponse) {}
}
export class LoadThumbnailImageUrlFailure implements Action {
  readonly type = ConversionApprovalsActionTypes.LOAD_THUMBNAIL_IMAGE_URL_FAILURE;
  constructor(public payload:  ImageResponse) {}
}

export class LoadImageUrl implements Action {
  readonly type = ConversionApprovalsActionTypes.LOAD_IMAGE_URL;
  constructor(public payload: ImageReqPayload) {}
}
export class LoadImageUrlSuccess implements Action {
  readonly type = ConversionApprovalsActionTypes.LOAD_IMAGE_URL_SUCCESS;
  constructor(public payload:  ImageResponse) {}
}
export class LoadImageUrlFailure implements Action {
  readonly type = ConversionApprovalsActionTypes.LOAD_IMAGE_URL_FAILURE;
  constructor(public payload:  ImageResponse) {}
}


export type ConversionApprovalsActions =
  | LoadApprovalRequestsList
  | LoadApprovalRequestsListSuccess
  | LoadApprovalRequestsListFailure
  | LoadMoreApprovalRequestsList
  | LoadMoreApprovalRequestsListSuccess
  | LoadMoreApprovalRequestsListFailure
  | LoadSelectedRequest
  | LoadSelectedRequestSuccess
  | LoadSelectedRequestFailure
  | LoadSelectedRequestData
  | LoadSelectedRequestDataSuccess
  | LoadSelectedRequestDataFailure
  | UpdateApprovalRequestStatus
  | UpdateApprovalRequestStatusSuccess
  | UpdateApprovalRequestStatusFailure
  | ResetState
  | LoadImageUrl
  | LoadImageUrlSuccess
  | LoadImageUrlFailure
  | LoadThumbnailImageUrl
  | LoadThumbnailImageUrlSuccess
  | LoadThumbnailImageUrlFailure;
