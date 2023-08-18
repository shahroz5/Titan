import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { TepApprovalEffect } from './+state/tep-approval.effects';
import {
  TepApprovalReducer,
  tepApprovalKey
} from './+state/tep-approval.reducers';
import { TepApprovalFacade } from './+state/tep-approval.facade';
import { TepApprovalService } from './tep-approval.service';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(tepApprovalKey, TepApprovalReducer),
    EffectsModule.forFeature([TepApprovalEffect])
  ],
  providers: [TepApprovalFacade, TepApprovalService]
})
export class EpossTepApprovalDataAccessTepApprovalModule {}
