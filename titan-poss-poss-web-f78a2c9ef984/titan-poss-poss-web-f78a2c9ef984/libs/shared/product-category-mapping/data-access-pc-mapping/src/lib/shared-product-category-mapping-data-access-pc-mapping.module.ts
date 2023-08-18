import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import {
  PRODUCT_CATEGORIES_MAPPING_FEATURE_KEY,
  ProductCategoryMappingReducer
} from './+state/pc-mapping.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ProductCategoryMappingEffects } from './+state/pc-mapping.effects';
import { ProductCategoryMappingFacade } from './+state/pc-mapping.facade';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(
      PRODUCT_CATEGORIES_MAPPING_FEATURE_KEY,
      ProductCategoryMappingReducer
    ),
    EffectsModule.forFeature([ProductCategoryMappingEffects])
  ],
  providers: [ProductCategoryMappingFacade]
})
export class SharedProductCategoryMappingDataAccessPcMappingModule {}
