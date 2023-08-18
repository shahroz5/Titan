import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { CASHPAYMENTCONFIGURATION_FEATURE_KEY, CashPaymentConfigurationReducer } from './+state/cash-payment-configuration.reducer';
import { CashPaymentConfigurationEffect } from './+state/cash-payment-configuration.effect';
import { CashPaymentConfigurationService } from './cash-payment-configuration.service';
import { CashPaymentConfigurationFacade } from './+state/cash-payment-configuration.facade';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(CASHPAYMENTCONFIGURATION_FEATURE_KEY, CashPaymentConfigurationReducer),
    EffectsModule.forFeature([CashPaymentConfigurationEffect])
  ],
  providers: [CashPaymentConfigurationFacade, CashPaymentConfigurationService]
})
export class EpossCashPaymentConfigDataAccessCashPaymentConfigModule { }
