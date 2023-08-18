import { createSelector } from '@ngrx/store';
import { selectIbtConfigurationState } from './ibt-configuration.reducer';

const selectIbtConfigList = createSelector(
  selectIbtConfigurationState,
  state => state.ibtConfigList
);

const selectIbtConfig = createSelector(
  selectIbtConfigurationState,
  state => state.ibtConfiguration
);

const selectError = createSelector(
  selectIbtConfigurationState,
  state => state.error
);
const selectIsLoading = createSelector(
  selectIbtConfigurationState,
  state => state.isLoading
);
const selectHassaved = createSelector(
  selectIbtConfigurationState,
  state => state.hasSaved
);
const selectHasUpdated = createSelector(
  selectIbtConfigurationState,
  state => state.hasUpdated
);
const selectTotalElement = createSelector(
  selectIbtConfigurationState,
  state => state.totalElements
);

export const ibtConfigurationSelectors = {
  selectIbtConfigList,
  selectIbtConfig,
  selectError,
  selectHasUpdated,
  selectHassaved,
  selectIsLoading,
  selectTotalElement
};
