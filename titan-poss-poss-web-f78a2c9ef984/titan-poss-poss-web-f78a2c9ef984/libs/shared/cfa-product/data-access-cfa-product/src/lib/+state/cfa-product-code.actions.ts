import { Action } from '@ngrx/store';
import {
  CustomErrors,
  LoadCFAProductCodeListingPayload,
  LoadCFAProductCodeListingSuccessPayload,
  CFAProducts,
  UpdateCFAProductsPayload,
  ProductType,
  CFAProductsResponse,
  ItemTypesResponse,
  ProductGroupDetails
} from '@poss-web/shared/models';
export enum CFAProductCodeActionTypes {
  LOAD_CFA_PRODUCTS = '[CFA Products] Load CFA Products',
  LOAD_CFA_PRODUCTS_SUCCESS = '[CFA Products] Load CFA Products Success',
  LOAD_CFA_PRODUCTS_FAILURE = '[CFA Products] Load CFA Products Failure',
  LOAD_CFA_PRODUCTS_BASED_ON_PRODUCTGROUPCODE = '[CFA Products] Load CFA Product Code Based On ProductGroupCode',
  LOAD_CFA_PRODUCTS_BASED_ON_PRODUCTGROUPCODE_SUCCESS = '[CFA Products] Load CFA Products Based On ProductGroupCode Success',
  LOAD_CFA_PRODUCTS_BASED_ON_PRODUCTGROUPCODE_FAILURE = '[CFA Products] Load CFA Products Based On ProductGroupCode Failure',
  SEARCH_CFA_PRODUCT = '[CFAProducts] Search CFA Product',
  SEARCH_CFA_PRODUCT_SUCCESS = '[CFA Products] Search CFA Product Success',
  SEARCH_CFA_PRODUCT_FAILURE = '[CFA Products] Search CFA Product Failure',
  SAVE_CFA_PRODUCTS = '[CFA Products] Save CFA Products',
  SAVE_CFA_PRODUCTS_SUCCESS = '[CFA Products] Save CFA Products Success',
  SAVE_CFA_PRODUCTS_FAILURE = '[CFA Products] Save CFA Products Failure',
  RESET_CFA_PRODUCTS = '[CFA Products] Reset CFA Products',
  UPDATE_CFA_PRODUCTS = '[CFA Products]Update CFA Products',
  UPDATE_CFA_PRODUCTS_SUCCESS = '[CFA Products]Update CFA Products Success',
  UPDATE_CFA_PRODUCTS_FAILURE = '[CFA Products]Update CFA Products Failure',
  LOAD_PRODUCT_TYPES = '[CFA Products]Load Product Types',
  LOAD_PRODUCT_TYPES_SUCCESS = '[CFA Products]Load Product Types Success',
  LOAD_PRODUCT_TYPES_FAILURE = '[CFA Products]Load Product Types Failure',
  LOAD_ITEM_TYPES = '[CFA Products]Load Item Types',
  LOAD_ITEM_TYPES_SUCCESS = '[CFA Products]Load Item Types Success',
  LOAD_ITEM_TYPES_FAILURE = '[CFA Products]Load Item Types Failure',

  LOAD_PLAIN_STUDDED_TYPE = '[CFA Products]Load Plain Studded Type',
  LOAD_PLAIN_STUDDED_TYPE_SUCCESS = '[CFA Products]Load Plain Studded Type Success',
  LOAD_PLAIN_STUDDED_TYPE_FAILURE = '[CFA Products]Load Plain Studded Type Failure',

  LOAD_HALLMARKING_EXCLUDE_KARAT_TYPE = '[CFA Products]Load Hallmarking Exclude Karat Type',
  LOAD_HALLMARKING_EXCLUDE_KARAT_TYPE_SUCCESS = '[CFA Products]Load Hallmarking Exclude Karat Type Success',
  LOAD_HALLMARKING_EXCLUDE_KARAT_TYPE_FAILURE = '[CFA Products]Load Hallmarking Exclude Karat Type Failure',

