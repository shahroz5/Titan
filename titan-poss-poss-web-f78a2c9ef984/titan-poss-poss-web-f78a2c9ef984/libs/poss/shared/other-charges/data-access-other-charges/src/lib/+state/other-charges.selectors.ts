import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OtherChargesFeatureKey } from './other-charges.reducer';
import { OtherChargesState } from './other-charges.state';

export const selectOtherChargesState = createFeatureSelector<OtherChargesState>(
  OtherChargesFeatureKey
);

const selectHasError = createSelector(
  selectOtherChargesState,
  state => state.hasError
);

const selectIsLoading = createSelector(
  selectOtherChargesState,
  state => state.isLoading
);

const selectPartialUpdateCashMemoResponse = createSelector(
  selectOtherChargesState,
  state => state.partialUpdateCashMemoResponse
);
const selectTaxDetails = createSelector(
  selectOtherChargesState,
  state => state.taxDetails
);

const selectReasons = createSelector(
  selectOtherChargesState,
  state => state.reasons
);

export const OtherChargesSelectors = {
  selectHasError,
  selectIsLoading,
  selectTaxDetails,
  selectReasons,
  selectPartialUpdateCashMemoResponse
};
