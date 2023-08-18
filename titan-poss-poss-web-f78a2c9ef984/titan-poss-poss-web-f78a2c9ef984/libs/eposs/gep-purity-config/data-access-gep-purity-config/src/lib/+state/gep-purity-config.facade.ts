import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  ExcludeItemCodesPayload, GEPDetailsPayload, GEPPurityConfigListPayload, ProductGroupDeduction, PurityDetailsPayload, RemoveProductGroupDeduction, RemoveThemeCodesPayload, SaveThemeCodesPayload, SearchProdcutGroup
} from '@poss-web/shared/models';
import * as GEPPurityConfigActions from './gep-purity-config.actions';
import { GEPPurityConfigSelectors } from './gep-purity-config.selector';
import { GEPPurityConfigState } from './gep-purity-config.state';
@Injectable()
export class GEPPurityConfigFacade {
  constructor(public store: Store<GEPPurityConfigState>) {}
  private gepPurityConfigList$ = this.store.select(
    GEPPurityConfigSelectors.selectGepPurityConfigList
  );
  private totalElements$ = this.store.select(
    GEPPurityConfigSelectors.selectCount
  );
  private isLoading$ = this.store.select(
    GEPPurityConfigSelectors.selectIsLoading
  );
  private selectHasGEPDetailsSaved$ = this.store.select(
    GEPPurityConfigSelectors.selectHasGEPDetailsSaved
  );
  private error$ = this.store.select(GEPPurityConfigSelectors.selectError);
  private selectMetalType$ = this.store.select(
    GEPPurityConfigSelectors.selectMetalTypes
  );
  private selectItemType$ = this.store.select(
    GEPPurityConfigSelectors.selectItemTypes
  );

  private selectHasPurityDetailsSaved$ = this.store.select(
    GEPPurityConfigSelectors.selectHasPurityDetailsSaved
  );
  private selectExcludeThemeCodes$ = this.store.select(
    GEPPurityConfigSelectors.selectExcludeThemeCodes
  );
  private selectExcludeItemCodes$ = this.store.select(
    GEPPurityConfigSelectors.selectExcludeItemCodes
  );
  private selectProductGroups$ = this.store.select(
    GEPPurityConfigSelectors.selectProductGroups
  );
  private selectConfigId$ = this.store.select(
    GEPPurityConfigSelectors.selectConfigId
  );
  private selectHasProductsDeductionSaved$ = this.store.select(
    GEPPurityConfigSelectors.selectHasProductGroupsDeducted
  );
  private selectHasProductsDataUpdated$ = this.store.select(
    GEPPurityConfigSelectors.selectHasProductGroupsDataUpdated
  );
  private selectGepDetails$ = this.store.select(
    GEPPurityConfigSelectors.selectGepDetails
  );
  private selectPurityDetails$ = this.store.select(
    GEPPurityConfigSelectors.selectPurityDetails
  );
  private selectProductGroupsDeduction$ = this.store.select(
    GEPPurityConfigSelectors.selectProductGroupsDeduction
  );
  private selectHasSearched$ = this.store.select(
    GEPPurityConfigSelectors.selectHasSearched
  );
  private selectHasThemeCodeSaved$ = this.store.select(
    GEPPurityConfigSelectors.selectHasThemeCodeSaved
  );
  private selectHasThemeCodeRemoved$ = this.store.select(
    GEPPurityConfigSelectors.selectHasThemeCodeRemoved
  );

  private selectHasRemoveProductGroup$ = this.store.select(
    GEPPurityConfigSelectors.selectHasRemoveProductGroup
  );
  private selectErrorLog$ = this.store.select(
    GEPPurityConfigSelectors.selectErrorLog
  );
  private selectFileResponse$ = this.store.select(
    GEPPurityConfigSelectors.selectFileUploadResponse
  );
  private selectItemCodesCount$ = this.store.select(
    GEPPurityConfigSelectors.selectTotalItemCodes
  );
  private selectProductGroupsCount$ = this.store.select(
    GEPPurityConfigSelectors.selectProductGroupsCount
  );
  private selectHasToggleButton$ = this.store.select(
    GEPPurityConfigSelectors.selectHasUpdatedToggleButton
  );

