import { Action } from '@ngrx/store';
import {
  CustomErrors,
  TEPValidationConfigListing,
  TEPValidationConfigListingPayload,
  TEPValidationConfigResult
} from '@poss-web/shared/models';

export enum TepValidationConfigActionTypes {
  LOAD_TEP_VALIDATION_CONFIG_LISTING = '[TEP-validation-config-listing] Load TEP validation config Listing',
  LOAD_TEP_VALIDATION_CONFIG_LISTING_SUCCESS = '[TEP-validation-config-listing] Load TEP validation config Listing Success',
  LOAD_TEP_VALIDATION_CONFIG_LISTING_FAILURE = '[TEP-validation-config-listing] Load TEP validation config Listing Failure',

  SEARCH_TEP_VALIDATION_CONFIG_DETAILS = '[TEP-validation-config-Details] Search TEP validation config Details',
  SEARCH_TEP_VALIDATION_CONFIG_DETAILS_SUCCESS = '[TEP-validation-config-Details] Search TEP validation config Details Success',
  SEARCH_TEP_VALIDATION_CONFIG_DETAILS_FAILURE = '[TEP-validation-config-Details] Search TEP validation config Details Failure',

  LOAD_TEP_VALIDATION_CONFIG_DETAILS = '[TEP-validation-config-details] Load TEP validation config Details',
  LOAD_TEP_VALIDATION_CONFIG_DETAILS_SUCCESS = '[TEP-validation-config-details] Load TEP validation config Details Success',
  LOAD_TEP_VALIDATION_CONFIG_DETAILS_FAILURE = '[TEP-validation-config-details] Load TEP validation config Details Failure',

  SAVE_TEP_VALIDATION_CONFIG_DETAILS = '[TEP-validation-config-details] Save TEP validation config Details',
  SAVE_TEP_VALIDATION_CONFIG_DETAILS_SUCCESS = '[TEP-validation-config-details] Save TEP validation config Details Success',
  SAVE_TEP_VALIDATION_CONFIG_DETAILS_FAILURE = '[TEP-validation-config-details] Save TEP validation config Details Failure',

  UPDATE_TEP_VALIDATION_CONFIG_DETAILS = '[TEP-validation-config-details] Update TEP validation config Details',
  UPDATE_TEP_VALIDATION_CONFIG_DETAILS_SUCCESS = '[TEP-validation-config-details] Update TEP validation config Details Success',
  UPDATE_TEP_VALIDATION_CONFIG_DETAILS_FAILURE = '[TEP-validation-config-details] Update TEP validation config Details Failure'
}

export class LoadTepValidationConfigListing implements Action {
  readonly type =
    TepValidationConfigActionTypes.LOAD_TEP_VALIDATION_CONFIG_LISTING;
  constructor(public payload: TEPValidationConfigListingPayload) {}
}
export class LoadTepValidationConfigListingSuccess implements Action {
  readonly type =
    TepValidationConfigActionTypes.LOAD_TEP_VALIDATION_CONFIG_LISTING_SUCCESS;
  constructor(public payload: TEPValidationConfigListing) {}
}
export class LoadTepValidationConfigListingFailure implements Action {
  readonly type =
    TepValidationConfigActionTypes.LOAD_TEP_VALIDATION_CONFIG_LISTING_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchTepValidationConfigDetails implements Action {
  readonly type =
    TepValidationConfigActionTypes.SEARCH_TEP_VALIDATION_CONFIG_DETAILS;
  constructor(public payload: string) {}
}
export class SearchTepValidationConfigDetailsSuccess implements Action {
  readonly type =
    TepValidationConfigActionTypes.SEARCH_TEP_VALIDATION_CONFIG_DETAILS_SUCCESS;
  constructor(public payload: TEPValidationConfigListing) {}
}
export class SearchTepValidationConfigDetailsFailure implements Action {
  readonly type =
    TepValidationConfigActionTypes.SEARCH_TEP_VALIDATION_CONFIG_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadTepValidationConfigDetails implements Action {
  readonly type =
    TepValidationConfigActionTypes.LOAD_TEP_VALIDATION_CONFIG_DETAILS;
  constructor(public payload: string) {}
}
export class LoadTepValidationConfigDetailsSuccess implements Action {
  readonly type =
    TepValidationConfigActionTypes.LOAD_TEP_VALIDATION_CONFIG_DETAILS_SUCCESS;
  constructor(public payload: TEPValidationConfigResult) {}
}
export class LoadTepValidationConfigDetailsFailure implements Action {
  readonly type =
    TepValidationConfigActionTypes.LOAD_TEP_VALIDATION_CONFIG_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveTepValidationConfigDetails implements Action {
  readonly type =
    TepValidationConfigActionTypes.SAVE_TEP_VALIDATION_CONFIG_DETAILS;
  constructor(public payload: TEPValidationConfigResult) {}
}
export class SaveTepValidationConfigDetailsSuccess implements Action {
  readonly type =
    TepValidationConfigActionTypes.SAVE_TEP_VALIDATION_CONFIG_DETAILS_SUCCESS;
  constructor(public payload: TEPValidationConfigResult) {}
}
export class SaveTepValidationConfigDetailsFailure implements Action {
  readonly type =
    TepValidationConfigActionTypes.SAVE_TEP_VALIDATION_CONFIG_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateTepValidationConfigDetails implements Action {
  readonly type =
    TepValidationConfigActionTypes.UPDATE_TEP_VALIDATION_CONFIG_DETAILS;
  constructor(public payload: Partial<TEPValidationConfigResult>) {}
}
export class UpdateTepValidationConfigDetailsSuccess implements Action {
  readonly type =
    TepValidationConfigActionTypes.UPDATE_TEP_VALIDATION_CONFIG_DETAILS_SUCCESS;
  constructor(public payload: TEPValidationConfigResult) {}
}
export class UpdateTepValidationConfigDetailsFailure implements Action {
  readonly type =
    TepValidationConfigActionTypes.UPDATE_TEP_VALIDATION_CONFIG_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type TepValidationConfigActions =
  | LoadTepValidationConfigListing
  | LoadTepValidationConfigListingSuccess
  | LoadTepValidationConfigListingFailure
  | SearchTepValidationConfigDetails
  | SearchTepValidationConfigDetailsSuccess
  | SearchTepValidationConfigDetailsFailure
  | LoadTepValidationConfigDetails
  | LoadTepValidationConfigDetailsSuccess
  | LoadTepValidationConfigDetailsFailure
  | SaveTepValidationConfigDetails
  | SaveTepValidationConfigDetailsSuccess
  | SaveTepValidationConfigDetailsFailure
  | UpdateTepValidationConfigDetails
  | UpdateTepValidationConfigDetailsSuccess
  | UpdateTepValidationConfigDetailsFailure;
