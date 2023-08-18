import { Action } from '@ngrx/store';

import {
  CustomErrors,
  ProductCategory,
  ProductGroup,
  LocationSummaryDetails,
  CreateStockIssueResponse,
  StockIssueItem,
  Filter,
  Column,
  CreateStockIssuePayload,
  UpdateStockIssuePayload,
  LoadStockIssueItemsPayload,
  CreateStockIssueItemsPayload,
  StoreUser,
  ImageResponse,
  ImageReqPayload
} from '@poss-web/shared/models';

export enum IssueTEPActionTypes {
  CREATE_STOCK_ISSUE = '[IssueTEP] Create Stock Issue',
  CREATE_STOCK_ISSUE_SUCCESS = '[IssueTEP] Create Stock Issue Success',
  CREATE_STOCK_ISSUE_FAILURE = '[IssueTEP] Create Stock Issue Failure',

  UPDATE_STOCK_ISSUE = '[IssueTEP] Update Stock Issue',
  UPDATE_STOCK_ISSUE_SUCCESS = '[IssueTEP] Update Stock Issue Success',
  UPDATE_STOCK_ISSUE_FAILURE = '[IssueTEP] Update Stock Issue Failure',

  LOAD_ITEMS = '[IssueTEP] Load items',
  LOAD_ITEMS_SUCCESS = '[IssueTEP] Load items Success',
  LOAD_ITEMS_FAILURE = '[IssueTEP] Load items Failure',

  UPDATE_ALL_STOCK_ISSUE_ITEMS = '[IssueTEP] Update all Stock Issue items',
  UPDATE_ALL_STOCK_ISSUE_ITEMS_SUCCESS = '[IssueTEP] Update all Stock Issue items Success',
  UPDATE_ALL_STOCK_ISSUE_ITEMS_FAILURE = '[IssueTEP] Update all Stock Issue items Failure',

  CREATE_STOCK_ISSUE_ITEMS = '[IssueTEP] Create Stock Issue Items',
  CREATE_STOCK_ISSUE_ITEMS_SUCCESS = '[IssueTEP] Create Stock Issue Items Success ',
  CREATE_STOCK_ISSUE_ITEMS_FAILURE = '[IssueTEP] Create Stock Issue Items Failure',

  LOAD_STOCK_ISSUE_ITEMS = '[IssueTEP] Load Stock Issue Items',
  LOAD_STOCK_ISSUE_ITEMS_SUCCESS = '[IssueTEP] Load Stock Issue Items Success ',
  LOAD_STOCK_ISSUE_ITEMS_FAILURE = '[IssueTEP] Load Stock Issue Items Failure',

  SEARCH_CLEAR = '[IssueTEP] Search-clear',
  RESET_LIST = '[IssueTEP] Reset-List',
  RESET_RESPONSE = '[IssueTEP] Reset-Response',
  RESET_ALL = '[IssueTEP] Reset-All',

  LOAD_TOTAL_ITEMS_COUNT = '[IssueTEP] Load total items count',
  LOAD_TOTAL_ITEMS_COUNT_SUCCESS = '[IssueTEP] Load total items count Success',
  LOAD_TOTAL_ITEMS_COUNT_FAILURE = '[IssueTEP] Load total items count Failure',

  LOAD_TOTAL_STOCK_ISSUE_ITEMS_COUNT = '[IssueTEP] Load total stock issue items count',
  LOAD_TOTAL_STOCK_ISSUE_ITEMS_COUNT_SUCCESS = '[IssueTEP] Load total stock issue items count Success',
  LOAD_TOTAL_STOCK_ISSUE_ITEMS_COUNT_FAILURE = '[IssueTEP] Load total stock issue items count Failure',

  LOAD_FACTORY_ADDRESS = '[IssueTEP] Load Factory Address',
  LOAD_FACTORY_ADDRESS_SUCCESS = '[IssueTEP] Load Factory Address Success',
  LOAD_FACTORY_ADDRESS_FAILURE = '[IssueTEP] Load Factory Address Failure',

