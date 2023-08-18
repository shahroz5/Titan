import { Action } from '@ngrx/store';
import {
  StockRequestNote,
  IssueInventoryItem,
  LoadPendingIssuePayload,
  LoadIssueSTNCountsPayload,
  SearchPendingPayload,
  LoadSelectedPayload,
  LoadIssueItemPayload,
  LoadIssueItemsTotalCountPayload,
  LoadIssueItemsTotalCountSuccessPayload,
  UpdateAllItemPayload,
  UpdateItemPayload,
  UpdateItemFailurePayload,
  ConfirmIssuePayload,
  ItemToleranceValidate,
  ProductCategory,
  ProductGroup,
  RequestList,
  UpdateItemListStatusPayload,
  MeasuredWeightAndValuePayload,
  LoadHistoryRequestPayload,
  StoreUser,
  LoadStockIssueHistoryItemsPayload,
  StockIssueSelectedHistoryPayload,
  IssueAdvanceFilterPayload,
  LoadCancelIssuesPayload,
  LoadCancelIssuesSTNPayload,
  LoadCancelIssuetemsPayload,
  Filter, Column ,
  CustomErrors,
  ImageResponse,
  ImageReqPayload,
  RegenerateFilePayload,
  RegenerateFileResponse
} from '@poss-web/shared/models';


export enum StockIssueActionTypes {
  LOAD_PENDING_ISSUE_TO_FACTORY_STN = '[ Stock-Issue ] Load pending issue To Factory STN List',
  LOAD_PENDING_ISSUE_TO_FACTORY_STN_SUCCESS = '[ Stock-Issue ] Load pending issue To Factory STN List Success',
  LOAD_PENDING_ISSUE_TO_FACTORY_STN_FAILURE = '[ Stock-Issue ] Load pending issue To Factory STN List Failure',

  LOAD_PENDING_ISSUE_TO_BOUTIQUE_STN = '[ Stock-Issue ] Load pending issue  STN List to Boutique',
  LOAD_PENDING_ISSUE_TO_BOUTIQUE_STN_SUCCESS = '[ Stock-Issue ] Load pending issue  STN List to Boutique Success',
  LOAD_PENDING_ISSUE_TO_BOUTIQUE_STN_FAILURE = '[ Stock-Issue ] Load pending issue  STN List to Boutique Failure',

  LOAD_PENDING_ISSUE_TO_MERCHANT_STN = '[ Stock-Issue ] Load pending issue  STN List to Merchant',
  LOAD_PENDING_ISSUE_TO_MERCHANT_STN_SUCCESS = '[ Stock-Issue ] Load pending issue  STN List to Merchant Success',
  LOAD_PENDING_ISSUE_TO_MERCHANT_STN_FAILURE = '[ Stock-Issue ] Load pending issue  STN List to Merchant Failure',

  LOAD_ISSUES_COUNT = '[Stock-issue] Load IssueSTNCount',
  LOAD_ISSUES_COUNT_SUCCESS = '[Stock-issue] Load IssueSTNCount Success',
  LOAD_ISSUES_COUNT_FAILURE = '[Stock-issue] Load IssueSTNCount Failure',

  SEARCH_PENDING_ISSUES = '[Stock-issue] Search Pending Issues',
  SEARCH_PENDING_ISSUES_SUCCESS = '[Stock-issue] Search Pending Issues Success',
  SEARCH_PENDING_ISSUES_FAILURE = '[Stock-issue] Search Pending Issues Failure',

  SEARCH_CLEAR = '[Stock-issue] search-clear',

  RESET_STOCK_ISSUE_LIST = '[Stock-issue] Reset Stock Issue List',

  LOAD_SELECTED_ISSUE = '[Stock-issue-details] Load Selected Issue',
  LOAD_SELECTED_ISSUE_SUCCESS = '[Stock-issue-details] Load Selected Issue Success',
  LOAD_SELECTED_ISSUE_FAILURE = '[Stock-issue-details] Load Selected Issue Failure',

  LOAD_ITEMS = '[Stock-issue-details] Load Items',
  LOAD_ITEMS_SUCCESS = '[Stock-issue-details] Load Items Succedd',
  LOAD_ITEMS_FAILURE = '[Stock-issue-details] Load Items Failure',

  CLEAR_ITEMS = '[Stock-issue-details] Clear Items',

  LOAD_ISSUE_ITEMS_COUNT = '[Stock-issue-Details] Load Issue Items Count',
  LOAD_ISSUE_ITEMS_COUNT_SUCCESS = '[Stock-issue-Details] Load Issue Items Count Success',
  LOAD_ISSUE_ITEMS_COUNT_FAILURE = '[Stock-issue-Details] Load Issue Items Count Failure',

  CONFIRM_ISSUE = '[Stock-issue Details] Confirm Issue',
  CONFIRM_ISSUE_SUCCESS = '[Stock-issue Details] Confirm Issue Success',
  CONFIRM_ISSUE_FAILURE = '[Stock-issue Details] Confirm Issue Failure',

