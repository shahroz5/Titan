import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriceGroupEffect } from './+state/price-group-effect';
import {
  PRICE_GROUP_FEATURE_NAME,
  priceGroupReducer
} from './+state/price-group-reducer';
import { PriceGroupFacade } from './+state/price-group-facade';
import { PriceGroupService } from './price-group.service';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';


@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([PriceGroupEffect]),
    StoreModule.forFeature(PRICE_GROUP_FEATURE_NAME, priceGroupReducer)
  ],
  providers: [PriceGroupFacade, PriceGroupService]
})
export class SharedPriceGroupDataAccessPriceGroupModule { }
