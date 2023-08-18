import { Action } from '@ngrx/store';
import {
  CustomErrors,
  RoRequestApprovalListRequest,
  RoRequestApprovalListResponse,
  SaveRoRequestApproval,
  BoutiqueRoRequestApprovalListResponse
} from '@poss-web/shared/models';
export enum RoRequestApprovalActionTypes {
  LOAD_RO_REQUEST_APPROVAL_LIST = '[ro-request-approval] Load Ro Request Approval List ',
  LOAD_RO_REQUEST_APPROVAL_LIST_SUCCESS = '[ro-request-approval] Load Ro Request Approval List Success',
  LOAD_RO_REQUEST_APPROVAL_LIST_FAILURE = '[ro-request-approval] Load Ro Request Approval List Failure',

  LOAD_PENDING_RO_REQUEST_APPROVAL_LIST = '[ro-request-approval] Load Ro Pending Request Approval List ',
  LOAD_PENDING_RO_REQUEST_APPROVAL_LIST_SUCCESS = '[ro-request-approval] Load Ro Pending Request Approval List Success',
  LOAD_PENDING_RO_REQUEST_APPROVAL_LIST_FAILURE = '[ro-request-approval] Load Ro Pending  Request Approval List Failure',

  LOAD_APPROVED_RO_REQUEST_LIST = '[ro-request-approval] Load Approved Ro Request Approval List ',
  LOAD_APPROVED_RO_REQUEST_LIST_SUCCESS = '[ro-request-approval] Load Approved Ro Request Approval List Success ',
  LOAD_APPROVED_RO_REQUEST_LIST_FAILURE = '[ro-request-approval] Load Approved Ro Request Approval List Failure',

  LOAD_REJECTED_RO_REQUEST_APPROVAL_LIST = '[ro-request-approval] Load Rejected Ro Request Approval List ',
  LOAD_REJECTED_RO_REQUEST_APPROVAL_LIST_SUCCESS = '[ro-request-approval] Load Rejected  Ro Request Approval List  Success',
  LOAD_REJECTED_RO_REQUEST_APPROVAL_LIST_FAILURE = '[ro-request-approval] Load Rejected Ro Request Approval List Failure',

  LOAD_CLOSED_RO_REQUEST_APPROVAL_LIST = '[ro-request-approval] Load Closed Ro Request Approval List ',
  LOAD_CLOSED_RO_REQUEST_APPROVAL_LIST_SUCCESS = '[ro-request-approval] Load Closed  Ro Request Approval List  Success',
  LOAD_CLOSED_RO_REQUEST_APPROVAL_LIST_FAILURE = '[ro-request-approval] Load Closed Ro Request Approval List Failure',

  SAVE_RO_REQUEST_APPROVAL_STATUS = '[ro-request-approval] Save Ro Request Approval Status',
  SAVE_RO_REQUEST_APPROVAL_STATUS_SUCCESS = '[ro-request-approval] Save Ro Request Approval Status Success',
  SAVE_RO_REQUEST_APPROVAL_STATUS_FAILURE = '[ro-request-approval] Save Ro Request Approval Status Failure',

  LOAD_RESET = '[ro-request-approval] Load Request'
}

