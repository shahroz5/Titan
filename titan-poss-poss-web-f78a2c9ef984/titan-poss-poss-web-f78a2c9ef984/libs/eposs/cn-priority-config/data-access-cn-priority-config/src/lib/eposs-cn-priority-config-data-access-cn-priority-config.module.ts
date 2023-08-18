import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';
import {
  CnPriorityConfigKey,
  cnPriorityConfigReducer
} from './+state/cn-priority-config.reducer';
import { EffectsModule } from '@ngrx/effects';
import { CnPriorityConfigEffect } from './+state/cn-priority-config.effects';
import { CnPriorityConfigService } from './cn-priority-config.service';
import { CnPriorityConfigFacade } from './+state/cn-priority-config.facade';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(CnPriorityConfigKey, cnPriorityConfigReducer),
    EffectsModule.forFeature([CnPriorityConfigEffect])
  ],
  providers: [CnPriorityConfigService, CnPriorityConfigFacade]
})
export class EpossCnPriorityConfigDataAccessCnPriorityConfigModule {}
