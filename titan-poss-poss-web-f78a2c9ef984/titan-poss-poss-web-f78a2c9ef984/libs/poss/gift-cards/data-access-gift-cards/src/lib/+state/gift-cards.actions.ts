import { Action } from '@ngrx/store';
import {
  AddGiftCardItemPayload,
  CancellableCashMemoData,
  CashMemoMinimalDetail,
  CustomErrors,
  GcCashMemoCancelRequestBody,
  GcCashMemoCancelResponse,
  GcCashMemoDetailsRequest,
  GetAddedGiftCardItemResponse,
  GetCreatedGiftCardCmDetails,
  GetDeletedGiftCardItemResponse,
  GetGiftCardItemResponse,
  GetPartiallyUpdatedGcCmResponse,
  GetUpdatedGcCashMemoResponse,
  GiftCardItem,
  GiftCardsHistoryListItemsResponse,
  GiftCardsHistoryRequestPayload,
  PartiallyUpdateGcCmPayload,
  PartiallyUpdateGiftDetailsPayload,
  QCGCCardDetails,
  QCGCGetBalancePayload,
  RsoNameObject
} from '@poss-web/shared/models';

export enum GiftCardsActionTypes {
  SELECTED_RSO_NAME = '[Gift Cards] Selected RSO Names',
  SET_CARDS_TOTAL_AMOUNT = '[Gift Cards] Set Cards Total Amount',
  SET_GC_TOTAL_PAID_AMOUNT = '[Gift Cards] Set Gc Total Paid Amount',
  SET_CARDS_TOTAL_QTY = '[Gift Cards] Set Cards Total Qty',
  LOAD_CARDS_LIST = '[Gift Cards] Load Cards List',
  RESET_GIFT_CARDS_DATA = '[Gift Cards] RESET GIFT CARDS DATA',
  LOAD_GC_CPG_GROUP_DESCRIPTION = '[Gift Cards] Load Gc Cpg Group Description',
  LOAD_GC_CPG_GROUP_DESCRIPTION_SUCCESS = '[Gift Cards] Load Gc Cpg Group Description Success',
  LOAD_GC_CPG_GROUP_DESCRIPTION_FAILURE = '[Gift Cards] Load Gc Cpg Group Description Failure',
  CREATE_GC_CASH_MEMO = '[Gift Cards] Create Gc Cash Memo',
  CREATE_GC_CASH_MEMO_SUCCESS = '[Gift Cards] Create Gc Cash Memo Success',
  CREATE_GC_CASH_MEMO_FAILURE = '[Gift Cards] Create Gc Cash Memo Failure',
  PARTIALLY_UPDATE_GC_CASH_MEMO = '[Gift Cards] Partially Update Gc Cash Memo',
  PARTIALLY_UPDATE_GC_CASH_MEMO_SUCCESS = '[Gift Cards] Partially Update Gc Cash Memo Success',
  PARTIALLY_UPDATE_GC_CASH_MEMO_FAILURE = '[Gift Cards] Partially Update Gc Cash Memo Failure',
  ADD_GIFT_CARD_ITEM = '[Gift Cards] Add Gift Card Item',
  ADD_GIFT_CARD_ITEM_SUCCESS = '[Gift Cards] Add Gift Card Item Success',
  ADD_GIFT_CARD_ITEM_FAILURE = '[Gift Cards] Add Gift Card Item Failure',
  GET_ADDED_GIFT_CARD_ITEM = '[Gift Cards] Get Added Gift Card Item',
  GET_ADDED_GIFT_CARD_ITEM_SUCCESS = '[Gift Cards] Get Added Gift Card Item Success',
  GET_ADDED_GIFT_CARD_ITEM_FAILURE = '[Gift Cards] Get Added Gift Card Item Failure',
  DELETE_ADDED_GIFT_CARD_ITEM = '[Gift Cards] DELETE Added Gift Card Item',
  DELETE_ADDED_GIFT_CARD_ITEM_SUCCESS = '[Gift Cards] DELETE Added Gift Card Item Success',
  DELETE_ADDED_GIFT_CARD_ITEM_FAILURE = '[Gift Cards] DELETE Added Gift Card Item Failure',
  PARTIALLY_UPDATE_GIFT_CARD_ITEM = '[Gift Cards] Partially Added Gift Card Item',
  PARTIALLY_UPDATE_GIFT_CARD_ITEM_SUCCESS = '[Gift Cards] Partially Added Gift Card Item Success',
  PARTIALLY_UPDATE_GIFT_CARD_ITEM_FAILURE = '[Gift Cards] Partially Added Gift Card Item Failure',
  UPDATE_GC_CASH_MEMO = '[Gift Cards] Update Gc Cash Memo',
  UPDATE_GC_CASH_MEMO_SUCCESS = '[Gift Cards] Update Gc Cash Memo Success',
  UPDATE_GC_CASH_MEMO_FAILURE = '[Gift Cards] Update Gc Cash Memo Failure',
  LOAD_RSO_DETAILS = '[Gift Cards] Load Rso Details',
  LOAD_RSO_DETAILS_SUCCESS = '[Gift Cards] Load Rso Details Success',
  LOAD_RSO_DETAILS_FAILURE = '[Gift Cards] Load Rso Details Failure',
  PRINT_GC_CASH_MEMO = '[Gift Cards] Print Gc Cash Memo',
  PRINT_GC_CASH_MEMO_SUCCESS = '[Gift Cards] Print Gc Cash Memo Success',
  PRINT_GC_CASH_MEMO_FAILURE = '[Gift Cards] Print Gc Cash Memo Failure',
  LOAD_CASH_MEMO_BILLS_AVAILABLE_FOR_CANCELLATION = '[Gift Cards] Load Cash Memo Bills Available For Cancellation',
  LOAD_CASH_MEMO_BILLS_AVAILABLE_FOR_CANCELLATION_SUCCESS = '[Gift Cards] Load Cash Memo Bills Available For Cancellation Success',
  LOAD_CASH_MEMO_BILLS_AVAILABLE_FOR_CANCELLATION_FAILURE = '[Gift Cards] Load Cash Memo Bills Available For Cancellation Failure',
  LOAD_SELECTED_GC_CASH_MEMO_DETAILS = '[Gift Cards] Load Selected Gc Cash Memo Details',
  LOAD_SELECTED_GC_CASH_MEMO_DETAILS_SUCCESS = '[Gift Cards] Load Selected Gc Cash Memo Details Success',
  LOAD_SELECTED_GC_CASH_MEMO_DETAILS_FAILURE = '[Gift Cards] Load Selected Gc Cash Memo Details Failure',
  LOAD_CANCEL_GC_CASH_MEMO = '[Gift Cards] Load Cancel Gc Cash Memo',
  LOAD_CANCEL_GC_CASH_MEMO_SUCCESS = '[Gift Cards] Load Cancel Gc Cash Memo Success',
  LOAD_CANCEL_GC_CASH_MEMO_FAILURE = '[Gift Cards] Load Cancel Gc Cash Memo Failure',
  LOAD_GC_CANCELLATION_REASONS = '[Gift Cards] Load Gc Cancellation Reasons',
  LOAD_GC_CANCELLATION_REASONS_SUCCESS = '[Gift Cards] Load Gc Cancellation Reasons Success',
  LOAD_GC_CANCELLATION_REASONS_FAILURE = '[Gift Cards] Load Gc Cancellation Reasons Failure',
  LOAD_GC_BALANCE = '[Gift Cards] Load Gc Balance',
  LOAD_GC_BALANCE_SUCCESS = '[Gift Cards] Load Gc Balance Success',
  LOAD_GC_BALANCE_FAILURE = '[Gift Cards] Load Gc Balance Failure',
  SET_SELECTED_CANCELLATION_REASON = '[Gift Cards] Set Selected Cancellation Reason',
  SET_REMARKS = '[Gift Cards] Set Remarks',
  SET_ORDER_NUMBER = '[Gift Cards] Set Order Number',