  LOAD_CFA_ADDRESS = '[IssueTEP] Load CFA Address',
  LOAD_CFA_ADDRESS_SUCCESS = '[IssueTEP] Load CFA Address Success',
  LOAD_CFA_ADDRESS_FAILURE = '[IssueTEP] Load CFA Address Failure',

  LOAD_PRODUCT_CATEGORIES = '[IssueTEP] Load product categories',
  LOAD_PRODUCT_CATEGORIES_SUCCESS = '[IssueTEP] Load product categories Success',
  LOAD_PRODUCT_CATEGORIES_FAILURE = '[IssueTEP] Load product categories Failure',

  LOAD_PROUDCT_GROUPS = '[IssueTEP] Load product groups',
  LOAD_PROUDCT_GROUPS_SUCCESS = '[IssueTEP] Load product groups Success',
  LOAD_PROUDCT_GROUPS_FAILURE = '[IssueTEP] Load product groups Failure',

  LOAD_COURIER_DETAILS = '[IssueTEP] Load Courier Details',
  LOAD_COURIER_DETAILS_SUCCESS = '[IssueTEP] Load Courier Details Success',
  LOAD_COURIER_DETAILS_FAILURE = '[IssueTEP] Load Courier Details Failure',

  LOAD_EMPLOYEE_CODES = '[IssueTEP] Load Employee Codes',
  LOAD_EMPLOYEE_CODES_SUCCESS = '[IssueTEP] Load Employee Codes Success',
  LOAD_EMPLOYEE_CODES_FAILURE = '[IssueTEP] Load Employee Codes Failure',

  LOAD_LOCATION_CODES = '[IssueTEP] Load Location Codes',
  LOAD_LOCATION_CODES_SUCCESS = '[IssueTEP] Load Location Codes Success',
  LOAD_LOCATION_CODES_FAILURE = '[IssueTEP] Load Location Codes Failure',

  LOAD_EMPLOYEE_DETAILS = '[IssueTEP] Load Employee Details',
  LOAD_EMPLOYEE_DETAILS_SUCCESS = '[IssueTEP] Load Employee Details Success',
  LOAD_EMPLOYEE_DETAILS_FAILURE = '[IssueTEP] Load Employee Details Failure',

  SET_SORT_DATA_ITEMS = '[IssueTEP] Set Sort Data Items',
  SET_SORT_DATA_STOCK_ISSUE_ITEMS = '[IssueTEP] Set Sort Data Stock Issue Items',
  SET_FILTER_DATA_ITEMS = '[IssueTEP] Set Filter Data Items',
  SET_FILTER_DATA_STOCK_ISSUE_ITEMS = '[IssueTEP] Set Filter Data Stock Issue Items',

  LOAD_STUDDED_PRODUCT_GROUPS = '[IssueTEP]  Load Studded Product Groups ',
  LOAD_STUDDED_PRODUCT_GROUPS_SUCCESS = '[IssueTEP]  Load Studded Product Groups Success ',
  LOAD_STUDDED_PRODUCT_GROUPS_FAILURE = '[IssueTEP]  Load Studded Product Groups Failure ',

  // Image

  LOAD_THUMBNAIL_IMAGE_URL = '[ IssueTEP ] Load Thumbnail Image Url',
  LOAD_THUMBNAIL_IMAGE_URL_SUCCESS = '[ IssueTEP ] Load Thumbnail Image Url Success',
  LOAD_THUMBNAIL_IMAGE_URL_FAILURE = '[ IssueTEP ] Load Thumbnail Image Url Failure',

  LOAD_IMAGE_URL = '[ IssueTEP ] Load Image Url',
  LOAD_IMAGE_URL_SUCCESS = '[ IssueTEP ] Load Image Url Success',
  LOAD_IMAGE_URL_FAILURE = '[ IssueTEP ] Load Image Url Failure',

