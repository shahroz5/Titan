import { createSelector } from '@ngrx/store';
import { selectResidualWeightConfigState } from './residual-weight-config.reducer';

const selectResidualWeightConfigList = createSelector(
  selectResidualWeightConfigState,
  state => state.residualWeightConfigList
);
const selectResidualWeightConfig = createSelector(
  selectResidualWeightConfigState,
  state => state.residualWeightConfig
);

const selectTotalElements = createSelector(
  selectResidualWeightConfigState,
  state => state.totalElements
);

const selectIsloading = createSelector(
  selectResidualWeightConfigState,
  state => state.isLoading
);
const selectError = createSelector(
  selectResidualWeightConfigState,
  state => state.error
);

const selectHasSaved = createSelector(
  selectResidualWeightConfigState,
  state => state.hasSaved
);
const selectHasUpdated = createSelector(
  selectResidualWeightConfigState,
  state => state.hasUpdated
);

const selectResidualWeightRanges = createSelector(
  selectResidualWeightConfigState,
  state => state.rangeWeight
);

const selectRangeMapping = createSelector(
  selectResidualWeightConfigState,
  state => state.rangeMapping
);
const selectConfigId = createSelector(
  selectResidualWeightConfigState,
  state => state.configId
);
const selectIsCleared = createSelector(
  selectResidualWeightConfigState,
  state => state.isCleared
);

const selectRuleDetailsCount = createSelector(
  selectResidualWeightConfigState,
  state => state.ruleDetailsCount
);

export const ResidualWeightConfigSelectors = {
  selectResidualWeightConfigList,
  selectResidualWeightConfig,
  selectTotalElements,
  selectIsloading,
  selectError,
  selectHasSaved,
  selectHasUpdated,
  selectResidualWeightRanges,
  selectRangeMapping,
  selectConfigId,
  selectIsCleared,
  selectRuleDetailsCount
};
