import { createSelector } from '@ngrx/store';
import { selectCurrencyState } from './currency.reducer';

const selectCurrencyDetailsListing = createSelector(
  selectCurrencyState,
  state => state.currencyListing
);

const selectTotalCurrencyDetailsCount = createSelector(
  selectCurrencyState,
  state => state.totalCurrencyDetails
);

const selectCurrencyDetailsByCurrencyCode = createSelector(
  selectCurrencyState,
  state => state.currencyDetails
);

const selectIsLoading = createSelector(
  selectCurrencyState,
  state => state.isLoading
);

const selectError = createSelector(selectCurrencyState, state => state.error);

const selectSaveCurrencyFormResponse = createSelector(
  selectCurrencyState,
  state => state.saveCurrency
);

const selectEditCurrencyFormResponse = createSelector(
  selectCurrencyState,
  state => state.editCurrency
);

export const CurrencySelectors = {
  selectCurrencyDetailsListing,
  selectTotalCurrencyDetailsCount,
  selectCurrencyDetailsByCurrencyCode,
  selectIsLoading,
  selectError,
  selectSaveCurrencyFormResponse,
  selectEditCurrencyFormResponse
};
