import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { SharedMastersDataAccessMastersModule } from '@poss-web/shared/masters/data-access-masters';
import { StoreModule } from '@ngrx/store';
import { CUSTOMER_FEATURE_KEY, CustomerReducer } from './+state/customer.reducer';
import { EffectsModule } from '@ngrx/effects';
import { CustomerEffect } from './+state/customer.effect';
import { CustomerFacade } from './+state/customer.facade';
import { CustomerDataService } from './customer.service';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    SharedMastersDataAccessMastersModule,
    StoreModule.forFeature(
      CUSTOMER_FEATURE_KEY,
      CustomerReducer
    ),
    EffectsModule.forFeature([CustomerEffect])
  ],
  providers: [CustomerFacade, CustomerDataService]
})
export class SharedCustomerDataAccessCustomerModule {}
