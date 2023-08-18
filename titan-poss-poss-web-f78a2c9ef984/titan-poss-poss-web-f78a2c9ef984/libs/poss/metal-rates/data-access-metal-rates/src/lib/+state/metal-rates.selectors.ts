import { createSelector } from '@ngrx/store';
import { selectMetalRatesState } from './metal-rates.reducer';

const selectError = createSelector(
  selectMetalRatesState,
  state => state.errors
);

const selectIsLoading = createSelector(
  selectMetalRatesState,
  state => state.isLoading
);
const selectIsGoldRateAvailableForBusinessDay = createSelector(
  selectMetalRatesState,
  state => state.goldRateAvailableForBusinessDay
);
const selectBodBusinessDate = createSelector(
  selectMetalRatesState,
  state => state.bodBusinessDate
);
const selectEodBusinessDate = createSelector(
  selectMetalRatesState,
  state => state.eodBusinessDate
);
const selectIsMetalRatesUpdatedInBoutique = createSelector(
  selectMetalRatesState,
  state => state.metalRatesUpdatedInBoutique
);

export const metalRatesSelectors = {
  selectError,
  selectIsLoading,
  selectIsGoldRateAvailableForBusinessDay,
  selectBodBusinessDate,
  selectEodBusinessDate,
  selectIsMetalRatesUpdatedInBoutique
};
