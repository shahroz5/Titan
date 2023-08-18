import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { FtepApprovalConfigService } from './ftep-approval-config.service';
import { FtepApprovalConfigFacade } from './+state/ftep-approval-config.facade';
import { FtepApprovalConfigEffect } from './+state/ftep-approval-config.effects';
import {
  ftepApprovalConfigKey,
  ftepApprovalConfigReducer
} from './+state/ftep-approval-config.reducer';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(ftepApprovalConfigKey, ftepApprovalConfigReducer),
    EffectsModule.forFeature([FtepApprovalConfigEffect])
  ],
  providers: [FtepApprovalConfigFacade, FtepApprovalConfigService]
})
export class EpossFtepApprovalConfigDataAccessFtepApprovalConfigModule {}
