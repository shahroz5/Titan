import { Action } from '@ngrx/store';
import {
  OtherIssuesItem,
  CustomErrors,
  OtherIssuedataModel,
  OtherIssueModel,
  RequestOtherIssueStockTransferNote,
  OtherIssuesCreateStockResponse,
  ProductGroup,
  ProductCategory,
  Filter,
  Column,
  LoadOtherIssuesSTNCountPayload,
  AdjustmentSearchItemPayloadSuccess,
  LoadOtherIssuesItemPayload,
  OtherIssuesCreateStockResponsePayload,
  LoadAllOtherIssuePayload,
  LoadOtherIssueCreateItemsTotalCountPayload,
  LoadOtherIssueCreateItemsTotalCountSuccessPayload,
  AdjustmentSearchItemPayload,
  UpdateCartItemAdjustmentPayload,
  RemoveCartItemAdjustmentPayload,
  SearchCartItemAdjustmentPayload,
  PSVSearchItemPayload,
  PSVSearchItemPayloadSuccess,
  RemoveCartItemPSVPayload,
  SearchCartItemPSVPayload,
  PrintOtherIssuePayload,
  OtherIssueSearchPendingPayload,
  OtherIssueLoadSelectedPayload,
  OtherIssueLoadListItemsPayload,
  CreateOtherStockIssueItemsPayload,
  ConfirmOtherStockIssuePayload,
  ConfirmOtherStockIssueResponse,
  CreateOtherIssueStockRequestItemsPayload,
  RemoveOtherIssueStockRequestItemsPayload,
  UpdateStockRequestItemPayload,
  UpdateStockRequestPayload,
  CreateStockRequestPSVPayload,
  CreateStockRequestAdjustmentPayload,
  CancelOtherRequestPayload,
  LoadOtherIssueHistoryPayload,
  LoadOtherIssueHistoryItemsPayload,
  OtherReceiptsIssuesAdvanceFilterPayload,
  OtherIssuesHistoryItem
} from '@poss-web/shared/models';

export enum OtherIssuesActionTypes {
  SEARCH_CLEAR_ISSUE = '[ Other-Issues ] search-clear issue',

  RESET_ISSUE_LIST_DATA = '[ Other-Issues ] Reset Issue Data',
  LOAD_ISSUES_STN_COUNT = '[Other-Issues-STNCount] Load Issues STNCount',
  LOAD_ISSUES_STN_COUNT_SUCCESS = '[Other-Issues-STNCount] Load Issues STNCount Success',
  LOAD_ISSUES_STN_COUNT_FAILURE = '[Other-Issues-STNCount] Load Issues STNCount Failure',

  LOAD_RECEIPT_LIST = '[Other-Receipts-Issues-List] Load Receipt List',
  LOAD_RECEIPT_LIST_SUCCESS = '[Other-Receipts-Issues-List] Load Receipt List Success',
  LOAD_RECEIPT_LIST_FAILURE = '[Other-Receipts-Issues-List] Load Receipt Failure',

  LOAD_RECEIPT_LOAN_LIST = '[Other-Receipts-Issues-List] Load Receipt Loan List',
  LOAD_RECEIPT_LOAN_LIST_SUCCESS = '[Other-Receipts-Issues-List] Load Receipt Loan List Success',
  LOAD_RECEIPT_LOAN_LIST_FAILURE = '[Other-Receipts-Issues-List] Load Receipt Loan Failure',

  LOAD_ISSUE_LIST = '[Other-Receipts-Issues-List] Load Issue List',
  LOAD_ISSUE_LIST_SUCCESS = '[Other-Receipts-Issues-List] Load Issue List Success',
  LOAD_ISSUE_LIST_FAILURE = '[Other-Receipts-Issues-List] Load Issue List Failure',

  LOAD_ISSUE_LOAN_LIST = '[Other-Receipts-Issues-List] Load Issue Loan List',
  LOAD_ISSUE_LOAN_LIST_SUCCESS = '[Other-Receipts-Issues-List] Load Issue Loan List Success',
  LOAD_ISSUE_LOAN_LIST_FAILURE = '[Other-Receipts-Issues-List] Load Issue Loan List Failure',

  SEARCH_PENDING_RECEIPTS = '[ Other-Receipts-Issues-List ] Search Pending Receipts Stocks',
  SEARCH_PENDING_RECEIPTS_SUCCESS = '[Other-Receipts-Issues-List ]Search Pending Receipts Success',
  SEARCH_PENDING_RECEIPTS_FAILURE = '[Other-Receipts-Issues-List ] Search Pending Receipts Failure',

  SEARCH_PENDING_ISSUE = '[ Other-Receipts-Issues-List ] Search Pending Issue Stocks',
  SEARCH_PENDING_ISSUE_SUCCESS = '[Other-Receipts-Issues-List ]Search Pending Issue Success',
  SEARCH_PENDING_ISSUE_FAILURE = '[Other-Receipts-Issues-List ] Search Pending Issue Failure',

  LOAD_SELECTED_STOCK = '[ InStock-Receive-Details ] Load selected stock ',
  LOAD_SELECTED_STOCK_SUCCESS = '[ InStock-Receive-Details ] Load selected stock Success',
  LOAD_SELECTED_STOCK_FAILURE = '[ InStock-Receive-Details ] Load selected stock Failure',

  LOAD_ItEMS_COUNT = '[ InStock-Receive-Details ] Load items Count ',
  LOAD_ItEMS_COUNT_SUCCESS = '[ InStock-Receive-Details ] Load items Count Success ',
  LOAD_ItEMS_COUNT_FAILURE = '[ InStock-Receive-Details ] Load items Count Failure ',

  LOAD_STUDDED_PRODUCT_GROUPS = '[InStock-Receive-Details ]  Load Studded Product Groups ',
  LOAD_STUDDED_PRODUCT_GROUPS_SUCCESS = '[InStock-Receive-Details ]  Load Studded Product Groups Success ',
  LOAD_STUDDED_PRODUCT_GROUPS_FAILURE = '[InStock-Receive-Details ]  Load Studded Product Groups Failure ',

  SEARCH_ITEMS = '[ InStock-Receive-List ] Search Items ',
  SEARCH_ITEMS_SUCCESS = '[ InStock-Receive-List ] Search Items Success',
  SEARCH_ITEMS_FAILURE = '[ InStock-Receive-List ] Search Items Failure',

  CLEAR_SEARCH_ITEMS = '[ InStock-Receive-List ] Clear Search Items ',

  DROPDOWN_SELECTED_FOR_ISSUES = '[ Other-Receipts ] Selected Dropdown for Issue',

  LOAD_SELECTED_ISSUE = '[Instock-issue-details] Load Selected Other Issue',
  LOAD_SELECTED_ISSUE_SUCCESS = '[Instock-issue-details] Load Selected Other Issue Success',
  LOAD_SELECTED_ISSUE_FAILURE = '[InStock-issue-details] Load Selected Other Issue Failure',

  LOAD_NON_VERIFIED_OTHER_ISSUE_ITEMS = '[ Other-Issue-Details ] Load non-verified Other Issue Items ',
  LOAD_NON_VERIFIED_OTHER_ISSUE_ITEMS_SUCCESS = '[ Other-Issue-Details ] Load non-verified Other Issue Success ',
  LOAD_NON_VERIFIED_OTHER_ISSUE_ITEMS_FAILURE = '[ Other-Issue-Details ] Load non-verified Other Issue Failure ',

