import { Action } from '@ngrx/store';
import {
  ItemSummary,
  CustomErrors,
  OtherReceiptsDataModel,
  OtherReceiptsModel,
  BinCode,
  Lov,
  OtherReceiptItem,
  AdjustmentItem,
  ProductCategory,
  ProductGroup,
  Filter,
  Column,
  LoadOtherReceiptsSTNCountPayload,
  OtherReceiptLoadListItemsPayload,
  OtherReceiptSearchPendingPayload,
  OtherReceiptUpdateAllItemsPayload,
  OtherReceiptStockPayLoad,
  OtherReceiptLoadItemsTotalCountPayload,
  OtherReceiptLoadItemsTotalCountSuccessPayload,
  OtherReceiptLoadItemsPayload,
  OtherReceiptUpdateItemFailurePayload,
  OtherReceiptUpdateItemPayload,
  ConfirmOtherReceivePayload,
  SearchCartItemAdjustmentPayload,
  OtherReceiptConfirmAdjustmentItemsPayload,
  OtherReceiptAdjustmentSearchPayload,
  OtherReceiptUpdateAdjustementItemPayload,
  OtherReceiptItemValidate,
  LoadOtherReceiptsHistoryPayload,
  LoadOtherReceiptsHistoryItemsPayload,
  ImageReqPayload,
  ImageResponse,
  PrintOtherReceivePayload
} from '@poss-web/shared/models';

export enum OtherReceiptsActionTypes {
  SEARCH_CLEAR = '[ Other-Receipts ] search-clear',

  RESET_RECEIPTS_LIST_DATA = '[ Other-Receipts ] Reset Receipts Data',
  LOAD_RECEIPTS_STN_COUNT = '[Other-Receipts-STNCount] Load Receipts STNCount',
  LOAD_RECEIPTS_STN_COUNT_SUCCESS = '[Other-Receipts-STNCount] Load Receipts STNCount Success',
  LOAD_RECEIPTS_STN_COUNT_FAILURE = '[Other-Receipts-STNCount] Load Rceipts STNCount Failure',

  LOAD_RECEIPT_LIST = '[Other-Receipts-Issues-List] Load Receipt List',
  LOAD_RECEIPT_LIST_SUCCESS = '[Other-Receipts-Issues-List] Load Receipt List Success',
  LOAD_RECEIPT_LIST_FAILURE = '[Other-Receipts-Issues-List] Load Receipt Failure',

  LOAD_STUDDED_PRODUCT_GROUPS = '[InOther-Rceipts-Details ]  Load Studded Product Groups ',
  LOAD_STUDDED_PRODUCT_GROUPS_SUCCESS = '[InOther-Rceipts-Details ]  Load Studded Product Groups Success ',
  LOAD_STUDDED_PRODUCT_GROUPS_FAILURE = '[InOther-Rceipts-Details ]  Load Studded Product Groups Failure ',

  LOAD_RECEIPT_LOAN_LIST = '[Other-Receipts-Issues-List] Load Receipt Loan List',
  LOAD_RECEIPT_LOAN_LIST_SUCCESS = '[Other-Receipts-Issues-List] Load Receipt Loan List Success',
  LOAD_RECEIPT_LOAN_LIST_FAILURE = '[Other-Receipts-Issues-List] Load Receipt Loan Failure',

  SEARCH_PENDING_RECEIPTS = '[ Other-Receipts-Issues-List ] Search Pending Receipts Stocks',
  SEARCH_PENDING_RECEIPTS_SUCCESS = '[Other-Receipts-Issues-List ]Search Pending Receipts Success',
  SEARCH_PENDING_RECEIPTS_FAILURE = '[Other-Receipts-Issues-List ] Search Pending Receipts Failure',

  ASSIGN_BIN_ALL_ITEMS = '[ InOther-Rceipts-Details ] Assign bin to all items ',
  ASSIGN_BIN_ALL_ITEMS_SUCCESS = '[ InOther-Rceipts-Details ]  Assign bin to all items Success ',
  ASSIGN_BIN_ALL_ITEMS_FAILURE = '[ InOther-Rceipts-Details ] Assign bin to all items Failure ',

  PRINT_OTHER_RECIVES = '[Other-Receive] Print Other Receive',
  PRINT_OTHER_RECIVES_SUCCESS = '[Other-Receive] Print Other Receive Success',
  PRINT_OTHER_RECIVES_FAILURE = '[Other-Receive] Print Other Receive Failure',

  LOAD_BIN_CODES = '[ InOther-Rceipts-Details ] Load all bins ',
  LOAD_BIN_CODES_SUCCESS = '[ InOther-Rceipts-Details ] Load all bins Success ',
  LOAD_BIN_CODES_FAILURE = '[ InOther-Rceipts-Details ]  Load all bins Failure ',

  LOAD_REMARKS = '[ InOther-Rceipts-Details ] Load all Remarks ',
  LOAD_REMARKS_SUCCESS = '[ InOther-Rceipts-Details ] Load all Remarks Success ',
  LOAD_REMARKS_FAILURE = '[ InOther-Rceipts-Details ]  Load all Remarks Failure ',

  LOAD_SELECTED_STOCK = '[ InOther-Rceipts-Details ] Load selected stock ',
  LOAD_SELECTED_STOCK_SUCCESS = '[ InOther-Rceipts-Details ] Load selected stock Success',
  LOAD_SELECTED_STOCK_FAILURE = '[ InOther-Rceipts-Details ] Load selected stock Failure',

