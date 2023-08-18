import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatchmentService } from './catchment.service';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { CatchmentEffect } from './+state/catchment.effect';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CatchmentReducer, CATCHMENT_FEATURE_KEY } from './+state/catchment.reducer';
import { CatchmentFacade } from './+state/catchment.facade';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(CATCHMENT_FEATURE_KEY, CatchmentReducer),
    EffectsModule.forFeature([CatchmentEffect])
  ],
  providers: [CatchmentFacade, CatchmentService]
})
export class SharedCatchmentMasterDataAccessCatchmentMasterModule { }
