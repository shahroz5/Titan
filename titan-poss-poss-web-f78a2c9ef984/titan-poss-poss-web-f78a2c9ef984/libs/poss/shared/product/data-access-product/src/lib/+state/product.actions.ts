import { Action } from '@ngrx/store';
import {
  CustomErrors,
  SearchProductPayload,
  SearchProductList,
  ProductDetailsPayload,
  ProductDetails,
  CashMemoItemValidate,
  ProductPriceDetails,
  ValidateProductAndPriceDetailsPayload,
  CashMemoItemDetailsRequestPayload,
  TaxDetailsPayload,
  CashMemoTaxDetails,
  CashMemoItemDetailsResponse,
  CoinDetails,
  CashMemoDetailsResponse,
  ProductDetailsInGrid,
  RsoDetailsPayload,
  CNDetailsRequestPayload,
  CNDetailsResponsePayload,
  CashMemoDetailsRequestPayload,
  COItemDetailsRequestPayload,
  COItemDetailsResponse
} from '@poss-web/shared/models';

export enum ProductActionTypes {
  SEARCH_PRODUCT = '[Product] Search Product',
  SEARCH_PRODUCT_SUCCESS = '[Product] Search Product Success',
  SEARCH_PRODUCT_FAILURE = '[Product] Search Product Failure',

  LOAD_PRODUCT_DETAILS = '[Product] Load Product Details',
  LOAD_PRODUCT_DETAILS_SUCCESS = '[Product] Load Product Details Success',
  LOAD_PRODUCT_DETAILS_FAILURE = '[Product] Load Product Details Failure',

  LOAD_RSO_DETAILS = '[Product] Load RSO Details',
  LOAD_RSO_DETAILS_SUCCESS = '[Product] Load RSO Details Success',
  LOAD_RSO_DETAILS_FAILURE = '[Product] Load RSO Details Failure',

  VALIDATE_PRODUCT_AND_PRICE_DETAILS = '[Product] Validate Product and Price Details',
  VALIDATE_PRODUCT_AND_PRICE_DETAILS_SUCCESS = '[Product] Validate Product and Price Details Success',
  VALIDATE_PRODUCT_AND_PRICE_DETAILS_FAILURE = '[Product] Validate Product and Price Details Failure',

  LOAD_TAX_DETAILS = '[Product] Load Tax Details',
  LOAD_TAX_DETAILS_SUCCESS = '[Product] Load Tax Details Success',
  LOAD_TAX_DETAILS_FAILURE = '[Product] Load Tax Details Failure',

  PARTIAL_UPDATE_CASH_MEMO = '[Product] Partial Update  Cash Memo',
  PARTIAL_UPDATE_CASH_MEMO_SUCCESS = '[Product] Partial Update  Cash Memo Success',
  PARTIAL_UPDATE_CASH_MEMO_FAILURE = '[Product] Partial Update  Cash Memo Failure',

  ADD_ITEM_TO_CASH_MEMO = '[Product] Add Item to Product',
  ADD_ITEM_TO_CASH_MEMO_SUCCESS = '[Product] Add Item to Product Success',
  ADD_ITEM_TO_CASH_MEMO_FAILURE = '[Product] Add Item to Product Failure',

  GET_ITEM_FROM_CASH_MEMO = '[Product] Get Item from Product',
  GET_ITEM_FROM_CASH_MEMO_SUCCESS = '[Product] Get Item from Product Success',
  GET_ITEM_FROM_CASH_MEMO_FAILURE = '[Product] Get Item from Product Failure',

  PARTIAL_UPDATE_ITEM_IN_CASH_MEMO = '[Product] Partial Update Item in Product',
  PARTIAL_UPDATE_ITEM_IN_CASH_MEMO_SUCCESS = '[Product] Partial Update Item in Product Success',
  PARTIAL_UPDATE_ITEM_IN_CASH_MEMO_FAILURE = '[Product] Partial Update Item in Product Failure',

  UPDATE_ITEM_IN_CASH_MEMO = '[Product] Update Item in Product',
  UPDATE_ITEM_IN_CASH_MEMO_SUCCESS = '[Product] Update Item in Product Success',
  UPDATE_ITEM_IN_CASH_MEMO_FAILURE = '[Product] Update Item in Product Failure',