  LOAD_ItEMS_COUNT = '[ InOther-Rceipts-Details ] Load items Count ',
  LOAD_ItEMS_COUNT_SUCCESS = '[ InOther-Rceipts-Details ] Load items Count Success ',
  LOAD_ItEMS_COUNT_FAILURE = '[ InOther-Rceipts-Details ] Load items Count Failure ',

  LOAD_NON_VERIFIED_ITEMS = '[ InOther-Rceipts-Details ] Load non-verified Items ',
  LOAD_NON_VERIFIED_ITEMS_SUCCESS = '[ InOther-Rceipts-Details ] Load non-verified  Success ',
  LOAD_NON_VERIFIED_ITEMS_FAILURE = '[ InOther-Rceipts-Details ] Load non-verified Failure ',

  LOAD_VERIFIED_ITEMS = '[ InOther-Rceipts-Details ] Load verified Items ',
  LOAD_VERIFIED_ITEMS_SUCCESS = '[ InOther-Rceipts-Details ] Load verified  Success ',
  LOAD_VERIFIED_ITEMS_FAILURE = '[ InOther-Rceipts-Details ] Load verified Failure ',

  VERIFY_ITEM = '[ InOther-Rceipts-Details ] Verify item ',
  VERIFY_ITEM_SUCCESS = '[ InOther-Rceipts-Details ]  Verify item Success ',
  VERIFY_ITEM_FAILURE = '[ InOther-Rceipts-Details ]  Verify item Failure ',

  UPADTE_ITEM = '[ InOther-Rceipts-Details ] Update item ',
  UPADTE_ITEM_SUCCESS = '[ InOther-Rceipts-Details ]  Update item Success ',
  UPADTE_ITEM_FAILURE = '[ InOther-Rceipts-Details ]  Update item Failure ',

  VALIDATE_NON_VERIFIED_ITEM = '[ Other-Receipts ] Validate Non  Verified item ',
  VALIDATE_NON_VERIFIED_ITEM_SUCCESS = '[ Other-Receipts ]  Validate Non Verified item Success ',
  VALIDATE_NON_VERIFIED_ITEM_FAILURE = '[ Other-Receipts ]  Validate Non Verified item Failure ',

  VALIDATE_VERIFIED_ITEM = '[ Other-Receipts ] Validate  Verified item ',
  VALIDATE_VERIFIED_ITEM_SUCCESS = '[ Other-Receipts ]  Validate  Verified item Success ',
  VALIDATE_VERIFIED_ITEM_FAILURE = '[ Other-Receipts ]  Validate  Verified item Failure ',

  VERIFY_ALL_ITEMS = '[ InOther-Rceipts-Details ] Verify all items',
  VERIFY_ALL_ITEMS_SUCCESS = '[ InOther-Rceipts-Details ] Verify all items Success ',
  VERIFY_ALL_ITEMS_FAILURE = '[ InOther-Rceipts-Details ] Verify all items Failure ',

  CONFIRM_STOCK_RECEIVE = '[inother-rceipts] Confirm Stock',
  CONFIRM_STOCK_RECEIVE_SUCCESS = '[inother-rceipts] Confirm STN Success',
  CONFIRM_STOCK_RECEIVE_FAILURE = '[inother-rceipts] Confirm STN Failure',
  DROPDOWN_SELECTED_FOR_RECEIPTS = '[ Other-Receipts ] Selected Dropdown for Receipt',

  ADJUSTMENT_SEARCH = '[ Other-Receipts ]Adjustment  Search',
  ADJUSTMENT_SEARCH_SUCCESS = '[ Other-Receipts ]Adjustment Search Success',
  ADJUSTMENT_SEARCH_FAILUREE = '[ Other-Receipts ]Adjustment Search Failure',
  ADD_ITEMS_TO_CART = '[Other-Receipts] Add Items To Cart',
  CONFIRM_ADJUSTEMENT_ITEMS = '[Other-Receipts] Confirm Adjustement Items',
  CONFIRM_ADJUSTEMENT_ITEMS_SUCCEESS = '[Other-Receipts] Confirm Adjustement Items_Success',
  CONFIRM_ADJUSTEMENT_ITEMS_FAILURE = '[Other-Receipts] Confirm Adjustement Items_Failure',
  REMOVE_ADJUSTEMENT_ITEM = '[Other-Receipts]Remove Adjustement Items',
  REMOVE_MULTIPLE_ADJUSTEMENT_ITEMs = '[Other-Receipts]Remove Multiple Adjustement Items',
  UPDATE_ADJUSTEMENT_ITEMS = '[Other-Receipts]Update Adjustement Items',
  CLEAR_ITEMS = '[other-rceipts] Clear Items',
  SEARCH_CART_ITEM_ADJUSTMENT = '[Other-Receipts-Create] Search Item Adjustment',
  CLEAR_SEARCH_CART_ITEM_ADJUSTMENT = '[Other-Receipts-Create] Clear Search Item Adjustment',
  RESET_ADJUSTMENT_DATA = '[Other-Receipts] Reset  ADJ Data',

