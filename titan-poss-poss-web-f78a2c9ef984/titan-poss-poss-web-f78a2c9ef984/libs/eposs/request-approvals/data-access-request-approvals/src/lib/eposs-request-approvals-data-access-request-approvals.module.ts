import { RequestApprovalsEffects } from './+state/request-approvals.effect';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { REQUEST_APPROVALS_FEATURE_KEY, RequestApprovalsReducer } from './+state/request-approval.reducer';
import { RequestApprovalsFacade } from './+state/request-approvals.facade';
import { RequestApprovalsService } from './request-approvals.service';
@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(REQUEST_APPROVALS_FEATURE_KEY, RequestApprovalsReducer),
    EffectsModule.forFeature([RequestApprovalsEffects])
  ],
  providers: [RequestApprovalsFacade, RequestApprovalsService]
})
export class EpossRequestApprovalsDataAccessRequestApprovalsModule{
}
