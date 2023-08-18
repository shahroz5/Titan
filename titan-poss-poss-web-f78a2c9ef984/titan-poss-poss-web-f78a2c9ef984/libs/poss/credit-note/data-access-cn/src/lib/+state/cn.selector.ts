import { createSelector } from '@ngrx/store';
import { sentRequestSelector, transferedCNsSelector } from './cn.entity';
import { selectCreditNoteState } from './cn.reducer';

export const selectError = createSelector(
  selectCreditNoteState,
  state => state.error
);
export const selectIsLoading = createSelector(
  selectCreditNoteState,
  state => state.isLoading
);
const selectCreditNoteSearchResult = createSelector(
  selectCreditNoteState,
  state => state.creditNoteSearchResult
);
const selectCreditNoteDetails = createSelector(
  selectCreditNoteState,
  state => state.creditNoteDetails
);

const selectRequestId = createSelector(
  selectCreditNoteState,
  state => state.requestNo
);
const selectSearch = createSelector(
  selectCreditNoteState,
  state => state.search
);
const selectTotalCount = createSelector(
  selectCreditNoteState,
  state => state.count
);
export const sentRequests = createSelector(
  selectCreditNoteState,
  state => state.sentRequests
);
const selectSentRequests = createSelector(
  sentRequests,
  sentRequestSelector.selectAll
);

export const searchRequests = createSelector(
  selectCreditNoteState,
  state => state.searchRequests
);
const selectSearchRequests = createSelector(
  searchRequests,
  sentRequestSelector.selectAll
);
const selectHasSearched = createSelector(
  selectCreditNoteState,
  state => state.hasSearched
);
const selectRequest = createSelector(
  selectCreditNoteState,
  state => state.request
);
const selectCNNumber = createSelector(
  selectCreditNoteState,
  state => state.cnNumber
);
const selectRequestType = createSelector(
  selectCreditNoteState,
  state => state.requestType
);
const selecttransferToEghsDetails = createSelector(
  selectCreditNoteState,
  state => state.transferToEghs
);

export const transferedCNs = createSelector(
  selectCreditNoteState,
  state => state.transferedCNs
);
const selectTransfteredCNs = createSelector(
  transferedCNs,
  transferedCNsSelector.selectAll
);
const selectDownloadCN = createSelector(
  selectCreditNoteState,
  state => state.downloadCN
);
const selectCNsCount = createSelector(
  selectCreditNoteState,
  state => state.totalCount
);

const selectHasCancelled = createSelector(
  selectCreditNoteState,
  state => state.hasCancelled
);

const selectTotalElements = createSelector(
  selectCreditNoteState,
  state => state.totalElements
);

const selectSearchResult = createSelector(
  selectCreditNoteState,
  state => state.transferedCN
);
const selectCnRefundAmountDetails = createSelector(
  selectCreditNoteState,
  state => state.refundAmountDetails
);

export const CreditNoteSelectors = {
  selectError,
  selectIsLoading,
  selectCreditNoteSearchResult,
  selectCreditNoteDetails,
  selectRequestId,
  selectSearch,
  selectTotalCount,
  selectSentRequests,
  selectSearchRequests,
  selectHasSearched,
  selectRequest,
  selectCNNumber,
  selectRequestType,
  selecttransferToEghsDetails,
  selectTransfteredCNs,
  selectDownloadCN,
  selectCNsCount,
  selectHasCancelled,
  selectTotalElements,
  selectSearchResult,
  selectCnRefundAmountDetails
};
