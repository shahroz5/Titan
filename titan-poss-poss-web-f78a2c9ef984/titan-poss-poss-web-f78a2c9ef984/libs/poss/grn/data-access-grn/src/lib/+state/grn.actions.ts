import { Action } from '@ngrx/store';
import {
  GrnReqStatusListPayload,
  GrnReqStatusListResponse,
  CustomErrors,
  ConfirmGrnPayload,
  ConfirmGrnSuccessPayload,
  GrnReqDetails,
  GrnInitPayload,
  GrnInitResponse,
  ConfirmGrnWithOutApprovalPayload,
  SendForApprovalPayload,
  GrnApproversPayload,
  GrnApproverSuccessList,
  GrnSendForAprovalSuccess,
  GrnHistoryPayload,
  GrnHistoryResponse,
  Lov,
  GrnPriceDetailsPayload,
  GrnPriceDetailsSuccess,
  TcsCollectedResponse,
  ItemDetailsPayload,
  GrnProductDetails
} from '@poss-web/shared/models';
export enum GrnActionTypes {
  LOAD_GRN_REQ_STATUS_LIST = '[grn] Load grn req status List',
  LOAD_GRN_REQ_STATUS_LIST_SUCCESS = '[grn] Load grn req status List Success',
  LOAD_GRN_REQ_STATUS_LIST_FAILURE = '[grn] Load grn req status List Failure',

  FILTER_GRN_REQ_STATUS_LIST = '[grn] Filter grn req status List',
  FILTER_GRN_REQ_STATUS_LIST_SUCCESS = '[grn] Filter grn req status List Success',
  FILTER_GRN_REQ_STATUS_LIST_FAILURE = '[grn] Filter grn req status List Failure',

  SEARCH_GRN = '[grn] Search Grn',
  SEARCH_GRN_SUCCESS = '[grn] Search Grn Success ',
  SEARCH_GRN_FAILURE = '[grn] Search Grn  Failure',

  LOAD_GRN_DETAILS_BY_ID = '[grn] Load Grn Details By Id',
  LOAD_GRN_DETAILS_BY_ID_SUCCESS = '[grn] Load Grn Details By Id Success ',
  LOAD_GRN_DETAILS_BY_ID_FAILURE = '[grn] Load Grn Details By Id Failure',

  CONFIRM_GRN = '[grn] Confirm Grn',
  CONFIRM_GRN_SUCCESS = '[grn]  Confirm Grn Success ',
  CONFIRM_GRN_FAILURE = '[grn]  Confirm Grn Failure',

  CONFIRM_GRN_WITHOUT_APPROVAL = '[grn] Confirm Grn With Out Approval',
  CONFIRM_GRN_WITHOUT_APPROVAL_SUCCESS = '[grn]   Confirm Grn With Out Approval Success ',
  CONFIRM_GRN_WITHOUT_APPROVAL_FAILURE = '[grn]  Confirm Grn With Out Approval Failure',

  SEND_FOR_APPROVAL = '[grn] Send For Approval',
  SEND_FOR_APPROVAL_SUCCESS = '[grn]  Send For Approval Success ',
  SEND_FOR_APPROVAL_FAILURE = '[grn]  Send For Approval Failure',

  INITIATE_GRN = '[GRN] Initiate Grn',
  INITIATE_GRN_SUCCESS = '[GRN] Initiate Grn Success',
  INITIATE_GRN_FAILURE = '[GRN] Initiate Grn Failure',

  LOAD_ITEM = '[GRN] Load Item',
  LOAD_ITEM_SUCCESS = '[GRN] Load Item Success',
  LOAD_ITEM_FAILURE = '[GRN] Load Item Failure',

  GET_LOCATIONS = '[GRN] Get Locations',
  GET_LOCATIONS_SUCCESS = '[GRN] Get Locations Success',
  GET_LOCATIONS_FAILURE = '[GRN] Get Locations Failure',

  LOAD_APPROVERS = '[GRN] Load Approvers',
  LOAD_APPROVERS_SUCCESS = '[GRN] Load Approvers Success',
  LOAD_APPROVERS_FAILURE = '[GRN] Load Approvers Failure',

