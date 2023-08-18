import {
  CFAddress,
  CustomErrors,
  SearchItemPayload,
  SearchItemPayloadSuccess,
  CreateIssueItemsPayload,
  LoadItemsSuccessPayload,
  RemoveSelectedItemsPayload,
  ConfirmStockReturnPayload,
  LoadStockReturnItemsPayload,
  StockReturnItem,
  ProductCategory,
  ProductGroup,
  StoreUser,
  LoadStockIssueInvoiceHistoryPayload,
  StockIssueInvoiceHistorySuccess,
  HistoryAdvancedFilterPayload,
  LoadStockIssueItemsPayloadCfa,
  ImageResponse,
  ImageReqPayload
} from '@poss-web/shared/models';

import { Action } from '@ngrx/store';

/**
 * The  enum defined for  list of actions of return invoice
 */
export enum StockReturnActionTypes {
  CREATE_REQUEST_TO_CFA = '[return-invoice-cfa] Create Request To Cfa',
  CREATE_REQUEST_TO_CFA_SUCCESS = ' [return-invoice-cfa] Create Request To Cfa Success',
  CREATE_REQUEST_TO_CFA_FAILURE = "[return-invoice-cfa'] Create Request To Cfa Failure",

  CONFIRM_ISSUE = '[return-invoice-cfa] Confirm Issue',
  CONFIRM_ISSUE_SUCCESS = '[return-invoice-cfa] Confirm Issue Success',
  CONFIRM_ISSUE_FAILURE = '[return-invoice-cfa] Confirm Issue Failure',

  SEARCH_ITEM = '[return-invoice-cfa] Search Item',
  SEARCH_ITEM_SUCCESS = '[return-invoice-cfa] Search Item Success',
  SEARCH_ITEM_FAILURE = '[return-invoice-cfa] Search Item Failure',
  CLEAR_SEARCH = '[return-invoce-cfa] Clear Search',

  CLEAR_SEARCH_ITEMS = '[return-invoce-cfa] Clear Search Items',
  CREATE_ISSUE_ITEMS = '[return-invoice-cfa] Create Issue Items',
  CREATE_ISSUE_ITEMS_SUCCESS = '[return-invoice-cfa] Create Issue Items Success',
  CREATE_ISSUE_ITEMS_FAILURE = '[return-invoice-cfa] Create Issue Items Failure',

  LOAD_CFA_LOCATION_CODE = '[return-invoice-cfa] Load CFA Location Code',
  LOAD_CFA_LOCATION_CODE_SUCCESS = '[return-invoice-cfa] Load CFA Location Code Success',
  LOAD_CFA_LOCATION_CODE_FAILURE = '[return-invoice-cfa] Load CFA Location Code Failure',

  LOAD_ITEMS = '[return-invoice-cfa] Load Item ',
  LOAD_ITEM_SUCCESS = '[return-invoice-cfa]Load Item Success',
  LOAD_ITEM_FAILURE = '[return-invoice-cfa]Load Item Failure',

  REMOVE_SELECTED_ITEMS = '[return-invoice-cfa]Remove Selected Items',
  REMOVE_SELECTED_ITEMS_SUCCESS = '[return-invoice-cfa]Remove Selected Items Success',
  REMOVE_SELECTED_ITEMS_FAILURE = '[return-invoice-cfa]Remove Selected Items Failure',

  SELECTED_PRODUCTS_SEARCH = '[return-invoice-cfa] Selected Products Search ',
  SELECTED_PRODUCTS_SEARCH_SUCESSS = '[return-invoice-cfa] Selected Products Search Success',
  SELECTED_PRODUCTS_SEARCH_FAILURE = '[return-invoice-cfa] Search Prodcuts Search Failure',

  LOAD_COURIER_DETAILS = '[return-invoice-cfa]Load Courier Details',
  LOAD_COURIER_DETAILS_SUCCESS = '[return-invoice-cfa]Load Courier Details Success',
  LOAD_COURIER_DETAILS_FAILURE = '[return-invoice-cfa]Load Courier Details Failure',

  LOAD_HEADER_LEVEL_DETAILS = '[return-invoice-cfa]Load Header Level Details',
  LOAD_HEADER_LEVEL_DETAILS_SUCCESS = '[return-invoice-cfa]Load Header Level Details Success',
  LOAD_HEADER_LEVEL_DETAILS_FAILURE = '[return-invoice-cfa]Load Header Level Details Failure',

