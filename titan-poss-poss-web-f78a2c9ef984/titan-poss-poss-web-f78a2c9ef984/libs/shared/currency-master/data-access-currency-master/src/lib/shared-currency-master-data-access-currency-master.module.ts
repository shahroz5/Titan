import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CurrencyEffect } from './+state/currency.effect';
import { CurrencyReducer, CURRENCY_FEATURE_KEY } from './+state/currency.reducer';
import { CurrencyFacade } from './+state/currency.facade';
import { CurrencyService } from './currency-master.service';

@NgModule({
  imports: [CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(CURRENCY_FEATURE_KEY, CurrencyReducer),
    EffectsModule.forFeature([CurrencyEffect])],
  providers: [CurrencyFacade, CurrencyService]

})
export class SharedCurrencyMasterDataAccessCurrencyMasterModule {}
