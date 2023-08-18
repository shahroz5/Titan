import { Action } from '@ngrx/store';
import {
  CustomErrors,
  FOCBlockingLocationLevelSavePayload,
  FOCBlockingLocationLevelListPayload,
  FOCBlockingLocaionLevelListResponse,
  FOCBlockingLocationLevel,
  CourierSelectedLocations
} from '@poss-web/shared/models';
export enum FOCBLLActionTypes {
  SAVE_FOC_BLL_DETAILS = '[foc-blocking-location-level]Save FOC BLL Details',
  SAVE_FOC_BLL_DETAILS_SUCCESS = '[foc-blocking-location-level]Save FOC BLL Details Success',
  SAVE_FOC_BLL_DETAILS_FAILURE = '[foc-blocking-location-level]Save FOC BlL Details Failure',

  LOAD_FOC_BLL_DETAILS = '[foc-blocking-location-level]Load FOC BLL Details',
  LOAD_FOC_BLL_DETAILS_SUCCESS = '[foc-blocking-location-level]Load FOC BLL Details Success',
  LOAD_FOC_BLL_DETAILS_FAILURE = '[foc-blocking-location-level]Load FOC BLL Details Failure',

  SEARCH_LOCATION = '[foc-blocking-location-level]Search Location',
  SEARCH_LOCATION_SUCCESS = '[foc-blocking-location-level]Search Location Success',
  SEARCH_LOCATION_FAILURE = '[foc-blocking-location-level]Search Location Failure',

  LOAD_FOC_SCHEMES = '[foc-blocking-location-level]Load FOC Schemes',
  LOAD_FOC_SCHEMES_SUCCEESS = '[foc-blocking-location-level]Load FOC Schemes Success',
  LOAD_FOC_SCHEMES_FAILURE = '[foc-blocking-location-level]Load FOC Schemes Failure',
  RESET_FOC_BLL_DETAILS = '[foc-blocking-location-level]Reset FOC BLL Details',

  LOAD_SELECTED_LOCATIONS = '[foc-blocking-location-level]Load Selected Locations',
  LOAD_SELECTED_LOCATIONS_SUCCESS = '[foc-blocking-location-level]Load Selected Locations Success',
  LOAD_SELECTED_LOCATIONS_FAILURE = '[foc-blocking-location-level]Load Selected Locations Failure'
}
export class SaveFOCBLLDetails implements Action {
  readonly type = FOCBLLActionTypes.SAVE_FOC_BLL_DETAILS;
  constructor(public payload: FOCBlockingLocationLevelSavePayload) {}
}
export class SaveFOCBLLDetailsSuccess implements Action {
  readonly type = FOCBLLActionTypes.SAVE_FOC_BLL_DETAILS_SUCCESS;
  //constructor(public payload: PayerBanksPayload) {}
}
export class SaveFOCBLLDetailsFailure implements Action {
  readonly type = FOCBLLActionTypes.SAVE_FOC_BLL_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadFOCBLLDetails implements Action {
  readonly type = FOCBLLActionTypes.LOAD_FOC_BLL_DETAILS;
  constructor(public payload: FOCBlockingLocationLevelListPayload) {}
}
export class LoadFOCBLLDetailsSuccess implements Action {
  readonly type = FOCBLLActionTypes.LOAD_FOC_BLL_DETAILS_SUCCESS;
  constructor(public payload: FOCBlockingLocaionLevelListResponse) {}
}
export class LoadFOCBLLDetailsFailure implements Action {
  readonly type = FOCBLLActionTypes.LOAD_FOC_BLL_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SearchLocation implements Action {
  readonly type = FOCBLLActionTypes.SEARCH_LOCATION;
  constructor(public payload: { schemeId: string; locationCode: string }) {}
}
export class SearchLocationSuccess implements Action {
  readonly type = FOCBLLActionTypes.SEARCH_LOCATION_SUCCESS;
  constructor(public payload: FOCBlockingLocationLevel[]) {}
}
export class SearchLocationFailure implements Action {
  readonly type = FOCBLLActionTypes.SEARCH_LOCATION_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadFOCSchemes implements Action {
  readonly type = FOCBLLActionTypes.LOAD_FOC_SCHEMES;
  constructor(public payload: string) {}
}
export class LoadFOCSchemesSuccess implements Action {
  readonly type = FOCBLLActionTypes.LOAD_FOC_SCHEMES_SUCCEESS;
  constructor(public payload: string) {}
}
export class LoadFOCSchemesFailure implements Action {
  readonly type = FOCBLLActionTypes.LOAD_FOC_SCHEMES_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class ResetFocBllDetails implements Action {
  readonly type = FOCBLLActionTypes.RESET_FOC_BLL_DETAILS;
}

export class LoadSelectedLocations implements Action {
  readonly type = FOCBLLActionTypes.LOAD_SELECTED_LOCATIONS;
  constructor(public payload: FOCBlockingLocationLevelListPayload) {}
}
export class LoadSelectedLocationsSuccess implements Action {
  readonly type = FOCBLLActionTypes.LOAD_SELECTED_LOCATIONS_SUCCESS;
  constructor(public payload: CourierSelectedLocations[]) {}
}
export class LoadSelectedLocationsFailure implements Action {
  readonly type = FOCBLLActionTypes.LOAD_SELECTED_LOCATIONS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export type FOCBLLActions =
  | SaveFOCBLLDetails
  | SaveFOCBLLDetailsSuccess
  | SaveFOCBLLDetailsFailure
  | LoadFOCBLLDetails
  | LoadFOCBLLDetailsSuccess
  | LoadFOCBLLDetailsFailure
  | SearchLocation
  | SearchLocationSuccess
  | SearchLocationFailure
  | LoadFOCSchemes
  | LoadFOCSchemesSuccess
  | LoadFOCSchemesFailure
  | ResetFocBllDetails
  | LoadSelectedLocations
  | LoadSelectedLocationsSuccess
  | LoadSelectedLocationsFailure;