  VALIDATE_ITEM = '[ Stock-issue-Details ] Validate item ',
  VALIDATE_ITEM_SUCCESS = '[ Stock-issue-Details ]  Validate item Success ',
  VALIDATE_ITEM_FAILURE = '[ Stock-issue-Details ]  Validate item Failure ',

  UPDATE_ITEM = '[Stock-issue Details] Update Item',
  UPDATE_ITEM_SUCCESS = '[Stock-issue Details] Update Item Success',
  UPDATE_ITEM_FAILURE = '[Stock-issue Details] Update Item Failure',

  UPDATE_ALL_ITEM = '[Stock-issue Details] Update All Item',
  UPDATE_ALL_ITEM_SUCCESS = '[Stock-issue Details] Update All Item Success',
  UPDATE_ALL_ITEM_FAILURE = '[Stock-issue Details] Update All Item Failure',

  LOAD_COURIER_DETAILS = '[Stock-issue Details] Load Courier Details',
  LOAD_COURIER_DETAILS_SUCCESS = '[Stock-issue Details] Load Courier Details Success',
  LOAD_COURIER_DETAILS_FAILURE = '[Stock-issue Details] Load Courier Details Failure',

  LOAD_PRODUCT_CATEGORIES = '[Stock-issue Details] Load product categories',
  LOAD_PRODUCT_CATEGORIES_SUCCESS = '[Stock-issue Details] Load product categories Success',
  LOAD_PRODUCT_CATEGORIES_FAILURE = '[Stock-issue Details] Load product categories Failure',

  LOAD_PROUDCT_GROUPS = '[Stock-issue Details] Load product groups',
  LOAD_PROUDCT_GROUPS_SUCCESS = '[Stock-issue Details] Load product groups Success',
  LOAD_PROUDCT_GROUPS_FAILURE = '[Stock-issue Details] Load product groups Failure',

  LOAD_STUDDED_PRODUCT_GROUPS = '[Stock-issue Details]  Load Studded Product Groups ',
  LOAD_STUDDED_PRODUCT_GROUPS_SUCCESS = '[Stock-issue Details]  Load Studded Product Groups Success ',
  LOAD_STUDDED_PRODUCT_GROUPS_FAILURE = '[Stock-issue Details]  Load Studded Product Groups Failure ',

  LOAD_EMPLOYEE_CODES = '[Stock-issue Details] Load Employee Codes',
  LOAD_EMPLOYEE_CODES_SUCCESS = '[Stock-issue Details] Load Employee Codes Success',
  LOAD_EMPLOYEE_CODES_FAILURE = '[Stock-issue Details] Load Employee Codes Failure',

  LOAD_EMPLOYEE_DETAILS = '[Stock-issue Details] Load Employee Details',
  LOAD_EMPLOYEE_DETAILS_SUCCESS = '[Stock-issue Details] Load Employee Details Success',
  LOAD_EMPLOYEE_DETAILS_FAILURE = '[Stock-issue Details] Load Employee Details Failure',

  SET_FILTER_DATA_APPROVED_PRODUCTS = '[Stock-issue Details] Set Filter Data All Products',
  SET_FILTER_DATA_SELECTED_PRODUCTS = '[Stock-issue Details] Set Filter Data Selected Products',
  SET_SORT_DATA_APPROVED_PRODUCTS = '[Stock-issue Details] Set Sort Data All Products',
  SET_SORT_DATA_SELECTED_PRODUCTS = '[Stock-issue Details] Set Sort Data Selected Products',

  CLEAR_SORT_AND_FILTER = '[Stock-issue Details] Clear Sort and Filter',

  RESET_ERROR = '[stock-issue] Reset Error',

  UPDATE_ITEM_LIST_STATUS = '[Stock-issue Details] Update Item List Status',
  UPDATE_ITEM_LIST_STATUS_SUCCESS = '[Stock-issue Details] Update Item List Status Success',
  UPDATE_ITEM_LIST_STATUS_FAILURE = '[Stock-issue Details] Update Item List Status Failure',

  LOAD_TOTAL_WEIGHT_AND_VALUE = '[Stock-issue Details] Load Total measured Weight and value',
  LOAD_TOTAL_WEIGHT_AND_VALUE_SUCCESS = '[Stock-issue Details] Load Total measured Weight and value Success',
  LOAD_TOTAL_WEIGHT_AND_VALUE_FAILURE = '[Stock-issue Details] Load Total measured Weight and value Failure',

  LOAD_ISSUE_HISTORY = '[Stock-issue] Load History',
  LOAD_ISSUE_HISTORY_SUCCESS = '[Stock-issue] Load History Success',
  LOAD_ISSUE_HISTORY_FAILURE = '[Stock-issue] Load History Failure',

  RESET_LOADED_HISTORY = '[Stock-issue] Clear Loaded History',

  LOAD_SELECTED_HISTORY = '[Stock-issue Details] Load Selected History',
  LOAD_SELECTED_HISTORY_SUCCESS = '[Stock-issue Details] Load Selected History Success',
  LOAD_SELECTED_HISTORY_FAILURE = '[Stock-issue Details] Load Selected History Failure',

