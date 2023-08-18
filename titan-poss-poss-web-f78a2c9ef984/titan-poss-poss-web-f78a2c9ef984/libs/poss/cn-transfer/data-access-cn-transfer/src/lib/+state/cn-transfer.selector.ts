import { createSelector } from '@ngrx/store';
import { selectCreditNoteTransferState } from './cn-transfer.reducer';
import { requestsSelector } from './cn-transfer.entity';

const selectError = createSelector(
  selectCreditNoteTransferState,
  state => state.error
);
const selectIsLoading = createSelector(
  selectCreditNoteTransferState,
  state => state.isLoading
);
const selectLocationCodes = createSelector(
  selectCreditNoteTransferState,
  state => state.locationCodes
);
const selectCreditNoteSearchResult = createSelector(
  selectCreditNoteTransferState,
  state => state.creditNoteSearchResult
);
const selectCreditNoteSearchResultCount = createSelector(
  selectCreditNoteTransferState,
  state => state.searchCount
);

const selectCreditNoteDetails = createSelector(
  selectCreditNoteTransferState,
  state => state.creditNoteDetails
);
const selectRaisedRequestNo = createSelector(
  selectCreditNoteTransferState,
  state => state.raisedRequestNo
);

export const raisedTransferRequests = createSelector(
  selectCreditNoteTransferState,
  state => state.raisedRequests
);
const selectRaisedRequests = createSelector(
  raisedTransferRequests,
  requestsSelector.selectAll
);
const selectRaisedRequestsTotalCount = createSelector(
  selectCreditNoteTransferState,
  state => state.requestsCount
);
const selectHasCnRequestUpdateStatus = createSelector(
  selectCreditNoteTransferState,
  state => state.hasCnUpdateRequestStatus
);
const selectCnUpdateResponse = createSelector(
  selectCreditNoteTransferState,
  state => state.creditNoteUpdateResponse
);
const selectIsApporvedOrRejected = createSelector(
  selectCreditNoteTransferState,
  state => state.isApprovedOrRejected
);
const selectIsCnTransferRequestCancelled = createSelector(
  selectCreditNoteTransferState,
  state => state.isTransferRequestCancelled
);
const selectlegacyOutwardTransferResponsePayload = createSelector(
  selectCreditNoteTransferState,
  state => state.legacyOutwardTransferResponsePayload
);
const selectlegacyInwardTransferResponsePayload = createSelector(
  selectCreditNoteTransferState,
  state => state.legacyInwardTransferResponsePayload
);
export const CreditNoteTransferSelectors = {
  selectError,
  selectIsLoading,
  selectLocationCodes,
  selectCreditNoteSearchResult,
  selectCreditNoteSearchResultCount,
  selectCreditNoteDetails,
  selectRaisedRequestNo,
  selectRaisedRequests,
  selectRaisedRequestsTotalCount,
  selectHasCnRequestUpdateStatus,
  selectCnUpdateResponse,
  selectIsApporvedOrRejected,
  selectIsCnTransferRequestCancelled,
  selectlegacyOutwardTransferResponsePayload,
  selectlegacyInwardTransferResponsePayload
};
