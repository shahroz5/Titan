import { createSelector } from '@ngrx/store';
import { selectOrderConfirmationState } from './order-confirmation.reducer';

const selectHasError = createSelector(
  selectOrderConfirmationState,
  state => state.hasError
);

const selectIsLoading = createSelector(
  selectOrderConfirmationState,
  state => state.isLoading
);

const updateCashMemoResponse = createSelector(
  selectOrderConfirmationState,
  state => state.updateCashMemoResponse
);



export const orderConfirmationSelectors = {
  selectHasError,
  selectIsLoading,
  updateCashMemoResponse

};
