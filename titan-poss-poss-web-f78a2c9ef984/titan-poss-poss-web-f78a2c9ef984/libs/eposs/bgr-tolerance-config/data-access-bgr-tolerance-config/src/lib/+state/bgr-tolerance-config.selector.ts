import { createSelector } from '@ngrx/store';
import { selectBgrToleranceConfigState } from './bgr-tolerance-config.reducer';

const selectBgrToleranceConfigList = createSelector(
  selectBgrToleranceConfigState,
  state => state.bgrToleranceConfigList
);
const selectBgrToleranceConfig = createSelector(
  selectBgrToleranceConfigState,
  state => state.bgrToleranceConfig
);

const selectTotalElements = createSelector(
  selectBgrToleranceConfigState,
  state => state.totalElements
);

const selectIsloading = createSelector(
  selectBgrToleranceConfigState,
  state => state.isLoading
);
const selectError = createSelector(
  selectBgrToleranceConfigState,
  state => state.error
);

const selectHasSaved = createSelector(
  selectBgrToleranceConfigState,
  state => state.hasSaved
);
const selectHasUpdated = createSelector(
  selectBgrToleranceConfigState,
  state => state.hasUpdated
);

const selectResidualWeightRanges = createSelector(
  selectBgrToleranceConfigState,
  state => state.rangeWeight
);

const selectToleranceConfigMapping = createSelector(
  selectBgrToleranceConfigState,
  state => state.toleranceConfigMapping
);
const selectConfigId = createSelector(
  selectBgrToleranceConfigState,
  state => state.configId
);
const selectIsCleared = createSelector(
  selectBgrToleranceConfigState,
  state => state.isCleared
);
const selectMetalTypes = createSelector(
  selectBgrToleranceConfigState,
  state => state.metalType
);
const selectConfigIdInValidationSlabFailure = createSelector(
  selectBgrToleranceConfigState,
  state => state.configIdInSlabValidationFailure
);
export const BgrToleranceConfigSelectors = {
  selectBgrToleranceConfigList,
  selectBgrToleranceConfig,
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
  selectConfigIdInValidationSlabFailure
};
