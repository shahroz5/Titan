import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';
import {
  PAYER_BANK_CONFIGURATION_FEATURE_KEY,
  PayerBankConfigurationReducer
} from './+state/payer-bank-config.reducer';
import { EffectsModule } from '@ngrx/effects';
import { PayerBankConfigEffect } from './+state/payer-bank-config.effects';
import { PayerBankConfigFacade } from './+state/payer-bank-config.facade';
import { PayerBankConfigService } from './payer-bank-config.service';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(
      PAYER_BANK_CONFIGURATION_FEATURE_KEY,
      PayerBankConfigurationReducer
    ),
    EffectsModule.forFeature([PayerBankConfigEffect])
  ],
  providers: [PayerBankConfigFacade, PayerBankConfigService]
})
export class EpossPayerBankConfigDataAccessPayerBankConfigModule {}
