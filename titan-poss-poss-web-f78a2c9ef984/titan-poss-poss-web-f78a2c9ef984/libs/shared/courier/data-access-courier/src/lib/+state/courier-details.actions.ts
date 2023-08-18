import { Action } from '@ngrx/store';
import {
  LoadCourierDetailsListingPayload,
  LoadCourireDetailsListingSuccessPayload,
  CustomErrors,
  UpdateCourierDetailsPayload,
  LocationMappingPayload,
  CourierMaster,
  CountrySuccessPayload,
  StatesSuccessPayload,
  CourierDetailsListing,
  CourierSelectedLocations
} from '@poss-web/shared/models';
export enum CourierDetailsActionTypes {
  LOAD_COURIER_DETAILS = '[courierDetails] Load Courier Details',
  LOAD_COURIER_DETAILS_SUCCESS = '[CourierDetails] Load Courier Details Success',
  LOAD_COURIER_DETAILS_FAILURE = '[CourierDetails] Load Courier Details Failure',

  LOAD_COURIER_DETAILS_BASED_ON_COURIERNAME = '[CourierDetails] Load Courier Details Based On CorierName',
  LOAD_COURIER_DETAILS_BASED_ON_COURIERNAME_SUCCESS = '[CourierDetails] Load Courier Details Based On CourierName Success',
  LOAD_COURIER_DETAILS_BASED_ON_COURIERNAME_FAILURE = '[CourierDetails] Load Courier Details Based On CourierName Failure',

  RESET_COURIER_DETAILS = '[CourierDetails] Reset Courier Details',
  SAVE_COURIER_DETAILS = '[CourierDetails] Save Courier Details',
  SAVE_COURIER_DETAILS_SUCCESS = '[CourierDetails] Save Courier Details Success',
  SAVE_COURIER_DETAILS_FAILURE = '[CourierDetails] Save Courier Details Failure',

  UPDATE_COURIER_DETAILS = '[CourierDetails]Update Courier Details',
  UPDATE_COURIER_DETAILS_SUCCESS = '[CourierDetails]Update Courier Details Success',
  UPDATE_COURIER_DETAILS_FAILURE = '[CourierDetails]Update Courier Details Failure',

  SEARCH_COURIER_NAME = '[CourierDetails]Search Courier Name',
  SEARCH_COURIER_NAME_SUCCESS = '[CourierDetails]Search Courier Name Success',
  SEARCH_COURIER_NAME_FAILURE = '[CourierDetails]Search Courier Name Failure',

  UPDATE_COURIER_STATUS = '[CourierDetails]Update Courier Status',
  UPDATE_COURIER_STATUS_SUCCESS = '[CourierDetails]Update Courier Status Success',
  UPDATE_COURIER_STATUS_FAILURE = '[CourierDetails]Update Courier Status Failure',

  SELECTED_LOCATIONS = '[CourierDetails]Selected Locations',
  SELECTED_LOCATIONS_SUCCEESS = '[CourierDetails]Selected Locations Success',
  SELECTED_LOCATIONS_FAILURE = '[CourierDetails]Selected Locations Failure',

  LOCATION_MAPPING = '[CourierDetails]Location Mapping',
  LOCATION_MAPPING_SUCCESS = '[CourierDetails]Location Mapping Success',
  LOCATION_MAPPING_FAILURE = '[CourierDetails]Location Mapping Failure',

  LOAD_COUNTRY = '[CourierDetails] Load Country',
  LOAD_COUNTRY_SUCCESS = '[CourierDetails] Load Country Success',
  LOAD_COUNTRY_FAILURE = '[CourierDetails] Load Country Failure',

