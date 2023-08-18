import { createSelector } from '@ngrx/store';

import { selectWeightToleranceState } from './weight-tolerance.reducer';

const selectError = createSelector(
  selectWeightToleranceState,
  state => state.error
);
const selectConfigList = createSelector(
  selectWeightToleranceState,
  state => state.configList
);
const selectTotalElements = createSelector(
  selectWeightToleranceState,
  state => state.totalElements
);
const selectConfigDetailsByconfigId = createSelector(
  selectWeightToleranceState,
  state => state.selectedConfigIdDetails
);

const selectWeightTolerance = createSelector(
  selectWeightToleranceState,
  state => state.weightTolerance
);

const selectRangeWeight = createSelector(
  selectWeightToleranceState,
  state => state.rangeWeight
);

const selecthasSaved = createSelector(
  selectWeightToleranceState,
  state => state.hasSaved
);

const selectIsupdated = createSelector(
  selectWeightToleranceState,
  state => state.hasUpdated
);

const selectConfigId = createSelector(
  selectWeightToleranceState,
  state => state.configId
);
const selectIsCleared = createSelector(
  selectWeightToleranceState,
  state => state.isCleared
);

const selectisLoading = createSelector(
  selectWeightToleranceState,
  state => state.isLoading
);

const selectProductGroups = createSelector(
  selectWeightToleranceState,
  state => state.productGroups
);

export const weightToleranceSelectors = {
  selectConfigList,
  selectTotalElements,
  selectConfigDetailsByconfigId,
  selectWeightTolerance,
  selectRangeWeight,
  selectConfigId,
  selecthasSaved,
  selectIsupdated,
  selectError,

  selectIsCleared,
  selectisLoading,

  selectProductGroups
};
