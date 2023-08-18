import { createSelector } from '@ngrx/store';
import { selectFOCBLLState } from './foc-bll.reducer';
const selectError = createSelector(selectFOCBLLState, state => state.error);
const selectIsLoading = createSelector(
  selectFOCBLLState,
  state => state.isLoading
);
const selectHasSaved = createSelector(
  selectFOCBLLState,
  state => state.hasSaved
);
const selectFOCSchemeId = createSelector(
  selectFOCBLLState,
  state => state.schemeId
);
const selectFOCBlockingDetails = createSelector(
  selectFOCBLLState,
  state => state.focBlockingDetails
);
const selectTotalElements = createSelector(
  selectFOCBLLState,
  state => state.totalElements
);
const selectSelectedLocations = createSelector(
  selectFOCBLLState,
  state => state.selectedLocations
);
export const FOCBLLSelectors = {
  selectError,
  selectHasSaved,
  selectIsLoading,
  selectFOCSchemeId,
  selectFOCBlockingDetails,
  selectTotalElements,
  selectSelectedLocations
};
