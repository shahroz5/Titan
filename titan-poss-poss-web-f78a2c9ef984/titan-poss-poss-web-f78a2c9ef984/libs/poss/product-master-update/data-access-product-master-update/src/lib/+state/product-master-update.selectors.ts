import { state } from '@angular/animations';
import { createSelector } from '@ngrx/store';
import { selectProductMasterUpdateState } from './product-master-update.reducers';

const selectError = createSelector(
  selectProductMasterUpdateState,
  state => state.errors
);

const selectIsLoading = createSelector(
  selectProductMasterUpdateState,
  state => state.isLoading
);

const selectProductMasterUpdateResponse = createSelector(
  selectProductMasterUpdateState,
  state => state.updateResponse
);

export const ProductMasterUpdateSelectors = {
  selectError,
  selectIsLoading,
  selectProductMasterUpdateResponse
};
