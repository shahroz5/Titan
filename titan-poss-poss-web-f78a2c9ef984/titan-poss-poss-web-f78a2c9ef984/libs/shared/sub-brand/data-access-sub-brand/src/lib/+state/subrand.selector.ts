import { createSelector } from '@ngrx/store';
import { subBrandSelector } from './subbrand.entity';
import { selectSubBrandMaster } from './subbrand.reducers';

export const subBrandList = createSelector(
  selectSubBrandMaster,
  state => state.subBrandList
);
const selectsubBrandList = createSelector(
  subBrandList,
  subBrandSelector.selectAll
);

const selectTotalElements = createSelector(
  selectSubBrandMaster,
  state => state.totalElements
);
const selectBrandDetails = createSelector(
  selectSubBrandMaster,
  state => state.subBrandDetails
);

const selectSubBrandDetails = createSelector(
  selectSubBrandMaster,
  state => state.subBrandDetails
);
const selectIsLoading = createSelector(
  selectSubBrandMaster,
  state => state.isLoading
);
const selectIsActiveToggle = createSelector(
  selectSubBrandMaster,
  state => state.isActiveUpdated
);

const selecthasError = createSelector(
  selectSubBrandMaster,
  state => state.error
);

const selectHasUpdated = createSelector(
  selectSubBrandMaster,
  state => state.hasUpdated
);

const selectHasSaved = createSelector(
  selectSubBrandMaster,
  state => state.hasSaved
);
const selectParentBrandList = createSelector(
  selectSubBrandMaster,
  state => state.parentBrands
);
export const subBrandMasterSelectors = {
  selectsubBrandList,
  selectTotalElements,
  selectBrandDetails,
  selecthasError,
  selectIsLoading,
  selectHasSaved,
  selectHasUpdated,
  selectSubBrandDetails,
  selectParentBrandList,
  selectIsActiveToggle
};
