import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as DiscountConfigActions from './discount-config.actions';
import { DiscountConfigState } from './discount-config.state';
import { DiscountConfigSelectors } from './discount-config.selectors';
import {
  DiscounExcludeItemListPayload,
  DiscountLocationListPayload,
  DiscountProductCategoryListPayload,
  DiscountProductGroupListPayload,
  DisountConfigListPayload,
  NewDiscountApplicableConfig,
  NewDiscountDetails,
  ProductGroupMappingOption,
  SaveBestDealDiscountPayload,
  SaveDiscountLocationsPayload,
  SaveDiscountProductCategoryPayload,
  SaveDiscountProductGroupPayload,
  SaveDiscountThemesPayload,
  SaveExcludeTypePayload,
  SaveDiscountSchemesPayload,
  RequestPayload,
  discountWorkflowpayload,
  FaqRequestPaylaod,
  FaqFileUploadResponse
} from '@poss-web/shared/models';

@Injectable()
export class DiscountConfigFacade {
  constructor(public store: Store<DiscountConfigState>) {}

  private isLoading$ = this.store.select(
    DiscountConfigSelectors.selectIsloading
  );
  private error$ = this.store.select(DiscountConfigSelectors.selectError);

  private hasSaved$ = this.store.select(DiscountConfigSelectors.selectIsSaved);
  private hasUpdated$ = this.store.select(
    DiscountConfigSelectors.selectIsEdited
  );
  private isLocationsSaved$ = this.store.select(
    DiscountConfigSelectors.selectSaveLocations
  );
  private isProductCategoriesSaved$ = this.store.select(
    DiscountConfigSelectors.selectSaveProductCategories
  );
  private isProductGroupsSaved$ = this.store.select(
    DiscountConfigSelectors.selectSaveProductGroups
  );
  private discountConfigList$ = this.store.select(
    DiscountConfigSelectors.selectDscountConfigList
  );

  private bestDealDiscountList$ = this.store.select(
    DiscountConfigSelectors.selectBestDealDiscountList
  );

  private bestDealDiscountCount$ = this.store.select(
    DiscountConfigSelectors.selectBestDealDiscountCount
  );
  private discountRequestCount$ = this.store.select(
    DiscountConfigSelectors.selectTotalDiscountRequests
  );

  private discountRequestList$ = this.store.select(
    DiscountConfigSelectors.selectDiscountRequests
  );

  private selectedBestDealDiscountCount$ = this.store.select(
    DiscountConfigSelectors.selectSelectedBestDealDiscountCount
  );
  private totalDiscountConfigList$ = this.store.select(
    DiscountConfigSelectors.selectTotalDiscountConfigs
  );
  private totalDiscountDetails$ = this.store.select(
    DiscountConfigSelectors.selectDiscountDetails
  );
  private totalDiscountLocations$ = this.store.select(
    DiscountConfigSelectors.selectLocationCount
  );
  private discountLocationList$ = this.store.select(
    DiscountConfigSelectors.selectDiscountLocations
  );
  private saveLotAge$ = this.store.select(
    DiscountConfigSelectors.selectIsLotAge
  );
  private saveMaxPercentage$ = this.store.select(
    DiscountConfigSelectors.selectIsMaxPercentage
  );
  private totalDiscountProductCategories$ = this.store.select(
    DiscountConfigSelectors.selectProductCategoryCount
  );
  private discountProductCategoryList$ = this.store.select(
    DiscountConfigSelectors.selectDiscountProductCategories
  );
  private totalDiscountProductGroups$ = this.store.select(
    DiscountConfigSelectors.selecttProductGroupCount
  );
  private discountProductGroupList$ = this.store.select(
    DiscountConfigSelectors.selectDiscountProductGroups
  );
  private totalDiscountExcludeTypes$ = this.store.select(
    DiscountConfigSelectors.selectExcludeTypeCount
  );
  private discountExcludeTypeList$ = this.store.select(
    DiscountConfigSelectors.selectDiscountExcludeTypes
  );
  private totalDiscountExcludeItemCodes$ = this.store.select(
    DiscountConfigSelectors.selectExcludeItemCodesCount
  );
  private discountExcludeItemCodes$ = this.store.select(
    DiscountConfigSelectors.selectDiscountExcludeItemCodes
  );
  private isExcludeThemeSaved$ = this.store.select(
    DiscountConfigSelectors.selectIsExcludeThemeSaved
  );
  private isExcludeTypeSaved$ = this.store.select(
    DiscountConfigSelectors.selectIsExcludeTypeSaved
  );
  private isExcludeSchemeSaved$ = this.store.select(
    DiscountConfigSelectors.selectIsExcludeSchemeSaved
  );
  private mappedLocations$ = this.store.select(
    DiscountConfigSelectors.selectMappedLocations
  );