  LOAD_RECEIPTS_ADJ_LIST = '[Other-Receipts-Issues-List] Load Receipts ADJ List',
  LOAD_RECEIPTS_ADJ_LIST_SUCCESS = '[Other-Receipts-Issues-List] Load Receipts ADJ List Success',
  LOAD_RECEIPTS_ADJ_LIST_FAILURE = '[Other-Receipts-Issues-List] Load Receipts ADJ List Failure',
  CLEAR_SEARCH_INVENTORY_ADJUSTMENT = '[Other-Receipts] Clear Search Inventory Adjustment',

  //psv
  PSV_SEARCH = '[ Other-Receipts ]PSV  Search',
  PSV_SEARCH_SUCCESS = '[ Other-Receipts ]PSV Search Success',
  PSV_SEARCH_FAILUREE = '[ Other-Receipts ]PSV Search Failure',
  PSV_ADD_ITEMS_TO_CART = '[Other-Receipts] Add Items To Cart PSV',
  CONFIRM_PSV_ITEMS = '[Other-Receipts] Confirm PSV Items',
  CONFIRM_PSV_ITEMS_SUCCEESS = '[Other-Receipts] Confirm PSV Items_Success',
  CONFIRM_PSV_ITEMS_FAILURE = '[Other-Receipts] Confirm PSV Items_Failure',
  REMOVE_PSV_ITEM = '[Other-Receipts]Remove PSV Items',
  REMOVE_MULTIPLE_PSV_ITEMs = '[Other-Receipts]Remove Multiple PSV Items',
  UPDATE_PSV_ITEMS = '[Other-Receipts]Update PSV Items',

  SEARCH_CART_ITEM_PSV = '[Other-Receipts-Create] Search Item PSV',
  CLEAR_SEARCH_CART_ITEM_PSV = '[Other-Receipts-Create] Clear Search Item PSV',

  RESET_PSV_DATA = '[Other-Receipts] Reset PSV Data',
  CLEAR_SEARCH_INVENTORY_PSV = '[Other-Receipts] Clear Search Inventory PSV',

  LOAD_PRODUCT_CATEGORIES = '[Other-Receipts] Load product categories',
  LOAD_PRODUCT_CATEGORIES_SUCCESS = '[Other-Receipts] Load product categories Success',
  LOAD_PRODUCT_CATEGORIES_FAILURE = '[Other-Receipts] Load product categories Failure',

  LOAD_PROUDCT_GROUPS = '[Other-Receipts] Load product groups',
  LOAD_PROUDCT_GROUPS_SUCCESS = '[Other-Receipts] Load product groups Success',
  LOAD_PROUDCT_GROUPS_FAILURE = '[Other-Receipts] Load product groups Failure',

  SET_FILTER_DATA_NON_VERIFIED_PRODUCTS = '[Other-Receipts] Set Filter Data Non Verified products',
  SET_FILTER_DATA_VERIFIED_PRODUCTS = '[Other-Receipts] Set Filter Data Verified Products',
  SET_SORT_DATA_NON_VERIFIED_PRODUCTS = '[Other-Receipts] Set Sort Data Non Verified Products',
  SET_SORT_DATA_VERIFIED_PRODUCTS = '[Other-Receipts] Set Sort Data Verified Products',

  LOAD_OTHER_RECEIPTS_HISTORY = '[Other-Rceipts History List] Load Other receipts history',
  LOAD_OTHER_RECEIPTS_HISTORY_SUCCESS = '[Other-RceiptsHistory List] Load Other receipts history Success',
  LOAD_OTHER_RECEIPTS_HISTORY_FAILURE = '[Other-Rceipts History List] Load Other receipts history Failure',

  RESET_OTHER_RECEIPTS_HISTORY = '[Other-Rceipts History List] Reset Other receipts History',

  LOAD_SELECTED_OTHER_RECEIPTS_HISTORY = 'Other-Rceipts History Details] Load Selected History',
  LOAD_SELECTED_OTHER_RECEIPTS_HISTORY_SUCCESS = '[Other-Rceipts History Details] Load Selected History Success',
  LOAD_SELECTED_OTHER_RECEIPTS_HISTORY_FAILURE = '[Other-Rceipts History Details] Load Selected History Failure',

  LOAD_OTHER_RECEIPTS_HISTORY_ITEMS = '[Other-Rceipts History Details] Load Selected History Items',
  LOAD_OTHER_RECEIPTS_HISTORY_ITEMS_SUCCESS = '[Other-Rceipts History Details] Load Selected History Items Success',
  LOAD_OTHER_RECEIPTS_HISTORY_ITEMS_FAILURE = '[Other-Rceipts History Details] Load Selected History Items Failure',

  CLEAR_OTHER_RECEIPTS_HISTORY_ITEMS = '[Other-Rceipts History Details] Clear Selected History Items',

  LOAD_OTHER_RECEIPTS_HISTORY_ITEMS_TOTAL_COUNT = '[Other-Rceipts History Details] Load Selected History Items TotalCount',
  LOAD_OTHER_RECEIPTS_HISTORY_ITEMS_TOTAL_COUNT_SUCCESS = '[Other-Rceipts History Details] Load Selected History Items Total Count Success',
  LOAD_OTHER_RECEIPTS_HISTORY_ITEMS_TOTAL_COUNT_FAILURE = '[Other-Rceipts History Details] Load Selected History Items Total Count Failure',

  // Image

  LOAD_THUMBNAIL_IMAGE_URL = '[ Other-Rceipts ] Load Thumbnail Image Url',
  LOAD_THUMBNAIL_IMAGE_URL_SUCCESS = '[ Other-Rceipts ] Load Thumbnail Image Url Success',
  LOAD_THUMBNAIL_IMAGE_URL_FAILURE = '[ Other-Rceipts ] Load Thumbnail Image Url Failure',