  private selectGoldRanges$ = this.store.select(
    GEPPurityConfigSelectors.selectGoldRanges
  );
  private selectPlatinumRanges$ = this.store.select(
    GEPPurityConfigSelectors.selectPlatinumRanges
  );
  private selectSilverRanges$ = this.store.select(
    GEPPurityConfigSelectors.selectSilverRanges
  );
  // private selectLocations$ = this.store.select(
  //   GEPPurityConfigSelectors.selectLocations
  // );
  private selectedProductGroups$ = this.store.select(
    GEPPurityConfigSelectors.selectedProductGroups
  );

  getGepPurityConfigList() {
    return this.gepPurityConfigList$;
  }
  getTotalCount() {
    return this.totalElements$;
  }
  getIsLoading() {
    return this.isLoading$;
  }
  getError() {
    return this.error$;
  }
  getHasGEPDetailsSaved() {
    return this.selectHasGEPDetailsSaved$;
  }
  getMetalTypes() {
    return this.selectMetalType$;
  }
  getItemTypes() {
    return this.selectItemType$;
  }

  getHasPurityDetailsSaved() {
    return this.selectHasPurityDetailsSaved$;
  }
  getExcludeThemeCodes() {
    return this.selectExcludeThemeCodes$;
  }
  getExcludeItemCodes() {
    return this.selectExcludeItemCodes$;
  }
  getProductGroups() {
    return this.selectProductGroups$;
  }
  getConfigId() {
    return this.selectConfigId$;
  }
  getHasProductGroupsDeducted() {
    return this.selectHasProductsDeductionSaved$;
  }
  getHasProductGroupsDataUpdated() {
    return this.selectHasProductsDataUpdated$;
  }
  getPurityDetails() {
    return this.selectPurityDetails$;
  }
  getProductGroupsDeduction() {
    return this.selectProductGroupsDeduction$;
  }
  getHasSearched() {
    return this.selectHasSearched$;
  }
  getHasThemeCodeSaved() {
    return this.selectHasThemeCodeSaved$;
  }
  getHasThemeCodeRemoved() {
    return this.selectHasThemeCodeRemoved$;
  }

  getHasProductGroupRemoved() {
    return this.selectHasRemoveProductGroup$;
  }

  getFileResponse() {
    return this.selectFileResponse$;
  }
  getTotalItemCodes() {
    return this.selectItemCodesCount$;
  }
  getHasToggleButton() {
    return this.selectHasToggleButton$;
  }

  loadGepPurityConfigList(listPayload: GEPPurityConfigListPayload) {
    this.store.dispatch(
      new GEPPurityConfigActions.LoadGEPPurityConfig(listPayload)
    );
  }
  getGepDetails() {
    return this.selectGepDetails$;
  }
  getErrorLog() {
    return this.selectErrorLog$;
  }
  getProductGroupsCount() {
    return this.selectProductGroupsCount$;
  }
  getSilverRanges() {
    return this.selectSilverRanges$;
  }
  getPlatinumRanges() {
    return this.selectPlatinumRanges$;
  }
  getGoldRanges() {
    return this.selectGoldRanges$;
  }
  // getLocations() {
  //   return this.selectLocations$;
  // }
  getSelectedPgs() {
    return this.selectedProductGroups$;
  }
  searchGepPurityConfigSearch(searchPayload: {
    configName: string;
    type: string;
  }) {
    this.store.dispatch(
      new GEPPurityConfigActions.SearchConfigName(searchPayload)
    );
  }
  saveGEPDetails(gepDetails: GEPDetailsPayload) {
    this.store.dispatch(new GEPPurityConfigActions.SaveGEPDetails(gepDetails));
  }
  loadMetalTypes() {
    this.store.dispatch(new GEPPurityConfigActions.LoadMetalTypes());
  }
  loadItemTypes() {
    this.store.dispatch(new GEPPurityConfigActions.LoadItemTypes());
  }

