import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { PaymentEffects } from './+state/payment.effects';
import { PaymentFeatureKey, paymentsReducer } from './+state/payment.reducer';
import { PaymentFacade } from './+state/payment.facade';
import { PaymentService } from './payment.service';
import { UnipayService } from './unipay.service';


@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(PaymentFeatureKey, paymentsReducer),
    EffectsModule.forFeature([PaymentEffects])
  ],
  providers: [PaymentFacade, PaymentService, UnipayService]
})
export class SharedPaymentDataAccessPaymentModule {}
