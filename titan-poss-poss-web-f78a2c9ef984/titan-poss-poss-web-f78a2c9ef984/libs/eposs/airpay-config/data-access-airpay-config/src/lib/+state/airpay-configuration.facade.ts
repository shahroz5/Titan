import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AirpayConfigurationState } from './airpay-configuration.state';
import * as AirpayConfigurationActions from './airpay-configuration.actions';
import { AirpayConfigurationSelectors } from './airpay-configuration.selectors';
import { ListPayload, SortItem } from '@poss-web/shared/models';

@Injectable()
export class AirpayConfigurationFacade {
  constructor(private store: Store<AirpayConfigurationState>) {}

  private vendorList$ = this.store.select(
    AirpayConfigurationSelectors.selectVendorList
  );
  private totalElements$ = this.store.select(
    AirpayConfigurationSelectors.selectTotalElements
  );

  private hasError$ = this.store.select(
    AirpayConfigurationSelectors.selectHasError
  );

  private isLoading$ = this.store.select(
    AirpayConfigurationSelectors.selectIsLoading
  );
  /**
   * Access for state selectors
   */

  loadVendorList(
    payload: ListPayload,
    sortField?: SortItem,
    locationCode?: string
  ) {
    this.store.dispatch(
      new AirpayConfigurationActions.GetAirpayVendorList(
        payload,
        sortField,
        locationCode
      )
    );
  }

  getTotalElements() {
    return this.totalElements$;
  }

  GetVendorList() {
    return this.vendorList$;
  }
  clearResponse() {
    this.store.dispatch(new AirpayConfigurationActions.ResetResponse());
  }

  getError() {
    return this.hasError$;
  }

  getIsLoading() {
    return this.isLoading$;
  }
}