  REMOVE_INITIAL_LOAD_OTHER_ISSUE = '[Other-Issue-Details] Remove Initial Load Other Issue Data',

  CREATE_OTHER_STOCK_ISSUE_ITEMS = '[Other-Issue-Details] Create Other Stock Issue Request Items',
  CREATE_OTHER_STOCK_ISSUE_ITEMS_SUCCESS = '[Other-Issue-Details] Create Other Stock Issue Request Items Success ',
  CREATE_OTHER_STOCK_ISSUE_ITEMS_FAILURE = '[Other-Issue-Details] Create Other Stock Issue Request Items Failure',

  CONFIRM_OTHER_STOCK_ISSUE = '[Other-Issue-Details] Confirm Other Stock Issue',
  CONFIRM_OTHER_STOCK_ISSUE_SUCCESS = '[Other-Issue-Details] Confirm Other Stock Issue Success',
  CONFIRM_OTHER_STOCK_ISSUE_FAILURE = '[Other-Issue-Details] Confirm Other Stock Issue Failure',
  RESET_CONFIRM_OTHER_STOCK_ISSUE_RESPONSE = '[Other-Issue-Details] Reset Other Stock Issue Response',
  //create page
  CREATE_OTHER_ISSUE_STOCK_REQUEST = '[ Other-Issue-Create ] Create Stock Request',
  CREATE_OTHER_ISSUE_STOCK_REQUEST_SUCCESS = '[ Other-Issue-Create ] Create Stock Request Success',
  CREATE_OTHER_ISSUE_STOCK_REQUEST_FAILURE = '[ Other-Issue-Create ] Create Stock Request Failure',

  LOAD_ALL_OTHER_ISSUE_CREATE_ITEMS = '[Other-Issue-Create ] Load All Other Issue Create Items ',
  LOAD_ALL_OTHER_ISSUE_CREATE_ITEMS_SUCCESS = '[ Other-Issue-Create ] Load All Other Issue Create Items Success ',
  LOAD_ALL_OTHER_ISSUE_CREATE_ITEMS_FAILURE = '[ Other-Issue-Create ] Load All Other Issue Create Items Failure ',

  LOAD_SELECTED_OTHER_ISSUE_ITEMS = '[ Other-Issue-Create ] Load Selected Other Issue Items ',
  LOAD_SELECTED_OTHER_ISSUE_ITEMS_SUCCESS = '[ Other-Issue-Create ] Load Selected Other Issue Success ',
  LOAD_SELECTED_OTHER_ISSUE_ITEMS_FAILURE = '[ Other-Issue-Create ] Load Selected Other Issue Failure ',

  LOAD_ISSUE_ITEMS_CREATE_COUNT = '[Other-Issue-Create] Load Issue Items Create Count',
  LOAD_ISSUE_ITEMS_CREATE_COUNT_SUCCESS = '[Other-Issue-Create] Load Issue Items Create Count Success',
  LOAD_ISSUE_ITEMS_CREATE_COUNT_FAILURE = '[Other-Issue-Create] Load Issue Items Create Count Failure',

  CREATE_OTHER_ISSUE_STOCK_REQUEST_ITEMS = '[Other-Issue-Create] Create Other Issue Stock Request Items',
  CREATE_OTHER_ISSUE_STOCK_REQUEST_ITEMS_SUCCESS = '[Other-Issue-Create] Create Other Issue Stock Request Items Success ',
  CREATE_OTHER_ISSUE_STOCK_REQUEST_ITEMS_FAILURE = '[Other-Issue-Create] Create Other Issue Stock Request Items Failure',

  REMOVE_OTHER_ISSUE_STOCK_REQUEST_ITEMS = '[Other-Issue-Create] Delete Other Issue Stock Request Items',
  REMOVE_OTHER_ISSUE_STOCK_REQUEST_ITEMS_SUCCESS = '[Other-Issue-Create] Delete Other Issue Stock Request Items Success',
  REMOVE_OTHER_ISSUE_STOCK_REQUEST_ITEMS_FAILURE = '[Other-Issue-Create] Delete Other Issue Stock Request Items Failure',

  UPDATE_STOCK_REQUEST_CREATE_ITEM = '[Other-Issue-Create] Update Stock Request Create item',
  UPDATE_STOCK_REQUEST_CREATE_ITEM_SUCCESS = '[Other-Issue-Create] Update Stock Request Create item Success',
  UPDATE_STOCK_REQUEST_CREATE_ITEM_FAILURE = '[Other-Issue-Create] Update Stock Request Create item Failure',

  RESET_OTHER_ISSUE_CREATE_LIST_ITEMS = '[Other-Issue-Create] Reset Other Issues Create List',
  RESET_OTHER_ISSUE_CREATE_RESPONSE = '[Other-Issue-Create] Reset Other Issue Create Response',

  UPDATE_STOCK_REQUEST = '[Other-Issue-Create] Update Stock Request',
  UPDATE_STOCK_REQUEST_SUCCESS = '[Other-Issue-Create] Update Stock Request Success',
  UPDATE_STOCK_REQUEST_FAILURE = '[Other-Issue-Create] Update Stock Request Failure',

  ADJUSTMENT_SEARCH = '[Other-Issue-Create] Adjustment Search Item',
  ADJUSTMENT_SEARCH_SUCCESS = '[Other-Issue-Create] Adjustment Search Item Success',
  ADJUSTMENT_SEARCH_FAILURE = '[Other-Issue-Create] Adjustment Search Item Failure',

  ADD_ADJUSTMENT_ITEMS_TO_CART = '[Other-Issue-Create] Add Adjustment Items To Cart',

  CREATE_STOCK_REQUEST_ADJUSTMENT = '[Other-Issue-Create] Create Stock Request Adjustment',
  CREATE_STOCK_REQUEST_ADJUSTMENT_SUCCESS = '[Other-Issue-Create] Create Stock Request Adjustment Success',
  CREATE_STOCK_REQUEST_ADJUSTMENT_FAILURE = '[Other-Issue-Create] Create Stock Request Adjustment Failure',

  UPDATE_CART_ITEM_ADJUSTMENT = '[Other-Issue-Create] Update Item Adjustment',
  REMOVE_CART_ITEM_ADJUSTMENT = '[Other-Issue-Create] Remove Item Adjustment',
  SEARCH_CART_ITEM_ADJUSTMENT = '[Other-Issue-Create] Search Item Adjustment',
  CLEAR_SEARCH_CART_ITEM_ADJUSTMENT = '[Other-Issue-Create] Clear Search Item Adjustment',
  CLEAR_SEARCH_INVENTORY_ADJUSTMENT = '[Other-Issue-Create] Clear Search Inventory Adjustment',

  LOAD_ISSUE_ADJ_LIST = '[Other-Receipts-Issues-List] Load Issue ADJ List',
  LOAD_ISSUE_ADJ_LIST_SUCCESS = '[Other-Receipts-Issues-List] Load Issue ADJ List Success',
  LOAD_ISSUE_ADJ_LIST_FAILURE = '[Other-Receipts-Issues-List] Load Issue ADJ List Failure',

