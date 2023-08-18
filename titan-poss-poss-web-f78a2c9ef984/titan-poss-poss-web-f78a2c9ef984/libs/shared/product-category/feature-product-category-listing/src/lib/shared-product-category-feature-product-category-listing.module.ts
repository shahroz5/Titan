import { NgModule } from '@angular/core';
import { ProductCategoryListingComponent } from './product-category-listing.component';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';
import { RouterModule, Routes } from '@angular/router';
import { SharedProductCategoryUiProductCategoryDetailModule } from '@poss-web/shared/product-category/ui-product-category-detail';
import { SharedProductCategoryDataAccessProductCategoryModule } from '@poss-web/shared/product-category/data-access-product-category';
import { SharedProductCategoryUiProductCategoryListModule } from '@poss-web/shared/product-category/ui-product-category-list';
import { SharedProductCategoryUiProductCategoryViewModule } from '@poss-web/shared/product-category/ui-product-category-view';

const routes: Routes = [
  {
    path: '',
    component: ProductCategoryListingComponent
  }
];
@NgModule({
  declarations: [ProductCategoryListingComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiCardListModule,
    SharedProductCategoryUiProductCategoryDetailModule,
    SharedProductCategoryDataAccessProductCategoryModule,
    SharedProductCategoryUiProductCategoryListModule,
    SharedProductCategoryUiProductCategoryViewModule
  ]
})
export class SharedProductCategoryFeatureProductCategoryListingModule {}
