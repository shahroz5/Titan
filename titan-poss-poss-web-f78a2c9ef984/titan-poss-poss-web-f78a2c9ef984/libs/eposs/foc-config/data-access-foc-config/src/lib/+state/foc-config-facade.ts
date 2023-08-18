import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { FocConfigurationState } from './foc-config-state';
import * as FocConfigurationActions from './foc-config-actions';
import { focConfigurationSelectors } from './foc-config-selectors';
import {
  FocConfigurationListPayload,
  SchemeDetails,
  SaveVariantDetailsPayload,
  LoadVariantDetailsPayload,
  SaveProductGroup,
  LoadProductGroupPayload,
  SaveLocationPayload,
  FOCItemCodesPayload,
  FocItemsSavePayload,
  FocItemsPayload,
  FocLocationListPayload,
  FocTypeRequestPaylaod
} from '@poss-web/shared/models';

@Injectable()
export class FocConfigurationFacade {
  constructor(public store: Store<FocConfigurationState>) {}

  private focConfigList$ = this.store.select(
    focConfigurationSelectors.selectFocConfigList
  );
  private schemeDetails$ = this.store.select(
    focConfigurationSelectors.selectSchemeDetails
  );

  private focTypeState$ = this.store.select(
    focConfigurationSelectors.selectFocTypeState
  );

  private error$ = this.store.select(focConfigurationSelectors.selectError);
  private hasSaved$ = this.store.select(
    focConfigurationSelectors.selectHassaved
  );
  private hasUpdated$ = this.store.select(
    focConfigurationSelectors.selectHasUpdated
  );

  private isLocationUpdated$ = this.store.select(
    focConfigurationSelectors.selectIsLocationUpdated
  );
  private isLoading$ = this.store.select(
    focConfigurationSelectors.selectIsLoading
  );
  private totalElements$ = this.store.select(
    focConfigurationSelectors.selectTotalElement
  );

  private selectRangeWeight$ = this.store.select(
    focConfigurationSelectors.selectRangeWeight
  );

  private selectValueBasedVariantDetails$ = this.store.select(
    focConfigurationSelectors.selectValueBasedVariantDetails
  );

  private selectWeightBasedVariantDetails$ = this.store.select(
    focConfigurationSelectors.selectWeightBasedVariantDetails
  );

  private selectProductGroups$ = this.store.select(
    focConfigurationSelectors.selectProductGroups
  );
  private selectLocationList$ = this.store.select(
    focConfigurationSelectors.selectLocationList
  );
  private selectFocItemCodes$ = this.store.select(
    focConfigurationSelectors.selectItemCodes
  );
  private selectHasFocItemsSaved$ = this.store.select(
    focConfigurationSelectors.selectHasFocItemsSaved
  );
  private selectTotalFocItems$ = this.store.select(
    focConfigurationSelectors.selectTotalFocItems
  );
  private selectMappedFocItems$ = this.store.select(
    focConfigurationSelectors.selectMappedFocItems
  );
  private selectSchemeDetailsById$ = this.store.select(
    focConfigurationSelectors.selectSchemeDetailsById
  );
  private selectHasProductsUpdated$ = this.store.select(
    focConfigurationSelectors.selectHasProductsUpdated
  );
  private selectLocationCount$ = this.store.select(
    focConfigurationSelectors.selectLocationCount
  );
  private selectlLoadMappedProdcutGroup$ = this.store.select(
    focConfigurationSelectors.selectlLoadMappedProdcutGroup
  );

  private selectIsPublished$ = this.store.select(
    focConfigurationSelectors.selectIsPublished
  );
  private selectAllFocItemCodes$ = this.store.select(
    focConfigurationSelectors.selectAllFocItemCodes
  );
  private selectAllSelectedLocations$ = this.store.select(
    focConfigurationSelectors.selectAllSelectedLocationCodes
  );

  //FOC View Page Related selectors

  private selectValueBasedVariantDetailsGoldStandard$ = this.store.select(
    focConfigurationSelectors.selectValueBasedVariantDetailsGoldStandard
  );
  private selectValueBasedVariantDetailsGoldSlab$ = this.store.select(
    focConfigurationSelectors.selectValueBasedVariantDetailsGoldSlab
  );

  private selectWeightBasedVariantDetailsGoldStandard$ = this.store.select(
    focConfigurationSelectors.selectWeightBasedVariantDetailsGoldStandard
  );
  private selectWeightBasedVariantDetailsGoldSlab$ = this.store.select(
    focConfigurationSelectors.selectWeightBasedVariantDetailsGoldSlab
  );
  private selectValueBasedVariantDetailsOthersStandard$ = this.store.select(
    focConfigurationSelectors.selectValueBasedVariantDetailsOthersStandard
  );
  private selectValueBasedVariantDetailsOthersSlab$ = this.store.select(
    focConfigurationSelectors.selectValueBasedVariantDetailsOthersSlab
  );
  private selectWeightBasedVariantDetailsOthersStandard$ = this.store.select(
    focConfigurationSelectors.selectWeightBasedVariantDetailsOthersStandard
  );
  private selectWeightBasedVariantDetailsOthersSlab$ = this.store.select(
    focConfigurationSelectors.selectWeightBasedVariantDetailsOthersSlab
  );

