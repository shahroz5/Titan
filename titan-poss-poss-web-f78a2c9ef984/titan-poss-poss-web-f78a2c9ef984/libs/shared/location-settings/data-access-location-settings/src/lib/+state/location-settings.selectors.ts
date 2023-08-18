import { createSelector } from '@ngrx/store';
import { selectLocationSettingsState } from './location-settings.reducer';

/**
 * The selectors for Location-Settings store
 */

const selectLocationSettings = createSelector(
  selectLocationSettingsState,
  state => state.locationSettingsData
);

const selectError = createSelector(
  selectLocationSettingsState,
  state => state.error
);

export const LocationSettingsSelectors = {
  selectLocationSettings,
  selectError
};
