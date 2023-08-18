import { createSelector } from '@ngrx/store';
import { conversionApprovalRequestSelector } from './conversion-approvals.entity';
import { selectConversionApprovalsState } from './conversion-approvals.reducer';

const selectIsLoading = createSelector(
  selectConversionApprovalsState,
  state => state.isLoading
);
const selectError = createSelector(
  selectConversionApprovalsState,
  state => state.errors
);
const approvalRequestsList = createSelector(
  selectConversionApprovalsState,
  state => state.approvalRequestsList
);
const selectApprovalRequestsList = createSelector(
  approvalRequestsList,
  conversionApprovalRequestSelector.selectAll
);
const selectApprovalRequestsLength = createSelector(
  selectConversionApprovalsState,
  state => state.approvalRequestsLength
);
const selectSelectedRequest = createSelector(
  selectConversionApprovalsState,
  state => state.selectedRequest
);
const selectSelectedRequestData = createSelector(
  selectConversionApprovalsState,
  state => state.selectedRequestData
);
const selectSelectedItemIds = createSelector(
  selectConversionApprovalsState,
  state => state.itemIds
);
const selectUpdateStatusResponse = createSelector(
  selectConversionApprovalsState,
  state => state.updateStatusResponse
);

// Image
export const selectIsLoadingImage = createSelector(
  selectConversionApprovalsState,
  state => state.isLoadingImage
);
export const conversionApprovalsSelectors = {
  selectIsLoading,
  selectError,
  selectApprovalRequestsList,
  selectApprovalRequestsLength,
  selectSelectedRequest,
  selectSelectedRequestData,
  selectSelectedItemIds,
  selectUpdateStatusResponse,
  selectIsLoadingImage
};