  LOAD_IMAGE_URL = '[ Other-Rceipts ] Load Image Url',
  LOAD_IMAGE_URL_SUCCESS = '[ Other-Rceipts ] Load Image Url Success',
  LOAD_IMAGE_URL_FAILURE = '[ Other-Rceipts ] Load Image Url Failure'
}
export class ResetReceiptsListData implements Action {
  readonly type = OtherReceiptsActionTypes.RESET_RECEIPTS_LIST_DATA;
}
export class LoadReceiptsSTNCount implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_RECEIPTS_STN_COUNT;
}

export class LoadReceiptsSTNCountSuccess implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_RECEIPTS_STN_COUNT_SUCCESS;
  constructor(public payload: LoadOtherReceiptsSTNCountPayload) {}
}

export class LoadReceiptsSTNCountFailure implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_RECEIPTS_STN_COUNT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadRecieptList implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_RECEIPT_LIST;
  constructor(public payload: OtherReceiptLoadListItemsPayload) {}
}

export class LoadRecieptListSuccess implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_RECEIPT_LIST_SUCCESS;
  constructor(public payload: OtherReceiptsDataModel) {}
}

export class LoadRecieptListFailure implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_RECEIPT_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class ClearItems implements Action {
  readonly type = OtherReceiptsActionTypes.CLEAR_ITEMS;
}

export class LoadRecieptLoanList implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_RECEIPT_LOAN_LIST;
  constructor(public payload: OtherReceiptLoadListItemsPayload) {}
}

export class LoadRecieptLoanListSuccess implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_RECEIPT_LOAN_LIST_SUCCESS;
  constructor(public payload: OtherReceiptsDataModel) {}
}

export class LoadRecieptLoanListFailure implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_RECEIPT_LOAN_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchPendingReceipts implements Action {
  readonly type = OtherReceiptsActionTypes.SEARCH_PENDING_RECEIPTS;
  constructor(public payload: OtherReceiptSearchPendingPayload) {}
}

export class SearchPendingReceiptsSuccess implements Action {
  readonly type = OtherReceiptsActionTypes.SEARCH_PENDING_RECEIPTS_SUCCESS;
  constructor(public payload: OtherReceiptsModel[]) {}
}
export class SearchPendingReceiptsFailure implements Action {
  readonly type = OtherReceiptsActionTypes.SEARCH_PENDING_RECEIPTS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchClear implements Action {
  readonly type = OtherReceiptsActionTypes.SEARCH_CLEAR;
}

export class AssignBinToAllItems implements Action {
  readonly type = OtherReceiptsActionTypes.ASSIGN_BIN_ALL_ITEMS;
  constructor(public payload: OtherReceiptUpdateAllItemsPayload) {}
}

export class AssignBinToAllItemsSuccess implements Action {
  readonly type = OtherReceiptsActionTypes.ASSIGN_BIN_ALL_ITEMS_SUCCESS;
  constructor(public payload: boolean) {}
}
export class AssignBinToAllItemsFailure implements Action {
  readonly type = OtherReceiptsActionTypes.ASSIGN_BIN_ALL_ITEMS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadBinCodes implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_BIN_CODES;
  constructor(public payload: string) {}
}

export class LoadBinCodesSuccess implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_BIN_CODES_SUCCESS;
  constructor(public payload: BinCode[]) {}
}
export class LoadBinCodesFailure implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_BIN_CODES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadRemarks implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_REMARKS;
}

export class LoadRemarksSuccess implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_REMARKS_SUCCESS;
  constructor(public payload: Lov[]) {}
}
export class LoadRemarksFailure implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_REMARKS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadSelectedStock implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_SELECTED_STOCK;
  constructor(public payload: OtherReceiptStockPayLoad) {}
}

export class LoadSelectedStockSuccess implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_SELECTED_STOCK_SUCCESS;
  constructor(public payload: OtherReceiptsModel) {}
}
export class LoadSelectedStockFailure implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_SELECTED_STOCK_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class PrintOtherReceives implements Action {
  readonly type = OtherReceiptsActionTypes.PRINT_OTHER_RECIVES;
  constructor(public payload: PrintOtherReceivePayload) {}
}

export class PrintOtherReceivesSuccess implements Action {
  readonly type = OtherReceiptsActionTypes.PRINT_OTHER_RECIVES_SUCCESS;
  constructor(public payload: any) {}
}

export class PrintOtherReceivesFailure implements Action {
  readonly type = OtherReceiptsActionTypes.PRINT_OTHER_RECIVES_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadItemsTotalCount implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_ItEMS_COUNT;
  constructor(public payload: OtherReceiptLoadItemsTotalCountPayload) {}
}

export class LoadItemsTotalCountSuccess implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_ItEMS_COUNT_SUCCESS;
  constructor(public payload: OtherReceiptLoadItemsTotalCountSuccessPayload) {}
}
export class LoadItemsTotalCountFailure implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_ItEMS_COUNT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadNonVerifiedItems implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_NON_VERIFIED_ITEMS;
  constructor(public payload: OtherReceiptLoadItemsPayload) {}
}

