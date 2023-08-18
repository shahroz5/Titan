import { createSelector } from '@ngrx/store';
import { selectUploadeGHSState } from './upload-eghs.reducer';

const selectError = createSelector(selectUploadeGHSState, state => state.error);
const selectIsLoading = createSelector(
  selectUploadeGHSState,
  state => state.isLoading
);
const selectFileResponse = createSelector(
  selectUploadeGHSState,
  state => state.fileResponse
);
export const UploadeGHSSelectors = {
  selectError,
  selectIsLoading,
  selectFileResponse
};