export class LoadRoRequestApprovalList implements Action {
  readonly type = RoRequestApprovalActionTypes.LOAD_RO_REQUEST_APPROVAL_LIST;
  constructor(public payload: RoRequestApprovalListRequest) {}
}
export class LoadRoRequestApprovalListSuccess implements Action {
  readonly type =
    RoRequestApprovalActionTypes.LOAD_RO_REQUEST_APPROVAL_LIST_SUCCESS;
  constructor(public payload: BoutiqueRoRequestApprovalListResponse) {}
}
export class LoadRoRequestApprovalListFailure implements Action {
  readonly type =
    RoRequestApprovalActionTypes.LOAD_RO_REQUEST_APPROVAL_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadPendingRoRequestApprovalList implements Action {
  readonly type =
    RoRequestApprovalActionTypes.LOAD_PENDING_RO_REQUEST_APPROVAL_LIST;
  constructor(public payload: RoRequestApprovalListRequest) {}
}
export class LoadPendingRoRequestApprovalListSuccess implements Action {
  readonly type =
    RoRequestApprovalActionTypes.LOAD_PENDING_RO_REQUEST_APPROVAL_LIST_SUCCESS;
  constructor(public payload: RoRequestApprovalListResponse[]) {}
}
export class LoadPendingRoRequestApprovalListFailure implements Action {
  readonly type =
    RoRequestApprovalActionTypes.LOAD_PENDING_RO_REQUEST_APPROVAL_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadApprovedRoRequestList implements Action {
  readonly type = RoRequestApprovalActionTypes.LOAD_APPROVED_RO_REQUEST_LIST;
  constructor(public payload: RoRequestApprovalListRequest) {}
}
export class LoadApprovedRoRequestListSuccess implements Action {
  readonly type =
    RoRequestApprovalActionTypes.LOAD_APPROVED_RO_REQUEST_LIST_SUCCESS;
  constructor(public payload: RoRequestApprovalListResponse[]) {}
}
export class LoadApprovedRoRequestListFailure implements Action {
  readonly type =
    RoRequestApprovalActionTypes.LOAD_APPROVED_RO_REQUEST_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadRejectedRoRequestApprovalList implements Action {
  readonly type =
    RoRequestApprovalActionTypes.LOAD_REJECTED_RO_REQUEST_APPROVAL_LIST;
  constructor(public payload: RoRequestApprovalListRequest) {}
}
export class LoadRejectedRoRequestApprovalListSuccess implements Action {
  readonly type =
    RoRequestApprovalActionTypes.LOAD_REJECTED_RO_REQUEST_APPROVAL_LIST_SUCCESS;
  constructor(public payload: RoRequestApprovalListResponse[]) {}
}
export class LoadRejectedRoRequestApprovalListFailure implements Action {
  readonly type =
    RoRequestApprovalActionTypes.LOAD_REJECTED_RO_REQUEST_APPROVAL_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadClosedRoRequestApprovalList implements Action {
  readonly type =
    RoRequestApprovalActionTypes.LOAD_CLOSED_RO_REQUEST_APPROVAL_LIST;
  constructor(public payload: RoRequestApprovalListRequest) {}
}
export class LoadClosedRoRequestApprovalListSuccess implements Action {
  readonly type =
    RoRequestApprovalActionTypes.LOAD_CLOSED_RO_REQUEST_APPROVAL_LIST_SUCCESS;
  constructor(public payload: RoRequestApprovalListResponse[]) {}
}
export class LoadClosedRoRequestApprovalListFailure implements Action {
  readonly type =
    RoRequestApprovalActionTypes.LOAD_CLOSED_RO_REQUEST_APPROVAL_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveRoRequestApprovalStatus implements Action {
  readonly type = RoRequestApprovalActionTypes.SAVE_RO_REQUEST_APPROVAL_STATUS;
  constructor(public payload: SaveRoRequestApproval) {}
}
export class SaveRoRequestApprovalStatusSuccess implements Action {
  readonly type =
    RoRequestApprovalActionTypes.SAVE_RO_REQUEST_APPROVAL_STATUS_SUCCESS;
  constructor(public payload: any) {}
}
export class SaveRoRequestApprovalStatusFailure implements Action {
  readonly type =
    RoRequestApprovalActionTypes.SAVE_RO_REQUEST_APPROVAL_STATUS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadReset {
  readonly type = RoRequestApprovalActionTypes.LOAD_RESET;
}

export type RoRequestApprovalAction =
  | LoadPendingRoRequestApprovalList
  | LoadPendingRoRequestApprovalListFailure
  | LoadPendingRoRequestApprovalListSuccess
  | LoadApprovedRoRequestList
  | LoadApprovedRoRequestListFailure
  | LoadApprovedRoRequestListSuccess
  | LoadRejectedRoRequestApprovalList
  | LoadRejectedRoRequestApprovalListFailure
  | LoadRejectedRoRequestApprovalListSuccess
  | SaveRoRequestApprovalStatus
  | SaveRoRequestApprovalStatusFailure
  | SaveRoRequestApprovalStatusSuccess
  | LoadRoRequestApprovalList
  | LoadRoRequestApprovalListSuccess
  | LoadRoRequestApprovalListFailure
  | LoadReset
  | LoadClosedRoRequestApprovalList
  | LoadClosedRoRequestApprovalListSuccess
  | LoadClosedRoRequestApprovalListFailure;
