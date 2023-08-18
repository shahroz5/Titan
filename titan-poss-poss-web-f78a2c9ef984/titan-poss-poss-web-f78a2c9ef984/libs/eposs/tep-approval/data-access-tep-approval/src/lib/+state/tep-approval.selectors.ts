import { createSelector } from '@ngrx/store';

import { tepApprovalState } from './tep-approval.reducers';
import { tepApprovalSelector } from './tep-approval.entity';

const selectTotalElements = createSelector(
  tepApprovalState,
  state => state.totalCount
);

const approvalList = createSelector(
  tepApprovalState,
  state => state.approvalist
);
const updatedApprovalList = createSelector(
  tepApprovalState,
  state => state.editableWorkflowDetails
);
const selectApprovalList = createSelector(
  approvalList,
  tepApprovalSelector.selectAll
);

const selectHasError = createSelector(
  tepApprovalState,
  state => state.hasError
);

const selectIsLoading = createSelector(
  tepApprovalState,
  state => state.isLoading
);

const selectRefundList = createSelector(
  tepApprovalState,
  state => state.refundList
);

const selectFullValueTepRequestsListResponse = createSelector(
  tepApprovalState,
  state => state.fullValueTepRequestsList
);

const selectEditedRefundListItemResponse = createSelector(
  tepApprovalState,
  state => state.editedRefundListItemResponse
);

const selectFvtApprovedDetails = createSelector(
  tepApprovalState,
  state => state.fvtApprovedDetails
);

export const tepApprovalSelectors = {
  selectHasError,
  selectIsLoading,
  updatedApprovalList,
  selectTotalElements,
  selectApprovalList,
  selectRefundList,
  selectEditedRefundListItemResponse,
  selectFullValueTepRequestsListResponse,
  selectFvtApprovedDetails
};
