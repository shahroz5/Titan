import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  cmRequestFeatureKey,
  cmRequestReducer
} from './+state/grf-request.reducer';
import { GrfRequestEffects } from './+state/grf-request.effects';
import { grfRequestFacade } from './+state/grf-request.facade';
import { grfRequestService } from './grf-request.service';
import { PossCashMemoDataAccessCashMemoModule } from '@poss-web/poss/cash-memo/data-access-cash-memo';
import { SharedCommonDataAccessCommonModule } from '@poss-web/shared/common/data-access-common';
@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(cmRequestFeatureKey, cmRequestReducer),
    EffectsModule.forFeature([GrfRequestEffects]),
    PossCashMemoDataAccessCashMemoModule,
    SharedCommonDataAccessCommonModule
  ],
  providers: [grfRequestFacade, grfRequestService]
})
export class EpossGrfManualRequestDataAccessGrfRequestModule {}
