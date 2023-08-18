
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';


import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { paymentConfigurationFeatureKey, paymentConfigurationReducer } from './+state/payment-configuration.reducer';
import { PaymentConfigurationEffect } from './+state/payment-configuration.effect';
import { PaymentConfigurationFacade } from './+state/payment-configuration.facade';
import { PaymentConfigurationService } from './payment-configuration.service';

@NgModule({
  imports: [CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(paymentConfigurationFeatureKey, paymentConfigurationReducer),
    EffectsModule.forFeature([PaymentConfigurationEffect])
  ],
  providers: [PaymentConfigurationFacade, PaymentConfigurationService]

})
export class EpossPaymentConfigurationDataAccessPaymentConfigurationModule { }
