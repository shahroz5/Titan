import { Action } from '@ngrx/store';
import { 
  CashMemoTaxDetails,
  CustomErrors, 
  FindPriceResponse, 
  TaxPayload, 
  FindPricePayload 
} from '@poss-web/shared/models';

export enum FindPriceActionTypes {
  LOAD_STANDARD_METAL_PRICE_DETAILS = '[Find Price] Load Standard Metal Price Details',
  LOAD_STANDARD_METAL_PRICE_DETAILS_SUCCESS = '[Find Price] Load Standard Metal Price Details Success',
  LOAD_STANDARD_METAL_PRICE_DETAILS_FAILURE = '[Find Price] Load Standard Metal Price Details Failure',

  FIND_PRICE = '[Find Price] Load Price Details',
  FIND_PRICE_SUCCESS = '[Find Price] Load Price Details Success',
  FIND_PRICE_FAILURE = '[Find Price] Load Price Details Failure',

  LOAD_TAX_DETAILS = '[Find Price] Load Tax Details',
  LOAD_TAX_DETAILS_SUCCESS = '[Find Price] Load Tax Details Success',
  LOAD_TAX_DETAILS_FAILURE = '[Find Price] Load Tax Details Failure',
  
  SET_ITEM_CODE = '[Find Price] Set Item Code',
  RESET_ITEM_CODE = '[Find Price] Reset Item Code',

  RESET_VALUES = '[Find Price] Reset Values',
}

export class LoadStandardMetalPriceDetails implements Action {
  readonly type = FindPriceActionTypes.LOAD_STANDARD_METAL_PRICE_DETAILS;
}
export class LoadStandardMetalPriceDetailsSuccess implements Action {
  readonly type = FindPriceActionTypes.LOAD_STANDARD_METAL_PRICE_DETAILS_SUCCESS;
  constructor(public payload: any) {}
}
export class LoadStandardMetalPriceDetailsFailure implements Action {
  readonly type = FindPriceActionTypes.LOAD_STANDARD_METAL_PRICE_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class FindPrice implements Action {
  readonly type = FindPriceActionTypes.FIND_PRICE;
  constructor(public payload: FindPricePayload) {}
}
export class FindPriceSuccess implements Action {
  readonly type = FindPriceActionTypes.FIND_PRICE_SUCCESS;
  constructor(public payload: FindPriceResponse) {}
}
export class FindPriceFailure implements Action {
  readonly type = FindPriceActionTypes.FIND_PRICE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadTaxDetails implements Action {
  readonly type = FindPriceActionTypes.LOAD_TAX_DETAILS;
  constructor(public payload: TaxPayload) {}
}
export class LoadTaxDetailsSuccess implements Action {
  readonly type = FindPriceActionTypes.LOAD_TAX_DETAILS_SUCCESS;
  constructor(public payload: CashMemoTaxDetails) {}
}
export class LoadTaxDetailsFailure implements Action {
  readonly type = FindPriceActionTypes.LOAD_TAX_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SetItemCode implements Action {
  readonly type = FindPriceActionTypes.SET_ITEM_CODE;
  constructor(public payload: string) {}
}

export class ResetItemCode implements Action {
  readonly type = FindPriceActionTypes.RESET_ITEM_CODE;
}

export class ResetValues implements Action {
  readonly type = FindPriceActionTypes.RESET_VALUES;
}

export type FindPriceActions =
  | LoadStandardMetalPriceDetails
  | LoadStandardMetalPriceDetailsSuccess
  | LoadStandardMetalPriceDetailsFailure
  | FindPrice
  | FindPriceSuccess
  | FindPriceFailure
  | LoadTaxDetails
  | LoadTaxDetailsSuccess
  | LoadTaxDetailsFailure
  | SetItemCode
  | ResetItemCode
  | ResetValues