import { createSelector } from '@ngrx/store';
import { stateSelector, countrySelector } from './state.entity';
import { selectStatesState } from './state.reducer';

export const selectStateDetailsListing = createSelector(
  selectStatesState,
  state => state.stateDetailsListing
);

const selectLoadedStatesListing = createSelector(
  selectStateDetailsListing,
  stateSelector.selectAll
);

const selectIsActiveToggle = createSelector(
  selectStatesState,
  state => state.isActiveUpdated
);

export const selectCountryDetailsListing = createSelector(
  selectStatesState,
  state => state.countryDetailsListing
);

const selectLoadedCountryListing = createSelector(
  selectCountryDetailsListing,
  countrySelector.selectAll
);

const selectTotalStateDetailsCount = createSelector(
  selectStatesState,
  state => state.totalStateDetails
);

const selectIsStateListingLoading = createSelector(
  selectStatesState,
  state => state.isLoading
);

const selectStateByStateCode = createSelector(
  selectStatesState,
  state => state.stateDetailsByStateCode
);

const selectSaveStateDetailsResponse = createSelector(
  selectStatesState,
  state => state.saveStateDetailsResponse
);

const selectEditStateDetailsResponse = createSelector(
  selectStatesState,
  state => state.editStateDetailsResponse
);

const selectError = createSelector(selectStatesState, state => state.error);

const selectIssearchElements = createSelector(
  selectStatesState,
  state => state.isSearchElements
);

export const StateSelectors = {
  selectLoadedStatesListing,
  selectStateDetailsListing,
  selectCountryDetailsListing,
  selectLoadedCountryListing,
  selectTotalStateDetailsCount,
  selectIsStateListingLoading,
  selectStateByStateCode,

  selectSaveStateDetailsResponse,
  selectEditStateDetailsResponse,
  selectError,
  selectIssearchElements,
  selectIsActiveToggle
};