  LOAD_PRODUCT_CATEGORIES = '[return-invoice-cfa] Load product categories',
  LOAD_PRODUCT_CATEGORIES_SUCCESS = '[return-invoice-cfa] Load product categories Success',
  LOAD_PRODUCT_CATEGORIES_FAILURE = '[return-invoice-cfa] Load product categories Failure',

  LOAD_PROUDCT_GROUPS = '[return-invoice-cfa] Load product groups',
  LOAD_PROUDCT_GROUPS_SUCCESS = '[return-invoice-cfa] Load product groups Success',
  LOAD_PROUDCT_GROUPS_FAILURE = '[return-invoice-cfa] Load product groups Failure',

  LOAD_EMPLOYEE_DETAILS = '[return-invoice-cfa] Load Employee Details',
  LOAD_EMPLOYEE_DETAILS_SUCCESS = '[return-invoice-cfa] Load Employee Details Success',
  LOAD_EMPLOYEE_DETAILS_FAILURE = '[return-invoice-cfa] Load Employee Details Failure',

  LOAD_EMPLOYEE_CODES = '[return-invoice-cfa] Load Employee Codes',
  LOAD_EMPLOYEE_CODES_SUCCESS = '[return-invoice-cfa] Load Employee Codes Success',
  LOAD_EMPLOYEE_CODES_FAILURE = '[return-invoice-cfa] Load Employee Codes Failure',

  LOAD_ISSUE_INVOICE_HISTORY = '[Stock-return-invoice] Load Issue Invoice History',
  LOAD_ISSUE_INVOICE_HISTORY_SUCCESS = '[Stock-return-invoice] Load Issue Invoice History Success',
  LOAD_ISSUE_INVOICE_HISTORY_FAILURE = '[Stock-return-invoice] Load Issue Invoice History Failure',

  STORE_HISTORY_TYPE = '[ Stock-Return ] Store History Type',

  STORE_ADVANCED_FILTER_DATE = '[ Stock-Return ] Store Advanced Filter Data',
  RESET_STOCK_RETURN_HISTORY = '[ Stock-Return ] Reset Stock Return History',
  RESET_STOCK_RETURN_ITEMS = '[ Stock-Return ] Reset Stock Return Items',
  LOAD_STUDDED_PRODUCT_GROUPS = '[stock-return]  Load Studded Product Groups ',
  LOAD_STUDDED_PRODUCT_GROUPS_SUCCESS = '[stock-return]  Load Studded Product Groups Success ',
  LOAD_STUDDED_PRODUCT_GROUPS_FAILURE = '[stock-return]  Load Studded Product Groups Failure ',
  RESET_ADVANCE_FILTER = '[ Stock-Return ] Reset Advance Filter',

  RESET_ERROR = '[ Stock-Return ] Reset Error',

  LOAD_ITEMS_CFA = '[IssueTEP] Load items Cfa',
  LOAD_ITEMS_SUCCESS_CFA = '[IssueTEP] Load items Success Cfa',
  LOAD_ITEMS_FAILURE_CFA = '[IssueTEP] Load items Failure Cfa',

  // Image

  LOAD_THUMBNAIL_IMAGE_URL = '[ Stock-Receive ] Load Thumbnail Image Url',
  LOAD_THUMBNAIL_IMAGE_URL_SUCCESS = '[ Stock-Receive ] Load Thumbnail Image Url Success',
  LOAD_THUMBNAIL_IMAGE_URL_FAILURE = '[ Stock-Receive ] Load Thumbnail Image Url Failure',

  LOAD_IMAGE_URL = '[ Stock-Receive ] Load Image Url',
  LOAD_IMAGE_URL_SUCCESS = '[ Stock-Receive ] Load Image Url Success',
  LOAD_IMAGE_URL_FAILURE = '[ Stock-Receive ] Load Image Url Failure',
}
/**
 * Return Invoice Actions
 */

