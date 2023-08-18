import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ResidualWeightConfigEffect } from './+state/residual-weight-config.effect';
import {
  residualWeightConfigReducer,
  ResidualWeightConfigFeatureKey
} from './+state/residual-weight-config.reducer';
import { ResidualWeightConfigFacade } from './+state/residual-weight-config.facade';
import { ResidualWeightConfigService } from './residual-weight-config.service';
@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(
      ResidualWeightConfigFeatureKey,
      residualWeightConfigReducer
    ),
    EffectsModule.forFeature([ResidualWeightConfigEffect])
  ],
  providers: [ResidualWeightConfigFacade, ResidualWeightConfigService]
})
export class EpossResidualWeightConfigDataAccessResidualWeightConfigModule {}
