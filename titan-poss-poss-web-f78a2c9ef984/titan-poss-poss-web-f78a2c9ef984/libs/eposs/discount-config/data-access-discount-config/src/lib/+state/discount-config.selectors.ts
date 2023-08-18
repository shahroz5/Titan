import { createSelector } from '@ngrx/store';
import { selectDiscountConfigState } from './discount-config.reducer';

const selectIsloading = createSelector(
  selectDiscountConfigState,
  state => state.isLoading
);
const selectError = createSelector(
  selectDiscountConfigState,
  state => state.error
);

const selectIsEmailResent = createSelector(
  selectDiscountConfigState,
  state => state.isEmailResent
);

const selectDscountConfigList = createSelector(
  selectDiscountConfigState,
  state => state.discountConfigList
);
const selectBestDealDiscountList = createSelector(
  selectDiscountConfigState,
  state => state.bestDealDiscountList
);
const selectBestDealDiscountCount = createSelector(
  selectDiscountConfigState,
  state => state.bestDealDiscountCount
);
const selectSelectedBestDealDiscountCount = createSelector(
  selectDiscountConfigState,
  state => state.selectedBestDealDiscountCount
);
const selectTotalDiscountConfigs = createSelector(
  selectDiscountConfigState,
  state => state.totalCount
);

const selectTotalDiscountRequests = createSelector(
  selectDiscountConfigState,
  state => state.discountRequestCount
);
const selectDiscountDetails = createSelector(
  selectDiscountConfigState,
  state => state.discountDetails
);

const selectDiscountRequests = createSelector(
  selectDiscountConfigState,
  state => state.discountRequestList
);
const selectIsSaved = createSelector(
  selectDiscountConfigState,
  state => state.hasSaved
);
const selectIsEdited = createSelector(
  selectDiscountConfigState,
  state => state.hasUpdated
);
const selectIsLotAge = createSelector(
  selectDiscountConfigState,
  state => state.saveLotAge
);
const selectIsMaxPercentage = createSelector(
  selectDiscountConfigState,
  state => state.saveMaxPercentage
);
const selectDiscountLocations = createSelector(
  selectDiscountConfigState,
  state => state.discountLocations
);
const selectLocationCount = createSelector(
  selectDiscountConfigState,
  state => state.locationCount
);
const selectDiscountProductCategories = createSelector(
  selectDiscountConfigState,
  state => state.discountProductCategories
);
const selectProductCategoryCount = createSelector(
  selectDiscountConfigState,
  state => state.productCategoryCount
);
const selectDiscountProductGroups = createSelector(
  selectDiscountConfigState,
  state => state.discountProductGroups
);
const selecttProductGroupCount = createSelector(
  selectDiscountConfigState,
  state => state.productGroupCount
);
const selectDiscountExcludeTypes = createSelector(
  selectDiscountConfigState,
  state => state.discountExcludeItems
);
const selectDiscountExcludeItemCodes = createSelector(
  selectDiscountConfigState,
  state => state.excludeItemCodes
);
const selectExcludeTypeCount = createSelector(
  selectDiscountConfigState,
  state => state.excludeConfigCount
);
const selectExcludeItemCodesCount = createSelector(
  selectDiscountConfigState,
  state => state.excludeItemCount
);
const selectSaveLocations = createSelector(
  selectDiscountConfigState,
  state => state.saveLocations
);
const selectSaveProductCategories = createSelector(
  selectDiscountConfigState,
  state => state.saveProductCategories
);

const selectSaveBestDealDiscount = createSelector(
  selectDiscountConfigState,
  state => state.saveBestDealDiscounts
);
const selectSaveProductGroups = createSelector(
  selectDiscountConfigState,
  state => state.saveProductGroups
);
const selectIsExcludeThemeSaved = createSelector(
  selectDiscountConfigState,
  state => state.isExcludeThemeSaved
);
const selectIsExcludeTypeSaved = createSelector(
  selectDiscountConfigState,
  state => state.isExcludeTypeSaved
);

const selectIsExcludeSchemeSaved = createSelector(
  selectDiscountConfigState,
  state => state.isExcludeSchemeSaved
);

const selectMappedLocations = createSelector(
  selectDiscountConfigState,
  state => state.selectedLocations
);
const selectMappedProductGroups = createSelector(
  selectDiscountConfigState,
  state => state.selectedProductGroups
);
const selectMappedProductCategories = createSelector(
  selectDiscountConfigState,
  state => state.selectedProductCategories
);

const selectMappedBestDealDiscount = createSelector(
  selectDiscountConfigState,
  state => state.selectedBestDealDiscount
);
const selectIsPublishedDiscountConfig = createSelector(
  selectDiscountConfigState,
  state => state.isPublished
);

