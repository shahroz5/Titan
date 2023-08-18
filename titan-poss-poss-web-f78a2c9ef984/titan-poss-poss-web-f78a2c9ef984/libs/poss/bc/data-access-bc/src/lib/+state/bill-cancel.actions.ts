import { Action } from '@ngrx/store';
import {
  CashMemoItemDetailsRequestPayload,
  CustomErrors,
  CashMemoDetailsRequestPayload,
  CashMemoDetailsResponse,
  CashMemoItemDetails,
  CmBillList,
  Lov,
  BillCancelPayload,
  CmBillListPayload,
  CancelResponse,
  ConfirmResponse,
  bcHistoryRequestPayload,
  bcHistoryResponse,
} from '@poss-web/shared/models';

export interface CancelTypePayload {
  refTxnId: string;
  subTxnType: string;
  txnType: string;
}

export enum BillCancelActionsTypes {
  RESET_DETAIL = '[BC] Reset Detail',
  RESET_LIST = '[BC] Reset List',
  RESET_HISTORY = '[BC] Reset History',
  GET_ITEM_FROM_CASH_MEMO = '[BC] Get Item from CM',
  GET_ITEM_FROM_CASH_MEMO_SUCCESS = '[BC] Get Item from CM Success',
  GET_ITEM_FROM_CASH_MEMO_FAILURE = '[BC] Get Item from CM Failure',
  SET_HISTORY_SEARCH_PARAM_DETAILS = '[GEP REQUEST] Set GEP Search Param Details',

  VIEW_CASH_MEMO = '[BC] View CM',
  VIEW_CASH_MEMO_SUCCESS = '[BC] View CM Success',
  VIEW_CASH_MEMO_FAILURE = '[BC] View CM Failure',

  CANCEL = '[BC]  Cancellation',
  CANCEL_SUCCESS = '[BC] Cancellation Success',
  CANCEL_FAILURE = '[BC]  Cancellation Failure',

  CONFIRM = '[BC] Confirmation',
  CONFIRM_SUCCESS = '[BC] Confirmation Success',
  CONFIRM_FAILURE = '[BC]   Confirmation  Failure',

  LOAD_CM_BILL_LIST = '[BC ] Load Cm Bill List',
  LOAD_CM_BILL_LIST_SUCCESS = '[BC ] Load Cm Bill List Success',
  LOAD_CM_BILL_LIST_FAILURE = '[BC ] Load Cm Bill List Failure',

  LOAD_REASON_FOR_CANCEL = '[BC ] Load Reason For Cancel',
  LOAD_REASON_FOR_CANCEL_SUCCESS = '[BC ] Load Reason For Cancel Success',
  LOAD_REASON_FOR_CANCEL_FAILURE = '[BC ] Load Reason For Cancel Failure',

  LOAD_RSO_DETAILS = '[BC] Load RSO Details',
  LOAD_RSO_DETAILS_SUCCESS = '[BC] Load RSO Details Success',
  LOAD_RSO_DETAILS_FAILURE = '[BC] Load RSO Details Failure',

  CANCEL_TYPE = '[BC] CANCEL TYPE ',
  CANCEL_TYPE_SUCCESS = '[BC] CANCEL TYPE Success',
  CANCEL_TYPE_FAILURE = '[BC] CANCEL TYPE  Failure',

  LOAD_BC_HISTORY = '[Regular BC History]  Load BC History',
  LOAD_BC_HISTORY_SUCCESS = '[BC History]  Load BC History Success',
  LOAD_BC_HISTORY_FAILURE = '[BC History]  Load BC History Failure',

  LOAD_ITEM_FROM_BC_HISTORY = '[BC History]  Load Item From BC History',
  LOAD_ITEM_FROM_BC_HISTORY_SUCCESS = '[BC History]  Load Item From BC History Success',
  LOAD_ITEM_FROM_BC_HISTORY_FAILURE = '[BC History]  Load Item From BC History Failure'
}

export class LoadItemFromBCHistory implements Action {
  readonly type = BillCancelActionsTypes.LOAD_ITEM_FROM_BC_HISTORY;
  constructor(readonly payload: bcHistoryRequestPayload) {}
}

export class LoadItemFromBCHistorysuccess implements Action {
  readonly type = BillCancelActionsTypes.LOAD_ITEM_FROM_BC_HISTORY_SUCCESS;
  constructor(readonly payload: bcHistoryResponse) {}
}

