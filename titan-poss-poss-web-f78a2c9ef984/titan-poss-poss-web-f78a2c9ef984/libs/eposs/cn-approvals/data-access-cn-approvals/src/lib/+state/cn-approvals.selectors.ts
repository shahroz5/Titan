import { createSelector } from '@ngrx/store';
import { selectCnApprovalState } from './cn-approvals.reducer';
import { cnRequestListSelector } from './cn-approvals.entity';

export const cnRequestApprovalList = createSelector(
  selectCnApprovalState,
  state => state.cnApprovalsList
);

const selectCnRequestApprovalList = createSelector(
  cnRequestApprovalList,
  cnRequestListSelector.selectAll
);

const selectIsLoading = createSelector(
  selectCnApprovalState,
  state => state.isLoading
);
const selectError = createSelector(selectCnApprovalState, state => state.error);

const selectHasUpdated = createSelector(
  selectCnApprovalState,
  state => state.hasUpdated
);

export const cnApprovalSelector = {
  selectCnRequestApprovalList,
  selectIsLoading,
  selectError,
  selectHasUpdated
};
