import { createSelector } from '@ngrx/store';

import { gvStatusUpdateState } from './gv-status-update.reducers';
import { gvStatusUpdateSelector } from './gv-status-update.entity';

const selectFileUploadResponse = createSelector(
  gvStatusUpdateState,
  state => state.fileUploadResponse
);

const selectUpdateResponse = createSelector(
  gvStatusUpdateState,
  state => state.updatedList
);
const selectTotalElements = createSelector(
  gvStatusUpdateState,
  state => state.totalCount
);

const gvStatusUpdateList = createSelector(
  gvStatusUpdateState,
  state => state.gvStatusUpdateList
);
const selectIsErrorLog = createSelector(
  gvStatusUpdateState,
  state => state.errorLog
);
const selectGVStatusUpdateList = createSelector(
  gvStatusUpdateList,
  gvStatusUpdateSelector.selectAll
);

const selectHasError = createSelector(
  gvStatusUpdateState,
  state => state.hasError
);

const selectIsLoading = createSelector(
  gvStatusUpdateState,
  state => state.isLoading
);
const selectNewList = createSelector(
  gvStatusUpdateState,
  state => state.newList
);
export const gvStatusUpdateSelectors = {
  selectFileUploadResponse,
  selectHasError,
  selectIsLoading,
  selectGVStatusUpdateList,
  selectUpdateResponse,
  selectTotalElements,
  selectNewList,
  selectIsErrorLog
};
