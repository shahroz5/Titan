import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';
import {
  AbToleranceConfigFeatureKey,
  abToleranceConfigReducer
} from './+state/ab-tolerance-config.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AbToleranceConfigEffect } from './+state/ab-tolerance-config.effect';
import { AbToleranceConfigService } from './ab-tolerance-config.service';
import { AbToleranceConfigFacade } from './+state/ab-tolerance-config.facade';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(
      AbToleranceConfigFeatureKey,
      abToleranceConfigReducer
    ),
    EffectsModule.forFeature([AbToleranceConfigEffect])
  ],
  providers: [AbToleranceConfigService, AbToleranceConfigFacade]
})
export class EpossAbToleranceConfigDataAccessAbToleranceConfigModule {}
