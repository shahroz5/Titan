import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AirpayHostConfigurationState } from './airpay-host-configuration.state';
import * as AirpayHostConfigurationActions from './airpay-host-configuration.actions';
import { AirpayHostConfigurationSelectors } from './airpay-host-configuration.selectors';
import {
  ListingPayload,
  SortItem
} from '@poss-web/shared/models';

@Injectable()
export class AirpayHostConfigurationFacade {
  constructor(private store: Store<AirpayHostConfigurationState>) {}

  private hostList$ = this.store.select(
    AirpayHostConfigurationSelectors.selecthostNameList
  );
  private totalElements$ = this.store.select(
    AirpayHostConfigurationSelectors.selectTotalElements
  );

  private hasError$ = this.store.select(
    AirpayHostConfigurationSelectors.selectHasError
  );

  private isLoading$ = this.store.select(
    AirpayHostConfigurationSelectors.selectIsLoading
  );

  /**
   * Access for state selectors
   */

  loadHostNameList(
    payload: ListingPayload,
    sortField?: SortItem,
    locationCode?: string
  ) {
    this.store.dispatch(
      new AirpayHostConfigurationActions.GetHostNameList(
        payload,
        sortField,
        locationCode
      )
    );
  }

  getTotalElements() {
    return this.totalElements$;
  }

  GetHostNameList() {
    return this.hostList$;
  }
  clearResponse() {
    this.store.dispatch(new AirpayHostConfigurationActions.ResetResponse());
  }

  getError() {
    return this.hasError$;
  }

  getIsLoading() {
    return this.isLoading$;
  }
}
