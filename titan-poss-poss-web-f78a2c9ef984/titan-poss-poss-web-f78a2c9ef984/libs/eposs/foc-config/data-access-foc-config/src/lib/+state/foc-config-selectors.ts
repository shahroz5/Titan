import { createSelector } from '@ngrx/store';
import { selectFocConfigurationState } from './foc-config-reducer';

const selectFocConfigList = createSelector(
  selectFocConfigurationState,
  state => state.focConfigList
);

const selectSchemeDetails = createSelector(
  selectFocConfigurationState,
  state => state.schemeDetails
);

const selectFocTypeState = createSelector(
  selectFocConfigurationState,
  state => state.focTypeSate
);

const selectError = createSelector(
  selectFocConfigurationState,
  state => state.error
);
const selectIsLoading = createSelector(
  selectFocConfigurationState,
  state => state.isLoading
);
const selectHassaved = createSelector(
  selectFocConfigurationState,
  state => state.hasSaved
);
const selectHasUpdated = createSelector(
  selectFocConfigurationState,
  state => state.hasUpdated
);

const selectIsLocationUpdated = createSelector(
  selectFocConfigurationState,
  state => state.isLocationUpdated
);
const selectTotalElement = createSelector(
  selectFocConfigurationState,
  state => state.totalElements
);

const selectRangeWeight = createSelector(
  selectFocConfigurationState,
  state => state.rangeWeight
);

const selectValueBasedVariantDetails = createSelector(
  selectFocConfigurationState,
  state => state.valueBasedVariantDetails
);

const selectWeightBasedVariantDetails = createSelector(
  selectFocConfigurationState,
  state => state.weightBasedVariantDetails
);
const selectProductGroups = createSelector(
  selectFocConfigurationState,
  state => state.productGroups
);

const selectLocationList = createSelector(
  selectFocConfigurationState,
  state => state.locationList
);
const selectItemCodes = createSelector(
  selectFocConfigurationState,
  state => state.itemCodes
);
const selectHasFocItemsSaved = createSelector(
  selectFocConfigurationState,
  state => state.hasSavedFocItems
);
const selectMappedFocItems = createSelector(
  selectFocConfigurationState,
  state => state.mappedFocItems
);
const selectTotalFocItems = createSelector(
  selectFocConfigurationState,
  state => state.totalFocItems
);
const selectSchemeDetailsById = createSelector(
  selectFocConfigurationState,
  state => state.schemeDetailsById
);
const selectHasProductsUpdated = createSelector(
  selectFocConfigurationState,
  state => state.hasProductsUpdated
);
const selectLocationCount = createSelector(
  selectFocConfigurationState,
  state => state.totalLocation
);

const selectlLoadMappedProdcutGroup = createSelector(
  selectFocConfigurationState,
  state => state.loadMappedProdcutGroup
);

const selectIsPublished = createSelector(
  selectFocConfigurationState,
  state => state.isPublished
);

// View specific
const selectValueBasedVariantDetailsGoldStandard = createSelector(
  selectFocConfigurationState,
  state => state.valueBasedVariantDetailsGoldStandard
);
const selectValueBasedVariantDetailsGoldSlab = createSelector(
  selectFocConfigurationState,
  state => state.valueBasedVariantDetailsGoldSlab
);
const selectWeightBasedVariantDetailsGoldStandard = createSelector(
  selectFocConfigurationState,
  state => state.weightBasedVariantDetailsGoldStandard
);
const selectWeightBasedVariantDetailsGoldSlab = createSelector(
  selectFocConfigurationState,
  state => state.weightBasedVariantDetailsGoldSlab
);

const selectValueBasedVariantDetailsOthersStandard = createSelector(
  selectFocConfigurationState,
  state => state.valueBasedVariantDetailsOthersStandard
);
const selectValueBasedVariantDetailsOthersSlab = createSelector(
  selectFocConfigurationState,
  state => state.valueBasedVariantDetailsOthersSlab
);
const selectWeightBasedVariantDetailsOthersStandard = createSelector(
  selectFocConfigurationState,
  state => state.weightBasedVariantDetailsOthersStandard
);
const selectWeightBasedVariantDetailsOthersSlab = createSelector(
  selectFocConfigurationState,
  state => state.weightBasedVariantDetailsOthersSlab
);
const selectAllFocItemCodes = createSelector(
  selectFocConfigurationState,
  state => state.allSelectedItemCodes
);
const selectAllSelectedLocationCodes = createSelector(
  selectFocConfigurationState,
  state => state.allSelectedLocationCodes
);
// View specific ends
export const focConfigurationSelectors = {
  selectFocConfigList,
  selectSchemeDetails,
  selectError,
  selectHasUpdated,
  selectHassaved,
  selectIsLoading,
  selectTotalElement,
  selectRangeWeight,
  selectValueBasedVariantDetails,
  selectWeightBasedVariantDetails,
  selectProductGroups,
  selectLocationList,
  selectIsLocationUpdated,
  selectItemCodes,
  selectHasFocItemsSaved,
  selectMappedFocItems,
  selectTotalFocItems,
  selectSchemeDetailsById,
  selectHasProductsUpdated,
  selectLocationCount,
  selectlLoadMappedProdcutGroup,
  selectIsPublished,
  selectValueBasedVariantDetailsGoldStandard,
  selectValueBasedVariantDetailsGoldSlab,
  selectWeightBasedVariantDetailsGoldStandard,
  selectWeightBasedVariantDetailsGoldSlab,
  selectValueBasedVariantDetailsOthersStandard,
  selectValueBasedVariantDetailsOthersSlab,
  selectWeightBasedVariantDetailsOthersStandard,
  selectWeightBasedVariantDetailsOthersSlab,
  selectAllFocItemCodes,
  selectAllSelectedLocationCodes,
  selectFocTypeState
};
