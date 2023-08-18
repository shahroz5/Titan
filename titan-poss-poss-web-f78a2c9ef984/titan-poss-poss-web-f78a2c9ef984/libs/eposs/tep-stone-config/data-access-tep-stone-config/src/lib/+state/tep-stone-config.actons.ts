import { Action } from '@ngrx/store';
import {
  CustomErrors,
  TEPStoneConfigListingPayload,
  TEPStoneConfigListing,
  TEPStoneConfig,
  TEPStoneConfigDetailsListing,
  TEPStoneConfigStoneType,
  TEPStoneConfigQualities,
  TEPStoneConfigRange,
  TEPStoneDetailsModify
} from '@poss-web/shared/models';

export enum TepStoneConfigActionTypes {
  LOAD_TEP_STONE_CONFIG_LISTING = '[TEP-stone-config-listing] Load TEP stone config Listing',
  LOAD_TEP_STONE_CONFIG_LISTING_SUCCESS = '[TEP-stone-config-listing] Load TEP stone config Listing Success',
  LOAD_TEP_STONE_CONFIG_LISTING_FAILURE = '[TEP-stone-config-listing] Load TEP stone config Listing Failure',

  SEARCH_TEP_STONE_CONFIG = '[TEP-stone-config-Details] Search TEP stone config',
  SEARCH_TEP_STONE_CONFIG_SUCCESS = '[TEP-stone-config-Details] Search TEP stone config Success',
  SEARCH_TEP_STONE_CONFIG_FAILURE = '[TEP-stone-config-Details] Search TEP stone config Failure',

  LOAD_TEP_STONE_CONFIG = '[TEP-stone-config-Details] Load TEP stone config',
  LOAD_TEP_STONE_CONFIG_SUCCESS = '[TEP-stone-config-Details] Load TEP stone config Success',
  LOAD_TEP_STONE_CONFIG_FAILURE = '[TEP-stone-config-Details] Load TEP stone config Failure',

  SAVE_TEP_STONE_CONFIG = '[TEP-stone-config-Details] Save TEP stone config',
  SAVE_TEP_STONE_CONFIG_SUCCESS = '[TEP-stone-config-Details] Save TEP stone config Success',
  SAVE_TEP_STONE_CONFIG_FAILURE = '[TEP-stone-config-Details] Save TEP stone config Failure',

  UPDATE_TEP_STONE_CONFIG = '[TEP-stone-config-Details] Update TEP stone config',
  UPDATE_TEP_STONE_CONFIG_SUCCESS = '[TEP-stone-config-Details] Update TEP stone config Success',
  UPDATE_TEP_STONE_CONFIG_FAILURE = '[TEP-stone-config-Details] Update TEP stone config Failure',

  LOAD_TEP_STONE_CONFIG_DATA_LISTING = '[TEP-stone-config-details-listing] Load TEP stone config Data Listing',
  LOAD_TEP_STONE_CONFIG_DATA_LISTING_SUCCESS = '[TEP-stone-config-details-listing] Load TEP stone config Data Listing Success',
  LOAD_TEP_STONE_CONFIG_DATA_LISTING_FAILURE = '[TEP-stone-config-details-listing] Load TEP stone config Data Listing Failure',

  SEARCH_TEP_STONE_CONFIG_DATA_LISTING = '[TEP-stone-config-details-listing] Search TEP stone config Data Listing',
  SEARCH_TEP_STONE_CONFIG_DATA_LISTING_SUCCESS = '[TEP-stone-config-details-listing] Search TEP stone config Data Listing Success',
  SEARCH_TEP_STONE_CONFIG_DATA_LISTING_FAILURE = '[TEP-stone-config-details-listing] Search TEP stone config Data Listing Failure',

  SAVE_TEP_STONE_CONFIG_DATA_DETAILS = '[TEP-stone-config-Details] Save TEP stone config Data Details',
  SAVE_TEP_STONE_CONFIG_DATA_DETAILS_SUCCESS = '[TEP-stone-config-Details] Save TEP stone config Data Details Success',
  SAVE_TEP_STONE_CONFIG_DATA_DETAILS_FAILURE = '[TEP-stone-config-Details] Save TEP stone config Data Details Failure',

