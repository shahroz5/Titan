import { createSelector } from '@ngrx/store';
import { selectPrintingState } from './printing.reducer';

const selectHasError = createSelector(
  selectPrintingState,
  state => state.hasError
);

const selectIsLoading = createSelector(
  selectPrintingState,
  state => state.isLoading
);

const selectIsPrintingSuccess = createSelector(
  selectPrintingState,
  state => state.isPrintingSuccess
);

const selectIsNotificationPrintSuccess = createSelector(
  selectPrintingState,
  state => state.isNotificationPrintSuccess
);

const selectIsNotificationMailSent = createSelector(
  selectPrintingState,
  state => state.isNotificationMailSent
);

const selectIsMailSent = createSelector(
  selectPrintingState,
  state => state.isMailSent
);

const selectLastTransactionId = createSelector(
  selectPrintingState,
  state => state.lastTransactionId
);

const selectLastTransactionPaymentType = createSelector(
  selectPrintingState,
  state => state.lastTransactionPaymentType
);

const selectTransactionIds = createSelector(
  selectPrintingState,
  state => state.transactionIds
);

export const printingSelectors = {
  selectHasError,
  selectIsLoading,
  selectIsPrintingSuccess,
  selectIsMailSent,
  selectLastTransactionId,
  selectLastTransactionPaymentType,
  selectTransactionIds,
  selectIsNotificationPrintSuccess,
  selectIsNotificationMailSent
};
