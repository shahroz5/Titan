import { createSelector, createFeatureSelector } from '@ngrx/store';
import { selectViewTcsState } from './view-tcs.reducer';

import { ViewTcsState, viewTcsFetureKey } from './view-tcs.state';

export const selectViewTcsaState = createFeatureSelector<ViewTcsState>(
  viewTcsFetureKey
);

export const selectTcsDetails = createSelector(
  selectViewTcsState,
  state => state.tcsDetails
);

export const selectIsLoading = createSelector(
  selectViewTcsState,
  state => state.isLoading
);

export const selectError = createSelector(
  selectViewTcsState,
  state => state.error
);

export const ViewTcsSelectors = {
  selectTcsDetails,
  selectError,
  selectIsLoading
};