  EDIT_TEP_STONE_CONFIG_DATA_DETAILS = '[TEP-stone-config-Details] Edit TEP stone config Data Details',
  EDIT_TEP_STONE_CONFIG_DATA_DETAILS_SUCCESS = '[TEP-stone-config-Details] Edit TEP stone config Data Details Success',
  EDIT_TEP_STONE_CONFIG_DATA_DETAILS_FAILURE = '[TEP-stone-config-Details] Edit TEP stone config Data Details Failure',

  REMOVE_TEP_STONE_CONFIG_DATA_DETAILS = '[TEP-stone-config-Details] Remove TEP stone config Data Details',
  REMOVE_TEP_STONE_CONFIG_DATA_DETAILS_SUCCESS = '[TEP-stone-config-Details] Remove TEP stone config Data Details Success',
  REMOVE_TEP_STONE_CONFIG_DATA_DETAILS_FAILURE = '[TEP-stone-config-Details] Remove TEP stone config Data Details Failure',

  LOAD_TEP_STONE_TYPES_LIST = '[TEP-stone-config-Details] Load TEP Stone Types List',
  LOAD_TEP_STONE_TYPES_LIST_SUCCESS = '[TEP-stone-config-Details] Load TEP Stone Types List Success',
  LOAD_TEP_STONE_TYPES_LIST_FAILURE = '[TEP-stone-config-Details] Load TEP Stone Types List Failure',

  LOAD_TEP_STONE_QUALITIES_LIST = '[TEP-stone-config-Details] Load TEP Stone Quealities List',
  LOAD_TEP_STONE_QUALITIES_LIST_SUCCESS = '[TEP-stone-config-Details] Load TEP Stone Quealities List Success',
  LOAD_TEP_STONE_QUALITIES_LIST_FAILURE = '[TEP-stone-config-Details] Load TEP Stone Quealities List Failure',

  LOAD_TEP_STONE_RANGE_LIST = '[TEP-stone-config-Details] Load TEP Stone Range List',
  LOAD_TEP_STONE_RANGE_LIST_SUCCESS = '[TEP-stone-config-Details] Load TEP Stone Range List Success',
  LOAD_TEP_STONE_RANGE_LIST_FAILURE = '[TEP-stone-config-Details] Load TEP Stone Range List Failure'
}