  LOAD_GRN_SUMMARY_BAR_DETAILS = '[GRN] Load Summary Bar Details',

  LOAD_GRN_HISTORY_DETAILS = '[GRN] Load Grn History Details',
  LOAD_GRN_HISTORY_DETAILS_SUCCESS = '[GRN] Load Grn History Details  Success',
  LOAD_GRN_HISTORY_DETAILS_FAILURE = '[GRN] Load Grn History Details Failure',

  SET_HISTORY_SEARCH_PARAM_DETAILS = '[GRN REQUEST] Set GRN Search Param Details',

  LOAD_GRN_REASONS = '[GRN] Load Grn Reasons',
  LOAD_GRN_REASONS_SUCCESS = '[GRN] Load Grn Reasons Success',
  LOAD_GRN_REASONS_FAILURE = '[GRN] Load Grn Reasons Failure',

  LOAD_RESET = '[grn] LOAD_RESET',

  LOAD_GRN_FINAL_PRICE_DETAILS = '[GRN] Load Grn Final Price Details',
  LOAD_GRN_FINAL_PRICE_DETAILS_SUCCESS = '[GRN] Load Grn Final Price Details Success',
  LOAD_GRN_FINAL_PRICE_DETAILS_FAILURE = '[GRN] Load Grn Final Price Details Failure',

  LOAD_COLLECTED_TCS_AMOUNT = '[GRN] Load TCS Collected Amount',
  LOAD_COLLECTED_TCS_AMOUNT_SUCCESS = '[GRN] Load TCS Collected Amount Success',
  LOAD_COLLECTED_TCS_AMOUNT_FAILURE = '[GRN] Load TCS Collected Amount Failure',

  SET_FOC_DEDUCTION_VALUE = '[GRN] Set foc deduction Value'
}

export class SetFocDeductionValue implements Action {
  readonly type = GrnActionTypes.SET_FOC_DEDUCTION_VALUE;
  constructor(public payload: any) {}
}
export class FilterGrnReqStatusList implements Action {
  readonly type = GrnActionTypes.FILTER_GRN_REQ_STATUS_LIST;
  constructor(public payload: GrnReqStatusListPayload) {}
}

export class FilterGrnReqStatusListSuccess implements Action {
  readonly type = GrnActionTypes.FILTER_GRN_REQ_STATUS_LIST_SUCCESS;
  constructor(public payload: GrnReqStatusListResponse) {}
}

