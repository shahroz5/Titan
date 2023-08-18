import { Action } from '@ngrx/store';
import { LovMasterType, CustomErrors, LoadLovListingSuccessPayload, LovMaster, LovMasterTypeMain } from '@poss-web/shared/models';


export enum LovActionTypes {
  LOAD_LOV_TYPES = '[Load-Lov-Details] Load Lov Types',
  LOAD_LOV_TYPES_SUCCESS = '[Load-Lov-Details] Load Lov Types Success',
  LOAD_LOV_TYPES_FAILURE = '[Load-Lov-Details] Load Lov Types Failure',
  NO_LOVTYPE_LISTING = '[Load-Lov-Details] Load Lov With No Types',

  LOAD_LOV_LISTING = '[Load-Lov-Details] Load Lov Listing',
  LOAD_LOV_LISTING_SUCCESS = '[Load-Lov-Details] Load Lov Listing Success',
  LOAD_LOV_LISTING_FAILURE = '[Load-Lov-Details] Load Lov Listing Failure',

  LOAD_LOV_DETAILS = '[Load-Lov-Details] Load Lov Details',
  LOAD_LOV_DETAILS_SUCCESS = '[Load-Lov-Details] Load Lov Details Success',
  LOAD_LOV_DETAILS_FAILURE = '[Load-Lov-Details] Load Lov Details Failure',

  SAVE_LOV_TOWN = '[Load-Lov-Details] Save Lov Details',
  SAVE_LOV_TOWN_SUCCESS = '[Load-Lov-Details] Save Lov Details Success',
  SAVE_LOV_TOWN_FAILURE = '[Load-Lov-Details] Save Lov Details Failure',

  EDIT_LOV_TOWN = '[Load-Lov-Details] Edit Lov Details',
  EDIT_LOV_TOWN_SUCCESS = '[Load-Lov-Details] Edit Lov Details Success',
  EDIT_LOV_TOWN_FAILURE = '[Load-Lov-Details] Edit Lov Details Failure',

  ACTIVE_LOV_SWITCH = '[Load-Lov-Details] Active Lov Details',
  ACTIVE_LOV_SWITCH_SUCCESS = '[Load-Lov-Details] Active Lov Details Success',
  ACTIVE_LOV_SWITCH_FAILURE = '[Load-Lov-Details] Active Lov Details Failure',

  RESET_LOV_DIALOG_DATA = '[Load-Lov-Details] Reset ProductCategory Dialog Data',

  LOAD_LOV_TYPES_MAIN = '[Load-Lov-Details] Load Lov Types Main',
  LOAD_LOV_TYPES_MAIN_SUCCESS = '[Load-Lov-Details] Load Lov Types Main Success',
  LOAD_LOV_TYPES_MAIN_FAILURE = '[Load-Lov-Details] Load Lov Types Main Failure',

}

export class LoadLovTypes implements Action {
  readonly type = LovActionTypes.LOAD_LOV_TYPES;
}
export class LoadLovTypesSuccess implements Action {
  readonly type = LovActionTypes.LOAD_LOV_TYPES_SUCCESS;
  constructor(public payload: LovMasterType[]) { }
}
export class LoadLovTypesFailure implements Action {
  readonly type = LovActionTypes.LOAD_LOV_TYPES_FAILURE;
  constructor(public payload: CustomErrors) { }
}

export class LoadLovTypesMain implements Action {
  readonly type = LovActionTypes.LOAD_LOV_TYPES_MAIN;
}
export class LoadLovTypesMainSuccess implements Action {
  readonly type = LovActionTypes.LOAD_LOV_TYPES_MAIN_SUCCESS;
  constructor(public payload: LovMasterTypeMain[]) { }
}
export class LoadLovTypesMainFailure implements Action {
  readonly type = LovActionTypes.LOAD_LOV_TYPES_MAIN_FAILURE;
  constructor(public payload: CustomErrors) { }
}

export class LoadLovListing implements Action {
  readonly type = LovActionTypes.LOAD_LOV_LISTING;
  constructor(public payload: string) { }
}
export class LoadLovListingSuccess implements Action {
  readonly type = LovActionTypes.LOAD_LOV_LISTING_SUCCESS;
  constructor(public payload: LoadLovListingSuccessPayload) { }
}
export class LoadLovListingFailure implements Action {
  readonly type = LovActionTypes.LOAD_LOV_LISTING_FAILURE;
  constructor(public payload: CustomErrors) { }
}

export class NoLovtypeListing implements Action {
  readonly type = LovActionTypes.NO_LOVTYPE_LISTING;
  constructor() { }
}

export class SaveLovFormDetails implements Action {
  readonly type = LovActionTypes.SAVE_LOV_TOWN;
  constructor(public payload: LovMaster) { }
}

export class SaveLovFormDetailsSuccess implements Action {
  readonly type = LovActionTypes.SAVE_LOV_TOWN_SUCCESS;
  constructor(public payload: LovMaster) { }
}

export class SaveLovFormDetailsFailure implements Action {
  readonly type = LovActionTypes.SAVE_LOV_TOWN_FAILURE;
  constructor(public payload: CustomErrors) { }
}

export class EditLovFormDetails implements Action {
  readonly type = LovActionTypes.EDIT_LOV_TOWN;
  constructor(public payload: LovMaster) { }
}

export class EditLovFormDetailsSuccess implements Action {
  readonly type = LovActionTypes.EDIT_LOV_TOWN_SUCCESS;
  constructor(public payload: LoadLovListingSuccessPayload) { }
}

export class EditLovFormDetailsFailure implements Action {
  readonly type = LovActionTypes.EDIT_LOV_TOWN_FAILURE;
  constructor(public payload: CustomErrors) { }
}

export class ResetLovMasterData implements Action {
  readonly type = LovActionTypes.RESET_LOV_DIALOG_DATA;
}


export type LovMasterActions =
  | LoadLovTypes
  | LoadLovTypesSuccess
  | LoadLovTypesFailure
  | LoadLovListing
  | LoadLovListingSuccess
  | LoadLovListingFailure
  | NoLovtypeListing
  | SaveLovFormDetails
  | SaveLovFormDetailsSuccess
  | SaveLovFormDetailsFailure
  | EditLovFormDetails
  | EditLovFormDetailsSuccess
  | EditLovFormDetailsFailure
  | ResetLovMasterData
  | LoadLovTypesMain
  | LoadLovTypesMainSuccess
  | LoadLovTypesMainFailure;