  LOAD_SELECTED_HISTORY_ITEMS = '[Stock-issue Details] Load Selected History Items',
  LOAD_SELECTED_HISTORY_ITEMS_SUCCESS = '[Stock-issue Details] Load Selected History Items Success',
  LOAD_SELECTED_HISTORY_ITEMS_FAILURE = '[Stock-issue Details] Load Selected History Items Failure',

  CLEAR_SELECTED_HISTORY_ITEMS = '[Stock-issue history Details] Clear Selected History Items',

  LOAD_SELECTED_HISTORY_ITEMS_COUNT = '[Stock-issue Details] Load Selected History Items Count',
  LOAD_SELECTED_HISTORY_ITEMS_COUNT_SUCCESS = '[Stock-issue Details] Load Selected History Items Count Success',
  LOAD_SELECTED_HISTORY_ITEMS_COUNT_FAILURE = '[Stock-issue Details] Load Selected History Items Count Failure',

  SET_ADAVANCED_FILTER_DATA = '[Stock-Issue] Set history Adavanced Filter',
  CLEAR_ADAVANCED_FILTER_DATA = '[Stock-Issue] Clear history Adavanced Filter',

  // cancel STN

  LOAD_PENDING_ISSUE_TO_CANCEL_STN = '[ Stock-Issue ] Load pending issue  STN List to Cancel',
  LOAD_PENDING_ISSUE_TO_CANCEL_STN_SUCCESS = '[ Stock-Issue ] Load pending issue  STN List to Cancel Success',
  LOAD_PENDING_ISSUE_TO_CANCEL_STN_FAILURE = '[ Stock-Issue ] Load pending issue  STN List to Cancel Failure',

  LOAD_CANCEL_ISSUES_COUNT = '[Stock-issue] Load Cancel Issues Count',
  LOAD_CANCEL_ISSUES_COUNT_SUCCESS = '[Stock-issue] Load Cancel Issues Count Success',
  LOAD_CANCEL_ISSUES_COUNT_FAILURE = '[Stock-issue] Load Cancel Issues Count Failure',

  LOAD_CANCEL_ISSUES_DETAILS = '[Stock-issue] Load CancelIssues Details',
  LOAD_CANCEL_ISSUES_DETAILS_SUCCESS = '[Stock-issue] Load CancelIssues Details Success',
  LOAD_CANCEL_ISSUES_DETAILS_FAILURE = '[Stock-issue] Load CancelIssues Details Failure',

  LOAD_CANCEL_ISSUES_ITEMS = '[Stock-issue Details] Load Cancel Issues Items',
  LOAD_CANCEL_ISSUES_ITEMS_SUCCESS = '[Stock-issue Details] Load Cancel Issues Items Success',
  LOAD_CANCEL_ISSUES_ITEMS_FAILURE = '[Stock-issue Details] Load Cancel Issues Items Failure',

  LOAD_CANCEL_ISSUES_ITEMS_COUNT = '[Stock-issue Details] Load Cancel Issues Items Count',
  LOAD_CANCEL_ISSUES_ITEMS_COUNT_SUCCESS = '[Stock-issue Details] Load Cancel Issues Items Count Success',
  LOAD_CANCEL_ISSUES_ITEMS_COUNT_FAILURE = '[Stock-issue Details] Load Cancel Issues Items Count Failure',

  CANCEL_ISSUE_STN = '[Stock-issue Details] Cancel Issue STN',
  CANCEL_ISSUE_STN_SUCCESS = '[Stock-issue Details]  Cancel Issue STN Success',
  CANCEL_ISSUE_STN_FAILURE = '[Stock-issue Details]  Cancel Issue STN Failure',

  CLEAR_PENDING_ISSUES_FOR_CANCEL = '[Stock-issue] Clear Pending Issues for Cancel',

  REGENERATE_FILE = '[Stock-issue Details] Regenerate File',
  REGENERATE_FILE_SUCCESS = '[Stock-issue Details]  Regenerate File Success',
  REGENERATE_FILE_FAILURE = '[Stock-issue Details]  Regenerate File Failure',

  // Image

  LOAD_THUMBNAIL_IMAGE_URL = '[ Stock-issue ] Load Thumbnail Image Url',
  LOAD_THUMBNAIL_IMAGE_URL_SUCCESS = '[ Stock-issue ] Load Thumbnail Image Url Success',
  LOAD_THUMBNAIL_IMAGE_URL_FAILURE = '[ Stock-issue ] Load Thumbnail Image Url Failure',

  LOAD_IMAGE_URL = '[ Stock-issue ] Load Image Url',
  LOAD_IMAGE_URL_SUCCESS = '[ Stock-issue ] Load Image Url Success',
  LOAD_IMAGE_URL_FAILURE = '[ Stock-issue ] Load Image Url Failure',
}

