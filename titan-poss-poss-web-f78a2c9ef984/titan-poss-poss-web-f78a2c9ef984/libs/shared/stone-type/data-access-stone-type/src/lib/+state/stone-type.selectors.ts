import { createSelector } from '@ngrx/store';
import { selectStoneTypeState } from './stone-type.reducer';

const selectStoneTypeDetailsListing = createSelector(
  selectStoneTypeState,
  state => state.stoneTypeListing
);

const selectTotalStoneTypeDetailsCount = createSelector(
  selectStoneTypeState,
  state => state.totalStoneTypeDetails
);

const selectStoneTypeDetailsByStoneTypeCode = createSelector(
  selectStoneTypeState,
  state => state.stoneTypeDetails
);

const selectIsLoading = createSelector(
  selectStoneTypeState,
  state => state.isLoading
);

const selectError = createSelector(
  selectStoneTypeState,
  state => state.error
);

const selectSavestoneTypeFormResponse = createSelector(
  selectStoneTypeState,
  state => state.saveStoneTypeResponses
);

const selectEditstoneTypeFormResponse = createSelector(
  selectStoneTypeState,
  state => state.editStoneTypeResponses
);

export const StoneTypeSelectors = {
  selectStoneTypeDetailsListing,
  selectStoneTypeDetailsByStoneTypeCode,
  selectIsLoading,
  selectError,
  selectTotalStoneTypeDetailsCount,
  selectSavestoneTypeFormResponse,
  selectEditstoneTypeFormResponse
};
