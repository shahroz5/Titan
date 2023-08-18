import { Action } from '@ngrx/store';
import {
  CustomErrors,
  Lov,
  BinCode,
  ProductGroup,
  ProductCategory,
  StockReceiveStock,
  StockReceiveItemValidate,
  StockReceiveItem,
  StockReceiveLoadPendingPayload,
  StockReceiveSearchPendingPayload,
  StockReceiveLoadItemsTotalCountPayload,
  StockReceiveLoadItemsTotalCountSuccessResponse,
  StockReceiveLoadItemsPayload,
  StockReceiveUpdateItemFailurePayload,
  StockReceiveUpdateItemPayload,
  StockReceiveUpdateAllItemsPayload,
  StockReceiveConfirmStockReceivePayload,
  StockReceiveHistoryPayload,
  StockReceiveHistoryItemsPayload,
  AdvanceFilterPayload,
  StockReceiveAPITypesEnum,
  StockReceiveTotalMeasuredWeightPayload,
  StockReceiveTotalMeasuredWeight,
  ImageReqPayload,
  ImageResponse
} from '@poss-web/shared/models';

/**
 * The  enum defined for  list of actions of stock receive
 */
export enum StockReceiveActionTypes {
  LOAD_PENDING_FACTORY_STN = '[ Stock-Receive-List ] Load pending STN List from Factory',
  LOAD_PENDING_FACTORY_STN_SUCCESS = '[ Stock-Receive-List ] Load pending STN List from Factory Success',
  LOAD_PENDING_FACTORY_STN_FAILURE = '[ Stock-Receive-List ] Load pending STN List from Factory Failure',

  LOAD_PENDING_BOUTIQUE_STN = '[ Stock-Receive-List ] Load pending STN List from Boutique',
  LOAD_PENDING_BOUTIQUE_STN_SUCCESS = '[ Stock-Receive-List ] Load pending STN List from Boutique Success',
  LOAD_PENDING_BOUTIQUE_STN_FAILURE = '[ Stock-Receive-List ] Load pending STN List from Boutique Failure',

  LOAD_PENDING_MERCHANDISE_STN = '[ Stock-Receive-List ] Load pending STN List from Merchandise',
  LOAD_PENDING_MERCHANDISE_STN_SUCCESS = '[ Stock-Receive-List ] Load pending STN List from Merchandise Success',
  LOAD_PENDING_MERCHANDISE_STN_FAILURE = '[ Stock-Receive-List ] Load pending STN List from Merchandise Failure',

  LOAD_PENDING_CFA_INVOICE = '[ Stock-Receive-List ] Load pending Invoice List from CFA',
  LOAD_PENDING_CFA_INVOICE_SUCCESS = '[ Stock-Receive-List ] Load pending Invoice List from CFA Success',
  LOAD_PENDING_CFA_INVOICE_FAILURE = '[ Stock-Receive-List ] Load pending Invoice List from CFA Failure',

  SEARCH_PENDING_STOCKS = '[ Stock-Receive-List ] Search Pending Stocks',
  SEARCH_PENDING_STOCKS_SUCCESS = '[ Stock-Receive-List ]Search Pending Stocks Success',
  SEARCH_PENDING_STOCKS_FAILURE = '[ Stock-Receive-List ] Search Pending Stocks Failure',

  SEARCH_PENDING_INVOICES = '[ Stock-Receive-List ] Search Pending Inovices ',
  SEARCH_PENDING_INVOICES_SUCCESS = '[ Stock-Receive-List ] Search Pending Inovices Success',
  SEARCH_PENDING_INVOICES_FAILURE = '[ Stock-Receive-List ] Search Pending Inovices Failure',

  LOAD_SELECTED_STOCK = '[ Stock-Receive-Details ] Load selected stock ',
  LOAD_SELECTED_STOCK_SUCCESS = '[ Stock-Receive-Details ] Load selected stock Success',
  LOAD_SELECTED_STOCK_FAILURE = '[ Stock-Receive-Details ] Load selected stock Failure',

  LOAD_SELECTED_INVOICE = '[ Stock-Receive-Details ] Load selected Invoice ',
  LOAD_SELECTED_INVOICE_SUCCESS = '[ Stock-Receive-Details  ] Load selected Invoice Success',
  LOAD_SELECTED_INVOICE_FAILURE = '[Stock-Receive-Details  ] Load selected Invoice Failure',