export class LoadNonVerifiedItemsSuccess implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_NON_VERIFIED_ITEMS_SUCCESS;
  constructor(public payload: { items: OtherReceiptItem[]; count: number }) {}
}
export class LoadNonVerifiedItemsFailure implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_NON_VERIFIED_ITEMS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadVerifiedItems implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_VERIFIED_ITEMS;
  constructor(public payload: OtherReceiptLoadItemsPayload) {}
}

export class LoadVerifiedItemsSuccess implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_VERIFIED_ITEMS_SUCCESS;
  constructor(public payload: { items: OtherReceiptItem[]; count: number }) {}
}
export class LoadVerifiedItemsFailure implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_VERIFIED_ITEMS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class VerifyItem implements Action {
  readonly type = OtherReceiptsActionTypes.VERIFY_ITEM;
  constructor(public payload: OtherReceiptUpdateItemPayload) {}
}

export class VerifyItemSuccess implements Action {
  readonly type = OtherReceiptsActionTypes.VERIFY_ITEM_SUCCESS;
  constructor(public payload: OtherReceiptItem) {}
}
export class VerifyItemFailure implements Action {
  readonly type = OtherReceiptsActionTypes.VERIFY_ITEM_FAILURE;
  constructor(public payload: OtherReceiptUpdateItemFailurePayload) {}
}

export class VerifyAllItems implements Action {
  readonly type = OtherReceiptsActionTypes.VERIFY_ALL_ITEMS;
  constructor(public payload: OtherReceiptUpdateAllItemsPayload) {}
}
export class ValidateNonVerifiedItem implements Action {
  readonly type = OtherReceiptsActionTypes.VALIDATE_NON_VERIFIED_ITEM;
  constructor(public payload: OtherReceiptItemValidate) {}
}

export class ValidateNonVerifiedItemSuccess implements Action {
  readonly type = OtherReceiptsActionTypes.VALIDATE_NON_VERIFIED_ITEM_SUCCESS;
  constructor(public payload: { itemId: string; isSuccess: boolean }) {}
}
export class ValidateNonVerifiedItemFailure implements Action {
  readonly type = OtherReceiptsActionTypes.VALIDATE_NON_VERIFIED_ITEM_FAILURE;
  constructor(public payload: { itemId: string; error: CustomErrors }) {}
}

export class ValidateVerifiedItem implements Action {
  readonly type = OtherReceiptsActionTypes.VALIDATE_VERIFIED_ITEM;
  constructor(public payload: OtherReceiptItemValidate) {}
}

export class ValidateVerifiedItemSuccess implements Action {
  readonly type = OtherReceiptsActionTypes.VALIDATE_VERIFIED_ITEM_SUCCESS;
  constructor(public payload: { itemId: string; isSuccess: boolean }) {}
}
export class ValidateVerifiedItemFailure implements Action {
  readonly type = OtherReceiptsActionTypes.VALIDATE_VERIFIED_ITEM_FAILURE;
  constructor(public payload: { itemId: string; error: CustomErrors }) {}
}

export class UpdateItem implements Action {
  readonly type = OtherReceiptsActionTypes.UPADTE_ITEM;
  constructor(public payload: OtherReceiptUpdateItemPayload) {}
}

export class UpdateItemSuccess implements Action {
  readonly type = OtherReceiptsActionTypes.UPADTE_ITEM_SUCCESS;
  constructor(public payload: OtherReceiptItem) {}
}
export class UpdateItemFailure implements Action {
  readonly type = OtherReceiptsActionTypes.UPADTE_ITEM_FAILURE;
  constructor(public payload: OtherReceiptUpdateItemFailurePayload) {}
}

export class ConfirmStockReceive implements Action {
  readonly type = OtherReceiptsActionTypes.CONFIRM_STOCK_RECEIVE;
  constructor(public payload: ConfirmOtherReceivePayload) {}
}

