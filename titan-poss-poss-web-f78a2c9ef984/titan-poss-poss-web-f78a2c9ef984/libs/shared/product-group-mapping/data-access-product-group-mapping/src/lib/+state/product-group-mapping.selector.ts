import { createSelector } from '@ngrx/store';
import { selectProductGroupMappingState } from './product-group-mapping.reducer';

const selectProductGroups = createSelector(
  selectProductGroupMappingState,
  state => state.productGroups
);

const selectError = createSelector(
  selectProductGroupMappingState,
  state => state.error
);

const selectIsloading = createSelector(
  selectProductGroupMappingState,
  state => state.isLoading
);

export const ProductGroupMappingSelectors = {
  selectProductGroups,
  selectError,
  selectIsloading
};
