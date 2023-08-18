import { Action } from '@ngrx/store';
import {
  CustomErrors,
  GrnRequestApprovalListResponse,
  GrnRequestApprovalListRequest,
  SaveGrnRequestApproval
} from '@poss-web/shared/models';

export enum GrnRequestApprovalActionTypes {
  LOAD_GRN_REQUEST_LIST = '[grn-request-approvals] Load  Grn Request Approval List',
  LOAD_GRN_REQUEST_LIST_SUCCESS = '[grn-request-approvals] Load  Grn Request Approval List Success',
  LOAD_GRN_REQUEST_LIST_FAILURE = '[grn-request-approvals] Load  Grn Request Approval List Failure',

  SAVE_GRN_REQUEST_APPROVAL_STATUS = '[grn-request-approvals] Save Grn Request Approval Status ',
  SAVE_GRN_REQUEST_APPROVAL_STATUS_SUCCESS = '[grn-request-approvals] Save Grn Request Approval Status Success ',
  SAVE_GRN_REQUEST_APPROVAL_STATUS_FAILURE = '[grn-request-approvals] Save Grn Request Approval Status Failure ',

  LOAD_RESET = '[grn-request-approvals] Load Reset'
}

export class LoadGrnRequestList implements Action {
  readonly type = GrnRequestApprovalActionTypes.LOAD_GRN_REQUEST_LIST;
  constructor(public payload: GrnRequestApprovalListRequest) {}
}
export class LoadGrnRequestListSuccess implements Action {
  readonly type = GrnRequestApprovalActionTypes.LOAD_GRN_REQUEST_LIST_SUCCESS;
  constructor(public payload: GrnRequestApprovalListResponse[]) {}
}

export class LoadGrnRequestListFailure implements Action {
  readonly type = GrnRequestApprovalActionTypes.LOAD_GRN_REQUEST_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveGrnRequestApprovalStatus implements Action {
  readonly type =
    GrnRequestApprovalActionTypes.SAVE_GRN_REQUEST_APPROVAL_STATUS;
  constructor(public payload: SaveGrnRequestApproval) {}
}
export class SaveGrnRequestApprovalStatusSuccess implements Action {
  readonly type =
    GrnRequestApprovalActionTypes.SAVE_GRN_REQUEST_APPROVAL_STATUS_SUCCESS;
  constructor(public payload: string[]) {}
}
export class SaveGrnRequestApprovalStatusFailure implements Action {
  readonly type =
    GrnRequestApprovalActionTypes.SAVE_GRN_REQUEST_APPROVAL_STATUS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadReset implements Action {
  readonly type = GrnRequestApprovalActionTypes.LOAD_RESET;
}
export type GrnRequestApprovalActions =
  | LoadGrnRequestList
  | LoadGrnRequestListSuccess
  | LoadGrnRequestListFailure
  | SaveGrnRequestApprovalStatus
  | SaveGrnRequestApprovalStatusFailure
  | LoadReset
  | SaveGrnRequestApprovalStatusSuccess;
