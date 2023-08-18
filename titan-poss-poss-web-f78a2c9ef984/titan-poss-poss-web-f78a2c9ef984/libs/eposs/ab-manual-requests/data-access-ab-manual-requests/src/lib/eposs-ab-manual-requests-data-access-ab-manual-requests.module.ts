import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  AbManualRequestFeatureKey,
  AbManualRequestReducer
} from './+state/ab-manual-request.reducer';
import { AbManualRequestEffects } from './+state/ab-manual-request.effects';
import { AbManualRequestFacade } from './+state/ab-manual-request.facade';
import { AbManualRequestService } from './ab-manual-request.service';
import { PossCashMemoDataAccessCashMemoModule } from '@poss-web/poss/cash-memo/data-access-cash-memo';
import { SharedCommonDataAccessCommonModule } from '@poss-web/shared/common/data-access-common';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(AbManualRequestFeatureKey, AbManualRequestReducer),
    EffectsModule.forFeature([AbManualRequestEffects]),
    PossCashMemoDataAccessCashMemoModule,
    SharedCommonDataAccessCommonModule
  ],
  providers: [AbManualRequestFacade, AbManualRequestService]
})
export class EpossAbManualRequestsDataAccessAbManualRequestsModule {}
