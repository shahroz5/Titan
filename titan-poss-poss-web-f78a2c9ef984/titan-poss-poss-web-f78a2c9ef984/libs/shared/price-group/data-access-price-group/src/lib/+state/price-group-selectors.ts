import { selectPriceGroupMasterState } from './price-group-reducer';
import { priceGroupSelector } from './price-group-entity';

import { createSelector } from '@ngrx/store';

export const priceGroupMasterList = createSelector(
  selectPriceGroupMasterState,
  state => state.priceGroupList
);

export const selectPriceGroupMaster = createSelector(
  priceGroupMasterList,
  priceGroupSelector.selectAll
);

export const selectTotalElements = createSelector(
  selectPriceGroupMasterState,
  state => state.totalElements
);
export const selectIsloading = createSelector(
  selectPriceGroupMasterState,
  state => state.isloading
);

export const selectError = createSelector(
  selectPriceGroupMasterState,
  state => state.error
);

export const selectPriceGroup = createSelector(
  selectPriceGroupMasterState,
  state => state.priceGroup
);
export const selectHasSaved = createSelector(
  selectPriceGroupMasterState,
  state => state.hasSaved
);
export const selectHasUpdated = createSelector(
  selectPriceGroupMasterState,
  state => state.hasUpdated
);

export const priceGroupMasterSelector = {
  selectPriceGroupMaster,
  selectTotalElements,
  selectIsloading,
  selectError,
  selectPriceGroup,
  selectHasSaved,
  selectHasUpdated,

};
