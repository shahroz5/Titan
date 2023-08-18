import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';

import { PaymentConfigurationState } from './payment-configuration.state';
import { PaymentConfigurationSelectors } from './payment-configuration.selector';
import {
  PaymentConfigurationListPayLoad,
  SavePaymentConfigurationPayload,
  UpdatePaymentConfigurationPayload,
  LoadSelectedConfigById
} from '@poss-web/shared/models';
import * as PaymentConfigurationAction from './payment-configuration.actions';

@Injectable()
export class PaymentConfigurationFacade {
  constructor(public store: Store<PaymentConfigurationState>) {}

  private isLoading$ = this.store.select(
    PaymentConfigurationSelectors.selectIsloading
  );
  private error$ = this.store.select(PaymentConfigurationSelectors.selectError);
  private hasSaved$ = this.store.select(
    PaymentConfigurationSelectors.selectHasSaved
  );
  private hasUpdated$ = this.store.select(
    PaymentConfigurationSelectors.selectHasUpdated
  );

  private totalElements$ = this.store.select(
    PaymentConfigurationSelectors.selectTotalElements
  );
  private paymentConfigurationList$ = this.store.select(
    PaymentConfigurationSelectors.selectPaymentConfigurationList
  );
  private paymentConfiguration$ = this.store.select(
    PaymentConfigurationSelectors.selectPaymentConfiguration
  );

  private selectedOptions$ = this.store.select(
    PaymentConfigurationSelectors.selectSelectedOptions
  );

  private transactionTypes$ = this.store.select(
    PaymentConfigurationSelectors.selectTransactionType
  );
  private paymentModes$ = this.store.select(
    PaymentConfigurationSelectors.selectPaymentModes
  );

  private configId$ = this.store.select(
    PaymentConfigurationSelectors.selectConfigId
  );

  private paymentModeCount$ = this.store.select(
    PaymentConfigurationSelectors.selectPaymentModeCount
  );

  private tcsPaymentModes$ = this.store.select(
    PaymentConfigurationSelectors.selectTcsPaymentModes
  );

  getTcsPaymentModes() {
    return this.tcsPaymentModes$;
  }
  getPaymentModeCount() {
    return this.paymentModeCount$;
  }
  getHasSaved() {
    return this.hasSaved$;
  }
  getHasUpdated() {
    return this.hasUpdated$;
  }
  getTotalElements() {
    return this.totalElements$;
  }
  getError() {
    return this.error$;
  }

  getIsloading() {
    return this.isLoading$;
  }

  getPaymentConfigurationList() {
    return this.paymentConfigurationList$;
  }

  getPaymentConfiguration() {
    return this.paymentConfiguration$;
  }

  getSelectedOptions() {
    return this.selectedOptions$;
  }
  getTransactionTypes() {
    return this.transactionTypes$;
  }
  getPaymentModes() {
    return this.paymentModes$;
  }

  getConfigId() {
    return this.configId$;
  }

  loadTcsPaymentModes(configId: string) {
    this.store.dispatch(
      new PaymentConfigurationAction.LoadTCSPaymentMode(configId)
    );
  }
  loadPaymentConfigurationList(
    paymentConfigurationListPayload: PaymentConfigurationListPayLoad
  ) {
    this.store.dispatch(
      new PaymentConfigurationAction.LoadPaymentConfigurationList(
        paymentConfigurationListPayload
      )
    );
  }
  searchPaymentConfigurationList(searchValue: string) {
    this.store.dispatch(
      new PaymentConfigurationAction.SearchPaymentConfigurationList(searchValue)
    );
  }
  checkUniquePaymentName(searchValue: string) {
    this.store.dispatch(
      new PaymentConfigurationAction.CheckUniquePaymentName(searchValue)
    );
  }
  loadPaymentModeAndTransacionType(payload: any) {
    this.store.dispatch(
      new PaymentConfigurationAction.LoadPaymentModesandTransactionTypes(
        payload
      )
    );
  }

  loadPaymentModeCount() {
    this.store.dispatch(new PaymentConfigurationAction.LoadPaymentModeCount());
  }
  updateCount(dataToUpdate: { count: number; id: string }) {
    this.store.dispatch(
      new PaymentConfigurationAction.UpdateCount(dataToUpdate)
    );
  }
  savePaymentConfiguration(
    savePaymentConfiguration: SavePaymentConfigurationPayload
  ) {
    this.store.dispatch(
      new PaymentConfigurationAction.SavePaymentConfiguration(
        savePaymentConfiguration
      )
    );
  }
  updatePaymentConfiguration(
    updatePaymentConfiguration: UpdatePaymentConfigurationPayload
  ) {
    this.store.dispatch(
      new PaymentConfigurationAction.UpdatePaymentConfiguration(
        updatePaymentConfiguration
      )
    );
  }
  loadPaymentConfigurationByConfigId(configId: string) {
    this.store.dispatch(
      new PaymentConfigurationAction.LoadPaymentConfigurationByConfigId(
        configId
      )
    );
  }
  loadMappedCount(configId: string) {
    this.store.dispatch(
      new PaymentConfigurationAction.LoadMappedCount(configId)
    );
  }
  loadSelectedPaymentConfigurationByConfigId(
    loadSelectedConfigById: LoadSelectedConfigById
  ) {
    this.store.dispatch(
      new PaymentConfigurationAction.LoadSelectedPaymentConfigurationDetailsByConfigId(
        loadSelectedConfigById
      )
    );
  }
  updateSelectedPaymentConfigurationByConfigId(
    updatePaymentConfiguration: UpdatePaymentConfigurationPayload
  ) {
    this.store.dispatch(
      new PaymentConfigurationAction.UpdateSelectedPaymentConfigurationDetailsByConfigId(
        updatePaymentConfiguration
      )
    );
  }

  loadReset() {
    this.store.dispatch(new PaymentConfigurationAction.LoadReset());
  }
}
