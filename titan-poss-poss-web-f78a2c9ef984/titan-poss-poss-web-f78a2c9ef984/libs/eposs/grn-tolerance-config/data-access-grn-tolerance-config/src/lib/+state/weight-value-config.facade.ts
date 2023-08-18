import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as WeightValueConfigActions from './weight-value-config.actions';
import { WeightValueConfigSelectors } from './weight-value-config.selectors';
import {
  LoadWeightValueConfigListingPayload,
  WeightValueConfigDetails
} from '@poss-web/shared/models';
import { GRNWeightValueConfigState } from './weight-value-config.state';

@Injectable()
export class GRNWeightValueConfigFacade {
  constructor(private store: Store<GRNWeightValueConfigState>) {}

  private weightValueConfigListing$ = this.store.select(
    WeightValueConfigSelectors.selectWeightValueConfigListing
  );

  private weightValueConfigDetails$ = this.store.select(
    WeightValueConfigSelectors.selectWeightValueConfigDetails
  );

  private weightValueConfigDetailsSaved$ = this.store.select(
    WeightValueConfigSelectors.selectWeightValueConfigDetailsSaved
  );

  private weightValueConfigDetailsEdited$ = this.store.select(
    WeightValueConfigSelectors.selectWeightValueConfigDetailsEdited
  );

  private weightValueConfigTotal$ = this.store.select(
    WeightValueConfigSelectors.selectWeightValueConfigTotal
  );

  private isLoading$ = this.store.select(
    WeightValueConfigSelectors.selectIsLoading
  );

  private hasError$ = this.store.select(WeightValueConfigSelectors.selectError);

  private mappedLocationsCount$ = this.store.select(
    WeightValueConfigSelectors.selectMappedLocationsCount
  );

  getWeightValueConfigListing() {
    return this.weightValueConfigListing$;
  }

  getWeightValueConfigDetails() {
    return this.weightValueConfigDetails$;
  }

  getWeightValueConfigDetailsSaved() {
    return this.weightValueConfigDetailsSaved$;
  }

  getWeightValueConfigDetailsEdited() {
    return this.weightValueConfigDetailsEdited$;
  }

  getWeightValueConfigTotal() {
    return this.weightValueConfigTotal$;
  }

  getIsLoading() {
    return this.isLoading$;
  }

  getError() {
    return this.hasError$;
  }

  getMappedLocationsCount() {
    return this.mappedLocationsCount$;
  }

  loadWeightValueConfigListing(payload: LoadWeightValueConfigListingPayload) {
    this.store.dispatch(
      new WeightValueConfigActions.LoadWeightValueConfigListing(payload)
    );
  }

  searchWeightValueConfigListing(payload: string) {
    this.store.dispatch(
      new WeightValueConfigActions.SearchWeightValueConfigListing(payload)
    );
  }

  loadWeightValueConfigDetails(payload: string) {
    this.store.dispatch(
      new WeightValueConfigActions.LoadWeightValueConfigDetails(payload)
    );
  }

  saveWeightValueConfigDetails(payload: WeightValueConfigDetails) {
    this.store.dispatch(
      new WeightValueConfigActions.SaveWeightValueConfigDetails(payload)
    );
  }

  editWeightValueConfigDetails(payload: WeightValueConfigDetails) {
    this.store.dispatch(
      new WeightValueConfigActions.EditWeightValueConfigDetails(payload)
    );
  }

  loadReset() {
    this.store.dispatch(new WeightValueConfigActions.LoadReset());
  }

  loadMappedLocationsCount(payload: string) {
    this.store.dispatch(
      new WeightValueConfigActions.LoadMappedLocationsCount(payload)
    );
  }
}
