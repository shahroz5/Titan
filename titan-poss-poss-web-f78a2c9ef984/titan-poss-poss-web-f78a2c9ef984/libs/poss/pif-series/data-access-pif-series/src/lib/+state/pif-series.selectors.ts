import { createSelector } from '@ngrx/store';
import { selectPIFSeriesState } from './pif-series.reducer';

const selectError = createSelector(selectPIFSeriesState, state => state.error);
const selectIsLoading = createSelector(
  selectPIFSeriesState,
  state => state.isLoading
);
const selectPIFSeries = createSelector(
  selectPIFSeriesState,
  state => state.pifSeries
);
const selectTotalElements = createSelector(
  selectPIFSeriesState,
  state => state.totalElements
);
const selectHasSaved = createSelector(
  selectPIFSeriesState,
  state => state.hasSaved
);
export const PIFSeriesSelectors = {
  selectError,
  selectIsLoading,
  selectPIFSeries,
  selectTotalElements,
  selectHasSaved
};