  private mappedProductGroups$ = this.store.select(
    DiscountConfigSelectors.selectMappedProductGroups
  );
  private mappedProductCategories$ = this.store.select(
    DiscountConfigSelectors.selectMappedProductCategories
  );

  private saveBestDealDiscount$ = this.store.select(
    DiscountConfigSelectors.selectSaveBestDealDiscount
  );

  private mappedBestDealDiscounts$ = this.store.select(
    DiscountConfigSelectors.selectMappedBestDealDiscount
  );

  private isPublished$ = this.store.select(
    DiscountConfigSelectors.selectIsPublishedDiscountConfig
  );

  private isSentForAproval$ = this.store.select(
    DiscountConfigSelectors.selectIsDiscountSentForApproval
  );
  private isDiscountAppproved$ = this.store.select(
    DiscountConfigSelectors.selectIsDiscountApproved
  );
  private discountTypes$ = this.store.select(
    DiscountConfigSelectors.selectDiscountTypes
  );
  private clubbingDiscountTypes$ = this.store.select(
    DiscountConfigSelectors.selectClubbingDiscountTypes
  );
  private approvers$ = this.store.select(
    DiscountConfigSelectors.selectApprovers
  );

  private slabDetails$ = this.store.select(
    DiscountConfigSelectors.selectSlabDetails
  );
  private discountDetails$ = this.store.select(
    DiscountConfigSelectors.selectDiscDetails
  );

  private empowermentUpdatedDiscount$ = this.store.select(
    DiscountConfigSelectors.selectEmpowermentUpdatedDiscount
  );
  private empowermentDiscounts$ = this.store.select(
    DiscountConfigSelectors.selectEmpowermentDiscounts
  );

  private discountDetailsSaved$ = this.store.select(
    DiscountConfigSelectors.selectIsDiscDetailsSaved
  );

  private discountComponentProductGroups$ = this.store.select(
    DiscountConfigSelectors.selectDiscountComponentProductGroups
  );

  private discountComponentPGConfig$ = this.store.select(
    DiscountConfigSelectors.selectDiscountComponentPGConfig
  );

  private isDiscountComponentPGConfigSaved$ = this.store.select(
    DiscountConfigSelectors.selectIsDiscountComponentPGConfigSaved
  );

  private discountComponentPGConfigCount$ = this.store.select(
    DiscountConfigSelectors.selectDiscountComponentPGConfigCount
  );
  private applicableLevels$ = this.store.select(
    DiscountConfigSelectors.selectApplicableLevels
  );
  private brands$ = this.store.select(DiscountConfigSelectors.selectBrands);
  private subBrands$ = this.store.select(
    DiscountConfigSelectors.selectSubBrands
  );

  private selectRangeTEPDuration$ = this.store.select(
    DiscountConfigSelectors.selectRangeTEPDuration
  );

  private isTsssComputed$ = this.store.select(
    DiscountConfigSelectors.selectIsTsssComputed
  );

  private tsssConfigDownloadUrl$ = this.store.select(
    DiscountConfigSelectors.selectDownloadTsssConfigUrl
  );

  private loadFaqFileUpload$ = this.store.select(
    DiscountConfigSelectors.selectFaqFileUpload
  );

  private loadFaqFileDownload$ = this.store.select(
    DiscountConfigSelectors.selectFaqFileDownload
  );

  private loadEmailResendStatus$ = this.store.select(
    DiscountConfigSelectors.selectIsEmailResent
  );

  getError() {
    return this.error$;
  }
  getIsloading() {
    return this.isLoading$;
  }
  getLotAge() {
    return this.saveLotAge$;
  }

  getMaxPercent() {
    return this.saveMaxPercentage$;
  }

  getDiscountRequestCount() {
    return this.discountRequestCount$;
  }
  getDiscountRequestList() {
    return this.discountRequestList$;
  }

  getHasUpdated() {
    return this.hasUpdated$;
  }
  getHasSaved() {
    return this.hasSaved$;
  }
  getIsExcludeTypeSaved() {
    return this.isExcludeTypeSaved$;
  }
  getIsExcludeSchemeSaved() {
    return this.isExcludeSchemeSaved$;
  }
  getIsDiscountSentForApproval() {
    return this.isSentForAproval$;
  }

