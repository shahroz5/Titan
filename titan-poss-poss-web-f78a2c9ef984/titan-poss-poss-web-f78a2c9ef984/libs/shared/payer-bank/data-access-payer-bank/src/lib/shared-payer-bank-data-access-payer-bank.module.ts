import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';
import {
  PAYER_BANK_FEATURE_KEY,
  PayerBankReducer
} from './+state/payer-bank.reducer';
import { EffectsModule } from '@ngrx/effects';
import { PayerBankEffects } from './+state/payer-bank.effects';
import { PayerBankFacade } from './+state/payer-bank.facade';
import { PayerBankService } from './payer-bank.service';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(PAYER_BANK_FEATURE_KEY, PayerBankReducer),
    EffectsModule.forFeature([PayerBankEffects])
  ],
  providers: [PayerBankFacade, PayerBankService]
})
export class SharedPayerBankDataAccessPayerBankModule {}
