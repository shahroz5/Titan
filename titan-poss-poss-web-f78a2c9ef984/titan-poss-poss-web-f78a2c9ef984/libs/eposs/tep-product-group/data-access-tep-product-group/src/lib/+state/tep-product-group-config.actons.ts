import { Action } from '@ngrx/store';
import {
  AddTEPProductGroupsMapping,
  CustomErrors,
  TEPProductGroupConfigDetails,
  TEPProductGroupConfigListing,
  TEPProductGroupConfigListingPayload,
  TEPProductGroupMappingListing,
  TEPProductGroupMappingListingPayload
} from '@poss-web/shared/models';

export enum TepProductGroupConfigActionTypes {
  LOAD_TEP_PRODUCT_GROUP_CONFIG_LISTING = '[TEP-product-group-config-listing] Load TEP product group config Listing',
  LOAD_TEP_PRODUCT_GROUP_CONFIG_LISTING_SUCCESS = '[TEP-product-group-config-listing] Load TEP product group config Listing Success',
  LOAD_TEP_PRODUCT_GROUP_CONFIG_LISTING_FAILURE = '[TEP-product-group-config-listing] Load TEP product group config Listing Failure',

  SEARCH_TEP_PRODUCT_GROUP_CONFIG_DETAILS = '[TEP-product-config-Details] Search TEP product group config Details',
  SEARCH_TEP_PRODUCT_GROUP_CONFIG_DETAILS_SUCCESS = '[TEP-product-config-Details] Search TEP product group Details Success',
  SEARCH_TEP_PRODUCT_GROUP_CONFIG_DETAILS_FAILURE = '[TEP-product-config-Details] Search TEP product group Deatils Failure',

  LOAD_TEP_PRODUCT_GROUP_CONFIG_DETAILS = '[TEP-product-group-config-details] Load TEP product group config Details',
  LOAD_TEP_PRODUCT_GROUP_CONFIG_DETAILS_SUCCESS = '[TEP-product-group-config-details] Load TEP product group config Details Success',
  LOAD_TEP_PRODUCT_GROUP_CONFIG_DETAILS_FAILURE = '[TEP-product-group-config-details] Load TEP product group config Details Failure',

  SAVE_TEP_PRODUCT_GROUP_CONFIG_DETAILS = '[TEP-product-group-config-details] Save TEP product group config Details',
  SAVE_TEP_PRODUCT_GROUP_CONFIG_DETAILS_SUCCESS = '[TEP-product-group-config-details] Save TEP product group config Details Success',
  SAVE_TEP_PRODUCT_GROUP_CONFIG_DETAILS_FAILURE = '[TEP-product-group-config-details] Save TEP product group config Details Failure',

  UPDATE_TEP_PRODUCT_GROUP_CONFIG_DETAILS = '[TEP-product-group-config-details] Update TEP product group config Details',
  UPDATE_TEP_PRODUCT_GROUP_CONFIG_DETAILS_SUCCESS = '[TEP-product-group-config-details] Update TEP product group config Details Success',
  UPDATE_TEP_PRODUCT_GROUP_CONFIG_DETAILS_FAILURE = '[TEP-product-group-config-details] Update TEP product group config Details Failure',

  LOAD_TEP_PRODUCT_GROUP_MAPPING_LISTING = '[TEP-product-group-mapping-listing] Load TEP product group mapping listing',
  LOAD_TEP_PRODUCT_GROUP_MAPPING_LISTING_SUCCESS = '[TEP-product-group-mapping-listing] Load TEP product group mapping listing Success',
  LOAD_TEP_PRODUCT_GROUP_MAPPING_LISTING_FAILURE = '[TEP-product-group-mapping-listing] Load TEP product group mapping listing Failure',

  SEARCH_TEP_PRODUCT_GROUP_MAPPING_LISTING = '[TEP-product-group-mapping-listing] Search TEP product group mapping listing',
  SEARCH_TEP_PRODUCT_GROUP_MAPPING_LISTING_SUCCESS = '[TEP-product-group-mapping-listing] Search TEP product group mapping listing Success',
  SEARCH_TEP_PRODUCT_GROUP_MAPPING_LISTING_FAILURE = '[TEP-product-group-mapping-listing] Search TEP product group mapping listing Failure',

