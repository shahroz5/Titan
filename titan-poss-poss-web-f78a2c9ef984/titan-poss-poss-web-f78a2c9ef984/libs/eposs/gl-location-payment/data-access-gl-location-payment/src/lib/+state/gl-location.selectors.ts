import { createSelector } from '@ngrx/store';
import { selectGlLocationPaymentState } from './gl-location.reducer';
import { glLocPaymentSelector } from './gl-location.entity';

export const selectIsLoading = createSelector(
  selectGlLocationPaymentState,
  state => state.isLoading
);
export const selectError = createSelector(
  selectGlLocationPaymentState,
  state => state.error
);
export const selectIsSaved = createSelector(
  selectGlLocationPaymentState,
  state => state.hasSaved
);
export const selectGlLocationPaymentListing = createSelector(
  selectGlLocationPaymentState,
  state => state.glLocationList
);
export const selectGlLocPaymentList = createSelector(
  selectGlLocationPaymentListing,
  glLocPaymentSelector.selectAll
);
export const selectSaveGlLocationPayment = createSelector(
  selectGlLocationPaymentState,
  state => state.saveGlLocationPayment
);
export const selectTotalElements = createSelector(
  selectGlLocationPaymentState,
  state => state.totalCount
);

export const selectPaymentCodes = createSelector(
  selectGlLocationPaymentState,
  state => state.paymentCodes
);
export const selectLocationCodes = createSelector(
  selectGlLocationPaymentState,
  state => state.locationData
);
export const GlLocationPaymentSelectors = {
  selectIsLoading,
  selectIsSaved,
  selectError,
  selectGlLocationPaymentListing,
  selectSaveGlLocationPayment,
  selectTotalElements,
  selectGlLocPaymentList,
  selectPaymentCodes,
  selectLocationCodes
};
