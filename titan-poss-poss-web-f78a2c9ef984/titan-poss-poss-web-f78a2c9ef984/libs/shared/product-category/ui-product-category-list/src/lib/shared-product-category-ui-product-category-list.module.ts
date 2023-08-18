import { NgModule } from '@angular/core';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { ProductCategoryItemsComponent } from './product-category-items/product-category-items.component';
import { ProductCategoryListingItemComponent } from './product-category-listing-item/product-category-listing-item.component';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { ProductCategorySearchComponent } from './product-category-search/product-category-search.component';

@NgModule({
  declarations: [
    ProductCategoryItemsComponent,
    ProductCategoryListingItemComponent,
    ProductCategorySearchComponent
  ],
  imports: [
    CommonCustomMaterialModule,
    SharedComponentsUiDynamicFormModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiToggleButtonModule
  ],
  exports: [
    ProductCategoryItemsComponent,
    ProductCategoryListingItemComponent,
    ProductCategorySearchComponent
  ]
})
export class SharedProductCategoryUiProductCategoryListModule {}
