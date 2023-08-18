import { createSelector } from '@ngrx/store';
import { selectFtepApprovalConfigState } from './ftep-approval-config.reducer';

const selectFtepApprovalConfigList = createSelector(
  selectFtepApprovalConfigState,
  state => state.ftepApprovalConfigList
);

const selectRoleList = createSelector(
  selectFtepApprovalConfigState,
  state => state.roleList
);

const selectFtepApprovalConfig = createSelector(
  selectFtepApprovalConfigState,
  state => state.ftepApprovalConfig
);

const selectError = createSelector(
  selectFtepApprovalConfigState,
  state => state.error
);
const selectIsLoading = createSelector(
  selectFtepApprovalConfigState,
  state => state.isLoading
);
const selectHassaved = createSelector(
  selectFtepApprovalConfigState,
  state => state.hasSaved
);
const selectHasUpdated = createSelector(
  selectFtepApprovalConfigState,
  state => state.hasUpdated
);
const selectTotalElement = createSelector(
  selectFtepApprovalConfigState,
  state => state.totalElements
);

export const ftepApprovalConfigSelectors = {
  selectFtepApprovalConfigList,
  selectFtepApprovalConfig,
  selectError,
  selectHasUpdated,
  selectHassaved,
  selectIsLoading,
  selectTotalElement,
  selectRoleList
};