  DELETE_ITEM_FROM_CASH_MEMO = '[Product] Delete Item from Product',
  DELETE_ITEM_FROM_CASH_MEMO_SUCCESS = '[Product] Delete Item from Product Success',
  DELETE_ITEM_FROM_CASH_MEMO_FAILURE = '[Product] Delete Item from Product Failure',

  VALIDATE_ITEM = '[ Product] Validate item ',
  VALIDATE_ITEM_SUCCESS = '[ Product ]  Validate item Success ',
  VALIDATE_ITEM_FAILURE = '[ Product ]  Validate item Failure ',

  LOAD_COIN_DETAILS = '[Product] Load Coin Details',
  LOAD_COIN_DETAILS_SUCCESS = '[Product] Load Coin Details Success',
  LOAD_COIN_DETAILS_FAILURE = '[Product] Load Coin Details Failure',

  LOAD_PRICE_DETAILS = '[Product] Load Price Details',
  LOAD_PRICE_DETAILS_SUCCESS = '[Product] Load Price Details Success',
  LOAD_PRICE_DETAILS_FAILURE = '[Product] Load Price Details Failure',

  LOAD_REASONS = '[Product] Load Reasons',
  LOAD_REASONS_SUCCESS = '[Product] Load Reasons Success',
  LOAD_REASONS_FAILURE = '[Product] Load Reasons Failure',

  LOAD_SELECTED_LOTNUMBER_DETAILS = '[Product] Load Selected LotNumber Details',
  LOAD_SELECTED_ITEM_DETAILS = '[Product] Load Selected Item Details',

  SET_ITEMID_LIST = '[Product] Set ItemID List',
  GET_ITEMID_LIST = '[Product] Get ItemID List',

  RESET_VALUES = '[Product] Reset Values',
  RESET_LOTNUMBER_VALUES = '[Product] Reset LotNumber Values',
  RESET_PRODUCT_VALUES = '[Product] Reset Product Values',
  RESET_COIN_VALUES = '[Product] Reset Coin Values',
  RESET_ITEMID_VALUES = '[Product] Reset ItemId Values',
  RESET_ITEMID_LIST = '[Product] Reset ItemId List',

  CLEAR_SEARCH_PRODUCT_LIST = '[ Product ]  Clear Search Product List',
  CLEAR_PRODUCT_LIST = '[ Product ]  Clear Product List',
  CLEAR_PRODUCT_RELATED_DETAILS = '[ Product ]  Clear Product Related Details',
  CLEAR_VALIDATE_ITEM = '[ Product ]  Clear Validate Item',

  CLEAR_PRODUCT_GRID = '[Product] Clear Product Grid',

  SET_GRID_SEARCH_ENABLE = '[Product] Set Grid Search Enable',
  GET_GRID_SEARCH_ENABLE = '[Product] Get Grid Search Enable',

  SET_STANDARD_PRICE = '[Product] Set Standard Price',
  GET_STANDARD_PRICE = '[Product] Get Standard Price',

  SET_METAL_RATE = '[Product] Set Metal Rate',
  GET_METAL_RATE = '[Product] Get Metal Rate',

  SET_CREATE_ORDER = '[Product] Set Create Order',
  GET_CREATE_ORDER = '[Product] Get Create Order',

  GET_ITEM_DETAILS = '[Product] Get Item Details',
  GET_ITEM_DETAILS_SUCCESS = '[Product] Get Item Details Success',
  GET_ITEM_DETAILS_FAILURE = '[Product] Get Item Details Failure',

  DELETE_ITEM_DETAILS = '[Product] Delete Item Details',
  DELETE_ITEM_DETAILS_SUCCESS = '[Product] Delete Item Details Success',
  DELETE_ITEM_DETAILS_FAILURE = '[Product] Delete Item Details Failure',

  SET_DISCOUNT_SELECTED = '[Product] Set Discount Selected',
  SET_AB_INVOKED_FIRST_TIME = '[Product] Set AB Invoked First Time',

  LOAD_VALID_COIN_DETAILS = '[Product] Load Valid Coin Details',
  LOAD_VALID_COIN_DETAILS_SUCCESS = '[Product] Load Valid Coin Details Success',
  LOAD_VALID_COIN_DETAILS_FAILURE = '[Product] Load Valid Coin Details Failure',

