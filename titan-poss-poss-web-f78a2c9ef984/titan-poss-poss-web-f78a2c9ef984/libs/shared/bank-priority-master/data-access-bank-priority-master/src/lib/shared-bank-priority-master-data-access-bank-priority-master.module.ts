import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { BankPriorityEffect } from './+state/bankPriority.effect';
import {
  bankPriorityReducer,
  BANK_PRIORITY_FEATURE_KEY
} from './+state/bankPriority.reducer';
import { BankPriorityFacade } from './+state/bankPriority.facade';
import { BankPriorityService } from './bankPriority.service';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(BANK_PRIORITY_FEATURE_KEY, bankPriorityReducer),
    EffectsModule.forFeature([BankPriorityEffect])
  ],
  providers: [BankPriorityFacade, BankPriorityService]
})
export class SharedBankPriorityMasterDataAccessBankPriorityMasterModule {}
