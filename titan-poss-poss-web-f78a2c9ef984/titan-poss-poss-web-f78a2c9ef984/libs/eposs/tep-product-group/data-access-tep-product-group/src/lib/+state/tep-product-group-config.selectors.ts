import { createSelector } from '@ngrx/store';
import {
  tepProductGroupConfigSelector,
  tepProductGroupMappingSelector
} from './tep-product-group-config.entity';
import { selectTepProductGroupConfig } from './tep-product-group-config.reducer';

export const tepProductGroupConfigList = createSelector(
  selectTepProductGroupConfig,
  state => state.tepProductGroupConfiglist
);

const selectTepProductGroupConfiglist = createSelector(
  tepProductGroupConfigList,
  tepProductGroupConfigSelector.selectAll
);

export const tepProductGroupMappinglist = createSelector(
  selectTepProductGroupConfig,
  state => state.tepProductGroupMappinglist
);

const selectTepProductGroupMappinglist = createSelector(
  tepProductGroupMappinglist,
  tepProductGroupMappingSelector.selectAll
);

const selectTotalElements = createSelector(
  selectTepProductGroupConfig,
  state => state.totalElements
);

const selectTotalMappingElements = createSelector(
  selectTepProductGroupConfig,
  state => state.totalMappingElements
);

const selectTepProductGroupConfigDetails = createSelector(
  selectTepProductGroupConfig,
  state => state.tepProductGroupConfigDetails
);
const selectIsLoading = createSelector(
  selectTepProductGroupConfig,
  state => state.isLoading
);
const selectError = createSelector(
  selectTepProductGroupConfig,
  state => state.error
);
const selectHasSaved = createSelector(
  selectTepProductGroupConfig,
  state => state.hasSaved
);
const selectHasUpdated = createSelector(
  selectTepProductGroupConfig,
  state => state.hasUpdated
);

export const tepProductGroupConfigSelectors = {
  selectTepProductGroupConfiglist,
  selectTotalElements,
  selectTepProductGroupConfigDetails,
  selectTepProductGroupMappinglist,
  selectTotalMappingElements,
  selectError,
  selectIsLoading,
  selectHasSaved,
  selectHasUpdated
};