  getIsDiscountApproved() {
    return this.isDiscountAppproved$;
  }
  getIsLocationSaved() {
    return this.isLocationsSaved$;
  }
  getIsProductCategoriesSaved() {
    return this.isProductCategoriesSaved$;
  }
  getIsProductGroupsSaved() {
    return this.isProductGroupsSaved$;
  }
  getIsThemeCodeSaved() {
    return this.isExcludeThemeSaved$;
  }
  getDiscountConfigList() {
    return this.discountConfigList$;
  }

  getTotalDiscountConfigList() {
    return this.totalDiscountConfigList$;
  }
  getDiscountDetails() {
    return this.totalDiscountDetails$;
  }
  getTotalDiscountLocations() {
    return this.totalDiscountLocations$;
  }
  getDiscountLocationDetails() {
    return this.discountLocationList$;
  }
  getTotalDiscountProductCategories() {
    return this.totalDiscountProductCategories$;
  }
  getDiscountProductCategoryDetails() {
    return this.discountProductCategoryList$;
  }
  getTotalDiscountProductGroups() {
    return this.totalDiscountProductGroups$;
  }
  getDiscountProductGroupDetails() {
    return this.discountProductGroupList$;
  }
  getTotalDiscountExcludeTypes() {
    return this.totalDiscountExcludeTypes$;
  }
  getTotalDiscountExcludeItemCodes() {
    return this.totalDiscountExcludeItemCodes$;
  }
  getDiscountExcludeTypeDetails() {
    return this.discountExcludeTypeList$;
  }
  getDiscountExcludeItemCodes() {
    return this.discountExcludeItemCodes$;
  }

  getBestDealDiscountList() {
    return this.bestDealDiscountList$;
  }

  getBestDealDiscountCount() {
    return this.bestDealDiscountCount$;
  }
  getSelectedLocations() {
    return this.mappedLocations$;
  }
  getSelectedProductGroups() {
    return this.mappedProductGroups$;
  }
  getSelectedProductCategories() {
    return this.mappedProductCategories$;
  }
  getSelectedBestDealDiscountCount() {
    return this.selectedBestDealDiscountCount$;
  }
  getIsPublished() {
    return this.isPublished$;
  }
  getSelectedBestDealDiscount() {
    return this.mappedBestDealDiscounts$;
  }
  getDiscountComponentPGConfigCount() {
    return this.discountComponentPGConfigCount$;
  }

  getDiscountComponentPGConfig() {
    return this.discountComponentPGConfig$;
  }

  getIsDiscountComponentPGConfigSaved() {
    return this.isDiscountComponentPGConfigSaved$;
  }

  getDiscountComponentProductGroups() {
    return this.discountComponentProductGroups$;
  }

  getIsBestDealDiscountSaved() {
    return this.saveBestDealDiscount$;
  }

  getSlabDetails() {
    return this.slabDetails$;
  }

  getDiscDetails() {
    return this.discountDetails$;
  }

  getIsDiscDetailsSaved() {
    return this.discountDetailsSaved$;
  }
  getDiscountTypes() {
    return this.discountTypes$;
  }
  getClubbingDiscountTypes() {
    return this.clubbingDiscountTypes$;
  }
  getApprovers() {
    return this.approvers$;
  }
  getSubBrands() {
    return this.subBrands$;
  }
  getBrands() {
    return this.brands$;
  }
  getTEPDurationRange() {
    return this.selectRangeTEPDuration$;
  }

  getApplicableLevels() {
    return this.applicableLevels$;
  }

  getIsTsssComputed() {
    return this.isTsssComputed$;
  }

  getTsssConfigDownloadUrl() {
    return this.tsssConfigDownloadUrl$;
  }

  getEmpowermentUpdatedDiscount() {
    return this.empowermentUpdatedDiscount$;
  }

  getEmpowermentDiscounts() {
    return this.empowermentDiscounts$;
  }

  getFaqFileUpload() {
    return this.loadFaqFileUpload$;
  }

  getFaqFileDownload() {
    return this.loadFaqFileDownload$;
  }

  getEmailResentStatus() {
    return this.loadEmailResendStatus$;
  }

