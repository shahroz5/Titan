import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  CoOrderPaymentConfigFeatureKey,
  CoOrderPaymentReducer
} from './+state/co-order-config.reducer';
import { CoOrderPaymentConfigEffect } from './+state/co-order-config.effects';
import { CoOrderPaymentConfigService } from './co-order-payment-config.service';
import { CoOrderPaymentFacade } from './+state/co-order-config.facade';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(
      CoOrderPaymentConfigFeatureKey,
      CoOrderPaymentReducer
    ),
    EffectsModule.forFeature([CoOrderPaymentConfigEffect])
  ],
  declarations: [],
  providers: [CoOrderPaymentConfigService, CoOrderPaymentFacade]
})
export class EpossCoOrderPaymentConfigDataAccessOrderPaymentConfigModule {}
