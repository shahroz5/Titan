import { Action } from '@ngrx/store';
import {
  CustomErrors,
  RequestPayload,
  ABRequestStatusList,
  ABRequestStatusDownValues,
  ABSearchValues,
  workflowPayload,
  RefundStatusCount,
  RefundRequestPayload,
  GetTepItemConfiguratonResponse,
  AdvanceBookingSearchPayload,
   TEPSearchResponse,
  HistorySearchParamDetails,
AdvanceHistoryItemsRequestPayload,
SortItem
} from '@poss-web/shared/models';

export enum TEPRequestActionTypes {
  RESET_VALUES = '[TEP REQUEST] Reset Values',

  LOAD_REQUESTS = '[TEP REQUEST] LOAD REQUESTS LIST',
  LOAD_REQUESTS_SUCCESS = '[TEP REQUEST] LOAD REQUESTS LIST Success',
  LOAD_REQUESTS_FAILURE = '[TEP REQUEST] LOAD REQUESTS LIST Failure',

  APPROVE_REFUND_ORDER_DETAILS = '[TEP REQUEST] APPROVE REFUND ORDER DETAILS LIST',
  APPROVE_REFUND_ORDER_DETAILS_SUCCESS = '[TEP REQUEST] APPROVE REFUND ORDER DETAILS LIST Success',
  APPROVE_REFUND_ORDER_DETAILS_FAILURE = '[TEP REQUEST] APPROVE REFUND ORDER DETAILS LIST Failure',

  LOAD_REFUND_ORDER_DETAILS = '[TEP REQUEST] LOAD REFUND ORDER DETAILS LIST',
  LOAD_REFUND_ORDER_DETAILS_SUCCESS = '[TEP REQUEST] LOAD REFUND ORDER DETAILS LIST Success',
  LOAD_REFUND_ORDER_DETAILS_FAILURE = '[TEP REQUEST] LOAD REFUND ORDER DETAILS LIST Failure',

  LOAD_REFUND_REQUESTS = '[TEP REQUEST] LOAD REFUND REQUESTS LIST',
  LOAD_REFUND_REQUESTS_SUCCESS = '[TEP REQUEST] LOAD REFUND REQUESTS LIST Success',
  LOAD_REFUND_REQUESTS_FAILURE = '[TEP REQUEST] LOAD REFUND REQUESTS LIST Failure',

  LOAD_SELECTED = '[TEP REQUEST] Load Selected Data',
  CLEAR_SEARCH_LIST = '[TEP REQUEST] Clear Search List',
  SET_DROPDOWN_VALUE = '[TEP REQUEST] Set Dropdown Values',
  SET_REFUND_DROPDOWN_VALUE = '[TEP REQUEST] Set Refund Dropdown Values',

  SET_SEARCH_VALUES = '[TEP REQUEST] Set Search Values',
  RESET_SEARCH_VALUES = '[TEP REQUEST] Reset Search Values',
  SET_HISTORY_SEARCH_PARAM_DETAILS = '[TEP REQUEST] Set TEP Search Param Details',
  LOAD_WORKFLOW_DETAILS = '[TEP REQUEST] Load Workflow Details',
  LOAD_WORKFLOW_DETAILS_SUCCESS = '[TEP REQUEST] Load Workflow Details Success',
  LOAD_WORKFLOW_DETAILS_FAILURE = '[TEP REQUEST] Load Workflow Details Failure',

  GET_ITEM_CONFIGURATION = '[TEP REQUEST] Get Tep Item Configuration',
  GET_ITEM_CONFIGURATION_SUCCESS = '[TEP REQUEST] Get Tep Item Configuration Success',
  GET_ITEM_CONFIGURATION_FAILURE = '[TEP REQUEST] Get Tep Item Configuration Failure',
  LOAD_TEP_HISTORY = '[TEP REQUEST] Load TEP History',
  LOAD_TEP_HISTORY_SUCCESS = '[TEP REQUEST] Load TEP History Success',
  LOAD_TEP_HISTORY_FAILURE = '[TEP REQUEST] Load TEP History Failure',