  loadDiscountConfigList(payload: DisountConfigListPayload) {
    this.store.dispatch(
      new DiscountConfigActions.LoadDiscountConfigList(payload)
    );
  }
  loadDiscountTypes(payload: string) {
    this.store.dispatch(new DiscountConfigActions.LoadDiscountTypes(payload));
  }
  loadClubbingDiscountTypes(payload: string) {
    this.store.dispatch(
      new DiscountConfigActions.LoadClubbingDiscountTypes(payload)
    );
  }
  loadApprovers(payload: string) {
    this.store.dispatch(new DiscountConfigActions.LoadApprovers(payload));
  }
  loadBestDealDiscountList(payload: DisountConfigListPayload) {
    this.store.dispatch(
      new DiscountConfigActions.LoadBestDealDiscountList(payload)
    );
  }
  loadDiscountDetails(id: string) {
    this.store.dispatch(
      new DiscountConfigActions.LoadDiscountConfigDetails(id)
    );
  }
  saveDiscountDetails(payload: NewDiscountDetails) {
    this.store.dispatch(
      new DiscountConfigActions.SaveDiscountConfigList(payload)
    );
  }
  editDiscountDetails(id: string, payload: NewDiscountApplicableConfig) {
    this.store.dispatch(
      new DiscountConfigActions.EditDiscountConfigList(id, payload)
    );
  }
  loadDiscountLocationList(payload: DiscountLocationListPayload) {
    this.store.dispatch(
      new DiscountConfigActions.LoadDiscountMappedLocationList(payload)
    );
  }
  loadDiscountProductCategoryList(payload: DiscountProductCategoryListPayload) {
    this.store.dispatch(
      new DiscountConfigActions.LoadDiscountMappedProductCategoryList(payload)
    );
  }
  loadDiscountProductGroupList(payload: DiscountProductGroupListPayload) {
    this.store.dispatch(
      new DiscountConfigActions.LoadDiscountMappedProductGroupList(payload)
    );
  }
  loadExcludeTypeList(payload: DiscounExcludeItemListPayload) {
    this.store.dispatch(
      new DiscountConfigActions.LoadDiscountExcludeTypeList(payload)
    );
  }
  loadExcludeItemCodes(payload: DiscounExcludeItemListPayload) {
    this.store.dispatch(
      new DiscountConfigActions.LoadDiscountExcludeItemCodes(payload)
    );
  }
  saveDiscountLocations(payload: SaveDiscountLocationsPayload) {
    this.store.dispatch(
      new DiscountConfigActions.SaveDiscountLocations(payload)
    );
  }
  saveDiscountProductCategories(payload: SaveDiscountProductCategoryPayload) {
    this.store.dispatch(
      new DiscountConfigActions.SaveDiscountProductCategory(payload)
    );
  }
  saveDiscountProductGroups(payload: SaveDiscountProductGroupPayload) {
    this.store.dispatch(
      new DiscountConfigActions.SaveDiscountProductGroups(payload)
    );
  }
  saveDiscountExcludeThemes(payload: SaveDiscountThemesPayload) {
    this.store.dispatch(
      new DiscountConfigActions.SaveDiscountExcludeThemes(payload)
    );
  }
  saveDiscountExcludeTypes(payload: SaveExcludeTypePayload) {
    this.store.dispatch(
      new DiscountConfigActions.SaveDiscountExcludeTypes(payload)
    );
  }

  sendDiscountForApproval(payload: discountWorkflowpayload) {
    this.store.dispatch(
      new DiscountConfigActions.SendForApprovalDiscountConfig(payload)
    );
  }

  approveorCancelDiscount(payload: discountWorkflowpayload) {
    this.store.dispatch(
      new DiscountConfigActions.ApproveDiscountConfig(payload)
    );
  }

  saveDiscountExcludeSchemes(payload: SaveDiscountSchemesPayload) {
    this.store.dispatch(
      new DiscountConfigActions.SaveDiscountExcludeSchemes(payload)
    );
  }
  loadSelectedLocations(payload) {
    this.store.dispatch(
      new DiscountConfigActions.LoadSelectedLocations(payload)
    );
  }
  loadSelectedProductGroups(payload) {
    this.store.dispatch(
      new DiscountConfigActions.LoadSelectedProductGroups(payload)
    );
  }
  loadSelectedProductCategories(payload) {
    this.store.dispatch(
      new DiscountConfigActions.LoadSelectedProductCategories(payload)
    );
  }

  loadIsPublishedConfig(payload) {
    this.store.dispatch(
      new DiscountConfigActions.PublishDiscountConfig(payload)
    );
  }

  saveBestDealDiscount(payload: SaveBestDealDiscountPayload) {
    this.store.dispatch(
      new DiscountConfigActions.SaveBestDealDiscounts(payload)
    );
  }

