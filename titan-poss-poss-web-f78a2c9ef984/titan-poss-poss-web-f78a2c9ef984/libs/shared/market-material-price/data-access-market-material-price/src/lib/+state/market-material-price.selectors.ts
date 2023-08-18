import { createSelector } from '@ngrx/store';

import { selectMarketMaterialPriceState } from './market-material-price.reducer';
import {
  marketSelector,
  locationDetailSelector,
  selectedStockSelector
} from './market-material-price.entity';

const selectError = createSelector(
  selectMarketMaterialPriceState,
  state => state.error
);

const selectMetalPriceDetails = createSelector(
  selectMarketMaterialPriceState,
  state => state.metalPriceDetails
);
const selectIsValueResetToZero = createSelector(
  selectMarketMaterialPriceState,
  state => state.isValueResetToZero
);

const marketDetailsBasedOnMarket = createSelector(
  selectMarketMaterialPriceState,
  state => state.marketDetailsBasedOnMaterial
);
const selectMarketDetailsBasedOnMarket = createSelector(
  marketDetailsBasedOnMarket,
  marketSelector.selectAll
);

const locationDetails = createSelector(
  selectMarketMaterialPriceState,
  state => state.locationDetails
);
const selectlocationDetails = createSelector(
  locationDetails,
  locationDetailSelector.selectAll
);

const selectTotalCount = createSelector(
  selectMarketMaterialPriceState,
  state => state.totalElements
);
const selectIsLoading = createSelector(
  selectMarketMaterialPriceState,
  state => state.isLoading
);

const selectHasNewViewLocationPriceSuccess = createSelector(
  selectMarketMaterialPriceState,
  state => state.hasNewViewLocationPriceSuccess
);
const selcetLocationDetailsCount = createSelector(
  selectMarketMaterialPriceState,
  state => state.locationDetailsCount
);

const computedPriceSearchResult = createSelector(
  selectMarketMaterialPriceState,
  state => state.computedPriceSearchResult
);

const selectComputedPriceSearchResult = createSelector(
  computedPriceSearchResult,
  locationDetailSelector.selectAll
);
const selcetComputedPriceSearchResultCount = createSelector(
  selectMarketMaterialPriceState,
  state => state.computedPriceSearchResultCount
);
const selectDate = createSelector(
  selectMarketMaterialPriceState,
  state => state.date
);

const selectHasSaved = createSelector(
  selectMarketMaterialPriceState,
  state => state.hasSaved
);
const selectedStock = createSelector(
  selectMarketMaterialPriceState,
  state => state.selectedStock
);
const selctselectedStock = createSelector(
  selectedStock,
  selectedStockSelector.selectAll
);
const selecthasMarketDetailsBasedOnMaterialLoaded = createSelector(
  selectMarketMaterialPriceState,
  state => state.hasMarketDetailsBasedOnMaterialLoaded
);
const selectAllSelected = createSelector(
  selectMarketMaterialPriceState,
  state => state.allSelected
);

const materialPriceTotalCount = createSelector(
  selectMarketMaterialPriceState,
  state => state.totalMetalTypePriceCount
);
export const MarketMaterialPriceSelectors = {
  selectError,
  selectHasSaved,
  selectIsLoading,
  selectMetalPriceDetails,
  selectMarketDetailsBasedOnMarket,
  selectTotalCount,
  selectlocationDetails,
  selectHasNewViewLocationPriceSuccess,
  selcetLocationDetailsCount,
  selectComputedPriceSearchResult,
  selcetComputedPriceSearchResultCount,
  selectDate,
  selctselectedStock,
  selecthasMarketDetailsBasedOnMaterialLoaded,
  selectAllSelected,
  selectIsValueResetToZero,
  materialPriceTotalCount
};