  LOAD_ISSUE_LOSS_LIST = '[Other-Receipts-Issues-List] Load Issue LOSS List',
  LOAD_ISSUE_LOSS_LIST_SUCCESS = '[Other-Receipts-Issues-List] Load Issue LOSS List Success',
  LOAD_ISSUE_LOSS_LIST_FAILURE = '[Other-Receipts-Issues-List] Load Issue LOSS List Failure',

  LOAD_ISSUE_PSV_LIST = '[Other-Receipts-Issues-List] Load Issue PSV List',
  LOAD_ISSUE_PSV_LIST_SUCCESS = '[Other-Receipts-Issues-List] Load Issue PSV List Success',
  LOAD_ISSUE_PSV_LIST_FAILURE = '[Other-Receipts-Issues-List] Load Issue PSV List Failure',

  RESET_ADJUSTMENT_ISSUE_DATA = '[Other-Issue-Create] Reset Issue ADJ Data',

  CLEAR_ITEMS = '[stock-receive] Clear Items',
  //psv
  PSV_SEARCH = '[Other-Issue-Create] PSV Search Item',
  PSV_SEARCH_SUCCESS = '[Other-Issue-Create] PSV Search Item Success',
  PSV_SEARCH_FAILURE = '[Other-Issue-Create] PSV Search Item Failure',

  ADD_PSV_ITEMS_TO_CART = '[Other-Issue-Create] Add PSV Items To Cart',

  CREATE_STOCK_REQUEST_PSV = '[Other-Issue-Create] Create Stock Request PSV',
  CREATE_STOCK_REQUEST_PSV_SUCCESS = '[Other-Issue-Create] Create Stock Request PSV Success',
  CREATE_STOCK_REQUEST_PSV_FAILURE = '[Other-Issue-Create] Create Stock Request PSV Failure',

  UPDATE_CART_ITEM_PSV = '[Other-Issue-Create] Update Item PSV',
  REMOVE_CART_ITEM_PSV = '[Other-Issue-Create] Remove Item PSV',
  SEARCH_CART_ITEM_PSV = '[Other-Issue-Create] Search Item PSV',
  CLEAR_SEARCH_CART_ITEM_PSV = '[Other-Issue-Create] Clear Search Item PSV',
  RESET_PSV_ISSUE_DATA = '[Other-Issue-Create] Reset Issue PSV Data',
  CLEAR_SEARCH_INVENTORY_PSV = '[Other-Issue-Create] Clear Search Inventory PSV',

  //FOC
  FOC_SEARCH = '[Other-Issue-Create] FOC Search Item',
  FOC_SEARCH_SUCCESS = '[Other-Issue-Create] FOC Search Item Success',
  FOC_SEARCH_FAILURE = '[Other-Issue-Create] FOC Search Item Failure',

  ADD_FOC_ITEMS_TO_CART = '[Other-Issue-Create] Add FOC Items To Cart',

  CREATE_STOCK_REQUEST_FOC = '[Other-Issue-Create] Create Stock Request FOC',
  CREATE_STOCK_REQUEST_FOC_SUCCESS = '[Other-Issue-Create] Create Stock Request FOC Success',
  CREATE_STOCK_REQUEST_FOC_FAILURE = '[Other-Issue-Create] Create Stock Request FOC Failure',

  UPDATE_CART_ITEM_FOC = '[Other-Issue-Create] Update Item FOC',
  REMOVE_CART_ITEM_FOC = '[Other-Issue-Create] Remove Item FOC',
  SEARCH_CART_ITEM_FOC = '[Other-Issue-Create] Search Item FOC',
  CLEAR_SEARCH_CART_ITEM_FOC = '[Other-Issue-Create] Clear Search Item FOC',
  RESET_FOC_ISSUE_DATA = '[Other-Issue-Create] Reset Issue FOC Data',

  LOAD_ISSUE_FOC_LIST = '[Other-Receipts-Issues-List] Load Issue FOC List',
  LOAD_ISSUE_FOC_LIST_SUCCESS = '[Other-Receipts-Issues-List] Load Issue FOC List Success',
  LOAD_ISSUE_FOC_LIST_FAILURE = '[Other-Receipts-Issues-List] Load Issue FOC List Failure',

  CLEAR_SEARCH_INVENTORY_FOC = '[Other-Issue-Create] Clear Search Inventory FOC',

  CANCEL_STOCK_REQUEST = '[Other-Issue] Cancel Stock Request',
  CANCEL_STOCK_REQUEST_SUCCESS = '[Other-Issue] Cancel Stock Request Success',
  CANCEL_STOCK_REQUEST_FAILURE = '[Other-Issue] Cancel Stock Request Failure',

  PRINT_OTHER_ISSUES = '[Other-Issue] Print Other Issues',
  PRINT_OTHER_ISSUES_SUCCESS = '[Other-Issue] Print Other Issues Success',
  PRINT_OTHER_ISSUES_FAILURE = '[Other-Issue] Print Other Issues Failure',
  LOAD_PRODUCT_CATEGORIES = '[Other-Issue] Load product categories',
  LOAD_PRODUCT_CATEGORIES_SUCCESS = '[Other-Issue] Load product categories Success',
  LOAD_PRODUCT_CATEGORIES_FAILURE = '[Other-Issue] Load product categories Failure',

  LOAD_PROUDCT_GROUPS = '[Other-Issue] Load product groups',
  LOAD_PROUDCT_GROUPS_SUCCESS = '[Other-Issue] Load product groups Success',
  LOAD_PROUDCT_GROUPS_FAILURE = '[Other-Issue] Load product groups Failure',

  SET_FILTER_DATA_ALL_PRODUCTS = '[Other-Issue] Set Filter Data All Products',
  SET_FILTER_DATA_SELECTED_PRODUCTS = '[Other-Issue] Set Filter Data Selected Products',
  SET_SORT_DATA_ALL_PRODUCTS = '[Other-Issue] Set Sort Data All Products',
  SET_SORT_DATA_SELECTED_PRODUCTS = '[Other-Issue] Set Sort Data Selected Products',

  SET_FILTER_DATA_OTHER_ISSUE = '[Other-Issue] Set Filter Data Other Issue',
  SET_SORT_DATA_OTHER_ISSUE = '[Other-Issue] Set Sort Data Other Issue',

  LOAD_OTHER_ISSUE_HISTORY = '[Other-Issue] Load Other issue history',
  LOAD_OTHER_ISSUE_HISTORY_SUCCESS = '[Other-Issue] Load Other issue history Success',
  LOAD_OTHER_ISSUE_HISTORY_FAILURE = '[Other-Issue] Load Other issue history Failure',

  RESET_OTHER_ISSUE_HISTORY = '[Other-Issue] Reset Other issue History',

  LOAD_SELECTED_OTHER_ISSUE_HISTORY = 'Other-issue History Details] Load Selected History',
  LOAD_SELECTED_OTHER_ISSUE_HISTORY_SUCCESS = '[Other-issue History Details] Load Selected History Success',
  LOAD_SELECTED_OTHER_ISSUE_HISTORY_FAILURE = '[Other-issue History Details] Load Selected History Failure',

  LOAD_OTHER_ISSUE_HISTORY_ITEMS = '[Other-issue History Details] Load Selected History Items',
  LOAD_OTHER_ISSUE_HISTORY_ITEMS_SUCCESS = '[Other-issue History Details] Load Selected History Items Success',
  LOAD_OTHER_ISSUE_HISTORY_ITEMS_FAILURE = '[Other-issue History Details] Load Selected History Items Failure',

