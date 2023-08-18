import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CashBackOfferConfigurationFacade } from './+state/cashback-offer-configuration.facade';
import { CashbackOfferConfigurationService } from './cashback-offer-configuration.service';
import { cashBackOfferConfigurationFeatureKey, cashbackOfferConfigurationReducer } from './+state/cashback-offer-configuration.reducer';
import { CasbackOfferConfigurationEffect } from './+state/cashback-offer-configuration.effects';

@NgModule({
  imports: [CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(cashBackOfferConfigurationFeatureKey, cashbackOfferConfigurationReducer),
    EffectsModule.forFeature([CasbackOfferConfigurationEffect])
  ],
  providers: [CashBackOfferConfigurationFacade, CashbackOfferConfigurationService]

})
export class EpossCashbackOfferConfigDataAccessCashbackOfferConfigModule {}
