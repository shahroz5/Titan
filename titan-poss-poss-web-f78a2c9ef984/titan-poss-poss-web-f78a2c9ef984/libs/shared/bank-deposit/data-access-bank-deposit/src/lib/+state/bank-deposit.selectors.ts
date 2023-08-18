import { createSelector, createFeatureSelector } from '@ngrx/store';
import {
  BankDepositState,
  BANK_DEPOSIT_FEATURE_KEY
} from './bank-deposit.state';

export const selectBankDepositState = createFeatureSelector<BankDepositState>(
  BANK_DEPOSIT_FEATURE_KEY
);

const selectIsLoading = createSelector(
  selectBankDepositState,
  state => state.isLoading
);

const selectBankDepositList = createSelector(
  selectBankDepositState,
  state => state.bankDepositData
);

const selectError = createSelector(
  selectBankDepositState,
  state => state.error
);

const selectTransactionDetails = createSelector(
  selectBankDepositState,
  state => state.transacionDetails
);

export const BankDepositSelectors = {
  selectError,
  selectIsLoading,
  selectBankDepositList,
  selectTransactionDetails
};
