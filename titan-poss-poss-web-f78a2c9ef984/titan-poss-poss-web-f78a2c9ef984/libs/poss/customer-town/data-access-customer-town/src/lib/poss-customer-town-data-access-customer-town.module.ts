import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerTownEffect } from './+state/customer-town.effect';
import {
  CustomerTownReducer,
  CUSTOMER_TOWN_FEATURE_KEY
} from './+state/customer-town.reducer';
import { CustomerTownFacade } from './+state/customer-town.facade';
import { CustomerTownService } from './customer-town.service';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(CUSTOMER_TOWN_FEATURE_KEY, CustomerTownReducer),
    EffectsModule.forFeature([CustomerTownEffect])
  ],
  providers: [CustomerTownFacade, CustomerTownService]
})
export class PossCustomerTownDataAccessCustomerTownModule {}
