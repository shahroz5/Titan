import { createSelector } from '@ngrx/store';
import { selectBgrConfigState } from './bgr-config.reducer';

const selectBgrConfigListing = createSelector(
  selectBgrConfigState,
  state => state.bgrConfigListing
);

const selectBgrConfigDetails = createSelector(
  selectBgrConfigState,
  state => state.bgrConfigDetails
);

const selectBgrConfigDetailsSaved = createSelector(
  selectBgrConfigState,
  state => state.bgrConfigDetailsSaved
);

const selectBgrConfigDetailsEdited = createSelector(
  selectBgrConfigState,
  state => state.bgrConfigDetailsEdited
);

const selectBgrConfigTotal = createSelector(
  selectBgrConfigState,
  state => state.bgrTotalConfig
);

const selectIsLoading = createSelector(
  selectBgrConfigState,
  state => state.isLoading
);

const selectError = createSelector(selectBgrConfigState, state => state.error);

export const BgrConfigSelectors = {
  selectBgrConfigListing,
  selectBgrConfigTotal,
  selectBgrConfigDetails,
  selectBgrConfigDetailsSaved,
  selectBgrConfigDetailsEdited,
  selectIsLoading,
  selectError
};