  CLEAR_OTHER_ISSUE_HISTORY_ITEMS = '[Other-issue History Details] Clear Selected History Items',

  LOAD_OTHER_ISSUE_HISTORY_ITEMS_TOTAL_COUNT = '[Other-issue History Details] Load Selected History Items TotalCount',
  LOAD_OTHER_ISSUE_HISTORY_ITEMS_TOTAL_COUNT_SUCCESS = '[Other-issue History Details] Load Selected History Items Total Count Success',
  LOAD_OTHER_ISSUE_HISTORY_ITEMS_TOTAL_COUNT_FAILURE = '[Other-issue History Details] Load Selected History Items Total Count Failure',

  SET_OTHER_RECEIPTS_ISSUE_FILTER_DATA = '[Other-receipts-issue-History] Set other receipts issue Filter Data',
  CLEAR_OTHER_RECEIPTS_ISSUE_FILTER_DATA = '[Other-receipts-issue-History] Clear other receipts issue Filter Data'
}

export class ResetIssueListData implements Action {
  readonly type = OtherIssuesActionTypes.RESET_ISSUE_LIST_DATA;
}
export class LoadIssuesSTNCount implements Action {
  readonly type = OtherIssuesActionTypes.LOAD_ISSUES_STN_COUNT;
}

export class LoadIssuesSTNCountSuccess implements Action {
  readonly type = OtherIssuesActionTypes.LOAD_ISSUES_STN_COUNT_SUCCESS;
  constructor(public payload: LoadOtherIssuesSTNCountPayload) {}
}

