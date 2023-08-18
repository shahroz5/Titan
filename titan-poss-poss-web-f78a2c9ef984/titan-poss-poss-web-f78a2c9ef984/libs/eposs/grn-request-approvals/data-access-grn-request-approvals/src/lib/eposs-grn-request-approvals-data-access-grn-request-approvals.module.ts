import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { GrnRequestApprovalEffect } from './+state/grn-request-approvals.effect';
import { GrnRequestApprovalsService } from './grn-request-approvals.service';
import { GrnRequestApprovalFacade } from './+state/grn-request-approvals.facade';
import {
  grnRequestApprovalsReducer,
  GRN_REQUEST_APPROVAL_FEATURE_KEY
} from './+state/grn-request-approvals.reducer';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(
      GRN_REQUEST_APPROVAL_FEATURE_KEY,
      grnRequestApprovalsReducer
    ),
    EffectsModule.forFeature([GrnRequestApprovalEffect])
  ],
  providers: [GrnRequestApprovalFacade, GrnRequestApprovalsService]
})
export class EpossGrnRequestApprovalsDataAccessGrnRequestApprovalsModule {}
