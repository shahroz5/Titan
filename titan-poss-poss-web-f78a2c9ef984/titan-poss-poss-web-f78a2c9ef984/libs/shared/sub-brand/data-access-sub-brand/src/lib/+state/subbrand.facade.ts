import { Injectable } from '@angular/core';

import { subBrandMasterSelectors } from './subrand.selector';
import * as SubBrandMasterActions from './subbrand.actions';
import { SubBrandState } from './subbrand.state';
import { SubBrandMasterAdaptors } from '@poss-web/shared/util-adaptors';
import {
  UpadateIsActivePayload,
  SaveBrandMasterDetailsPayload,
  UpdateBrandMasterDetailsPayload,
  SubBrandListingPayload,
  SearchPayload
} from '@poss-web/shared/models';


import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
@Injectable()
export class SubbrandFacade {
  constructor(private store: Store<SubBrandState>) { }

  private subBrandList$ = this.store.select(
    subBrandMasterSelectors.selectsubBrandList
  );

  private subBrandMasterDetails$ = this.store.select(
    subBrandMasterSelectors.selectSubBrandDetails
  );
  private totalElements$ = this.store.select(
    subBrandMasterSelectors.selectTotalElements
  );

  private hasSaved$ = this.store.select(subBrandMasterSelectors.selectHasSaved);
  private hasUpdated$ = this.store.select(
    subBrandMasterSelectors.selectHasUpdated
  );
  private hasError$ = this.store.select(subBrandMasterSelectors.selecthasError);
  private isLoading$ = this.store.select(
    subBrandMasterSelectors.selectIsLoading
  );
  private isActiveToggle$ = this.store.select(
    subBrandMasterSelectors.selectIsActiveToggle
  );

  private parentBrandList$ = this.store.select(
    subBrandMasterSelectors.selectParentBrandList
  );

  getParentBrandList() {
    return this.parentBrandList$;
  }

  getHasSaved() {
    return this.hasSaved$;
  }

  getHasUpdated() {
    return this.hasUpdated$;
  }

  getIsloading() {
    return this.isLoading$;
  }
  getIsActiveToggle() {
    return this.isActiveToggle$;
  }
  getError() {
    return this.hasError$;
  }

  getSubBrandMasterList() {
    return this.subBrandList$;
  }

  getTotalElements() {
    return this.totalElements$;
  }

  getSubBrandDetails() {
    return this.subBrandMasterDetails$.pipe(
      map(data => SubBrandMasterAdaptors.getOnlyBrandDetails(data))
    );
  }

  loadSubBrandMasterList(subBrandListingPayload: SubBrandListingPayload) {
    this.store.dispatch(
      new SubBrandMasterActions.LoadSubBrandListing(subBrandListingPayload)
    );
  }

  loadParentMasterList() {
    this.store.dispatch(new SubBrandMasterActions.LoadParenBrands());
  }

  loadSubBrandDetailsByBrandCode(brandCode: string) {
    this.store.dispatch(
      new SubBrandMasterActions.LoadSubrandDetailsByBrandCode(brandCode)
    );
  }

  upDateIsactive(upadateIsActivePayload: UpadateIsActivePayload) {
    this.store.dispatch(
      new SubBrandMasterActions.UpdateIsActive(upadateIsActivePayload)
    );
  }

  saveSubBrandMasterDetails(
    saveBrandMasterDetailsPayload: SaveBrandMasterDetailsPayload
  ) {
    this.store.dispatch(
      new SubBrandMasterActions.SaveSubBrandMasterDetails(
        saveBrandMasterDetailsPayload
      )
    );
  }
  updateSubBrandMasterDetails(
    updateBrandMasterDetailsPayload: UpdateBrandMasterDetailsPayload
  ) {
    this.store.dispatch(
      new SubBrandMasterActions.UpdateSubBrandMasterDetails(
        updateBrandMasterDetailsPayload
      )
    );
  }

  searchSubBrand(searchPayload: SearchPayload) {
    this.store.dispatch(
      new SubBrandMasterActions.SearchSubBrandByBrandCode(searchPayload)
    );
  }
  loadReset() {
    this.store.dispatch(new SubBrandMasterActions.LoadReset());
  }
  resetIsActiveToggle() {
    this.store.dispatch(new SubBrandMasterActions.ResetIsActiveToggle());
  }
}
