import { createSelector } from '@ngrx/store';
import { selectComplexityCodeState } from './complexity-code.reducer';

const selectcomplexityCodeList = createSelector(
  selectComplexityCodeState,
  state => state.compexityCodeList
);

const selectTotalElements = createSelector(
  selectComplexityCodeState,
  state => state.totalElements
);
const selectIsloading = createSelector(
  selectComplexityCodeState,
  state => state.isLoading
);

const selectError = createSelector(
  selectComplexityCodeState,
  state => state.error
);

const selectComplexityCode = createSelector(
  selectComplexityCodeState,
  state => state.complexityCode
);
const selectHasSaved = createSelector(
  selectComplexityCodeState,
  state => state.hasSaved
);
const selectHasUpdated = createSelector(
  selectComplexityCodeState,
  state => state.hasUpdated
);

export const complexityCodeSelector = {
  selectComplexityCode,
  selectcomplexityCodeList,
  selectTotalElements,
  selectIsloading,
  selectError,
  selectHasSaved,
  selectHasUpdated
};
