import { createSelector } from '@ngrx/store';
import { selectGrnRequestApprovalState } from './grn-request-approvals.reducer';
import { grnRequestListSelector } from './grn-request-approvals.entity';

export const grnRequestApprovalList = createSelector(
  selectGrnRequestApprovalState,
  state => state.grnRequestList
);

const selectGrnRequestApprovalList = createSelector(
  grnRequestApprovalList,
  grnRequestListSelector.selectAll
);

const selectIsLoading = createSelector(
  selectGrnRequestApprovalState,
  state => state.isLoading
);
const selectError = createSelector(
  selectGrnRequestApprovalState,
  state => state.error
);

const selectHasSaved = createSelector(
  selectGrnRequestApprovalState,
  state => state.hasSaved
);

const selectHasUpdated = createSelector(
  selectGrnRequestApprovalState,
  state => state.hasUpdated
);
export const grnRequestApprovalSelector = {
  selectGrnRequestApprovalList,
  selectIsLoading,
  selectError,
  selectHasSaved,
  selectHasUpdated
};
