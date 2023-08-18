import { createSelector } from '@ngrx/store';
import { metalTypeSelector } from './metal-type.entity';
import { selectMetalTypeState } from './metal-type.reducer';

export const metalTypeList = createSelector(
  selectMetalTypeState,
  state => state.metalTypeList
);

const selectMetalTypeList = createSelector(
  metalTypeList,
  metalTypeSelector.selectAll
);

const selectTotalElements = createSelector(
  selectMetalTypeState,
  state => state.totalElements
);
const selectHasError = createSelector(
  selectMetalTypeState,
  state => state.error
);
const selectIsloading = createSelector(
  selectMetalTypeState,
  state => state.isLoading
);
const selectMetalType = createSelector(
  selectMetalTypeState,
  state => state.metalType
);

const selectHasUpdated = createSelector(
  selectMetalTypeState,
  state => state.hasUpdated
);
const selectHasSaved = createSelector(
  selectMetalTypeState,
  state => state.hasSaved
);

const selectMaterialTypeLov = createSelector(
  selectMetalTypeState,
  state => state.materialTypeLov
);

export const MetalTypeSelctors = {
  selectMetalTypeList,
  selectTotalElements,
  selectHasError,
  selectIsloading,
  selectMetalType,
  selectHasSaved,
  selectHasUpdated,
  selectMaterialTypeLov
};
