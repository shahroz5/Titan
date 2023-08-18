import { Action } from '@ngrx/store';
import {
  CustomErrors,
  TEPExceptiononfigListing,
  TEPExceptionConfig,
  TEPExceptionConfigListingPayload,
  TEPExceptionConfigFilter
} from '@poss-web/shared/models';

export enum TepExceptionConfigActionTypes {
  LOAD_TEP_EXCEPTION_CONFIG_LISTING = '[TEP-exception-config-listing] Load TEP exception config Listing',
  LOAD_TEP_EXCEPTION_CONFIG_LISTING_SUCCESS = '[TEP-exception-config-listing] Load TEP exception config Listing Success',
  LOAD_TEP_EXCEPTION_CONFIG_LISTING_FAILURE = '[TEP-exception-config-listing] Load TEP exception config Listing Failure',

  SEARCH_TEP_EXCEPTION_CONFIG_DETAILS = '[TEP-exception-config-Details] Search TEP exception config Details',
  SEARCH_TEP_EXCEPTION_CONFIG_DETAILS_SUCCESS = '[TEP-exception-config-Details] Search TEP exception config Details Success',
  SEARCH_TEP_EXCEPTION_CONFIG_DETAILS_FAILURE = '[Brand-Details] Search TEP exception config Deatils Failure',

  LOAD_TEP_EXCEPTION_CONFIG_DETAILS = '[TEP-exception-config-Details] Load TEP exception config Details',
  LOAD_TEP_EXCEPTION_CONFIG_DETAILS_SUCCESS = '[TEP-exception-config-Details] Load TEP exception config Details Success',
  LOAD_TEP_EXCEPTION_CONFIG_DETAILS_FAILURE = '[TEP-exception-config-Details] Load TEP exception config Deatils Failure',

  SAVE_TEP_EXCEPTION_CONFIG_DETAILS = '[TEP-exception-config-Details] Save TEP exception config Details',
  SAVE_TEP_EXCEPTION_CONFIG_DETAILS_SUCCESS = '[TEP-exception-config-Details] Save TEP exception config Details Success',
  SAVE_TEP_EXCEPTION_CONFIG_DETAILS_FAILURE = '[TEP-exception-config-Details] Save TEP exception config Details Failure',

  UPDATE_TEP_EXCEPTION_CONFIG_DETAILS = '[TEP-exception-config-Details] Update TEP exception config Details',
  UPDATE_TEP_EXCEPTION_CONFIG_DETAILS_SUCCESS = '[TEP-exception-config-Details] Update TEP exception config Details Success',
  UPDATE_TEP_EXCEPTION_CONFIG_DETAILS_FAILURE = '[TEP-exception-config-Details] Update TEP exception config Details Failure',

  LOAD_TEP_GLOBAL_CONFIG_LISTING = '[TEP-global-config-listing] Load TEP global config Listing',
  LOAD_TEP_GLOBAL_CONFIG_LISTING_SUCCESS = '[TEP-global-config-listing] Load TEP global config Listing Success',
  LOAD_TEP_GLOBAL_CONFIG_LISTING_FAILURE = '[TEP-global-config-listing] Load TEP global config Listing Failure'
}

export class LoadTepExceptionConfigListing implements Action {
  readonly type =
    TepExceptionConfigActionTypes.LOAD_TEP_EXCEPTION_CONFIG_LISTING;
  constructor(public payload: TEPExceptionConfigListingPayload) {}
}
export class LoadTepExceptionConfigListingSuccess implements Action {
  readonly type =
    TepExceptionConfigActionTypes.LOAD_TEP_EXCEPTION_CONFIG_LISTING_SUCCESS;
  constructor(public payload: TEPExceptiononfigListing) {}
}

