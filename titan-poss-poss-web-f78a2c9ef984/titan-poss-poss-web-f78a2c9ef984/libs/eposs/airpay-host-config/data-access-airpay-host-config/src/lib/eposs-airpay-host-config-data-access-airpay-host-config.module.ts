import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { AirpayHostConfigurationEffect } from './+state/airpay-host-configuration.effects';
import {
  AirpayHostConfigurationReducer,
  airpayHostConfigurationKey
} from './+state/airpay-host-configuration.reducer';
import { AirpayHostConfigurationFacade } from './+state/airpay-host-configuration.facade';
import { AirpayHostConfigurationService } from './airpay-host-configuration.service';
@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(
      airpayHostConfigurationKey,
      AirpayHostConfigurationReducer
    ),
    EffectsModule.forFeature([AirpayHostConfigurationEffect])
  ],
  providers: [AirpayHostConfigurationFacade, AirpayHostConfigurationService]
})
export class EpossAirpayHostConfigDataAccessAirpayHostConfigModule {}
