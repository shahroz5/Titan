import { Action } from '@ngrx/store';
import {
  CustomErrors,
  LoadWeightValueConfigListingPayload,
  WeightValueConfigListingResult,
  WeightValueConfigDetails
} from '@poss-web/shared/models';

export enum WeightValueConfigActionTypes {
  LOAD_WEIGHT_VALUE_CONIG_LISTING = '[Load-Weight-Value-Config-Listing] Load WeightValueConfig Listing',
  LOAD_WEIGHT_VALUE_CONIG_LISTING_SUCCESS = '[Load-Weight-Value-Config-Listing] Load WeightValueConfig Listing Success',
  LOAD_WEIGHT_VALUE_CONIG_LISTING_FAILURE = '[Load-Weight-Value-Config-Listing] Load WeightValueConfig Listing Failure',

  SEARCH_WEIGHT_VALUE_CONIG_LISTING = '[Search-Weight-Value-Config-Listing] Search WeightValueConfig Listing',
  SEARCH_WEIGHT_VALUE_CONIG_LISTING_SUCCESS = '[Search-Weight-Value-Config-Listing] Search WeightValueConfig Listing Success',
  SEARCH_WEIGHT_VALUE_CONIG_LISTING_FAILURE = '[Search-Weight-Value-Config-Listing] Search WeightValueConfig Listing Failure',

  LOAD_WEIGHT_VALUE_CONIG_DETAILS = '[Load-Weight-Value-Config-Details] Load WeightValueConfig Details',
  LOAD_WEIGHT_VALUE_CONIG_DETAILS_SUCCESS = '[Load-Weight-Value-Config-Details] Load WeightValueConfig Details Success',
  LOAD_WEIGHT_VALUE_CONIG_DETAILS_FAILURE = '[Load-Weight-Value-Config-Details] Load WeightValueConfig Details Failure',

  SAVE_WEIGHT_VALUE_CONIG_DETAILS = '[Save-Weight-Value-Config-Details] Save WeightValueConfig Details',
  SAVE_WEIGHT_VALUE_CONIG_DETAILS_SUCCESS = '[Save-Weight-Value-Config-Details] Save WeightValueConfig Details Success',
  SAVE_WEIGHT_VALUE_CONIG_DETAILS_FAILURE = '[Save-Weight-Value-Config-Details] Save WeightValueConfig Details Failure',

  EDIT_WEIGHT_VALUE_CONIG_DETAILS = '[Edit-Weight-Value-Config-Details] Edit WeightValueConfig Details',
  EDIT_WEIGHT_VALUE_CONIG_DETAILS_SUCCESS = '[Edit-Weight-Value-Config-Details] Edit WeightValueConfig Details Success',
  EDIT_WEIGHT_VALUE_CONIG_DETAILS_FAILURE = '[Edit-Weight-Value-Config-Details] Edit WeightValueConfig Details Failure',

  LOAD_RESET = '[Edit-Weight-Value-Config-Details] Load Reset'
}

export class LoadReset implements Action {
  readonly type = WeightValueConfigActionTypes.LOAD_RESET;
}
export class LoadWeightValueConfigListing implements Action {
  readonly type = WeightValueConfigActionTypes.LOAD_WEIGHT_VALUE_CONIG_LISTING;
  constructor(public payload: LoadWeightValueConfigListingPayload) {}
}
export class LoadWeightValueConfigListingSuccess implements Action {
  readonly type =
    WeightValueConfigActionTypes.LOAD_WEIGHT_VALUE_CONIG_LISTING_SUCCESS;
  constructor(public payload: WeightValueConfigListingResult) {}
}
export class LoadWeightValueConfigListingFailure implements Action {
  readonly type =
    WeightValueConfigActionTypes.LOAD_WEIGHT_VALUE_CONIG_LISTING_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchWeightValueConfigListing implements Action {
  readonly type =
    WeightValueConfigActionTypes.SEARCH_WEIGHT_VALUE_CONIG_LISTING;
  constructor(public payload: string) {}
}
export class SearchWeightValueConfigListingSuccess implements Action {
  readonly type =
    WeightValueConfigActionTypes.SEARCH_WEIGHT_VALUE_CONIG_LISTING_SUCCESS;
  constructor(public payload: WeightValueConfigListingResult) {}
}
export class SearchWeightValueConfigListingFailure implements Action {
  readonly type =
    WeightValueConfigActionTypes.SEARCH_WEIGHT_VALUE_CONIG_LISTING_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadWeightValueConfigDetails implements Action {
  readonly type = WeightValueConfigActionTypes.LOAD_WEIGHT_VALUE_CONIG_DETAILS;
  constructor(public payload: string) {}
}
export class LoadWeightValueConfigDetailsSuccess implements Action {
  readonly type =
    WeightValueConfigActionTypes.LOAD_WEIGHT_VALUE_CONIG_DETAILS_SUCCESS;
  constructor(public payload: WeightValueConfigDetails) {}
}
export class LoadWeightValueConfigDetailsFailure implements Action {
  readonly type =
    WeightValueConfigActionTypes.LOAD_WEIGHT_VALUE_CONIG_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveWeightValueConfigDetails implements Action {
  readonly type = WeightValueConfigActionTypes.SAVE_WEIGHT_VALUE_CONIG_DETAILS;
  constructor(public payload: WeightValueConfigDetails) {}
}
export class SaveWeightValueConfigDetailsSuccess implements Action {
  readonly type =
    WeightValueConfigActionTypes.SAVE_WEIGHT_VALUE_CONIG_DETAILS_SUCCESS;
  constructor(public payload: WeightValueConfigDetails) {}
}
export class SaveWeightValueConfigDetailsFailure implements Action {
  readonly type =
    WeightValueConfigActionTypes.SAVE_WEIGHT_VALUE_CONIG_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class EditWeightValueConfigDetails implements Action {
  readonly type = WeightValueConfigActionTypes.EDIT_WEIGHT_VALUE_CONIG_DETAILS;
  constructor(public payload: WeightValueConfigDetails) {}
}
export class EditWeightValueConfigDetailsSuccess implements Action {
  readonly type =
    WeightValueConfigActionTypes.EDIT_WEIGHT_VALUE_CONIG_DETAILS_SUCCESS;
  constructor(public payload: WeightValueConfigDetails) {}
}
export class EditWeightValueConfigDetailsFailure implements Action {
  readonly type =
    WeightValueConfigActionTypes.EDIT_WEIGHT_VALUE_CONIG_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type WeightValueConfigActions =
  | LoadWeightValueConfigListing
  | LoadWeightValueConfigListingSuccess
  | LoadWeightValueConfigListingFailure
  | SearchWeightValueConfigListing
  | SearchWeightValueConfigListingSuccess
  | SearchWeightValueConfigListingFailure
  | LoadWeightValueConfigDetails
  | LoadWeightValueConfigDetailsSuccess
  | LoadWeightValueConfigDetailsFailure
  | SaveWeightValueConfigDetails
  | SaveWeightValueConfigDetailsSuccess
  | SaveWeightValueConfigDetailsFailure
  | EditWeightValueConfigDetails
  | EditWeightValueConfigDetailsSuccess
  | EditWeightValueConfigDetailsFailure
  | LoadReset;
