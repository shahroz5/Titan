import { createSelector } from '@ngrx/store';
import { selectProductCategoryState } from './pc-mapping.reducer';

const selectProductCategory = createSelector(
  selectProductCategoryState,
  state => state.productCategory
);

const selectError = createSelector(
  selectProductCategoryState,
  state => state.error
);

const selectIsloading = createSelector(
  selectProductCategoryState,
  state => state.isLoading
);

export const ProductCategoryMappingSelectors = {
  selectProductCategory,
  selectError,
  selectIsloading
};
