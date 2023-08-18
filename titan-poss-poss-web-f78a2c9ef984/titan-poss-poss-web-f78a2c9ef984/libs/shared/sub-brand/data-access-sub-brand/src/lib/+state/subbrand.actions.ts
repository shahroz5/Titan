import { Action } from '@ngrx/store';

import {
  CustomErrors,
  BrandListing,
  UpadateIsActivePayload,
  BrandMaster,
  UpdateBrandMasterDetailsPayload,
  SubBrandListingPayload,
  SearchPayload
} from '@poss-web/shared/models';

export enum SubBrandMasterActionTypes {
  LOAD_SUB_BRAND_MASTER_LISTING = '[Sub Brand-listing]  Load Sub Brand Master Listing',
  LOAD_SUB_BRAND_MASTER_LISTING_FAILURE = '[Sub Brand-listing] Load  Sub Brand Master Listing Failure',
  LOAD_SUB_BRAND_MASTER_LISTING_SUCCESS = '[Sub Brand-listing]  Load Sub Brand Master Listing Success',

  SAVE_SUB_BRAND_MASTER_DETAILS = '[Sub Brand-listing] Save Sub Brand Master Details',
  SAVE_SUB_BRAND_MASTER_DETAILS_SUCCESS = '[Sub Brand-listing]  Save Sub Brand Master Details Success',
  SAVE_SUB_BRAND_MASTER_DETAILS_FAILURE = '[Sub Brand-listing]  Save Sub Brand Master Details Failure',

  UPDATE_SUB_BRAND_MASTER_DETAILS = '[Sub Brand-listing]  Update Sub Brand  Master Details',
  UPDATE_SUB_BRAND_MASTER_DETAILS_SUCCESS = '[Sub Brand-listing]  Update Sub Brand Master Details Success',
  UPDATE_SUB_BRAND_MASTER_DETAILS_FAILURE = '[Sub Brand-listing]  Update Sub Brand Master Details Failure',

  UPDATE_IS_ACTIVE = '[Sub Brand-listing]  Update Is Active',
  UPDATE_IS_ACTIVE_SUCCESS = '[Sub Brand-listing]  Update Is Active Success',
  UPDATE_IS_ACTIVE_FAILURE = '[Sub Brand-listing] Update Is Active Failure',

  LOAD_SUB_BRAND_DETAILS_BY_BRAND_CODE = '[Sub Brand-listing]  Load Sub Brand Details By Brand Code',
  LOAD_SUB_BRAND_DETAILS_BY_BRAND_CODE_SUCCESS = '[Sub Brand-listing]  Load Sub Brand Details by Brand Code Success',
  LOAD_SUB_BRAND_DETAILS_BY_BRAND_CODE_FAILURE = '[Sub Brand-listing]  Load Sub Brand Details by Brand Code Failure',

  SEARCH_SUB_BRAND_BY_BRAND_CODE = '[Sub Brand-listing] Search Sub Brand By Brand Code',
  SEARCH_SUB_BRAND_BY_BRAND_CODE_SUCCESS = '[Sub Brand-listing] Search Sub Brand By Brand Code Success',
  SEARCH_SUB_BRAND_BY_BRAND_CODE_FAILURE = '[Sub Brand-listing]  Search Sub Brand By Brand Code Failure',

  LOAD_PARENT_BRANDS = '[Brand-listing] Load Parent Brands',
  LOAD_PARENT_BRANDS_SUCCESS = '[Brand-listing] Load Parent Brands Success',
  LOAD_PARENT_BRANDS_FAILURE = '[Brand-listing] Load Parent Brands Failure',

  LOAD_RESET_BRAND_DETAILS = '[Brand-listing] Load Reset Brand Details',
  RESET_IS_ACTIVE = '[Brand-listing] Reset Is Active'
}

export class LoadParenBrands implements Action {
  readonly type = SubBrandMasterActionTypes.LOAD_PARENT_BRANDS;

}

export class LoadParenBrandsSuccess implements Action {
  readonly type = SubBrandMasterActionTypes.LOAD_PARENT_BRANDS_SUCCESS;
  constructor(public payload: any) { }
}

export class LoadParenBrandsFailure implements Action {
  readonly type = SubBrandMasterActionTypes.LOAD_PARENT_BRANDS_FAILURE;
  constructor(public payload: CustomErrors) { }
}

export class UpdateIsActive implements Action {
  readonly type = SubBrandMasterActionTypes.UPDATE_IS_ACTIVE;
  constructor(public payload: UpadateIsActivePayload) { }
}

export class UpdateIsActiveSuccess implements Action {
  readonly type = SubBrandMasterActionTypes.UPDATE_IS_ACTIVE_SUCCESS;
  constructor(public payload: any) { }
}

export class UpdateIsActiveFailure implements Action {
  readonly type = SubBrandMasterActionTypes.UPDATE_IS_ACTIVE_FAILURE;
  constructor(public payload: CustomErrors) { }
}

