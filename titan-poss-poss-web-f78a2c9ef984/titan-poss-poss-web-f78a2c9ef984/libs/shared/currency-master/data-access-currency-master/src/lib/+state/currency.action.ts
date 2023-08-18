import { Action } from '@ngrx/store';
import {
  CustomErrors,
  CurrencyDetails,
  LoadCurrencyListingPayload,
  LoadCurrencyListingSuccessPayload,
  SaveCurrencyDetailFormPayload
} from '@poss-web/shared/models';

export enum CurrencyActionTypes {
  LOAD_CURRENCY_LISTING = '[Load-Currency-Listing] Load Currency Details',
  LOAD_CURRENCY_LISTING_SUCCESS = '[Load-Currency-Listing] Load Currency Details Success',
  LOAD_CURRENCY_LISTING_FAILURE = '[Load-Currency-Listing] Load Currency Details Failure',

  LOAD_CURRENCY_DETAILS_BY_CURRENCYCODE = '[Load-Currency-Details] Load Currency Details By Currency Code',
  LOAD_CURRENCY_DETAILS_BY_CURRENCYCODE_SUCCESS = '[Load-Currency-Details] Load Currency Details By Currency Code Success',
  LOAD_CURRENCY_DETAILS_BY_CURRENCYCODE_FAILURE = '[Load-Currency-Details] Load Currency Details By Currency Code Failure',

  RESET_CURRENCY_DIALOG_DATA = '[Load-Currency-Mapping] Reset Currency Dialog Data',

  SAVE_CURRENCY_FORM_DETAILS = '[ Save-Currency-Details ] SaveForm Details',
  SAVE_CURRENCY_FORM_DETAILS_SUCCESS = '[ Save-Currency-Details ] SaveForm Details Success',
  SAVE_CURRENCY_FORM_DETAILS_FAILURE = '[ Save-Currency-Details ] SaveForm Details Failure',

  EDIT_CURRENCY_FORM_DETAILS = '[ Edit-Currency-Details ] EditForm Details',
  EDIT_CURRENCY_FORM_DETAILS_SUCCESS = '[ Edit-Currency-Details ] EditForm Details Success',
  EDIT_CURRENCY_FORM_DETAILS_FAILURE = '[ Edit-Currency-Details ] EditForm Details Failure',

  SEARCH_CURRENCY_DETAILS = '[Load-Currency-Details] Search Currency-Details',
  SEARCH_CURRENCY_DETAILS_SUCCESS = '[Load-Currency-Details] Search Currency-Details Success',
  SEARCH_CURRENCY_DETAILS_FAILURE = '[Load-Currency-Details] Search Currency-Details Failure'

  // LOAD_CURRENCY_SYMBOL = '[Load-Currency-Symbol] Load Currency Symbol ',
  // LOAD_CURRENCY_SYMBOL_SUCCESS = '[Load-Currency-Symbol] Load Currency Symbol Success',
  // LOAD_CURRENCY_SYMBOL_FAILURE = '[Load-Currency-Symbol] Load Currency Symbol Failure',

  // LOAD_COUNTRY = '[Load-Country] Load Country',
  // LOAD_COUNTRY_SUCCESS = '[Load-Country] Load Country Success',
  // LOAD_COUNTRY_FAILURE = '[Load-Country] Load Country Failure',

  // LOAD_UNICODE = '[Load-Unicode] Load Unicode',
  // LOAD_UNICODE_SUCCESS = '[Load-Unicode] Load Unicode Success',
  // LOAD_UNICODE_FAILURE = '[Load-Unicode] Load Unicode Failure'
}

export class LoadCurrencyDetails implements Action {
  readonly type = CurrencyActionTypes.LOAD_CURRENCY_LISTING;
  constructor(public payload: LoadCurrencyListingPayload) {}
}

export class LoadCurrencyDetailsSuccess implements Action {
  readonly type = CurrencyActionTypes.LOAD_CURRENCY_LISTING_SUCCESS;
  constructor(public payload: LoadCurrencyListingSuccessPayload) {}
}