  LOAD_GIFT_CARDS_HISTORY_LIST_ITEMS = '[Gift Cards] Load Gift Cards History List Items',
  LOAD_GIFT_CARDS_HISTORY_LIST_ITEMS_SUCCESS = '[Gift Cards] Load Gift Cards History List Items Success',
  LOAD_GIFT_CARDS_HISTORY_LIST_ITEMS_FAILURE = '[Gift Cards] Load Gift Cards History List Items Failure',

  RESET_HISTORY = '[Gift Cards] Reset History',
  UPDATE_HISTORY_SEARCH_PARAMETER = '[Gift Cards] Update history search parameter'
}

export class CreateGcCashMemo implements Action {
  readonly type = GiftCardsActionTypes.CREATE_GC_CASH_MEMO;
}

export class CreateGcCashMemoSuccess implements Action {
  readonly type = GiftCardsActionTypes.CREATE_GC_CASH_MEMO_SUCCESS;
  constructor(readonly payload: GetCreatedGiftCardCmDetails | null) {}
}

export class CreateGcCashMemoFailure implements Action {
  readonly type = GiftCardsActionTypes.CREATE_GC_CASH_MEMO_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class PartiallyUpdateGcCashMemo implements Action {
  readonly type = GiftCardsActionTypes.PARTIALLY_UPDATE_GC_CASH_MEMO;
  constructor(
    readonly cashMemoId: string,
    readonly requestBody: PartiallyUpdateGcCmPayload
  ) {}
}

export class PartiallyUpdateGcCashMemoSuccess implements Action {
  readonly type = GiftCardsActionTypes.PARTIALLY_UPDATE_GC_CASH_MEMO_SUCCESS;
  constructor(readonly payload: GetPartiallyUpdatedGcCmResponse | null) {}
}

export class PartiallyUpdateGcCashMemoFailure implements Action {
  readonly type = GiftCardsActionTypes.PARTIALLY_UPDATE_GC_CASH_MEMO_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class UpdateGcCashMemo implements Action {
  readonly type = GiftCardsActionTypes.UPDATE_GC_CASH_MEMO;
  constructor(
    readonly cashMemoId: string,
    readonly requestDetails: GcCashMemoDetailsRequest
  ) {}
}

export class UpdateGcCashMemoSuccess implements Action {
  readonly type = GiftCardsActionTypes.UPDATE_GC_CASH_MEMO_SUCCESS;
  constructor(readonly payload: GetUpdatedGcCashMemoResponse | null) {}
}

export class UpdateGcCashMemoFailure implements Action {
  readonly type = GiftCardsActionTypes.UPDATE_GC_CASH_MEMO_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class AddGiftCardItem implements Action {
  readonly type = GiftCardsActionTypes.ADD_GIFT_CARD_ITEM;
  constructor(
    readonly cashMemoId: string,
    readonly requestBody: AddGiftCardItemPayload
  ) {}
}

export class AddGiftCardItemSuccess implements Action {
  readonly type = GiftCardsActionTypes.ADD_GIFT_CARD_ITEM_SUCCESS;
  constructor(readonly payload: GetAddedGiftCardItemResponse | null) {}
}

export class AddGiftCardItemFailure implements Action {
  readonly type = GiftCardsActionTypes.ADD_GIFT_CARD_ITEM_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class GetAddedGiftCardItem implements Action {
  readonly type = GiftCardsActionTypes.GET_ADDED_GIFT_CARD_ITEM;
  constructor(readonly cashMemoId: string, readonly giftCardItemId: string) {}
}

export class GetAddedGiftCardItemSuccess implements Action {
  readonly type = GiftCardsActionTypes.GET_ADDED_GIFT_CARD_ITEM_SUCCESS;
  constructor(readonly payload: GetGiftCardItemResponse | null) {}
}

export class GetAddedGiftCardItemFailure implements Action {
  readonly type = GiftCardsActionTypes.GET_ADDED_GIFT_CARD_ITEM_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class DeleteAddedGiftCardItem implements Action {
  readonly type = GiftCardsActionTypes.DELETE_ADDED_GIFT_CARD_ITEM;
  constructor(readonly cashMemoId: string, readonly giftCardItemId: string) {}
}

export class DeleteAddedGiftCardItemSuccess implements Action {
  readonly type = GiftCardsActionTypes.DELETE_ADDED_GIFT_CARD_ITEM_SUCCESS;
  constructor(readonly payload: GetDeletedGiftCardItemResponse | null) {}
}

export class DeleteAddedGiftCardItemFailure implements Action {
  readonly type = GiftCardsActionTypes.DELETE_ADDED_GIFT_CARD_ITEM_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class PartiallyUpdateGiftCardItem implements Action {
  readonly type = GiftCardsActionTypes.PARTIALLY_UPDATE_GIFT_CARD_ITEM;
  constructor(
    readonly cashMemoId: string,
    readonly giftCardItemId: string,
    readonly requestBody: PartiallyUpdateGiftDetailsPayload
  ) {}
}

export class PartiallyUpdateGiftCardItemSuccess implements Action {
  readonly type = GiftCardsActionTypes.PARTIALLY_UPDATE_GIFT_CARD_ITEM_SUCCESS;
  constructor(readonly payload: GetAddedGiftCardItemResponse | null) {}
}

export class PartiallyUpdateGiftCardItemFailure implements Action {
  readonly type = GiftCardsActionTypes.PARTIALLY_UPDATE_GIFT_CARD_ITEM_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadRSODetails implements Action {
  readonly type = GiftCardsActionTypes.LOAD_RSO_DETAILS;
  constructor(public payload: string) {}
}

export class LoadRSODetailsSuccess implements Action {
  readonly type = GiftCardsActionTypes.LOAD_RSO_DETAILS_SUCCESS;
  constructor(public payload: RsoNameObject[]) {}
}

export class LoadRSODetailsFailure implements Action {
  readonly type = GiftCardsActionTypes.LOAD_RSO_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class PrintGcCashMemo implements Action {
  readonly type = GiftCardsActionTypes.PRINT_GC_CASH_MEMO;
}

export class PrintGcCashMemoSuccess implements Action {
  readonly type = GiftCardsActionTypes.PRINT_GC_CASH_MEMO_SUCCESS;
  constructor(public payload: any) {}
}

export class PrintGcCashMemoFailure implements Action {
  readonly type = GiftCardsActionTypes.PRINT_GC_CASH_MEMO_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadCashMemoBillsAvailableForCancellation implements Action {
  readonly type =
    GiftCardsActionTypes.LOAD_CASH_MEMO_BILLS_AVAILABLE_FOR_CANCELLATION;
  constructor(readonly mobileNumber: string, readonly cmNumber: number) {}
}

export class LoadCashMemoBillsAvailableForCancellationSuccess
  implements Action {
  readonly type =
    GiftCardsActionTypes.LOAD_CASH_MEMO_BILLS_AVAILABLE_FOR_CANCELLATION_SUCCESS;
  constructor(readonly payload: CancellableCashMemoData[]) {}
}

export class LoadCashMemoBillsAvailableForCancellationFailure
  implements Action {
  readonly type =
    GiftCardsActionTypes.LOAD_CASH_MEMO_BILLS_AVAILABLE_FOR_CANCELLATION_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadGcCancellationReasons implements Action {
  readonly type = GiftCardsActionTypes.LOAD_GC_CANCELLATION_REASONS;
}

export class LoadGcCancellationReasonsSuccess implements Action {
  readonly type = GiftCardsActionTypes.LOAD_GC_CANCELLATION_REASONS_SUCCESS;
  constructor(readonly payload: string[]) {}
}

export class LoadGcCancellationReasonsFailure implements Action {
  readonly type = GiftCardsActionTypes.LOAD_GC_CANCELLATION_REASONS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class SetSelectedCancellationReason implements Action {
  readonly type = GiftCardsActionTypes.SET_SELECTED_CANCELLATION_REASON;
  constructor(readonly payload: string) {}
}

export class LoadSelectedGcCashMemoDetails implements Action {
  readonly type = GiftCardsActionTypes.LOAD_SELECTED_GC_CASH_MEMO_DETAILS;
  constructor(readonly payload: string) {}
}

export class LoadSelectedGcCashMemoDetailsSuccess implements Action {
  readonly type =
    GiftCardsActionTypes.LOAD_SELECTED_GC_CASH_MEMO_DETAILS_SUCCESS;
  constructor(readonly payload: CashMemoMinimalDetail) {}
}

export class LoadSelectedGcCashMemoDetailsFailure implements Action {
  readonly type =
    GiftCardsActionTypes.LOAD_SELECTED_GC_CASH_MEMO_DETAILS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadCancelGcCashMemo implements Action {
  readonly type = GiftCardsActionTypes.LOAD_CANCEL_GC_CASH_MEMO;
  constructor(readonly payload: GcCashMemoCancelRequestBody) {}
}

export class LoadCancelGcCashMemoSuccess implements Action {
  readonly type = GiftCardsActionTypes.LOAD_CANCEL_GC_CASH_MEMO_SUCCESS;
  constructor(public payload: GcCashMemoCancelResponse) {}
}

export class LoadCancelGcCashMemoFailure implements Action {
  readonly type = GiftCardsActionTypes.LOAD_CANCEL_GC_CASH_MEMO_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadGcBalance implements Action {
  readonly type = GiftCardsActionTypes.LOAD_GC_BALANCE;
  constructor(readonly payload: QCGCGetBalancePayload) {}
}

export class LoadGcBalanceSuccess implements Action {
  readonly type = GiftCardsActionTypes.LOAD_GC_BALANCE_SUCCESS;
  constructor(readonly payload: QCGCCardDetails) {}
}

export class LoadGcBalanceFailure implements Action {
  readonly type = GiftCardsActionTypes.LOAD_GC_BALANCE_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class SetSelectedRSOName implements Action {
  readonly type = GiftCardsActionTypes.SELECTED_RSO_NAME;
  constructor(readonly payload: { value: string; description: string }) {}
}

export class SetCardsTotalAmount implements Action {
  readonly type = GiftCardsActionTypes.SET_CARDS_TOTAL_AMOUNT;
  constructor(readonly payload: number) {}
}

export class SetGcTotalPaidAmount implements Action {
  readonly type = GiftCardsActionTypes.SET_GC_TOTAL_PAID_AMOUNT;
  constructor(readonly payload: number) {}
}

export class SetCardsTotalQty implements Action {
  readonly type = GiftCardsActionTypes.SET_CARDS_TOTAL_QTY;
  constructor(readonly payload: number) {}
}

export class LoadCardsList implements Action {
  readonly type = GiftCardsActionTypes.LOAD_CARDS_LIST;
  constructor(readonly payload: GiftCardItem[]) {}
}

export class ResetGiftCardsData implements Action {
  readonly type = GiftCardsActionTypes.RESET_GIFT_CARDS_DATA;
}

export class SetRemarks implements Action {
  readonly type = GiftCardsActionTypes.SET_REMARKS;
  constructor(readonly payload: string) {}
}

export class SetOrderNumber implements Action {
  readonly type = GiftCardsActionTypes.SET_ORDER_NUMBER;
  constructor(public payload: number, public status: string) {}
}

export class LoadGiftCardsHistoryListItems implements Action {
  readonly type = GiftCardsActionTypes.LOAD_GIFT_CARDS_HISTORY_LIST_ITEMS;
  constructor(readonly payload: GiftCardsHistoryRequestPayload) {}
}

export class LoadGiftCardsHistoryListItemsSuccess implements Action {
  readonly type =
    GiftCardsActionTypes.LOAD_GIFT_CARDS_HISTORY_LIST_ITEMS_SUCCESS;
  constructor(readonly payload: GiftCardsHistoryListItemsResponse) {}
}

export class LoadGiftCardsHistoryListItemsFailure implements Action {
  readonly type =
    GiftCardsActionTypes.LOAD_GIFT_CARDS_HISTORY_LIST_ITEMS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class ResetHistory implements Action {
  readonly type = GiftCardsActionTypes.RESET_HISTORY;
}
export class UpdateHistorySearchParameter implements Action {
  readonly type = GiftCardsActionTypes.UPDATE_HISTORY_SEARCH_PARAMETER;
  constructor(readonly payload: GiftCardsHistoryRequestPayload) {}
}

export type GiftCardsActions =
  | CreateGcCashMemo
  | CreateGcCashMemoSuccess
  | CreateGcCashMemoFailure
  | PartiallyUpdateGcCashMemo
  | PartiallyUpdateGcCashMemoSuccess
  | PartiallyUpdateGcCashMemoFailure
  | AddGiftCardItem
  | AddGiftCardItemSuccess
  | AddGiftCardItemFailure
  | GetAddedGiftCardItem
  | GetAddedGiftCardItemSuccess
  | GetAddedGiftCardItemFailure
  | DeleteAddedGiftCardItem
  | DeleteAddedGiftCardItemSuccess
  | DeleteAddedGiftCardItemFailure
  | PartiallyUpdateGiftCardItem
  | PartiallyUpdateGiftCardItemSuccess
  | PartiallyUpdateGiftCardItemFailure
  | UpdateGcCashMemo
  | UpdateGcCashMemoSuccess
  | UpdateGcCashMemoFailure
  | LoadRSODetails
  | LoadRSODetailsSuccess
  | LoadRSODetailsFailure
  | PrintGcCashMemo
  | PrintGcCashMemoSuccess
  | PrintGcCashMemoFailure
  | LoadCashMemoBillsAvailableForCancellation
  | LoadCashMemoBillsAvailableForCancellationSuccess
  | LoadCashMemoBillsAvailableForCancellationFailure
  | LoadGcCancellationReasons
  | LoadGcCancellationReasonsSuccess
  | LoadGcCancellationReasonsFailure
  | SetSelectedCancellationReason
  | LoadSelectedGcCashMemoDetails
  | LoadSelectedGcCashMemoDetailsSuccess
  | LoadSelectedGcCashMemoDetailsFailure
  | LoadCancelGcCashMemo
  | LoadCancelGcCashMemoSuccess
  | LoadCancelGcCashMemoFailure
  | SetSelectedRSOName
  | SetCardsTotalAmount
  | SetGcTotalPaidAmount
  | SetCardsTotalQty
  | LoadCardsList
  | ResetGiftCardsData
  | SetRemarks
  | SetOrderNumber
  | LoadGcBalance
  | LoadGcBalanceSuccess
  | LoadGcBalanceFailure
  | LoadGiftCardsHistoryListItems
  | LoadGiftCardsHistoryListItemsSuccess
  | LoadGiftCardsHistoryListItemsFailure
  | ResetHistory
  | UpdateHistorySearchParameter;