  getFocTypeState() {
    return this.focTypeState$;
  }
  getIsPublished() {
    return this.selectIsPublished$;
  }
  getLoadMappedProdcutGroup() {
    return this.selectlLoadMappedProdcutGroup$;
  }
  getIsLocationUpdated() {
    return this.isLocationUpdated$;
  }
  getLocationList() {
    return this.selectLocationList$;
  }
  getProductGroups() {
    return this.selectProductGroups$;
  }
  getValueBasedVariantDetails() {
    return this.selectValueBasedVariantDetails$;
  }
  getWeightBasedVariantDetails() {
    return this.selectWeightBasedVariantDetails$;
  }
  getRangeWeight() {
    return this.selectRangeWeight$;
  }
  getError() {
    return this.error$;
  }

  getIsloading() {
    return this.isLoading$;
  }
  getHasSaved() {
    return this.hasSaved$;
  }
  getHasUpdated() {
    return this.hasUpdated$;
  }
  getTotalElement() {
    return this.totalElements$;
  }
  getSchemeDetails() {
    return this.schemeDetails$;
  }
  getFocConfigurationList() {
    return this.focConfigList$;
  }
  getFocItemCodes() {
    return this.selectFocItemCodes$;
  }
  getHasFocItemsSaved() {
    return this.selectHasFocItemsSaved$;
  }
  getTotalFocItems() {
    return this.selectTotalFocItems$;
  }
  getLocationCount() {
    return this.selectLocationCount$;
  }
  getMappedFocItems() {
    return this.selectMappedFocItems$;
  }
  getSchemeDetailsById() {
    return this.selectSchemeDetailsById$;
  }
  getHasProductsUpdated() {
    return this.selectHasProductsUpdated$;
  }
  getAllFocItemCodes() {
    return this.selectAllFocItemCodes$;
  }
  getAllSelectedLocations() {
    return this.selectAllSelectedLocations$;
  }

  loadRangeWeight() {
    this.store.dispatch(new FocConfigurationActions.LoadRangeWeight());
  }
  loadFocConfigurationList(
    focConfigurationListPayload: FocConfigurationListPayload,
    searchValue?: string
  ) {
    this.store.dispatch(
      new FocConfigurationActions.LoadFocConfigurationList(
        focConfigurationListPayload,
        searchValue
      )
    );
  }

  saveFocSchemeConfiguration(saveSchemeDetails: SchemeDetails) {
    this.store.dispatch(
      new FocConfigurationActions.SaveFocSchemeConfiguration(saveSchemeDetails)
    );
  }
  loadFocSchemeConfigurationByConfigId(configId: string) {
    this.store.dispatch(
      new FocConfigurationActions.LoadFocSchemeConfigurationByConfigId(configId)
    );
  }

  updateFocSchemeConfiguration(updateFocConfiguration: SchemeDetails) {
    this.store.dispatch(
      new FocConfigurationActions.UpdateFocSchemeConfiguration(
        updateFocConfiguration
      )
    );
  }
  loadMappedProductGroupByConfigId(
    loadProductGroupPayload: LoadProductGroupPayload
  ) {
    this.store.dispatch(
      new FocConfigurationActions.LoadMappedProductGroupsByConfigId(
        loadProductGroupPayload
      )
    );
  }
  updateProductGroupByConfigId(saveProductGroup: SaveProductGroup) {
    this.store.dispatch(
      new FocConfigurationActions.UpdateProductGroupByConfigId(saveProductGroup)
    );
  }

  saveVariantDetails(saveVariantDetails: SaveVariantDetailsPayload) {
    this.store.dispatch(
      new FocConfigurationActions.SaveVariantDetails(saveVariantDetails)
    );
  }

  searchConfig(configName: string) {
    this.store.dispatch(
      new FocConfigurationActions.SearchConfigBySchemeName(configName)
    );
  }