export class ResetIsActiveToggle implements Action {
  readonly type = SubBrandMasterActionTypes.RESET_IS_ACTIVE;
}
export class LoadReset implements Action {
  readonly type = SubBrandMasterActionTypes.LOAD_RESET_BRAND_DETAILS;
}

export class SaveSubBrandMasterDetails implements Action {
  readonly type = SubBrandMasterActionTypes.SAVE_SUB_BRAND_MASTER_DETAILS;
  constructor(public payload: BrandMaster) { }
}
export class SaveSubBrandMasterDetailsFailure implements Action {
  readonly type =
    SubBrandMasterActionTypes.SAVE_SUB_BRAND_MASTER_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) { }
}

export class SaveSubBrandMasterDetailsSuccess implements Action {
  readonly type =
    SubBrandMasterActionTypes.SAVE_SUB_BRAND_MASTER_DETAILS_SUCCESS;
}
export class UpdateSubBrandMasterDetails implements Action {
  readonly type = SubBrandMasterActionTypes.UPDATE_SUB_BRAND_MASTER_DETAILS;
  constructor(public payload: UpdateBrandMasterDetailsPayload) { }
}
export class UpdateSubBrandMasterDetailsFailure implements Action {
  readonly type =
    SubBrandMasterActionTypes.UPDATE_SUB_BRAND_MASTER_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) { }
}

export class UpdateSubBrandMasterDetailsSuccess implements Action {
  readonly type =
    SubBrandMasterActionTypes.UPDATE_SUB_BRAND_MASTER_DETAILS_SUCCESS;
}

export class LoadSubBrandListing implements Action {
  readonly type = SubBrandMasterActionTypes.LOAD_SUB_BRAND_MASTER_LISTING;
  constructor(public payload: SubBrandListingPayload) { }
}
export class LoadSubBrandListingSuccess implements Action {
  readonly type =
    SubBrandMasterActionTypes.LOAD_SUB_BRAND_MASTER_LISTING_SUCCESS;
  constructor(public payload: BrandListing) { }
}

export class LoadSubBrandListingFailure implements Action {
  readonly type =
    SubBrandMasterActionTypes.LOAD_SUB_BRAND_MASTER_LISTING_FAILURE;
  constructor(public payload: CustomErrors) { }
}

export class LoadSubrandDetailsByBrandCode implements Action {
  readonly type =
    SubBrandMasterActionTypes.LOAD_SUB_BRAND_DETAILS_BY_BRAND_CODE;
  constructor(public payload: string) { }
}
export class LoadSubrandDetailsByBrandCodeSuccess implements Action {
  readonly type =
    SubBrandMasterActionTypes.LOAD_SUB_BRAND_DETAILS_BY_BRAND_CODE_SUCCESS;
  constructor(public payload: BrandMaster) { }
}

export class LoadSubrandDetailsByBrandCodeFailure implements Action {
  readonly type =
    SubBrandMasterActionTypes.LOAD_SUB_BRAND_DETAILS_BY_BRAND_CODE_FAILURE;
  constructor(public payload: CustomErrors) { }
}
export class SearchSubBrandByBrandCode implements Action {
  readonly type = SubBrandMasterActionTypes.SEARCH_SUB_BRAND_BY_BRAND_CODE;
  constructor(public payload: SearchPayload) { }
}
export class SearchSubBrandByBrandCodeSuccess implements Action {
  readonly type =
    SubBrandMasterActionTypes.SEARCH_SUB_BRAND_BY_BRAND_CODE_SUCCESS;
  constructor(public payload: BrandListing) { }
}

export class SearchSubBrandByBrandCodeFailure implements Action {
  readonly type =
    SubBrandMasterActionTypes.SEARCH_SUB_BRAND_BY_BRAND_CODE_FAILURE;
  constructor(public payload: CustomErrors) { }
}

export type SubBrandMasterActions =
  | LoadSubBrandListing
  | LoadSubBrandListingSuccess
  | LoadSubBrandListingFailure
  | LoadReset
  | UpdateSubBrandMasterDetails
  | UpdateSubBrandMasterDetailsFailure
  | UpdateSubBrandMasterDetailsSuccess
  | SaveSubBrandMasterDetails
  | SaveSubBrandMasterDetailsSuccess
  | SaveSubBrandMasterDetailsFailure
  | LoadSubrandDetailsByBrandCode
  | LoadSubrandDetailsByBrandCodeSuccess
  | LoadSubrandDetailsByBrandCodeFailure
  | SearchSubBrandByBrandCode
  | SearchSubBrandByBrandCodeSuccess
  | SearchSubBrandByBrandCodeFailure
  | UpdateIsActiveSuccess
  | UpdateIsActiveFailure
  | UpdateIsActive
  | LoadParenBrands
  | LoadParenBrandsSuccess
  | LoadParenBrandsFailure
  | ResetIsActiveToggle;