  SEARCH_CLEAR = '[ Stock-receive ] search-clear',

  GET_TOTAL_MEASURED_WEIGHT = '[ Stock-Receive-Details ] Get total measured weight',
  GET_TOTAL_MEASURED_WEIGHT_SUCCESS = '[ Stock-Receive-Details ] Get total measured weight Success ',
  GET_TOTAL_MEASURED_WEIGHT_FAILURE = '[ Stock-Receive-Details ] Get total measured weight Failure ',

  LOAD_ItEMS_COUNT = '[ Stock-Receive-Details ] Load items Count ',
  LOAD_ItEMS_COUNT_SUCCESS = '[ Stock-Receive-Details ] Load items Count Success ',
  LOAD_ItEMS_COUNT_FAILURE = '[ Stock-Receive-Details ] Load items Count Failure ',

  LOAD_ITEMS = '[ Stock-Receive-Details ] Load Items ',
  LOAD_ITEMS_SUCCESS = '[ Stock-Receive-Details ] Load items Success ',
  LOAD_ITEMS_FAILURE = '[ Stock-Receive-Details ] Load items Failure ',

  LOAD_BIN_CODES = '[ Stock-Receive-Details ] Load all bins ',
  LOAD_BIN_CODES_SUCCESS = '[ Stock-Receive-Details ] Load all bins Success ',
  LOAD_BIN_CODES_FAILURE = '[ Stock-Receive-Details ]  Load all bins Failure ',

  LOAD_REMARKS = '[ Stock-Receive-Details ] Load all Remarks ',
  LOAD_REMARKS_SUCCESS = '[ Stock-Receive-Details ] Load all Remarks Success ',
  LOAD_REMARKS_FAILURE = '[ Stock-Receive-Details ]  Load all Remarks Failure ',

  VERIFY_ITEM = '[ Stock-Receive-Details ] Verify item ',
  VERIFY_ITEM_SUCCESS = '[ Stock-Receive-Details ]  Verify item Success ',
  VERIFY_ITEM_FAILURE = '[ Stock-Receive-Details ]  Verify item Failure ',

  UPADTE_ITEM = '[ Stock-Receive-Details ] Update item ',
  UPADTE_ITEM_SUCCESS = '[ Stock-Receive-Details ]  Update item Success ',
  UPADTE_ITEM_FAILURE = '[ Stock-Receive-Details ]  Update item Failure ',

  VALIDATE_ITEM = '[ Stock-Receive-Details ] Validate item ',
  VALIDATE_ITEM_SUCCESS = '[ Stock-Receive-Details ]  Validate item Success ',
  VALIDATE_ITEM_FAILURE = '[ Stock-Receive-Details ]  Validate item Failure ',

  VERIFY_ALL_ITEMS = '[ Stock-Receive-Details ] Verify all items',
  VERIFY_ALL_ITEMS_SUCCESS = '[ Stock-Receive-Details ] Verify all items Success ',
  VERIFY_ALL_ITEMS_FAILURE = '[ Stock-Receive-Details ] Verify all items Failure ',

  ASSIGN_BIN_ALL_ITEMS = '[ Stock-Receive-Details ] Assign bin to all items ',
  ASSIGN_BIN_ALL_ITEMS_SUCCESS = '[ Stock-Receive-Details ]  Assign bin to all items Success ',
  ASSIGN_BIN_ALL_ITEMS_FAILURE = '[ Stock-Receive-Details ] Assign bin to all items Failure ',

  CONFIRM_STOCK_RECEIVE = '[stock-receive] Confirm Stock',
  CONFIRM_STOCK_RECEIVE_SUCCESS = '[stock-receive] Confirm STN Success',
  CONFIRM_STOCK_RECEIVE_FAILURE = '[stock-receive] Confirm STN Failure',

  LOAD_PRODUCT_GROUPS = '[stock-receive]  Load Product Groups ',
  LOAD_PRODUCT_GROUPS_SUCCESS = '[stock-receive]  Load Product Groups Success ',
  LOAD_PRODUCT_GROUPS_FAILURE = '[stock-receive]  Load Product Groups Failure ',

  LOAD_STUDDED_PRODUCT_GROUPS = '[stock-receive]  Load Studded Product Groups ',
  LOAD_STUDDED_PRODUCT_GROUPS_SUCCESS = '[stock-receive]  Load Studded Product Groups Success ',
  LOAD_STUDDED_PRODUCT_GROUPS_FAILURE = '[stock-receive]  Load Studded Product Groups Failure ',

