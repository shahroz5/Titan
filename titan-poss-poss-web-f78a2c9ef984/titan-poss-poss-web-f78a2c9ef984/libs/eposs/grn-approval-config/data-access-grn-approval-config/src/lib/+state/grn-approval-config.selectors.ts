import { createSelector } from '@ngrx/store';
import { selectGrnApprovalConfigState } from './grn-approval-config.reducer';

const selectGrnApprovalConfigList = createSelector(
  selectGrnApprovalConfigState,
  state => state.grnApprovalConfigList
);

const selectRoleList = createSelector(
  selectGrnApprovalConfigState,
  state => state.roleList
);

const selectGrnApprovalConfig = createSelector(
  selectGrnApprovalConfigState,
  state => state.grnApprovalConfig
);

const selectError = createSelector(
  selectGrnApprovalConfigState,
  state => state.error
);
const selectIsLoading = createSelector(
  selectGrnApprovalConfigState,
  state => state.isLoading
);
const selectHassaved = createSelector(
  selectGrnApprovalConfigState,
  state => state.hasSaved
);
const selectHasUpdated = createSelector(
  selectGrnApprovalConfigState,
  state => state.hasUpdated
);
const selectTotalElement = createSelector(
  selectGrnApprovalConfigState,
  state => state.totalElements
);

export const grnApprovalConfigSelectors = {
  selectGrnApprovalConfigList,
  selectGrnApprovalConfig,
  selectError,
  selectHasUpdated,
  selectHassaved,
  selectIsLoading,
  selectTotalElement,
  selectRoleList
};
