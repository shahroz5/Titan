import { createSelector } from '@ngrx/store';
import { selectABRequestsState } from './ab-requests.reducer';

import { ABDetailsSelector } from './ab-requests.entity';
const abRequests = createSelector(
  selectABRequestsState,
  state => state.abRequests
);

const selectabRequests = createSelector(
  abRequests,
  ABDetailsSelector.selectAll
);

const selectabRequestCount = createSelector(
  selectABRequestsState,
  state => state.abRequestsCount
);

const selectLoading = createSelector(
  selectABRequestsState,
  state => state.isLoading
);

const selecthasError = createSelector(
  selectABRequestsState,
  state => state.hasError
);
const selectApprovedDetail = createSelector(
  selectABRequestsState,
  state => state.abRequestsDetail
);

const selectLocation = createSelector(
  selectABRequestsState,
  state => state.locations
);


export const ABRequestsSelector = {
  selectabRequests,
  selectabRequestCount,
  selectLoading,
  selecthasError,
  selectApprovedDetail,
  selectLocation
};
