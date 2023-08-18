import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { BANK_DEPOSIT_FEATURE_KEY } from './+state/bank-deposit.state';
import { BankDepositReducer } from './+state/bank-deposit.reducer';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { BankDepositEffect } from './+state/bank-deposit.effect';
import { BankDepositFacade } from './+state/bank-deposit.facade';
import { BankDepositService } from './bank-deposit.service';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(BANK_DEPOSIT_FEATURE_KEY, BankDepositReducer),
    EffectsModule.forFeature([BankDepositEffect])
  ],
  providers: [BankDepositFacade, BankDepositService]
})
export class SharedBankDepositDataAccessBankDepositModule {}