export class ConfirmStockReceiveSuccess implements Action {
  readonly type = OtherReceiptsActionTypes.CONFIRM_STOCK_RECEIVE_SUCCESS;
  constructor(public payload: any) {}
}
export class ConfirmStockReceiveFailure implements Action {
  readonly type = OtherReceiptsActionTypes.CONFIRM_STOCK_RECEIVE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class VerifyAllItemsSuccess implements Action {
  readonly type = OtherReceiptsActionTypes.VERIFY_ALL_ITEMS_SUCCESS;
  constructor(public payload: boolean) {}
}
export class VerifyAllItemsFailure implements Action {
  readonly type = OtherReceiptsActionTypes.VERIFY_ALL_ITEMS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class DropDownvalueForReceipts implements Action {
  readonly type = OtherReceiptsActionTypes.DROPDOWN_SELECTED_FOR_RECEIPTS;
  constructor(public payload: string) {}
}
export class AdjustmentSearch implements Action {
  readonly type = OtherReceiptsActionTypes.ADJUSTMENT_SEARCH;
  constructor(public payload: OtherReceiptAdjustmentSearchPayload) {}
}
export class AdjustmentSearchSuccess implements Action {
  readonly type = OtherReceiptsActionTypes.ADJUSTMENT_SEARCH_SUCCESS;
  constructor(public payload: ItemSummary) {}
}
export class AdjustmentSearchFailure implements Action {
  readonly type = OtherReceiptsActionTypes.ADJUSTMENT_SEARCH_FAILUREE;
  constructor(public payload: CustomErrors) {}
}
export class AddItemsToCart implements Action {
  readonly type = OtherReceiptsActionTypes.ADD_ITEMS_TO_CART;
  constructor(public payload: AdjustmentItem[]) {}
}
export class ConfirmAdjustementItems implements Action {
  readonly type = OtherReceiptsActionTypes.CONFIRM_ADJUSTEMENT_ITEMS;
  constructor(public payload: OtherReceiptConfirmAdjustmentItemsPayload) {}
}
export class ConfirmAdjustementItemsSuccess implements Action {
  readonly type = OtherReceiptsActionTypes.CONFIRM_ADJUSTEMENT_ITEMS_SUCCEESS;
  constructor(public payload: AdjustmentItem) {}
}
export class ConfirmAdjustementItemsFailure implements Action {
  readonly type = OtherReceiptsActionTypes.CONFIRM_ADJUSTEMENT_ITEMS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class RemoveAdjustementItem implements Action {
  readonly type = OtherReceiptsActionTypes.REMOVE_ADJUSTEMENT_ITEM;
  constructor(public payload: AdjustmentItem) {}
}
export class UpdateAdjustementItem implements Action {
  readonly type = OtherReceiptsActionTypes.UPDATE_ADJUSTEMENT_ITEMS;
  constructor(public payload: OtherReceiptUpdateAdjustementItemPayload) {}
}
export class RemoveMultipleAdjustementItems implements Action {
  readonly type = OtherReceiptsActionTypes.REMOVE_MULTIPLE_ADJUSTEMENT_ITEMs;
  constructor(public payload: any) {}
}
export class SearchCartItemsAdjustment implements Action {
  readonly type = OtherReceiptsActionTypes.SEARCH_CART_ITEM_ADJUSTMENT;
  constructor(public payload: SearchCartItemAdjustmentPayload) {}
}
export class ClearSearchCartItemAdjustment implements Action {
  readonly type = OtherReceiptsActionTypes.CLEAR_SEARCH_CART_ITEM_ADJUSTMENT;
}
export class LoadReceiptsADJList implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_RECEIPTS_ADJ_LIST;
  constructor(public payload: OtherReceiptLoadListItemsPayload) {}
}

export class LoadReceiptsADJListSuccess implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_RECEIPTS_ADJ_LIST_SUCCESS;
  constructor(public payload: OtherReceiptsDataModel) {}
}

export class LoadReceiptsADJListFailure implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_RECEIPTS_ADJ_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class ResetAdjustmentReceiptData implements Action {
  readonly type = OtherReceiptsActionTypes.RESET_ADJUSTMENT_DATA;
}
export class ClearSearchInventoryItemAdjustment implements Action {
  readonly type = OtherReceiptsActionTypes.CLEAR_SEARCH_INVENTORY_ADJUSTMENT;
}
//psv
export class PSVSearch implements Action {
  readonly type = OtherReceiptsActionTypes.PSV_SEARCH;
  constructor(public payload: OtherReceiptAdjustmentSearchPayload) {}
}
export class PSVSearchSuccess implements Action {
  readonly type = OtherReceiptsActionTypes.PSV_SEARCH_SUCCESS;
  constructor(public payload: ItemSummary) {}
}
export class PSVSearchFailure implements Action {
  readonly type = OtherReceiptsActionTypes.PSV_SEARCH_FAILUREE;
  constructor(public payload: CustomErrors) {}
}
export class AddItemsToCartPSV implements Action {
  readonly type = OtherReceiptsActionTypes.PSV_ADD_ITEMS_TO_CART;
  constructor(public payload: AdjustmentItem[]) {}
}
export class ConfirmPSVItems implements Action {
  readonly type = OtherReceiptsActionTypes.CONFIRM_PSV_ITEMS;
  constructor(public payload: OtherReceiptConfirmAdjustmentItemsPayload) {}
}
export class ConfirmPSVItemsSuccess implements Action {
  readonly type = OtherReceiptsActionTypes.CONFIRM_PSV_ITEMS_SUCCEESS;
  constructor(public payload: AdjustmentItem) {}
}
export class ConfirmPSVItemsFailure implements Action {
  readonly type = OtherReceiptsActionTypes.CONFIRM_PSV_ITEMS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class RemovePSVItem implements Action {
  readonly type = OtherReceiptsActionTypes.REMOVE_PSV_ITEM;
  constructor(public payload: AdjustmentItem) {}
}
export class UpdatePSVItem implements Action {
  readonly type = OtherReceiptsActionTypes.UPDATE_PSV_ITEMS;
  constructor(public payload: OtherReceiptUpdateAdjustementItemPayload) {}
}
export class RemoveMultiplePSVItems implements Action {
  readonly type = OtherReceiptsActionTypes.REMOVE_MULTIPLE_PSV_ITEMs;
  constructor(public payload: any) {}
}
export class SearchCartItemsPSV implements Action {
  readonly type = OtherReceiptsActionTypes.SEARCH_CART_ITEM_PSV;
  constructor(public payload: SearchCartItemAdjustmentPayload) {}
}
export class ClearSearchCartItemPSV implements Action {
  readonly type = OtherReceiptsActionTypes.CLEAR_SEARCH_CART_ITEM_PSV;
}
export class ResetPSVReceiptData implements Action {
  readonly type = OtherReceiptsActionTypes.RESET_PSV_DATA;
}
export class ClearSearchInventoryItemPSV implements Action {
  readonly type = OtherReceiptsActionTypes.CLEAR_SEARCH_INVENTORY_PSV;
}
export class LoadProductCategories implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_PRODUCT_CATEGORIES;
}

export class LoadProductCategoriesSuccess implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_PRODUCT_CATEGORIES_SUCCESS;
  constructor(public payload: ProductCategory[]) {}
}

