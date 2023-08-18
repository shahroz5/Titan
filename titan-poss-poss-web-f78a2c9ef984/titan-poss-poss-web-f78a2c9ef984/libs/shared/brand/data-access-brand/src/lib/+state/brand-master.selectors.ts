import { createSelector } from '@ngrx/store';
import { brandSelector } from './brand-master.entity';
import { selectBrandMaster } from './brand-master.reducer';

export const brandList = createSelector(
  selectBrandMaster,
  state => state.brandlist
);
const selectBrandList = createSelector(brandList, brandSelector.selectAll);

const selectTotalElements = createSelector(selectBrandMaster, state => state.totalElements);
const selectBrandDetails = createSelector(selectBrandMaster, state => state.brandDetails);
const selectIsLoading = createSelector(selectBrandMaster, state => state.isLoading);
const selectError = createSelector(selectBrandMaster, state => state.error);
const selectHasSaved = createSelector(selectBrandMaster, state => state.hasSaved);

export const brandMasterSelectors = {
  selectBrandList,
  selectTotalElements,
  selectBrandDetails,
  selectError,
  selectIsLoading,
  selectHasSaved,
};
