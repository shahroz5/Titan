import { createSelector } from '@ngrx/store';
import { locationSelector } from './location-master.entity';
import { selectLocationMasterState } from './location-master.reducer';

const locationListingSelector = createSelector(
  selectLocationMasterState,
  state => state.locationListing
);

const selectLoadedLocationList = createSelector(
  locationListingSelector,
  locationSelector.selectAll
);
const selectTotalCount = createSelector(
  selectLocationMasterState,
  state => state.totalCount
);

const selectIscopySuccess = createSelector(
  selectLocationMasterState,
  state => state.isCopySuccess
);

const selectLocationDetails = createSelector(
  selectLocationMasterState,
  state => state.locationDetails
);

const selectIsLoading = createSelector(
  selectLocationMasterState,
  state => state.isLoading
);

const selectError = createSelector(
  selectLocationMasterState,
  state => state.error
);

// Dropdown
const selectLocationTypes = createSelector(
  selectLocationMasterState,
  state => state.locationTypes
);

const selectTowns = createSelector(
  selectLocationMasterState,
  state => state.towns
);

const selectStates = createSelector(
  selectLocationMasterState,
  state => state.stateTypes
);

const selectOwnerInfo = createSelector(
  selectLocationMasterState,
  state => state.ownerInfo
);

const selectRegions = createSelector(
  selectLocationMasterState,
  state => state.regions
);

const selectSubRegions = createSelector(
  selectLocationMasterState,
  state => state.subRegions
);

const selectBrands = createSelector(
  selectLocationMasterState,
  state => state.brands
);

const selectSubBrand = createSelector(
  selectLocationMasterState,
  state => state.subBrands
);

const selectMarketCode = createSelector(
  selectLocationMasterState,
  state => state.marketTypes
);

const selectBaseCurrencyTypes = createSelector(
  selectLocationMasterState,
  state => state.baseCurrencyTypes
);

const selectCurrencyTypes = createSelector(
  selectLocationMasterState,
  state => state.currencyTypes
);

const selectLocationSize = createSelector(
  selectLocationMasterState,
  state => state.locationSize
);

const selectInvoicetype = createSelector(
  selectLocationMasterState,
  state => state.invoicetype
);

const selectRefundMode = createSelector(
  selectLocationMasterState,
  state => state.refundMode
);

const selectIsSaved = createSelector(
  selectLocationMasterState,
  state => state.isSaved
);

const selectCountryCode = createSelector(
  selectLocationMasterState,
  state => state.countryCode
);

const selectLocationCFATypes = createSelector(
  selectLocationMasterState,
  state => state.LocationCFATypes
);

export const LocationMasterSelectors = {
  selectLoadedLocationList,
  selectIscopySuccess,
  selectLocationDetails,
  selectTotalCount,
  selectLocationTypes,
  selectTowns,
  selectStates,
  selectOwnerInfo,
  selectRegions,
  selectSubRegions,
  selectBrands,
  selectSubBrand,
  selectMarketCode,
  selectBaseCurrencyTypes,
  selectCurrencyTypes,
  selectLocationSize,
  selectInvoicetype,
  selectRefundMode,
  selectIsSaved,
  selectIsLoading,
  selectError,
  selectCountryCode,
  selectLocationCFATypes
};
