import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  roRequestApprovalFeatureKey,
  roRequestApprovalReducer
} from './+state/ro-request-approvals.reducer';
import { RoRequestApporvalEffect } from './+state/ro-request-approvals.effect';
import { RoRequestApprovalFacade } from './+state/ro-request-approvals.facade';
import { RoRequestApprovalService } from './ro-request-approval.service';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(
      roRequestApprovalFeatureKey,
      roRequestApprovalReducer
    ),
    EffectsModule.forFeature([RoRequestApporvalEffect])
  ],
  providers: [RoRequestApprovalFacade, RoRequestApprovalService]
})
export class SharedRoRequestApprovalsDataAccessRoRequestApprovalsModule {}
