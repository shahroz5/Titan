import { createSelector } from '@ngrx/store';
import { selectWeightValueConfigState } from './weight-value-config.reducer';

const selectWeightValueConfigListing = createSelector(
  selectWeightValueConfigState,
  state => state.weightValueConfigListing
);

const selectWeightValueConfigDetails = createSelector(
  selectWeightValueConfigState,
  state => state.weightValueConfigDetails
);

const selectWeightValueConfigDetailsSaved = createSelector(
  selectWeightValueConfigState,
  state => state.weightValueConfigDetailsSaved
);

const selectWeightValueConfigDetailsEdited = createSelector(
  selectWeightValueConfigState,
  state => state.weightValueConfigDetailsEdited
);

const selectWeightValueConfigTotal = createSelector(
  selectWeightValueConfigState,
  state => state.totalWeightValueConfig
);

const selectIsLoading = createSelector(
  selectWeightValueConfigState,
  state => state.isLoading
);

const selectError = createSelector(
  selectWeightValueConfigState,
  state => state.error
);

export const WeightValueConfigSelectors = {
  selectWeightValueConfigListing,
  selectWeightValueConfigTotal,
  selectWeightValueConfigDetails,
  selectWeightValueConfigDetailsSaved,
  selectWeightValueConfigDetailsEdited,
  selectIsLoading,
  selectError
};
