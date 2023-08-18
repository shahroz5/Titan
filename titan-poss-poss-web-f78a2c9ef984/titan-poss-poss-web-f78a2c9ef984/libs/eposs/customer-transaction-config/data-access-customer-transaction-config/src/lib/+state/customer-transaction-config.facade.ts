import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { CustomerTransactionConfigState } from './customer-transaction-config.state';
import {
  CustomerTransactionConfigListPayload,
  UpdateStatus,
  SaveCustomerTranConfigDetails
} from '@poss-web/shared/models';
import * as CustomerTransactionConfigActions from './customer-transaction-config.actions';
import { CustomerTransactionConfigSelectors } from './customer-transaction-config.selector';

@Injectable()
export class CustomerTransactionConfigFacade {
  constructor(public store: Store<CustomerTransactionConfigState>) {}
  private configList$ = this.store.select(
    CustomerTransactionConfigSelectors.selectCustomerTransactionConfigList
  );
  private totalElements$ = this.store.select(
    CustomerTransactionConfigSelectors.selectTotalElements
  );
  private isLoading$ = this.store.select(
    CustomerTransactionConfigSelectors.selectIsLoading
  );
  private error$ = this.store.select(
    CustomerTransactionConfigSelectors.selectError
  );
  private hasStatusUpdated$ = this.store.select(
    CustomerTransactionConfigSelectors.selectHasStatusUpdated
  );
  private hasSearched$ = this.store.select(
    CustomerTransactionConfigSelectors.selectHasSearched
  );
  private transactionTypes$ = this.store.select(
    CustomerTransactionConfigSelectors.selectTransactionTypes
  );
  private customers$ = this.store.select(
    CustomerTransactionConfigSelectors.selectCustomers
  );
  private hasSaved$ = this.store.select(
    CustomerTransactionConfigSelectors.selectHasSaved
  );
  private hasUpdated$ = this.store.select(
    CustomerTransactionConfigSelectors.selectHasUpdated
  );
  private configId$ = this.store.select(
    CustomerTransactionConfigSelectors.selectConfigId
  );
  private configDetails$ = this.store.select(
    CustomerTransactionConfigSelectors.selectConfigDetailsById
  );

  getConfigList() {
    return this.configList$;
  }
  getTotalElements() {
    return this.totalElements$;
  }
  getIsLoading() {
    return this.isLoading$;
  }
  getError() {
    return this.error$;
  }
  getHasStatusUpdated() {
    return this.hasStatusUpdated$;
  }
  getHasSearched() {
    return this.hasSearched$;
  }
  getTransactionTypes() {
    return this.transactionTypes$;
  }
  getCustomers() {
    return this.customers$;
  }
  getConfigId() {
    return this.configId$;
  }
  getHasSaved() {
    return this.hasSaved$;
  }
  getHasUpdated() {
    return this.hasUpdated$;
  }
  getConfigDetails() {
    return this.configDetails$;
  }

  loadConfigList(listPayload: CustomerTransactionConfigListPayload) {
    this.store.dispatch(
      new CustomerTransactionConfigActions.LoadCustomerTransactionConfigList(
        listPayload
      )
    );
  }
  searchConfigName(configName: string) {
    this.store.dispatch(
      new CustomerTransactionConfigActions.SearchConfigName(configName)
    );
  }
  updateConfigStatus(statusPayload: UpdateStatus) {
    this.store.dispatch(
      new CustomerTransactionConfigActions.UpdateConfigStatus(statusPayload)
    );
  }
  loadTransactionTypes(type: string) {
    this.store.dispatch(
      new CustomerTransactionConfigActions.LoadTransactionTypes(type)
    );
  }
  loadCustomers() {
    this.store.dispatch(new CustomerTransactionConfigActions.LoadCustomers());
  }
  saveCustomerTranConfigDetails(savePayload: SaveCustomerTranConfigDetails) {
    this.store.dispatch(
      new CustomerTransactionConfigActions.SaveCustomerTransactionConfigDetails(
        savePayload
      )
    );
  }
  updateCustomerTranConfigDetails(
    updatePayload: SaveCustomerTranConfigDetails
  ) {
    this.store.dispatch(
      new CustomerTransactionConfigActions.UpdateCustomerTransactionConfigDetails(
        updatePayload
      )
    );
  }

  loadConfigDetailsById(configId: string) {
    this.store.dispatch(
      new CustomerTransactionConfigActions.GetCustomerTransactionConfigDetails(
        configId
      )
    );
  }

  resetCustomerConfigs() {
    this.store.dispatch(
      new CustomerTransactionConfigActions.ResetCustomerConfigs()
    );
  }
}
