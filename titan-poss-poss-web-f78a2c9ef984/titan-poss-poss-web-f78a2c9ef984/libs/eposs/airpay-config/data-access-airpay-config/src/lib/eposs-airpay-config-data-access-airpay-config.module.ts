import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { AirpayConfigurationEffect } from './+state/airpay-configuration.effects';
import {
  AirpayConfigurationReducer,
  airpayConfigurationKey
} from './+state/airpay-configuration.reducer';
import { AirpayConfigurationFacade } from './+state/airpay-configuration.facade';
import { AirpayConfigurationService } from './airpay-configuration.service';
@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(airpayConfigurationKey, AirpayConfigurationReducer),
    EffectsModule.forFeature([AirpayConfigurationEffect])
  ],
  providers: [AirpayConfigurationFacade, AirpayConfigurationService]
})
export class EpossAirpayConfigDataAccessAirpayConfigModule {}
