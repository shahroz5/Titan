import { createSelector } from '@ngrx/store';
import { selectMarketCodeState } from './market-code.reducer';
const selectMarketCodeListing = createSelector(
  selectMarketCodeState,
  state => state.marketCodeListing
);
const selectTotalMarketCodes = createSelector(
  selectMarketCodeState,
  state => state.totalMarketCodes
);
const selectMarketCodeDetails = createSelector(
  selectMarketCodeState,
  state => state.marketCodeDetails
);
const selectError = createSelector(selectMarketCodeState, state => state.error);
const selectIsLoading = createSelector(
  selectMarketCodeState,
  state => state.isLoading
);
const selectHasSavedMarketCodeDetails = createSelector(
  selectMarketCodeState,
  state => state.hasSavedMarketDetails
);
const selectHasUpdatedMarketCodeDetails = createSelector(
  selectMarketCodeState,
  state => state.hasUpdatedMarketDetails
);
const selectHasSavedMarketMaterialFacators = createSelector(
  selectMarketCodeState,
  state => state.hasSavedMarketCodeFactors
);
const selectHasUpdatedMarketMaterialFacators = createSelector(
  selectMarketCodeState,
  state => state.hasUpdatedMarketCodeFacators
);
const selectHasStatusUpdate = createSelector(
  selectMarketCodeState,
  state => state.hasToggleButton
);

export const MarketCodesSelectors = {
  selectMarketCodeListing,
  selectTotalMarketCodes,
  selectMarketCodeDetails,
  selectError,
  selectIsLoading,
  selectHasSavedMarketCodeDetails,
  selectHasUpdatedMarketCodeDetails,
  selectHasSavedMarketMaterialFacators,
  selectHasUpdatedMarketMaterialFacators,
  selectHasStatusUpdate
};
