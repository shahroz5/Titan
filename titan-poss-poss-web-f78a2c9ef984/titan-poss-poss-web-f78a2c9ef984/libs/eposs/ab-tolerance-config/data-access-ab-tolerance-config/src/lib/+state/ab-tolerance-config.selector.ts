import { createSelector } from '@ngrx/store';
import { selectAbToleranceConfigState } from './ab-tolerance-config.reducer';

const selectAbToleranceConfigList = createSelector(
  selectAbToleranceConfigState,
  state => state.abToleranceConfigList
);
const selectAbToleranceConfig = createSelector(
  selectAbToleranceConfigState,
  state => state.abToleranceConfig
);

const selectTotalElements = createSelector(
  selectAbToleranceConfigState,
  state => state.totalElements
);

const selectIsloading = createSelector(
  selectAbToleranceConfigState,
  state => state.isLoading
);
const selectError = createSelector(
  selectAbToleranceConfigState,
  state => state.error
);

const selectHasSaved = createSelector(
  selectAbToleranceConfigState,
  state => state.hasSaved
);
const selectHasUpdated = createSelector(
  selectAbToleranceConfigState,
  state => state.hasUpdated
);

const selectResidualWeightRanges = createSelector(
  selectAbToleranceConfigState,
  state => state.rangeWeight
);

const selectToleranceConfigMapping = createSelector(
  selectAbToleranceConfigState,
  state => state.toleranceConfigMapping
);
const selectConfigId = createSelector(
  selectAbToleranceConfigState,
  state => state.configId
);
const selectIsCleared = createSelector(
  selectAbToleranceConfigState,
  state => state.isCleared
);
const selectMetalTypes = createSelector(
  selectAbToleranceConfigState,
  state => state.metalType
);
const selectUniqueNameCheckCount = createSelector(
  selectAbToleranceConfigState,
  state => state.uniqueNameCheckCount
);
const selectRuleDetailsTotalCount = createSelector(
  selectAbToleranceConfigState,
  state => state.ruleDetailsCount
);

export const AbToleranceConfigSelectors = {
  selectAbToleranceConfigList,
  selectAbToleranceConfig,
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