export class LoadItemFromBCHistoryFailure implements Action {
  readonly type = BillCancelActionsTypes.LOAD_ITEM_FROM_BC_HISTORY_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadBCHistory implements Action {
  readonly type = BillCancelActionsTypes.LOAD_BC_HISTORY;
  constructor(
    readonly payload: bcHistoryRequestPayload,
    readonly searchField?: string,
    readonly searchType?: string,
    readonly page?: number,
    readonly size?: number,
    readonly txnType?: string,
    readonly subTxnType?: string
  ) {}
}

export class LoadBCHistorySuccess implements Action {
  readonly type = BillCancelActionsTypes.LOAD_BC_HISTORY_SUCCESS;
  constructor(readonly payload: bcHistoryResponse) {}
}

export class LoadBCHistoryFailure implements Action {
  readonly type = BillCancelActionsTypes.LOAD_BC_HISTORY_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class GetItemfromCashMemo implements Action {
  readonly type = BillCancelActionsTypes.GET_ITEM_FROM_CASH_MEMO;
  constructor(readonly payload: CashMemoItemDetailsRequestPayload) {}
}

export class GetItemfromCashMemoSuccess implements Action {
  readonly type = BillCancelActionsTypes.GET_ITEM_FROM_CASH_MEMO_SUCCESS;
  constructor(readonly payload: CashMemoItemDetails) {}
}

export class GetItemfromCashMemoFailure implements Action {
  readonly type = BillCancelActionsTypes.GET_ITEM_FROM_CASH_MEMO_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class CancelRequest implements Action {
  readonly type = BillCancelActionsTypes.CANCEL;
  constructor(readonly payload: BillCancelPayload) {}
}

export class CancelRequestSuccess implements Action {
  readonly type = BillCancelActionsTypes.CANCEL_SUCCESS;
  constructor(readonly payload: CancelResponse) {}
}

export class CancelRequestFailure implements Action {
  readonly type = BillCancelActionsTypes.CANCEL_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class ConfirmRequest implements Action {
  readonly type = BillCancelActionsTypes.CONFIRM;
  constructor(readonly payload: BillCancelPayload) {}
}

export class ConfirmRequestSuccess implements Action {
  readonly type = BillCancelActionsTypes.CONFIRM_SUCCESS;
  constructor(readonly payload: ConfirmResponse) {}
}

export class ConfirmRequestFailure implements Action {
  readonly type = BillCancelActionsTypes.CONFIRM_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class ViewCashMemo implements Action {
  readonly type = BillCancelActionsTypes.VIEW_CASH_MEMO;
  constructor(readonly payload: CashMemoDetailsRequestPayload) {}
}

export class ViewCashMemoSuccess implements Action {
  readonly type = BillCancelActionsTypes.VIEW_CASH_MEMO_SUCCESS;
  constructor(readonly payload: CashMemoDetailsResponse) {}
}

export class ViewCashMemoFailure implements Action {
  readonly type = BillCancelActionsTypes.VIEW_CASH_MEMO_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadCmBillList implements Action {
  readonly type = BillCancelActionsTypes.LOAD_CM_BILL_LIST;
  constructor(readonly payload: CmBillListPayload) {}
}

export class LoadCmBillListSuccess implements Action {
  readonly type = BillCancelActionsTypes.LOAD_CM_BILL_LIST_SUCCESS;
  constructor(readonly payload: CmBillList[]) {}
}

export class LoadCmBillListFailure implements Action {
  readonly type = BillCancelActionsTypes.LOAD_CM_BILL_LIST_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadReasonForCancel implements Action {
  readonly type = BillCancelActionsTypes.LOAD_REASON_FOR_CANCEL;
  constructor(readonly payload: string) {}
}

export class LoadReasonForCancelSuccess implements Action {
  readonly type = BillCancelActionsTypes.LOAD_REASON_FOR_CANCEL_SUCCESS;
  constructor(readonly payload: Lov[]) {}
}

export class LoadReasonForCancelFailure implements Action {
  readonly type = BillCancelActionsTypes.LOAD_REASON_FOR_CANCEL_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadRSODetails implements Action {
  readonly type = BillCancelActionsTypes.LOAD_RSO_DETAILS;
  constructor(public payload: string) {}
}

export class LoadRSODetailsSuccess implements Action {
  readonly type = BillCancelActionsTypes.LOAD_RSO_DETAILS_SUCCESS;
  constructor(public payload: string[]) {}
}

export class LoadRSODetailsFailure implements Action {
  readonly type = BillCancelActionsTypes.LOAD_RSO_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetDetail implements Action {
  readonly type = BillCancelActionsTypes.RESET_DETAIL;
}

export class ResetList implements Action {
  readonly type = BillCancelActionsTypes.RESET_LIST;
}
export class ResetHistory implements Action {
  readonly type = BillCancelActionsTypes.RESET_HISTORY;
}
export class CancelType implements Action {
  readonly type = BillCancelActionsTypes.CANCEL_TYPE;
  constructor(readonly payload: CancelTypePayload) {}
}

export class CancelTypeSuccess implements Action {
  readonly type = BillCancelActionsTypes.CANCEL_TYPE_SUCCESS;
  constructor(readonly payload: any) {}
}
export class CancelTypeFailure implements Action {
  readonly type = BillCancelActionsTypes.CANCEL_TYPE_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class SetHistorySearchParamDetails implements Action {
  readonly type = BillCancelActionsTypes.SET_HISTORY_SEARCH_PARAM_DETAILS;
  constructor(readonly payload: bcHistoryRequestPayload) {}
}
export type BillCancelActions =
  | GetItemfromCashMemo
  | GetItemfromCashMemoFailure
  | GetItemfromCashMemoSuccess
  | ViewCashMemo
  | ViewCashMemoFailure
  | ViewCashMemoSuccess
  | ConfirmRequest
  | ConfirmRequestFailure
  | ConfirmRequestSuccess
  | CancelRequest
  | CancelRequestFailure
  | CancelRequestSuccess
  | LoadCmBillList
  | LoadCmBillListSuccess
  | LoadCmBillListFailure
  | LoadReasonForCancel
  | LoadReasonForCancelSuccess
  | LoadReasonForCancelFailure
  | LoadRSODetails
  | LoadRSODetailsSuccess
  | LoadRSODetailsFailure
  | ResetList
  | ResetDetail
  | CancelType
  | CancelTypeFailure
  | CancelTypeSuccess
  | LoadBCHistory
  | LoadBCHistorySuccess
  | LoadBCHistoryFailure
  | ResetHistory
  |SetHistorySearchParamDetails;
