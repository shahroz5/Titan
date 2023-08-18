import { createSelector } from '@ngrx/store';
import { selectGSTMappingState } from './gst-mapping.reducer';

const selectError = createSelector(selectGSTMappingState, state => state.error);
const selectGSTMappingList = createSelector(
  selectGSTMappingState,
  state => state.gstMappingList
);
const selectTotalElements = createSelector(
  selectGSTMappingState,
  state => state.totalElements
);

const selectIsLoading = createSelector(
  selectGSTMappingState,
  state => state.isLoading
);

const selectTxnTypes = createSelector(
  selectGSTMappingState,
  state => state.txnTypes
);

const selectReloadStatus = createSelector(
  selectGSTMappingState,
  state => state.reloadStatus
);

const selectTaxes = createSelector(selectGSTMappingState, state => state.taxes);

export const GSTMappingSelectors = {
  selectError,
  selectGSTMappingList,
  selectIsLoading,
  selectTotalElements,
  selectTxnTypes,
  selectTaxes,
  selectReloadStatus,
};
