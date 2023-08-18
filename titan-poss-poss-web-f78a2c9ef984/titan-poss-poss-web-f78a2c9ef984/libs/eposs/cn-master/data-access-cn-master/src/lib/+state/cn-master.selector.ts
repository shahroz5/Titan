import { createSelector } from '@ngrx/store';
import { selectCreditNoteMasterState } from './cn-master.reducer';

const selectCreditNoteMasterList = createSelector(
  selectCreditNoteMasterState,
  state => state.creditNoteMasterlist
);
const selectTotalElements = createSelector(
  selectCreditNoteMasterState,
  state => state.totalElements
);

const selectIsloading = createSelector(
  selectCreditNoteMasterState,
  state => state.isLoading
);
const selectError = createSelector(
  selectCreditNoteMasterState,
  state => state.error
);

const selectHasUpdated = createSelector(
  selectCreditNoteMasterState,
  state => state.hasUpdated
);

const selectCreditNoteDetailByCnType = createSelector(
  selectCreditNoteMasterState,
  state => state.creditNoteMasterDetails
);

export const CreditNoteMasterSelectors = {
  selectCreditNoteMasterList,
  selectTotalElements,
  selectIsloading,
  selectError,
  selectHasUpdated,
  selectCreditNoteDetailByCnType
};