export class FilterGrnReqStatusListFailure implements Action {
  readonly type = GrnActionTypes.FILTER_GRN_REQ_STATUS_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadGrnHistoryDetails implements Action {
  readonly type = GrnActionTypes.LOAD_GRN_HISTORY_DETAILS;
  constructor(public payload: GrnHistoryPayload) {}
}

export class LoadGrnHistoryDetailsSuccess implements Action {
  readonly type = GrnActionTypes.LOAD_GRN_HISTORY_DETAILS_SUCCESS;
  constructor(public payload: GrnHistoryResponse) {}
}

export class LoadGrnHistoryDetailsFailure implements Action {
  readonly type = GrnActionTypes.LOAD_GRN_HISTORY_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SetHistorySearchParamDetails implements Action {
  readonly type = GrnActionTypes.SET_HISTORY_SEARCH_PARAM_DETAILS;
  constructor(readonly payload: GrnHistoryPayload) {}
}

export class LoadReset implements Action {
  readonly type = GrnActionTypes.LOAD_RESET;
}

export class ConfirmGrnWithOutApproval implements Action {
  readonly type = GrnActionTypes.CONFIRM_GRN_WITHOUT_APPROVAL;
  constructor(public payload: ConfirmGrnWithOutApprovalPayload) {}
}

export class ConfirmGrnWithOutApprovalSuccess implements Action {
  readonly type = GrnActionTypes.CONFIRM_GRN_WITHOUT_APPROVAL_SUCCESS;
  constructor(public payload: ConfirmGrnSuccessPayload) {}
}

export class ConfirmGrnWithOutApprovalFailure implements Action {
  readonly type = GrnActionTypes.CONFIRM_GRN_WITHOUT_APPROVAL_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SendForApproval implements Action {
  readonly type = GrnActionTypes.SEND_FOR_APPROVAL;
  constructor(public payload: SendForApprovalPayload) {}
}

export class SendForApprovalSuccess implements Action {
  readonly type = GrnActionTypes.SEND_FOR_APPROVAL_SUCCESS;
  constructor(public payload: GrnSendForAprovalSuccess) {}
}

export class SendForApprovalFailure implements Action {
  readonly type = GrnActionTypes.SEND_FOR_APPROVAL_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ConfirmGrn implements Action {
  readonly type = GrnActionTypes.CONFIRM_GRN;
  constructor(public payload: ConfirmGrnPayload) {}
}

export class ConfirmGrnSuccess implements Action {
  readonly type = GrnActionTypes.CONFIRM_GRN_SUCCESS;
  constructor(public payload: ConfirmGrnSuccessPayload) {}
}

export class ConfirmGrnFailure implements Action {
  readonly type = GrnActionTypes.CONFIRM_GRN_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadGrnDetailsById implements Action {
  readonly type = GrnActionTypes.LOAD_GRN_DETAILS_BY_ID;
  constructor(public payload: { grnId: string; creditNoteType?: string }) {}
}

export class LoadGrnDetailsByIdSuccess implements Action {
  readonly type = GrnActionTypes.LOAD_GRN_DETAILS_BY_ID_SUCCESS;
  constructor(public payload: GrnReqDetails) {}
}

export class LoadGrnDetailsByIdFailure implements Action {
  readonly type = GrnActionTypes.LOAD_GRN_DETAILS_BY_ID_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadGrnReqStatusList implements Action {
  readonly type = GrnActionTypes.LOAD_GRN_REQ_STATUS_LIST;
  constructor(public payload: GrnReqStatusListPayload) {}
}

export class LoadGrnReqStatusListSuccess implements Action {
  readonly type = GrnActionTypes.LOAD_GRN_REQ_STATUS_LIST_SUCCESS;
  constructor(public payload: GrnReqStatusListResponse) {}
}

export class LoadGrnReqStatusListFailure implements Action {
  readonly type = GrnActionTypes.LOAD_GRN_REQ_STATUS_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchGrn implements Action {
  readonly type = GrnActionTypes.SEARCH_GRN;
  constructor(public payload: GrnReqStatusListPayload) {}
}

export class SearchGrnSuccess implements Action {
  readonly type = GrnActionTypes.SEARCH_GRN_SUCCESS;
  constructor(public payload: GrnReqStatusListResponse) {}
}

export class SearchGrnFailure implements Action {
  readonly type = GrnActionTypes.SEARCH_GRN_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class InitiateGrn implements Action {
  readonly type = GrnActionTypes.INITIATE_GRN;
  constructor(readonly payload: GrnInitPayload) {}
}

export class InitiateGrnSuccess implements Action {
  readonly type = GrnActionTypes.INITIATE_GRN_SUCCESS;
  constructor(readonly payload: GrnInitResponse) {}
}

export class InitiateGrnFailure implements Action {
  readonly type = GrnActionTypes.INITIATE_GRN_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadItem implements Action {
  readonly type = GrnActionTypes.LOAD_ITEM;
  constructor(readonly payload: ItemDetailsPayload) {}
}

export class LoadItemSuccess implements Action {
  readonly type = GrnActionTypes.LOAD_ITEM_SUCCESS;
  constructor(readonly payload: GrnProductDetails) {}
}

export class LoadItemFailure implements Action {
  readonly type = GrnActionTypes.LOAD_ITEM_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class GetLocationCodes implements Action {
  readonly type = GrnActionTypes.GET_LOCATIONS;

}

export class GetLocationCodesSuccess implements Action {
  readonly type = GrnActionTypes.GET_LOCATIONS_SUCCESS;
  constructor(public payload: any) {}
}

export class GetLocationCodesFailure implements Action {
  readonly type = GrnActionTypes.GET_LOCATIONS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class GetApprovers implements Action {
  readonly type = GrnActionTypes.LOAD_APPROVERS;
  constructor(public payload: GrnApproversPayload) {}
}

export class GetApproversSuccess implements Action {
  readonly type = GrnActionTypes.LOAD_APPROVERS_SUCCESS;
  constructor(public payload: GrnApproverSuccessList[]) {}
}

export class GetApproversFailure implements Action {
  readonly type = GrnActionTypes.LOAD_APPROVERS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadSummaryDetails implements Action {
  readonly type = GrnActionTypes.LOAD_GRN_SUMMARY_BAR_DETAILS;
  constructor(public count: number, public value: number) {}
}
export class LoadGrnReasons implements Action {
  readonly type = GrnActionTypes.LOAD_GRN_REASONS;
  constructor(public payload: string) {}
}
export class LoadGrnReasonsSucceess implements Action {
  readonly type = GrnActionTypes.LOAD_GRN_REASONS_SUCCESS;
  constructor(public payload: Lov[]) {}
}
export class LoadGrnReasonsFailure implements Action {
  readonly type = GrnActionTypes.LOAD_GRN_REASONS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadGrnItemPriceDetails implements Action {
  readonly type = GrnActionTypes.LOAD_GRN_FINAL_PRICE_DETAILS;
  constructor(public payload: GrnPriceDetailsPayload) {}
}

export class LoadGrnItemPriceDetailsSuccess implements Action {
  readonly type = GrnActionTypes.LOAD_GRN_FINAL_PRICE_DETAILS_SUCCESS;
  constructor(public payload: GrnPriceDetailsSuccess) {}
}

export class LoadGrnItemPriceDetailsFailure implements Action {
  readonly type = GrnActionTypes.LOAD_GRN_FINAL_PRICE_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadCollectedTcsAmount implements Action {
  readonly type = GrnActionTypes.LOAD_COLLECTED_TCS_AMOUNT;
  constructor(public id: string) {}
}

export class LoadCollectedTcsAmountSuccess implements Action {
  readonly type = GrnActionTypes.LOAD_COLLECTED_TCS_AMOUNT_SUCCESS;
  constructor(public payload: TcsCollectedResponse) {}
}

export class LoadCollectedTcsAmountFailure implements Action {
  readonly type = GrnActionTypes.LOAD_COLLECTED_TCS_AMOUNT_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export type GrnActions =
  | LoadGrnReqStatusList
  | LoadGrnReqStatusListSuccess
  | LoadGrnReqStatusListFailure
  | LoadGrnDetailsById
  | LoadGrnDetailsByIdSuccess
  | LoadGrnDetailsByIdFailure
  | ConfirmGrn
  | ConfirmGrnFailure
  | ConfirmGrnSuccess
  | SearchGrn
  | SearchGrnSuccess
  | SearchGrnFailure
  | InitiateGrn
  | InitiateGrnSuccess
  | InitiateGrnFailure
  | LoadItem
  | LoadItemSuccess
  | LoadItemFailure
  | ConfirmGrnWithOutApproval
  | ConfirmGrnWithOutApprovalSuccess
  | ConfirmGrnWithOutApprovalFailure
  | SendForApproval
  | SendForApprovalSuccess
  | SendForApprovalFailure
  | LoadReset
  | GetLocationCodes
  | GetLocationCodesSuccess
  | GetLocationCodesFailure
  | GetApprovers
  | GetApproversSuccess
  | GetApproversFailure
  | LoadSummaryDetails
  | LoadGrnHistoryDetails
  | LoadGrnHistoryDetailsSuccess
  | LoadGrnHistoryDetailsFailure
  | FilterGrnReqStatusList
  | FilterGrnReqStatusListSuccess
  | FilterGrnReqStatusListFailure
  | LoadGrnReasons
  | LoadGrnReasonsSucceess
  | LoadGrnReasonsFailure
  | LoadGrnItemPriceDetails
  | LoadGrnItemPriceDetailsSuccess
  | LoadGrnItemPriceDetailsFailure
  | LoadCollectedTcsAmount
  | LoadCollectedTcsAmountSuccess
  | LoadCollectedTcsAmountFailure
  | SetFocDeductionValue
  | SetHistorySearchParamDetails;