import { createSelector } from '@ngrx/store';
import { selectGEPPurityConfiguration } from './gep-purity-config.reducer';

const selectGepPurityConfigList = createSelector(
  selectGEPPurityConfiguration,
  state => state.GEPPurityConfigList
);
const selectCount = createSelector(
  selectGEPPurityConfiguration,
  state => state.totalElements
);
const selectIsLoading = createSelector(
  selectGEPPurityConfiguration,
  state => state.isLoading
);
const selectError = createSelector(
  selectGEPPurityConfiguration,
  state => state.error
);
const selectHasGEPDetailsSaved = createSelector(
  selectGEPPurityConfiguration,
  state => state.hasGEPDetailsSaved
);

const selectMetalTypes = createSelector(
  selectGEPPurityConfiguration,
  state => state.metalType
);
const selectItemTypes = createSelector(
  selectGEPPurityConfiguration,
  state => state.itemType
);

const selectHasPurityDetailsSaved = createSelector(
  selectGEPPurityConfiguration,
  state => state.hasPurityDetailsSaved
);
const selectExcludeThemeCodes = createSelector(
  selectGEPPurityConfiguration,
  state => state.excludeThemeCodes
);
const selectExcludeItemCodes = createSelector(
  selectGEPPurityConfiguration,
  state => state.excludeItemCodes
);
const selectProductGroups = createSelector(
  selectGEPPurityConfiguration,
  state => state.productGroups
);
const selectConfigId = createSelector(
  selectGEPPurityConfiguration,
  state => state.configId
);

const selectHasProductGroupsDeducted = createSelector(
  selectGEPPurityConfiguration,
  state => state.hasGroupsSaved
);
const selectHasProductGroupsDataUpdated = createSelector(
  selectGEPPurityConfiguration,
  state => state.hasGroupsDataUpdated
);
const selectGepDetails = createSelector(
  selectGEPPurityConfiguration,
  state => state.gepDetails
);
const selectPurityDetails = createSelector(
  selectGEPPurityConfiguration,
  state => state.purityDetails
);
const selectProductGroupsDeduction = createSelector(
  selectGEPPurityConfiguration,
  state => state.productGroupsDeduction
);
const selectHasSearched = createSelector(
  selectGEPPurityConfiguration,
  state => state.hasSearched
);
const selectHasThemeCodeSaved = createSelector(
  selectGEPPurityConfiguration,
  state => state.hasThemeCodeSaved
);
const selectHasThemeCodeRemoved = createSelector(
  selectGEPPurityConfiguration,
  state => state.hasThemeCodeRemoved
);

const selectHasRemoveProductGroup = createSelector(
  selectGEPPurityConfiguration,
  state => state.hasProductGroupRemoved
);

const selectErrorLog = createSelector(
  selectGEPPurityConfiguration,
  state => state.errorLog
);
const selectFileUploadResponse = createSelector(
  selectGEPPurityConfiguration,
  state => state.fileResponse
);
const selectTotalItemCodes = createSelector(
  selectGEPPurityConfiguration,
  state => state.totalElements
);
const selectProductGroupsCount = createSelector(
  selectGEPPurityConfiguration,
  state => state.productGroupsCount
);
const selectHasUpdatedToggleButton = createSelector(
  selectGEPPurityConfiguration,
  state => state.hasUpdateToggleButton
);

const selectSilverRanges = createSelector(
  selectGEPPurityConfiguration,
  state => state.silverRanges
);
const selectPlatinumRanges = createSelector(
  selectGEPPurityConfiguration,
  state => state.platinumRanges
);
const selectGoldRanges = createSelector(
  selectGEPPurityConfiguration,
  state => state.goldRanges
);

const selectedProductGroups = createSelector(
  selectGEPPurityConfiguration,
  state => state.allSelectedGroups
);
export const GEPPurityConfigSelectors = {
  selectGepPurityConfigList,
  selectCount,
  selectIsLoading,
  selectError,
  selectHasGEPDetailsSaved,
  selectMetalTypes,
  selectItemTypes,
  selectHasPurityDetailsSaved,
  selectExcludeThemeCodes,
  selectExcludeItemCodes,
  selectProductGroups,
  selectConfigId,
  selectHasProductGroupsDeducted,
  selectHasProductGroupsDataUpdated,
  selectGepDetails,
  selectPurityDetails,
  selectProductGroupsDeduction,
  selectHasSearched,
  selectHasThemeCodeSaved,
  selectHasThemeCodeRemoved,
  selectHasRemoveProductGroup,
  selectErrorLog,
  selectFileUploadResponse,
  selectTotalItemCodes,
  selectProductGroupsCount,
  selectHasUpdatedToggleButton,
  selectGoldRanges,
  selectSilverRanges,
  selectPlatinumRanges,
  selectedProductGroups
};