  SEARCH_TEP = '[TEP REQUEST] Search Tep',
  SEARCH_TEP_SUCCESS = '[TEP REQUEST] Search Tep Success',
  SEARCH_TEP_FAILURE = '[TEP REQUEST] Search Tep Failure'
}

export class LoadRequests implements Action {
  readonly type = TEPRequestActionTypes.LOAD_REQUESTS;

  constructor(readonly payload: RequestPayload) {}
}

export class LoadRequestsSuccess implements Action {
  readonly type = TEPRequestActionTypes.LOAD_REQUESTS_SUCCESS;
  constructor(readonly payload: ABRequestStatusList) {}
}
export class LoadRequestsFailure implements Action {
  readonly type = TEPRequestActionTypes.LOAD_REQUESTS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadRefundOrderDeatils implements Action {
  readonly type = TEPRequestActionTypes.LOAD_REFUND_ORDER_DETAILS;

  constructor(readonly payload: RefundRequestPayload) {}
}

export class SetHistoryTEPSearchParamDetails implements Action {
  readonly type = TEPRequestActionTypes.SET_HISTORY_SEARCH_PARAM_DETAILS;
  constructor(readonly payload: HistorySearchParamDetails) {}
}

export class LoadRefundOrderDeatilsSuccess implements Action {
  readonly type = TEPRequestActionTypes.LOAD_REFUND_ORDER_DETAILS_SUCCESS;
  constructor(readonly payload: ABRequestStatusList) {}
}
export class LoadRefundOrderDeatilsFailure implements Action {
  readonly type = TEPRequestActionTypes.LOAD_REFUND_ORDER_DETAILS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadTEPHistory implements Action {
  readonly type = TEPRequestActionTypes.LOAD_TEP_HISTORY;
  constructor(
    readonly payload: AdvanceHistoryItemsRequestPayload,
    readonly searchField: string,
    readonly searchType: string,
    readonly status: string,
    readonly page?: number,
    readonly size?: number,
    readonly txnType?: string,
    readonly subTxnType?: string,
    readonly sort?:SortItem
  ) {}
}

export class LoadTEPHistorySuccess implements Action {
  readonly type = TEPRequestActionTypes.LOAD_TEP_HISTORY_SUCCESS;
  constructor(readonly payload: TEPSearchResponse) {}
}

export class LoadTEPHistoryFailure implements Action {
  readonly type = TEPRequestActionTypes.LOAD_TEP_HISTORY_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class ApproveRefundOrderDeatils implements Action {
  readonly type = TEPRequestActionTypes.APPROVE_REFUND_ORDER_DETAILS;

  constructor(readonly payload: RefundRequestPayload) {}
}

export class ApproveRefundOrderDeatilsSuccess implements Action {
  readonly type = TEPRequestActionTypes.APPROVE_REFUND_ORDER_DETAILS_SUCCESS;
  constructor(readonly payload: ABRequestStatusList) {}
}
export class ApproveRefundOrderDeatilsFailure implements Action {
  readonly type = TEPRequestActionTypes.APPROVE_REFUND_ORDER_DETAILS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadRefundRequests implements Action {
  readonly type = TEPRequestActionTypes.LOAD_REFUND_REQUESTS;

  constructor(readonly payload: RequestPayload) {}
}

export class LoadRefundRequestsSuccess implements Action {
  readonly type = TEPRequestActionTypes.LOAD_REFUND_REQUESTS_SUCCESS;
  constructor(readonly payload: RefundStatusCount) {}
}
export class LoadRefundRequestsFailure implements Action {
  readonly type = TEPRequestActionTypes.LOAD_REFUND_REQUESTS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class SetSearchValues implements Action {
  readonly type = TEPRequestActionTypes.SET_SEARCH_VALUES;
  constructor(public payload: ABSearchValues) {}
}

export class LoadWorkflowDeatils implements Action {
  readonly type = TEPRequestActionTypes.LOAD_WORKFLOW_DETAILS;

