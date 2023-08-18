import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { GrnApprovalConfigService } from './grn-approval-config.service';
import { GrnApprovalConfigFacade } from './+state/grn-approval-config.facade';
import { GrnApprovalConfigEffect } from './+state/grn-approval-config.effects';
import {
  grnApprovalConfigKey,
  grnApprovalConfigReducer
} from './+state/grn-approval-config.reducer';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(grnApprovalConfigKey, grnApprovalConfigReducer),
    EffectsModule.forFeature([GrnApprovalConfigEffect])
  ],
  providers: [GrnApprovalConfigFacade, GrnApprovalConfigService]
})
export class EpossGrnApprovalConfigDataAccessGrnApprovalConfigModule {}