  LOAD_PRICING_TYPE = '[CFA Products]Load Pricing Type',
  LOAD_PRICING_TYPE_SUCCESS = '[CFA Products]Load Pricing Type Success',
  LOAD_PRICING_TYPE_FAILURE = '[CFA Products]Load Pricing Type Failure'
}
export class LoadCFAProducts implements Action {
  readonly type = CFAProductCodeActionTypes.LOAD_CFA_PRODUCTS;
  constructor(public payload: LoadCFAProductCodeListingPayload) {}
}
export class LoadCFAProductsSuccess implements Action {
  readonly type = CFAProductCodeActionTypes.LOAD_CFA_PRODUCTS_SUCCESS;
  constructor(public payload: LoadCFAProductCodeListingSuccessPayload) {}
}
export class LoadCFAProductsFailure implements Action {
  readonly type = CFAProductCodeActionTypes.LOAD_CFA_PRODUCTS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadCFAProductsBasedOnProductGroupCode implements Action {
  readonly type =
    CFAProductCodeActionTypes.LOAD_CFA_PRODUCTS_BASED_ON_PRODUCTGROUPCODE;
  constructor(public payload: string) {}
}
export class LoadCFAProductsBasedOnProductGroupCodeSuccess implements Action {
  readonly type =
    CFAProductCodeActionTypes.LOAD_CFA_PRODUCTS_BASED_ON_PRODUCTGROUPCODE_SUCCESS;
  constructor(public payload: ProductGroupDetails) {}
}
export class LoadCFAProductsBasedOnProductGroupCodeFailure implements Action {
  readonly type =
    CFAProductCodeActionTypes.LOAD_CFA_PRODUCTS_BASED_ON_PRODUCTGROUPCODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SearchCFAproduct implements Action {
  readonly type = CFAProductCodeActionTypes.SEARCH_CFA_PRODUCT;
  constructor(public payload: string) {}
}
export class SearchCFAProductSuccess implements Action {
  readonly type = CFAProductCodeActionTypes.SEARCH_CFA_PRODUCT_SUCCESS;
  constructor(public payload: CFAProductsResponse[]) {}
}
export class SearchCFAProductFailure implements Action {
  readonly type = CFAProductCodeActionTypes.SEARCH_CFA_PRODUCT_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SaveCFAProducts implements Action {
  readonly type = CFAProductCodeActionTypes.SAVE_CFA_PRODUCTS;
  constructor(public payload: CFAProducts) {}
}
export class SaveCFAProductsSuccess implements Action {
  readonly type = CFAProductCodeActionTypes.SAVE_CFA_PRODUCTS_SUCCESS;
}
export class SaveCFAProductsFailure implements Action {
  readonly type = CFAProductCodeActionTypes.SAVE_CFA_PRODUCTS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class ResetCFAProducts implements Action {
  readonly type = CFAProductCodeActionTypes.RESET_CFA_PRODUCTS;
}
export class UpdateCFAProducts implements Action {
  readonly type = CFAProductCodeActionTypes.UPDATE_CFA_PRODUCTS;
  constructor(public payload: UpdateCFAProductsPayload) {}
}
export class UpdateCFAProductsSuccess implements Action {
  readonly type = CFAProductCodeActionTypes.UPDATE_CFA_PRODUCTS_SUCCESS;
  constructor(public payload: CFAProducts) {}
}
export class UpdateCFAProductsFailure implements Action {
  readonly type = CFAProductCodeActionTypes.UPDATE_CFA_PRODUCTS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadProductTypes implements Action {
  readonly type = CFAProductCodeActionTypes.LOAD_PRODUCT_TYPES;
}
export class LoadProductTypesSuccess implements Action {
  readonly type = CFAProductCodeActionTypes.LOAD_PRODUCT_TYPES_SUCCESS;
  constructor(public payload: ProductType[]) {}
}
export class LoadProductTypesFailure implements Action {
  readonly type = CFAProductCodeActionTypes.LOAD_PRODUCT_TYPES_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadItemTypes implements Action {
  readonly type = CFAProductCodeActionTypes.LOAD_ITEM_TYPES;
}
export class LoadItemTypesSuccess implements Action {
  readonly type = CFAProductCodeActionTypes.LOAD_ITEM_TYPES_SUCCESS;
  constructor(public payload: ItemTypesResponse[]) {}
}
export class LoadItemTypesFailure implements Action {
  readonly type = CFAProductCodeActionTypes.LOAD_ITEM_TYPES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadPlainStuddedType implements Action {
  readonly type = CFAProductCodeActionTypes.LOAD_PLAIN_STUDDED_TYPE;
  constructor(public payload: string) {}
}
export class LoadPlainStuddedTypeSuccess implements Action {
  readonly type = CFAProductCodeActionTypes.LOAD_PLAIN_STUDDED_TYPE_SUCCESS;
  constructor(public payload: { id: string; name: string }[]) {}
}
export class LoadPlainStuddedTypeFailure implements Action {
  readonly type = CFAProductCodeActionTypes.LOAD_PLAIN_STUDDED_TYPE_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadhallmarkingExcludeKaratType implements Action {
  readonly type = CFAProductCodeActionTypes.LOAD_HALLMARKING_EXCLUDE_KARAT_TYPE;
  constructor(public payload: string) {}
}
export class LoadhallmarkingExcludeKaratTypeSuccess implements Action {
  readonly type = CFAProductCodeActionTypes.LOAD_HALLMARKING_EXCLUDE_KARAT_TYPE_SUCCESS;
  constructor(public payload: { id: string; name: string }[]) {}
}
export class LoadhallmarkingExcludeKaratTypeFailure implements Action {
  readonly type = CFAProductCodeActionTypes.LOAD_HALLMARKING_EXCLUDE_KARAT_TYPE_FAILURE;
  constructor(public payload: CustomErrors) {}
}


export class LoadPricingType implements Action {
  readonly type = CFAProductCodeActionTypes.LOAD_PRICING_TYPE;
  constructor(public payload: string) {}
}
export class LoadPricingTypeSuccess implements Action {
  readonly type = CFAProductCodeActionTypes.LOAD_PRICING_TYPE_SUCCESS;
  constructor(public payload: { id: string; name: string }[]) {}
}
export class LoadPricingTypeFailure implements Action {
  readonly type = CFAProductCodeActionTypes.LOAD_PRICING_TYPE_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export type CFAProductCodeActions =
  | LoadCFAProducts
  | LoadCFAProductsSuccess
  | LoadCFAProductsFailure
  | LoadCFAProductsBasedOnProductGroupCode
  | LoadCFAProductsBasedOnProductGroupCodeSuccess
  | LoadCFAProductsBasedOnProductGroupCodeFailure
  | SearchCFAproduct
  | SearchCFAProductSuccess
  | SearchCFAProductFailure
  | SaveCFAProducts
  | SaveCFAProductsSuccess
  | SaveCFAProductsFailure
  | ResetCFAProducts
  | UpdateCFAProducts
  | UpdateCFAProductsSuccess
  | UpdateCFAProductsFailure
  | LoadProductTypes
  | LoadProductTypesSuccess
  | LoadProductTypesFailure
  | LoadItemTypes
  | LoadItemTypesSuccess
  | LoadItemTypesFailure
  | LoadPlainStuddedType
  | LoadPlainStuddedTypeSuccess
  | LoadPlainStuddedTypeFailure
  | LoadhallmarkingExcludeKaratType
  | LoadhallmarkingExcludeKaratTypeSuccess
  | LoadhallmarkingExcludeKaratTypeFailure
  | LoadPricingType
  | LoadPricingTypeSuccess
  | LoadPricingTypeFailure;
