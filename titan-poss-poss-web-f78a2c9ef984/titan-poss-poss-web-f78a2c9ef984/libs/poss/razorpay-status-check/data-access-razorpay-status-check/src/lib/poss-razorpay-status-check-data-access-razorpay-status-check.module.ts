import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { EffectsModule } from '@ngrx/effects';
import { RazorpayStatusCheckFacade } from './+state/razorpay-status-check.facade';
import { RazorpayStatusCheckService } from './razorpay-status-check.service';
import { RazorpayPaymentRequestEffects } from './+state/razorpay-status-check.effects';
import {
  RazorpayStatusCheckReducer,
  RAZORPPAY_STATUS_CHECK_FEATURE_KEY
} from './+state/razorpay-status-check.reducer';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(
      RAZORPPAY_STATUS_CHECK_FEATURE_KEY,
      RazorpayStatusCheckReducer
    ),
    EffectsModule.forFeature([RazorpayPaymentRequestEffects])
  ],
  providers: [RazorpayStatusCheckFacade, RazorpayStatusCheckService]
})
export class PossRazorpayStatusCheckDataAccessRazorpayStatusCheckModule {}