  LOAD_SELECTED_STOCK_ISSUE = '[IssueTEP] Load Selected Stock Issue',
  LOAD_SELECTED_STOCK_ISSUE_SUCCESS = '[IssueTEP] Load Selected Stock Issue Success',
  LOAD_SELECTED_STOCK_ISSUE_FAILURE = '[IssueTEP] Load Selected Stock Issue Failure'
}

export class CreateStockIssue implements Action {
  readonly type = IssueTEPActionTypes.CREATE_STOCK_ISSUE;
  constructor(public payload: CreateStockIssuePayload) {}
}

export class CreateStockIssueSuccess implements Action {
  readonly type = IssueTEPActionTypes.CREATE_STOCK_ISSUE_SUCCESS;
  constructor(public payload: CreateStockIssueResponse) {}
}

export class CreateStockIssueFailure implements Action {
  readonly type = IssueTEPActionTypes.CREATE_STOCK_ISSUE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateStockIssue implements Action {
  readonly type = IssueTEPActionTypes.UPDATE_STOCK_ISSUE;
  constructor(public payload: UpdateStockIssuePayload) {}
}

export class UpdateStockIssueSuccess implements Action {
  readonly type = IssueTEPActionTypes.UPDATE_STOCK_ISSUE_SUCCESS;
  constructor(public payload: CreateStockIssueResponse) {}
}

export class UpdateStockIssueFailure implements Action {
  readonly type = IssueTEPActionTypes.UPDATE_STOCK_ISSUE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadItems implements Action {
  readonly type = IssueTEPActionTypes.LOAD_ITEMS;
  constructor(public payload: LoadStockIssueItemsPayload) {}
}

export class LoadItemsSuccess implements Action {
  readonly type = IssueTEPActionTypes.LOAD_ITEMS_SUCCESS;
  constructor(public payload: StockIssueItem[]) {}
}

export class LoadItemsFailure implements Action {
  readonly type = IssueTEPActionTypes.LOAD_ITEMS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateAllStockIssueItems implements Action {
  readonly type = IssueTEPActionTypes.UPDATE_ALL_STOCK_ISSUE_ITEMS;
  constructor(public payload: CreateStockIssueItemsPayload) {}
}

export class UpdateAllStockIssueItemsSuccess implements Action {
  readonly type = IssueTEPActionTypes.UPDATE_ALL_STOCK_ISSUE_ITEMS_SUCCESS;
  constructor(public payload: boolean) {}
}

export class UpdateAllStockIssueItemsFailure implements Action {
  readonly type = IssueTEPActionTypes.UPDATE_ALL_STOCK_ISSUE_ITEMS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class CreateStockIssueItems implements Action {
  readonly type = IssueTEPActionTypes.CREATE_STOCK_ISSUE_ITEMS;
  constructor(public payload: CreateStockIssueItemsPayload) {}
}

export class CreateStockIssueItemsSuccess implements Action {
  readonly type = IssueTEPActionTypes.CREATE_STOCK_ISSUE_ITEMS_SUCCESS;
  constructor(public payload: boolean) {}
}

export class CreateStockIssueItemsFailure implements Action {
  readonly type = IssueTEPActionTypes.CREATE_STOCK_ISSUE_ITEMS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadStockIssueItems implements Action {
  readonly type = IssueTEPActionTypes.LOAD_STOCK_ISSUE_ITEMS;
  constructor(public payload: LoadStockIssueItemsPayload) {}
}

export class LoadStockIssueItemsSuccess implements Action {
  readonly type = IssueTEPActionTypes.LOAD_STOCK_ISSUE_ITEMS_SUCCESS;
  constructor(public payload: StockIssueItem[]) {}
}

export class LoadStockIssueItemsFailure implements Action {
  readonly type = IssueTEPActionTypes.LOAD_STOCK_ISSUE_ITEMS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchClear implements Action {
  readonly type = IssueTEPActionTypes.SEARCH_CLEAR;
}

export class ResetList implements Action {
  readonly type = IssueTEPActionTypes.RESET_LIST;
}

export class ResetResponse implements Action {
  readonly type = IssueTEPActionTypes.RESET_RESPONSE;
}

export class ResetAll implements Action {
  readonly type = IssueTEPActionTypes.RESET_ALL;
}

export class LoadTotalItemsCount implements Action {
  readonly type = IssueTEPActionTypes.LOAD_TOTAL_ITEMS_COUNT;
  constructor(public payload: LoadStockIssueItemsPayload) {}
}

export class LoadTotalItemsCountSuccess implements Action {
  readonly type = IssueTEPActionTypes.LOAD_TOTAL_ITEMS_COUNT_SUCCESS;
  constructor(public payload: number) {}
}

export class LoadTotalItemsCountFailure implements Action {
  readonly type = IssueTEPActionTypes.LOAD_TOTAL_ITEMS_COUNT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadTotalStockIssueItemsCount implements Action {
  readonly type = IssueTEPActionTypes.LOAD_TOTAL_STOCK_ISSUE_ITEMS_COUNT;
  constructor(public payload: LoadStockIssueItemsPayload) {}
}

export class LoadTotalStockIssueItemsCountSuccess implements Action {
  readonly type =
    IssueTEPActionTypes.LOAD_TOTAL_STOCK_ISSUE_ITEMS_COUNT_SUCCESS;
  constructor(public payload: number) {}
}

export class LoadTotalStockIssueItemsCountFailure implements Action {
  readonly type =
    IssueTEPActionTypes.LOAD_TOTAL_STOCK_ISSUE_ITEMS_COUNT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadFactoryAddress implements Action {
  readonly type = IssueTEPActionTypes.LOAD_FACTORY_ADDRESS;
}

export class LoadFactoryAddressSuccess implements Action {
  readonly type = IssueTEPActionTypes.LOAD_FACTORY_ADDRESS_SUCCESS;
  constructor(public payload: LocationSummaryDetails) {}
}

export class LoadFactoryAddressFailure implements Action {
  readonly type = IssueTEPActionTypes.LOAD_FACTORY_ADDRESS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadcfaAddress implements Action {
  readonly type = IssueTEPActionTypes.LOAD_CFA_ADDRESS;
}

export class LoadcfaAddressSuccess implements Action {
  readonly type = IssueTEPActionTypes.LOAD_CFA_ADDRESS_SUCCESS;
  constructor(public payload: LocationSummaryDetails) {}
}

export class LoadcfaAddressFailure implements Action {
  readonly type = IssueTEPActionTypes.LOAD_CFA_ADDRESS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadProductCategories implements Action {
  readonly type = IssueTEPActionTypes.LOAD_PRODUCT_CATEGORIES;
}

export class LoadProductCategoriesSuccess implements Action {
  readonly type = IssueTEPActionTypes.LOAD_PRODUCT_CATEGORIES_SUCCESS;
  constructor(public payload: ProductCategory[]) {}
}

export class LoadProductCategoriesFailure implements Action {
  readonly type = IssueTEPActionTypes.LOAD_PRODUCT_CATEGORIES_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadProductGroups implements Action {
  readonly type = IssueTEPActionTypes.LOAD_PROUDCT_GROUPS;
}

export class LoadProductGroupsSuccess implements Action {
  readonly type = IssueTEPActionTypes.LOAD_PROUDCT_GROUPS_SUCCESS;
  constructor(public payload: ProductGroup[]) {}
}

export class LoadProductGroupsFailure implements Action {
  readonly type = IssueTEPActionTypes.LOAD_PROUDCT_GROUPS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadCourierDetails implements Action {
  readonly type = IssueTEPActionTypes.LOAD_COURIER_DETAILS;
  constructor(public payload: string) {}
}
export class LoadCourierDetailsSuccess implements Action {
  readonly type = IssueTEPActionTypes.LOAD_COURIER_DETAILS_SUCCESS;
  constructor(public payload: string[]) {}
}
export class LoadCourierDetailsFailure implements Action {
  readonly type = IssueTEPActionTypes.LOAD_COURIER_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadEmployeeCodes implements Action {
  readonly type = IssueTEPActionTypes.LOAD_EMPLOYEE_CODES;
}
export class LoadEmployeeCodesSuccess implements Action {
  readonly type = IssueTEPActionTypes.LOAD_EMPLOYEE_CODES_SUCCESS;
  constructor(public payload: string[]) {}
}
export class LoadEmployeeCodesFailure implements Action {
  readonly type = IssueTEPActionTypes.LOAD_EMPLOYEE_CODES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadLocationCodes implements Action {
  readonly type = IssueTEPActionTypes.LOAD_LOCATION_CODES;
}
export class LoadLocationCodesSuccess implements Action {
  readonly type = IssueTEPActionTypes.LOAD_LOCATION_CODES_SUCCESS;
  constructor(public payload: string[]) {}
}
export class LoadLocationCodesFailure implements Action {
  readonly type = IssueTEPActionTypes.LOAD_LOCATION_CODES_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadEmployeeDetails implements Action {
  readonly type = IssueTEPActionTypes.LOAD_EMPLOYEE_DETAILS;
  constructor(public payload: string) {}
}
export class LoadEmployeeDetailsSuccess implements Action {
  readonly type = IssueTEPActionTypes.LOAD_EMPLOYEE_DETAILS_SUCCESS;
  constructor(public payload: StoreUser[]) {}
}
export class LoadEmployeeDetailsFailure implements Action {
  readonly type = IssueTEPActionTypes.LOAD_EMPLOYEE_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SetSortDataItems implements Action {
  readonly type = IssueTEPActionTypes.SET_SORT_DATA_ITEMS;
  constructor(public payload: Column[]) {}
}
export class SetSortDataStockIssueItems implements Action {
  readonly type = IssueTEPActionTypes.SET_SORT_DATA_STOCK_ISSUE_ITEMS;
  constructor(public payload: Column[]) {}
}

export class SetFilterDataItems implements Action {
  readonly type = IssueTEPActionTypes.SET_FILTER_DATA_ITEMS;
  constructor(public payload: { [key: string]: Filter[] }) {}
}
export class SetFilterDataStockIssueItems implements Action {
  readonly type = IssueTEPActionTypes.SET_FILTER_DATA_STOCK_ISSUE_ITEMS;
  constructor(public payload: { [key: string]: Filter[] }) {}
}

export class LoadStuddedProductGroups implements Action {
  readonly type = IssueTEPActionTypes.LOAD_STUDDED_PRODUCT_GROUPS;
}
export class LoadStuddedProductGroupsSuccess implements Action {
  readonly type = IssueTEPActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_SUCCESS;
  constructor(public payload: string[]) {}
}
export class LoadStuddedProductGroupsFailure implements Action {
  readonly type = IssueTEPActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

// Image
export class LoadThumbnailImageUrl implements Action {
  readonly type = IssueTEPActionTypes.LOAD_THUMBNAIL_IMAGE_URL;
  constructor(public payload: ImageReqPayload) {}
}
export class LoadThumbnailImageUrlSuccess implements Action {
  readonly type = IssueTEPActionTypes.LOAD_THUMBNAIL_IMAGE_URL_SUCCESS;
  constructor(public payload: ImageResponse) {}
}
export class LoadThumbnailImageUrlFailure implements Action {
  readonly type = IssueTEPActionTypes.LOAD_THUMBNAIL_IMAGE_URL_FAILURE;
  constructor(public payload: ImageResponse) {}
}

export class LoadImageUrl implements Action {
  readonly type = IssueTEPActionTypes.LOAD_IMAGE_URL;
  constructor(public payload: ImageReqPayload) {}
}
export class LoadImageUrlSuccess implements Action {
  readonly type = IssueTEPActionTypes.LOAD_IMAGE_URL_SUCCESS;
  constructor(public payload: ImageResponse) {}
}
export class LoadImageUrlFailure implements Action {
  readonly type = IssueTEPActionTypes.LOAD_IMAGE_URL_FAILURE;
  constructor(public payload: ImageResponse) {}
}

export class LoadSelectedStockIssue implements Action {
  readonly type = IssueTEPActionTypes.LOAD_SELECTED_STOCK_ISSUE;
  constructor(public payload: CreateStockIssuePayload) {}
}

export class LoadSelectedStockIssueSuccess implements Action {
  readonly type = IssueTEPActionTypes.LOAD_SELECTED_STOCK_ISSUE_SUCCESS;
  constructor(public payload: CreateStockIssueResponse) {}
}

export class LoadSelectedStockIssueFailure implements Action {
  readonly type = IssueTEPActionTypes.LOAD_SELECTED_STOCK_ISSUE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type IssueTEPActions =
  | CreateStockIssue
  | CreateStockIssueSuccess
  | CreateStockIssueFailure
  | UpdateStockIssue
  | UpdateStockIssueSuccess
  | UpdateStockIssueFailure
  | LoadItems
  | LoadItemsSuccess
  | LoadItemsFailure
  | UpdateAllStockIssueItems
  | UpdateAllStockIssueItemsSuccess
  | UpdateAllStockIssueItemsFailure
  | CreateStockIssueItems
  | CreateStockIssueItemsSuccess
  | CreateStockIssueItemsFailure
  | LoadStockIssueItems
  | LoadStockIssueItemsSuccess
  | LoadStockIssueItemsFailure
  | SearchClear
  | ResetList
  | ResetResponse
  | ResetAll
  | LoadTotalItemsCount
  | LoadTotalItemsCountSuccess
  | LoadTotalItemsCountFailure
  | LoadTotalStockIssueItemsCount
  | LoadTotalStockIssueItemsCountSuccess
  | LoadTotalStockIssueItemsCountFailure
  | LoadFactoryAddress
  | LoadFactoryAddressSuccess
  | LoadFactoryAddressFailure
  | LoadProductGroups
  | LoadProductGroupsSuccess
  | LoadProductGroupsFailure
  | LoadProductCategories
  | LoadProductCategoriesSuccess
  | LoadProductCategoriesFailure
  | LoadCourierDetails
  | LoadCourierDetailsSuccess
  | LoadCourierDetailsFailure
  | LoadEmployeeCodes
  | LoadEmployeeCodesSuccess
  | LoadEmployeeCodesFailure
  | LoadEmployeeDetails
  | LoadEmployeeDetailsSuccess
  | LoadEmployeeDetailsFailure
  | SetSortDataItems
  | SetSortDataStockIssueItems
  | SetFilterDataItems
  | SetFilterDataStockIssueItems
  | LoadStuddedProductGroups
  | LoadStuddedProductGroupsSuccess
  | LoadStuddedProductGroupsFailure
  | LoadImageUrl
  | LoadImageUrlSuccess
  | LoadImageUrlFailure
  | LoadThumbnailImageUrl
  | LoadThumbnailImageUrlSuccess
  | LoadThumbnailImageUrlFailure
  | LoadLocationCodes
  | LoadLocationCodesSuccess
  | LoadLocationCodesFailure
  | LoadcfaAddress
  | LoadcfaAddressSuccess
  | LoadcfaAddressFailure
  | LoadSelectedStockIssue
  | LoadSelectedStockIssueSuccess
  | LoadSelectedStockIssueFailure;
