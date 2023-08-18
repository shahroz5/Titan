import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';

import { WeightValueConfigService } from './weight-value-config.service';
import {
  WEIGHT_VALUE_CONFIG_FEATURE_KEY,
  WeightValueConfigReducer
} from './+state/weight-value-config.reducer';
import { WeightValueConfigFacade } from './+state/weight-value-config.facade';
import { WeightValueConfigEffect } from './+state/weight-value-config.effect';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(WEIGHT_VALUE_CONFIG_FEATURE_KEY, WeightValueConfigReducer),
    EffectsModule.forFeature([WeightValueConfigEffect])
  ],
  providers: [WeightValueConfigFacade, WeightValueConfigService]
})
export class EpossGrfToleranceConfigDataAccessGrfToleranceConfigModule { }
