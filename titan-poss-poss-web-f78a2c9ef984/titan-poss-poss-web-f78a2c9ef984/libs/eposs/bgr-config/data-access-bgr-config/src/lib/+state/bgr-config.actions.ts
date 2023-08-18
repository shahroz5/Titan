import { Action } from '@ngrx/store';
import {
  CustomErrors,
  BgrConfigListingRequestPayload,
  BgrConfigListingResult,
  BgrConfigDetails,
  BgrConfigListingParams
} from '@poss-web/shared/models';

export enum BgrConfigActionTypes {
  LOAD_BGR_CONFIG_LISTING = '[Load-Bgr-Config-Listing] Load BgrConfig Listing',
  LOAD_BGR_CONFIG_LISTING_SUCCESS = '[Load-Bgr-Config-Listing] Load BgrConfig Listing Success',
  LOAD_BGR_CONFIG_LISTING_FAILURE = '[Load-Bgr-Config-Listing] Load BgrConfig Listing Failure',

  SEARCH_BGR_CONFIG_LISTING = '[Search-Bgr-Config-Listing] Search BgrConfig Listing',
  SEARCH_BGR_CONFIG_LISTING_SUCCESS = '[Search-Bgr-Config-Listing] Search BgrConfig Listing Success',
  SEARCH_BGR_CONFIG_LISTING_FAILURE = '[Search-Bgr-Config-Listing] Search BgrConfig Listing Failure',

  LOAD_BGR_CONFIG_DETAILS = '[Load-Bgr-Config-Details] Load BgrConfig Details',
  LOAD_BGR_CONFIG_DETAILS_SUCCESS = '[Load-Bgr-Config-Details] Load BgrConfig Details Success',
  LOAD_BGR_CONFIG_DETAILS_FAILURE = '[Load-Bgr-Config-Details] Load BgrConfig Details Failure',

  SAVE_BGR_CONFIG_DETAILS = '[Save-Bgr-Config-Details] Save BgrConfig Details',
  SAVE_BGR_CONFIG_DETAILS_SUCCESS = '[Save-Bgr-Config-Details] Save BgrConfig Details Success',
  SAVE_BGR_CONFIG_DETAILS_FAILURE = '[Save-Bgr-Config-Details] Save BgrConfig Details Failure',

  EDIT_BGR_CONFIG_DETAILS = '[Edit-Bgr-Config-Details] Edit BgrConfig Details',
  EDIT_BGR_CONFIG_DETAILS_SUCCESS = '[Edit-Bgr-Config-Details] Edit BgrConfig Details Success',
  EDIT_BGR_CONFIG_DETAILS_FAILURE = '[Edit-Bgr-Config-Details] Edit BgrConfig Details Failure',

  LOAD_BGR_CONFIG_LOCATION_MAPPING = '[Load-Bgr-Location-Mapping] Load Bgr Location Mapping',
  LOAD_BGR_CONFIG_LOCATION_MAPPING_SUCCESS = '[Load-Bgr-Location-Mapping] Load Bgr Location Mapping Success',
  LOAD_BGR_CONFIG_LOCATION_MAPPING_FAILURE = '[Load-Bgr-Location-Mapping] Load Bgr Location Mapping Failure',

  SAVE_BGR_CONFIG_LOCATION_MAPPING = '[Save-Bgr-Location-Mapping] Save Bgr Location Mapping',
  SAVE_BGR_CONFIG_LOCATION_MAPPING_SUCCESS = '[Save-Bgr-Location-Mapping] Save Bgr Location Mapping Success',
  SAVE_BGR_CONFIG_LOCATION_MAPPING_FAILURE = '[Save-Bgr-Location-Mapping] Save Bgr Location Mapping Failure'
}

export class LoadBgrConfigListing implements Action {
  readonly type = BgrConfigActionTypes.LOAD_BGR_CONFIG_LISTING;
  constructor(
    public params: BgrConfigListingParams,
    public requestPayload: BgrConfigListingRequestPayload
  ) {}
}
export class LoadBgrConfigListingSuccess implements Action {
  readonly type = BgrConfigActionTypes.LOAD_BGR_CONFIG_LISTING_SUCCESS;
  constructor(public payload: BgrConfigListingResult) {}
}
export class LoadBgrConfigListingFailure implements Action {
  readonly type = BgrConfigActionTypes.LOAD_BGR_CONFIG_LISTING_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchBgrConfigListing implements Action {
  readonly type = BgrConfigActionTypes.SEARCH_BGR_CONFIG_LISTING;
  constructor(public payload: string) {}
}
export class SearchBgrConfigListingSuccess implements Action {
  readonly type = BgrConfigActionTypes.SEARCH_BGR_CONFIG_LISTING_SUCCESS;
  constructor(public payload: BgrConfigListingResult) {}
}
export class SearchBgrConfigListingFailure implements Action {
  readonly type = BgrConfigActionTypes.SEARCH_BGR_CONFIG_LISTING_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadBgrConfigDetails implements Action {
  readonly type = BgrConfigActionTypes.LOAD_BGR_CONFIG_DETAILS;
  constructor(public payload: string) {}
}
export class LoadBgrConfigDetailsSuccess implements Action {
  readonly type = BgrConfigActionTypes.LOAD_BGR_CONFIG_DETAILS_SUCCESS;
  constructor(public payload: BgrConfigDetails) {}
}
export class LoadBgrConfigDetailsFailure implements Action {
  readonly type = BgrConfigActionTypes.LOAD_BGR_CONFIG_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveBgrConfigDetails implements Action {
  readonly type = BgrConfigActionTypes.SAVE_BGR_CONFIG_DETAILS;
  constructor(
    public payload: BgrConfigDetails,
    readonly locationMappingDetails: any
  ) {}
}
export class SaveBgrConfigDetailsSuccess implements Action {
  readonly type = BgrConfigActionTypes.SAVE_BGR_CONFIG_DETAILS_SUCCESS;
  constructor(public payload: BgrConfigDetails) {}
}
export class SaveBgrConfigDetailsFailure implements Action {
  readonly type = BgrConfigActionTypes.SAVE_BGR_CONFIG_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class EditBgrConfigDetails implements Action {
  readonly type = BgrConfigActionTypes.EDIT_BGR_CONFIG_DETAILS;
  constructor(public payload: BgrConfigDetails) {}
}
export class EditBgrConfigDetailsSuccess implements Action {
  readonly type = BgrConfigActionTypes.EDIT_BGR_CONFIG_DETAILS_SUCCESS;
  constructor(public payload: BgrConfigDetails) {}
}
export class EditBgrConfigDetailsFailure implements Action {
  readonly type = BgrConfigActionTypes.EDIT_BGR_CONFIG_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type BgrConfigActions =
  | LoadBgrConfigListing
  | LoadBgrConfigListingSuccess
  | LoadBgrConfigListingFailure
  | SearchBgrConfigListing
  | SearchBgrConfigListingSuccess
  | SearchBgrConfigListingFailure
  | LoadBgrConfigDetails
  | LoadBgrConfigDetailsSuccess
  | LoadBgrConfigDetailsFailure
  | SaveBgrConfigDetails
  | SaveBgrConfigDetailsSuccess
  | SaveBgrConfigDetailsFailure
  | EditBgrConfigDetails
  | EditBgrConfigDetailsSuccess
  | EditBgrConfigDetailsFailure;
