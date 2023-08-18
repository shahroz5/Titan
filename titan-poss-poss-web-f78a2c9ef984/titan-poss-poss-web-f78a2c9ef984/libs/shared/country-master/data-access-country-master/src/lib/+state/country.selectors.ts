import { createSelector } from '@ngrx/store';
import { selectCountryState } from './country.reducer';

const selectCountryDetailsListing = createSelector(
  selectCountryState,
  state => state.countryListing
);

const selectTotalCountryDetailsCount = createSelector(
  selectCountryState,
  state => state.totalCountryDetails
);

const selectCountryDetailsByCountryCode = createSelector(
  selectCountryState,
  state => state.countryDetails
);

const selectIsLoading = createSelector(
  selectCountryState,
  state => state.isLoading
);

const selectError = createSelector(selectCountryState, state => state.error);

const selectSaveCountryFormResponse = createSelector(
  selectCountryState,
  state => state.saveCountryResponses
);

const selectEditCountryFormResponse = createSelector(
  selectCountryState,
  state => state.editCountryResponses
);

// const selectCountryName = createSelector(
//   selectCountryState,
//   state => state.countryName
// )

const selectCurrencyCode = createSelector(
  selectCountryState,
  state => state.currencyCode
);
const selectTimeFormats = createSelector(
  selectCountryState,
  state => state.timeFormats
);
const selectDateFormats = createSelector(
  selectCountryState,
  state => state.dateFormats
);

export const CountrySelectors = {
  selectCountryDetailsListing,
  selectCountryDetailsByCountryCode,
  selectIsLoading,
  selectError,
  selectTotalCountryDetailsCount,
  selectSaveCountryFormResponse,
  selectEditCountryFormResponse,
  // selectCountryName,
  selectCurrencyCode,
  selectTimeFormats,
  selectDateFormats
};
