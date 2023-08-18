import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { PayerBankConfigState } from './payer-bank-config.state';
import {
  PayerBankConfigListingPayload,
  ToggleButtonPayload,
  SavePayerBankConfigDetailsPayload,
  UpdatePayerBankConfigPayload
} from '@poss-web/shared/models';
import * as PayerBankConfigurationActions from './payer-bank-config.actions';
import { PayerBankConfigSelectors } from './payer-bank-config.selector';

@Injectable()
export class PayerBankConfigFacade {
  constructor(private store: Store<PayerBankConfigState>) {}
  private totalElements$ = this.store.select(
    PayerBankConfigSelectors.selectTotalElements
  );
  private isLoading$ = this.store.select(
    PayerBankConfigSelectors.selectIsLoading
  );
  private error$ = this.store.select(PayerBankConfigSelectors.selectError);
  private payerBankConfigurations$ = this.store.select(
    PayerBankConfigSelectors.selectPayerBankConfigurations
  );
  private selectHasSaved$ = this.store.select(
    PayerBankConfigSelectors.selectHasSaved
  );
  private selectHasUpdated$ = this.store.select(
    PayerBankConfigSelectors.selectHasUpdated
  );
  private selectPayerBanks$ = this.store.select(
    PayerBankConfigSelectors.selectPayerBanks
  );
  private selectConfigId$ = this.store.select(
    PayerBankConfigSelectors.selectConfigId
  );
  private selectPayerBanksDetails$ = this.store.select(
    PayerBankConfigSelectors.selectPayerBankDetails
  );
  private selectPaymentModes$ = this.store.select(
    PayerBankConfigSelectors.selectPaymentModes
  );

  private selectHasSearched$ = this.store.select(
    PayerBankConfigSelectors.selectHasSearched
  );
  private selectBanksCount$ = this.store.select(
    PayerBankConfigSelectors.selectBanksCount
  );
  getTotalElements() {
    return this.totalElements$;
  }
  getIsLoading() {
    return this.isLoading$;
  }
  getError() {
    return this.error$;
  }
  getPayerBankConfigurations() {
    return this.payerBankConfigurations$;
  }
  getHasSaved() {
    return this.selectHasSaved$;
  }
  getConfigId() {
    return this.selectConfigId$;
  }
  getHasUpdated() {
    return this.selectHasUpdated$;
  }
  getPayerBanks() {
    return this.selectPayerBanks$;
  }

  getPayerBankDetails() {
    return this.selectPayerBanksDetails$;
  }
  getPaymentModes() {
    return this.selectPaymentModes$;
  }

  getHasSearched() {
    return this.selectHasSearched$;
  }
  getBanksCount() {
    return this.selectBanksCount$;
  }
  loadPayerBankConfigurations(payload: PayerBankConfigListingPayload) {
    this.store.dispatch(
      new PayerBankConfigurationActions.LoadPayerBankConfigurations(payload)
    );
  }
  savePayerBankConfigDetails(savePayload: SavePayerBankConfigDetailsPayload) {
    this.store.dispatch(
      new PayerBankConfigurationActions.SavePayerBankConfigDetails(savePayload)
    );
  }
  payerBankDetailsByConfigName(configId: string) {
    this.store.dispatch(
      new PayerBankConfigurationActions.PayerBankDetailsByConfigName(configId)
    );
  }
  updatePayerBankConfigDetails(updatePayload: UpdatePayerBankConfigPayload) {
    this.store.dispatch(
      new PayerBankConfigurationActions.UpdatePayerBankConfigDetails(
        updatePayload
      )
    );
  }
  searchConfigName(configName: string) {
    this.store.dispatch(
      new PayerBankConfigurationActions.SearchConfigName(configName)
    );
  }
  loadPayerBanks(payload: PayerBankConfigListingPayload) {
    this.store.dispatch(
      new PayerBankConfigurationActions.LoadPayerBanks(payload)
    );
  }
  updateToggleButton(payload: ToggleButtonPayload) {
    this.store.dispatch(
      new PayerBankConfigurationActions.UpdateToggleButton(payload)
    );
  }
  loadPaymentModes() {
    this.store.dispatch(new PayerBankConfigurationActions.LoadPaymentModes());
  }

  resetPayerBankConfigDetails() {
    this.store.dispatch(
      new PayerBankConfigurationActions.ResetPayerBankConfigDetails()
    );
  }

  searchPayerBankName(payerBankName: string) {
    this.store.dispatch(
      new PayerBankConfigurationActions.SearchPayerBank(payerBankName)
    );
  }
}
