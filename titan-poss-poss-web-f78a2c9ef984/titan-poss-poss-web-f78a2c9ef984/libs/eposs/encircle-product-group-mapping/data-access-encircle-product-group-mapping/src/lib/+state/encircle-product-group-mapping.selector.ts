import { createSelector } from '@ngrx/store';
import { selectEncircleProdcutGroupMappingState } from './encircle-product-group-mapping.reducer';

const selectError = createSelector(
  selectEncircleProdcutGroupMappingState,
  state => state.error
);
const selectIsLoading = createSelector(
  selectEncircleProdcutGroupMappingState,
  state => state.isLoading
);
const selectSelectedProductGroups = createSelector(
  selectEncircleProdcutGroupMappingState,
  state => state.selectedProductGroups
);
const selectHasSaved = createSelector(
  selectEncircleProdcutGroupMappingState,
  state => state.hasSaved
);
const selectHasRemoved = createSelector(
  selectEncircleProdcutGroupMappingState,
  state => state.hasRemoved
);
const selectProductGroups = createSelector(
  selectEncircleProdcutGroupMappingState,
  state => state.productGroups
);
const selectTotalElements = createSelector(
  selectEncircleProdcutGroupMappingState,
  state => state.totalElements
);
const selectAllSelectedProductGroups = createSelector(
  selectEncircleProdcutGroupMappingState,
  state => state.allSelectedGroups
);
export const EncircleProductGroupMappingSelectors = {
  selectError,
  selectIsLoading,
  selectSelectedProductGroups,
  selectHasSaved,
  selectHasRemoved,
  selectProductGroups,
  selectTotalElements,
  selectAllSelectedProductGroups
};
