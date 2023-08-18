import { createSelector } from '@ngrx/store';
import { selectStoneState } from './stone.reducer';

const selectStoneDetailsListing = createSelector(
  selectStoneState,
  state => state.stoneListing
);

const selectTotalStoneDetailsCount = createSelector(
  selectStoneState,
  state => state.totalStoneDetails
);

const selectIsLoading = createSelector(
  selectStoneState,
  state => state.isLoading
);
const selectStoneFilter = createSelector(
  selectStoneState,
  state => state.stonefilter
);

const selectError = createSelector(selectStoneState, state => state.error);

export const StoneSelectors = {
  selectStoneDetailsListing,
  selectIsLoading,
  selectError,
  selectTotalStoneDetailsCount,
  selectStoneFilter
};
