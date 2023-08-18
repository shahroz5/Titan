import { createSelector } from '@ngrx/store';
import { selectCourierDetailsState } from './courier-details.reducer';
const selectCourierDetailsListing = createSelector(
  selectCourierDetailsState,
  state => state.courierDetailsListing
);
const selectTotalCourierDetailsCount = createSelector(
  selectCourierDetailsState,
  state => state.totalCourierDetails
);
const selectCourierDetailsBasedOnCourierName = createSelector(
  selectCourierDetailsState,
  state => state.courierDetails
);

const selectHasSaved = createSelector(
  selectCourierDetailsState,
  state => state.hasSaved
);
const selectHasUpdated = createSelector(
  selectCourierDetailsState,
  state => state.hasUpdated
);
const selectError = createSelector(
  selectCourierDetailsState,
  state => state.error
);

const selectHasSearched = createSelector(
  selectCourierDetailsState,
  state => state.hasSearched
);
const selectSelectedLocations = createSelector(
  selectCourierDetailsState,
  state => state.selectedLocations
);
const selectHasLocationsUpdated = createSelector(
  selectCourierDetailsState,
  state => state.hasLocationsUpdated
);
const selecIsLoadingCourierDetails = createSelector(
  selectCourierDetailsState,
  state => state.isLoading
);
const selectCountry = createSelector(
  selectCourierDetailsState,
  state => state.country
);
const selectStates = createSelector(
  selectCourierDetailsState,
  state => state.states
);

export const CourierDetailsSelectors = {
  selectCourierDetailsListing,
  selectTotalCourierDetailsCount,
  selectCourierDetailsBasedOnCourierName,
  selectHasSaved,
  selectHasUpdated,
  selectError,
  selectHasSearched,
  selectSelectedLocations,
  selectHasLocationsUpdated,
  selecIsLoadingCourierDetails,
  selectCountry,
  selectStates
};
