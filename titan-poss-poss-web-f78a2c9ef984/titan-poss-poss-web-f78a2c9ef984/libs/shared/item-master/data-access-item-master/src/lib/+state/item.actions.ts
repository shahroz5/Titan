import { Action } from '@ngrx/store';
import {
  CustomErrors,
  ItemStones,
  ItemFilter,
  ItemFilterPayload,
  ProductGroup,
  Lov,
  LoadItemListingSuccessPayload,
  ItemDetails
} from '@poss-web/shared/models';

export enum ItemActionTypes {
  LOAD_ITEM_DETAILS_BY_ITEM_CODE = '[Load-Item-Details] Load Item Details By Item Code',
  LOAD_ITEM_DETAILS_BY_ITEM_CODE_SUCCESS = '[Load-Item-Details] Load Item Details By Item Code Success',
  LOAD_ITEM_DETAILS_BY_ITEM_CODE_FAILURE = '[Load-Item-Details] Load Item Details By Item Code Failure',

  // SEARCH_ITEM = '[Item] Search Item',
  // SEARCH_ITEM_SUCCESS = '[Item] Search Item Success',
  // SEARCH_ITEM_FAILURE = '[Item] Search Item Failure',

  LOAD_STONES = '[Item] Load Stones ',
  LOAD_STONES_SUCCESS = '[Item] Load Stones Success',
  LOAD_STONES_FAILURE = '[Item] Load Stones Failure',

  LOAD_ITEM_FILTER = '[Item] Load Item Filter ',
  LOAD_ITEM_FILTER_SUCCESS = '[Item] Load Item Filter Success',
  LOAD_ITEM_FILTER_FAILURE = '[Item] Load Item Filter Failure',

  LOAD_PRICING_TYPES = '[Item]Load Pricing-Type',
  LOAD_PRICING_TYPES_SUCCESS = '[Item]Load Pricing-Type Success',
  LOAD_PRICING_TYPES_FAILURE = '[Item]Load Pricing-Type Failure',

  LOAD_CFAPRODUCT_CODE = '[Item] Load CFAProductcode ',
  LOAD_CFAPRODUCT_CODE_SUCCESS = '[Item] Load CFAProductcode Success',
  LOAD_CFAPRODUCT_CODE_FAILURE = '[Item] Load CFAProductcode Failure',

  RESET_ITEM_DETAILS_BY_ITEM_CODE = '[Load-Item-Details] Reset Item Details By Item Code',

  STORE_FILTER_DATA = '[ Item ] Store Filter Data',

  RESET_FILTER_DATA = '[ Item ] Reset Filter Data'
}

export class LoadItemByItemCode implements Action {
  readonly type = ItemActionTypes.LOAD_ITEM_DETAILS_BY_ITEM_CODE;
  constructor(public payload: string) {}
}
export class LoadItemByItemCodeSuccess implements Action {
  readonly type = ItemActionTypes.LOAD_ITEM_DETAILS_BY_ITEM_CODE_SUCCESS;
  constructor(public payload: ItemDetails) {}
}
export class LoadItemByItemCodeFailure implements Action {
  readonly type = ItemActionTypes.LOAD_ITEM_DETAILS_BY_ITEM_CODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetItemByItemCode implements Action {
  readonly type = ItemActionTypes.RESET_ITEM_DETAILS_BY_ITEM_CODE;

}

// export class SearchItem implements Action {
//   readonly type = ItemActionTypes.SEARCH_ITEM;
//   constructor(public payload: string) {}
// }
// export class SearchItemSuccess implements Action {
//   readonly type = ItemActionTypes.SEARCH_ITEM_SUCCESS;
//   constructor(public payload: ListingPageData[]) {}
// }
// export class SearchItemFailure implements Action {
//   readonly type = ItemActionTypes.SEARCH_ITEM_FAILURE;
//   constructor(public payload: CustomErrors) {}
// }

export class LoadStones implements Action {
  readonly type = ItemActionTypes.LOAD_STONES;
  constructor(public payload: string) {}
}
export class LoadStonesSuccess implements Action {
  readonly type = ItemActionTypes.LOAD_STONES_SUCCESS;
  constructor(public payload: ItemStones[]) {}
}
export class LoadStonesFailure implements Action {
  readonly type = ItemActionTypes.LOAD_STONES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadPricingType implements Action {
  readonly type = ItemActionTypes.LOAD_PRICING_TYPES;
  constructor(public payload: string) {}
}
export class LoadPricingTypeSuccess implements Action {
  readonly type = ItemActionTypes.LOAD_PRICING_TYPES_SUCCESS;
  constructor(public payload: Lov[]) {}
}
export class LoadPricingTypeFailure implements Action {
  readonly type = ItemActionTypes.LOAD_PRICING_TYPES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadCFAProductCode implements Action {
  readonly type = ItemActionTypes.LOAD_CFAPRODUCT_CODE;
}

export class LoadCFAProductCodeSuccess implements Action {
  readonly type = ItemActionTypes.LOAD_CFAPRODUCT_CODE_SUCCESS;
  constructor(public payload: ProductGroup[]) {}
}

export class LoadCFAProductCodeFailure implements Action {
  readonly type = ItemActionTypes.LOAD_CFAPRODUCT_CODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadFilterItemDetails implements Action {
  readonly type = ItemActionTypes.LOAD_ITEM_FILTER;
  constructor(public payload: ItemFilter) {}
}
export class LoadFilterItemDetailsSuccess implements Action {
  readonly type = ItemActionTypes.LOAD_ITEM_FILTER_SUCCESS;
  constructor(public payload: LoadItemListingSuccessPayload) {}
}
export class LoadFilterItemDetailsFailure implements Action {
  readonly type = ItemActionTypes.LOAD_ITEM_FILTER_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class StoreFilter implements Action {
  readonly type = ItemActionTypes.STORE_FILTER_DATA;
  constructor(public payload: ItemFilterPayload) {}
}
export class ResetFilter implements Action {
  readonly type = ItemActionTypes.RESET_FILTER_DATA;
}

export type ItemActions =
  | LoadItemByItemCode
  | LoadItemByItemCodeSuccess
  | LoadItemByItemCodeFailure
  | ResetItemByItemCode
  // | SearchItem
  // | SearchItemSuccess
  // | SearchItemFailure
  | LoadStones
  | LoadStonesSuccess
  | LoadStonesFailure
  | LoadPricingType
  | LoadPricingTypeSuccess
  | LoadPricingTypeFailure
  | LoadCFAProductCode
  | LoadCFAProductCodeSuccess
  | LoadCFAProductCodeFailure
  | LoadFilterItemDetails
  | LoadFilterItemDetailsSuccess
  | LoadFilterItemDetailsFailure
  | StoreFilter
  | ResetFilter;
