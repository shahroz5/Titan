import { createSelector } from '@ngrx/store';
import { tepValidationConfigSelector } from './tep-validation-config.entity';
import { selectTepValidationConfig } from './tep-validation-config.reducer';

export const tepValidationConfigList = createSelector(
  selectTepValidationConfig,
  state => state.tepValidationConfiglist
);

const selectTepValidationConfiglist = createSelector(
  tepValidationConfigList,
  tepValidationConfigSelector.selectAll
);

const selectTotalElements = createSelector(
  selectTepValidationConfig,
  state => state.totalElements
);

const selectTotalMappingElements = createSelector(
  selectTepValidationConfig,
  state => state.totalElements
);

const selectTepValidationConfigDetails = createSelector(
  selectTepValidationConfig,
  state => state.tepValidationConfigDetails
);
const selectIsLoading = createSelector(
  selectTepValidationConfig,
  state => state.isLoading
);
const selectError = createSelector(
  selectTepValidationConfig,
  state => state.error
);
const selectHasSaved = createSelector(
  selectTepValidationConfig,
  state => state.hasSaved
);
const selectHasUpdated = createSelector(
  selectTepValidationConfig,
  state => state.hasUpdated
);

export const tepValidationConfigSelectors = {
  selectTepValidationConfiglist,
  selectTotalElements,
  selectTepValidationConfigDetails,
  selectTotalMappingElements,
  selectError,
  selectIsLoading,
  selectHasSaved,
  selectHasUpdated
};
