import { createSelector } from '@ngrx/store';
import { selectCnValidationState } from './cn-validation.reducer';

const selectCnValidationList = createSelector(
  selectCnValidationState,
  state => state.cnValidationList
);

const selectCnTypeList = createSelector(
  selectCnValidationState,
  state => state.cnTypeList
);

const selectCnValidation = createSelector(
  selectCnValidationState,
  state => state.cnValidation
);

const selectError = createSelector(
  selectCnValidationState,
  state => state.error
);
const selectIsLoading = createSelector(
  selectCnValidationState,
  state => state.isLoading
);
const selectHassaved = createSelector(
  selectCnValidationState,
  state => state.hasSaved
);
const selectHasUpdated = createSelector(
  selectCnValidationState,
  state => state.hasUpdated
);
const selectTotalElement = createSelector(
  selectCnValidationState,
  state => state.totalElements
);

export const cnValidationSelectors = {
  selectCnValidationList,
  selectCnValidation,
  selectError,
  selectHasUpdated,
  selectHassaved,
  selectIsLoading,
  selectTotalElement,
  selectCnTypeList
};