export class LoadIssuesSTNCountFailure implements Action {
  readonly type = OtherIssuesActionTypes.LOAD_ISSUES_STN_COUNT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadIssueList implements Action {
  readonly type = OtherIssuesActionTypes.LOAD_ISSUE_LIST;
  constructor(public payload: OtherIssueLoadListItemsPayload) {}
}

export class LoadIssueListSuccess implements Action {
  readonly type = OtherIssuesActionTypes.LOAD_ISSUE_LIST_SUCCESS;
  constructor(public payload: OtherIssuedataModel) {}
}

export class LoadIssueListFailure implements Action {
  readonly type = OtherIssuesActionTypes.LOAD_ISSUE_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadIssueLoanList implements Action {
  readonly type = OtherIssuesActionTypes.LOAD_ISSUE_LOAN_LIST;
  constructor(public payload: OtherIssueLoadListItemsPayload) {}
}

export class LoadIssueLoanListSuccess implements Action {
  readonly type = OtherIssuesActionTypes.LOAD_ISSUE_LOAN_LIST_SUCCESS;
  constructor(public payload: OtherIssuedataModel) {}
}

export class LoadIssueLoanListFailure implements Action {
  readonly type = OtherIssuesActionTypes.LOAD_ISSUE_LOAN_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchPendingIssue implements Action {
  readonly type = OtherIssuesActionTypes.SEARCH_PENDING_ISSUE;
  constructor(public payload: OtherIssueSearchPendingPayload) {}
}

export class SearchPendingIssueSuccess implements Action {
  readonly type = OtherIssuesActionTypes.SEARCH_PENDING_ISSUE_SUCCESS;
  constructor(public payload: OtherIssueModel[]) {}
}

export class SearchPendingIssueFailure implements Action {
  readonly type = OtherIssuesActionTypes.SEARCH_PENDING_ISSUE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class DropDownvalueForIssues implements Action {
  readonly type = OtherIssuesActionTypes.DROPDOWN_SELECTED_FOR_ISSUES;
  constructor(public payload: string) {}
}
export class LoadSelectedIssue implements Action {
  readonly type = OtherIssuesActionTypes.LOAD_SELECTED_ISSUE;
  constructor(public payload: OtherIssueLoadSelectedPayload) {}
}
export class LoadSelectedIssueSuccess implements Action {
  readonly type = OtherIssuesActionTypes.LOAD_SELECTED_ISSUE_SUCCESS;
  constructor(public payload: RequestOtherIssueStockTransferNote) {}
}
export class LoadSelectedIssueFailure implements Action {
  readonly type = OtherIssuesActionTypes.LOAD_SELECTED_ISSUE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadNonVerifiedOtherIssueItems implements Action {
  readonly type = OtherIssuesActionTypes.LOAD_NON_VERIFIED_OTHER_ISSUE_ITEMS;
  constructor(public payload: LoadOtherIssuesItemPayload) {}
}

export class LoadNonVerifiedOtherIssueItemsSuccess implements Action {
  readonly type =
    OtherIssuesActionTypes.LOAD_NON_VERIFIED_OTHER_ISSUE_ITEMS_SUCCESS;
  constructor(public payload: OtherIssuesItem[]) {}
}
export class LoadNonVerifiedOtherIssueItemsFailure implements Action {
  readonly type =
    OtherIssuesActionTypes.LOAD_NON_VERIFIED_OTHER_ISSUE_ITEMS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SearchClearIssue implements Action {
  readonly type = OtherIssuesActionTypes.SEARCH_CLEAR_ISSUE;
}
export class ClearItems implements Action {
  readonly type = OtherIssuesActionTypes.CLEAR_ITEMS;
}

export class CreateOtherStockIssueItems implements Action {
  readonly type = OtherIssuesActionTypes.CREATE_OTHER_STOCK_ISSUE_ITEMS;
  constructor(public payload: CreateOtherStockIssueItemsPayload) {}
}

//cannot change this as from backend no specific data is coming.
export class CreateOtherStockIssueItemsItemsSuccess implements Action {
  readonly type = OtherIssuesActionTypes.CREATE_OTHER_STOCK_ISSUE_ITEMS_SUCCESS;
  constructor(public payload: any) {}
}

export class CreateOtherStockIssueItemsItemsFailure implements Action {
  readonly type = OtherIssuesActionTypes.CREATE_OTHER_STOCK_ISSUE_ITEMS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class RemoveInitialLoadOtherIssue implements Action {
  readonly type = OtherIssuesActionTypes.REMOVE_INITIAL_LOAD_OTHER_ISSUE;
}

export class ConfirmOtherStockIssue implements Action {
  readonly type = OtherIssuesActionTypes.CONFIRM_OTHER_STOCK_ISSUE;
  constructor(public payload: ConfirmOtherStockIssuePayload) {}
}

export class ConfirmOtherStockIssueSuccess implements Action {
  readonly type = OtherIssuesActionTypes.CONFIRM_OTHER_STOCK_ISSUE_SUCCESS;
  constructor(public payload: ConfirmOtherStockIssueResponse) {}
}

export class ConfirmOtherStockIssueFailure implements Action {
  readonly type = OtherIssuesActionTypes.CONFIRM_OTHER_STOCK_ISSUE_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class ResetConfirmOtherIssueResponse implements Action {
  readonly type =
    OtherIssuesActionTypes.RESET_CONFIRM_OTHER_STOCK_ISSUE_RESPONSE;
}
//create page
export class CreateOtherIssueStockRequest implements Action {
  readonly type = OtherIssuesActionTypes.CREATE_OTHER_ISSUE_STOCK_REQUEST;
  constructor(public payload: OtherIssuesCreateStockResponsePayload) {}
}

export class CreateOtherIssueStockRequestSuccess implements Action {
  readonly type =
    OtherIssuesActionTypes.CREATE_OTHER_ISSUE_STOCK_REQUEST_SUCCESS;
  constructor(public payload: OtherIssuesCreateStockResponse) {}
}
export class CreateOtherIssueStockRequestFailure implements Action {
  readonly type =
    OtherIssuesActionTypes.CREATE_OTHER_ISSUE_STOCK_REQUEST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadAllOtherIssueCreateItems implements Action {
  readonly type = OtherIssuesActionTypes.LOAD_ALL_OTHER_ISSUE_CREATE_ITEMS;
  constructor(public payload: LoadAllOtherIssuePayload) {}
}

export class LoadAllOtherIssueCreateItemsSuccess implements Action {
  readonly type =
    OtherIssuesActionTypes.LOAD_ALL_OTHER_ISSUE_CREATE_ITEMS_SUCCESS;
  constructor(public payload: OtherIssuesItem[]) {}
}
export class LoadAllOtherIssueCreateItemsFailure implements Action {
  readonly type =
    OtherIssuesActionTypes.LOAD_ALL_OTHER_ISSUE_CREATE_ITEMS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadSelectedOtherIssueCreateItems implements Action {
  readonly type = OtherIssuesActionTypes.LOAD_SELECTED_OTHER_ISSUE_ITEMS;
  constructor(public payload: LoadAllOtherIssuePayload) {}
}

export class LoadSelectedOtherIssueCreateItemsSuccess implements Action {
  readonly type =
    OtherIssuesActionTypes.LOAD_SELECTED_OTHER_ISSUE_ITEMS_SUCCESS;
  constructor(public payload: OtherIssuesItem[]) {}
}
export class LoadSelectedOtherIssueCreateItemsFailure implements Action {
  readonly type =
    OtherIssuesActionTypes.LOAD_SELECTED_OTHER_ISSUE_ITEMS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadIssueItemsCreateTotalCount implements Action {
  readonly type = OtherIssuesActionTypes.LOAD_ISSUE_ITEMS_CREATE_COUNT;
  constructor(public payload: LoadOtherIssueCreateItemsTotalCountPayload) {}
}
export class LoadIssueItemsCreateTotalCountSuccess implements Action {
  readonly type = OtherIssuesActionTypes.LOAD_ISSUE_ITEMS_CREATE_COUNT_SUCCESS;
  constructor(
    public payload: LoadOtherIssueCreateItemsTotalCountSuccessPayload
  ) {}
}
export class LoadIssueItemsCreateTotalCountFailure implements Action {
  readonly type = OtherIssuesActionTypes.LOAD_ISSUE_ITEMS_CREATE_COUNT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class CreateOtherIssueStockRequestItems implements Action {
  readonly type = OtherIssuesActionTypes.CREATE_OTHER_ISSUE_STOCK_REQUEST_ITEMS;
  constructor(public payload: CreateOtherIssueStockRequestItemsPayload) {}
}

// no response hence
export class CreateOtherIssueStockRequestItemsSuccess implements Action {
  readonly type =
    OtherIssuesActionTypes.CREATE_OTHER_ISSUE_STOCK_REQUEST_ITEMS_SUCCESS;
  constructor(public payload: any) {}
}

export class CreateOtherIssueStockRequestItemsFailure implements Action {
  readonly type =
    OtherIssuesActionTypes.CREATE_OTHER_ISSUE_STOCK_REQUEST_ITEMS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class RemoveOtherIssueStockRequestItems implements Action {
  readonly type = OtherIssuesActionTypes.REMOVE_OTHER_ISSUE_STOCK_REQUEST_ITEMS;
  constructor(public payload: RemoveOtherIssueStockRequestItemsPayload) {}
}

// no response
export class RemoveOtherIssueStockRequestItemsSuccess implements Action {
  readonly type =
    OtherIssuesActionTypes.REMOVE_OTHER_ISSUE_STOCK_REQUEST_ITEMS_SUCCESS;
  constructor(public payload: any) {}
}

export class RemoveOtherIssueStockRequestItemsFailure implements Action {
  readonly type =
    OtherIssuesActionTypes.REMOVE_OTHER_ISSUE_STOCK_REQUEST_ITEMS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class UpdateStockRequestCreateItem implements Action {
  readonly type = OtherIssuesActionTypes.UPDATE_STOCK_REQUEST_CREATE_ITEM;
  constructor(public payload: UpdateStockRequestItemPayload) {}
}

// no response
export class UpdateStockRequestCreateItemSuccess implements Action {
  readonly type =
    OtherIssuesActionTypes.UPDATE_STOCK_REQUEST_CREATE_ITEM_SUCCESS;
  constructor(public payload: any) {}
}

export class UpdateStockRequestCreateItemFailure implements Action {
  readonly type =
    OtherIssuesActionTypes.UPDATE_STOCK_REQUEST_CREATE_ITEM_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class ResetOtherIssueCreateListItems implements Action {
  readonly type = OtherIssuesActionTypes.RESET_OTHER_ISSUE_CREATE_LIST_ITEMS;
}
export class ResetOtherIssueCreateResponse implements Action {
  readonly type = OtherIssuesActionTypes.RESET_OTHER_ISSUE_CREATE_RESPONSE;
}
export class UpdateStockRequest implements Action {
  readonly type = OtherIssuesActionTypes.UPDATE_STOCK_REQUEST;
  constructor(public payload: UpdateStockRequestPayload) {}
}

export class UpdateStockRequestSuccess implements Action {
  readonly type = OtherIssuesActionTypes.UPDATE_STOCK_REQUEST_SUCCESS;
  constructor(public payload: OtherIssueModel) {}
}

export class UpdateStockRequestFailure implements Action {
  readonly type = OtherIssuesActionTypes.UPDATE_STOCK_REQUEST_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SearchAdjustment implements Action {
  readonly type = OtherIssuesActionTypes.ADJUSTMENT_SEARCH;
  constructor(public payload: AdjustmentSearchItemPayload) {}
}

export class SearchAdjustmentSuccess implements Action {
  readonly type = OtherIssuesActionTypes.ADJUSTMENT_SEARCH_SUCCESS;

