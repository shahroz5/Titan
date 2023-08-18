import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  LoadProductGroupsPayload,
  RivaahConfigurationResponse,
  RivaahEligibilityConfigRequest,
  RivaahLocationListPayload,
  SaveProductGroups,
  SaveRivaahLocationsPayload
} from '@poss-web/shared/models';
import * as RivaahConfigurationAction from './rivaah-configuration.actions';
import { RivaahConfigurationSelectors } from './rivaah-configuration.selector';
import { RivaahConfigurationState } from './rivaah-configuration.state';


@Injectable()
export class RivaahConfigurationFacade {
  constructor(public store: Store<RivaahConfigurationState>) {}

  private isLoading$ = this.store.select(
    RivaahConfigurationSelectors.selectIsloading
  );

  private hasUpdated$ = this.store.select(
    RivaahConfigurationSelectors.selectHasUpdated
  );

  private isCouponSaved$ = this.store.select(
    RivaahConfigurationSelectors.selectIsCouponSaved
  );

  private error$ = this.store.select(RivaahConfigurationSelectors.selectError);

  private couponDetails$ = this.store.select(
    RivaahConfigurationSelectors.selectCouponConfig
  );

  private totalElements$ = this.store.select(
    RivaahConfigurationSelectors.selectTotalElements
  );

  private isRivaahEligibilityCreated$ = this.store.select(
    RivaahConfigurationSelectors.selectisRivaElibilityCreated
  );

  private isRivaahEligibilityUpdated$ = this.store.select(
    RivaahConfigurationSelectors.selectisRivaElibilityUpdated
  );

  private isRivaahEligibilityDeleted$ = this.store.select(
    RivaahConfigurationSelectors.selectisRivaElibilityDeleted
  );

  private isRivaahEligibilityToggled$ = this.store.select(
    RivaahConfigurationSelectors.selectisRivaElibilityToggled
  );

  private rivaahEligibiltyRes$ = this.store.select(
    RivaahConfigurationSelectors.selectRivaahEligibilityConfig
  );

  private selectProductGroups$ = this.store.select(
    RivaahConfigurationSelectors.selectProductGroups
  );
  
  private selectHasProductsUpdated$ = this.store.select(
    RivaahConfigurationSelectors.selectHasProductsUpdated
  );

  private productCategory$ = this.store.select(
    RivaahConfigurationSelectors.selectProductCategory
  );

  private mappedProductCategory$ = this.store.select(
    RivaahConfigurationSelectors.selectMappedProductCategory
  );

  private isLocationsSaved$ = this.store.select(
    RivaahConfigurationSelectors.selectSavedLocations
  );
  private isLocationsUpdated$ = this.store.select(
    RivaahConfigurationSelectors.selectUpdatedLocations
  );
  private isLocationsDeleted$ = this.store.select(
    RivaahConfigurationSelectors.selectDeletedLocations
  );
  private totalDiscountLocations$ = this.store.select(
    RivaahConfigurationSelectors.selectLocationCount
  );
  private discountLocationList$ = this.store.select(
    RivaahConfigurationSelectors.selectRivaahLocations
  );
  private mappedLocations$ = this.store.select(
    RivaahConfigurationSelectors.selectMappedLocations
  );
  loadCouponConfiguration(payload: { configId: string; ruleType: string }) {
    this.store.dispatch(
      new RivaahConfigurationAction.LoadCouponConfiguration(payload)
    );
  }

  updateCouponConfiguration(payload: RivaahConfigurationResponse) {
    this.store.dispatch(
      new RivaahConfigurationAction.UpdateCouponConfiguration(payload)
    );
  }

  loadRivaahEligibilityConfiguration(payload: {
    configId: string;
    ruleType: string;
    productCategoryCode?: string;
    productGroupCode?: string;
    pageIndex?: number;
    pageSize?: number;
  }) {
    this.store.dispatch(
      new RivaahConfigurationAction.LoadRivaahEligibilityConfiguration(payload)
    );
  }

  createRivaahEligibilityConfiguration(
    payload: RivaahEligibilityConfigRequest
  ) {
    this.store.dispatch(
      new RivaahConfigurationAction.CreateRivaahEligibilityConfiguration(
        payload
      )
    );
  }