export class LoadFactoryIssuePendingSTN implements Action {
  readonly type = StockIssueActionTypes.LOAD_PENDING_ISSUE_TO_FACTORY_STN;
  constructor(public payload: LoadPendingIssuePayload) {}
}
export class LoadFactoryIssuePendingSTNSuccess implements Action {
  readonly type =
    StockIssueActionTypes.LOAD_PENDING_ISSUE_TO_FACTORY_STN_SUCCESS;
  constructor(
    public payload: { response: StockRequestNote[]; count: number }
  ) {}
}
export class LoadFactoryIssuePendingSTNFailure implements Action {
  readonly type =
    StockIssueActionTypes.LOAD_PENDING_ISSUE_TO_FACTORY_STN_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadBoutiqueIssuePendingSTN implements Action {
  readonly type = StockIssueActionTypes.LOAD_PENDING_ISSUE_TO_BOUTIQUE_STN;
  constructor(public payload: LoadPendingIssuePayload) {}
}
export class LoadBoutiqueIssuePendingSTNSuccess implements Action {
  readonly type =
    StockIssueActionTypes.LOAD_PENDING_ISSUE_TO_BOUTIQUE_STN_SUCCESS;
  constructor(
    public payload: { response: StockRequestNote[]; count: number }
  ) {}
}
export class LoadBoutiqueIssuePendingSTNFailure implements Action {
  readonly type =
    StockIssueActionTypes.LOAD_PENDING_ISSUE_TO_BOUTIQUE_STN_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadMerchantIssuePendingSTN implements Action {
  readonly type = StockIssueActionTypes.LOAD_PENDING_ISSUE_TO_MERCHANT_STN;
  constructor(public payload: LoadPendingIssuePayload) {}
}
export class LoadMerchantIssuePendingSTNSuccess implements Action {
  readonly type =
    StockIssueActionTypes.LOAD_PENDING_ISSUE_TO_MERCHANT_STN_SUCCESS;
  constructor(
    public payload: { response: StockRequestNote[]; count: number }
  ) {}
}
export class LoadMerchantIssuePendingSTNFailure implements Action {
  readonly type =
    StockIssueActionTypes.LOAD_PENDING_ISSUE_TO_MERCHANT_STN_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadIssueSTNCount implements Action {
  readonly type = StockIssueActionTypes.LOAD_ISSUES_COUNT;
}
export class LoadIssueSTNCountSuccess implements Action {
  readonly type = StockIssueActionTypes.LOAD_ISSUES_COUNT_SUCCESS;
  constructor(public payload: LoadIssueSTNCountsPayload) {}
}
export class LoadIssueSTNCountFailure implements Action {
  readonly type = StockIssueActionTypes.LOAD_ISSUES_COUNT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchPendingIssues implements Action {
  readonly type = StockIssueActionTypes.SEARCH_PENDING_ISSUES;
  constructor(public payload: SearchPendingPayload) {}
}
export class SearchPendingIssuesSuccess implements Action {
  readonly type = StockIssueActionTypes.SEARCH_PENDING_ISSUES_SUCCESS;
  constructor(public payload: StockRequestNote[]) {}
}
export class SeachPendingIssuesFailure implements Action {
  readonly type = StockIssueActionTypes.SEARCH_PENDING_ISSUES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchClear implements Action {
  readonly type = StockIssueActionTypes.SEARCH_CLEAR;
}

export class ResetStockIssueList implements Action {
  readonly type = StockIssueActionTypes.RESET_STOCK_ISSUE_LIST;
}

export class LoadSelectedIssue implements Action {
  readonly type = StockIssueActionTypes.LOAD_SELECTED_ISSUE;
  constructor(public payload: LoadSelectedPayload) {}
}
export class LoadSelectedIssueSuccess implements Action {
  readonly type = StockIssueActionTypes.LOAD_SELECTED_ISSUE_SUCCESS;
  constructor(public payload: StockRequestNote) {}
}
export class LoadSelectedIssueFailure implements Action {
  readonly type = StockIssueActionTypes.LOAD_SELECTED_ISSUE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadItems implements Action {
  readonly type = StockIssueActionTypes.LOAD_ITEMS;
  constructor(public payload: LoadIssueItemPayload) {}
}
export class LoadItemsSuccess implements Action {
  readonly type = StockIssueActionTypes.LOAD_ITEMS_SUCCESS;
  constructor(public payload: { items: IssueInventoryItem[]; count: number }) {}
}
export class LoadItemsFailure implements Action {
  readonly type = StockIssueActionTypes.LOAD_ITEMS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ClearItems implements Action {
  readonly type = StockIssueActionTypes.CLEAR_ITEMS;
}
export class LoadIssueItemsTotalCount implements Action {
  readonly type = StockIssueActionTypes.LOAD_ISSUE_ITEMS_COUNT;
  constructor(public payload: LoadIssueItemsTotalCountPayload) {}
}
export class LoadIssueItemsTotalCountSuccess implements Action {
  readonly type = StockIssueActionTypes.LOAD_ISSUE_ITEMS_COUNT_SUCCESS;
  constructor(public payload: LoadIssueItemsTotalCountSuccessPayload) {}
}
export class LoadIssueItemsTotalCountFailure implements Action {
  readonly type = StockIssueActionTypes.LOAD_ISSUE_ITEMS_COUNT_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class UpdateAllItems implements Action {
  readonly type = StockIssueActionTypes.UPDATE_ALL_ITEM;
  constructor(public payload: UpdateAllItemPayload) {}
}
export class UpdateAllItemsSuccess implements Action {
  readonly type = StockIssueActionTypes.UPDATE_ALL_ITEM_SUCCESS;
  constructor(public payload: boolean) {}
}
export class UpdateAllItemsFailure implements Action {
  readonly type = StockIssueActionTypes.UPDATE_ALL_ITEM_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class ValidateItem implements Action {
  readonly type = StockIssueActionTypes.VALIDATE_ITEM;
  constructor(public payload: ItemToleranceValidate) {}
}
export class ValidateItemSuccess implements Action {
  readonly type = StockIssueActionTypes.VALIDATE_ITEM_SUCCESS;
  constructor(public payload: { itemId: string; isSuccess: boolean }) {}
}
export class ValidateItemFailure implements Action {
  readonly type = StockIssueActionTypes.VALIDATE_ITEM_FAILURE;
  constructor(public payload: { itemId: string; error: CustomErrors }) {}
}

export class UpdateItem implements Action {
  readonly type = StockIssueActionTypes.UPDATE_ITEM;
  constructor(public payload: UpdateItemPayload) {}
}
export class UpdateItemSuccess implements Action {
  readonly type = StockIssueActionTypes.UPDATE_ITEM_SUCCESS;
  constructor(public payload: IssueInventoryItem) {}
}
export class UpdateItemFailure implements Action {
  readonly type = StockIssueActionTypes.UPDATE_ITEM_FAILURE;
  constructor(public payload: UpdateItemFailurePayload) {}
}

export class ConfirmIssue implements Action {
  readonly type = StockIssueActionTypes.CONFIRM_ISSUE;
  constructor(public payload: ConfirmIssuePayload) {}
}
export class ConfirmIssueSuccess implements Action {
  readonly type = StockIssueActionTypes.CONFIRM_ISSUE_SUCCESS;
  constructor(public payload: StockRequestNote) {}
}
export class ConfirmIssueFailure implements Action {
  readonly type = StockIssueActionTypes.CONFIRM_ISSUE_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadCourierDetails implements Action {
  readonly type = StockIssueActionTypes.LOAD_COURIER_DETAILS;
  constructor(public payload: string) {}
}
export class LoadCourierDetailsSuccess implements Action {
  readonly type = StockIssueActionTypes.LOAD_COURIER_DETAILS_SUCCESS;
  constructor(public payload: string[]) {}
}
export class LoadCourierDetailsFailure implements Action {
  readonly type = StockIssueActionTypes.LOAD_COURIER_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadEmployeeCodes implements Action {
  readonly type = StockIssueActionTypes.LOAD_EMPLOYEE_CODES;
}
export class LoadEmployeeCodesSuccess implements Action {
  readonly type = StockIssueActionTypes.LOAD_EMPLOYEE_CODES_SUCCESS;
  constructor(public payload: string[]) {}
}
export class LoadEmployeeCodesFailure implements Action {
  readonly type = StockIssueActionTypes.LOAD_EMPLOYEE_CODES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadEmployeeDetails implements Action {
  readonly type = StockIssueActionTypes.LOAD_EMPLOYEE_DETAILS;
  constructor(public payload: string) {}
}
export class LoadEmployeeDetailsSuccess implements Action {
  readonly type = StockIssueActionTypes.LOAD_EMPLOYEE_DETAILS_SUCCESS;
  constructor(public payload: StoreUser[]) {}
}
export class LoadEmployeeDetailsFailure implements Action {
  readonly type = StockIssueActionTypes.LOAD_EMPLOYEE_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadProductCategories implements Action {
  readonly type = StockIssueActionTypes.LOAD_PRODUCT_CATEGORIES;
}

export class LoadProductCategoriesSuccess implements Action {
  readonly type = StockIssueActionTypes.LOAD_PRODUCT_CATEGORIES_SUCCESS;
  constructor(public payload: ProductCategory[]) {}
}

export class LoadProductCategoriesFailure implements Action {
  readonly type = StockIssueActionTypes.LOAD_PRODUCT_CATEGORIES_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadProductGroups implements Action {
  readonly type = StockIssueActionTypes.LOAD_PROUDCT_GROUPS;
}

export class LoadProductGroupsSuccess implements Action {
  readonly type = StockIssueActionTypes.LOAD_PROUDCT_GROUPS_SUCCESS;
  constructor(public payload: ProductGroup[]) {}
}

export class LoadProductGroupsFailure implements Action {
  readonly type = StockIssueActionTypes.LOAD_PROUDCT_GROUPS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadStuddedProductGroups implements Action {
  readonly type = StockIssueActionTypes.LOAD_STUDDED_PRODUCT_GROUPS;
}
export class LoadStuddedProductGroupsSuccess implements Action {
  readonly type = StockIssueActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_SUCCESS;
  constructor(public payload: string[]) {}
}
export class LoadStuddedProductGroupsFailure implements Action {
  readonly type = StockIssueActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SetFilterDataApprovedProducts implements Action {
  readonly type = StockIssueActionTypes.SET_FILTER_DATA_APPROVED_PRODUCTS;
  constructor(public payload: { [key: string]: Filter[] }) {}
}
export class SetFilterDataSelectedProducts implements Action {
  readonly type = StockIssueActionTypes.SET_FILTER_DATA_SELECTED_PRODUCTS;
  constructor(public payload: { [key: string]: Filter[] }) {}
}
export class SetSortDataApprovedProducts implements Action {
  readonly type = StockIssueActionTypes.SET_SORT_DATA_APPROVED_PRODUCTS;
  constructor(public payload: Column[]) {}
}
export class SetSortDataSelectedProducts implements Action {
  readonly type = StockIssueActionTypes.SET_SORT_DATA_SELECTED_PRODUCTS;
  constructor(public payload: Column[]) {}
}
export class ClearSortAndFilter implements Action {
  readonly type = StockIssueActionTypes.CLEAR_SORT_AND_FILTER;
}
export class ResetError implements Action {
  readonly type = StockIssueActionTypes.RESET_ERROR;
}

export class UpdateItemListStatus implements Action {
  readonly type = StockIssueActionTypes.UPDATE_ITEM_LIST_STATUS;
  constructor(public payload: UpdateItemListStatusPayload) {}
}

export class UpdateItemListStatusSuccess implements Action {
  readonly type = StockIssueActionTypes.UPDATE_ITEM_LIST_STATUS_SUCCESS;

