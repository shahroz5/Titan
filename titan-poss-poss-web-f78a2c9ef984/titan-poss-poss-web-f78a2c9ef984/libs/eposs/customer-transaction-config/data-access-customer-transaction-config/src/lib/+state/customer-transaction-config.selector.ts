import { createSelector } from '@ngrx/store';
import { selectCustomerTransactionState } from './customer-transaction-config.reducer';

const selectCustomerTransactionConfigList = createSelector(
  selectCustomerTransactionState,
  state => state.configList
);
const selectError = createSelector(
  selectCustomerTransactionState,
  state => state.error
);
const selectIsLoading = createSelector(
  selectCustomerTransactionState,
  state => state.isLoading
);
const selectTotalElements = createSelector(
  selectCustomerTransactionState,
  state => state.totalElements
);
const selectHasStatusUpdated = createSelector(
  selectCustomerTransactionState,
  state => state.hasStatusUpdated
);
const selectHasSearched = createSelector(
  selectCustomerTransactionState,
  state => state.hasSearched
);
const selectTransactionTypes = createSelector(
  selectCustomerTransactionState,
  state => state.transactionTypes
);
const selectCustomers = createSelector(
  selectCustomerTransactionState,
  state => state.customers
);
const selectHasSaved = createSelector(
  selectCustomerTransactionState,
  state => state.hasSaved
);
const selectHasUpdated = createSelector(
  selectCustomerTransactionState,
  state => state.hasUpdated
);

const selectConfigId = createSelector(
  selectCustomerTransactionState,
  state => state.configId
);
const selectConfigDetailsById = createSelector(
  selectCustomerTransactionState,
  state => state.customerTranConfigDetails
);

export const CustomerTransactionConfigSelectors = {
  selectCustomerTransactionConfigList,
  selectError,
  selectIsLoading,
  selectTotalElements,
  selectHasStatusUpdated,
  selectHasSearched,
  selectTransactionTypes,
  selectCustomers,
  selectHasSaved,
  selectHasUpdated,
  selectConfigId,
  selectConfigDetailsById
};
