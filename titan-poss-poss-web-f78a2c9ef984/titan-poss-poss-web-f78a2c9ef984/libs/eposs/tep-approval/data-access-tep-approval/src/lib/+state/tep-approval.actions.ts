import { Action } from '@ngrx/store';
import {
  CustomErrors,
  CnApprovalListRequest,
  SaveCnApproval,
  tepApprovalListResponse,
  tepRequests,
  workflowPayload,
  RefundListingPayload,
  RefundList,
  EditRefundItemPayload,
  RefundListItem,
  FullValueTepRequestsResponse,
  FvtAcceptOrRejectRequestPayload
} from '@poss-web/shared/models';

/**
 * The interface for Action payload
 */
export enum TepApprovalActionTypes {
  GET_TEP_APPROVAL_LIST = '[tep-approval] Get Tep Approval List',
  GET_TEP_APPROVAL_LIST_SUCCESS = '[tep-approval] Get Tep Approval List Success',
  GET_TEP_APPROVAL_LIST_FAILURE = '[tep-approval] Get Tep Approval List Failure',

  GET_FULL_VALUE_TEP_APPROVAL_LIST = '[tep-approval] Get Full Value Tep Approval List',
  GET_FULL_VALUE_TEP_APPROVAL_LIST_SUCCESS = '[tep-approval] Get Full Value Tep Approval List Success',
  GET_FULL_VALUE_TEP_APPROVAL_LIST_FAILURE = '[tep-approval] Get Full Value Tep Approval List Failure',

  SEND_APPROVAL_FOR_REQUEST = '[tep-approval] Send Approval For Request',
  SEND_APPROVAL_FOR_REQUEST_SUCCESS = '[tep-approval] Send Approval For Request Success',
  SEND_APPROVAL_FOR_REQUEST_FAILURE = '[tep-approval] Send Approval For Request Failure',

  SAVE_TEP_APPROVAL_STATUS = '[tep-approval] Save Tep Approval Status ',
  SAVE_TEP_APPROVAL_STATUS_SUCCESS = '[tep-approval] Save Tep Approval Status Success ',
  SAVE_TEP_APPROVAL_STATUS_FAILURE = '[tep-approval] Save Tep Approval Status Failure ',

  LOAD_WORKFLOW_DETAILS = '[tep-approval] Load Workflow Details',
  LOAD_WORKFLOW_DETAILS_SUCCESS = '[tep-approval] Load Workflow Details Success',
  LOAD_WORKFLOW_DETAILS_FAILURE = '[tep-approval] Load Workflow Details Failure',

  LOAD_TEP_REFUND_LIST = '[tep-approval] Load Tep Refund List',
  LOAD_TEP_REFUND_LIST_SUCCESS = '[tep-approval] Load Tep Refund List Success',
  LOAD_TEP_REFUND_LIST_FAILURE = '[tep-approval] Tep Load Refund List Failure',

  EDIT_TEP_REFUND_ITEM = '[tep-approval] Edit Tep Refund Item',
  EDIT_TEP_REFUND_ITEM_SUCCESS = '[tep-approval] Edit Tep Refund Item Success',
  EDIT_TEP_REFUND_ITEM_FAILURE = '[tep-approval] Edit Tep Refund Item Failure',

  RESET_RESPONSE = '[tep-approval] Reset Response',
  UPDATE_RESPONSE = '[tep-approval] Update Response'
}

/**
 * Data upload Actions
 */

