import { createSelector } from '@ngrx/store';
import { selectRoRequestApprovalState } from './ro-request-approvals.reducer';
import { requestListSelector } from './ro-request-approvals.entity';

const selectBoutiqueRoRequestList = createSelector(
  selectRoRequestApprovalState,
  state => state.boutiqueRequestList
);
const pendingRoRequestList = createSelector(
  selectRoRequestApprovalState,
  state => state.pendingRoRequestList
);
const selectPendingRoRequestList = createSelector(
  pendingRoRequestList,
  requestListSelector.selectAll
);
const selectRejectedRoRequestList = createSelector(
  selectRoRequestApprovalState,
  state => state.rejectedRoRequestList
);
const selectClosedRoRequestList = createSelector(
  selectRoRequestApprovalState,
  state => state.closedRoRequestList
);
const selectApprovedRoRequestList = createSelector(
  selectRoRequestApprovalState,
  state => state.approvedRoRequestList
);
const selectTotalElements = createSelector(
  selectRoRequestApprovalState,
  state => state.totalElements
);
const selectError = createSelector(
  selectRoRequestApprovalState,
  state => state.error
);

const selectHasupdated = createSelector(
  selectRoRequestApprovalState,
  state => state.hasUpdated
);

const selectIsloading = createSelector(
  selectRoRequestApprovalState,
  state => state.isLoading
);

export const roRequestApprovalsSelectors = {
  selectRejectedRoRequestList,
  selectApprovedRoRequestList,
  selectPendingRoRequestList,
  selectIsloading,
  selectHasupdated,
  selectError,
  selectTotalElements,
  selectBoutiqueRoRequestList,
  selectClosedRoRequestList
};
