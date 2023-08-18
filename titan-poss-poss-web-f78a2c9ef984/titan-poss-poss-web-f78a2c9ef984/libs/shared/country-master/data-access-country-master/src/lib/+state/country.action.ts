import { Action } from '@ngrx/store';
import {
  LoadCountryListingPayload,
  CustomErrors,
  LoadCountryListingSuccessPayload,
  CountryDetails,
  SaveCountryFormDetailsPayload,
  CountryMaster,
  Lov,
  CurrencyList
} from '@poss-web/shared/models';

export enum CountryActionTypes {
  LOAD_COUNTRY_LISTING = '[Load-Country-Details] Load Country Listing',
  LOAD_COUNTRY_LISTING_SUCCESS = '[Load-Country-Details] Load Country Listing Success',
  LOAD_COUNTRY_LISTING_FAILURE = '[Load-Country-Details] Load Country Listing Failure',

  LOAD_COUNTRY_DETAILS_BY_COUNTRYCODE = '[Load-Country-Details] Load Country Details By Country Code',
  LOAD_COUNTRY_DETAILS_BY_COUNTRYCODE_SUCCESS = '[Load-Country-Details] Load Country Details By Country Code Success',
  LOAD_COUNTRY_DETAILS_BY_COUNTRYCODE_FAILURE = '[Load-Country-Details] Load Country Details By Country Code Failure',

  RESET_COUNTRY_DIALOG_DATA = '[Load-Country-Details] Reset Country Dialog Data',

  SAVE_COUNTRY_FORM_DETAILS = '[ Save-Country-Details ] SaveForm Details',
  SAVE_COUNTRY_FORM_DETAILS_SUCCESS = '[ Save-Country-Details ] SaveForm Details Success',
  SAVE_COUNTRY_FORM_DETAILS_FAILURE = '[ Save-Country-Details ] SaveForm Details Failure',

  EDIT_COUNTRY_FORM_DETAILS = '[ Edit-Country-Details ] EditForm Details',
  EDIT_COUNTRY_FORM_DETAILS_SUCCESS = '[ Edit-Country-Details ] EditForm Details Success',
  EDIT_COUNTRY_FORM_DETAILS_FAILURE = '[ Edit-Country-Details ] EditForm Details Failure',

  SEARCH_COUNTRY_DETAILS = '[Load-Country-Details] Search Country-Details',
  SEARCH_COUNTRY_DETAILS_SUCCESS = '[Load-Country-Details] Search Country-Details Success',
  SEARCH_COUNTRY_DETAILS_FAILURE = '[Load-Country-Details] Search Country-Details Failure',

  // LOAD_COUNTRY_NAME = '[Load-Country-Details] Load Country name',
  // LOAD_COUNTRY_NAME_SUCCESS = '[Load-Country-Details] Load Country name Success',
  // LOAD_COUNTRY_NAME_FAILURE = '[Load-Country-Details] Load Country name Failure',

  LOAD_CURRENCY_CODE = '[Load-Country-Details] Load Currency Code',
  LOAD_CURRENCY_CODE_SUCCESS = '[Load-Country-Details] Load Currency Code Success',
  LOAD_CURRENCY_CODE_FAILURE = '[Load-Country-Details] Load Currency Code Failure',

  LOAD_TIME_FORMATS = '[Load-Country-Details] Load Time Formats',
  LOAD_TIME_FORMATS_SUCCESS = '[Load-Country-Details] Load Time Formats Success',
  LOAD_TIME_FORMATS_FAILURE = '[Load-Country-Details] Load Time Formats Failure',

  LOAD_DATE_FORMATS = '[Load-Country-Details] Load Date Formats',
  LOAD_DATE_FORMATS_SUCCESS = '[Load-Country-Details] Load Date Formats Success',
  LOAD_DATE_FORMATS_FAILURE = '[Load-Country-Details] Load Date Formats Failure'
}

