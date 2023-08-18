import { BillCancelService } from './bill-cancel.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import {
  BILL_CANCEL_FEATURE_KEY,
  BillCancelReducer
} from './+state/bill-cancel.reducer';
import { BillCancelEffects } from './+state/bill-cancel.effects';
import { BillCancelFacade } from './+state/bill-cancel.facade';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(BILL_CANCEL_FEATURE_KEY, BillCancelReducer),
    EffectsModule.forFeature([BillCancelEffects])
  ],
  providers: [BillCancelFacade, BillCancelService]
})
export class PossBcDataAccessBcModule {}
