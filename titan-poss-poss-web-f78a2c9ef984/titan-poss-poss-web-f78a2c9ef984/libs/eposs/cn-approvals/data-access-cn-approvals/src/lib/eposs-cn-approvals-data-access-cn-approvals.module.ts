import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { CnApprovalEffect } from './+state/cn-approvals.effect';
import { CnApprovalsService } from './cn-approvals.service';
import { CnApprovalFacade } from './+state/cn-approvals.facade';
import { CN_APPROVAL_FEATURE_KEY,cnApprovalsReducer } from './+state/cn-approvals.reducer';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(CN_APPROVAL_FEATURE_KEY, cnApprovalsReducer),
    EffectsModule.forFeature([CnApprovalEffect])
  ],
  providers: [CnApprovalFacade, CnApprovalsService]
})
export class EpossCnApprovalsDataAccessCnApprovalsModule {}
