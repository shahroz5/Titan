import { createSelector } from '@ngrx/store';
import { selectCFAProductCodeState } from './cfa-product-code.reducer';
const selectCFAProductCodeListing = createSelector(
  selectCFAProductCodeState,
  state => state.CFAProductCodeListing
);
const selectTotalElements = createSelector(
  selectCFAProductCodeState,
  state => state.totalElements
);
const selectCFAProductCode = createSelector(
  selectCFAProductCodeState,
  state => state.CFAProduct
);
const selectIsLoading = createSelector(
  selectCFAProductCodeState,
  state => state.isLoading
);

const selectHasSaved = createSelector(
  selectCFAProductCodeState,
  state => state.hasSaved
);
const selectHasUpdated = createSelector(
  selectCFAProductCodeState,
  state => state.hasUpdated
);
const selectHasError = createSelector(
  selectCFAProductCodeState,
  state => state.error
);
const selectProductTypes = createSelector(
  selectCFAProductCodeState,
  state => state.productType
);
const selectItemTypes = createSelector(
  selectCFAProductCodeState,
  state => state.itemTypes
);
const selectPlainStuddedType = createSelector(
  selectCFAProductCodeState,
  state => state.plainStuddedType
);
const selecthallmarkingExcludeKaratType = createSelector(
  selectCFAProductCodeState,
  state => state.hallmarkingExcludeKaratType
);

const selectPricingType = createSelector(
  selectCFAProductCodeState,
  state => state.pricingType
);
export const CFAProductCodeSelectors = {
  selectCFAProductCodeListing,
  selectTotalElements,
  selectCFAProductCode,
  selectIsLoading,
  selectHasSaved,
  selectHasError,
  selectHasUpdated,
  selectProductTypes,
  selectItemTypes,
  selectPlainStuddedType,
  selecthallmarkingExcludeKaratType,
  selectPricingType
};
