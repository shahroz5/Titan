import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as glLocationPaymentActions from './gl-location.actions';
import { GlLocationPaymentSelectors } from './gl-location.selectors';
import {
  SaveGlLocationPayments,
  GLLocationPaymentListPayload
} from '@poss-web/shared/models';
import { GlLocationPaymentState } from './gl-location.state';
@Injectable()
export class GlLocationPaymentFacade {
  constructor(private store: Store<GlLocationPaymentState>) {}

  private isLoading$ = this.store.select(
    GlLocationPaymentSelectors.selectIsLoading
  );

  private hasError$ = this.store.select(GlLocationPaymentSelectors.selectError);
  private isSaved$ = this.store.select(
    GlLocationPaymentSelectors.selectIsSaved
  );
  private glLocationPaymentListing$ = this.store.select(
    GlLocationPaymentSelectors.selectGlLocPaymentList
  );
  private totalElements$ = this.store.select(
    GlLocationPaymentSelectors.selectTotalElements
  );
  private paymentCodes$ = this.store.select(
    GlLocationPaymentSelectors.selectPaymentCodes
  );
  private locationCodes$ = this.store.select(
    GlLocationPaymentSelectors.selectLocationCodes
  );

  getGlLocationPaymentList() {
    return this.glLocationPaymentListing$;
  }
  getIsLoading() {
    return this.isLoading$;
  }
  getIsSaved() {
    return this.isSaved$;
  }
  getError() {
    return this.hasError$;
  }
  getTotalElements() {
    return this.totalElements$;
  }
  getPaymentCodes() {
    return this.paymentCodes$;
  }
  getLocationData() {
    return this.locationCodes$;
  }
  loadGlLocationPaymentListing(
    payload: GLLocationPaymentListPayload,
    locCode?: any
  ) {
    this.store.dispatch(
      new glLocationPaymentActions.LoadGlLocationPaymentList(payload, locCode)
    );
  }

  saveGlLocationPaymentListing(payload: SaveGlLocationPayments) {
    this.store.dispatch(
      new glLocationPaymentActions.SaveGlLocationPayment(payload)
    );
  }
  updateRowData(data: { id: string; glCode: number; paymentCode: string }) {
    this.store.dispatch(
      new glLocationPaymentActions.UpdateGlLocationPayment(data)
    );
  }
  deleteRowData(data: string) {
    this.store.dispatch(
      new glLocationPaymentActions.DeleteGlLocationPayment(data)
    );
  }
  loadPaymentCodes() {
    this.store.dispatch(new glLocationPaymentActions.LoadPaymentCodes());
  }
  loadLocations() {
    this.store.dispatch(new glLocationPaymentActions.GetLocationCodes());
  }
  resetGlPaymentDetails() {
    this.store.dispatch(new glLocationPaymentActions.ResetGlPaymentDetails());
  }
}
