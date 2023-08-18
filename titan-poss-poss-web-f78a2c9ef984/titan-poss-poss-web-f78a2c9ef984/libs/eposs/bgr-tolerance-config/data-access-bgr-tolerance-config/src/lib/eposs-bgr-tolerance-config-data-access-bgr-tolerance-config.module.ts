import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';
import {
  BgrToleranceConfigFeatureKey,
  bgrToleranceConfigReducer
} from './+state/bgr-tolerance-config.reducer';
import { EffectsModule } from '@ngrx/effects';
import { BgrToleranceConfigEffect } from './+state/bgr-tolerance-config.effect';
import { BgrToleranceConfigService } from './bgr-tolerance-config.service';
import { BgrToleranceConfigFacade } from './+state/bgr-tolerance-config.facade';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(
      BgrToleranceConfigFeatureKey,
      bgrToleranceConfigReducer
    ),
    EffectsModule.forFeature([BgrToleranceConfigEffect])
  ],
  providers: [BgrToleranceConfigService, BgrToleranceConfigFacade]
})
export class EpossBgrToleranceConfigDataAccessBgrToleranceConfigModule {}
