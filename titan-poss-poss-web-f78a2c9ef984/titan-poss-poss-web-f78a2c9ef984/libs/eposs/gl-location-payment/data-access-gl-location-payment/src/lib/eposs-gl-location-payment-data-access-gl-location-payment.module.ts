import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { GlLocationPaymentService } from './gl-location-payment.service';
import { GlLocationPaymentFacade } from './+state/gl-location.facade';
import { GlLocationPaymentEffect } from './+state/gl-location.effects';
import { NgModule } from '@angular/core';
import {
  GlLocationPaymentReducer,
  GL_LOCATION_PAYMENT_FEATURE_KEY
} from './+state/gl-location.reducer';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(
      GL_LOCATION_PAYMENT_FEATURE_KEY,
      GlLocationPaymentReducer
    ),
    EffectsModule.forFeature([GlLocationPaymentEffect])
  ],
  providers: [GlLocationPaymentFacade, GlLocationPaymentService]
})
export class EpossGlLocationPaymentDataAccessGlLocationPaymentModule {}
