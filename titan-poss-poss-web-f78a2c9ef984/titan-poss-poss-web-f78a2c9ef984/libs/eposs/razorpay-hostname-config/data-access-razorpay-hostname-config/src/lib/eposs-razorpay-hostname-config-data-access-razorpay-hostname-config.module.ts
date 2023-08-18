import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  razorpayConfigurationKey,
  razorpayConfigurationReducer
} from './+state/razorpay-access-mapping.reducers';
import { RazorpayConfigurationEffect } from './+state/razorpay-access-mapping.effects';
import { RazorpayConfigurationService } from './razorpay-config.service';
import { RazorpayConfigurationFacade } from './+state/razorpay-access-mapping.facade';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(
      razorpayConfigurationKey,
      razorpayConfigurationReducer
    ),
    EffectsModule.forFeature([RazorpayConfigurationEffect])
  ],
  providers: [RazorpayConfigurationService, RazorpayConfigurationFacade]
})
export class EpossRazorpayHostnameConfigDataAccessRazorpayHostnameConfigModule {}
