import { Action } from '@ngrx/store';
import {
  CourierSelectedLocations,
  CustomErrors,
  FOCBCLListingPayload,
  FOCBlockingCustomerLevel,
  FOCBlockingCustomerLevelListResponse,
} from '@poss-web/shared/models';
export enum FOCBCLActionTypes {
  SAVE_FOC_BCL_DETAILS = '[foc-blocking-cust-level]Save FOC BCL Details',
  SAVE_FOC_BCL_DETAILS_SUCCESS = '[foc-blocking-cust-level]Save FOC BCL Details Success',
  SAVE_FOC_BCL_DETAILS_FAILURE = '[foc-blocking-cust-level]Save FOC BCL Details Failure',

  SEARCH_LOCATION = '[foc-blocking-cust-level]Search Location',
  SEARCH_LOCATION_SUCCESS = '[foc-blocking-cust-level]Search Location Success',
  SEARCH_LOCATION_FAILURE = '[foc-blocking-cust-level]Search Location Failure',

  LOAD_FOC_BCL_DETAILS = '[foc-blocking-cust-level]Load FOC BCL Details',
  LOAD_FOC_BCL_DETAILS_SUCCESS = '[foc-blocking-cust-level]Load FOC BCL Details Success',
  LOAD_FOC_BCL_DETAILS_FAILURE = '[foc-blocking-cust-level]Load FOC BCL Details Failure',

  LOAD_FOC_SCHEMES = '[foc-blocking-cust-level]Load FOC Schemes',
  LOAD_FOC_SCHEMES_SUCCEESS = '[foc-blocking-cust-level]Load FOC Schemes Success',
  LOAD_FOC_SCHEMES_FAILURE = '[foc-blocking-cust-level]Load FOC Schemes Failure',

  RESET_FOC_BCL_DETAILS = '[foc-blocking-cust-level]Reset FOCBCL Details',

  LOAD_SELECTED_LOCATIONS = '[foc-blocking-cust-level]Load Selected Locations',
  LOAD_SELECTED_LOCATIONS_SUCCESS = '[foc-blocking-cust-level]Load Selected Locations Success',
  LOAD_SELECTED_LOCATIONS_FAILURE = '[foc-blocking-cust-level]Load Selected Locations Failure'
}
export class SaveFOCBCLDetails implements Action {
  readonly type = FOCBCLActionTypes.SAVE_FOC_BCL_DETAILS;
  constructor(public payload: any) {}
}
export class SaveFOCBCLDetailsSuccess implements Action {
  readonly type = FOCBCLActionTypes.SAVE_FOC_BCL_DETAILS_SUCCESS;
}
export class SaveFOCBCLDetailsFailure implements Action {
  readonly type = FOCBCLActionTypes.SAVE_FOC_BCL_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SearchLocation implements Action {
  readonly type = FOCBCLActionTypes.SEARCH_LOCATION;
  constructor(public payload: { schemeId: string; locationCode: string }) {}
}
export class SearchLocationSuccess implements Action {
  readonly type = FOCBCLActionTypes.SEARCH_LOCATION_SUCCESS;
  constructor(public payload: FOCBlockingCustomerLevel[]) {}
}
export class SearchLocationFailure implements Action {
  readonly type = FOCBCLActionTypes.SEARCH_LOCATION_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadFOCBCLDetails implements Action {
  readonly type = FOCBCLActionTypes.LOAD_FOC_BCL_DETAILS;
  constructor(public payload: FOCBCLListingPayload) {}
}
export class LoadFOCBCLDetailsSuccess implements Action {
  readonly type = FOCBCLActionTypes.LOAD_FOC_BCL_DETAILS_SUCCESS;
  constructor(public payload: FOCBlockingCustomerLevelListResponse) {}
}
export class LoadFOCBCLDetailsFailure implements Action {
  readonly type = FOCBCLActionTypes.LOAD_FOC_BCL_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class LoadFOCSchemes implements Action {
  readonly type = FOCBCLActionTypes.LOAD_FOC_SCHEMES;
  constructor(public payload: string) {}
}
export class LoadFOCSchemesSuccess implements Action {
  readonly type = FOCBCLActionTypes.LOAD_FOC_SCHEMES_SUCCEESS;
  constructor(public payload: string) {}
}
export class LoadFOCSchemesFailure implements Action {
  readonly type = FOCBCLActionTypes.LOAD_FOC_SCHEMES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class ResetFocBclDetails implements Action {
  readonly type = FOCBCLActionTypes.RESET_FOC_BCL_DETAILS;
}

export class LoadSelectedLocations implements Action {
  readonly type = FOCBCLActionTypes.LOAD_SELECTED_LOCATIONS;
  constructor(public payload: FOCBCLListingPayload) {}
}
export class LoadSelectedLocationsSuccess implements Action {
  readonly type = FOCBCLActionTypes.LOAD_SELECTED_LOCATIONS_SUCCESS;
  constructor(public payload: CourierSelectedLocations[]) {}
}
export class LoadSelectedLocationsFailure implements Action {
  readonly type = FOCBCLActionTypes.LOAD_SELECTED_LOCATIONS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export type FOCBCLActions =
  | SaveFOCBCLDetails
  | SaveFOCBCLDetailsSuccess
  | SaveFOCBCLDetailsFailure
  | SearchLocation
  | SearchLocationSuccess
  | SearchLocationFailure
  | LoadFOCBCLDetails
  | LoadFOCBCLDetailsSuccess
  | LoadFOCBCLDetailsFailure
  | LoadFOCSchemes
  | LoadFOCSchemesSuccess
  | LoadFOCSchemesFailure
  | ResetFocBclDetails
  | LoadSelectedLocations
  | LoadSelectedLocationsSuccess
  | LoadSelectedLocationsFailure;