const selectIsDiscountSentForApproval = createSelector(
  selectDiscountConfigState,
  state => state.isDiscountSentForApproval
);

const selectIsDiscountApproved = createSelector(
  selectDiscountConfigState,
  state => state.isDiscountApproved
);
const selectDiscountTypes = createSelector(
  selectDiscountConfigState,
  state => state.discountTypes
);
const selectClubbingDiscountTypes = createSelector(
  selectDiscountConfigState,
  state => state.clubbingDiscountTypes
);
const selectApprovers = createSelector(
  selectDiscountConfigState,
  state => state.approvers
);
const selectDiscDetails = createSelector(
  selectDiscountConfigState,
  state => state.discDetails
);
const selectSlabDetails = createSelector(
  selectDiscountConfigState,
  state => state.slabDetails
);

const selectEmpowermentDiscounts = createSelector(
  selectDiscountConfigState,
  state => state.empowermentDiscounts
);
const selectEmpowermentUpdatedDiscount = createSelector(
  selectDiscountConfigState,
  state => state.empowermentUpdatedDiscount
);

const selectIsDiscDetailsSaved = createSelector(
  selectDiscountConfigState,
  state => state.isDiscDetailsSaved
);

const selectDiscountComponentProductGroups = createSelector(
  selectDiscountConfigState,
  state => state.discountComponentProductGroups
);

const selectDiscountComponentPGConfig = createSelector(
  selectDiscountConfigState,
  state => state.discountComponentPGConfig
);

const selectIsDiscountComponentPGConfigSaved = createSelector(
  selectDiscountConfigState,
  state => state.isDiscountComponentPGConfigSaved
);

const selectDiscountComponentPGConfigCount = createSelector(
  selectDiscountConfigState,
  state => state.discountComponentPGConfigCount
);
const selectApplicableLevels = createSelector(
  selectDiscountConfigState,
  state => state.applicableLevels
);
const selectSubBrands = createSelector(
  selectDiscountConfigState,
  state => state.subBrands
);
const selectBrands = createSelector(
  selectDiscountConfigState,
  state => state.brands
);

const selectRangeTEPDuration = createSelector(
  selectDiscountConfigState,
  state => state.rangeTepDuration
);

const selectIsTsssComputed = createSelector(
  selectDiscountConfigState,
  state => state.isTsssComputed
);

const selectDownloadTsssConfigUrl = createSelector(
  selectDiscountConfigState,
  state => state.tsssConfigCouponResponse
);

const selectFaqFileUpload = createSelector(
  selectDiscountConfigState,
  state => state.faqFileUploadResponse
);

const selectFaqFileDownload = createSelector(
  selectDiscountConfigState,
  state => state.faqFileDownloadResponse
);

export const DiscountConfigSelectors = {
  selectIsloading,
  selectError,
  selectIsSaved,
  selectIsEdited,
  selectDscountConfigList,
  selectTotalDiscountConfigs,
  selectDiscountDetails,
  selectDiscountLocations,
  selectLocationCount,
  selectDiscountProductCategories,
  selectProductCategoryCount,
  selectDiscountProductGroups,
  selecttProductGroupCount,
  selectSaveLocations,
  selectSaveProductCategories,
  selectSaveProductGroups,
  selectIsExcludeThemeSaved,
  selectIsExcludeTypeSaved,
  selectIsExcludeSchemeSaved,
  selectDiscountExcludeTypes,
  selectExcludeTypeCount,
  selectDiscountExcludeItemCodes,
  selectExcludeItemCodesCount,
  selectMappedLocations,
  selectMappedProductGroups,
  selectMappedProductCategories,
  selectBestDealDiscountList,
  selectBestDealDiscountCount,
  selectIsPublishedDiscountConfig,
  selectIsLotAge,
  selectIsMaxPercentage,
  selectMappedBestDealDiscount,
  selectSaveBestDealDiscount,
  selectDiscountTypes,
  selectClubbingDiscountTypes,
  selectApprovers,
  selectDiscDetails,
  selectSlabDetails,
  selectIsDiscDetailsSaved,
  selectDiscountComponentProductGroups,
  selectDiscountComponentPGConfig,
  selectIsDiscountComponentPGConfigSaved,
  selectDiscountComponentPGConfigCount,
  selectApplicableLevels,
  selectIsDiscountSentForApproval,
  selectIsDiscountApproved,
  selectBrands,
  selectSubBrands,
  selectRangeTEPDuration,
  selectIsTsssComputed,
  selectDownloadTsssConfigUrl,
  selectDiscountRequests,
  selectTotalDiscountRequests,
  selectEmpowermentDiscounts,
  selectEmpowermentUpdatedDiscount,
  selectSelectedBestDealDiscountCount,
  selectFaqFileUpload,
  selectFaqFileDownload,
  selectIsEmailResent
};
