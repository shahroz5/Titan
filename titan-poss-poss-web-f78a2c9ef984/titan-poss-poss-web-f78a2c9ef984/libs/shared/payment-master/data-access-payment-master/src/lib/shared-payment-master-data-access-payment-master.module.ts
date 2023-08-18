import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { PaymentMasterFacade } from './+state/payment-master.facade';
import { PaymentMasterService } from './payment-master.service';
import { PAYMENT_MASTER_FEATURE_NAME, paymentMasterReducers } from './+state/payment-master.reducers';
import { PaymentMasterEffects } from './+state/payment-master.effects';

@NgModule({
  imports: [CommonModule,
    EffectsModule.forFeature([PaymentMasterEffects]),
    StoreModule.forFeature(PAYMENT_MASTER_FEATURE_NAME, paymentMasterReducers)
  ],
  providers: [PaymentMasterFacade, PaymentMasterService]
})
export class SharedPaymentMasterDataAccessPaymentMasterModule { }
