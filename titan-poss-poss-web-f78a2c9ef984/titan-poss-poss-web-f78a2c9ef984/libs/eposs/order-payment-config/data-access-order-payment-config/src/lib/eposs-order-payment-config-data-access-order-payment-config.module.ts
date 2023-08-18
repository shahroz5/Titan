import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  OrderPaymentConfigFeatureKey,
  OrderPaymentReducer
} from './+state/order-config.reducer';
import { OrderPaymentConfigEffect } from './+state/order-config.effects';
import { OrderPaymentConfigService } from './order-payment-config.service';
import { OrderPaymentFacade } from './+state/order-config.facade';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(OrderPaymentConfigFeatureKey, OrderPaymentReducer),
    EffectsModule.forFeature([OrderPaymentConfigEffect])
  ],
  declarations: [],
  providers: [OrderPaymentConfigService, OrderPaymentFacade]
})
export class EpossOrderPaymentConfigDataAccessOrderPaymentConfigModule {}
