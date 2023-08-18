import { createSelector } from '@ngrx/store';
import { airpayConfigurationState } from './airpay-configuration.reducer';

const selectVendorList = createSelector(
  airpayConfigurationState,
  state => state.vendorList
);

const selectTotalElements = createSelector(
  airpayConfigurationState,
  state => state.totalCount
);

const selectHasError = createSelector(
  airpayConfigurationState,
  state => state.hasError
);

const selectIsLoading = createSelector(
  airpayConfigurationState,
  state => state.isLoading
);

export const AirpayConfigurationSelectors = {
  selectHasError,
  selectIsLoading,
  selectVendorList,
  selectTotalElements
};
