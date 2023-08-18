import { createSelector } from '@ngrx/store';
import { selectF2MarginState } from './f2-margin.reducer';

const selectf2MarginList = createSelector(
  selectF2MarginState,
  state => state.f2MarginList
);

const selectTotalElements = createSelector(
  selectF2MarginState,
  state => state.totalElements
);
const selectError = createSelector(selectF2MarginState, state => state.error);
const selectIsLoading = createSelector(
  selectF2MarginState,
  state => state.isLoading
);

export const f2MarginSelectors = {
  selectf2MarginList,
  selectTotalElements,
  selectIsLoading,
  selectError
};
