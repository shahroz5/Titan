import { createSelector } from '@ngrx/store';
import { airpayHostConfigSelector } from './airpay-host-configuration.entity';
import { airpayHostConfigurationState } from './airpay-host-configuration.reducer';

const updateResponse = createSelector(
  airpayHostConfigurationState,
  state => state.updatedHostNameList
);

const hostNameList = createSelector(
  airpayHostConfigurationState,
  state => state.hostNameList
);
const selecthostNameList = createSelector(
  hostNameList,
  airpayHostConfigSelector.selectAll
);

const selectTotalElements = createSelector(
  airpayHostConfigurationState,
  state => state.totalCount
);

const selectHasError = createSelector(
  airpayHostConfigurationState,
  state => state.hasError
);

const selectIsLoading = createSelector(
  airpayHostConfigurationState,
  state => state.isLoading
);
export const AirpayHostConfigurationSelectors = {
  selectHasError,
  selectIsLoading,
  selecthostNameList,
  selectTotalElements,
  updateResponse
};
