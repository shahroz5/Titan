import { Action } from '@ngrx/store';

import {
  CustomErrors,
  VendorMasterListPayload,
  VendorMasterListing,
  UpdateVendorMasterPayload,
  VendorMaster
} from '@poss-web/shared/models';

export const enum VendorMasterActionTypes {
  LOAD_VENDOR_MASTER_LISTING = '[vendor master] Load Vendor master Listing',
  LOAD_VENDOR_MASTER_LISTING_SUCCESS = '[vendor master] Load Vendor master Listing Success',
  LOAD_VENDOR_MASTER_LISTING_FAILURE = '[vendor master] Load Vendor master Listing Failure',

  LOAD_VENDOR_MASTER_BY_CODE = '[vendor master] Load Vendor master By Code ',
  LOAD_VENDOR_MASTER_BY_CODE_SUCCESS = '[vendor master] Load Vendor master By  Code  Success',
  LOAD_VENDOR_MASTER_BY_CODE_FAILURE = '[vendor master] Load Vendor master By  Code  Failure',

  SEARCH_VENDOR_MASTER_BY_CODE = '[vendor master] Search Vendor master By Code Code',
  SEARCH_VENDOR_MASTER_BY_CODE_SUCCESS = '[vendor master]  Search Vendor master By Code Code Success',
  SEARCH_VENDOR_MASTER_BY_CODE_FAILURE = '[vendor master]  Search Vendor master By Code Code Failure',

  LOAD_RESET = '[vendor master] Load Reset'
}

export class LoadReset implements Action {
  readonly type = VendorMasterActionTypes.LOAD_RESET;
}

export class LoadVendorMasterByCode implements Action {
  readonly type = VendorMasterActionTypes.LOAD_VENDOR_MASTER_BY_CODE;
  constructor(public payload: string) {}
}

export class LoadVendorMasterByCodeSuccess implements Action {
  readonly type = VendorMasterActionTypes.LOAD_VENDOR_MASTER_BY_CODE_SUCCESS;
  constructor(public payload: VendorMaster) {}
}

export class LoadVendorMasterByCodeFailure implements Action {
  readonly type = VendorMasterActionTypes.LOAD_VENDOR_MASTER_BY_CODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadVendorMasterList implements Action {
  readonly type = VendorMasterActionTypes.LOAD_VENDOR_MASTER_LISTING;
  constructor(public payload: VendorMasterListPayload) {}
}

export class LoadVendorMasterListSuccess implements Action {
  readonly type = VendorMasterActionTypes.LOAD_VENDOR_MASTER_LISTING_SUCCESS;
  constructor(public payload: VendorMasterListing) {}
}

export class LoadVendorMasterListFailure implements Action {
  readonly type = VendorMasterActionTypes.LOAD_VENDOR_MASTER_LISTING_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class SearchVendorMasterByCode implements Action {
  readonly type = VendorMasterActionTypes.SEARCH_VENDOR_MASTER_BY_CODE;
  constructor(public payload: string) {}
}

export class SearchVendorMasterByCodeSuccess implements Action {
  readonly type = VendorMasterActionTypes.SEARCH_VENDOR_MASTER_BY_CODE_SUCCESS;
  constructor(public payload: VendorMasterListing) {}
}

export class SearchVendorMasterByCodeFailure implements Action {
  readonly type = VendorMasterActionTypes.SEARCH_VENDOR_MASTER_BY_CODE_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type VendorMasterCodeActions =
  | LoadVendorMasterList
  | LoadVendorMasterListFailure
  | LoadVendorMasterListSuccess
  | LoadVendorMasterByCode
  | LoadVendorMasterByCodeSuccess
  | LoadVendorMasterByCodeFailure
  | SearchVendorMasterByCode
  | SearchVendorMasterByCodeFailure
  | SearchVendorMasterByCodeSuccess
  | LoadReset;