  constructor(readonly payload: workflowPayload) {}
}

export class LoadWorkflowDeatilsSuccess implements Action {
  readonly type = TEPRequestActionTypes.LOAD_WORKFLOW_DETAILS_SUCCESS;
  constructor(readonly payload: any) {}
}
export class LoadWorkflowDeatilsFailure implements Action {
  readonly type = TEPRequestActionTypes.LOAD_WORKFLOW_DETAILS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class GetTepItemConfiguration implements Action {
  readonly type = TEPRequestActionTypes.GET_ITEM_CONFIGURATION;
  constructor(
    readonly itemCode: string,
    readonly tepType: string,
    readonly customerMobileNo: string
  ) {}
}

export class GetTepItemConfigurationSuccess implements Action {
  readonly type = TEPRequestActionTypes.GET_ITEM_CONFIGURATION_SUCCESS;
  constructor(readonly payload: GetTepItemConfiguratonResponse) {}
}

export class GetTepItemConfigurationFailure implements Action {
  readonly type = TEPRequestActionTypes.GET_ITEM_CONFIGURATION_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class ResetValues implements Action {
  readonly type = TEPRequestActionTypes.RESET_VALUES;
}

export class ClearSearchList implements Action {
  readonly type = TEPRequestActionTypes.CLEAR_SEARCH_LIST;
}

export class SetDropownValues implements Action {
  readonly type = TEPRequestActionTypes.SET_DROPDOWN_VALUE;
  constructor(public payload: ABRequestStatusDownValues) {}
}

export class SetRefundDropownValues implements Action {
  readonly type = TEPRequestActionTypes.SET_REFUND_DROPDOWN_VALUE;
  constructor(public payload: ABRequestStatusDownValues) {}
}

export class ResetSearchValues implements Action {
  readonly type = TEPRequestActionTypes.RESET_SEARCH_VALUES;
}

export class SearchTEP implements Action {
  readonly type = TEPRequestActionTypes.SEARCH_TEP;
  constructor(
    readonly payload?: AdvanceBookingSearchPayload,
    readonly notConfirmedpayload?: RequestPayload
  ) {}
}

export class SearchTEPSuccess implements Action {
  readonly type = TEPRequestActionTypes.SEARCH_TEP_SUCCESS;
  constructor(readonly payload: TEPSearchResponse) {}
}

export class SearchTEPFailure implements Action {
  readonly type = TEPRequestActionTypes.SEARCH_TEP_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export type TEPRequestActions =
  | LoadWorkflowDeatils
  | LoadWorkflowDeatilsFailure
  | LoadWorkflowDeatilsSuccess
  | ClearSearchList
  | SetDropownValues
  | SetRefundDropownValues
  | ResetSearchValues
  | SetSearchValues
  | ApproveRefundOrderDeatils
  | ApproveRefundOrderDeatilsFailure
  | ApproveRefundOrderDeatilsSuccess
  | SetHistoryTEPSearchParamDetails
  | ResetValues
  | LoadRefundOrderDeatils
  | LoadRefundOrderDeatilsSuccess
  | LoadRefundOrderDeatilsFailure
  | LoadRefundRequests
  | LoadRefundRequestsSuccess
  | LoadRefundRequestsFailure
  | LoadRequests
  | LoadRequestsSuccess
  | LoadRequestsFailure
  | LoadTEPHistory
  | LoadTEPHistorySuccess
  | LoadTEPHistoryFailure
  | SearchTEPSuccess
  | SearchTEPFailure
  | SearchTEP
  | GetTepItemConfiguration
  | GetTepItemConfigurationSuccess
  | GetTepItemConfigurationFailure;
