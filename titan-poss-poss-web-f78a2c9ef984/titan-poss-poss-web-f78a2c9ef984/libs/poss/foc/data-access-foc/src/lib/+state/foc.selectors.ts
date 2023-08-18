import { createSelector } from '@ngrx/store';
import { selectFocState } from './foc.reducer';

const selectPendingCM = createSelector(
  selectFocState,
  state => state.pendingFocCm
);

const selectIsLoadingPendingCM = createSelector(
  selectFocState,
  state => state.isLoadingPendingCM
);

const selectSelectedPendingCM = createSelector(
  selectFocState,
  state => state.selectedPendingCM
);
const selectPendingFocScheme = createSelector(
  selectFocState,
  state => state.pendingFocSchemes
);
const selectIsLoadingPendingScheme = createSelector(
  selectFocState,
  state => state.isLoadingPendingFocSchemes
);
const selectIsLoadingFocItemDetails = createSelector(
  selectFocState,
  state => state.isLoadingFocItemDetails
);

const selectHasFocItemDetails = createSelector(
  selectFocState,
  state => state.hasFocItemDetails
);
const selectFocItemDetails = createSelector(
  selectFocState,
  state => state.focItemDetails
);
const selectIsLoadingManualFocItemDetails = createSelector(
  selectFocState,
  state => state.isLoadingManualFocItemDetails
);

const selectHasManualFocItemDetails = createSelector(
  selectFocState,
  state => state.hasManualFocItemDetails
);
const selectManulFocItemDetails = createSelector(
  selectFocState,
  state => state.manualFocItemDetails
);
const selectIssuePendingFocResponse = createSelector(
  selectFocState,
  state => state.pendingIssueResponse
);
const selectIsIssuingPendingFOC = createSelector(
  selectFocState,
  state => state.isIssuingPendingFOC
);
const selectFocItems = createSelector(selectFocState, state => state.focItems);
// const selecFocItemsCount = createSelector(selectFocItems, data =>
//   data
//     .map(item => item.quantity)
//     .reduce((quantity1, quantity2) => +quantity1 + +quantity2, 0)
// );
// const selectTotalFocIssuingWt = createSelector(selectFocItems, data =>
//   data
//     .map(item => item.actualWeight)
//     .reduce((weight1, weight2) => weight1 + weight2, 0)
// );
// const selectTotalEligibleWt = createSelector(selectPendingFocScheme, data =>
//   data.focSchemes
//     .map(focScheme => focScheme.eligiblWeight)
//     .reduce((weight1, weight2) => weight1 + weight2, 0)
// );
const selectError = createSelector(selectFocState, state => state.error);

const selectIsLoading = createSelector(
  selectFocState,
  state => state.isLoading
);
const selectAvailableSchemes = createSelector(
  selectFocState,
  state => state.availableFocSchemes
);
const selectFocSchemes = createSelector(
  selectFocState,
  state => state.focSchemes
);

const selectManualFocItems = createSelector(
  selectFocState,
  state => state.manualFocSchemes
);

const selectFocAddedToCm = createSelector(
  selectFocState,
  state => state.focAddedToCM
);
const selectIsFocAdded = createSelector(
  selectFocState,
  state => state.isFocAdded
);

const selectManualFocAddedToCm = createSelector(
  selectFocState,
  state => state.manualFocAddedToCM
);
const selectIsManualFocAdded = createSelector(
  selectFocState,
  state => state.isManualFocAdded
);
const selectPendingFocSchemeIds = createSelector(
  selectFocState,
  state => state.pendingFocSchemeIds
);
const selectIsFocSchemesLoaded = createSelector(
  selectFocState,
  state => state.isFocSchemesLoaded
);
const selectKeepFocPendingTrigger = createSelector(
  selectFocState,
  state => state.keepFOCPendingTrigger
);
const selectIsFocKeptPending = createSelector(
  selectFocState,
  state => state.isFocKeptPending
);
const selectIsFocSchemesForItems = createSelector(
  selectFocState,
  state => state.isFocSchemesForItems
);

// AB FOC

const selectABFocSchemes = createSelector(
  selectFocState,
  state => state.ABFocSchemes
);
const selectABFocSchemesForItems = createSelector(
  selectFocState,
  state => state.ABFocSchemesForItems
);
const selectSelectedABFocSchemes = createSelector(
  selectFocState,
  state => state.SelectedABFocSchemes
);
const selectSelectedABFocSchemesCount = createSelector(
  selectFocState,
  state => state.SelectedABFocSchemesCount
);
const selectSavedABFocSchemes = createSelector(
  selectFocState,
  state => state.SaveFocSchemes
);
const selectDeletedABFocSchemes = createSelector(
  selectFocState,
  state => state.deleteABFOCSchemesRes
);

const selectIsManualFocValidated = createSelector(
  selectFocState,
  state => state.manualFocValidationDetails
);

const selectIsManualFocVerified = createSelector(
  selectFocState,
  state => state.isManualFocVerified
);
export const FocSelector = {
  selectPendingCM,
  selectIsLoadingPendingCM,
  selectSelectedPendingCM,
  selectPendingFocScheme,
  selectIsLoadingPendingScheme,
  selectIsLoadingFocItemDetails,
  selectHasFocItemDetails,
  selectFocItemDetails,
  selectIssuePendingFocResponse,
  selectIsIssuingPendingFOC,
  selectFocItems,
  // selecFocItemsCount,
  // selectTotalFocIssuingWt,
  // selectTotalEligibleWt,
  selectError,

  selectIsLoading,
  selectAvailableSchemes,
  selectFocSchemes,
  selectIsFocSchemesLoaded,
  selectFocAddedToCm,
  selectIsFocAdded,
  selectPendingFocSchemeIds,
  selectKeepFocPendingTrigger,
  selectIsFocKeptPending,
  selectIsFocSchemesForItems,

  // AB FOC

  selectABFocSchemes,
  selectABFocSchemesForItems,
  selectSelectedABFocSchemes,
  selectSelectedABFocSchemesCount,
  selectSavedABFocSchemes,
  selectDeletedABFocSchemes,
  selectManualFocItems,
  selectIsLoadingManualFocItemDetails,
  selectHasManualFocItemDetails,
  selectManulFocItemDetails,
  selectIsManualFocValidated,
  selectManualFocAddedToCm,
  selectIsManualFocAdded,
  selectIsManualFocVerified
};
