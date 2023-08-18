import { createSelector } from '@ngrx/store';
import { selectBankPriorityState } from './bankPriority.reducer';

const selectBankPriorityDetailsListing = createSelector(
  selectBankPriorityState,
  state => state.bankPriorityListing
);


const selectIsLoading = createSelector(
  selectBankPriorityState,
  state => state.isLoading
);

const selectError = createSelector(
  selectBankPriorityState,
  state => state.error
);
const selectHasUpdated = createSelector(
  selectBankPriorityState,
  state => state.hasUpdated
);




export const BankPrioritySelectors = {
  selectBankPriorityDetailsListing,
  selectHasUpdated,
  selectIsLoading,
  selectError,

};
