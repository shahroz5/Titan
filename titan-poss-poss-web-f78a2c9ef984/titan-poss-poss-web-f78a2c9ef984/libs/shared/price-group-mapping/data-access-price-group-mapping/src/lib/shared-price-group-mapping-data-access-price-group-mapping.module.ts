import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriceGroupMappingEffect } from './+state/price-group-mapping.effect';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import {
  priceGroupMappingReducer,
  PRICE_GROUP_MAPPING_FEATURE_NAME
} from './+state/price-group-mapping.reducer';
import { PriceGroupMappingFacade } from './+state/price-group-mapping.facade';
import { PriceGroupMappingService } from './price-group-mapping.service';

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([PriceGroupMappingEffect]),
    StoreModule.forFeature(
      PRICE_GROUP_MAPPING_FEATURE_NAME,
      priceGroupMappingReducer
    )
  ],
  providers: [PriceGroupMappingFacade, PriceGroupMappingService]
})
export class SharedPriceGroupMappingDataAccessPriceGroupMappingModule {}