  loadVariantDetailsById(payload: LoadVariantDetailsPayload) {
    this.store.dispatch(
      new FocConfigurationActions.LoadVariantDetailsById(payload)
    );
  }
  loadLocationListById(focLocationListPayload: FocLocationListPayload) {
    this.store.dispatch(
      new FocConfigurationActions.LoadLocationById(focLocationListPayload)
    );
  }
  updateLocationById(saveLocationPayload: SaveLocationPayload) {
    this.store.dispatch(
      new FocConfigurationActions.UpdateLocationById(saveLocationPayload)
    );
  }
  loadReset() {
    this.store.dispatch(new FocConfigurationActions.LoadReset());
  }
  loadFOCItemCodes(payload: FOCItemCodesPayload) {
    this.store.dispatch(new FocConfigurationActions.LoadFocItemCodes(payload));
  }
  saveFocItems(savePayload: FocItemsSavePayload) {
    this.store.dispatch(new FocConfigurationActions.SaveFocItems(savePayload));
  }
  loadMappedFocItems(payload: FocItemsPayload) {
    this.store.dispatch(
      new FocConfigurationActions.LoadMappedFocItemsById(payload)
    );
  }
  searchFocItems(searchPayload: { configId: string; itemCode: string }) {
    this.store.dispatch(
      new FocConfigurationActions.SearchFocItem(searchPayload)
    );
  }
  searchLocationCode(searchPayload: {
    configId: string;
    locationCode: string;
  }) {
    this.store.dispatch(
      new FocConfigurationActions.SearchLocationCode(searchPayload)
    );
  }

  publishFocScheme(id) {
    this.store.dispatch(new FocConfigurationActions.PublishFocScheme(id));
  }

  /// -- View specific
  loadVariantDetailsValueGoldStandardById(payload: LoadVariantDetailsPayload) {
    this.store.dispatch(
      new FocConfigurationActions.LoadVariantDetailsValueGoldStandardById(
        payload
      )
    );
  }
  loadVariantDetailsValueGoldSlabById(payload: LoadVariantDetailsPayload) {
    this.store.dispatch(
      new FocConfigurationActions.LoadVariantDetailsValueGoldSlabById(payload)
    );
  }
  loadVariantDetailsValueOthersStandardById(
    payload: LoadVariantDetailsPayload
  ) {
    this.store.dispatch(
      new FocConfigurationActions.LoadVariantDetailsValueOthersStandardById(
        payload
      )
    );
  }
  loadVariantDetailsValueOthersSlabById(payload: LoadVariantDetailsPayload) {
    this.store.dispatch(
      new FocConfigurationActions.LoadVariantDetailsValueOthersSlabById(payload)
    );
  }

  loadVariantDetailsWeightGoldStandardById(payload: LoadVariantDetailsPayload) {
    this.store.dispatch(
      new FocConfigurationActions.LoadVariantDetailsWeightGoldStandardById(
        payload
      )
    );
  }
  loadVariantDetailsWeightGoldSlabById(payload: LoadVariantDetailsPayload) {
    this.store.dispatch(
      new FocConfigurationActions.LoadVariantDetailsWeightGoldSlabById(payload)
    );
  }

  loadVariantDetailsWeightOthersStandardById(
    payload: LoadVariantDetailsPayload
  ) {
    this.store.dispatch(
      new FocConfigurationActions.LoadVariantDetailsWeightOthersStandardById(
        payload
      )
    );
  }
  loadVariantDetailsWeightOthersSlabById(payload: LoadVariantDetailsPayload) {
    this.store.dispatch(
      new FocConfigurationActions.LoadVariantDetailsWeightOthersSlabById(
        payload
      )
    );
  }

  loadFocTypeState(payload: FocTypeRequestPaylaod) {
    this.store.dispatch(new FocConfigurationActions.LoadFocTypeState(payload));
  }

  //FOC View Page Related selectors
  getValueBasedVariantDetailsGoldStandard() {
    return this.selectValueBasedVariantDetailsGoldStandard$;
  }

  getValueBasedVariantDetailsGoldSlab() {
    return this.selectValueBasedVariantDetailsGoldSlab$;
  }

  getWeightBasedVariantDetailsGoldStandard() {
    return this.selectWeightBasedVariantDetailsGoldStandard$;
  }

  getWeightBasedVariantDetailsGoldSlab() {
    return this.selectWeightBasedVariantDetailsGoldSlab$;
  }

  getValueBasedVariantDetailsOthersStandard() {
    return this.selectValueBasedVariantDetailsOthersStandard$;
  }

  getValueBasedVariantDetailsOthersSlab() {
    return this.selectValueBasedVariantDetailsOthersSlab$;
  }

  getWeightBasedVariantDetailsOthersStandard() {
    return this.selectWeightBasedVariantDetailsOthersStandard$;
  }

  getWeightBasedVariantDetailsOthersSlab() {
    return this.selectWeightBasedVariantDetailsOthersSlab$;
  }
  loadAllFocItemCodes(payload: FocItemsPayload) {
    this.store.dispatch(
      new FocConfigurationActions.LoadAllSelectedItemCodes(payload)
    );
  }
  loadAllLocations(payload: FocLocationListPayload) {
    this.store.dispatch(
      new FocConfigurationActions.LoadAllSelectedLocationCodes(payload)
    );
  }
  /// -- View specific ends
}