  loadSelectedBestDealDiscount(payload) {
    this.store.dispatch(
      new DiscountConfigActions.LoadSelectedBestDealDiscounts(payload)
    );
  }

  resetDiscounts() {
    this.store.dispatch(new DiscountConfigActions.ResetDiscounts());
  }

  saveSlabDetails(slabDetails: any) {
    this.store.dispatch(new DiscountConfigActions.SaveSlabDetails(slabDetails));
  }

  saveDiscDetails(discountDetails: any) {
    this.store.dispatch(
      new DiscountConfigActions.SaveDiscountDetails(discountDetails)
    );
  }

  loadDiscountComponentPGConfig(loadData: {
    discountId: string;
    pgType: string;
    pageIndex: number;
    pageSize: number;
  }) {
    this.store.dispatch(
      new DiscountConfigActions.LoadDiscountComponentPGConfig(loadData)
    );
  }

  updateDiscountComponentPGConfig(discountDetails: {
    discountId: string;
    discountComponents: any;
    loadData: {
      discountId: string;
      pgType: string;
      pageIndex: number;
      pageSize: number;
    };
  }) {
    this.store.dispatch(
      new DiscountConfigActions.UpdateDiscountComponentPGConfig(discountDetails)
    );
  }

  loadDiscDetails(discountDetails: any) {
    this.store.dispatch(
      new DiscountConfigActions.LoadDiscountDetails(discountDetails)
    );
  }
  loadSubBrands(brandCode: string) {
    this.store.dispatch(new DiscountConfigActions.LoadSubBrands(brandCode));
  }
  loadBrands() {
    this.store.dispatch(new DiscountConfigActions.LoadBrands());
  }
  loadApplicableLevels(lovType: string) {
    this.store.dispatch(
      new DiscountConfigActions.LoadApplicableLevels(lovType)
    );
  }
  loadTEPDurationRange() {
    this.store.dispatch(new DiscountConfigActions.LoadTepDurationDaysRange());
  }

  loadMappedProductGroupByConfigId(
    discountId: string,
    discountDetailsId: string
  ) {
    this.store.dispatch(
      new DiscountConfigActions.LoadMappedProductGroupsByConfigId({
        discountId,
        discountDetailsId
      })
    );
  }

  updateMappedProductGroupByConfigId(
    discountId: string,
    discountDetailsId: string,
    data: {
      addProducts: ProductGroupMappingOption[];
      removeProducts: ProductGroupMappingOption[];
      updateProducts: ProductGroupMappingOption[];
      updateProductGroupsDtoList?: any;
    },
    loadData: {
      discountId: string;
      pgType: string;
      pageIndex: number;
      pageSize: number;
    }
  ) {
    this.store.dispatch(
      new DiscountConfigActions.UpdateMappedProductGroupByConfigId({
        discountId,
        discountDetailsId,
        data,
        loadData
      })
    );
  }

  loadTsssConfigCompute(requestPayload) {
    this.store.dispatch(
      new DiscountConfigActions.ComputeTsssConfig(requestPayload)
    );
  }

  loadTsssConfigDownloadUrl(discountId) {
    this.store.dispatch(
      new DiscountConfigActions.LoadTsssConfigDownloadUrl(discountId)
    );
  }

  loadDiscountRequests(requestPayload: RequestPayload) {
    this.store.dispatch(new DiscountConfigActions.LoadRequests(requestPayload));
  }

  saveEmpowermentDetails(empowermentDetails: any) {
    this.store.dispatch(
      new DiscountConfigActions.SaveEmpowermentDetails(empowermentDetails)
    );
  }

  updateEmpowermentDetails(discountDetails: any) {
    this.store.dispatch(
      new DiscountConfigActions.UpdateEmpowermentDetails(discountDetails)
    );
  }

  loadEmpowermentDiscDetails(discountDetails: any) {
    this.store.dispatch(
      new DiscountConfigActions.LoadEmpowermentDiscountDetails(discountDetails)
    );
  }

  loadFaqFileUpload(faqFileUploadRequest: FaqRequestPaylaod) {
    this.store.dispatch(
      new DiscountConfigActions.FaqFileUpload(faqFileUploadRequest)
    );
  }

  loadFaqFileDownload(faqFileDownloadRequest: FaqFileUploadResponse) {
    this.store.dispatch(
      new DiscountConfigActions.FaqFileDownload(faqFileDownloadRequest)
    );
  }

  loadEmailResendStatus(processId: string) {
    this.store.dispatch(
      new DiscountConfigActions.LoadResendEmailStatus(processId)
    );
  }
}
