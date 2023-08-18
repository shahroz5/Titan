import { createSelector } from '@ngrx/store';
import { selectCnPriorityConfigState } from './cn-priority-config.reducer';

const selectCnPriorityConfigList = createSelector(
  selectCnPriorityConfigState,
  state => state.cnPriorityConfigList
);

const selectCnPriorityConfig = createSelector(
  selectCnPriorityConfigState,
  state => state.cnPriorityConfig
);

const selectCnTypeList = createSelector(
  selectCnPriorityConfigState,
  state => state.cnTypeList
);

const selectError = createSelector(
  selectCnPriorityConfigState,
  state => state.error
);
const selectIsLoading = createSelector(
  selectCnPriorityConfigState,
  state => state.isLoading
);
const selectHassaved = createSelector(
  selectCnPriorityConfigState,
  state => state.hasSaved
);
const selectHasUpdated = createSelector(
  selectCnPriorityConfigState,
  state => state.hasUpdated
);
const selectTotalElement = createSelector(
  selectCnPriorityConfigState,
  state => state.totalElements
);

export const cnPriorityConfigSelectors = {
  selectCnPriorityConfigList,
  selectCnPriorityConfig,
  selectError,
  selectHasUpdated,
  selectHassaved,
  selectIsLoading,
  selectTotalElement,
  selectCnTypeList
};