  LOAD_CREDIT_NOTE_DETAILS = '[Product] Load Credit Note Details',
  LOAD_CREDIT_NOTE_DETAILS_SUCCESS = '[Product] Load Credit Note Details Success',
  LOAD_CREDIT_NOTE_DETAILS_FAILURE = '[Product] Load Credit Note Details Failure',

  SET_ITEM_DETAILS_OPERATION = '[Product] Set Item Details Operation',

  // CO

  ADD_ITEM_TO_CO = '[Product] Add Item to CO',
  ADD_ITEM_TO_CO_SUCCESS = '[Product] Add Item to CO Success',
  ADD_ITEM_TO_CO_FAILURE = '[Product] Add Item to CO Failure',

  GET_ITEM_FROM_CO = '[Product] Get Item from CO',
  GET_ITEM_FROM_CO_SUCCESS = '[Product] Get Item from CO Success',
  GET_ITEM_FROM_CO_FAILURE = '[Product] Get Item from CO Failure',

  PARTIAL_UPDATE_ITEM_IN_CO = '[Product] Partial Update Item in CO',
  PARTIAL_UPDATE_ITEM_IN_CO_SUCCESS = '[Product] Partial Update Item in CO Success',
  PARTIAL_UPDATE_ITEM_IN_CO_FAILURE = '[Product] Partial Update Item in CO Failure',

  UPDATE_ITEM_IN_CO = '[Product] Update Item in CO',
  UPDATE_ITEM_IN_CO_SUCCESS = '[Product] Update Item in CO Success',
  UPDATE_ITEM_IN_CO_FAILURE = '[Product] Update Item in CO Failure',

  DELETE_ITEM_FROM_CO = '[Product] Delete Item from CO',
  DELETE_ITEM_FROM_CO_SUCCESS = '[Product] Delete Item from CO Success',
  DELETE_ITEM_FROM_CO_FAILURE = '[Product] Delete Item from CO Failure',

  CLEAR_CO_PRODUCT_GRID = '[Product] Clear CO Product Grid',
  RESET_CO_VALUES = '[Product] Reset CO Values'
}

export class SearchProduct implements Action {
  readonly type = ProductActionTypes.SEARCH_PRODUCT;
  constructor(public payload: SearchProductPayload) {}
}

export class SearchProductSuccess implements Action {
  readonly type = ProductActionTypes.SEARCH_PRODUCT_SUCCESS;
  constructor(public payload: SearchProductList[]) {}
}