  savePurityDetails(savePayload: PurityDetailsPayload) {
    this.store.dispatch(
      new GEPPurityConfigActions.SavePurityDetails(savePayload)
    );
  }
  uploadFile(uploadPayload: ExcludeItemCodesPayload) {
    this.store.dispatch(new GEPPurityConfigActions.UploadFile(uploadPayload));
  }
  loadExcludeThemeCodes(configId: string) {
    this.store.dispatch(
      new GEPPurityConfigActions.GetExcludeThemeCodes(configId)
    );
  }
  loadExcludeItemCodes(excludeItemPayload: {
    configId: string;
    pageIndex: number;
    pageSize: number;
  }) {
    this.store.dispatch(
      new GEPPurityConfigActions.GetExcludeItemCodes(excludeItemPayload)
    );
  }
  loadProductGroups() {
    this.store.dispatch(new GEPPurityConfigActions.LoadProductGroups());
  }
  searchProductGroup(searchPayload: SearchProdcutGroup) {
    this.store.dispatch(
      new GEPPurityConfigActions.SearchProductGroup(searchPayload)
    );
  }
  resetGepPurityConfiguration() {
    this.store.dispatch(
      new GEPPurityConfigActions.ResetGepPurityConfiguration()
    );
  }
  saveProductGroupsDeduction(deductionPayload: ProductGroupDeduction) {
    this.store.dispatch(
      new GEPPurityConfigActions.SaveProductGroupsDeduction(deductionPayload)
    );
  }
  updateProductGroupsDeduction(deductionPayload: ProductGroupDeduction) {
    this.store.dispatch(
      new GEPPurityConfigActions.updateProductGroupsDeduction(deductionPayload)
    );
  }
  loadGepPurityDetails(configId: string) {
    this.store.dispatch(
      new GEPPurityConfigActions.LoadGepPurityDetails(configId)
    );
  }
  loadGepDetails(configId: string) {
    this.store.dispatch(new GEPPurityConfigActions.LoadGepDetails(configId));
  }
  loadProductGroupsDeduction(payload: {
    configId: string;
    pageIndex: number;
    pageSize: number;
  }) {
    this.store.dispatch(
      new GEPPurityConfigActions.LoadProductGroupsDeduction(payload)
    );
  }
  saveThemeCode(payload: SaveThemeCodesPayload) {
    this.store.dispatch(new GEPPurityConfigActions.SaveThemeCodes(payload));
  }
  deleteThemeCode(payload: RemoveThemeCodesPayload) {
    this.store.dispatch(new GEPPurityConfigActions.DeleteThemeCodes(payload));
  }

  removeProductGroup(removePayload: RemoveProductGroupDeduction) {
    this.store.dispatch(
      new GEPPurityConfigActions.RemoveProductGroups(removePayload)
    );
  }

  searchItemCodes(searchPayload: { configId: string; itemCode: string }) {
    this.store.dispatch(
      new GEPPurityConfigActions.SearchItemCode(searchPayload)
    );
  }
  loadItemCodesErrorLog(errorLogId: string) {
    this.store.dispatch(
      new GEPPurityConfigActions.ItemCodeErrorLogDownload(errorLogId)
    );
  }
  updateToggleButton(payload: { configId: string; isActive: true }) {
    this.store.dispatch(new GEPPurityConfigActions.UpdateToggleButton(payload));
  }
  loadGoldRanges(rangeType: string) {
    this.store.dispatch(new GEPPurityConfigActions.LoadGoldRanges(rangeType));
  }
  loadSilverRanges(rangeType: string) {
    this.store.dispatch(new GEPPurityConfigActions.LoadSilverRanges(rangeType));
  }
  loadPlatinumRanges(rangeType: string) {
    this.store.dispatch(
      new GEPPurityConfigActions.LoadPlatinumRanges(rangeType)
    );
  }
  // loadLocations() {
  //   this.store.dispatch(new GEPPurityConfigActions.LoadLocations());
  // }
  loadAllSelectedPgs(payload: {
    configId: string;
    pageIndex: number;
    pageSize: number;
  }) {
    this.store.dispatch(new GEPPurityConfigActions.LoadSelectedPgs(payload));
  }
}
