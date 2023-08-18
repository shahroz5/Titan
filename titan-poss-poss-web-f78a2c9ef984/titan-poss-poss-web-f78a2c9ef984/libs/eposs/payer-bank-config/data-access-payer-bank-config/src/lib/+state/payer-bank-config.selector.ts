import { createSelector } from '@ngrx/store';
import { selectPayerBankConfigurationState } from './payer-bank-config.reducer';

const selectPayerBankConfigurations = createSelector(
  selectPayerBankConfigurationState,
  state => state.payerBankConfigListing
);
const selectError = createSelector(
  selectPayerBankConfigurationState,
  state => state.error
);
const selectIsLoading = createSelector(
  selectPayerBankConfigurationState,
  state => state.isLoading
);
const selectTotalElements = createSelector(
  selectPayerBankConfigurationState,
  state => state.totalElements
);
const selectHasSaved = createSelector(
  selectPayerBankConfigurationState,
  state => state.hasSaved
);
const selectHasUpdated = createSelector(
  selectPayerBankConfigurationState,
  state => state.hasUpdated
);
const selectPayerBanks = createSelector(
  selectPayerBankConfigurationState,
  state => state.payerBanks
);
const selectConfigId = createSelector(
  selectPayerBankConfigurationState,
  state => state.configId
);
const selectPayerBankDetails = createSelector(
  selectPayerBankConfigurationState,
  state => state.payerBanksConfigDetails
);
const selectPaymentModes = createSelector(
  selectPayerBankConfigurationState,
  state => state.paymentModes
);

const selectHasSearched = createSelector(
  selectPayerBankConfigurationState,
  state => state.hasSearched
);
const selectBanksCount = createSelector(
  selectPayerBankConfigurationState,
  state => state.banksCount
);
export const PayerBankConfigSelectors = {
  selectPayerBankConfigurations,
  selectError,
  selectIsLoading,
  selectTotalElements,
  selectHasSaved,
  selectHasUpdated,
  selectPayerBanks,
  selectConfigId,
  selectPayerBankDetails,
  selectPaymentModes,
  selectHasSearched,
  selectBanksCount
};
