import { createSelector } from '@ngrx/store';
import { selectPaymentConfigurationState } from './payment-configuration.reducer';
import { paymentModeSelector } from './payment-configuration.entity';

const selectPaymentConfigurationList = createSelector(
  selectPaymentConfigurationState,
  state => state.paymentConfigurationlist
);
const selectPaymentConfiguration = createSelector(
  selectPaymentConfigurationState,
  state => state.paymentConfiguration
);

const selectTotalElements = createSelector(
  selectPaymentConfigurationState,
  state => state.totalElements
);

const selectIsloading = createSelector(
  selectPaymentConfigurationState,
  state => state.isLoading
);
const selectError = createSelector(
  selectPaymentConfigurationState,
  state => state.error
);

const selectHasSaved = createSelector(
  selectPaymentConfigurationState,
  state => state.hasSaved
);
const selectHasUpdated = createSelector(
  selectPaymentConfigurationState,
  state => state.hasUpdated
);

const selectSelectedOptions = createSelector(
  selectPaymentConfigurationState,
  state => state.selectedOptions
);
export const paymentModes = createSelector(
  selectPaymentConfigurationState,
  state => state.paymentModes
);
const selectPaymentModes = createSelector(
  paymentModes,
  paymentModeSelector.selectAll
);
const selectTransactionType = createSelector(
  selectPaymentConfigurationState,
  state => state.transctionTypes
);

const selectConfigId = createSelector(
  selectPaymentConfigurationState,
  state => state.configId
);

const selectPaymentModeCount = createSelector(
  selectPaymentConfigurationState,
  state => state.paymentModeCount
);
const selectTcsPaymentModes = createSelector(
  selectPaymentConfigurationState,
  state => state.tcsPaymentModes
);
export const PaymentConfigurationSelectors = {
  selectPaymentConfigurationList,
  selectTotalElements,
  selectIsloading,
  selectError,
  selectHasSaved,
  selectHasUpdated,
  selectPaymentConfiguration,
  selectPaymentModeCount,
  selectSelectedOptions,
  selectPaymentModes,
  selectTransactionType,
  selectTcsPaymentModes,
  selectConfigId
};
