import { createSelector } from '@ngrx/store';
import { selectUploadServicePossState } from './upload-service-poss.reducer';

const selectError = createSelector(selectUploadServicePossState, state => state.error);
const selectIsLoading = createSelector(
  selectUploadServicePossState,
  state => state.isLoading
);
const selectFileResponse = createSelector(
  selectUploadServicePossState,
  state => state.fileResponse
);
export const UploadServicePossSelectors = {
  selectError,
  selectIsLoading,
  selectFileResponse
};