import { createSelector } from '@ngrx/store';
import { selectItemState } from './item.reducer';

const selectItemDetailsListing = createSelector(
  selectItemState,
  state => state.itemListing
);

const selectTotalItemDetailsCount = createSelector(
  selectItemState,
  state => state.totalItemDetails
);

const selectItemDetailsByItemCode = createSelector(
  selectItemState,
  state => state.itemDetails
);

const selectIsLoading = createSelector(
  selectItemState,
  state => state.isLoading
);
const selectItemStones = createSelector(
  selectItemState,
  state => state.itemStones
);
const selectPricingTypes = createSelector(
  selectItemState,
  state => state.pricingType
);
const selectCFAproductCode = createSelector(
  selectItemState,
  state => state.CFAproductCode
);
const selectItemFilter = createSelector(
  selectItemState,
  state => state.filterPayload
);
const selectError = createSelector(selectItemState, state => state.error);

export const ItemSelectors = {
  selectItemDetailsListing,
  selectItemDetailsByItemCode,
  selectIsLoading,
  selectError,
  selectTotalItemDetailsCount,
  selectItemStones,
  selectItemFilter,
  selectPricingTypes,
  selectCFAproductCode
};
