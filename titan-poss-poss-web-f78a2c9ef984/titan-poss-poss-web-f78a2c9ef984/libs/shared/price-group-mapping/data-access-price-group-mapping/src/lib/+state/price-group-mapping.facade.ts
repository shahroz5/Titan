import { Injectable } from '@angular/core';
import * as PriceGroupMappingActions from './price-group-mapping.actons';

import { Store } from '@ngrx/store';
import { priceGroupMappingSelectors } from './price-group-mapping.selectors';
import { PriceGroupMappingState } from './price-group-mapping.state';
import { LocationPriceGroupMapping } from '@poss-web/shared/models';

@Injectable()
export class PriceGroupMappingFacade {
  constructor(private store: Store<PriceGroupMappingState>) {}

  private priceGrouplist$ = this.store.select(
    priceGroupMappingSelectors.selectPriceGrouplist
  );

  private priceGroupTotalElements$ = this.store.select(
    priceGroupMappingSelectors.selectPriceGroupTotalElements
  );

  private locationList$ = this.store.select(
    priceGroupMappingSelectors.selectLocationList
  );

  private priceGroupTypeList$ = this.store.select(
    priceGroupMappingSelectors.selectPriceGroupTypeList
  );

  private locationPriceGroupMappingList$ = this.store.select(
    priceGroupMappingSelectors.selectLocationPriceGroupMappingList
  );

  private hasSaved$ = this.store.select(
    priceGroupMappingSelectors.selectHasSaved
  );
  private hasError$ = this.store.select(priceGroupMappingSelectors.selectError);
  private isLoading$ = this.store.select(
    priceGroupMappingSelectors.selectIsLoading
  );

  getPriceGroupList() {
    return this.priceGrouplist$;
  }

  getPriceGroupTotalElements() {
    return this.priceGroupTotalElements$;
  }

  getLocationList() {
    return this.locationList$;
  }

  getLocationPriceGroupMappingList() {
    return this.locationPriceGroupMappingList$;
  }

  getPriceGroupTypeList() {
    return this.priceGroupTypeList$;
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

  loadLocationList() {
    this.store.dispatch(new PriceGroupMappingActions.LoadLocationList());
  }
  loadPriceGroupList() {
    this.store.dispatch(new PriceGroupMappingActions.LoadPriceGroupList());
  }
  loadPriceGroupTypeList() {
    this.store.dispatch(new PriceGroupMappingActions.LoadPriceGroupTypeList());
  }
  loadLocationPriceGroupMappingList(locationCode: string) {
    this.store.dispatch(
      new PriceGroupMappingActions.LoadLocationPriceGroupMappingList(
        locationCode
      )
    );
  }
  loadResetLocationPriceGroupMapping() {
    this.store.dispatch(new PriceGroupMappingActions.ResetPriceGroupMapping());
  }
  saveLocationPriceGroupMapping(
    locationCode: string,
    locationPriceGroupMapping: LocationPriceGroupMapping
  ) {
    this.store.dispatch(
      new PriceGroupMappingActions.SavePriceGroupMapping({
        locationCode,
        locationPriceGroupMapping
      })
    );
  }
}