export class LoadTepExceptionConfigListingFailure implements Action {
  readonly type =
    TepExceptionConfigActionTypes.LOAD_TEP_EXCEPTION_CONFIG_LISTING_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchTepExceptionConfigDetails implements Action {
  readonly type =
    TepExceptionConfigActionTypes.SEARCH_TEP_EXCEPTION_CONFIG_DETAILS;
  constructor(public payload: TEPExceptionConfigFilter) {}
}
export class SearchTepExceptionConfigDetailsSuccess implements Action {
  readonly type =
    TepExceptionConfigActionTypes.SEARCH_TEP_EXCEPTION_CONFIG_DETAILS_SUCCESS;
  constructor(public payload: TEPExceptiononfigListing) {}
}
export class SearchTepExceptionConfigDetailsFailure implements Action {
  readonly type =
    TepExceptionConfigActionTypes.SEARCH_TEP_EXCEPTION_CONFIG_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadTepExceptionConfigDetails implements Action {
  readonly type =
    TepExceptionConfigActionTypes.LOAD_TEP_EXCEPTION_CONFIG_DETAILS;
  constructor(public payload: string) {}
}
export class LoadTepExceptionConfigDetailsSuccess implements Action {
  readonly type =
    TepExceptionConfigActionTypes.LOAD_TEP_EXCEPTION_CONFIG_DETAILS_SUCCESS;
  constructor(public payload: TEPExceptionConfig) {}
}

export class LoadTepExceptionConfigDetailsFailure implements Action {
  readonly type =
    TepExceptionConfigActionTypes.LOAD_TEP_EXCEPTION_CONFIG_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveTepExceptionConfigDetails implements Action {
  readonly type =
    TepExceptionConfigActionTypes.SAVE_TEP_EXCEPTION_CONFIG_DETAILS;
  constructor(public payload: TEPExceptionConfig) {}
}
export class SaveTepExceptionConfigDetailsSuccess implements Action {
  readonly type =
    TepExceptionConfigActionTypes.SAVE_TEP_EXCEPTION_CONFIG_DETAILS_SUCCESS;
  constructor(public payload: TEPExceptionConfig) {}
}
export class SaveTepExceptionConfigDetailsFailure implements Action {
  readonly type =
    TepExceptionConfigActionTypes.SAVE_TEP_EXCEPTION_CONFIG_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateTepExceptionConfigDetails implements Action {
  readonly type =
    TepExceptionConfigActionTypes.UPDATE_TEP_EXCEPTION_CONFIG_DETAILS;
  constructor(public payload: TEPExceptionConfig) {}
}
export class UpdateTepExceptionConfigDetailsSuccess implements Action {
  readonly type =
    TepExceptionConfigActionTypes.UPDATE_TEP_EXCEPTION_CONFIG_DETAILS_SUCCESS;
  constructor(public payload: TEPExceptionConfig) {}
}
export class UpdateTepExceptionConfigDetailsFailure implements Action {
  readonly type =
    TepExceptionConfigActionTypes.UPDATE_TEP_EXCEPTION_CONFIG_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadTepGlobalConfigListing implements Action {
  readonly type = TepExceptionConfigActionTypes.LOAD_TEP_GLOBAL_CONFIG_LISTING;
}
export class LoadTepGlobalConfigListingSuccess implements Action {
  readonly type =
    TepExceptionConfigActionTypes.LOAD_TEP_GLOBAL_CONFIG_LISTING_SUCCESS;
  constructor(public payload: number) {}
}
export class LoadTepGlobalConfigListingFailure implements Action {
  readonly type =
    TepExceptionConfigActionTypes.LOAD_TEP_GLOBAL_CONFIG_LISTING_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type TepExceptionConfigActions =
  | LoadTepExceptionConfigListing
  | LoadTepExceptionConfigListingSuccess
  | LoadTepExceptionConfigListingFailure
  | SearchTepExceptionConfigDetails
  | SearchTepExceptionConfigDetailsSuccess
  | SearchTepExceptionConfigDetailsFailure
  | LoadTepExceptionConfigDetails
  | LoadTepExceptionConfigDetailsSuccess
  | LoadTepExceptionConfigDetailsFailure
  | SaveTepExceptionConfigDetails
  | SaveTepExceptionConfigDetailsSuccess
  | SaveTepExceptionConfigDetailsFailure
  | UpdateTepExceptionConfigDetails
  | UpdateTepExceptionConfigDetailsSuccess
  | UpdateTepExceptionConfigDetailsFailure
  | LoadTepGlobalConfigListing
  | LoadTepGlobalConfigListingSuccess
  | LoadTepGlobalConfigListingFailure;