export class SearchProductFailure implements Action {
  readonly type = ProductActionTypes.SEARCH_PRODUCT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadProductDetails implements Action {
  readonly type = ProductActionTypes.LOAD_PRODUCT_DETAILS;
  constructor(public payload: ProductDetailsPayload) {}
}

export class LoadProductDetailsSuccess implements Action {
  readonly type = ProductActionTypes.LOAD_PRODUCT_DETAILS_SUCCESS;
  constructor(public payload: ProductDetails[]) {}
}

export class LoadProductDetailsFailure implements Action {
  readonly type = ProductActionTypes.LOAD_PRODUCT_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadRSODetails implements Action {
  readonly type = ProductActionTypes.LOAD_RSO_DETAILS;
  constructor(public payload: string, public locationCodes?: string) {}
}

export class LoadRSODetailsSuccess implements Action {
  readonly type = ProductActionTypes.LOAD_RSO_DETAILS_SUCCESS;
  constructor(public payload: RsoDetailsPayload[]) {}
}

export class LoadRSODetailsFailure implements Action {
  readonly type = ProductActionTypes.LOAD_RSO_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadReasons implements Action {
  readonly type = ProductActionTypes.LOAD_REASONS;
  constructor(public payload: string) {}
}

export class LoadReasonsSuccess implements Action {
  readonly type = ProductActionTypes.LOAD_REASONS_SUCCESS;
  constructor(public payload: string[]) {}
}

export class LoadReasonsFailure implements Action {
  readonly type = ProductActionTypes.LOAD_REASONS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ValidateProductAndPriceDetails implements Action {
  readonly type = ProductActionTypes.VALIDATE_PRODUCT_AND_PRICE_DETAILS;
  constructor(public payload: ValidateProductAndPriceDetailsPayload) {}
}

export class ValidateProductAndPriceDetailsSuccess implements Action {
  readonly type = ProductActionTypes.VALIDATE_PRODUCT_AND_PRICE_DETAILS_SUCCESS;
  constructor(public payload: ProductPriceDetails) {}
}

export class ValidateProductAndPriceDetailsFailure implements Action {
  readonly type = ProductActionTypes.VALIDATE_PRODUCT_AND_PRICE_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadTaxDetails implements Action {
  readonly type = ProductActionTypes.LOAD_TAX_DETAILS;
  constructor(public payload: TaxDetailsPayload) {}
}

export class LoadTaxDetailsSuccess implements Action {
  readonly type = ProductActionTypes.LOAD_TAX_DETAILS_SUCCESS;
  constructor(public payload: CashMemoTaxDetails) {}
}

export class LoadTaxDetailsFailure implements Action {
  readonly type = ProductActionTypes.LOAD_TAX_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class AddItemtoCashMemo implements Action {
  readonly type = ProductActionTypes.ADD_ITEM_TO_CASH_MEMO;
  constructor(readonly payload: CashMemoItemDetailsRequestPayload) {}
}

export class AddItemtoCashMemoSuccess implements Action {
  readonly type = ProductActionTypes.ADD_ITEM_TO_CASH_MEMO_SUCCESS;
  constructor(readonly payload: CashMemoItemDetailsResponse[]) {}
}

export class AddItemtoCashMemoFailure implements Action {
  readonly type = ProductActionTypes.ADD_ITEM_TO_CASH_MEMO_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class GetItemfromCashMemo implements Action {
  readonly type = ProductActionTypes.GET_ITEM_FROM_CASH_MEMO;
  constructor(readonly payload: CashMemoItemDetailsRequestPayload) {}
}

export class GetItemfromCashMemoSuccess implements Action {
  readonly type = ProductActionTypes.GET_ITEM_FROM_CASH_MEMO_SUCCESS;
  constructor(
    readonly payload: CashMemoItemDetailsResponse[],
    public isAddFlag: boolean,
    public loadAutoDiscounts: boolean
  ) {}
}

export class GetItemfromCashMemoFailure implements Action {
  readonly type = ProductActionTypes.GET_ITEM_FROM_CASH_MEMO_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class PartialUpdateIteminCashMemo implements Action {
  readonly type = ProductActionTypes.PARTIAL_UPDATE_ITEM_IN_CASH_MEMO;
  constructor(readonly payload: CashMemoItemDetailsRequestPayload) {}
}

export class PartialUpdateIteminCashMemoSuccess implements Action {
  readonly type = ProductActionTypes.PARTIAL_UPDATE_ITEM_IN_CASH_MEMO_SUCCESS;
  constructor(readonly payload: CashMemoItemDetailsResponse[]) {}
}

export class PartialUpdateIteminCashMemoFailure implements Action {
  readonly type = ProductActionTypes.PARTIAL_UPDATE_ITEM_IN_CASH_MEMO_FAILURE;
  constructor(
    readonly payload: {
      error: CustomErrors;
      oldData: CashMemoItemDetailsResponse;
    }
  ) {}
}

export class UpdateIteminCashMemo implements Action {
  readonly type = ProductActionTypes.UPDATE_ITEM_IN_CASH_MEMO;
  constructor(readonly payload: CashMemoItemDetailsRequestPayload) {}
}

export class UpdateIteminCashMemoSuccess implements Action {
  readonly type = ProductActionTypes.UPDATE_ITEM_IN_CASH_MEMO_SUCCESS;
  constructor(readonly payload: CashMemoItemDetailsResponse[]) {}
}

export class UpdateIteminCashMemoFailure implements Action {
  readonly type = ProductActionTypes.UPDATE_ITEM_IN_CASH_MEMO_FAILURE;
  constructor(
    readonly payload: {
      error: CustomErrors;
      oldData: CashMemoItemDetailsResponse;
    }
  ) {}
}

export class DeleteItemfromCashMemo implements Action {
  readonly type = ProductActionTypes.DELETE_ITEM_FROM_CASH_MEMO;
  constructor(readonly payload: CashMemoItemDetailsRequestPayload) {}
}

export class DeleteItemfromCashMemoSuccess implements Action {
  readonly type = ProductActionTypes.DELETE_ITEM_FROM_CASH_MEMO_SUCCESS;
  constructor(
    readonly payload: {
      itemId: string;
      data: CashMemoItemDetailsResponse;
      itemDetails: ProductDetailsInGrid;
    }
  ) {}
}

export class DeleteItemfromCashMemoFailure implements Action {
  readonly type = ProductActionTypes.DELETE_ITEM_FROM_CASH_MEMO_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class ValidateItem implements Action {
  readonly type = ProductActionTypes.VALIDATE_ITEM;
  constructor(public payload: CashMemoItemValidate) {}
}

export class ValidateItemSuccess implements Action {
  readonly type = ProductActionTypes.VALIDATE_ITEM_SUCCESS;
  constructor(
    public payload: {
      itemId: string;
      isSuccess: boolean;
      toleranceLimit?: number;
    }
  ) {}
}

export class ValidateItemFailure implements Action {
  readonly type = ProductActionTypes.VALIDATE_ITEM_FAILURE;
  constructor(public payload: { itemId: string; error: CustomErrors }) {}
}

export class LoadCoinDetails implements Action {
  readonly type = ProductActionTypes.LOAD_COIN_DETAILS;
  constructor(
    public payload: { itemCode: string; withSaleableCheck: boolean }
  ) {}
}

export class LoadCoinDetailsSuccess implements Action {
  readonly type = ProductActionTypes.LOAD_COIN_DETAILS_SUCCESS;
  constructor(
    public payload: { itemCode: string; coinDetails: CoinDetails[] }
  ) {}
}

export class LoadCoinDetailsFailure implements Action {
  readonly type = ProductActionTypes.LOAD_COIN_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadPriceDetails implements Action {
  readonly type = ProductActionTypes.LOAD_PRICE_DETAILS;
  constructor(public payload: ValidateProductAndPriceDetailsPayload) {}
}

export class LoadPriceDetailsSuccess implements Action {
  readonly type = ProductActionTypes.LOAD_PRICE_DETAILS_SUCCESS;
  constructor(public payload: ProductPriceDetails) {}
}

export class LoadPriceDetailsFailure implements Action {
  readonly type = ProductActionTypes.LOAD_PRICE_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadSelectedLotNumberDetails implements Action {
  readonly type = ProductActionTypes.LOAD_SELECTED_LOTNUMBER_DETAILS;
  constructor(public payload: string) {}
}

export class LoadSelectedItemDetails implements Action {
  readonly type = ProductActionTypes.LOAD_SELECTED_ITEM_DETAILS;
  constructor(public payload: string) {}
}

export class ResetItemIdValues implements Action {
  readonly type = ProductActionTypes.RESET_ITEMID_VALUES;
}

export class ResetItemIdList implements Action {
  readonly type = ProductActionTypes.RESET_ITEMID_LIST;
}

export class ResetValues implements Action {
  readonly type = ProductActionTypes.RESET_VALUES;
}

export class ResetLotNumberValues implements Action {
  readonly type = ProductActionTypes.RESET_LOTNUMBER_VALUES;
}

export class ResetProductValues implements Action {
  readonly type = ProductActionTypes.RESET_PRODUCT_VALUES;
}

export class ResetCoinValues implements Action {
  readonly type = ProductActionTypes.RESET_COIN_VALUES;
}

export class ClearSearchProductList implements Action {
  readonly type = ProductActionTypes.CLEAR_SEARCH_PRODUCT_LIST;
}

export class ClearProductList implements Action {
  readonly type = ProductActionTypes.CLEAR_PRODUCT_LIST;
}

export class ClearProductRelatedDetails implements Action {
  readonly type = ProductActionTypes.CLEAR_PRODUCT_RELATED_DETAILS;
}

export class ClearValidateItem implements Action {
  readonly type = ProductActionTypes.CLEAR_VALIDATE_ITEM;
}

export class SetItemIDList implements Action {
  readonly type = ProductActionTypes.SET_ITEMID_LIST;
  constructor(
    public payload: {
      item: CashMemoDetailsResponse;
      isUpdate: boolean;
      isGetHeaderDetails?: boolean;
      loadAutoDiscounts?: boolean;
    }
  ) {}
}

export class GetItemIDList implements Action {
  readonly type = ProductActionTypes.GET_ITEMID_LIST;
}

export class ClearProductGrid implements Action {
  readonly type = ProductActionTypes.CLEAR_PRODUCT_GRID;
}

export class SetGridSearchEnable implements Action {
  readonly type = ProductActionTypes.SET_GRID_SEARCH_ENABLE;
  constructor(public payload: boolean) {}
}

export class GetGridSearchEnable implements Action {
  readonly type = ProductActionTypes.GET_GRID_SEARCH_ENABLE;
  constructor(public payload: boolean) {}
}
export class SetStandardPrice implements Action {
  readonly type = ProductActionTypes.SET_STANDARD_PRICE;
  constructor(public payload: {}) {}
}

export class GetStandardPrice implements Action {
  readonly type = ProductActionTypes.GET_STANDARD_PRICE;
  constructor(public payload: {}) {}
}

export class SetMetalRate implements Action {
  readonly type = ProductActionTypes.SET_METAL_RATE;
  constructor(public payload: {}) {}
}

export class GetMetalRate implements Action {
  readonly type = ProductActionTypes.GET_METAL_RATE;
  constructor(public payload: {}) {}
}

export class SetCreateOrder implements Action {
  readonly type = ProductActionTypes.SET_CREATE_ORDER;
  constructor(public payload: boolean) {}
}

export class GetCreateOrder implements Action {
  readonly type = ProductActionTypes.GET_CREATE_ORDER;
  constructor(public payload: boolean) {}
}

export class GetItemDetails implements Action {
  readonly type = ProductActionTypes.GET_ITEM_DETAILS;
  constructor(readonly payload: CashMemoItemDetailsRequestPayload) {}
}

export class GetItemDetailsSuccess implements Action {
  readonly type = ProductActionTypes.GET_ITEM_DETAILS_SUCCESS;
  constructor(readonly payload: CashMemoItemDetailsResponse[]) {}
}

export class GetItemDetailsFailure implements Action {
  readonly type = ProductActionTypes.GET_ITEM_DETAILS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class DeleteItemDetails implements Action {
  readonly type = ProductActionTypes.DELETE_ITEM_DETAILS;
  constructor(readonly payload: CashMemoItemDetailsRequestPayload) {}
}

export class DeleteItemDetailsSuccess implements Action {
  readonly type = ProductActionTypes.DELETE_ITEM_DETAILS_SUCCESS;
  constructor(
    readonly payload: {
      itemId: string;
      data: CashMemoItemDetailsResponse;
      itemDetails: ProductDetailsInGrid;
    }
  ) {}
}

export class DeleteItemDetailsFailure implements Action {
  readonly type = ProductActionTypes.DELETE_ITEM_DETAILS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class SetDiscountSelected implements Action {
  readonly type = ProductActionTypes.SET_DISCOUNT_SELECTED;
  constructor(public payload: boolean) {}
}

export class SetABInvokedFirstTime implements Action {
  readonly type = ProductActionTypes.SET_AB_INVOKED_FIRST_TIME;
  constructor(readonly payload: boolean) {}
}
export class SetItemDetailsOperation implements Action {
  readonly type = ProductActionTypes.SET_ITEM_DETAILS_OPERATION;
  constructor(public payload: string) {}
}

export class LoadValidCoinDetails implements Action {
  readonly type = ProductActionTypes.LOAD_VALID_COIN_DETAILS;
  constructor(
    public payload: { itemCode: string; withSaleableCheck: boolean }
  ) {}
}

export class LoadValidCoinDetailsSuccess implements Action {
  readonly type = ProductActionTypes.LOAD_VALID_COIN_DETAILS_SUCCESS;
  constructor(
    public payload: { itemCode: string; coinDetails: CoinDetails[] }
  ) {}
}

export class LoadValidCoinDetailsFailure implements Action {
  readonly type = ProductActionTypes.LOAD_VALID_COIN_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadCreditNoteDetails implements Action {
  readonly type = ProductActionTypes.LOAD_CREDIT_NOTE_DETAILS;
  constructor(public payload: CNDetailsRequestPayload) {}
}
export class LoadCreditNoteDetailsSuccess implements Action {
  readonly type = ProductActionTypes.LOAD_CREDIT_NOTE_DETAILS_SUCCESS;
  constructor(public payload: CNDetailsResponsePayload[]) {}
}
export class LoadCreditNoteDetailsFailure implements Action {
  readonly type = ProductActionTypes.LOAD_CREDIT_NOTE_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class PartialUpdateCashMemo implements Action {
  readonly type = ProductActionTypes.PARTIAL_UPDATE_CASH_MEMO;
  constructor(readonly payload: CashMemoDetailsRequestPayload) {}
}
export class PartialUpdateCashMemoSuccess implements Action {
  readonly type = ProductActionTypes.PARTIAL_UPDATE_CASH_MEMO_SUCCESS;
  constructor(readonly payload: CashMemoDetailsResponse) {}
}

export class PartialUpdateCashMemoFailure implements Action {
  readonly type = ProductActionTypes.PARTIAL_UPDATE_CASH_MEMO_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

// CO

export class AddItemtoCO implements Action {
  readonly type = ProductActionTypes.ADD_ITEM_TO_CO;
  constructor(readonly payload: COItemDetailsRequestPayload) {}
}

export class AddItemtoCOSuccess implements Action {
  readonly type = ProductActionTypes.ADD_ITEM_TO_CO_SUCCESS;
  constructor(readonly payload: COItemDetailsResponse[]) {}
}

export class AddItemtoCOFailure implements Action {
  readonly type = ProductActionTypes.ADD_ITEM_TO_CO_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class GetItemfromCO implements Action {
  readonly type = ProductActionTypes.GET_ITEM_FROM_CO;
  constructor(readonly payload: COItemDetailsRequestPayload) {}
}

export class GetItemfromCOSuccess implements Action {
  readonly type = ProductActionTypes.GET_ITEM_FROM_CO_SUCCESS;
  constructor(
    readonly payload: COItemDetailsResponse[],
    public isAddFlag: boolean
  ) {}
}

export class GetItemfromCOFailure implements Action {
  readonly type = ProductActionTypes.GET_ITEM_FROM_CO_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class PartialUpdateIteminCO implements Action {
  readonly type = ProductActionTypes.PARTIAL_UPDATE_ITEM_IN_CO;
  constructor(readonly payload: COItemDetailsRequestPayload) {}
}

export class PartialUpdateIteminCOSuccess implements Action {
  readonly type = ProductActionTypes.PARTIAL_UPDATE_ITEM_IN_CO_SUCCESS;
  constructor(readonly payload: COItemDetailsResponse[]) {}
}

export class PartialUpdateIteminCOFailure implements Action {
  readonly type = ProductActionTypes.PARTIAL_UPDATE_ITEM_IN_CO_FAILURE;
  constructor(
    readonly payload: {
      error: CustomErrors;
      oldData: COItemDetailsResponse;
    }
  ) {}
}

export class UpdateIteminCO implements Action {
  readonly type = ProductActionTypes.UPDATE_ITEM_IN_CO;
  constructor(readonly payload: COItemDetailsRequestPayload) {}
}

export class UpdateIteminCOSuccess implements Action {
  readonly type = ProductActionTypes.UPDATE_ITEM_IN_CO_SUCCESS;
  constructor(readonly payload: COItemDetailsResponse[]) {}
}

export class UpdateIteminCOFailure implements Action {
  readonly type = ProductActionTypes.UPDATE_ITEM_IN_CO_FAILURE;
  constructor(
    readonly payload: {
      error: CustomErrors;
      oldData: COItemDetailsResponse;
    }
  ) {}
}

export class DeleteItemfromCO implements Action {
  readonly type = ProductActionTypes.DELETE_ITEM_FROM_CO;
  constructor(readonly payload: COItemDetailsRequestPayload) {}
}

export class DeleteItemfromCOSuccess implements Action {
  readonly type = ProductActionTypes.DELETE_ITEM_FROM_CO_SUCCESS;
  constructor(
    readonly payload: {
      itemId: string;
      data: COItemDetailsResponse;
      itemDetails: any;
    }
  ) {}
}

export class DeleteItemfromCOFailure implements Action {
  readonly type = ProductActionTypes.DELETE_ITEM_FROM_CO_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class ClearCOProductGrid implements Action {
  readonly type = ProductActionTypes.CLEAR_CO_PRODUCT_GRID;
  constructor(readonly payload: boolean) {}
}

export class ResetCOValues implements Action {
  readonly type = ProductActionTypes.RESET_CO_VALUES;
}

export type ProductActions =
  | SearchProduct
  | SearchProductSuccess
  | SearchProductFailure
  | LoadProductDetails
  | LoadProductDetailsSuccess
  | LoadProductDetailsFailure
  | LoadRSODetails
  | LoadRSODetailsSuccess
  | LoadRSODetailsFailure
  | LoadReasons
  | LoadReasonsSuccess
  | LoadReasonsFailure
  | ValidateProductAndPriceDetails
  | ValidateProductAndPriceDetailsSuccess
  | ValidateProductAndPriceDetailsFailure
  | LoadTaxDetails
  | LoadTaxDetailsSuccess
  | LoadTaxDetailsFailure
  | AddItemtoCashMemo
  | AddItemtoCashMemoSuccess
  | AddItemtoCashMemoFailure
  | GetItemfromCashMemo
  | GetItemfromCashMemoSuccess
  | GetItemfromCashMemoFailure
  | PartialUpdateIteminCashMemo
  | PartialUpdateIteminCashMemoSuccess
  | PartialUpdateIteminCashMemoFailure
  | UpdateIteminCashMemo
  | UpdateIteminCashMemoSuccess
  | UpdateIteminCashMemoFailure
  | DeleteItemfromCashMemo
  | DeleteItemfromCashMemoSuccess
  | DeleteItemfromCashMemoFailure
  | ValidateItem
  | ValidateItemSuccess
  | ValidateItemFailure
  | LoadCoinDetails
  | LoadCoinDetailsSuccess
  | LoadCoinDetailsFailure
  | LoadPriceDetails
  | LoadPriceDetailsSuccess
  | LoadPriceDetailsFailure
  | LoadSelectedLotNumberDetails
  | ResetValues
  | ResetLotNumberValues
  | ResetProductValues
  | ResetCoinValues
  | ClearSearchProductList
  | ClearProductList
  | ClearProductRelatedDetails
  | ClearValidateItem
  | SetItemIDList
  | GetItemIDList
  | ClearProductGrid
  | SetGridSearchEnable
  | GetGridSearchEnable
  | SetStandardPrice
  | GetStandardPrice
  | SetMetalRate
  | GetMetalRate
  | SetCreateOrder
  | GetCreateOrder
  | GetItemDetails
  | GetItemDetailsSuccess
  | GetItemDetailsFailure
  | DeleteItemDetails
  | DeleteItemDetailsSuccess
  | DeleteItemDetailsFailure
  | LoadSelectedItemDetails
  | ResetItemIdValues
  | ResetItemIdList
  | SetDiscountSelected
  | SetABInvokedFirstTime
  | LoadValidCoinDetails
  | LoadValidCoinDetailsSuccess
  | LoadValidCoinDetailsFailure
  | LoadCreditNoteDetails
  | LoadCreditNoteDetailsSuccess
  | LoadCreditNoteDetailsFailure
  | SetDiscountSelected
  | SetItemDetailsOperation
  | PartialUpdateCashMemo
  | PartialUpdateCashMemoSuccess
  | PartialUpdateCashMemoFailure
  // CO
  | AddItemtoCO
  | AddItemtoCOSuccess
  | AddItemtoCOFailure
  | GetItemfromCO
  | GetItemfromCOSuccess
  | GetItemfromCOFailure
  | UpdateIteminCO
  | UpdateIteminCOSuccess
  | UpdateIteminCOFailure
  | PartialUpdateIteminCO
  | PartialUpdateIteminCOSuccess
  | PartialUpdateIteminCOFailure
  | DeleteItemfromCO
  | DeleteItemfromCOSuccess
  | DeleteItemfromCOFailure
  | ClearCOProductGrid
  | ResetCOValues;
