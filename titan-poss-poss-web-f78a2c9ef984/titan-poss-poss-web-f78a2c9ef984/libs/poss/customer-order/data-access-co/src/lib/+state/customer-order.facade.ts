import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { customerOrderSelectors } from './customer-order.selectors';
import { CustomerOrderState } from './customer-order.state';
import * as CustomerOrderActions from './customer-order.actions';
import { CODetailsRequestPayload } from '@poss-web/shared/models';

@Injectable()
export class CustomerOrderFacade {
  constructor(private store: Store<CustomerOrderState>) {}

  private hasError$ = this.store.select(customerOrderSelectors.selectHasError);

  private isLoading$ = this.store.select(
    customerOrderSelectors.selectIsLoading
  );

  private fetchedCOItems$ = this.store.select(
    customerOrderSelectors.selectFetchedCOItems
  );

  private createCORes$ = this.store.select(
    customerOrderSelectors.selectCreateCORes
  );

  private viewCORes$ = this.store.select(
    customerOrderSelectors.selectViewCORes
  );

  private updateCORes$ = this.store.select(
    customerOrderSelectors.selectUpdateCORes
  );

  private partialUpdateCORes$ = this.store.select(
    customerOrderSelectors.selectPartialUpdateCORes
  );

  private deleteCORes$ = this.store.select(
    customerOrderSelectors.selectDeleteCORes
  );

  private minCOValue$ = this.store.select(
    customerOrderSelectors.selectMinCOValue
  );

  private relationshipTypes$ = this.store.select(
    customerOrderSelectors.selectRelationshipTypes
  );

  private frozenBestRate$ = this.store.select(
    customerOrderSelectors.selectBestRate
  );

  private frozenCOVAlue$ = this.store.select(
    customerOrderSelectors.selectCOFrozenValue
  );

  private minFrozenCOAmount$ = this.store.select(
    customerOrderSelectors.selectMinCOFrozenAmount
  );

  fetchCOItems(CORequestPayload: CODetailsRequestPayload) {
    this.store.dispatch(new CustomerOrderActions.FetchCO(CORequestPayload));
  }

  createCO(CORequestPayload: CODetailsRequestPayload) {
    this.store.dispatch(new CustomerOrderActions.CreateCO(CORequestPayload));
  }

  viewCO(CORequestPayload: CODetailsRequestPayload) {
    this.store.dispatch(new CustomerOrderActions.ViewCO(CORequestPayload));
  }

  updateCO(CORequestPayload: CODetailsRequestPayload) {
    this.store.dispatch(new CustomerOrderActions.UpdateCO(CORequestPayload));
  }

  partialUpdateCO(CORequestPayload: CODetailsRequestPayload) {
    this.store.dispatch(
      new CustomerOrderActions.PartialUpdateCO(CORequestPayload)
    );
  }

  deleteCO(CORequestPayload: CODetailsRequestPayload) {
    this.store.dispatch(new CustomerOrderActions.DeleteCO(CORequestPayload));
  }

  loadRelationshipTypes(payload: string) {
    this.store.dispatch(
      new CustomerOrderActions.LoadRelationshipTypes(payload)
    );
  }

  resetFetchedCO() {
    this.store.dispatch(new CustomerOrderActions.ResetFetchedCO());
  }

  resetCORes() {
    this.store.dispatch(new CustomerOrderActions.ResetCORes());
  }

  updatePriceDetails(
    updateCOPayload: CODetailsRequestPayload,
    action?: string
  ) {
    this.store.dispatch(
      new CustomerOrderActions.UpdatePriceDetails(updateCOPayload, action)
    );
  }

  getHasError() {
    return this.hasError$;
  }

  getIsLoading() {
    return this.isLoading$;
  }

  getFetchedCOItems() {
    return this.fetchedCOItems$;
  }

  getCreateCORes() {
    return this.createCORes$;
  }

  getViewCORes() {
    return this.viewCORes$;
  }

  getUpdateCORes() {
    return this.updateCORes$;
  }

  getPartialUpdateCORes() {
    return this.partialUpdateCORes$;
  }

  getDeleteCORes() {
    return this.deleteCORes$;
  }

  getFrozenCOValue() {
    return this.frozenCOVAlue$;
  }

  getMinFrozenCOAmount() {
    return this.minFrozenCOAmount$;
  }

  getBestGoldRate() {
    return this.frozenBestRate$;
  }

  getMinCOValue() {
    return this.minCOValue$;
  }

  getRelationshipTypes() {
    return this.relationshipTypes$;
  }
}
