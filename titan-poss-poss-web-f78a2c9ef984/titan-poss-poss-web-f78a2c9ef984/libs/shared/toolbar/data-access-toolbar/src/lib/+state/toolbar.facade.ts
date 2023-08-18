import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as ToolbarActions from './toolbar.actions';
import { toolbarSelectors } from './toolbar.selectors';
import {
  TransactionListPayload,
  TransactionListCountPayload,
  ToolbarConfig
} from '@poss-web/shared/models';
import { ToolbarState } from './toolbar.state';

@Injectable()
export class ToolbarFacade {
  constructor(private store: Store<ToolbarState>) {}

  private hasError$ = this.store.select(toolbarSelectors.selectHasError);

  private isLoading$ = this.store.select(toolbarSelectors.selectIsLoading);

  private metalPriceDetails$ = this.store.select(
    toolbarSelectors.selectMetalPriceDetails
  );

  private previousMetalPriceDetails$ = this.store.select(
    toolbarSelectors.selectPreviousMetalPriceDetails
  );

  private openOrdersResponse$ = this.store.select(
    toolbarSelectors.selectOpenOrdersResponse
  );

  private openOrdersCountResponse$ = this.store.select(
    toolbarSelectors.selectOpenOrdersCountResponse
  );

  private onHoldResponse$ = this.store.select(
    toolbarSelectors.selectOnHoldResponse
  );

  private onHoldCountResponse$ = this.store.select(
    toolbarSelectors.selectOnHoldCountResponse
  );

  private toolbarConfig$ = this.store.select(
    toolbarSelectors.selectToolbarConfig
  );

  private confirmOrdersResponse$ = this.store.select(
    toolbarSelectors.selectConfirmOrdersResponse
  );

  loadMetalPriceDetails() {
    this.store.dispatch(new ToolbarActions.LoadMetalPriceDetails());
  }

  loadOpenOrders(openOrdersPayload: TransactionListPayload) {
    this.store.dispatch(new ToolbarActions.LoadOpenOrders(openOrdersPayload));
  }

  loadOpenOrdersCount(openOrdersCountPayload: TransactionListCountPayload) {
    this.store.dispatch(
      new ToolbarActions.LoadOpenOrdersCount(openOrdersCountPayload)
    );
  }

  loadOnHold(onHoldPayload: TransactionListPayload) {
    this.store.dispatch(new ToolbarActions.LoadOnHold(onHoldPayload));
  }

  loadOnHoldCount(onHoldCountPayload: TransactionListCountPayload) {
    this.store.dispatch(new ToolbarActions.LoadOnHoldCount(onHoldCountPayload));
  }

  loadConfirmOrders(confirmOrdersPayload: TransactionListPayload) {
    this.store.dispatch(
      new ToolbarActions.LoadConfirmOrders(confirmOrdersPayload)
    );
  }

  getHasError() {
    return this.hasError$;
  }

  getIsLoading() {
    return this.isLoading$;
  }

  getMetalPriceDetails() {
    return this.metalPriceDetails$;
  }

  getPreviousMetalPriceDetails() {
    return this.previousMetalPriceDetails$;
  }

  getOpenOrdersResponse() {
    return this.openOrdersResponse$;
  }

  getOpenOrdersCount() {
    return this.openOrdersCountResponse$;
  }

  getOnHoldResponse() {
    return this.onHoldResponse$;
  }

  getOnHoldCount() {
    return this.onHoldCountResponse$;
  }

  getConfirmOrdersResponse() {
    return this.confirmOrdersResponse$;
  }

  getToolbarConfig() {
    return this.toolbarConfig$;
  }

  resetOpenOrders() {
    this.store.dispatch(new ToolbarActions.ResetOpenOrders());
  }

  resetOnHold() {
    this.store.dispatch(new ToolbarActions.ResetOnHold());
  }

  resetValues() {
    this.store.dispatch(new ToolbarActions.ResetValues());
  }

  resetConfirmOrders() {
    this.store.dispatch(new ToolbarActions.ResetConfirmOrders());
  }

  setToolbarConfig(toolbarData: ToolbarConfig) {
    this.store.dispatch(new ToolbarActions.SetToolbarConfig(toolbarData));
  }
}
