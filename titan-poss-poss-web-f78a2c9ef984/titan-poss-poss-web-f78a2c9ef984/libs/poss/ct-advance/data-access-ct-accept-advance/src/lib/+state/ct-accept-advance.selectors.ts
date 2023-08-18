import { createSelector } from '@ngrx/store';
import { selectCtAcceptAdvanceState } from './ct-accept-advance.reducer';

const selectError = createSelector(
  selectCtAcceptAdvanceState,
  state => state.errors
);

const selectIsLoading = createSelector(
  selectCtAcceptAdvanceState,
  state => state.isLoading
);

const selectSelectedRsoName = createSelector(
  selectCtAcceptAdvanceState,
  state => state.selectedRsoName
);

const selectInitiateAdvanceResponse = createSelector(
  selectCtAcceptAdvanceState,
  state => state.initiateAdvanceResponse
);

const selectUpdateAdvanceResponse = createSelector(
  selectCtAcceptAdvanceState,
  state => state.updateAdvanceResponse
);

const selectPartiallyUpdateAdvanceResponse = createSelector(
  selectCtAcceptAdvanceState,
  state => state.partiallyAdvanceResponse
);

const selectLoadRSODetails = createSelector(
  selectCtAcceptAdvanceState,
  state => state.rsoDetails
);

const selectRemarks = createSelector(
  selectCtAcceptAdvanceState,
  state => state.remarks
);

const selectViewAdvanceResponse = createSelector(
  selectCtAcceptAdvanceState,
  state => state.viewAdvanceResponse
);

const selectAdvanceHistoryResponse = createSelector(
  selectCtAcceptAdvanceState,
  state => state.advanceHistoryItems
);

const selectHistorySearchParamDetails = createSelector(
  selectCtAcceptAdvanceState,
  state => state.historySearchParamDetails
);

const selectOrderNumber = createSelector(
  selectCtAcceptAdvanceState,
  state => state.orderNumber
);

const selectDeleteTransactionResponse = createSelector(
  selectCtAcceptAdvanceState,
  state => state.deleteAdvanceTransactionResponse
);

export const CtAcceptAdvanceSelectors = {
  selectError,
  selectIsLoading,
  selectSelectedRsoName,
  selectInitiateAdvanceResponse,
  selectUpdateAdvanceResponse,
  selectPartiallyUpdateAdvanceResponse,
  selectLoadRSODetails,
  selectRemarks,
  selectViewAdvanceResponse,
  selectAdvanceHistoryResponse,
  selectHistorySearchParamDetails,
  selectOrderNumber,
  selectDeleteTransactionResponse
};
