import { Injectable } from '@angular/core';
import * as BrandMasterActions from './brand-master.actons';
import { brandMasterSelectors } from './brand-master.selectors';
import { BrandMasterAdaptors } from '@poss-web/shared/util-adaptors';
import { BrandMasterState } from './brand-master.state';
import {
  BrandListingPayload,
  BrandMasterDetails
} from '@poss-web/shared/models';

import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
@Injectable()
export class BrandMasterFacade {
  constructor(private store: Store<BrandMasterState>) { }

  private brandList$ = this.store.select(brandMasterSelectors.selectBrandList);
  private brandMasterDetails$ = this.store.select(brandMasterSelectors.selectBrandDetails);
  private totalElements$ = this.store.select(brandMasterSelectors.selectTotalElements);
  private hasSaved$ = this.store.select(brandMasterSelectors.selectHasSaved);
  private hasError$ = this.store.select(brandMasterSelectors.selectError);
  private isLoading$ = this.store.select(brandMasterSelectors.selectIsLoading);


  getBrandMasterList() {
    return this.brandList$;
  }

  getBrandMasterDetails() {
    return this.brandMasterDetails$;
  }

  getHasSaved() {
    return this.hasSaved$;
  }

  getIsloading() {
    return this.isLoading$;
  }

  getError() {
    return this.hasError$;
  }

  getTotalElements() {
    return this.totalElements$;
  }

  getOnlyBrandDetails() {
    return this.brandMasterDetails$.pipe(
      map(data => BrandMasterAdaptors.getOnlyBrandDetails(data))
    );
  }
  getOnlyCMSMSConfigurationDetails() {
    return this.brandMasterDetails$.pipe(
      map(data => BrandMasterAdaptors.getOnlyCMSMSConfigurationDetails(data))
    );
  }
  getOnlyCurrencyDetails() {
    return this.brandMasterDetails$.pipe(
      map(data => BrandMasterAdaptors.getOnlyCurrencyDetails(data))
    );
  }

  getOnlyPanCardDetails() {
    return this.brandMasterDetails$.pipe(
      map(data => BrandMasterAdaptors.getOnlyPanCardDetails(data))
    );
  }
  getOnlyResidualAmount() {
    return this.brandMasterDetails$.pipe(
      map(data => BrandMasterAdaptors.getOnlyResidualAmount(data))
    );
  }

  loadBrandMasterList(brandListingPayload: BrandListingPayload) {
    this.store.dispatch(
      new BrandMasterActions.LoadBrandListing(brandListingPayload)
    );
  }
  searchBrand(brandCode: string) {
    this.store.dispatch(
      new BrandMasterActions.SearchBrandDetails(brandCode)
    );
  }
  saveBrandMasterDetails(
    saveBrandMasterDetailsPayload: BrandMasterDetails
  ) {
    this.store.dispatch(
      new BrandMasterActions.SaveBrandMasterDetails(
        saveBrandMasterDetailsPayload
      )
    );
  }
  updateBrandMasterDetails(
    updateBrandMasterDetailsPayload: BrandMasterDetails
  ) {
    this.store.dispatch(
      new BrandMasterActions.UpdateBrandMasterDetails(
        updateBrandMasterDetailsPayload
      )
    );
  }

  loadBrandDetails(brandCode: string) {
    this.store.dispatch(
      new BrandMasterActions.LoadBrandDetails(brandCode)
    );
  }


}
