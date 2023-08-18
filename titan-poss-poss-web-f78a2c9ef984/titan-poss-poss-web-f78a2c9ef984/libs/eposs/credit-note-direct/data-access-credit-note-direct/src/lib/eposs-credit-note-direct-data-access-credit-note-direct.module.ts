import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import {
  cnDirectReducer,
  CN_DIRECT_FEATURE_KEY
} from './+state/cn-direct.reducer';
import { CnDirectService } from './cn-direct.service';
import { CnDirectEffect } from './+state/cn-direct.effect';
import { CnDirectFacade } from './+state/cn-direct.facade';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(CN_DIRECT_FEATURE_KEY, cnDirectReducer),
    EffectsModule.forFeature([CnDirectEffect])
  ],
  providers: [CnDirectFacade, CnDirectService]
})
export class EpossCreditNoteDirectDataAccessCreditNoteDirectModule {}
