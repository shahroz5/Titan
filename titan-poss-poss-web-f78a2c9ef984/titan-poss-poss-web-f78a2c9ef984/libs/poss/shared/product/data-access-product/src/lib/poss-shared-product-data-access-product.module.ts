import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ProductEffects } from './+state/product.effects';
import { productFeatureKey, productReducer } from './+state/product.reducer';
import { ProductFacade } from './+state/product.facade';
import { ProductService } from './product.service';
import { PossSharedDiscountDataAccessDiscountModule } from '@poss-web/poss/shared/discount/data-access-discount';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(productFeatureKey, productReducer),
    EffectsModule.forFeature([ProductEffects]),
    PossSharedDiscountDataAccessDiscountModule
  ],
  providers: [ProductFacade, ProductService]
})
export class PossSharedProductDataAccessProductModule {}
