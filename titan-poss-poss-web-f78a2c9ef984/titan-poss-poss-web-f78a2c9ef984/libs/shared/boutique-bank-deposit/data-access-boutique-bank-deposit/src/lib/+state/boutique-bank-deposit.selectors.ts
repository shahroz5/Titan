import { createSelector } from '@ngrx/store';
import { selectBoutiqueBankDepositState } from './boutique-bank-deposit.reducer';

const selectError = createSelector(
  selectBoutiqueBankDepositState,
  state => state.error
);
const selectIsLoading = createSelector(
  selectBoutiqueBankDepositState,
  state => state.isLoading
);
const selectBankDepositDetails = createSelector(
  selectBoutiqueBankDepositState,
  state => state.depositDetails
);
const selectTotalElements = createSelector(
  selectBoutiqueBankDepositState,
  state => state.totalElements
);
const selectHasSaved = createSelector(
  selectBoutiqueBankDepositState,
  state => state.hasSaved
);
const selectDepositAmount = createSelector(
  selectBoutiqueBankDepositState,
  state => state.depositedAmount
);
const selectSaveResponse = createSelector(
  selectBoutiqueBankDepositState,
  state => state.saveResponse
);
const selectHasCashDenomoitonSaved = createSelector(
  selectBoutiqueBankDepositState,
  state => state.hasDenomitionSaved
);
const selectPendingDates = createSelector(
  selectBoutiqueBankDepositState,
  state => state.pendingDates
);
const selectPifNoResponse = createSelector(
  selectBoutiqueBankDepositState,
  state => state.pifNoResponse
);
export const BoutiqueBankDepositSelectors = {
  selectError,
  selectIsLoading,
  selectBankDepositDetails,
  selectTotalElements,
  selectHasSaved,
  selectDepositAmount,
  selectSaveResponse,
  selectHasCashDenomoitonSaved,
  selectPendingDates,
  selectPifNoResponse
};
