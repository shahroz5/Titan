import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  cmRequestFeatureKey,
  cmRequestReducer
} from './+state/cm-request.reducer';
import { CmRequestEffects } from './+state/cm-request.effects';
import { CmRequestFacade } from './+state/cm-request.facade';
import { CmRequestService } from './cm-request.service';
import { PossCashMemoDataAccessCashMemoModule } from '@poss-web/poss/cash-memo/data-access-cash-memo';
import { SharedCommonDataAccessCommonModule } from '@poss-web/shared/common/data-access-common';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(cmRequestFeatureKey, cmRequestReducer),
    EffectsModule.forFeature([CmRequestEffects]),
    PossCashMemoDataAccessCashMemoModule,
    SharedCommonDataAccessCommonModule
  ],
  providers: [CmRequestFacade, CmRequestService]
})
export class SharedManualCmRequestDataAccessCmRequestModule {}
