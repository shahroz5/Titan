import { createSelector } from '@ngrx/store';
import { selectVendorMasterState } from './vendor-master.reducer';

const selectVendorMasterList = createSelector(
  selectVendorMasterState,
  state => state.vendorMasterList
);

const selectTotalElements = createSelector(
  selectVendorMasterState,
  state => state.totalElements
);
const selectIsloading = createSelector(
  selectVendorMasterState,
  state => state.isLoading
);

const selectError = createSelector(
  selectVendorMasterState,
  state => state.error
);

const selectVendorMaster = createSelector(
  selectVendorMasterState,
  state => state.vendorMaster
);

export const vendorMasterSelector = {
  selectVendorMasterList,
  selectVendorMaster,
  selectTotalElements,
  selectIsloading,
  selectError
};