  constructor(public payload: RequestList) {}
}

export class UpdateItemListStatusFailure implements Action {
  readonly type = StockIssueActionTypes.UPDATE_ITEM_LIST_STATUS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadTotalMeasuredWeightAndValue implements Action {
  readonly type = StockIssueActionTypes.LOAD_TOTAL_WEIGHT_AND_VALUE;
  constructor(public payload: LoadSelectedPayload) {}
}
export class LoadTotalMeasuredWeightAndValueSuccess implements Action {
  readonly type = StockIssueActionTypes.LOAD_TOTAL_WEIGHT_AND_VALUE_SUCCESS;
  constructor(public payload: MeasuredWeightAndValuePayload) {}
}
export class LoadTotalMeasuredWeightAndValueFailure implements Action {
  readonly type = StockIssueActionTypes.LOAD_TOTAL_WEIGHT_AND_VALUE_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadIssueHistory implements Action {
  readonly type = StockIssueActionTypes.LOAD_ISSUE_HISTORY;
  constructor(public payload: LoadHistoryRequestPayload) {}
}
export class LoadIssueHistorySuccess implements Action {
  readonly type = StockIssueActionTypes.LOAD_ISSUE_HISTORY_SUCCESS;
  constructor(
    public payload: { response: StockRequestNote[]; count: number }
  ) {}
}
export class LoadIssueHistoryFailure implements Action {
  readonly type = StockIssueActionTypes.LOAD_ISSUE_HISTORY_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class ResetLoadedHistory implements Action {
  readonly type = StockIssueActionTypes.RESET_LOADED_HISTORY;
}
export class LoadSelectedHistory implements Action {
  readonly type = StockIssueActionTypes.LOAD_SELECTED_HISTORY;
  constructor(public payload: StockIssueSelectedHistoryPayload) {}
}
export class LoadSelectedHistorySuccess implements Action {
  readonly type = StockIssueActionTypes.LOAD_SELECTED_HISTORY_SUCCESS;
  constructor(public payload: StockRequestNote) {}
}
export class LoadSelectedHistoryFailure implements Action {
  readonly type = StockIssueActionTypes.LOAD_SELECTED_HISTORY_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadHistoryItems implements Action {
  readonly type = StockIssueActionTypes.LOAD_SELECTED_HISTORY_ITEMS;
  constructor(public payload: LoadStockIssueHistoryItemsPayload) {}
}
export class LoadHistoryItemsSuccess implements Action {
  readonly type = StockIssueActionTypes.LOAD_SELECTED_HISTORY_ITEMS_SUCCESS;
  constructor(public payload: { items: IssueInventoryItem[]; count: number }) {}
}
export class LoadHistoryItemsFailure implements Action {
  readonly type = StockIssueActionTypes.LOAD_SELECTED_HISTORY_ITEMS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ClearHistoryItems implements Action {
  readonly type = StockIssueActionTypes.CLEAR_SELECTED_HISTORY_ITEMS;
}
export class LoadHistoryItemsTotalCount implements Action {
  readonly type = StockIssueActionTypes.LOAD_SELECTED_HISTORY_ITEMS_COUNT;
  constructor(public payload: LoadStockIssueHistoryItemsPayload) {}
}
export class LoadHistoryItemsTotalCountSuccess implements Action {
  readonly type =
    StockIssueActionTypes.LOAD_SELECTED_HISTORY_ITEMS_COUNT_SUCCESS;
  constructor(public payload: number) {}
}
export class LoadHistoryItemsTotalCountFailure implements Action {
  readonly type =
    StockIssueActionTypes.LOAD_SELECTED_HISTORY_ITEMS_COUNT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SetHistoryAdvancedFilterData implements Action {
  readonly type = StockIssueActionTypes.SET_ADAVANCED_FILTER_DATA;
  constructor(public payload: IssueAdvanceFilterPayload) {}
}
export class ClearHistoryAdvancedFilterData implements Action {
  readonly type = StockIssueActionTypes.CLEAR_ADAVANCED_FILTER_DATA;
  constructor(public payload: number) {}
}

// cancel STN

export class LoadCancelIssuePendingSTN implements Action {
  readonly type = StockIssueActionTypes.LOAD_PENDING_ISSUE_TO_CANCEL_STN;
  constructor(public payload: LoadCancelIssuesSTNPayload) {}
}
export class LoadCancelIssuePendingSTNSuccess implements Action {
  readonly type =
    StockIssueActionTypes.LOAD_PENDING_ISSUE_TO_CANCEL_STN_SUCCESS;
  constructor(
    public payload: { response: StockRequestNote[]; count: number }
  ) {}
}
export class LoadCancelIssuePendingSTNFailure implements Action {
  readonly type =
    StockIssueActionTypes.LOAD_PENDING_ISSUE_TO_CANCEL_STN_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadCancelIssueCount implements Action {
  readonly type = StockIssueActionTypes.LOAD_CANCEL_ISSUES_COUNT;
  constructor(public payload: LoadCancelIssuesPayload) {}
}
export class LoadCancelIssueCountSuccess implements Action {
  readonly type = StockIssueActionTypes.LOAD_CANCEL_ISSUES_COUNT_SUCCESS;
  constructor(public payload: number) {}
}
export class LoadCancelIssueCountFailure implements Action {
  readonly type = StockIssueActionTypes.LOAD_CANCEL_ISSUES_COUNT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadCancelIssueDetails implements Action {
  readonly type = StockIssueActionTypes.LOAD_CANCEL_ISSUES_DETAILS;
  constructor(public payload: LoadCancelIssuesPayload) {}
}
export class LoadCancelIssueDetailsSuccess implements Action {
  readonly type = StockIssueActionTypes.LOAD_CANCEL_ISSUES_DETAILS_SUCCESS;
  constructor(public payload: StockRequestNote) {}
}
export class LoadCancelIssueDetailsFailure implements Action {
  readonly type = StockIssueActionTypes.LOAD_CANCEL_ISSUES_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadCancelIssueItems implements Action {
  readonly type = StockIssueActionTypes.LOAD_CANCEL_ISSUES_ITEMS;
  constructor(public payload: LoadCancelIssuetemsPayload) {}
}
export class LoadCancelIssueItemsSuccess implements Action {
  readonly type = StockIssueActionTypes.LOAD_CANCEL_ISSUES_ITEMS_SUCCESS;
  constructor(public payload: { items: IssueInventoryItem[]; count: number }) {}
}
export class LoadCancelIssueItemsFailure implements Action {
  readonly type = StockIssueActionTypes.LOAD_CANCEL_ISSUES_ITEMS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadCancelIssueItemsCount implements Action {
  readonly type = StockIssueActionTypes.LOAD_CANCEL_ISSUES_ITEMS_COUNT;
  constructor(public payload: LoadCancelIssuesPayload) {}
}
export class LoadCancelIssueItemsCountSuccess implements Action {
  readonly type = StockIssueActionTypes.LOAD_CANCEL_ISSUES_ITEMS_COUNT_SUCCESS;
  constructor(public payload: number) {}
}
export class LoadCancelIssueItemsCountFailure implements Action {
  readonly type = StockIssueActionTypes.LOAD_CANCEL_ISSUES_ITEMS_COUNT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class CancelIssueSTN implements Action {
  readonly type = StockIssueActionTypes.CANCEL_ISSUE_STN;
  constructor(public payload: LoadCancelIssuesPayload) {}
}
export class CancelIssueSTNSuccess implements Action {
  readonly type = StockIssueActionTypes.CANCEL_ISSUE_STN_SUCCESS;
  constructor(public payload: StockRequestNote) {}
}
export class CancelIssueSTNFailure implements Action {
  readonly type = StockIssueActionTypes.CANCEL_ISSUE_STN_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ClearPendingIssuesForCancel implements Action {
  readonly type = StockIssueActionTypes.CLEAR_PENDING_ISSUES_FOR_CANCEL;
}

export class RegenerateFile implements Action {
  readonly type = StockIssueActionTypes.REGENERATE_FILE;
  constructor(public payload: RegenerateFilePayload) {}
}
export class RegenerateFileSuccess implements Action {
  readonly type = StockIssueActionTypes.REGENERATE_FILE_SUCCESS;
  constructor(public payload: RegenerateFileResponse) {}
}
export class RegenerateFileFailure implements Action {
  readonly type = StockIssueActionTypes.REGENERATE_FILE_FAILURE;
  constructor(public payload: CustomErrors) {}
}
// Image
export class LoadThumbnailImageUrl implements Action {
  readonly type = StockIssueActionTypes.LOAD_THUMBNAIL_IMAGE_URL;
  constructor(public payload: ImageReqPayload) {}
}
export class LoadThumbnailImageUrlSuccess implements Action {
  readonly type = StockIssueActionTypes.LOAD_THUMBNAIL_IMAGE_URL_SUCCESS;
  constructor(public payload:  ImageResponse) {}
}
export class LoadThumbnailImageUrlFailure implements Action {
  readonly type = StockIssueActionTypes.LOAD_THUMBNAIL_IMAGE_URL_FAILURE;
  constructor(public payload:  ImageResponse) {}
}

export class LoadImageUrl implements Action {
  readonly type = StockIssueActionTypes.LOAD_IMAGE_URL;
  constructor(public payload: ImageReqPayload) {}
}
export class LoadImageUrlSuccess implements Action {
  readonly type = StockIssueActionTypes.LOAD_IMAGE_URL_SUCCESS;
  constructor(public payload:  ImageResponse) {}
}
export class LoadImageUrlFailure implements Action {
  readonly type = StockIssueActionTypes.LOAD_IMAGE_URL_FAILURE;
  constructor(public payload:  ImageResponse) {}
}

export type StockIssueActions =
  | LoadFactoryIssuePendingSTN
  | LoadFactoryIssuePendingSTNSuccess
  | LoadFactoryIssuePendingSTNFailure
  | LoadBoutiqueIssuePendingSTN
  | LoadBoutiqueIssuePendingSTNSuccess
  | LoadBoutiqueIssuePendingSTNFailure
  | LoadMerchantIssuePendingSTN
  | LoadMerchantIssuePendingSTNSuccess
  | LoadMerchantIssuePendingSTNFailure
  | LoadIssueSTNCount
  | LoadIssueSTNCountSuccess
  | LoadIssueSTNCountFailure
  | SearchPendingIssues
  | SearchPendingIssuesSuccess
  | SeachPendingIssuesFailure
  | SearchClear
  | ResetStockIssueList
  | LoadSelectedIssue
  | LoadSelectedIssueSuccess
  | LoadSelectedIssueFailure
  | LoadItems
  | LoadItemsSuccess
  | LoadItemsFailure
  | ClearItems
  | LoadIssueItemsTotalCount
  | LoadIssueItemsTotalCountSuccess
  | LoadIssueItemsTotalCountFailure
  | UpdateAllItems
  | UpdateAllItemsSuccess
  | UpdateAllItemsFailure
  | ValidateItem
  | ValidateItemSuccess
  | ValidateItemFailure
  | UpdateItem
  | UpdateItemSuccess
  | UpdateItemFailure
  | ConfirmIssue
  | ConfirmIssueSuccess
  | ConfirmIssueFailure
  | LoadCourierDetails
  | LoadCourierDetailsSuccess
  | LoadCourierDetailsFailure
  | LoadEmployeeCodes
  | LoadEmployeeCodesSuccess
  | LoadEmployeeCodesFailure
  | LoadEmployeeDetails
  | LoadEmployeeDetailsSuccess
  | LoadEmployeeDetailsFailure
  | LoadProductGroups
  | LoadProductGroupsSuccess
  | LoadProductGroupsFailure
  | LoadProductCategories
  | LoadProductCategoriesSuccess
  | LoadProductCategoriesFailure
  | LoadStuddedProductGroups
  | LoadStuddedProductGroupsSuccess
  | LoadStuddedProductGroupsFailure
  | SetFilterDataApprovedProducts
  | SetFilterDataSelectedProducts
  | SetSortDataApprovedProducts
  | SetSortDataSelectedProducts
  | ClearSortAndFilter
  | ResetError
  | UpdateItemListStatus
  | UpdateItemListStatusSuccess
  | UpdateItemListStatusFailure
  | LoadTotalMeasuredWeightAndValue
  | LoadTotalMeasuredWeightAndValueSuccess
  | LoadTotalMeasuredWeightAndValueFailure
  | LoadIssueHistory
  | LoadIssueHistorySuccess
  | LoadIssueHistoryFailure
  | ResetLoadedHistory
  | LoadSelectedHistory
  | LoadSelectedHistorySuccess
  | LoadSelectedHistoryFailure
  | LoadHistoryItems
  | LoadHistoryItemsSuccess
  | LoadHistoryItemsFailure
  | ClearHistoryItems
  | LoadHistoryItemsTotalCount
  | LoadHistoryItemsTotalCountSuccess
  | LoadHistoryItemsTotalCountFailure
  | SetHistoryAdvancedFilterData
  | ClearHistoryAdvancedFilterData
  | LoadCancelIssuePendingSTN
  | LoadCancelIssuePendingSTNSuccess
  | LoadCancelIssuePendingSTNFailure
  | LoadCancelIssueCount
  | LoadCancelIssueCountSuccess
  | LoadCancelIssueCountFailure
  | LoadCancelIssueDetails
  | LoadCancelIssueDetailsSuccess
  | LoadCancelIssueDetailsFailure
  | LoadCancelIssueItems
  | LoadCancelIssueItemsSuccess
  | LoadCancelIssueItemsFailure
  | LoadCancelIssueItemsCount
  | LoadCancelIssueItemsCountSuccess
  | LoadCancelIssueItemsCountFailure
  | CancelIssueSTN
  | CancelIssueSTNSuccess
  | CancelIssueSTNFailure
  | ClearPendingIssuesForCancel
  | LoadImageUrl
  | LoadImageUrlSuccess
  | LoadImageUrlFailure
  | LoadThumbnailImageUrl
  | LoadThumbnailImageUrlSuccess
  | LoadThumbnailImageUrlFailure
  | RegenerateFile
  | RegenerateFileSuccess
  | RegenerateFileFailure;
