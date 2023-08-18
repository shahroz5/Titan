import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { STATE_TAX_CONFIGURATION_FEATURE_KEY, StateTaxConfigurationReducer } from './+state/state-tax-configuration.reducer';
import { StateTaxConfigurationEffect } from './+state/state-tax-configuration.effect';
import { StateTaxConfigurationService } from './state-tax-configuration.service';
import { StateTaxConfigurationFacade } from './+state/state-tax-configuration.facade';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(STATE_TAX_CONFIGURATION_FEATURE_KEY, StateTaxConfigurationReducer),
    EffectsModule.forFeature([StateTaxConfigurationEffect])
  ],
  providers: [StateTaxConfigurationFacade, StateTaxConfigurationService]
})
export class EpossStateTaxConfigDataAccessStateTaxConfigModule { }