export class LoadCountryDetails implements Action {
  readonly type = CountryActionTypes.LOAD_COUNTRY_LISTING;
  constructor(public payload: LoadCountryListingPayload) {}
}
export class LoadCountryDetailsSuccess implements Action {
  readonly type = CountryActionTypes.LOAD_COUNTRY_LISTING_SUCCESS;
  constructor(public payload: LoadCountryListingSuccessPayload) {}
}
export class LoadCountryDetailsFailure implements Action {
  readonly type = CountryActionTypes.LOAD_COUNTRY_LISTING_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadCountryByCountryCode implements Action {
  readonly type = CountryActionTypes.LOAD_COUNTRY_DETAILS_BY_COUNTRYCODE;
  constructor(public payload: string) {}
}
export class LoadCountryByCountryCodeSuccess implements Action {
  readonly type =
    CountryActionTypes.LOAD_COUNTRY_DETAILS_BY_COUNTRYCODE_SUCCESS;
  constructor(public payload: CountryMaster) {}
}
export class LoadCountryByCountryCodeFailure implements Action {
  readonly type =
    CountryActionTypes.LOAD_COUNTRY_DETAILS_BY_COUNTRYCODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetCountryDialog implements Action {
  readonly type = CountryActionTypes.RESET_COUNTRY_DIALOG_DATA;
}

export class SaveCountryFormDetails implements Action {
  readonly type = CountryActionTypes.SAVE_COUNTRY_FORM_DETAILS;
  constructor(public payload: SaveCountryFormDetailsPayload) {}
}

export class SaveCountryFormDetailsSuccess implements Action {
  readonly type = CountryActionTypes.SAVE_COUNTRY_FORM_DETAILS_SUCCESS;
  constructor(public payload: CountryMaster) {}
}

export class SaveCountryFormDetailsFailure implements Action {
  readonly type = CountryActionTypes.SAVE_COUNTRY_FORM_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class EditCountryFormDetails implements Action {
  readonly type = CountryActionTypes.EDIT_COUNTRY_FORM_DETAILS;
  constructor(public payload: SaveCountryFormDetailsPayload) {}
}

export class EditCountryFormDetailsSuccess implements Action {
  readonly type = CountryActionTypes.EDIT_COUNTRY_FORM_DETAILS_SUCCESS;
  constructor(public payload: CountryDetails) {}
}
export class EditCountryFormDetailsFailure implements Action {
  readonly type = CountryActionTypes.EDIT_COUNTRY_FORM_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchCountryCode implements Action {
  readonly type = CountryActionTypes.SEARCH_COUNTRY_DETAILS;
  constructor(public payload: string) {}
}
export class SearchCountryCodeSuccess implements Action {
  readonly type = CountryActionTypes.SEARCH_COUNTRY_DETAILS_SUCCESS;
  constructor(public payload: CountryDetails[]) {}
}
export class SearchCountryCodeFailure implements Action {
  readonly type = CountryActionTypes.SEARCH_COUNTRY_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadCurrencyCode implements Action {
  readonly type = CountryActionTypes.LOAD_CURRENCY_CODE;
}

export class LoadCurrencyCodeSuccess implements Action {
  readonly type = CountryActionTypes.LOAD_CURRENCY_CODE_SUCCESS;
  constructor(public payload: CurrencyList[]) {}
}

export class LoadCurrencyCodeFailure implements Action {
  readonly type = CountryActionTypes.LOAD_CURRENCY_CODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadTimeFormats implements Action {
  readonly type = CountryActionTypes.LOAD_TIME_FORMATS;
}

export class LoadTimeFormatsSuccess implements Action {
  readonly type = CountryActionTypes.LOAD_TIME_FORMATS_SUCCESS;
  constructor(public payload: Lov[]) {}
}

export class LoadTimeFormatsFailure implements Action {
  readonly type = CountryActionTypes.LOAD_TIME_FORMATS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadDateFormats implements Action {
  readonly type = CountryActionTypes.LOAD_DATE_FORMATS;
}

export class LoadDateFormatsSuccess implements Action {
  readonly type = CountryActionTypes.LOAD_DATE_FORMATS_SUCCESS;
  constructor(public payload: Lov[]) {}
}

export class LoadDateFormatsFailure implements Action {
  readonly type = CountryActionTypes.LOAD_DATE_FORMATS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type CountryActions =
  | LoadCountryDetails
  | LoadCountryDetailsSuccess
  | LoadCountryDetailsFailure
  | LoadCountryByCountryCode
  | LoadCountryByCountryCodeSuccess
  | LoadCountryByCountryCodeFailure
  | ResetCountryDialog
  | SaveCountryFormDetails
  | SaveCountryFormDetailsFailure
  | EditCountryFormDetails
  | EditCountryFormDetailsSuccess
  | EditCountryFormDetailsFailure
  | SaveCountryFormDetailsSuccess
  | SearchCountryCode
  | SearchCountryCodeSuccess
  | SearchCountryCodeFailure
  | LoadCurrencyCode
  | LoadCurrencyCodeSuccess
  | LoadCurrencyCodeFailure
  | LoadTimeFormats
  | LoadTimeFormatsSuccess
  | LoadTimeFormatsFailure
  | LoadDateFormats
  | LoadDateFormatsSuccess
  | LoadDateFormatsFailure;
