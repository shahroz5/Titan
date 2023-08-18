import { createSelector } from '@ngrx/store';
import { selectCoToleranceConfigState } from './co-tolerance-config.reducer';

const selectCoToleranceConfigList = createSelector(
  selectCoToleranceConfigState,
  state => state.coToleranceConfigList
);
const selectCoToleranceConfig = createSelector(
  selectCoToleranceConfigState,
  state => state.coToleranceConfig
);

const selectTotalElements = createSelector(
  selectCoToleranceConfigState,
  state => state.totalElements
);

const selectIsloading = createSelector(
  selectCoToleranceConfigState,
  state => state.isLoading
);
const selectError = createSelector(
  selectCoToleranceConfigState,
  state => state.error
);

const selectHasSaved = createSelector(
  selectCoToleranceConfigState,
  state => state.hasSaved
);
const selectHasUpdated = createSelector(
  selectCoToleranceConfigState,
  state => state.hasUpdated
);

const selectResidualWeightRanges = createSelector(
  selectCoToleranceConfigState,
  state => state.rangeWeight
);

const selectToleranceConfigMapping = createSelector(
  selectCoToleranceConfigState,
  state => state.toleranceConfigMapping
);
const selectConfigId = createSelector(
  selectCoToleranceConfigState,
  state => state.configId
);
const selectIsCleared = createSelector(
  selectCoToleranceConfigState,
  state => state.isCleared
);
const selectMetalTypes = createSelector(
  selectCoToleranceConfigState,
  state => state.metalType
);
const selectUniqueNameCheckCount = createSelector(
  selectCoToleranceConfigState,
  state => state.uniqueNameCheckCount
);
const selectRuleDetailsTotalCount = createSelector(
  selectCoToleranceConfigState,
  state => state.ruleDetailsCount
);

export const CoToleranceConfigSelectors = {
  selectCoToleranceConfigList,
  selectCoToleranceConfig,
  selectTotalElements,
  selectIsloading,
  selectError,
  selectHasSaved,
  selectHasUpdated,
  selectResidualWeightRanges,
  selectToleranceConfigMapping,
  selectConfigId,
  selectIsCleared,
  selectMetalTypes,
  selectUniqueNameCheckCount,
  selectRuleDetailsTotalCount
};
