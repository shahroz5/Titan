import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { GVStatusUpdateEffect } from './+state/gv-status-update.effects';
import {
  gvStatusUpdateReducer,
  gvStatusUpdateKey
} from './+state/gv-status-update.reducers';
import { GVStatusUpdateFacade } from './+state/gv-status-update.facade';
import { GvStatusUpdateService } from './gv-status-update.service';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(gvStatusUpdateKey, gvStatusUpdateReducer),
    EffectsModule.forFeature([GVStatusUpdateEffect])
  ],
  providers: [GVStatusUpdateFacade, GvStatusUpdateService]
})
export class EpossGvStatusUpdateDataAccessGvStatusModule {}
