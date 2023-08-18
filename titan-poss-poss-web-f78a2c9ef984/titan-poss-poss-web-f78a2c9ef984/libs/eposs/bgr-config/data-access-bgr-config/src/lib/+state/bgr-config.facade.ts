import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as BgrConfigActions from './bgr-config.actions';
import { BgrConfigSelectors } from './bgr-config.selectors';
import {
  BgrConfigDetails,
  BgrConfigListingParams,
  BgrConfigListingRequestPayload
} from '@poss-web/shared/models';
import { BgrConfigState } from './bgr-config.state';

@Injectable()
export class BgrConfigFacade {
  constructor(private store: Store<BgrConfigState>) {}

  private bgrConfigListing$ = this.store.select(
    BgrConfigSelectors.selectBgrConfigListing
  );

  private bgrConfigDetails$ = this.store.select(
    BgrConfigSelectors.selectBgrConfigDetails
  );

  private bgrConfigDetailsSaved$ = this.store.select(
    BgrConfigSelectors.selectBgrConfigDetailsSaved
  );

  private bgrConfigDetailsEdited$ = this.store.select(
    BgrConfigSelectors.selectBgrConfigDetailsEdited
  );

  private bgrConfigTotal$ = this.store.select(
    BgrConfigSelectors.selectBgrConfigTotal
  );

  private isLoading$ = this.store.select(BgrConfigSelectors.selectIsLoading);

  private hasError$ = this.store.select(BgrConfigSelectors.selectError);

  getBgrConfigListing() {
    return this.bgrConfigListing$;
  }

  getBgrConfigDetails() {
    return this.bgrConfigDetails$;
  }

  getBgrConfigDetailsSaved() {
    return this.bgrConfigDetailsSaved$;
  }

  getBgrConfigDetailsEdited() {
    return this.bgrConfigDetailsEdited$;
  }

  getBgrConfigTotal() {
    return this.bgrConfigTotal$;
  }

  getIsLoading() {
    return this.isLoading$;
  }

  getError() {
    return this.hasError$;
  }

  loadBgrConfigListing(
    params: BgrConfigListingParams,
    payload: BgrConfigListingRequestPayload
  ) {
    this.store.dispatch(
      new BgrConfigActions.LoadBgrConfigListing(params, payload)
    );
  }

  searchBgrConfigListing(payload: string) {
    this.store.dispatch(new BgrConfigActions.SearchBgrConfigListing(payload));
  }

  loadBgrConfigDetails(payload: any) {
    this.store.dispatch(new BgrConfigActions.LoadBgrConfigDetails(payload));
  }

  saveBgrConfigDetails(payload: BgrConfigDetails, locationMappingDetails: any) {
    this.store.dispatch(
      new BgrConfigActions.SaveBgrConfigDetails(payload, locationMappingDetails)
    );
  }

  editBgrConfigDetails(payload: BgrConfigDetails) {
    this.store.dispatch(new BgrConfigActions.EditBgrConfigDetails(payload));
  }
}