export class LoadProductCategoriesFailure implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_PRODUCT_CATEGORIES_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadProductGroups implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_PROUDCT_GROUPS;
}

export class LoadProductGroupsSuccess implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_PROUDCT_GROUPS_SUCCESS;
  constructor(public payload: ProductGroup[]) {}
}

export class LoadProductGroupsFailure implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_PROUDCT_GROUPS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SetFilterDataNonVerifiedProducts implements Action {
  readonly type =
    OtherReceiptsActionTypes.SET_FILTER_DATA_NON_VERIFIED_PRODUCTS;
  constructor(public payload: { [key: string]: Filter[] }) {}
}
export class SetFilterDataVerifiedProducts implements Action {
  readonly type = OtherReceiptsActionTypes.SET_FILTER_DATA_VERIFIED_PRODUCTS;
  constructor(public payload: { [key: string]: Filter[] }) {}
}
export class SetSortDataNonVerifiedProducts implements Action {
  readonly type = OtherReceiptsActionTypes.SET_SORT_DATA_NON_VERIFIED_PRODUCTS;
  constructor(public payload: Column[]) {}
}
export class SetSortDataVerifiedProducts implements Action {
  readonly type = OtherReceiptsActionTypes.SET_SORT_DATA_VERIFIED_PRODUCTS;
  constructor(public payload: Column[]) {}
}
export class LoadOtherReceiptsHistory implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_OTHER_RECEIPTS_HISTORY;
  constructor(public payload: LoadOtherReceiptsHistoryPayload) {}
}
export class LoadOtherReceiptsHistorySuccess implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_OTHER_RECEIPTS_HISTORY_SUCCESS;
  constructor(public payload: OtherReceiptsDataModel) {}
}
export class LoadOtherReceiptsHistoryFailure implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_OTHER_RECEIPTS_HISTORY_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetOtherReceiptsHistory implements Action {
  readonly type = OtherReceiptsActionTypes.RESET_OTHER_RECEIPTS_HISTORY;
}

export class LoadSelectedHistory implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_SELECTED_OTHER_RECEIPTS_HISTORY;
  constructor(public payload: { id: number; transactionType: string }) {}
}
export class LoadSelectedHistorySuccess implements Action {
  readonly type =
    OtherReceiptsActionTypes.LOAD_SELECTED_OTHER_RECEIPTS_HISTORY_SUCCESS;
  constructor(public payload: OtherReceiptsModel) {}
}
export class LoadSelectedHistoryFailure implements Action {
  readonly type =
    OtherReceiptsActionTypes.LOAD_SELECTED_OTHER_RECEIPTS_HISTORY_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadSelectedHistoryItems implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_OTHER_RECEIPTS_HISTORY_ITEMS;
  constructor(public payload: LoadOtherReceiptsHistoryItemsPayload) {}
}
export class LoadSelectedHistoryItemsSuccess implements Action {
  readonly type =
    OtherReceiptsActionTypes.LOAD_OTHER_RECEIPTS_HISTORY_ITEMS_SUCCESS;
  constructor(public payload: { items: OtherReceiptItem[]; count: number }) {}
}
export class LoadSelectedHistoryItemsFailure implements Action {
  readonly type =
    OtherReceiptsActionTypes.LOAD_OTHER_RECEIPTS_HISTORY_ITEMS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ClearHistoryItems implements Action {
  readonly type = OtherReceiptsActionTypes.CLEAR_OTHER_RECEIPTS_HISTORY_ITEMS;
}
export class LoadSelectedHistoryItemsTotalCount implements Action {
  readonly type =
    OtherReceiptsActionTypes.LOAD_OTHER_RECEIPTS_HISTORY_ITEMS_TOTAL_COUNT;
  constructor(public payload: LoadOtherReceiptsHistoryItemsPayload) {}
}
export class LoadSelectedHistoryItemsTotalCountSuccess implements Action {
  readonly type =
    OtherReceiptsActionTypes.LOAD_OTHER_RECEIPTS_HISTORY_ITEMS_TOTAL_COUNT_SUCCESS;
  constructor(public payload: number) {}
}
export class LoadSelectedHistoryItemsTotalCountFailure implements Action {
  readonly type =
    OtherReceiptsActionTypes.LOAD_OTHER_RECEIPTS_HISTORY_ITEMS_TOTAL_COUNT_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadStuddedProductGroups implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_STUDDED_PRODUCT_GROUPS;
}
export class LoadStuddedProductGroupsSuccess implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_SUCCESS;
  constructor(public payload: string[]) {}
}
export class LoadStuddedProductGroupsFailure implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

// Image
export class LoadThumbnailImageUrl implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_THUMBNAIL_IMAGE_URL;
  constructor(public payload: ImageReqPayload) {}
}
export class LoadThumbnailImageUrlSuccess implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_THUMBNAIL_IMAGE_URL_SUCCESS;
  constructor(public payload: ImageResponse) {}
}
export class LoadThumbnailImageUrlFailure implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_THUMBNAIL_IMAGE_URL_FAILURE;
  constructor(public payload: ImageResponse) {}
}

