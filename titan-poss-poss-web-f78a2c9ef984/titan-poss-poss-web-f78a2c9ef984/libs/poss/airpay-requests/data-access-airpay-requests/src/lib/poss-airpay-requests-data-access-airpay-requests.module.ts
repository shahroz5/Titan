import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { EffectsModule } from '@ngrx/effects';
import { AirpayPaymentRequestEffects } from './+state/airpay-payment-requests.effects';
import {
  AIRPAY_PAYMENT_REQUEST_FEATURE_KEY,
  AirpayPaymentRequestReducer
} from './+state/airpay-payment-requests.reducer';
import { AirpayPaymentReqFacade } from './+state/airpay-payment-requests.facade';
import { AirpayPaymentRequestService } from './airpay-payment-request.service';
@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(
      AIRPAY_PAYMENT_REQUEST_FEATURE_KEY,
      AirpayPaymentRequestReducer
    ),
    EffectsModule.forFeature([AirpayPaymentRequestEffects])
  ],
  providers: [AirpayPaymentReqFacade, AirpayPaymentRequestService]
})
export class PossAirpayRequestsDataAccessAirpayRequestsModule {}
