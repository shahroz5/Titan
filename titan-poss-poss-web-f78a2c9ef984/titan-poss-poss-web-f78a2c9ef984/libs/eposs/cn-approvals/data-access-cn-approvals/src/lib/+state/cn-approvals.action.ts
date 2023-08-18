import { Action } from '@ngrx/store';
import {
  CustomErrors,
  CnApprovalListResponse,
  CnApprovalListRequest,
  SaveCnApproval
} from '@poss-web/shared/models';

export enum CnApprovalActionTypes {
  LOAD_CN_APPROVALS_LIST = '[cn-approvals] Load  Cn Approval List',
  LOAD_CN_APPROVALS_LIST_SUCCESS = '[cn-approvals] Load  Cn Approval List Success',
  LOAD_CN_APPROVALS_LIST_FAILURE = '[cn-approvals] Load  Cn Approval List Failure',

  SAVE_CN_APPROVAL_STATUS = '[cn-approvals] Save Cn Approval Status ',
  SAVE_CN_APPROVAL_STATUS_SUCCESS = '[cn-approvals] Save Cn Approval Status Success ',
  SAVE_CN_APPROVAL_STATUS_FAILURE = '[cn-approvals] Save Cn Approval Status Failure ',

  LOAD_RESET = '[cn-approvals] Load Reset'
}

export class LoadCnApprovalsList implements Action {
  readonly type = CnApprovalActionTypes.LOAD_CN_APPROVALS_LIST;
  constructor(public payload: CnApprovalListRequest) {}
}
export class LoadCnApprovalsListSuccess implements Action {
  readonly type = CnApprovalActionTypes.LOAD_CN_APPROVALS_LIST_SUCCESS;
  constructor(public payload: CnApprovalListResponse[]) {}
}

export class LoadCnApprovalsListFailure implements Action {
  readonly type = CnApprovalActionTypes.LOAD_CN_APPROVALS_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveCnApprovalStatus implements Action {
  readonly type = CnApprovalActionTypes.SAVE_CN_APPROVAL_STATUS;
  constructor(public payload: SaveCnApproval) {}
}
export class SaveCnApprovalStatusSuccess implements Action {
  readonly type = CnApprovalActionTypes.SAVE_CN_APPROVAL_STATUS_SUCCESS;
  constructor(public payload: string[]) {}
}
export class SaveCnApprovalStatusFailure implements Action {
  readonly type = CnApprovalActionTypes.SAVE_CN_APPROVAL_STATUS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadReset implements Action {
  readonly type = CnApprovalActionTypes.LOAD_RESET;
}

export type CnApprovalActions =
  | LoadCnApprovalsList
  | LoadCnApprovalsListSuccess
  | LoadCnApprovalsListFailure
  | SaveCnApprovalStatus
  | SaveCnApprovalStatusFailure
  | LoadReset
  | SaveCnApprovalStatusSuccess;