  LOAD_PRODUCT_CATEGORIES = '[stock-receive]  Load Product Categories ',
  LOAD_PRODUCT_CATEGORIES_SUCCESS = '[stock-receive]  Load Product Categories  Success ',
  LOAD_PRODUCT_CATEGORIES_FAILURE = '[stock-receive]  Load Product Categories  Failure ',

  RESET_SEARCH = '[stock-receive] Reset Search',
  CLEAR_SEARCH_RESULT = '[stock-receive] Clear search result',

  CLEAR_STOCKS = '[stock-receive] Clear Loaded Stocks',
  CLEAR_ITEMS = '[stock-receive] Clear Items',
  RESET_ERROR = '[stock-receive] Reset Error',
  //history
  LOAD_STOCK_RECEIVE_HISTORY = '[ Stock-Receive ] Load Stock Receive History',
  LOAD_STOCK_RECEIVE_HISTORY_SUCCESS = '[ Stock-Receive ] Load Stock Receive History Success',
  LOAD_STOCK_RECEIVE_HISTORY_FAILURE = '[ Stock-Receive-List ] Load Stock Receive History Failure',

  LOAD_STOCK_RECEIVE_INVOICE_HISTORY = '[ Stock-Receive ] Load Stock Receive Invoice History',
  LOAD_STOCK_RECEIVE_INVOICE_HISTORY_SUCCESS = '[ Stock-Receive ] Load Stock Receive Invoice History Success',
  LOAD_STOCK_RECEIVE_INVOICE_HISTORY_FAILURE = '[ Stock-Receive ] Load Stock Receive Invoice History Failure',

  RESET_STOCK_RECEIVE_HISTORY = '[ Stock-Receive-List ] Reset Stock Receive History',

  LOAD_STOCK_RECEIVE_HISTORY_ITEMS = '[ Stock-Receive ] Load Stock Receive History Items',
  LOAD_STOCK_RECEIVE_HISTORY_ITEMS_SUCCESS = '[ Stock-Receive ] Load Stock Receive History Items Success',
  LOAD_STOCK_RECEIVE_HISTORY_ITEMS_FAILURE = '[ Stock-Receive ] Load Stock Receive History Items Failure',

  STORE_HISTORY_TYPE = '[ Stock-Receive ] Store History Type',

  STORE_ADVANCED_FILTER_DATE = '[ Stock-Receive ] Store Advanced Filter Data',
  RESET_ADVANCE_FILTER = '[ Stock-Receive ] Reset Advance Filter',

  FETCH_STN_FROM_ORACLE = '[ Stock-Receive-List ] Fetch STN from oracle',
  FETCH_STN_FROM_ORACLE_SUCCESS = '[ Stock-Receive-List ] Fetch STN from oracle Success',
  FETCH_STN_FROM_ORACLE_FAILURE = '[ Stock-Receive-List ] Fetch STN from oracle Failure',

  FETCH_INVOICE_FROM_ORACLE = '[ Stock-Receive-List ] Fetch Invoice from oracle',
  FETCH_INVOICE_FROM_ORACLE_SUCCESS = '[ Stock-Receive-List ] Fetch Invoice from oracle Success',
  FETCH_INVOICE_FROM_ORACLE_FAILURE = '[ Stock-Receive-List ] Fetch Invoice from oracle Failure',

  // Image

  LOAD_THUMBNAIL_IMAGE_URL = '[ Stock-Receive ] Load Thumbnail Image Url',
  LOAD_THUMBNAIL_IMAGE_URL_SUCCESS = '[ Stock-Receive ] Load Thumbnail Image Url Success',
  LOAD_THUMBNAIL_IMAGE_URL_FAILURE = '[ Stock-Receive ] Load Thumbnail Image Url Failure',

  LOAD_IMAGE_URL = '[ Stock-Receive ] Load Image Url',
  LOAD_IMAGE_URL_SUCCESS = '[ Stock-Receive ] Load Image Url Success',
  LOAD_IMAGE_URL_FAILURE = '[ Stock-Receive ] Load Image Url Failure',
}

/**
 * Stock Receive Actions
 */
export class LoadPendingFactorySTN implements Action {
  readonly type = StockReceiveActionTypes.LOAD_PENDING_FACTORY_STN;
  constructor(public payload: StockReceiveLoadPendingPayload) {}
}

