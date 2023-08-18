import { createSelector } from '@ngrx/store';
import { selectBodEodState } from './bod-eod.reducer';

const selectError = createSelector(selectBodEodState, state => state.errors);

const selectIsLoading = createSelector(
  selectBodEodState,
  state => state.isLoading
);

const selectCurrentDayBodStatus = createSelector(
  selectBodEodState,
  state => state.currentDayBodStatus
);
const selectOpenBusinessDate = createSelector(selectBodEodState, state =>
  state.openBusinessDate === -1 ? null : state.openBusinessDate
);
const selectOpenBusinessDateForGuard = createSelector(
  selectBodEodState,
  state => state.openBusinessDate
);
const selectIsGoldRateAvailable = createSelector(
  selectBodEodState,
  state => state.isGoldRateAvailable
);
const selectGoldRate = createSelector(selectBodEodState, state =>
  state.availableMetalRates
    ? state.availableMetalRates.goldRate
      ? state.availableMetalRates.goldRate
      : null
    : null
);
const selectEodBusinessDate = createSelector(
  selectBodEodState,
  state => state.eodBusinessDate
);
const selectLatestBusinessDate = createSelector(
  selectBodEodState,
  state => state.latestBusinessDate
);

const selectBodEodStatus = createSelector(
  selectBodEodState,
  state => state.bodEodStatus
);
const selectFiscalYear = createSelector(
  selectBodEodState,
  state => state.fiscalYear
);

export const bodEodSelectors = {
  selectError,
  selectIsLoading,
  selectCurrentDayBodStatus,
  selectOpenBusinessDate,
  selectOpenBusinessDateForGuard,
  selectIsGoldRateAvailable,
  selectGoldRate,
  selectEodBusinessDate,
  selectLatestBusinessDate,
  selectBodEodStatus,
  selectFiscalYear
};
