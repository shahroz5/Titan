import { Action } from '@ngrx/store';
import { CustomErrors, LocationSettingDetails } from '@poss-web/shared/models';

/**
 * The interface for Action payload
 */

/**
 * The  enum defined for  list of actions for location settings
 */
export enum LocationSettingsActionTypes {
  LOAD_LOCATION_SETTINGS = '[ Location-settings ] Load location settings',
  LOAD_LOCATION_SETTINGS_SUCCESS = '[ Location-settings ] Load location settings Success',
  LOAD_LOCATION_SETTINGS_FAILURE = '[ Location-settings ] Load location settings Failure'
}
/**
 * location settings Actions
 */
export class LoadLocationSettings implements Action {
  readonly type = LocationSettingsActionTypes.LOAD_LOCATION_SETTINGS;
  constructor(
    public payload: {
      isBTQUser: boolean;
      countryName: string;
    }
  ) {}
}

export class LoadLocationSettingsSuccess implements Action {
  readonly type = LocationSettingsActionTypes.LOAD_LOCATION_SETTINGS_SUCCESS;
  constructor(public payload: LocationSettingDetails) {}
}

export class LoadLocationSettingsFailure implements Action {
  readonly type = LocationSettingsActionTypes.LOAD_LOCATION_SETTINGS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type LocationSettingsActions =
  | LoadLocationSettings
  | LoadLocationSettingsSuccess
  | LoadLocationSettingsFailure;
