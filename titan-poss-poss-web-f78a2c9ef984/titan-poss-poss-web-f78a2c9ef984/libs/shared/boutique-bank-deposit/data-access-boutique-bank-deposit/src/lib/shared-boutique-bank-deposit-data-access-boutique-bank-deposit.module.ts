import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';
import {
  BoutiqueBankDepositReducer,
  BOUTIQUE_BANK_DEPOSIT_FEATURE_KEY
} from './+state/boutique-bank-deposit.reducer';
import { EffectsModule } from '@ngrx/effects';
import { BoutiqueBankDepostEffects } from './+state/boutique-bank-deposit.effects';
import { BoutiqueBankDepositFacade } from './+state/boutique-bank-deposit.facade';
import { BoutiqueBankDepositService } from './boutique-bank-deposit.service';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(
      BOUTIQUE_BANK_DEPOSIT_FEATURE_KEY,
      BoutiqueBankDepositReducer
    ),
    EffectsModule.forFeature([BoutiqueBankDepostEffects])
  ],
  providers: [BoutiqueBankDepositFacade, BoutiqueBankDepositService]
})
export class SharedBoutiqueBankDepositDataAccessBoutiqueBankDepositModule {}
