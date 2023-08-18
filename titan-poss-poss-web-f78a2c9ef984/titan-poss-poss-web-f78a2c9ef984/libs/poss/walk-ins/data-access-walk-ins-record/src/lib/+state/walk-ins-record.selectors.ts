import { createSelector } from '@ngrx/store';
import { selectWalkInsRecordState } from './walk-ins-record.reducer';

const selectError = createSelector(
  selectWalkInsRecordState,
  state => state.errors
);

const selectIsLoading = createSelector(
  selectWalkInsRecordState,
  state => state.isLoading
);

const selectPurchasersCount = createSelector(
  selectWalkInsRecordState,
  state => state.purchasersCount
);

const selectWalkInsCount = createSelector(
  selectWalkInsRecordState,
  state => state.walkInsCount
);

const selectNumberOfInvoicesCount = createSelector(
  selectWalkInsRecordState,
  state => state.numberOfInvoices
);

const selectSaveWalkInDetailsResponse = createSelector(
  selectWalkInsRecordState,
  state => state.saveWalkInDetailsResponse
);

const selectWalkInsDate = createSelector(
  selectWalkInsRecordState,
  state => state.walkInsDate
);

const selectWalkInsHistoryData = createSelector(
  selectWalkInsRecordState,
  state => state.walkInsHistoryData
);

export const WalkInsRecordSelectors = {
  selectError,
  selectIsLoading,
  selectWalkInsCount,
  selectNumberOfInvoicesCount,
  selectPurchasersCount,
  selectSaveWalkInDetailsResponse,
  selectWalkInsDate,
  selectWalkInsHistoryData
};