export class LoadTepStoneConfigListing implements Action {
  readonly type = TepStoneConfigActionTypes.LOAD_TEP_STONE_CONFIG_LISTING;
  constructor(public payload: TEPStoneConfigListingPayload) {}
}
export class LoadTepStoneConfigListingSuccess implements Action {
  readonly type =
    TepStoneConfigActionTypes.LOAD_TEP_STONE_CONFIG_LISTING_SUCCESS;
  constructor(public payload: TEPStoneConfigListing) {}
}
export class LoadTepStoneConfigListingFailure implements Action {
  readonly type =
    TepStoneConfigActionTypes.LOAD_TEP_STONE_CONFIG_LISTING_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchTepStoneConfigDetails implements Action {
  readonly type = TepStoneConfigActionTypes.SEARCH_TEP_STONE_CONFIG;
  constructor(public payload: string) {}
}
export class SearchTepStoneConfigDetailsSuccess implements Action {
  readonly type = TepStoneConfigActionTypes.SEARCH_TEP_STONE_CONFIG_SUCCESS;
  constructor(public payload: TEPStoneConfigListing) {}
}
export class SearchTepStoneConfigDetailsFailure implements Action {
  readonly type = TepStoneConfigActionTypes.SEARCH_TEP_STONE_CONFIG_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadTepStoneConfigDetails implements Action {
  readonly type = TepStoneConfigActionTypes.LOAD_TEP_STONE_CONFIG;
  constructor(public payload: string) {}
}
export class LoadTepStoneConfigDetailsSuccess implements Action {
  readonly type = TepStoneConfigActionTypes.LOAD_TEP_STONE_CONFIG_SUCCESS;
  constructor(public payload: TEPStoneConfig) {}
}
export class LoadTepStoneConfigDetailsFailure implements Action {
  readonly type = TepStoneConfigActionTypes.LOAD_TEP_STONE_CONFIG_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveTepStoneConfig implements Action {
  readonly type = TepStoneConfigActionTypes.SAVE_TEP_STONE_CONFIG;
  constructor(public payload: TEPStoneConfig) {}
}
export class SaveTepStoneConfigSuccess implements Action {
  readonly type = TepStoneConfigActionTypes.SAVE_TEP_STONE_CONFIG_SUCCESS;
  constructor(public payload: TEPStoneConfig) {}
}
export class SaveTepStoneConfigFailure implements Action {
  readonly type = TepStoneConfigActionTypes.SAVE_TEP_STONE_CONFIG_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateTepStoneConfigDetails implements Action {
  readonly type = TepStoneConfigActionTypes.UPDATE_TEP_STONE_CONFIG;
  constructor(public payload: TEPStoneConfig) {}
}
export class UpdateTepStoneConfigDetailsSuccess implements Action {
  readonly type = TepStoneConfigActionTypes.UPDATE_TEP_STONE_CONFIG_SUCCESS;
  constructor(public payload: TEPStoneConfig) {}
}
export class UpdateTepStoneConfigDetailsFailure implements Action {
  readonly type = TepStoneConfigActionTypes.UPDATE_TEP_STONE_CONFIG_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadTepStoneConfigDataListing implements Action {
  readonly type = TepStoneConfigActionTypes.LOAD_TEP_STONE_CONFIG_DATA_LISTING;
  constructor(public payload: string) {}
}
export class LoadTepStoneConfigDataListingSuccess implements Action {
  readonly type =
    TepStoneConfigActionTypes.LOAD_TEP_STONE_CONFIG_DATA_LISTING_SUCCESS;
  constructor(public payload: TEPStoneConfigDetailsListing) {}
}
export class LoadTepStoneConfigDataListingFailure implements Action {
  readonly type =
    TepStoneConfigActionTypes.LOAD_TEP_STONE_CONFIG_DATA_LISTING_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchTepStoneConfigDataListing implements Action {
  readonly type =
    TepStoneConfigActionTypes.SEARCH_TEP_STONE_CONFIG_DATA_LISTING;
  constructor(
    public payload: {
      configId: string;
      filter: string;
    }
  ) {}
}
export class SearchTepStoneConfigDataListingSuccess implements Action {
  readonly type =
    TepStoneConfigActionTypes.SEARCH_TEP_STONE_CONFIG_DATA_LISTING_SUCCESS;
  constructor(public payload: TEPStoneConfigDetailsListing) {}
}
export class SearchTepStoneConfigDataListingFailure implements Action {
  readonly type =
    TepStoneConfigActionTypes.SEARCH_TEP_STONE_CONFIG_DATA_LISTING_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadTepStoneTypesListing implements Action {
  readonly type = TepStoneConfigActionTypes.LOAD_TEP_STONE_TYPES_LIST;
}
export class LoadTepStoneTypesListingSuccess implements Action {
  readonly type = TepStoneConfigActionTypes.LOAD_TEP_STONE_TYPES_LIST_SUCCESS;
  constructor(public payload: TEPStoneConfigStoneType[]) {}
}
export class LoadTepStoneTypesListingFailure implements Action {
  readonly type = TepStoneConfigActionTypes.LOAD_TEP_STONE_TYPES_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadTepStoneQualitiesListing implements Action {
  readonly type = TepStoneConfigActionTypes.LOAD_TEP_STONE_QUALITIES_LIST;
}
export class LoadTepStoneQualitiesListingSuccess implements Action {
  readonly type =
    TepStoneConfigActionTypes.LOAD_TEP_STONE_QUALITIES_LIST_SUCCESS;
  constructor(public payload: TEPStoneConfigQualities[]) {}
}
export class LoadTepStoneQualitiesListingFailure implements Action {
  readonly type =
    TepStoneConfigActionTypes.LOAD_TEP_STONE_QUALITIES_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadTepStoneRangeListing implements Action {
  readonly type = TepStoneConfigActionTypes.LOAD_TEP_STONE_RANGE_LIST;
}
export class LoadTepStoneRangeListingSuccess implements Action {
  readonly type = TepStoneConfigActionTypes.LOAD_TEP_STONE_RANGE_LIST_SUCCESS;
  constructor(public payload: TEPStoneConfigRange[]) {}
}
export class LoadTepStoneRangeListingFailure implements Action {
  readonly type = TepStoneConfigActionTypes.LOAD_TEP_STONE_RANGE_LIST_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveTepStoneConfigDataDetails implements Action {
  readonly type = TepStoneConfigActionTypes.SAVE_TEP_STONE_CONFIG_DATA_DETAILS;
  constructor(
    public payload: { configId: string; tepStoneDetails: TEPStoneDetailsModify }
  ) {}
}
export class SaveTepStoneConfigDataDetailsSuccess implements Action {
  readonly type =
    TepStoneConfigActionTypes.SAVE_TEP_STONE_CONFIG_DATA_DETAILS_SUCCESS;
  constructor(public payload: TEPStoneConfigDetailsListing) {}
}
export class SaveTepStoneConfigDataDetailsFailure implements Action {
  readonly type =
    TepStoneConfigActionTypes.SAVE_TEP_STONE_CONFIG_DATA_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class EditTepStoneConfigDataDetails implements Action {
  readonly type = TepStoneConfigActionTypes.EDIT_TEP_STONE_CONFIG_DATA_DETAILS;
  constructor(
    public payload: { configId: string; tepStoneDetails: TEPStoneDetailsModify }
  ) {}
}
export class EditTepStoneConfigDataDetailsSuccess implements Action {
  readonly type =
    TepStoneConfigActionTypes.EDIT_TEP_STONE_CONFIG_DATA_DETAILS_SUCCESS;
  constructor(public payload: TEPStoneConfigDetailsListing) {}
}
export class EditTepStoneConfigDataDetailsFailure implements Action {
  readonly type =
    TepStoneConfigActionTypes.EDIT_TEP_STONE_CONFIG_DATA_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class RemoveTepStoneConfigDataDetails implements Action {
  readonly type =
    TepStoneConfigActionTypes.REMOVE_TEP_STONE_CONFIG_DATA_DETAILS;
  constructor(
    public payload: { configId: string; tepStoneDetails: TEPStoneDetailsModify }
  ) {}
}
export class RemoveTepStoneConfigDataDetailsSuccess implements Action {
  readonly type =
    TepStoneConfigActionTypes.REMOVE_TEP_STONE_CONFIG_DATA_DETAILS_SUCCESS;
  constructor(public payload: string[]) {}
}
export class RemoveTepStoneConfigDataDetailsFailure implements Action {
  readonly type =
    TepStoneConfigActionTypes.REMOVE_TEP_STONE_CONFIG_DATA_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type TepStoneConfigActions =
  | LoadTepStoneConfigListing
  | LoadTepStoneConfigListingSuccess
  | LoadTepStoneConfigListingFailure
  | SearchTepStoneConfigDetails
  | SearchTepStoneConfigDetailsSuccess
  | SearchTepStoneConfigDetailsFailure
  | LoadTepStoneConfigDetails
  | LoadTepStoneConfigDetailsSuccess
  | LoadTepStoneConfigDetailsFailure
  | SaveTepStoneConfig
  | SaveTepStoneConfigSuccess
  | SaveTepStoneConfigFailure
  | UpdateTepStoneConfigDetails
  | UpdateTepStoneConfigDetailsSuccess
  | UpdateTepStoneConfigDetailsFailure
  | LoadTepStoneConfigDataListing
  | LoadTepStoneConfigDataListingSuccess
  | LoadTepStoneConfigDataListingFailure
  | SearchTepStoneConfigDataListing
  | SearchTepStoneConfigDataListingSuccess
  | SearchTepStoneConfigDataListingFailure
  | LoadTepStoneTypesListing
  | LoadTepStoneTypesListingSuccess
  | LoadTepStoneTypesListingFailure
  | LoadTepStoneQualitiesListing
  | LoadTepStoneQualitiesListingSuccess
  | LoadTepStoneQualitiesListingFailure
  | LoadTepStoneRangeListing
  | LoadTepStoneRangeListingSuccess
  | LoadTepStoneRangeListingFailure
  | SaveTepStoneConfigDataDetails
  | SaveTepStoneConfigDataDetailsSuccess
  | SaveTepStoneConfigDataDetailsFailure
  | EditTepStoneConfigDataDetails
  | EditTepStoneConfigDataDetailsSuccess
  | EditTepStoneConfigDataDetailsFailure
  | RemoveTepStoneConfigDataDetails
  | RemoveTepStoneConfigDataDetailsSuccess
  | RemoveTepStoneConfigDataDetailsFailure;
