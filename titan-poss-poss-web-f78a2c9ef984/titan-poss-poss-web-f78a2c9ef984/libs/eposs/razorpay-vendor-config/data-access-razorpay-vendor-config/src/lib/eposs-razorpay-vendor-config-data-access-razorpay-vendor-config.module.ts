import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  razorpayVendorConfigurationKey,
  razorpayVendorConfigurationReducer
} from './+state/razorpay-vendor-mapping.reducers';
import { RazorpayVendorConfigurationEffect } from './+state/razorpay-vendor-mapping.effects';
import { RazorpayVendorConfigurationService } from './razorpay-vendor-config.service';
import { RazorpayVendorConfigurationFacade } from './+state/razorpay-vendor-mapping.facade';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(
      razorpayVendorConfigurationKey,
      razorpayVendorConfigurationReducer
    ),
    EffectsModule.forFeature([RazorpayVendorConfigurationEffect])
  ],
  providers: [
    RazorpayVendorConfigurationService,
    RazorpayVendorConfigurationFacade
  ]
})
export class EpossRazorpayVendorConfigDataAccessRazorpayVendorConfigModule {}