  SAVE_TEP_PRODUCT_GROUP_MAPPING = '[TEP-product-group-mapping] Save TEP product group mapping',
  SAVE_TEP_PRODUCT_GROUP_MAPPING_SUCCESS = '[TEP-product-group-mapping] Save TEP product group mapping Success',
  SAVE_TEP_PRODUCT_GROUP_MAPPING_FAILURE = '[TEP-product-group-mapping] Save TEP product group mapping Failure'
}

export class LoadTepProductGroupConfigListing implements Action {
  readonly type =
    TepProductGroupConfigActionTypes.LOAD_TEP_PRODUCT_GROUP_CONFIG_LISTING;
  constructor(public payload: TEPProductGroupConfigListingPayload) {}
}
export class LoadTepProductGroupConfigListingSuccess implements Action {
  readonly type =
    TepProductGroupConfigActionTypes.LOAD_TEP_PRODUCT_GROUP_CONFIG_LISTING_SUCCESS;
  constructor(public payload: TEPProductGroupConfigListing) {}
}
export class LoadTepProductGroupConfigListingFailure implements Action {
  readonly type =
    TepProductGroupConfigActionTypes.LOAD_TEP_PRODUCT_GROUP_CONFIG_LISTING_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchTepProductConfigDetails implements Action {
  readonly type =
    TepProductGroupConfigActionTypes.SEARCH_TEP_PRODUCT_GROUP_CONFIG_DETAILS;
  constructor(public payload: string) {}
}
export class SearchTepProductConfigDetailsSuccess implements Action {
  readonly type =
    TepProductGroupConfigActionTypes.SEARCH_TEP_PRODUCT_GROUP_CONFIG_DETAILS_SUCCESS;
  constructor(public payload: TEPProductGroupConfigListing) {}
}
export class SearchTepProductConfigDetailsFailure implements Action {
  readonly type =
    TepProductGroupConfigActionTypes.SEARCH_TEP_PRODUCT_GROUP_CONFIG_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadTepProductGroupConfigDetails implements Action {
  readonly type =
    TepProductGroupConfigActionTypes.LOAD_TEP_PRODUCT_GROUP_CONFIG_DETAILS;
  constructor(public payload: string) {}
}
export class LoadTepProductGroupConfigDetailsSuccess implements Action {
  readonly type =
    TepProductGroupConfigActionTypes.LOAD_TEP_PRODUCT_GROUP_CONFIG_DETAILS_SUCCESS;
  constructor(public payload: TEPProductGroupConfigDetails) {}
}
export class LoadTepProductGroupConfigDetailsFailure implements Action {
  readonly type =
    TepProductGroupConfigActionTypes.LOAD_TEP_PRODUCT_GROUP_CONFIG_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveTepProductGroupConfigDetails implements Action {
  readonly type =
    TepProductGroupConfigActionTypes.SAVE_TEP_PRODUCT_GROUP_CONFIG_DETAILS;
  constructor(public payload: TEPProductGroupConfigDetails) {}
}
export class SaveTepProductGroupConfigDetailsSuccess implements Action {
  readonly type =
    TepProductGroupConfigActionTypes.SAVE_TEP_PRODUCT_GROUP_CONFIG_DETAILS_SUCCESS;
  constructor(public payload: TEPProductGroupConfigDetails) {}
}
export class SaveTepProductGroupConfigDetailsFailure implements Action {
  readonly type =
    TepProductGroupConfigActionTypes.SAVE_TEP_PRODUCT_GROUP_CONFIG_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class UpdateTepProductGroupConfigDetails implements Action {
  readonly type =
    TepProductGroupConfigActionTypes.UPDATE_TEP_PRODUCT_GROUP_CONFIG_DETAILS;
  constructor(public payload: Partial<TEPProductGroupConfigDetails>) {}
}
export class UpdateTepProductGroupConfigDetailsSuccess implements Action {
  readonly type =
    TepProductGroupConfigActionTypes.UPDATE_TEP_PRODUCT_GROUP_CONFIG_DETAILS_SUCCESS;
  constructor(public payload: TEPProductGroupConfigDetails) {}
}
export class UpdateTepProductGroupConfigDetailsFailure implements Action {
  readonly type =
    TepProductGroupConfigActionTypes.UPDATE_TEP_PRODUCT_GROUP_CONFIG_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadTepProductGroupMappintListing implements Action {
  readonly type =
    TepProductGroupConfigActionTypes.LOAD_TEP_PRODUCT_GROUP_MAPPING_LISTING;
  constructor(public payload: TEPProductGroupMappingListingPayload) {}
}
export class LoadTepProductGroupMappintListingSuccess implements Action {
  readonly type =
    TepProductGroupConfigActionTypes.LOAD_TEP_PRODUCT_GROUP_MAPPING_LISTING_SUCCESS;
  constructor(public payload: TEPProductGroupMappingListing) {}
}
export class LoadTepProductGroupMappintListingFailure implements Action {
  readonly type =
    TepProductGroupConfigActionTypes.LOAD_TEP_PRODUCT_GROUP_MAPPING_LISTING_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchTepProductGroupMappintListing implements Action {
  readonly type =
    TepProductGroupConfigActionTypes.SEARCH_TEP_PRODUCT_GROUP_MAPPING_LISTING;
  constructor(
    public payload: {
      configId: string;
      filter: string;
    }
  ) {}
}
export class SearchTepProductGroupMappintListingSuccess implements Action {
  readonly type =
    TepProductGroupConfigActionTypes.SEARCH_TEP_PRODUCT_GROUP_MAPPING_LISTING_SUCCESS;
  constructor(public payload: TEPProductGroupMappingListing) {}
}
export class SearchTepProductGroupMappintListingFailure implements Action {
  readonly type =
    TepProductGroupConfigActionTypes.SEARCH_TEP_PRODUCT_GROUP_MAPPING_LISTING_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SaveTepProductGroupMapping implements Action {
  readonly type =
    TepProductGroupConfigActionTypes.SAVE_TEP_PRODUCT_GROUP_MAPPING;
  constructor(
    public payload: {
      configId: string;
      addTEPProductGroupsMapping: AddTEPProductGroupsMapping;
    }
  ) {}
}
export class SaveTepProductGroupMappingSuccess implements Action {
  readonly type =
    TepProductGroupConfigActionTypes.SAVE_TEP_PRODUCT_GROUP_MAPPING_SUCCESS;
  constructor(public payload: TEPProductGroupMappingListing) {}
}
export class SaveTepProductGroupMappingFailure implements Action {
  readonly type =
    TepProductGroupConfigActionTypes.SAVE_TEP_PRODUCT_GROUP_MAPPING_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type TepProductGroupConfigActions =
  | LoadTepProductGroupConfigListing
  | LoadTepProductGroupConfigListingSuccess
  | LoadTepProductGroupConfigListingFailure
  | SearchTepProductConfigDetails
  | SearchTepProductConfigDetailsSuccess
  | SearchTepProductConfigDetailsFailure
  | LoadTepProductGroupConfigDetails
  | LoadTepProductGroupConfigDetailsSuccess
  | LoadTepProductGroupConfigDetailsFailure
  | SaveTepProductGroupConfigDetails
  | SaveTepProductGroupConfigDetailsSuccess
  | SaveTepProductGroupConfigDetailsFailure
  | UpdateTepProductGroupConfigDetails
  | UpdateTepProductGroupConfigDetailsSuccess
  | UpdateTepProductGroupConfigDetailsFailure
  | LoadTepProductGroupMappintListing
  | LoadTepProductGroupMappintListingSuccess
  | LoadTepProductGroupMappintListingFailure
  | SearchTepProductGroupMappintListing
  | SearchTepProductGroupMappintListingSuccess
  | SearchTepProductGroupMappintListingFailure
  | SaveTepProductGroupMapping
  | SaveTepProductGroupMappingSuccess
  | SaveTepProductGroupMappingFailure;
