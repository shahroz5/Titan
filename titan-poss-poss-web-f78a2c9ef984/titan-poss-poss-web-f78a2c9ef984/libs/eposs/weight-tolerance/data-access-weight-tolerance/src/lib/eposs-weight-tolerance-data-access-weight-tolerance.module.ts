import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  weightToleranceFeatureKey,
  weightToleranceReducer
} from './+state/weight-tolerance.reducer';
import { WeightToleranceEffect } from './+state/weight-tolerance.effect';
import { WeightToleranceFacade } from './+state/weight-tolerance.facade';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { WeightToleranceService } from './weight-tolerance.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(weightToleranceFeatureKey, weightToleranceReducer),
    EffectsModule.forFeature([WeightToleranceEffect])
  ],
  providers: [WeightToleranceFacade, WeightToleranceService]
})
export class EpossWeightToleranceDataAccessWeightToleranceModule {}