export class LoadCurrencyDetailsFailure implements Action {
  readonly type = CurrencyActionTypes.LOAD_CURRENCY_LISTING_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadCurrencyDetailsByCurrencyCode implements Action {
  readonly type = CurrencyActionTypes.LOAD_CURRENCY_DETAILS_BY_CURRENCYCODE;
  constructor(public payload: string) {}
}

export class LoadCurrencyDetailsByCurrencyCodeSuccess implements Action {
  readonly type =
    CurrencyActionTypes.LOAD_CURRENCY_DETAILS_BY_CURRENCYCODE_SUCCESS;
  constructor(public payload: CurrencyDetails) {}
}

export class LoadCurrencyDetailsByCurrencyCodeFailure implements Action {
  readonly type =
    CurrencyActionTypes.LOAD_CURRENCY_DETAILS_BY_CURRENCYCODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetCurrencyDialog implements Action {
  readonly type = CurrencyActionTypes.RESET_CURRENCY_DIALOG_DATA;
}

export class SaveCurrencyFormDetails implements Action {
  readonly type = CurrencyActionTypes.SAVE_CURRENCY_FORM_DETAILS;
  constructor(public payload: SaveCurrencyDetailFormPayload) {}
}

export class SaveCurrencyFormDetailsSuccess implements Action {
  readonly type = CurrencyActionTypes.SAVE_CURRENCY_FORM_DETAILS_SUCCESS;
  constructor(public payload: CurrencyDetails) {}
}

export class SaveCurrencyFormDetailsFailure implements Action {
  readonly type = CurrencyActionTypes.SAVE_CURRENCY_FORM_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class EditCurrencyFormDetails implements Action {
  readonly type = CurrencyActionTypes.EDIT_CURRENCY_FORM_DETAILS;
  constructor(public payload: SaveCurrencyDetailFormPayload) {}
}

export class EditCurrencyFormDetailsSuccess implements Action {
  readonly type = CurrencyActionTypes.EDIT_CURRENCY_FORM_DETAILS_SUCCESS;
  constructor(public payload: CurrencyDetails) {}
}

export class EditCurrencyFormDetailsFailure implements Action {
  readonly type = CurrencyActionTypes.EDIT_CURRENCY_FORM_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SearchCurrency implements Action {
  readonly type = CurrencyActionTypes.SEARCH_CURRENCY_DETAILS;
  constructor(public payload: string) {}
}
export class SearchCurrencySuccess implements Action {
  readonly type = CurrencyActionTypes.SEARCH_CURRENCY_DETAILS_SUCCESS;
  // action: CurrencyDetails;
  constructor(public payload: CurrencyDetails[]) {}
}
export class SearchCurrencyFailure implements Action {
  readonly type = CurrencyActionTypes.SEARCH_CURRENCY_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

// export class LoadCurrencySymbol implements Action {
//   readonly type = CurrencyActionTypes.LOAD_CURRENCY_SYMBOL;
// }

// export class LoadCurrencySymbolSuccess implements Action {
//   readonly type = CurrencyActionTypes.LOAD_CURRENCY_SYMBOL_SUCCESS;
//   constructor(public payload:CurrencySymbolData[]){}
// }

// export class LoadCurrencySymbolFailure implements Action {
//   readonly type = CurrencyActionTypes.LOAD_CURRENCY_SYMBOL_FAILURE
//   constructor(public payload:CustomErrors){}
// }

// export class LoadCountry implements Action {
//   readonly type = CurrencyActionTypes.LOAD_COUNTRY;
// }

// export class LoadCountrySuccess implements Action {
//   readonly type = CurrencyActionTypes.LOAD_COUNTRY_SUCCESS;
//   constructor(public payload:CountryDropDownData[]){}
// }

// export class LoadCountryFailure implements Action {
//   readonly type = CurrencyActionTypes.LOAD_COUNTRY_FAILURE;
//   constructor(public payload:CustomErrors){}
// }
// export class LoadUnicode implements Action {
//   readonly type = CurrencyActionTypes.LOAD_UNICODE;
// }

// export class LoadUnicodeSuccess implements Action {
//   readonly type = CurrencyActionTypes.LOAD_UNICODE_SUCCESS;
//   constructor(public payload:UnicodeData[]){}
// }

// export class LoadUnicodeFailure implements Action {
//   readonly type = CurrencyActionTypes.LOAD_UNICODE_FAILURE;
//   constructor(public payload:CustomErrors){}
// }

export type CurrencyActions =
  | LoadCurrencyDetails
  | LoadCurrencyDetailsSuccess
  | LoadCurrencyDetailsFailure
  | LoadCurrencyDetailsByCurrencyCode
  | LoadCurrencyDetailsByCurrencyCodeSuccess
  | LoadCurrencyDetailsByCurrencyCodeFailure
  | ResetCurrencyDialog
  | SaveCurrencyFormDetails
  | SaveCurrencyFormDetailsSuccess
  | SaveCurrencyFormDetailsFailure
  | EditCurrencyFormDetails
  | EditCurrencyFormDetailsSuccess
  | EditCurrencyFormDetailsFailure
  | SearchCurrency
  | SearchCurrencySuccess
  | SearchCurrencyFailure;
// |LoadCurrencySymbol
// |LoadCurrencySymbolSuccess
// |LoadCurrencySymbolFailure
// |LoadCountry
// |LoadCountrySuccess
// |LoadCountryFailure
// |LoadUnicode
// |LoadUnicodeSuccess
// |LoadUnicodeFailure
