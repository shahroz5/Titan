import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import {
  PRODUCT_GROUP_FEATURE_KEY,
  ProductGroupMappingReducer
} from './+state/product-group-mapping.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ProductGroupMappingEffects } from './+state/product-group-mapping.effects';
import { ProductGroupMappingFacade } from './+state/product-group-mapping.facade';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(
      PRODUCT_GROUP_FEATURE_KEY,
      ProductGroupMappingReducer
    ),
    EffectsModule.forFeature([ProductGroupMappingEffects])
  ],
  providers: [ProductGroupMappingFacade]
})
export class SharedProductGroupMappingDataAccessProductGroupMappingModule {}
