import { createFeatureSelector } from '@ngrx/store';
import { LocationSettingsState } from './location-settings.state';
import {
  LocationSettingsActions,
  LocationSettingsActionTypes
} from './location-settings.actions';

export const LOCATION_SETTINGS_FEATURE_KEY = 'locationSettings';
export const selectLocationSettingsState = createFeatureSelector<
  LocationSettingsState
>(LOCATION_SETTINGS_FEATURE_KEY);

/**
 * The initial state of the store
 */
export const initialState: LocationSettingsState = {
  locationSettingsData: null,
  error: null
};

/**
 * The reducer function which manipulates the store for respective Action
 */
export function LocationSettingsReducer(
  state: LocationSettingsState = initialState,
  action: LocationSettingsActions
): LocationSettingsState {
  switch (action.type) {
    case LocationSettingsActionTypes.LOAD_LOCATION_SETTINGS:
      return {
        ...state,
        locationSettingsData: null,
        error: null
      };
    case LocationSettingsActionTypes.LOAD_LOCATION_SETTINGS_SUCCESS:
      return {
        ...state,

        locationSettingsData: action.payload,
        error: null
      };
    case LocationSettingsActionTypes.LOAD_LOCATION_SETTINGS_FAILURE:
      return {
        ...state,
        locationSettingsData: null,
        error: action.payload
      };
    default:
      return state;
  }
}
