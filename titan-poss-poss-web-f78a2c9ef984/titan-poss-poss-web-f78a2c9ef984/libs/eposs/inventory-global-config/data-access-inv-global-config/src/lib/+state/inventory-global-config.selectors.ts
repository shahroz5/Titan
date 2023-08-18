import { createSelector } from '@ngrx/store';
import { selectInvGlobalConfigurationState } from './inventory-global-config.reducer';

const selectGlobalConfigurationList = createSelector(
  selectInvGlobalConfigurationState,
  state => state.invglobalConfigurationList
);

const selectGlobalConfiguration = createSelector(
  selectInvGlobalConfigurationState,
  state => state.invglobalConfigurationFiledValue
);
const selectError = createSelector(
  selectInvGlobalConfigurationState,
  state => state.error
);
const selectIsLoading = createSelector(
  selectInvGlobalConfigurationState,
  state => state.isLoading
);

const selectHasUpdated = createSelector(
  selectInvGlobalConfigurationState,
  state => state.hasUpdated
);

export const invglobalConfigurationSelectors = {
  selectGlobalConfiguration,
  selectHasUpdated,
  selectIsLoading,
  selectError,
  selectGlobalConfigurationList
};
