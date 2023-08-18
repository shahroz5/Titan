import { LocationMappingState } from './location-mapping.state';
import {
  LocationMappingActionTypes,
  LocationMappingActions
} from './location-mapping.actions';
import { createFeatureSelector } from '@ngrx/store';

export const LOCATION_MAPPING_FEATURE_KEY = 'locationMapping';

export const selectlocationMappingState = createFeatureSelector<
  LocationMappingState
>(LOCATION_MAPPING_FEATURE_KEY);

/**
 * The initial state of the store
 */
export const initialState: LocationMappingState = {
  locations: [],
  brands: [],
  regions: [],
  levels: [],
  countries: [],
  states: [],
  towns: [],
  mappedLocations: [],
  activeConfigs: [],
  updateStatus: null,
  error: null
};

/**
 * The reducer function which manipulates the store for respective Action
 */
export function LocationMappingReducer(
  state: LocationMappingState = initialState,
  action: LocationMappingActions
): LocationMappingState {
  switch (action.type) {
    case LocationMappingActionTypes.LOAD_ACTIVE_CONFIGS_SUCCESS:
      return {
        ...state,
        activeConfigs: action.payload
      };
    case LocationMappingActionTypes.SEARCH_LOCAITONS_SUCCESS:
      return {
        ...state,
        locations: action.payload
      };
    case LocationMappingActionTypes.SEARCH_LOCAITONS_FAILURE:
    case LocationMappingActionTypes.LOAD_BRANDS_FAILURE:
    case LocationMappingActionTypes.LOAD_REGIONS_FAILURE:
    case LocationMappingActionTypes.LOAD_LEVELS_FAILURE:
    case LocationMappingActionTypes.LOAD_COUNTRIES_FAILURE:
    case LocationMappingActionTypes.LOAD_STATES_FAILURE:
    case LocationMappingActionTypes.LOAD_TOWNS_FAILURE:
    case LocationMappingActionTypes.LOAD_ACTIVE_CONFIGS_FAILURE:
    case LocationMappingActionTypes.UPDATE_LOCATION_MAPPING_FAILURE:
    case LocationMappingActionTypes.LOAD_MAPPED_LOCATIONS_FAILURE:
      return {
        ...state,
        error: action.payload
      };
    case LocationMappingActionTypes.CLEAR:
      return {
        ...state,
        locations: [],
        brands: [],
        regions: [],
        levels: [],
        countries: [],
        states: [],
        towns: [],
        error: null,
        updateStatus: null,
        mappedLocations: [],
        activeConfigs: []
      };
    case LocationMappingActionTypes.LOAD_BRANDS_SUCCESS:
      return {
        ...state,
        brands: action.payload
      };

    case LocationMappingActionTypes.LOAD_REGIONS_SUCCESS:
      return {
        ...state,
        regions: action.payload
      };

    case LocationMappingActionTypes.LOAD_LEVELS_SUCCESS:
      return {
        ...state,
        levels: action.payload
      };

    case LocationMappingActionTypes.LOAD_COUNTRIES_SUCCESS:
      return {
        ...state,
        countries: action.payload
      };

    case LocationMappingActionTypes.LOAD_STATES_SUCCESS:
      return {
        ...state,
        states: action.payload
      };

    case LocationMappingActionTypes.LOAD_TOWNS_SUCCESS:
      return {
        ...state,
        towns: action.payload
      };

    case LocationMappingActionTypes.UPDATE_LOCATION_MAPPING:
      return {
        ...state,
        updateStatus: null
      };
    case LocationMappingActionTypes.UPDATE_LOCATION_MAPPING_SUCCESS:
      return {
        ...state,
        updateStatus: {
          isSuccess: true
        }
      };

    case LocationMappingActionTypes.LOAD_MAPPED_LOCATIONS:
      return {
        ...state,
        mappedLocations: []
      };
    case LocationMappingActionTypes.LOAD_MAPPED_LOCATIONS_SUCCESS:
      return {
        ...state,
        mappedLocations: action.payload
      };
    case LocationMappingActionTypes.RESET_MAPPED_LOCATIONS:
      return {
        ...state,
        mappedLocations: []
      };
    case LocationMappingActionTypes.RESET_ACTIVE_CONFIGS:
      return {
        ...state,
        activeConfigs: []
      };

    default:
      return state;
  }
}