  updateRivaahEligibilityConfiguration(
    payload: RivaahEligibilityConfigRequest
  ) {
    this.store.dispatch(
      new RivaahConfigurationAction.UpdateRivaahEligibilityConfiguration(
        payload
      )
    );
  }

  deleteRivaahEligibilityConfiguration(
    payload: RivaahEligibilityConfigRequest
  ) {
    this.store.dispatch(
      new RivaahConfigurationAction.DeleteRivaahEligibilityConfiguration(
        payload
      )
    );
  }

  toggleRivaahEligibilityConfigurationStatus(
    payload: RivaahEligibilityConfigRequest
  ) {
    this.store.dispatch(
      new RivaahConfigurationAction.ToggleRivaahEligibilityConfigurationStatus(
        payload
      )
    );
  }
  loadReset() {
    this.store.dispatch(new RivaahConfigurationAction.LoadReset());
  }
  loadMappedProductGroupsByProductId(
    loadProductGroupPayload: LoadProductGroupsPayload
  ) {
    this.store.dispatch(
      new RivaahConfigurationAction.LoadMappedProductGroupsByProductId(
        loadProductGroupPayload
      )
    );
  }
  updateProductGroupByProductId(saveProductGroup: SaveProductGroups) {
    this.store.dispatch(
      new RivaahConfigurationAction.UpdateProductGroupByProductId(saveProductGroup)
    );
  }

  loadProductCategory() {
    this.store.dispatch(new RivaahConfigurationAction.LoadProductCategory());
  }

  loadMappedProductCategory(payload: {
    ruleId: string;
    ruleType: string;
  }) {
    this.store.dispatch(new RivaahConfigurationAction.LoadMappedProductCategory(payload));
  }
  
  loadRivaahLocationList(payload: RivaahLocationListPayload) {
    this.store.dispatch(
      new RivaahConfigurationAction.LoadRivaahMappedLocationList(payload)
    );
  }
  
  saveRivaahLocations(payload: SaveRivaahLocationsPayload) {
    this.store.dispatch(
      new RivaahConfigurationAction.SaveRivaahLocations(payload)
    );
  }

  updateRivaahLocations(payload: SaveRivaahLocationsPayload) {
    this.store.dispatch(
      new RivaahConfigurationAction.UpdateRivaahLocations(payload)
    );
  }

  deleteRivaahLocations(payload: SaveRivaahLocationsPayload) {
    this.store.dispatch(
      new RivaahConfigurationAction.DeleteRivaahLocations(payload)
    );
  }

  loadSelectedLocations(payload) {
    this.store.dispatch(
      new RivaahConfigurationAction.LoadSelectedLocations(payload)
    );
  }

  getIsloading() {
    return this.isLoading$;
  }

  getHasUpdated() {
    return this.hasUpdated$;
  }

  getError() {
    return this.error$;
  }

  getIsCouponSaved() {
    return this.isCouponSaved$;
  }

  getCouponConfiguration() {
    return this.couponDetails$;
  }

  getTotalElements() {
    return this.totalElements$;
  }

  getIsRivaahCreated() {
    return this.isRivaahEligibilityCreated$;
  }

  getIsRivaahUpdated() {
    return this.isRivaahEligibilityUpdated$;
  }

  getIsRivaahDeleted() {
    return this.isRivaahEligibilityDeleted$;
  }

  getIsRivaahToggled() {
    return this.isRivaahEligibilityToggled$;
  }

  getRivaahEligibilityConfiguration() {
    return this.rivaahEligibiltyRes$;
  }

  getProductGroups() {
    return this.selectProductGroups$;
  }
  
  getHasProductsUpdated() {
    return this.selectHasProductsUpdated$;
  }

  getProductCategory() {
    return this.productCategory$;
  }

  getMappedProductCategory() {
    return this.mappedProductCategory$;
  }

  getIsLocationSaved() {
    return this.isLocationsSaved$;
  }

  getIsLocationUpdated() {
    return this.isLocationsUpdated$;
  }

  getIsLocationDeleted() {
    return this.isLocationsDeleted$;
  }

  getTotalRivaahLocations() {
    return this.totalDiscountLocations$;
  }

  getRivaahLocationDetails() {
    return this.discountLocationList$;
  }

  getSelectedLocations() {
    return this.mappedLocations$;
  }
}