  constructor(public payload: AdjustmentSearchItemPayloadSuccess) {}
}
export class SearchAdjustmentFailure implements Action {
  readonly type = OtherIssuesActionTypes.ADJUSTMENT_SEARCH_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class AddItemsToCart implements Action {
  readonly type = OtherIssuesActionTypes.ADD_ADJUSTMENT_ITEMS_TO_CART;
  constructor(public payload: OtherIssuesItem[]) {}
}
export class CreateStockRequestAdjustment implements Action {
  readonly type = OtherIssuesActionTypes.CREATE_STOCK_REQUEST_ADJUSTMENT;
  constructor(public payload: CreateStockRequestAdjustmentPayload) {}
}

export class CreateStockRequestAdjustmentSuccess implements Action {
  readonly type =
    OtherIssuesActionTypes.CREATE_STOCK_REQUEST_ADJUSTMENT_SUCCESS;
  constructor(public payload: OtherIssueModel) {}
}

export class CreateStockRequestAdjustmentFailure implements Action {
  readonly type =
    OtherIssuesActionTypes.CREATE_STOCK_REQUEST_ADJUSTMENT_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class UpdateCartItemsAdjustment implements Action {
  readonly type = OtherIssuesActionTypes.UPDATE_CART_ITEM_ADJUSTMENT;
  constructor(public payload: UpdateCartItemAdjustmentPayload) {}
}
export class RemoveCartItemsAdjustment implements Action {
  readonly type = OtherIssuesActionTypes.REMOVE_CART_ITEM_ADJUSTMENT;
  constructor(public payload: RemoveCartItemAdjustmentPayload) {}
}
export class SearchCartItemsAdjustment implements Action {
  readonly type = OtherIssuesActionTypes.SEARCH_CART_ITEM_ADJUSTMENT;
  constructor(public payload: SearchCartItemAdjustmentPayload) {}
}
export class LoadIssueADJList implements Action {
  readonly type = OtherIssuesActionTypes.LOAD_ISSUE_ADJ_LIST;
  constructor(public payload: OtherIssueLoadListItemsPayload) {}
}

export class LoadIssueADJListSuccess implements Action {
  readonly type = OtherIssuesActionTypes.LOAD_ISSUE_ADJ_LIST_SUCCESS;
  constructor(public payload: OtherIssuedataModel) {}
}

export class LoadIssueADJListFailure implements Action {
  readonly type = OtherIssuesActionTypes.LOAD_ISSUE_ADJ_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadIssueLossList implements Action {
  readonly type = OtherIssuesActionTypes.LOAD_ISSUE_LOSS_LIST;
  constructor(public payload: OtherIssueLoadListItemsPayload) {}
}

export class LoadIssueLossListSuccess implements Action {
  readonly type = OtherIssuesActionTypes.LOAD_ISSUE_LOSS_LIST_SUCCESS;
  constructor(public payload: OtherIssuedataModel) {}
}

export class LoadIssueLossListFailure implements Action {
  readonly type = OtherIssuesActionTypes.LOAD_ISSUE_LOSS_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadIssuePSVList implements Action {
  readonly type = OtherIssuesActionTypes.LOAD_ISSUE_PSV_LIST;
  constructor(public payload: OtherIssueLoadListItemsPayload) {}
}

export class LoadIssuePSVListSuccess implements Action {
  readonly type = OtherIssuesActionTypes.LOAD_ISSUE_PSV_LIST_SUCCESS;
  constructor(public payload: OtherIssuedataModel) {}
}
export class LoadIssuePSVListFailure implements Action {
  readonly type = OtherIssuesActionTypes.LOAD_ISSUE_PSV_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class ResetAdjustmentIssueData implements Action {
  readonly type = OtherIssuesActionTypes.RESET_ADJUSTMENT_ISSUE_DATA;
}
export class ClearSearchCartItemAdjustment implements Action {
  readonly type = OtherIssuesActionTypes.CLEAR_SEARCH_CART_ITEM_ADJUSTMENT;
}
export class ClearSearchInventoryItemAdjustment implements Action {
  readonly type = OtherIssuesActionTypes.CLEAR_SEARCH_INVENTORY_ADJUSTMENT;
}
export class SearchPSV implements Action {
  readonly type = OtherIssuesActionTypes.PSV_SEARCH;
  constructor(public payload: PSVSearchItemPayload) {}
}

export class SearchPSVSuccess implements Action {
  readonly type = OtherIssuesActionTypes.PSV_SEARCH_SUCCESS;

  constructor(public payload: PSVSearchItemPayloadSuccess) {}
}
export class SearchPSVFailure implements Action {
  readonly type = OtherIssuesActionTypes.PSV_SEARCH_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class AddPSVItemsToCart implements Action {
  readonly type = OtherIssuesActionTypes.ADD_PSV_ITEMS_TO_CART;
  constructor(public payload: OtherIssuesItem[]) {}
}
export class CreateStockRequestPSV implements Action {
  readonly type = OtherIssuesActionTypes.CREATE_STOCK_REQUEST_PSV;
  constructor(public payload: CreateStockRequestPSVPayload) {}
}

export class CreateStockRequestPSVSuccess implements Action {
  readonly type = OtherIssuesActionTypes.CREATE_STOCK_REQUEST_PSV_SUCCESS;
  constructor(public payload: OtherIssueModel) {}
}

export class CreateStockRequestPSVFailure implements Action {
  readonly type = OtherIssuesActionTypes.CREATE_STOCK_REQUEST_PSV_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class UpdateCartItemsPSV implements Action {
  readonly type = OtherIssuesActionTypes.UPDATE_CART_ITEM_PSV;
  constructor(public payload: UpdateCartItemAdjustmentPayload) {}
}
export class RemoveCartItemsPSV implements Action {
  readonly type = OtherIssuesActionTypes.REMOVE_CART_ITEM_PSV;
  constructor(public payload: RemoveCartItemPSVPayload) {}
}
export class SearchCartItemsPSV implements Action {
  readonly type = OtherIssuesActionTypes.SEARCH_CART_ITEM_PSV;
  constructor(public payload: SearchCartItemPSVPayload) {}
}
export class ResetPSVIssueData implements Action {
  readonly type = OtherIssuesActionTypes.RESET_PSV_ISSUE_DATA;
}
export class ClearSearchCartItemPSV implements Action {
  readonly type = OtherIssuesActionTypes.CLEAR_SEARCH_CART_ITEM_PSV;
}
export class ClearSearchInventoryItemPSV implements Action {
  readonly type = OtherIssuesActionTypes.CLEAR_SEARCH_INVENTORY_PSV;
}
//FOC
export class SearchFOC implements Action {
  readonly type = OtherIssuesActionTypes.FOC_SEARCH;
  constructor(public payload: PSVSearchItemPayload) {}
}

export class SearchFOCSuccess implements Action {
  readonly type = OtherIssuesActionTypes.FOC_SEARCH_SUCCESS;