export class LoadImageUrl implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_IMAGE_URL;
  constructor(public payload: ImageReqPayload) {}
}
export class LoadImageUrlSuccess implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_IMAGE_URL_SUCCESS;
  constructor(public payload: ImageResponse) {}
}
export class LoadImageUrlFailure implements Action {
  readonly type = OtherReceiptsActionTypes.LOAD_IMAGE_URL_FAILURE;
  constructor(public payload: ImageResponse) {}
}
export type OtherReceiptsActions =
  | LoadReceiptsSTNCount
  | LoadReceiptsSTNCountSuccess
  | LoadReceiptsSTNCountFailure
  | LoadRecieptList
  | LoadRecieptListSuccess
  | LoadRecieptListFailure
  | SearchPendingReceipts
  | SearchPendingReceiptsSuccess
  | SearchPendingReceiptsFailure
  | SearchClear
  | LoadItemsTotalCount
  | LoadItemsTotalCountSuccess
  | LoadItemsTotalCountFailure
  | LoadSelectedStock
  | LoadSelectedStockSuccess
  | LoadSelectedStockFailure
  | LoadNonVerifiedItems
  | LoadNonVerifiedItemsSuccess
  | LoadNonVerifiedItemsFailure
  | LoadVerifiedItems
  | LoadVerifiedItemsSuccess
  | LoadVerifiedItemsFailure
  | LoadBinCodes
  | LoadBinCodesSuccess
  | LoadBinCodesFailure
  | VerifyItem
  | VerifyItemSuccess
  | VerifyItemFailure
  | UpdateItem
  | UpdateItemSuccess
  | UpdateItemFailure
  | ConfirmStockReceive
  | ConfirmStockReceiveSuccess
  | ConfirmStockReceiveFailure
  | LoadRemarks
  | LoadRemarksSuccess
  | LoadRemarksFailure
  | VerifyAllItems
  | VerifyAllItemsSuccess
  | VerifyAllItemsFailure
  | AssignBinToAllItems
  | AssignBinToAllItemsSuccess
  | AssignBinToAllItemsFailure
  | LoadRecieptLoanList
  | LoadRecieptLoanListSuccess
  | LoadRecieptLoanListFailure
  | DropDownvalueForReceipts
  | AdjustmentSearch
  | AdjustmentSearchSuccess
  | AdjustmentSearchFailure
  | AddItemsToCart
  | ConfirmAdjustementItems
  | ConfirmAdjustementItemsSuccess
  | ConfirmAdjustementItemsFailure
  | RemoveAdjustementItem
  | UpdateAdjustementItem
  | RemoveMultipleAdjustementItems
  | SearchCartItemsAdjustment
  | ClearSearchCartItemAdjustment
  | LoadReceiptsADJList
  | LoadReceiptsADJListSuccess
  | LoadReceiptsADJListFailure
  | PSVSearch
  | PSVSearchSuccess
  | PSVSearchFailure
  | AddItemsToCartPSV
  | ConfirmPSVItems
  | ConfirmPSVItemsSuccess
  | ConfirmPSVItemsFailure
  | RemovePSVItem
  | UpdatePSVItem
  | RemoveMultiplePSVItems
  | SearchCartItemsPSV
  | ClearSearchCartItemPSV
  | ResetAdjustmentReceiptData
  | ResetPSVReceiptData
  | ClearSearchInventoryItemAdjustment
  | ClearSearchInventoryItemPSV
  | ResetReceiptsListData
  | LoadProductGroups
  | LoadProductGroupsSuccess
  | LoadProductGroupsFailure
  | LoadProductCategories
  | LoadProductCategoriesSuccess
  | LoadProductCategoriesFailure
  | SetFilterDataNonVerifiedProducts
  | SetFilterDataVerifiedProducts
  | SetSortDataNonVerifiedProducts
  | SetSortDataVerifiedProducts
  | ValidateNonVerifiedItem
  | ValidateNonVerifiedItemSuccess
  | ValidateNonVerifiedItemFailure
  | ValidateVerifiedItem
  | ValidateVerifiedItemSuccess
  | ValidateVerifiedItemFailure
  | LoadOtherReceiptsHistory
  | LoadOtherReceiptsHistorySuccess
  | LoadOtherReceiptsHistoryFailure
  | ResetOtherReceiptsHistory
  | LoadSelectedHistory
  | LoadSelectedHistorySuccess
  | LoadSelectedHistoryFailure
  | LoadSelectedHistoryItems
  | LoadSelectedHistoryItemsSuccess
  | LoadSelectedHistoryItemsFailure
  | ClearHistoryItems
  | LoadSelectedHistoryItemsTotalCount
  | LoadSelectedHistoryItemsTotalCountSuccess
  | LoadSelectedHistoryItemsTotalCountFailure
  | ClearItems
  | LoadStuddedProductGroups
  | LoadStuddedProductGroupsSuccess
  | LoadStuddedProductGroupsFailure
  | LoadImageUrl
  | LoadImageUrlSuccess
  | LoadImageUrlFailure
  | LoadThumbnailImageUrl
  | LoadThumbnailImageUrlSuccess
  | LoadThumbnailImageUrlFailure
  | PrintOtherReceives
  | PrintOtherReceivesSuccess
  | PrintOtherReceivesFailure;
