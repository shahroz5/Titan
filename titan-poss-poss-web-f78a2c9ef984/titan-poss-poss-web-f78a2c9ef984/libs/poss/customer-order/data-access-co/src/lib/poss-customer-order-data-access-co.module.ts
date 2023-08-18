import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  customerOrderFeatureKey,
  customerOrderReducer
} from './+state/customer-order.reducer';
import { CustomerOrderEffect } from './+state/customer-order.effect';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CustomerOrderFacade } from './+state/customer-order.facade';
import { CustomerOrderService } from './customer-order.service';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(customerOrderFeatureKey, customerOrderReducer),
    EffectsModule.forFeature([CustomerOrderEffect])
  ],
  providers: [CustomerOrderFacade, CustomerOrderService]
})
export class PossCustomerOrderDataAccessCoModule {}
