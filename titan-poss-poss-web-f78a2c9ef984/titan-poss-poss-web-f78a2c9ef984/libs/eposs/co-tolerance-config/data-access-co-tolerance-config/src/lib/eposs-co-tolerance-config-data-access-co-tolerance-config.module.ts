import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';
import {
  CoToleranceConfigFeatureKey,
  coToleranceConfigReducer
} from './+state/co-tolerance-config.reducer';
import { EffectsModule } from '@ngrx/effects';
import { CoToleranceConfigEffect } from './+state/co-tolerance-config.effect';
import { CoToleranceConfigService } from './co-tolerance-config.service';
import { CoToleranceConfigFacade } from './+state/co-tolerance-config.facade';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(
      CoToleranceConfigFeatureKey,
      coToleranceConfigReducer
    ),
    EffectsModule.forFeature([CoToleranceConfigEffect])
  ],
  providers: [CoToleranceConfigService, CoToleranceConfigFacade]
})
export class EpossCoToleranceConfigDataAccessCoToleranceConfigModule {}
