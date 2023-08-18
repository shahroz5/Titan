import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';

import { GRNWeightValueConfigService } from './weight-value-config.service';
import {
  WEIGHT_VALUE_CONFIG_FEATURE_KEY,
  GRNWeightValueConfigReducer
} from './+state/weight-value-config.reducer';
import { GRNWeightValueConfigFacade } from './+state/weight-value-config.facade';
import { GRNWeightValueConfigEffect } from './+state/weight-value-config.effect';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(
      WEIGHT_VALUE_CONFIG_FEATURE_KEY,
      GRNWeightValueConfigReducer
    ),
    EffectsModule.forFeature([GRNWeightValueConfigEffect])
  ],
  providers: [GRNWeightValueConfigFacade, GRNWeightValueConfigService]
})
export class EpossGrnToleranceConfigDataAccessGrnToleranceConfigModule {}
