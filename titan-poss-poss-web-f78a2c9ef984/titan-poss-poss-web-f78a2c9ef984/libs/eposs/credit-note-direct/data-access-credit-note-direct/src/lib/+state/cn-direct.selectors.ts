import { createSelector } from '@ngrx/store';
import { selectCnDirectState } from './cn-direct.reducer';

const selectIsLoading = createSelector(
  selectCnDirectState,
  state => state.isLoading
);
const selectError = createSelector(selectCnDirectState, state => state.error);

const selectHasUpdated = createSelector(
  selectCnDirectState,
  state => state.hasUpdated
);
const selectCnList = createSelector(selectCnDirectState, state => state.cnList);
const selectTotalElements = createSelector(
  selectCnDirectState,
  state => state.totalElements
);
export const cnDirectSelector = {
  selectCnList,
  selectIsLoading,
  selectError,
  selectHasUpdated,
  selectTotalElements
};