export class LoadPendingFactorySTNSuccess implements Action {
  readonly type = StockReceiveActionTypes.LOAD_PENDING_FACTORY_STN_SUCCESS;
  constructor(public payload: StockReceiveStock[]) {}
}

export class LoadPendingFactorySTNFailure implements Action {
  readonly type = StockReceiveActionTypes.LOAD_PENDING_FACTORY_STN_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadPendingBoutiqueSTN implements Action {
  readonly type = StockReceiveActionTypes.LOAD_PENDING_BOUTIQUE_STN;
  constructor(public payload: StockReceiveLoadPendingPayload) {}
}

export class LoadPendingBoutiqueSTNSuccess implements Action {
  readonly type = StockReceiveActionTypes.LOAD_PENDING_BOUTIQUE_STN_SUCCESS;
  constructor(public payload: StockReceiveStock[]) {}
}

export class LoadPendingBoutiqueSTNFailure implements Action {
  readonly type = StockReceiveActionTypes.LOAD_PENDING_BOUTIQUE_STN_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadPendingMerchandiseSTN implements Action {
  readonly type = StockReceiveActionTypes.LOAD_PENDING_MERCHANDISE_STN;
  constructor(public payload: StockReceiveLoadPendingPayload) {}
}

export class LoadPendingMerchandiseSTNSuccess implements Action {
  readonly type = StockReceiveActionTypes.LOAD_PENDING_MERCHANDISE_STN_SUCCESS;
  constructor(public payload: StockReceiveStock[]) {}
}

export class LoadPendingMerchandiseSTNFailure implements Action {
  readonly type = StockReceiveActionTypes.LOAD_PENDING_MERCHANDISE_STN_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadPendingCFAInvoice implements Action {
  readonly type = StockReceiveActionTypes.LOAD_PENDING_CFA_INVOICE;
  constructor(public payload: StockReceiveLoadPendingPayload) {}
}

export class LoadPendingCFAInvoiceSuccess implements Action {
  readonly type = StockReceiveActionTypes.LOAD_PENDING_CFA_INVOICE_SUCCESS;
  constructor(public payload: StockReceiveStock[]) {}
}

export class LoadPendingCFAInvoiceFailure implements Action {
  readonly type = StockReceiveActionTypes.LOAD_PENDING_CFA_INVOICE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchPendingStocks implements Action {
  readonly type = StockReceiveActionTypes.SEARCH_PENDING_STOCKS;
  constructor(public payload: StockReceiveSearchPendingPayload) {}
}

export class SearchPendingStocksSuccess implements Action {
  readonly type = StockReceiveActionTypes.SEARCH_PENDING_STOCKS_SUCCESS;
  constructor(public payload: StockReceiveStock[]) {}
}
export class SearchPendingStocksFailure implements Action {
  readonly type = StockReceiveActionTypes.SEARCH_PENDING_STOCKS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class FetchSTNFromOracle implements Action {
  readonly type = StockReceiveActionTypes.FETCH_STN_FROM_ORACLE;
  constructor(
    public payload: { stn: number; type: StockReceiveAPITypesEnum }
  ) {}
}

export class FetchSTNFromOracleSuccess implements Action {
  readonly type = StockReceiveActionTypes.FETCH_STN_FROM_ORACLE_SUCCESS;
  constructor(public payload: StockReceiveStock[]) {}
}
export class FetchSTNFromOracleFailure implements Action {
  readonly type = StockReceiveActionTypes.FETCH_STN_FROM_ORACLE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class FetchInvoiceFromOracle implements Action {
  readonly type = StockReceiveActionTypes.FETCH_INVOICE_FROM_ORACLE;
  constructor(
    public payload: { invoiceNo: number; type: StockReceiveAPITypesEnum }
  ) {}
}

export class FetchInvoiceFromOracleSuccess implements Action {
  readonly type = StockReceiveActionTypes.FETCH_INVOICE_FROM_ORACLE_SUCCESS;
  constructor(public payload: StockReceiveStock[]) {}
}
export class FetchInvoiceFromOracleFailure implements Action {
  readonly type = StockReceiveActionTypes.FETCH_INVOICE_FROM_ORACLE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchPendingInvoices implements Action {
  readonly type = StockReceiveActionTypes.SEARCH_PENDING_INVOICES;
  constructor(public payload: StockReceiveSearchPendingPayload) {}
}

export class SearchPendingInvoicesSuccess implements Action {
  readonly type = StockReceiveActionTypes.SEARCH_PENDING_INVOICES_SUCCESS;
  constructor(public payload: StockReceiveStock[]) {}
}
export class SearchPendingInvoicesFailure implements Action {
  readonly type = StockReceiveActionTypes.SEARCH_PENDING_INVOICES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchClear implements Action {
  readonly type = StockReceiveActionTypes.SEARCH_CLEAR;
}

export class LoadSelectedStock implements Action {
  readonly type = StockReceiveActionTypes.LOAD_SELECTED_STOCK;
  constructor(
    public payload: { id: string; type: string; historyAPIType?: string }
  ) {}
}

export class LoadSelectedStockSuccess implements Action {
  readonly type = StockReceiveActionTypes.LOAD_SELECTED_STOCK_SUCCESS;
  constructor(public payload: StockReceiveStock) {}
}
export class LoadSelectedStockFailure implements Action {
  readonly type = StockReceiveActionTypes.LOAD_SELECTED_STOCK_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadSelectedInvoice implements Action {
  readonly type = StockReceiveActionTypes.LOAD_SELECTED_INVOICE;
  constructor(
    public payload: { id: string; type: string; historyAPIType?: string }
  ) {}
}

export class LoadSelectedInvoiceSuccess implements Action {
  readonly type = StockReceiveActionTypes.LOAD_SELECTED_INVOICE_SUCCESS;
  constructor(public payload: StockReceiveStock) {}
}
export class LoadSelectedInvoiceFailure implements Action {
  readonly type = StockReceiveActionTypes.LOAD_SELECTED_INVOICE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

// For Stock-recevie verification

export class LoadItemsTotalCount implements Action {
  readonly type = StockReceiveActionTypes.LOAD_ItEMS_COUNT;
  constructor(public payload: StockReceiveLoadItemsTotalCountPayload) {}
}

export class LoadItemsTotalCountSuccess implements Action {
  readonly type = StockReceiveActionTypes.LOAD_ItEMS_COUNT_SUCCESS;
  constructor(public payload: StockReceiveLoadItemsTotalCountSuccessResponse) {}
}
export class LoadItemsTotalCountFailure implements Action {
  readonly type = StockReceiveActionTypes.LOAD_ItEMS_COUNT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class GetTotalMeasuredWeight implements Action {
  readonly type = StockReceiveActionTypes.GET_TOTAL_MEASURED_WEIGHT;
  constructor(public payload: StockReceiveTotalMeasuredWeightPayload) {}
}

export class GetTotalMeasuredWeightSuccess implements Action {
  readonly type = StockReceiveActionTypes.GET_TOTAL_MEASURED_WEIGHT_SUCCESS;
  constructor(public payload: StockReceiveTotalMeasuredWeight) {}
}
export class GetTotalMeasuredWeightFailure implements Action {
  readonly type = StockReceiveActionTypes.GET_TOTAL_MEASURED_WEIGHT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadItems implements Action {
  readonly type = StockReceiveActionTypes.LOAD_ITEMS;
  constructor(public payload: StockReceiveLoadItemsPayload) {}
}

export class LoadItemsSuccess implements Action {
  readonly type = StockReceiveActionTypes.LOAD_ITEMS_SUCCESS;
  constructor(
    public payload: { items: StockReceiveItem[]; count: number; status: string }
  ) {}
}
export class LoadItemsFailure implements Action {
  readonly type = StockReceiveActionTypes.LOAD_ITEMS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadBinCodes implements Action {
  readonly type = StockReceiveActionTypes.LOAD_BIN_CODES;
  constructor(public payload: string) {}
}

export class LoadBinCodesSuccess implements Action {
  readonly type = StockReceiveActionTypes.LOAD_BIN_CODES_SUCCESS;
  constructor(public payload: BinCode[]) {}
}
export class LoadBinCodesFailure implements Action {
  readonly type = StockReceiveActionTypes.LOAD_BIN_CODES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadRemarks implements Action {
  readonly type = StockReceiveActionTypes.LOAD_REMARKS;
}

export class LoadRemarksSuccess implements Action {
  readonly type = StockReceiveActionTypes.LOAD_REMARKS_SUCCESS;
  constructor(public payload: Lov[]) {}
}
export class LoadRemarksFailure implements Action {
  readonly type = StockReceiveActionTypes.LOAD_REMARKS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class VerifyItem implements Action {
  readonly type = StockReceiveActionTypes.VERIFY_ITEM;
  constructor(public payload: StockReceiveUpdateItemPayload) {}
}
export class VerifyItemSuccess implements Action {
  readonly type = StockReceiveActionTypes.VERIFY_ITEM_SUCCESS;
  constructor(public payload: StockReceiveItem) {}
}
export class VerifyItemFailure implements Action {
  readonly type = StockReceiveActionTypes.VERIFY_ITEM_FAILURE;
  constructor(public payload: StockReceiveUpdateItemFailurePayload) {}
}
export class UpdateItem implements Action {
  readonly type = StockReceiveActionTypes.UPADTE_ITEM;
  constructor(public payload: StockReceiveUpdateItemPayload) {}
}

export class UpdateItemSuccess implements Action {
  readonly type = StockReceiveActionTypes.UPADTE_ITEM_SUCCESS;
  constructor(public payload: StockReceiveItem) {}
}
export class UpdateItemFailure implements Action {
  readonly type = StockReceiveActionTypes.UPADTE_ITEM_FAILURE;
  constructor(public payload: StockReceiveUpdateItemFailurePayload) {}
}

export class ValidateItem implements Action {
  readonly type = StockReceiveActionTypes.VALIDATE_ITEM;
  constructor(public payload: StockReceiveItemValidate) {}
}

export class ValidateItemSuccess implements Action {
  readonly type = StockReceiveActionTypes.VALIDATE_ITEM_SUCCESS;
  constructor(public payload: { itemId: string; isSuccess: boolean }) {}
}
export class ValidateItemFailure implements Action {
  readonly type = StockReceiveActionTypes.VALIDATE_ITEM_FAILURE;
  constructor(public payload: { itemId: string; error: CustomErrors }) {}
}

export class VerifyAllItems implements Action {
  readonly type = StockReceiveActionTypes.VERIFY_ALL_ITEMS;
  constructor(public payload: StockReceiveUpdateAllItemsPayload) {}
}
export class VerifyAllItemsSuccess implements Action {
  readonly type = StockReceiveActionTypes.VERIFY_ALL_ITEMS_SUCCESS;
  constructor(public payload: boolean) {}
}
export class VerifyAllItemsFailure implements Action {
  readonly type = StockReceiveActionTypes.VERIFY_ALL_ITEMS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class AssignBinToAllItems implements Action {
  readonly type = StockReceiveActionTypes.ASSIGN_BIN_ALL_ITEMS;
  constructor(public payload: StockReceiveUpdateAllItemsPayload) {}
}
export class AssignBinToAllItemsSuccess implements Action {
  readonly type = StockReceiveActionTypes.ASSIGN_BIN_ALL_ITEMS_SUCCESS;
  constructor(public payload: boolean) {}
}
export class AssignBinToAllItemsFailure implements Action {
  readonly type = StockReceiveActionTypes.ASSIGN_BIN_ALL_ITEMS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ConfirmStockReceive implements Action {
  readonly type = StockReceiveActionTypes.CONFIRM_STOCK_RECEIVE;
  constructor(public payload: StockReceiveConfirmStockReceivePayload) {}
}
export class ConfirmStockReceiveSuccess implements Action {
  readonly type = StockReceiveActionTypes.CONFIRM_STOCK_RECEIVE_SUCCESS;
  constructor(public payload: any) {}
}
export class ConfirmStockReceiveFailure implements Action {
  readonly type = StockReceiveActionTypes.CONFIRM_STOCK_RECEIVE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadProductGroups implements Action {
  readonly type = StockReceiveActionTypes.LOAD_PRODUCT_GROUPS;
}
export class LoadProductGroupsSuccess implements Action {
  readonly type = StockReceiveActionTypes.LOAD_PRODUCT_GROUPS_SUCCESS;
  constructor(public payload: ProductGroup[]) {}
}
export class LoadProductGroupsFailure implements Action {
  readonly type = StockReceiveActionTypes.LOAD_PRODUCT_GROUPS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadStuddedProductGroups implements Action {
  readonly type = StockReceiveActionTypes.LOAD_STUDDED_PRODUCT_GROUPS;
}
export class LoadStuddedProductGroupsSuccess implements Action {
  readonly type = StockReceiveActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_SUCCESS;
  constructor(public payload: string[]) {}
}
export class LoadStuddedProductGroupsFailure implements Action {
  readonly type = StockReceiveActionTypes.LOAD_STUDDED_PRODUCT_GROUPS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadProductCategories implements Action {
  readonly type = StockReceiveActionTypes.LOAD_PRODUCT_CATEGORIES;
}
export class LoadProductCategoriesSuccess implements Action {
  readonly type = StockReceiveActionTypes.LOAD_PRODUCT_CATEGORIES_SUCCESS;
  constructor(public payload: ProductCategory[]) {}
}
export class LoadProductCategoriesFailure implements Action {
  readonly type = StockReceiveActionTypes.LOAD_PRODUCT_CATEGORIES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetError implements Action {
  readonly type = StockReceiveActionTypes.RESET_ERROR;
}

export class ClearStocks implements Action {
  readonly type = StockReceiveActionTypes.CLEAR_STOCKS;
}

export class ClearItems implements Action {
  readonly type = StockReceiveActionTypes.CLEAR_ITEMS;
}

export class ResetSearch implements Action {
  readonly type = StockReceiveActionTypes.RESET_SEARCH;
  constructor(public payload: boolean) {}
}

export class ClearSearchResult implements Action {
  readonly type = StockReceiveActionTypes.CLEAR_SEARCH_RESULT;
}

export class LoadStockReceiveHistory implements Action {
  readonly type = StockReceiveActionTypes.LOAD_STOCK_RECEIVE_HISTORY;
  constructor(public payload: StockReceiveHistoryPayload) {}
}
export class LoadStockReceiveHistorySuccess implements Action {
  readonly type = StockReceiveActionTypes.LOAD_STOCK_RECEIVE_HISTORY_SUCCESS;
  constructor(public payload: { stocks: StockReceiveStock[]; count: number }) {}
}
export class LoadStockReceiveHistoryFailure implements Action {
  readonly type = StockReceiveActionTypes.LOAD_STOCK_RECEIVE_HISTORY_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadStockReceiveInvoiceHistory implements Action {
  readonly type = StockReceiveActionTypes.LOAD_STOCK_RECEIVE_INVOICE_HISTORY;
  constructor(public payload: StockReceiveHistoryPayload) {}
}
export class LoadStockReceiveInvoiceHistorySuccess implements Action {
  readonly type =
    StockReceiveActionTypes.LOAD_STOCK_RECEIVE_INVOICE_HISTORY_SUCCESS;
  constructor(public payload: { stocks: StockReceiveStock[]; count: number }) {}
}
export class LoadStockReceiveInvoiceHistoryFailure implements Action {
  readonly type =
    StockReceiveActionTypes.LOAD_STOCK_RECEIVE_INVOICE_HISTORY_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class ResetStockReceiveHistory implements Action {
  readonly type = StockReceiveActionTypes.RESET_STOCK_RECEIVE_HISTORY;
}
export class LoadStockReceiveHistoryItems implements Action {
  readonly type = StockReceiveActionTypes.LOAD_STOCK_RECEIVE_HISTORY_ITEMS;
  constructor(public payload: StockReceiveHistoryItemsPayload) {}
}
export class LoadStockReceiveHistoryItemsSuccess implements Action {
  readonly type =
    StockReceiveActionTypes.LOAD_STOCK_RECEIVE_HISTORY_ITEMS_SUCCESS;
  constructor(
    public payload: {
      items: StockReceiveItem[];
      count: number;
      status?: string;
    }
  ) {}
}
export class LoadStockReceiveHistoryItemsFailure implements Action {
  readonly type =
    StockReceiveActionTypes.LOAD_STOCK_RECEIVE_HISTORY_ITEMS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class StoreHistoryType implements Action {
  readonly type = StockReceiveActionTypes.STORE_HISTORY_TYPE;
  constructor(public payload: string) {}
}
export class StoreAdvancedFilterData implements Action {
  readonly type = StockReceiveActionTypes.STORE_ADVANCED_FILTER_DATE;
  constructor(public payload: AdvanceFilterPayload) {}
}
export class ResetAdvanceFilter implements Action {
  readonly type = StockReceiveActionTypes.RESET_ADVANCE_FILTER;
  constructor(public payload: any) {}
}

// Image
export class LoadThumbnailImageUrl implements Action {
  readonly type = StockReceiveActionTypes.LOAD_THUMBNAIL_IMAGE_URL;
  constructor(public payload: ImageReqPayload) {}
}
export class LoadThumbnailImageUrlSuccess implements Action {
  readonly type = StockReceiveActionTypes.LOAD_THUMBNAIL_IMAGE_URL_SUCCESS;
  constructor(public payload:  ImageResponse) {}
}
export class LoadThumbnailImageUrlFailure implements Action {
  readonly type = StockReceiveActionTypes.LOAD_THUMBNAIL_IMAGE_URL_FAILURE;
  constructor(public payload:  ImageResponse) {}
}

export class LoadImageUrl implements Action {
  readonly type = StockReceiveActionTypes.LOAD_IMAGE_URL;
  constructor(public payload: ImageReqPayload) {}
}
export class LoadImageUrlSuccess implements Action {
  readonly type = StockReceiveActionTypes.LOAD_IMAGE_URL_SUCCESS;
  constructor(public payload:  ImageResponse) {}
}
export class LoadImageUrlFailure implements Action {
  readonly type = StockReceiveActionTypes.LOAD_IMAGE_URL_FAILURE;
  constructor(public payload:  ImageResponse) {}
}


/**
 * Stock Receive Actions Type
 */
export type StockReceiveActions =
  | LoadPendingFactorySTN
  | LoadPendingFactorySTNSuccess
  | LoadPendingFactorySTNFailure
  | LoadPendingBoutiqueSTN
  | LoadPendingBoutiqueSTNSuccess
  | LoadPendingBoutiqueSTNFailure
  | LoadPendingMerchandiseSTN
  | LoadPendingMerchandiseSTNSuccess
  | LoadPendingMerchandiseSTNFailure
  | LoadPendingCFAInvoice
  | LoadPendingCFAInvoiceSuccess
  | LoadPendingCFAInvoiceFailure
  | SearchPendingStocks
  | SearchPendingStocksSuccess
  | SearchPendingStocksFailure
  | SearchPendingInvoices
  | SearchPendingInvoicesSuccess
  | SearchPendingInvoicesFailure
  | SearchClear
  | LoadItemsTotalCount
  | LoadItemsTotalCountSuccess
  | LoadItemsTotalCountFailure
  | LoadSelectedStock
  | LoadSelectedStockSuccess
  | LoadSelectedStockFailure
  | LoadSelectedInvoice
  | LoadSelectedInvoiceSuccess
  | LoadSelectedInvoiceFailure
  | LoadItems
  | LoadItemsSuccess
  | LoadItemsFailure
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
  | ResetError
  | ClearStocks
  | LoadProductGroups
  | LoadProductGroupsSuccess
  | LoadProductGroupsFailure
  | LoadStuddedProductGroups
  | LoadStuddedProductGroupsSuccess
  | LoadStuddedProductGroupsFailure
  | LoadProductCategories
  | LoadProductCategoriesSuccess
  | LoadProductCategoriesFailure
  | ValidateItem
  | ValidateItemSuccess
  | ValidateItemFailure
  | ResetSearch
  | ClearItems
  | LoadStockReceiveHistory
  | LoadStockReceiveHistorySuccess
  | LoadStockReceiveHistoryFailure
  | ResetStockReceiveHistory
  | LoadStockReceiveInvoiceHistory
  | LoadStockReceiveInvoiceHistorySuccess
  | LoadStockReceiveInvoiceHistoryFailure
  | LoadStockReceiveHistoryItems
  | LoadStockReceiveHistoryItemsSuccess
  | LoadStockReceiveHistoryItemsFailure
  | StoreHistoryType
  | StoreAdvancedFilterData
  | ClearSearchResult
  | ResetAdvanceFilter
  | FetchSTNFromOracle
  | FetchSTNFromOracleSuccess
  | FetchSTNFromOracleFailure
  | FetchInvoiceFromOracle
  | FetchInvoiceFromOracleSuccess
  | FetchInvoiceFromOracleFailure
  | GetTotalMeasuredWeight
  | GetTotalMeasuredWeightSuccess
  | GetTotalMeasuredWeightFailure
  | LoadImageUrl
  | LoadImageUrlSuccess
  | LoadImageUrlFailure
  | LoadThumbnailImageUrl
  | LoadThumbnailImageUrlSuccess
  | LoadThumbnailImageUrlFailure;
