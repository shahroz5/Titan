import { createSelector } from '@ngrx/store';
import { selectlocationMappingState } from './location-mapping.reducer';

const selectLocations = createSelector(
  selectlocationMappingState,
  state => state.locations
);

const selectBrands = createSelector(
  selectlocationMappingState,
  state => state.brands
);

const selectRegions = createSelector(
  selectlocationMappingState,
  state => state.regions
);

const selectLevels = createSelector(
  selectlocationMappingState,
  state => state.levels
);

const selectCountries = createSelector(
  selectlocationMappingState,
  state => state.countries
);

const selectStates = createSelector(
  selectlocationMappingState,
  state => state.states
);

const selectTowns = createSelector(
  selectlocationMappingState,
  state => state.towns
);

const selectActiveConfigs = createSelector(
  selectlocationMappingState,
  state => state.activeConfigs
);

const selectUpdateStatus = createSelector(
  selectlocationMappingState,
  state => state.updateStatus
);

const selectMappedLocations = createSelector(
  selectlocationMappingState,
  state => state.mappedLocations
);

const selectError = createSelector(
  selectlocationMappingState,
  state => state.error
);

export const LocationMappingSelectors = {
  selectLocations,
  selectBrands,
  selectRegions,
  selectLevels,
  selectCountries,
  selectStates,
  selectTowns,
  selectActiveConfigs,
  selectUpdateStatus,
  selectMappedLocations,
  selectError
};
