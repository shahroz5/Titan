import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectFindPriceState } from './find-price.reducer';

const selectHasError = createSelector(
  selectFindPriceState,
  state => state.hasError
);

const selectIsLoading = createSelector(
  selectFindPriceState,
  state => state.isLoading
);

const selectIsViewPricing = createSelector(
  selectFindPriceState,
  state => state.isViewPricing
);

const selectStandardMetalPriceDetails = createSelector(
  selectFindPriceState,
  state => state.standardMetalPriceDetails
);

const selectPriceDetails = createSelector(
  selectFindPriceState,
  state => state.priceDetails
);

const selectTaxDetails = createSelector(
  selectFindPriceState,
  state => state.taxDetails
);

const selectItemCode = createSelector(
  selectFindPriceState,
  state => state.itemCode
);

export const findPriceSelectors = {
  selectHasError,
  selectIsLoading,
  selectStandardMetalPriceDetails,
  selectPriceDetails,
  selectTaxDetails,
  selectIsViewPricing,
  selectItemCode
};