import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import {
  CatchmentDetails,
  LoadCatchmentListingPayload,
} from '@poss-web/shared/models';

import * as catchmentActions from './catchment.actions';
import { CatchmentSelectors } from './catchment.selectors';
import { CatchmentState } from './catchment.state';

@Injectable()
export class CatchmentFacade {
  constructor(private store: Store<CatchmentState>) {}

  private catchmentListing$ = this.store.select(
    CatchmentSelectors.selectCatchmentListing
  );
  private catchmentDetails$ = this.store.select(
    CatchmentSelectors.selectCatchmentDetails
  );
  private catchmentSaveResponse$ = this.store.select(
    CatchmentSelectors.selectSaveCatchmentResponses
  );
  private catchmentEditResponse$ = this.store.select(
    CatchmentSelectors.selectEditCatchmentResponses
  );

  private totalCatchmentDetailsCount$ = this.store.select(
    CatchmentSelectors.selectTotalCatchmentDetailsCount
  );

  private isLoading$ = this.store.select(CatchmentSelectors.selectIsLoading);
  private hasError$ = this.store.select(CatchmentSelectors.selectError);

  getisLoading() {
    return this.isLoading$;
  }

  getTotalcatchmentDetails() {
    return this.totalCatchmentDetailsCount$;
  }

  getCatchmentListing() {
    return this.catchmentListing$;
  }

  getCatchmentDetails() {
    return this.catchmentDetails$;
  }

  getCatchmentSaveResponse() {
    return this.catchmentSaveResponse$;
  }

  getCatchmentEditResponse() {
    return this.catchmentEditResponse$;
  }

  getError() {
    return this.hasError$;
  }

  loadCatchmentListing(
    loadTaxClassListingPayload: LoadCatchmentListingPayload
  ) {
    this.store.dispatch(
      new catchmentActions.LoadCatchmentListing(loadTaxClassListingPayload)
    );
  }

  searchCatchment(code: string) {
    this.store.dispatch(new catchmentActions.SearchCatchmentCode(code));
  }

  loadCatchmentDetails(payload: string) {
    this.store.dispatch(new catchmentActions.LoadCatchmentDetails(payload));
  }

  editCatchmentFormDetails(editFormDetails: CatchmentDetails) {
    this.store.dispatch(
      new catchmentActions.EditCatchmentFormDetails(editFormDetails)
    );
  }

  saveCatchmentFormDetails(saveFormDetails: CatchmentDetails) {
    this.store.dispatch(
      new catchmentActions.SaveCatchmentFormDetails(saveFormDetails)
    );
  }
}
