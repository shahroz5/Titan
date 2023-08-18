import { createSelector } from '@ngrx/store';
import { priceGroupMasterSelector } from './price-group-mapping.entity';
import { selectPriceGroupMapping } from './price-group-mapping.reducer';

export const priceGrouplist = createSelector(
  selectPriceGroupMapping,
  state => state.priceGrouplist
);

const selectPriceGrouplist = createSelector(
  priceGrouplist,
  priceGroupMasterSelector.selectAll
);

const selectPriceGroupTotalElements = createSelector(
  selectPriceGroupMapping,
  state => state.priceGroupTotalElements
);

const selectLocationList = createSelector(
  selectPriceGroupMapping,
  state => state.locationList
);

const selectPriceGroupTypeList = createSelector(
  selectPriceGroupMapping,
  state => state.priceGroupTypelist
);

const selectLocationPriceGroupMappingList = createSelector(
  selectPriceGroupMapping,
  state => state.locationPriceGroupMappingList
);

const selectIsLoading = createSelector(
  selectPriceGroupMapping,
  state => state.isLoading
);
const selectError = createSelector(
  selectPriceGroupMapping,
  state => state.error
);
const selectHasSaved = createSelector(
  selectPriceGroupMapping,
  state => state.hasSaved
);

export const priceGroupMappingSelectors = {
  selectPriceGrouplist,
  selectPriceGroupTotalElements,
  selectLocationList,
  selectPriceGroupTypeList,
  selectLocationPriceGroupMappingList,
  selectError,
  selectIsLoading,
  selectHasSaved
};
