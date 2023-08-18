import { Action } from '@ngrx/store';
import {
  CustomErrors,
  BrandListingPayload,
  BrandMasterListing,
  BrandMasterDetails
} from '@poss-web/shared/models';

export enum BrandMasterActionTypes {
  LOAD_BRAND_MASTER_LISTING = '[Brand-listing] Load Brand Master Listing',
  LOAD_BRAND_MASTER_LISTING_FAILURE = '[Brand-listing] Load Brand Master Listing Failure',
  LOAD_BRAND_MASTER_LISTING_SUCCESS = '[Brand-listing] Load Brand Master Listing Success',

  SEARCH_BRAND_MASTER_DETAILS = '[Brand-Details] Search Brand Details',
  SEARCH_BRAND_MASTER_DETAILS_SUCCESS = '[Brand-Details] Search Brand Details Success',
  SEARCH_BRAND_MASTER_DETAILS_FAILURE = '[Brand-Details] Search Brand Deatils Failure',

  LOAD_BRAND_MASTER_DETAILS = '[Brand-Details] Load Brand Details',
  LOAD_BRAND_MASTER_DETAILS_SUCCESS = '[Brand-Details] Load Brand Details Success',
  LOAD_BRAND_MASTER_DETAILS_FAILURE = '[Brand-Details] Load Brand Deatils Failure',

  SAVE_BRAND_MASTER_DETAILS = '[Brand] Save Brand Master Details',
  SAVE_BRAND_MASTER_DETAILS_SUCCESS = '[Brand] Save Brand Master Details Success',
  SAVE_BRAND_MASTER_DETAILS_FAILURE = '[Brand] Save Brand Master Details Failure',

  UPDATE_BRAND_MASTER_DETAILS = '[Brand] Update Brand  Master Details',
  UPDATE_BRAND_MASTER_DETAILS_SUCCESS = '[Brand] Update Brand Master Details Success',
  UPDATE_BRAND_MASTER_DETAILS_FAILURE = '[Brand] Update Brand Master Details Failure',
}


export class LoadBrandListing implements Action {
  readonly type = BrandMasterActionTypes.LOAD_BRAND_MASTER_LISTING;
  constructor(public payload: BrandListingPayload) { }
}
export class LoadBrandListingSuccess implements Action {
  readonly type = BrandMasterActionTypes.LOAD_BRAND_MASTER_LISTING_SUCCESS;
  constructor(public payload: BrandMasterListing) { }
}

export class LoadBrandListingFailure implements Action {
  readonly type = BrandMasterActionTypes.LOAD_BRAND_MASTER_LISTING_FAILURE;
  constructor(public payload: CustomErrors) { }
}


export class SearchBrandDetails implements Action {
  readonly type = BrandMasterActionTypes.SEARCH_BRAND_MASTER_DETAILS;
  constructor(public payload: string) { }
}
export class SearchBrandDetailsSuccess implements Action {
  readonly type = BrandMasterActionTypes.SEARCH_BRAND_MASTER_DETAILS_SUCCESS;
  constructor(public payload: BrandMasterListing) { }
}
export class SearchBrandDetailsFailure implements Action {
  readonly type = BrandMasterActionTypes.SEARCH_BRAND_MASTER_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) { }
}

export class LoadBrandDetails implements Action {
  readonly type = BrandMasterActionTypes.LOAD_BRAND_MASTER_DETAILS;
  constructor(public payload: string) { }
}
export class LoadBrandDetailsSuccess implements Action {
  readonly type =
    BrandMasterActionTypes.LOAD_BRAND_MASTER_DETAILS_SUCCESS;
  constructor(public payload: BrandMasterDetails) { }
}

export class LoadBrandDetailsFailure implements Action {
  readonly type =
    BrandMasterActionTypes.LOAD_BRAND_MASTER_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) { }
}

export class SaveBrandMasterDetails implements Action {
  readonly type = BrandMasterActionTypes.SAVE_BRAND_MASTER_DETAILS;
  constructor(public payload: BrandMasterDetails) { }
}
export class SaveBrandMasterDetailsFailure implements Action {
  readonly type = BrandMasterActionTypes.SAVE_BRAND_MASTER_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) { }
}

export class SaveBrandMasterDetailsSuccess implements Action {
  readonly type = BrandMasterActionTypes.SAVE_BRAND_MASTER_DETAILS_SUCCESS;
  constructor(public payload: BrandMasterDetails) { }
}
export class UpdateBrandMasterDetails implements Action {
  readonly type = BrandMasterActionTypes.UPDATE_BRAND_MASTER_DETAILS;
  constructor(public payload: BrandMasterDetails) { }
}
export class UpdateBrandMasterDetailsFailure implements Action {
  readonly type = BrandMasterActionTypes.UPDATE_BRAND_MASTER_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) { }
}

export class UpdateBrandMasterDetailsSuccess implements Action {
  readonly type = BrandMasterActionTypes.UPDATE_BRAND_MASTER_DETAILS_SUCCESS;
  constructor(public payload: BrandMasterDetails) { }
}


export type BrandMasterActions =
  | LoadBrandListing
  | LoadBrandListingSuccess
  | LoadBrandListingFailure
  | SearchBrandDetails
  | SearchBrandDetailsSuccess
  | SearchBrandDetailsFailure
  | LoadBrandDetails
  | LoadBrandDetailsSuccess
  | LoadBrandDetailsFailure
  | SaveBrandMasterDetails
  | SaveBrandMasterDetailsSuccess
  | SaveBrandMasterDetailsFailure
  | UpdateBrandMasterDetails
  | UpdateBrandMasterDetailsFailure
  | UpdateBrandMasterDetailsSuccess

