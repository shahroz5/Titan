import { createSelector } from '@ngrx/store';
import { selectAmendmentConfigState } from './amendment-config.reducer';

const selectAmendmentConfiguration = createSelector(
  selectAmendmentConfigState,
  state => state.amendmentConfigValue
);
const selectError = createSelector(
  selectAmendmentConfigState,
  state => state.error
);
const selectIsLoading = createSelector(
  selectAmendmentConfigState,
  state => state.isLoading
);
const selectHasUpdated = createSelector(
  selectAmendmentConfigState,
  state => state.hasUpdated
);
export const AmendmentConfigurationSelectors = {
  selectAmendmentConfiguration,
  selectIsLoading,
  selectHasUpdated,
  selectError
};