export class GetTepApprovalList implements Action {
  readonly type = TepApprovalActionTypes.GET_TEP_APPROVAL_LIST;
  constructor(public payload: CnApprovalListRequest) {}
}
export class GetTepApprovalListSuccess implements Action {
  readonly type = TepApprovalActionTypes.GET_TEP_APPROVAL_LIST_SUCCESS;
  constructor(public payload: tepRequests) {}
}
export class GetTepApprovalListFailure implements Action {
  readonly type = TepApprovalActionTypes.GET_TEP_APPROVAL_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class GetFullValueTepApprovalList implements Action {
  readonly type = TepApprovalActionTypes.GET_FULL_VALUE_TEP_APPROVAL_LIST;
  constructor(public payload: CnApprovalListRequest) {}
}
export class GetFullValueTepApprovalListSuccess implements Action {
  readonly type =
    TepApprovalActionTypes.GET_FULL_VALUE_TEP_APPROVAL_LIST_SUCCESS;
  constructor(public payload: FullValueTepRequestsResponse) {}
}
export class GetFullValueTepApprovalListFailure implements Action {
  readonly type =
    TepApprovalActionTypes.GET_FULL_VALUE_TEP_APPROVAL_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SendApprovalForRequest implements Action {
  readonly type = TepApprovalActionTypes.SEND_APPROVAL_FOR_REQUEST;
  constructor(
    readonly isApprove: boolean,
    public payload: FvtAcceptOrRejectRequestPayload,
    readonly processId: string,
    readonly taskId: string,
    readonly taskName: string
  ) {}
}
export class SendApprovalForRequestSuccess implements Action {
  readonly type = TepApprovalActionTypes.SEND_APPROVAL_FOR_REQUEST_SUCCESS;
  constructor(public payload: any) {}
}
export class SendApprovalForRequestFailure implements Action {
  readonly type = TepApprovalActionTypes.SEND_APPROVAL_FOR_REQUEST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveTepApprovalStatus implements Action {
  readonly type = TepApprovalActionTypes.SAVE_TEP_APPROVAL_STATUS;
  constructor(public payload: SaveCnApproval) {}
}
export class SaveTepApprovalStatusSuccess implements Action {
  readonly type = TepApprovalActionTypes.SAVE_TEP_APPROVAL_STATUS_SUCCESS;
  constructor(public payload: any) {}
}
export class SaveTepApprovalStatusFailure implements Action {
  readonly type = TepApprovalActionTypes.SAVE_TEP_APPROVAL_STATUS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadWorkflowDeatils implements Action {
  readonly type = TepApprovalActionTypes.LOAD_WORKFLOW_DETAILS;

  constructor(readonly payload: workflowPayload) {}
}

export class LoadWorkflowDeatilsSuccess implements Action {
  readonly type = TepApprovalActionTypes.LOAD_WORKFLOW_DETAILS_SUCCESS;
  constructor(readonly payload: tepApprovalListResponse) {}
}
export class LoadWorkflowDeatilsFailure implements Action {
  readonly type = TepApprovalActionTypes.LOAD_WORKFLOW_DETAILS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}
export class ResetResponse implements Action {
  readonly type = TepApprovalActionTypes.RESET_RESPONSE;
}

export class UpdateResponse implements Action {
  readonly type = TepApprovalActionTypes.UPDATE_RESPONSE;
  constructor(readonly payload: tepApprovalListResponse) {}
}

export class LoadTepRefundList implements Action {
  readonly type = TepApprovalActionTypes.LOAD_TEP_REFUND_LIST;
  constructor(
    readonly payload: RefundListingPayload,
    readonly page: number,
    readonly size: number
  ) {}
}

export class LoadTepRefundListSuccess implements Action {
  readonly type = TepApprovalActionTypes.LOAD_TEP_REFUND_LIST_SUCCESS;
  constructor(readonly payload: RefundList) {}
}
export class LoadTepRefundListFailure implements Action {
  readonly type = TepApprovalActionTypes.LOAD_TEP_REFUND_LIST_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class EditTepRefundItem implements Action {
  readonly type = TepApprovalActionTypes.EDIT_TEP_REFUND_ITEM;
  constructor(
    readonly payload: EditRefundItemPayload,
    readonly status: string,
    readonly id: string
  ) {}
}

export class EditTepRefundItemSuccess implements Action {
  readonly type = TepApprovalActionTypes.EDIT_TEP_REFUND_ITEM_SUCCESS;
  constructor(readonly payload: RefundListItem) {}
}

export class EditTepRefundItemFailure implements Action {
  readonly type = TepApprovalActionTypes.EDIT_TEP_REFUND_ITEM_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

/**
 *  Data Upload Action types
 */
export type TepApprovalActions =
  | ResetResponse
  | GetTepApprovalList
  | GetTepApprovalListFailure
  | GetTepApprovalListSuccess
  | LoadWorkflowDeatils
  | UpdateResponse
  | LoadWorkflowDeatilsSuccess
  | LoadWorkflowDeatilsFailure
  | SaveTepApprovalStatus
  | SaveTepApprovalStatusSuccess
  | SaveTepApprovalStatusFailure
  | LoadTepRefundList
  | LoadTepRefundListSuccess
  | LoadTepRefundListFailure
  | EditTepRefundItem
  | EditTepRefundItemSuccess
  | EditTepRefundItemFailure
  | GetFullValueTepApprovalList
  | GetFullValueTepApprovalListSuccess
  | GetFullValueTepApprovalListFailure
  | SendApprovalForRequest
  | SendApprovalForRequestSuccess
  | SendApprovalForRequestFailure;
