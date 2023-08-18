import { createSelector } from '@ngrx/store';
import { selectRangeState } from './range.reducer';

const selectError = createSelector(selectRangeState, state => state.error);
const selectIsLoading = createSelector(
  selectRangeState,
  state => state.isLoading
);

const selectHasSaved = createSelector(
  selectRangeState,
  state => state.hasSaved
);

const selectRangeTypes = createSelector(
  selectRangeState,
  state => state.rangeTypes
);

const selectRanges = createSelector(selectRangeState, state => state.ranges);

export const RangeSelectors = {
  selectRanges,
  selectHasSaved,
  selectIsLoading,
  selectError,
  selectRangeTypes
};