export class CreateRequestToCfa implements Action {
  readonly type = StockReturnActionTypes.CREATE_REQUEST_TO_CFA;
}
export class CreateRequestToCfaSuccess implements Action {
  readonly type = StockReturnActionTypes.CREATE_REQUEST_TO_CFA_SUCCESS;
  constructor(public payload: number) {}
}
export class CreateRequestToCfaFailure implements Action {
  readonly type = StockReturnActionTypes.CREATE_REQUEST_TO_CFA_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ConfirmIssue implements Action {
  readonly type = StockReturnActionTypes.CONFIRM_ISSUE;
  constructor(public payload: ConfirmStockReturnPayload) {}
}

export class ConfirmIssueSuccess implements Action {
  readonly type = StockReturnActionTypes.CONFIRM_ISSUE_SUCCESS;
  constructor(public payload: number) {}
}

export class ConfirmIssueFailure implements Action {
  readonly type = StockReturnActionTypes.CONFIRM_ISSUE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchItem implements Action {
  readonly type = StockReturnActionTypes.SEARCH_ITEM;
  constructor(public payload: SearchItemPayload) {}
}

export class SearchItemSuccess implements Action {
  readonly type = StockReturnActionTypes.SEARCH_ITEM_SUCCESS;

  constructor(public payload: SearchItemPayloadSuccess) {}
}
export class SearchItemFailure implements Action {
  readonly type = StockReturnActionTypes.SEARCH_ITEM_FAILURE;
  //TODO: check whether type string or Erros
  constructor(public payload: CustomErrors) {}
}

export class ClearSearch implements Action {
  readonly type = StockReturnActionTypes.CLEAR_SEARCH;
}

export class ClearSearchItems implements Action {
  readonly type = StockReturnActionTypes.CLEAR_SEARCH_ITEMS;
}

export class CreateIssueItems implements Action {
  readonly type = StockReturnActionTypes.CREATE_ISSUE_ITEMS;
  constructor(public payload: CreateIssueItemsPayload) {}
}

export class CreateIssueItemsSuccess implements Action {
  readonly type = StockReturnActionTypes.CREATE_ISSUE_ITEMS_SUCCESS;
}

export class CreateIssueItemsFailure implements Action {
  readonly type = StockReturnActionTypes.CREATE_ISSUE_ITEMS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadCFALocationCode implements Action {
  readonly type = StockReturnActionTypes.LOAD_CFA_LOCATION_CODE;
}
export class LoadCFALocationCodeSuccess implements Action {
  readonly type = StockReturnActionTypes.LOAD_CFA_LOCATION_CODE_SUCCESS;
  constructor(public payload: CFAddress) {}
}
export class LoadCFALocationCodeFailure implements Action {
  readonly type = StockReturnActionTypes.LOAD_CFA_LOCATION_CODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadItems implements Action {
  readonly type = StockReturnActionTypes.LOAD_ITEMS;
  constructor(public payload: LoadStockReturnItemsPayload) {}
}

export class LoadItemSuccess implements Action {
  readonly type = StockReturnActionTypes.LOAD_ITEM_SUCCESS;
  constructor(public payload: LoadItemsSuccessPayload) {}
}
export class LoadItemsFailure implements Action {
  readonly type = StockReturnActionTypes.LOAD_ITEM_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class RemoveSelectedItems implements Action {
  readonly type = StockReturnActionTypes.REMOVE_SELECTED_ITEMS;
  constructor(public payload: RemoveSelectedItemsPayload) {}
}
export class RemoveSelectedItemsSuccess implements Action {
  readonly type = StockReturnActionTypes.REMOVE_SELECTED_ITEMS_SUCCESS;
}
export class RemoveSelectedItemsFailure implements Action {
  readonly type = StockReturnActionTypes.REMOVE_SELECTED_ITEMS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SelectedProductsSearch implements Action {
  readonly type = StockReturnActionTypes.SELECTED_PRODUCTS_SEARCH;
  constructor(public payload: LoadStockReturnItemsPayload) {}
}

export class SelectedProdutsSearchSuccess implements Action {
  readonly type = StockReturnActionTypes.SELECTED_PRODUCTS_SEARCH_SUCESSS;
  constructor(public payload: LoadItemsSuccessPayload) {}
}
export class SelectedProductsSearchFailure implements Action {
  readonly type = StockReturnActionTypes.SELECTED_PRODUCTS_SEARCH_FAILURE;
  //TODO: check whether type string or Erros
  constructor(public payload: CustomErrors) {}
}

export class LoadCourierDetails implements Action {
  readonly type = StockReturnActionTypes.LOAD_COURIER_DETAILS;
}
export class LoadCourierDetailsSuccess implements Action {
  readonly type = StockReturnActionTypes.LOAD_COURIER_DETAILS_SUCCESS;
  constructor(public payload: string[]) {}
}
export class LoadCourierDetailsFailure implements Action {
  readonly type = StockReturnActionTypes.LOAD_COURIER_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadHeaderLevelDetails implements Action {
  readonly type = StockReturnActionTypes.LOAD_HEADER_LEVEL_DETAILS;
  constructor(public payload: number) {}
}
export class LoadHeaderLevelDetailsSuccess implements Action {
  readonly type = StockReturnActionTypes.LOAD_HEADER_LEVEL_DETAILS_SUCCESS;
  constructor(public payload: StockReturnItem) {}
}
export class LoadHeaderLevelDetailsFailure implements Action {
  readonly type = StockReturnActionTypes.LOAD_HEADER_LEVEL_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadProductCategories implements Action {
  readonly type = StockReturnActionTypes.LOAD_PRODUCT_CATEGORIES;
}

export class LoadProductCategoriesSuccess implements Action {
  readonly type = StockReturnActionTypes.LOAD_PRODUCT_CATEGORIES_SUCCESS;
  constructor(public payload: ProductCategory[]) {}
}

export class LoadProductCategoriesFailure implements Action {
  readonly type = StockReturnActionTypes.LOAD_PRODUCT_CATEGORIES_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadProductGroups implements Action {
  readonly type = StockReturnActionTypes.LOAD_PROUDCT_GROUPS;
}

export class LoadProductGroupsSuccess implements Action {
  readonly type = StockReturnActionTypes.LOAD_PROUDCT_GROUPS_SUCCESS;
  constructor(public payload: ProductGroup[]) {}
}

export class LoadProductGroupsFailure implements Action {
  readonly type = StockReturnActionTypes.LOAD_PROUDCT_GROUPS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadEmployeeCodes implements Action {
  readonly type = StockReturnActionTypes.LOAD_EMPLOYEE_CODES;
}
export class LoadEmployeeCodesSuccess implements Action {
  readonly type = StockReturnActionTypes.LOAD_EMPLOYEE_CODES_SUCCESS;
  constructor(public payload: string[]) {}
}
export class LoadEmployeeCodesFailure implements Action {
  readonly type = StockReturnActionTypes.LOAD_EMPLOYEE_CODES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadEmployeeDetails implements Action {
  readonly type = StockReturnActionTypes.LOAD_EMPLOYEE_DETAILS;
  constructor(public payload: string) {}
}
export class LoadEmployeeDetailsSuccess implements Action {
  readonly type = StockReturnActionTypes.LOAD_EMPLOYEE_DETAILS_SUCCESS;
  constructor(public payload: StoreUser[]) {}
}
export class LoadEmployeeDetailsFailure implements Action {
  readonly type = StockReturnActionTypes.LOAD_EMPLOYEE_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadIssueInvoiceHistory implements Action {
  readonly type = StockReturnActionTypes.LOAD_ISSUE_INVOICE_HISTORY;
  constructor(public payload: LoadStockIssueInvoiceHistoryPayload) {}
}
export class LoadIssueInvoiceHistorySucceess implements Action {
  readonly type = StockReturnActionTypes.LOAD_ISSUE_INVOICE_HISTORY_SUCCESS;
  constructor(public payload: StockIssueInvoiceHistorySuccess) {}
}
export class LoadIssueInvoiceHistoryFailure implements Action {
  readonly type = StockReturnActionTypes.LOAD_ISSUE_INVOICE_HISTORY_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class StoreHistoryType implements Action {
  readonly type = StockReturnActionTypes.STORE_HISTORY_TYPE;
  constructor(public payload: string) {}
}
export class StoreAdvancedFilterData implements Action {
  readonly type = StockReturnActionTypes.STORE_ADVANCED_FILTER_DATE;
  constructor(public payload: HistoryAdvancedFilterPayload) {}
}
export class ResetStockReturnHistory implements Action {
  readonly type = StockReturnActionTypes.RESET_STOCK_RETURN_HISTORY;
}
export class ResetStockReturnItems implements Action {
  readonly type = StockReturnActionTypes.RESET_STOCK_RETURN_ITEMS;
}
export class LoadStuddedProductGroups implements Action {
  readonly type = StockReturnActionTypes.LOAD_STUDDED_PRODUCT_GROUPS;
}
export class LoadStuddedProductGroupsSuccess implements Action {
  readonly type = StockReturnActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_SUCCESS;
  constructor(public payload: string[]) {}
}
export class LoadStuddedProductGroupsFailure implements Action {
  readonly type = StockReturnActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class ResetAdavanceFilter implements Action {
  readonly type = StockReturnActionTypes.RESET_ADVANCE_FILTER;
  constructor(public payload: number) {}
}

export class ResetError implements Action {
  readonly type = StockReturnActionTypes.RESET_ERROR;
}

export class LoadItemsCfa implements Action {
  readonly type = StockReturnActionTypes.LOAD_ITEMS_CFA;
  constructor(public payload: LoadStockIssueItemsPayloadCfa) {}
}

export class LoadItemsSuccessCfa implements Action {
  readonly type = StockReturnActionTypes.LOAD_ITEMS_SUCCESS_CFA;
  constructor(public payload: LoadItemsSuccessPayload) {}
}

export class LoadItemsFailureCfa implements Action {
  readonly type = StockReturnActionTypes.LOAD_ITEMS_FAILURE_CFA;
  constructor(public payload: CustomErrors) {}
}

// Image
export class LoadThumbnailImageUrl implements Action {
  readonly type = StockReturnActionTypes.LOAD_THUMBNAIL_IMAGE_URL;
  constructor(public payload: ImageReqPayload) {}
}
export class LoadThumbnailImageUrlSuccess implements Action {
  readonly type = StockReturnActionTypes.LOAD_THUMBNAIL_IMAGE_URL_SUCCESS;
  constructor(public payload:  ImageResponse) {}
}
export class LoadThumbnailImageUrlFailure implements Action {
  readonly type = StockReturnActionTypes.LOAD_THUMBNAIL_IMAGE_URL_FAILURE;
  constructor(public payload:  ImageResponse) {}
}

export class LoadImageUrl implements Action {
  readonly type = StockReturnActionTypes.LOAD_IMAGE_URL;
  constructor(public payload: ImageReqPayload) {}
}
export class LoadImageUrlSuccess implements Action {
  readonly type = StockReturnActionTypes.LOAD_IMAGE_URL_SUCCESS;
  constructor(public payload:  ImageResponse) {}
}
export class LoadImageUrlFailure implements Action {
  readonly type = StockReturnActionTypes.LOAD_IMAGE_URL_FAILURE;
  constructor(public payload:  ImageResponse) {}
}

/**
 * Return Invoice Action types
 */
export type StockReturnActions =
  | CreateRequestToCfa
  | CreateRequestToCfaSuccess
  | CreateRequestToCfaFailure
  | ConfirmIssue
  | ConfirmIssueSuccess
  | ConfirmIssueFailure
  | SearchItem
  | SearchItemSuccess
  | SearchItemFailure
  | ClearSearch
  | ClearSearchItems
  | CreateIssueItems
  | CreateIssueItemsSuccess
  | CreateIssueItemsFailure
  | LoadCFALocationCode
  | LoadCFALocationCodeSuccess
  | LoadCFALocationCodeFailure
  | LoadItems
  | LoadItemSuccess
  | LoadItemsFailure
  | RemoveSelectedItems
  | RemoveSelectedItemsSuccess
  | RemoveSelectedItemsFailure
  | SelectedProductsSearch
  | SelectedProdutsSearchSuccess
  | SelectedProductsSearchFailure
  | LoadCourierDetails
  | LoadCourierDetailsSuccess
  | LoadCourierDetailsFailure
  | LoadHeaderLevelDetails
  | LoadHeaderLevelDetailsSuccess
  | LoadHeaderLevelDetailsFailure
  | LoadProductGroups
  | LoadProductGroupsSuccess
  | LoadProductGroupsFailure
  | LoadProductCategories
  | LoadProductCategoriesSuccess
  | LoadProductCategoriesFailure
  | LoadEmployeeCodes
  | LoadEmployeeCodesSuccess
  | LoadEmployeeCodesFailure
  | LoadEmployeeDetails
  | LoadEmployeeDetailsSuccess
  | LoadEmployeeDetailsFailure
  | LoadIssueInvoiceHistory
  | LoadIssueInvoiceHistorySucceess
  | LoadIssueInvoiceHistoryFailure
  | StoreHistoryType
  | StoreAdvancedFilterData
  | ResetStockReturnHistory
  | ResetStockReturnItems
  | LoadStuddedProductGroups
  | LoadStuddedProductGroupsSuccess
  | LoadStuddedProductGroupsFailure
  | ResetAdavanceFilter
  | ResetError
  | LoadItemsCfa
  | LoadItemsSuccessCfa
  | LoadItemsFailureCfa
  | LoadImageUrl
  | LoadImageUrlSuccess
  | LoadImageUrlFailure
  | LoadThumbnailImageUrl
  | LoadThumbnailImageUrlSuccess
  | LoadThumbnailImageUrlFailure;
