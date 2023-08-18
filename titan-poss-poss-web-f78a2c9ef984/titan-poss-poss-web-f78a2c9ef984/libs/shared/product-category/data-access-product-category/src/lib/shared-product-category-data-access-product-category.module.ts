import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ProductCategoryEffect } from './+state/product-category.effect';
import { ProductCategoryService } from './product-category.service';
import { ProductCategoryFacade } from './+state/product-category.facade';
import { ProductCategoryReducer, PRODUCT_CATEGORY_FEATURE_KEY } from './+state/product-category.reducer';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(PRODUCT_CATEGORY_FEATURE_KEY, ProductCategoryReducer),
    EffectsModule.forFeature([ProductCategoryEffect])
  ],
  providers: [ProductCategoryFacade, ProductCategoryService]
})
export class SharedProductCategoryDataAccessProductCategoryModule { }
