import { Injectable } from '@angular/core';
import { PriceGroupState } from './price-group-state';
import {
  PriceGroupListPayload,
  UpdatePriceGroupMasterPayload,
  SavePriceGroupMasterPayload
} from '@poss-web/shared/models';
import * as PriceGroupMasterActions from './price-group-actions';
import { priceGroupMasterSelector } from './price-group-selectors';

import { Store } from '@ngrx/store';
@Injectable()
export class PriceGroupFacade {
  constructor(public store: Store<PriceGroupState>) { }
  priceGroupMasterList$ = this.store.select(
    priceGroupMasterSelector.selectPriceGroupMaster
  );

  totalElements$ = this.store.select(
    priceGroupMasterSelector.selectTotalElements
  );

  priceGroup$ = this.store.select(priceGroupMasterSelector.selectPriceGroup);

  hasSaved$ = this.store.select(priceGroupMasterSelector.selectHasSaved);
  hasUpdated$ = this.store.select(priceGroupMasterSelector.selectHasUpdated);
  error$ = this.store.select(priceGroupMasterSelector.selectError);
  isLoading$ = this.store.select(priceGroupMasterSelector.selectIsloading);
  getIsloading() {
    return this.isLoading$;
  }
  getHasError() {
    return this.error$;
  }
  getHasUpdated() {
    return this.hasUpdated$;
  }
  getHasSaved() {
    return this.hasSaved$;
  }
  getPriceGroupByPriceGroupCode() {
    return this.priceGroup$;
  }
  getTotalElements() {
    return this.totalElements$;
  }
  getPriceGroupMasterList() {
    return this.priceGroupMasterList$;
  }
  loadReset() {
    this.store.dispatch(new PriceGroupMasterActions.LoadReset());
  }

  searchPriceGroupList(searchValue: string) {
    this.store.dispatch(
      new PriceGroupMasterActions.SearchPriceGroupList(searchValue)
    );
  }
  savePriceGroup(savePriceGroupMasterPayload: SavePriceGroupMasterPayload) {
    this.store.dispatch(
      new PriceGroupMasterActions.SavePriceGroup(savePriceGroupMasterPayload)
    );
  }
  updatePriceGroupByPriceGroupCode(
    updatePriceGroupMasterPayload: UpdatePriceGroupMasterPayload
  ) {
    this.store.dispatch(
      new PriceGroupMasterActions.UpdatePricGroupByPriceGroupCode(
        updatePriceGroupMasterPayload
      )
    );
  }
  loadPriceGroupByPriceGroupCode(priceGroup: string) {
    this.store.dispatch(
      new PriceGroupMasterActions.LoadPriceGroupByPriceGroupCode(priceGroup)
    );
  }
  loadPriceGroupMasterListing(priceGroupListPayload: PriceGroupListPayload) {
    this.store.dispatch(
      new PriceGroupMasterActions.LoadPriceGroup(priceGroupListPayload)
    );
  }
}
