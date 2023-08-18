import { createSelector } from '@ngrx/store';
import { selectPayerBankState } from './payer-bank.reducer';

const selectError = createSelector(selectPayerBankState, state => state.error);
const selectBankDetails = createSelector(
  selectPayerBankState,
  state => state.bankDetails
);

const selectIsLoading = createSelector(
  selectPayerBankState,
  state => state.isLoading
);
const selectTotalElements = createSelector(
  selectPayerBankState,
  state => state.totalElements
);
const selectFileResponse = createSelector(
  selectPayerBankState,
  state => state.fileResponse
);
const selectErrorLog = createSelector(
  selectPayerBankState,
  state => state.errorLog
);
export const PayerBankSelectors = {
  selectError,
  selectBankDetails,
  selectIsLoading,
  selectTotalElements,
  selectFileResponse,
  selectErrorLog
};
