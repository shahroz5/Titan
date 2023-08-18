import { createSelector } from '@ngrx/store';
import { selectBinState } from './bin.reducer';
import { binSelector } from './bin.entity';

export const selectTotalBinCodeDetailsCount = createSelector(
  selectBinState,
  state => state.totalBinCodeDetails
);

export const selectIsBinCodeLoading = createSelector(
  selectBinState,
  state => state.isBinCodeLoading
);

export const selectBinCodeNewFormResponse = createSelector(
  selectBinState,
  state => state.binCodeSaveNewResponses
);

export const selectBinCodeEditFormResponse = createSelector(
  selectBinState,
  state => state.editBinCodeResponses
);

export const selectLocationMappingResponse = createSelector(
  selectBinState,
  state => state.locationMappingResponse
);

export const selectBinCodeDetailsListing = createSelector(
  selectBinState,
  state => state.binCodeDetailsListing
);

export const binCodesByBinGroupCode = createSelector(
  selectBinState,
  state => state.binCodesByBinGroup
);

export const selectbinCodesByBinGroupCode = createSelector(
  binCodesByBinGroupCode,
  binSelector.selectAll
);

export const selectLocationsByBinCodesAndBinGroup = createSelector(
  selectBinState,
  state => state.locationsByBinCodesAndBinGroup
);

export const selectError = createSelector(selectBinState, state => state.error);

export const selectIssearchElements = createSelector(
  selectBinState,
  state => state.isSearchElements
);

export const BinSelectors = {
  selectBinCodeNewFormResponse,
  selectBinCodeDetailsListing,
  selectTotalBinCodeDetailsCount,
  selectbinCodesByBinGroupCode,
  selectIsBinCodeLoading,
  selectBinCodeEditFormResponse,
  selectError,
  selectLocationsByBinCodesAndBinGroup,
  selectLocationMappingResponse,
  selectIssearchElements,
  binCodesByBinGroupCode
};
