import { createSelector } from '@ngrx/store';
import { selectFOCBCLState } from './foc-bcl.reducer';
const selectError = createSelector(selectFOCBCLState, state => state.error);
const selectIsLoading = createSelector(
  selectFOCBCLState,
  state => state.isLoading
);
const selectHasSaved = createSelector(
  selectFOCBCLState,
  state => state.hasSaved
);

const selectSchemeId = createSelector(
  selectFOCBCLState,
  state => state.schemeId
);

const selectFOCBCLDetails = createSelector(
  selectFOCBCLState,
  state => state.focBlockingCustomerLevel
);
const selectTotalElements = createSelector(
  selectFOCBCLState,
  state => state.totalElements
);
const selectSelectedLocations = createSelector(
  selectFOCBCLState,
  state => state.selectedLocations
);
export const FOCBCLSelectors = {
  selectError,
  selectHasSaved,
  selectIsLoading,
  selectSchemeId,
  selectFOCBCLDetails,
  selectTotalElements,
  selectSelectedLocations
};