  constructor(public payload: PSVSearchItemPayloadSuccess) {}
}
export class SearchFOCFailure implements Action {
  readonly type = OtherIssuesActionTypes.FOC_SEARCH_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class AddFOCItemsToCart implements Action {
  readonly type = OtherIssuesActionTypes.ADD_FOC_ITEMS_TO_CART;
  constructor(public payload: OtherIssuesItem[]) {}
}
export class CreateStockRequestFOC implements Action {
  readonly type = OtherIssuesActionTypes.CREATE_STOCK_REQUEST_FOC;
  constructor(public payload: CreateStockRequestPSVPayload) {}
}

export class CreateStockRequestFOCSuccess implements Action {
  readonly type = OtherIssuesActionTypes.CREATE_STOCK_REQUEST_FOC_SUCCESS;
  constructor(public payload: OtherIssueModel) {}
}

export class CreateStockRequestFOCFailure implements Action {
  readonly type = OtherIssuesActionTypes.CREATE_STOCK_REQUEST_FOC_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class UpdateCartItemsFOC implements Action {
  readonly type = OtherIssuesActionTypes.UPDATE_CART_ITEM_FOC;
  constructor(public payload: UpdateCartItemAdjustmentPayload) {}
}
export class RemoveCartItemsFOC implements Action {
  readonly type = OtherIssuesActionTypes.REMOVE_CART_ITEM_FOC;
  constructor(public payload: RemoveCartItemPSVPayload) {}
}
export class SearchCartItemsFOC implements Action {
  readonly type = OtherIssuesActionTypes.SEARCH_CART_ITEM_FOC;
  constructor(public payload: SearchCartItemPSVPayload) {}
}
export class ResetFOCIssueData implements Action {
  readonly type = OtherIssuesActionTypes.RESET_FOC_ISSUE_DATA;
}
export class ClearSearchCartItemFOC implements Action {
  readonly type = OtherIssuesActionTypes.CLEAR_SEARCH_CART_ITEM_FOC;
}

export class LoadIssueFOCList implements Action {
  readonly type = OtherIssuesActionTypes.LOAD_ISSUE_FOC_LIST;
  constructor(public payload: OtherIssueLoadListItemsPayload) {}
}

export class LoadIssueFOCListSuccess implements Action {
  readonly type = OtherIssuesActionTypes.LOAD_ISSUE_FOC_LIST_SUCCESS;
  constructor(public payload: OtherIssuedataModel) {}
}
export class LoadIssueFOCListFailure implements Action {
  readonly type = OtherIssuesActionTypes.LOAD_ISSUE_FOC_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class ClearSearchInventoryItemFOC implements Action {
  readonly type = OtherIssuesActionTypes.CLEAR_SEARCH_INVENTORY_FOC;
}

export class CancelStockRequest implements Action {
  readonly type = OtherIssuesActionTypes.CANCEL_STOCK_REQUEST;
  constructor(public payload: CancelOtherRequestPayload) {}
}

export class CancelStockRequestSuccess implements Action {
  readonly type = OtherIssuesActionTypes.CANCEL_STOCK_REQUEST_SUCCESS;
  constructor(public payload: any) {}
}

export class CancelStockRequestFailure implements Action {
  readonly type = OtherIssuesActionTypes.CANCEL_STOCK_REQUEST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class PrintOtherIssues implements Action {
  readonly type = OtherIssuesActionTypes.PRINT_OTHER_ISSUES;
  constructor(public payload: PrintOtherIssuePayload) {}
}

export class PrintOtherIssuesSuccess implements Action {
  readonly type = OtherIssuesActionTypes.PRINT_OTHER_ISSUES_SUCCESS;
  constructor(public payload: any) {}
}

export class PrintOtherIssuesFailure implements Action {
  readonly type = OtherIssuesActionTypes.PRINT_OTHER_ISSUES_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadProductCategories implements Action {
  readonly type = OtherIssuesActionTypes.LOAD_PRODUCT_CATEGORIES;
}

export class LoadProductCategoriesSuccess implements Action {
  readonly type = OtherIssuesActionTypes.LOAD_PRODUCT_CATEGORIES_SUCCESS;
  constructor(public payload: ProductCategory[]) {}
}

export class LoadProductCategoriesFailure implements Action {
  readonly type = OtherIssuesActionTypes.LOAD_PRODUCT_CATEGORIES_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadProductGroups implements Action {
  readonly type = OtherIssuesActionTypes.LOAD_PROUDCT_GROUPS;
  constructor(public payload: string) {}
}

export class LoadProductGroupsSuccess implements Action {
  readonly type = OtherIssuesActionTypes.LOAD_PROUDCT_GROUPS_SUCCESS;
  constructor(public payload: ProductGroup[]) {}
}

export class LoadProductGroupsFailure implements Action {
  readonly type = OtherIssuesActionTypes.LOAD_PROUDCT_GROUPS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SetFilterDataAllProducts implements Action {
  readonly type = OtherIssuesActionTypes.SET_FILTER_DATA_ALL_PRODUCTS;
  constructor(public payload: { [key: string]: Filter[] }) {}
}
export class SetFilterDataSelectedProducts implements Action {
  readonly type = OtherIssuesActionTypes.SET_FILTER_DATA_SELECTED_PRODUCTS;
  constructor(public payload: { [key: string]: Filter[] }) {}
}
export class SetSortDataAllProducts implements Action {
  readonly type = OtherIssuesActionTypes.SET_SORT_DATA_ALL_PRODUCTS;
  constructor(public payload: Column[]) {}
}
export class SetSortDataSelectedProducts implements Action {
  readonly type = OtherIssuesActionTypes.SET_SORT_DATA_SELECTED_PRODUCTS;
  constructor(public payload: Column[]) {}
}
export class SetFilterDataOtherIssue implements Action {
  readonly type = OtherIssuesActionTypes.SET_FILTER_DATA_OTHER_ISSUE;
  constructor(public payload: { [key: string]: Filter[] }) {}
}
export class SetSortDataOtherIssue implements Action {
  readonly type = OtherIssuesActionTypes.SET_SORT_DATA_OTHER_ISSUE;
  constructor(public payload: Column[]) {}
}

export class LoadOtherIssueHistory implements Action {
  readonly type = OtherIssuesActionTypes.LOAD_OTHER_ISSUE_HISTORY;
  constructor(public payload: LoadOtherIssueHistoryPayload) {}
}
export class LoadOtherIssueHistorySuccess implements Action {
  readonly type = OtherIssuesActionTypes.LOAD_OTHER_ISSUE_HISTORY_SUCCESS;
  constructor(public payload: OtherIssuedataModel) {}
}
export class LoadOtherIssueHistoryFailure implements Action {
  readonly type = OtherIssuesActionTypes.LOAD_OTHER_ISSUE_HISTORY_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetOtherIssueHistory implements Action {
  readonly type = OtherIssuesActionTypes.RESET_OTHER_ISSUE_HISTORY;
}

export class LoadSelectedHistory implements Action {
  readonly type = OtherIssuesActionTypes.LOAD_SELECTED_OTHER_ISSUE_HISTORY;
  constructor(
    public payload: {
      type: any;
      actionType: string;
      id: number;
      transactionType: string;
    }
  ) {}
}
export class LoadSelectedHistorySuccess implements Action {
  readonly type =
    OtherIssuesActionTypes.LOAD_SELECTED_OTHER_ISSUE_HISTORY_SUCCESS;
  constructor(public payload: OtherIssueModel) {}
}
export class LoadSelectedHistoryFailure implements Action {
  readonly type =
    OtherIssuesActionTypes.LOAD_SELECTED_OTHER_ISSUE_HISTORY_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadSelectedHistoryItems implements Action {
  readonly type = OtherIssuesActionTypes.LOAD_OTHER_ISSUE_HISTORY_ITEMS;
  constructor(public payload: LoadOtherIssueHistoryItemsPayload) {}
}
export class LoadSelectedHistoryItemsSuccess implements Action {
  readonly type = OtherIssuesActionTypes.LOAD_OTHER_ISSUE_HISTORY_ITEMS_SUCCESS;
  constructor(
    public payload: { items: OtherIssuesHistoryItem[]; count: number }
  ) {}
}
export class LoadSelectedHistoryItemsFailure implements Action {
  readonly type = OtherIssuesActionTypes.LOAD_OTHER_ISSUE_HISTORY_ITEMS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ClearSelectedHistoryItems implements Action {
  readonly type = OtherIssuesActionTypes.CLEAR_OTHER_ISSUE_HISTORY_ITEMS;
}
export class LoadSelectedHistoryItemsTotalCount implements Action {
  readonly type =
    OtherIssuesActionTypes.LOAD_OTHER_ISSUE_HISTORY_ITEMS_TOTAL_COUNT;
  constructor(public payload: LoadOtherIssueHistoryItemsPayload) {}
}
export class LoadSelectedHistoryItemsTotalCountSuccess implements Action {
  readonly type =
    OtherIssuesActionTypes.LOAD_OTHER_ISSUE_HISTORY_ITEMS_TOTAL_COUNT_SUCCESS;
  constructor(public payload: number) {}
}
export class LoadSelectedHistoryItemsTotalCountFailure implements Action {
  readonly type =
    OtherIssuesActionTypes.LOAD_OTHER_ISSUE_HISTORY_ITEMS_TOTAL_COUNT_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SetOtherReceiptsIssueFilterData implements Action {
  readonly type = OtherIssuesActionTypes.SET_OTHER_RECEIPTS_ISSUE_FILTER_DATA;
  constructor(public payload: OtherReceiptsIssuesAdvanceFilterPayload) {}
}
export class ClearOtherReceiptsIssueFilterData implements Action {
  readonly type = OtherIssuesActionTypes.CLEAR_OTHER_RECEIPTS_ISSUE_FILTER_DATA;
  constructor(public payload: number) {}
}

export class LoadStuddedProductGroups implements Action {
  readonly type = OtherIssuesActionTypes.LOAD_STUDDED_PRODUCT_GROUPS;
}
export class LoadStuddedProductGroupsSuccess implements Action {
  readonly type = OtherIssuesActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_SUCCESS;
  constructor(public payload: string[]) {}
}
export class LoadStuddedProductGroupsFailure implements Action {
  readonly type = OtherIssuesActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export type OtherIssuesActions =
  | LoadIssuesSTNCount
  | LoadIssuesSTNCountSuccess
  | LoadIssuesSTNCountFailure
  | LoadIssueList
  | LoadIssueListSuccess
  | LoadIssueListFailure
  | SearchPendingIssue
  | SearchPendingIssueSuccess
  | SearchPendingIssueFailure
  | LoadIssueLoanList
  | LoadIssueLoanListSuccess
  | LoadIssueLoanListFailure
  | DropDownvalueForIssues
  | LoadSelectedIssue
  | LoadSelectedIssueSuccess
  | LoadSelectedIssueFailure
  | LoadStuddedProductGroups
  | LoadStuddedProductGroupsSuccess
  | LoadStuddedProductGroupsFailure
  | LoadNonVerifiedOtherIssueItems
  | LoadNonVerifiedOtherIssueItemsSuccess
  | LoadNonVerifiedOtherIssueItemsFailure
  | SearchClearIssue
  | CreateOtherStockIssueItems
  | CreateOtherStockIssueItemsItemsSuccess
  | CreateOtherStockIssueItemsItemsFailure
  | RemoveInitialLoadOtherIssue
  | ConfirmOtherStockIssue
  | ConfirmOtherStockIssueSuccess
  | ConfirmOtherStockIssueFailure
  | ResetConfirmOtherIssueResponse
  //create page
  | CreateOtherIssueStockRequest
  | CreateOtherIssueStockRequestSuccess
  | CreateOtherIssueStockRequestFailure
  | LoadAllOtherIssueCreateItems
  | LoadAllOtherIssueCreateItemsSuccess
  | LoadAllOtherIssueCreateItemsFailure
  | LoadSelectedOtherIssueCreateItems
  | LoadSelectedOtherIssueCreateItemsSuccess
  | LoadSelectedOtherIssueCreateItemsFailure
  | LoadIssueItemsCreateTotalCount
  | LoadIssueItemsCreateTotalCountSuccess
  | LoadIssueItemsCreateTotalCountFailure
  | CreateOtherIssueStockRequestItems
  | CreateOtherIssueStockRequestItemsSuccess
  | CreateOtherIssueStockRequestItemsFailure
  | RemoveOtherIssueStockRequestItems
  | RemoveOtherIssueStockRequestItemsSuccess
  | RemoveOtherIssueStockRequestItemsFailure
  | UpdateStockRequestCreateItem
  | UpdateStockRequestCreateItemSuccess
  | UpdateStockRequestCreateItemFailure
  | ResetOtherIssueCreateListItems
  | ResetOtherIssueCreateResponse
  | UpdateStockRequest
  | UpdateStockRequestSuccess
  | UpdateStockRequestFailure
  | ClearItems
  //psv and adjustment
  | SearchAdjustment
  | SearchAdjustmentSuccess
  | SearchAdjustmentFailure
  | AddItemsToCart
  | CreateStockRequestAdjustment
  | CreateStockRequestAdjustmentSuccess
  | CreateStockRequestAdjustmentFailure
  | UpdateCartItemsAdjustment
  | RemoveCartItemsAdjustment
  | SearchCartItemsAdjustment
  | LoadIssueADJList
  | LoadIssueADJListSuccess
  | LoadIssueADJListFailure
  | ResetAdjustmentIssueData
  | LoadIssueLossList
  | LoadIssueLossListSuccess
  | LoadIssueLossListFailure
  | LoadIssuePSVList
  | LoadIssuePSVListSuccess
  | LoadIssuePSVListFailure
  | ClearSearchCartItemAdjustment
  | SearchPSV
  | SearchPSVSuccess
  | SearchPSVFailure
  | AddPSVItemsToCart
  | CreateStockRequestPSV
  | CreateStockRequestPSVSuccess
  | CreateStockRequestPSVFailure
  | UpdateCartItemsPSV
  | RemoveCartItemsPSV
  | SearchCartItemsPSV
  | ResetPSVIssueData
  | ClearSearchCartItemPSV
  | SearchFOC
  | SearchFOCSuccess
  | SearchFOCFailure
  | AddFOCItemsToCart
  | CreateStockRequestFOC
  | CreateStockRequestFOCSuccess
  | CreateStockRequestFOCFailure
  | UpdateCartItemsFOC
  | RemoveCartItemsFOC
  | SearchCartItemsFOC
  | ResetFOCIssueData
  | ClearSearchCartItemFOC
  | LoadIssueFOCList
  | LoadIssueFOCListSuccess
  | LoadIssueFOCListFailure
  | ClearSearchInventoryItemAdjustment
  | ClearSearchInventoryItemPSV
  | ClearSearchInventoryItemFOC
  | ResetIssueListData
  | CancelStockRequest
  | CancelStockRequestSuccess
  | CancelStockRequestFailure
  | PrintOtherIssues
  | PrintOtherIssuesSuccess
  | PrintOtherIssuesFailure
  | LoadProductGroups
  | LoadProductGroupsSuccess
  | LoadProductGroupsFailure
  | LoadProductCategories
  | LoadProductCategoriesSuccess
  | LoadProductCategoriesFailure
  | SetFilterDataAllProducts
  | SetFilterDataSelectedProducts
  | SetSortDataAllProducts
  | SetSortDataSelectedProducts
  | SetFilterDataOtherIssue
  | SetSortDataOtherIssue
  // HISTORY
  | LoadOtherIssueHistory
  | LoadOtherIssueHistorySuccess
  | LoadOtherIssueHistoryFailure
  | ResetOtherIssueHistory
  | LoadSelectedHistory
  | LoadSelectedHistorySuccess
  | LoadSelectedHistoryFailure
  | LoadSelectedHistoryItems
  | LoadSelectedHistoryItemsSuccess
  | LoadSelectedHistoryItemsFailure
  | ClearSelectedHistoryItems
  | LoadSelectedHistoryItemsTotalCount
  | LoadSelectedHistoryItemsTotalCountSuccess
  | LoadSelectedHistoryItemsTotalCountFailure
  | SetOtherReceiptsIssueFilterData
  | ClearOtherReceiptsIssueFilterData;
