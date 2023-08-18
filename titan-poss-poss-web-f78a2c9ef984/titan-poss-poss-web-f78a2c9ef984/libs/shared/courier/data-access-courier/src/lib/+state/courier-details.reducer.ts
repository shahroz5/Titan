import {
  CourierDetailsActionTypes,
  CourierDetailsActions
} from './courier-details.actions';
import { CourierDetailsState } from './courier-details.state';
import { createFeatureSelector } from '@ngrx/store';
export const initialState: CourierDetailsState = {
  courierDetailsListing: null,
  totalCourierDetails: 0,
  courierDetails: null,
  error: null,
  isSaving: null,
  hasSaved: null,
  hasUpdated: null,
  hasSearched: false,
  selectedLocations: null,
  hasLocationsUpdated: null,
  country: null,
  states: null,
  isLoading: null
};
export const COURIER_DETAILS_FEATURE_KEY = 'courierDetails';
export const selectCourierDetailsState = createFeatureSelector<
  CourierDetailsState
>(COURIER_DETAILS_FEATURE_KEY);
export function CourierDetailsReducer(
  state: CourierDetailsState = initialState,
  action: CourierDetailsActions
): CourierDetailsState {
  switch (action.type) {
    case CourierDetailsActionTypes.LOAD_COURIER_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        courierDetailsListing: action.payload.courierDetailsListing,
        totalCourierDetails: action.payload.totalElements
      };
    case CourierDetailsActionTypes.LOAD_COURIER_DETAILS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    case CourierDetailsActionTypes.LOAD_COURIER_DETAILS_BASED_ON_COURIERNAME_SUCCESS:
      return {
        ...state,
        courierDetails: action.payload,
        isLoading: false
      };
    case CourierDetailsActionTypes.LOAD_COURIER_DETAILS_BASED_ON_COURIERNAME_FAILURE:
    case CourierDetailsActionTypes.SELECTED_LOCATIONS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    case CourierDetailsActionTypes.RESET_COURIER_DETAILS:
      return {
        ...state,
        courierDetails: null,
        hasSaved: null,
        hasUpdated: null,
        error: null,
        hasSearched: null,
        hasLocationsUpdated: null,
        selectedLocations: []
      };
    case CourierDetailsActionTypes.SAVE_COURIER_DETAILS:
      return {
        ...state,
        isLoading: true,
        hasSaved: false
      };
    case CourierDetailsActionTypes.SAVE_COURIER_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasSaved: true,
        courierDetails: action.payload
      };
    case CourierDetailsActionTypes.SAVE_COURIER_DETAILS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        hasSaved: false
      };
    case CourierDetailsActionTypes.UPDATE_COURIER_DETAILS:
      return {
        ...state,
        isLoading: true,
        hasUpdated: false
      };
    case CourierDetailsActionTypes.UPDATE_COURIER_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasUpdated: true,
        courierDetails: action.payload
      };
    case CourierDetailsActionTypes.UPDATE_COURIER_DETAILS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        hasUpdated: false
      };
    case CourierDetailsActionTypes.SEARCH_COURIER_NAME:
      return {
        ...state,
        hasSearched: false,
        isLoading: true
      };
    case CourierDetailsActionTypes.SEARCH_COURIER_NAME_SUCCESS:
      return {
        ...state,
        hasSearched: true,
        courierDetailsListing: action.payload,
        totalCourierDetails: 0,
        isLoading: false
      };
    case CourierDetailsActionTypes.SEARCH_COURIER_NAME_FAILURE:
      return {
        ...state,
        hasSearched: false,
        error: action.payload,
        courierDetailsListing: null,
        totalCourierDetails: null,
        isLoading: false
      };
    case CourierDetailsActionTypes.UPDATE_COURIER_STATUS: {
      return { ...state, hasUpdated: false, error: null, isLoading: true };
    }
    case CourierDetailsActionTypes.UPDATE_COURIER_STATUS_SUCCESS: {
      return { ...state, hasUpdated: true, error: null, isLoading: false };
    }
    case CourierDetailsActionTypes.UPDATE_COURIER_STATUS_FAILURE: {
      return {
        ...state,
        hasUpdated: false,
        error: action.payload,
        isLoading: false
      };
    }

    case CourierDetailsActionTypes.SELECTED_LOCATIONS_SUCCEESS:
      return {
        ...state,
        selectedLocations: action.payload,
        isLoading: false
      };

    case CourierDetailsActionTypes.LOCATION_MAPPING:
      return {
        ...state,
        hasLocationsUpdated: false,
        isLoading: true,
        error: null
      };
    case CourierDetailsActionTypes.LOCATION_MAPPING_FAILURE:
      return {
        ...state,
        hasLocationsUpdated: false,
        isLoading: false,
        error: action.payload
      };
    case CourierDetailsActionTypes.LOCATION_MAPPING_SUCCESS:
      return {
        ...state,
        hasLocationsUpdated: true,
        isLoading: false,
        error: null
      };
  }
  switch (action.type) {
    case CourierDetailsActionTypes.LOAD_COURIER_DETAILS:
    case CourierDetailsActionTypes.LOAD_COURIER_DETAILS_BASED_ON_COURIERNAME:
    case CourierDetailsActionTypes.LOAD_COUNTRY:
    case CourierDetailsActionTypes.LOAD_STATES:
    case CourierDetailsActionTypes.SELECTED_LOCATIONS:
      return {
        ...state,
        error: null,
        isLoading: true
      };

    case CourierDetailsActionTypes.LOAD_COUNTRY_SUCCESS:
      return {
        ...state,
        country: action.payload,
        isLoading: false
      };
    case CourierDetailsActionTypes.LOAD_STATES_SUCCESS:
      return {
        ...state,
        states: action.payload,
        isLoading: false
      };
    case CourierDetailsActionTypes.LOAD_COUNTRY_FAILURE:
    case CourierDetailsActionTypes.LOAD_STATES_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
  }
  return state;
}