  LOAD_STATES = '[CourierDetails] Load States',
  LOAD_STATES_SUCCESS = '[CourierDetails] Load States Success',
  LOAD_STATES_FAILURE = '[CourierDetails] Load States Failure'
}
export class LoadCourierDetails implements Action {
  readonly type = CourierDetailsActionTypes.LOAD_COURIER_DETAILS;
  constructor(public payload: LoadCourierDetailsListingPayload) {}
}
export class LoadCourierDetailsSuccess implements Action {
  readonly type = CourierDetailsActionTypes.LOAD_COURIER_DETAILS_SUCCESS;
  constructor(public payload: LoadCourireDetailsListingSuccessPayload) {}
}
export class LoadCourierDetailsFailure implements Action {
  readonly type = CourierDetailsActionTypes.LOAD_COURIER_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadCourierDetailsBasedOnCourierName implements Action {
  readonly type =
    CourierDetailsActionTypes.LOAD_COURIER_DETAILS_BASED_ON_COURIERNAME;
  constructor(public payload: string) {}
}
export class LoadCourierDetailsBasedOnCourierNameSuccess implements Action {
  readonly type =
    CourierDetailsActionTypes.LOAD_COURIER_DETAILS_BASED_ON_COURIERNAME_SUCCESS;
  constructor(public payload: CourierMaster) {}
}
export class LoadCourierDetailsBasedOnCourierNameFailure implements Action {
  readonly type =
    CourierDetailsActionTypes.LOAD_COURIER_DETAILS_BASED_ON_COURIERNAME_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class ResetCourierDetails implements Action {
  readonly type = CourierDetailsActionTypes.RESET_COURIER_DETAILS;
}
export class SaveCourierDetails implements Action {
  readonly type = CourierDetailsActionTypes.SAVE_COURIER_DETAILS;
  constructor(public payload: CourierMaster) {}
}
export class SaveCourierDetailsSuccess implements Action {
  readonly type = CourierDetailsActionTypes.SAVE_COURIER_DETAILS_SUCCESS;
  constructor(public payload: CourierMaster) {}
}
export class SaveCourierDetailsFailure implements Action {
  readonly type = CourierDetailsActionTypes.SAVE_COURIER_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class UpdateCourierDetails implements Action {
  readonly type = CourierDetailsActionTypes.UPDATE_COURIER_DETAILS;
  constructor(public payload: UpdateCourierDetailsPayload) {}
}
export class UpdateCourierDetailsSuccess implements Action {
  readonly type = CourierDetailsActionTypes.UPDATE_COURIER_DETAILS_SUCCESS;
  constructor(public payload: CourierMaster) {}
}
export class UpdateCourierDetailsFailure implements Action {
  readonly type = CourierDetailsActionTypes.UPDATE_COURIER_DETAILS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SearchCourierName implements Action {
  readonly type = CourierDetailsActionTypes.SEARCH_COURIER_NAME;
  constructor(public payload: string) {}
}
export class SearchCourierNameSuccess implements Action {
  readonly type = CourierDetailsActionTypes.SEARCH_COURIER_NAME_SUCCESS;
  constructor(public payload: CourierDetailsListing[]) {}
}
export class SearchCourierNameFailure implements Action {
  readonly type = CourierDetailsActionTypes.SEARCH_COURIER_NAME_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class UpdateCourierStatus implements Action {
  readonly type = CourierDetailsActionTypes.UPDATE_COURIER_STATUS;
  constructor(public payload: { courierName: string; isActive: boolean }) {}
}
export class UpdateCourierStatusSuccess implements Action {
  readonly type = CourierDetailsActionTypes.UPDATE_COURIER_STATUS_SUCCESS;
}
export class UpdateCourierStatusFailure implements Action {
  readonly type = CourierDetailsActionTypes.UPDATE_COURIER_STATUS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class SelectedLocations implements Action {
  readonly type = CourierDetailsActionTypes.SELECTED_LOCATIONS;
  constructor(public payload: string) {}
}
export class SelectedLocationsSuccess implements Action {
  readonly type = CourierDetailsActionTypes.SELECTED_LOCATIONS_SUCCEESS;
  constructor(public payload: CourierSelectedLocations[]) {}
}
export class SelectedLocationsFailure implements Action {
  readonly type = CourierDetailsActionTypes.SELECTED_LOCATIONS_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LocationMapping implements Action {
  readonly type = CourierDetailsActionTypes.LOCATION_MAPPING;
  constructor(public payload: LocationMappingPayload) {}
}
export class LocationMappingSuccess implements Action {
  readonly type = CourierDetailsActionTypes.LOCATION_MAPPING_SUCCESS;
}
export class LocationMappingFailure implements Action {
  readonly type = CourierDetailsActionTypes.LOCATION_MAPPING_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadCountry implements Action {
  readonly type = CourierDetailsActionTypes.LOAD_COUNTRY;
}

export class LoadCountrySuccess implements Action {
  readonly type = CourierDetailsActionTypes.LOAD_COUNTRY_SUCCESS;
  constructor(public payload: CountrySuccessPayload[]) {}
}

export class LoadCountryFailure implements Action {
  readonly type = CourierDetailsActionTypes.LOAD_COUNTRY_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class LoadStates implements Action {
  readonly type = CourierDetailsActionTypes.LOAD_STATES;
  constructor(public payload: string) {}
}

export class LoadStatesSuccess implements Action {
  readonly type = CourierDetailsActionTypes.LOAD_STATES_SUCCESS;
  constructor(public payload: StatesSuccessPayload[]) {}
}

export class LoadStatesFailure implements Action {
  readonly type = CourierDetailsActionTypes.LOAD_STATES_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type CourierDetailsActions =
  | LoadCourierDetails
  | LoadCourierDetailsSuccess
  | LoadCourierDetailsFailure
  | LoadCourierDetailsBasedOnCourierName
  | LoadCourierDetailsBasedOnCourierNameSuccess
  | LoadCourierDetailsBasedOnCourierNameFailure
  | ResetCourierDetails
  | SaveCourierDetails
  | SaveCourierDetailsSuccess
  | SaveCourierDetailsFailure
  | UpdateCourierDetails
  | UpdateCourierDetailsSuccess
  | UpdateCourierDetailsFailure
  | SearchCourierName
  | SearchCourierNameSuccess
  | SearchCourierNameFailure
  | UpdateCourierStatus
  | UpdateCourierStatusSuccess
  | UpdateCourierStatusFailure
  | SelectedLocations
  | SelectedLocationsSuccess
  | SelectedLocationsFailure
  | LocationMapping
  | LocationMappingSuccess
  | LocationMappingFailure
  | LoadCountry
  | LoadCountrySuccess
  | LoadCountryFailure
  | LoadStates
  | LoadStatesSuccess
  | LoadStatesFailure;
