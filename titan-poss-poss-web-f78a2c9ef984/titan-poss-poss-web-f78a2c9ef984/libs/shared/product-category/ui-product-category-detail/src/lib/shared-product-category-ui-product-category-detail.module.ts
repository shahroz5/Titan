import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { ProductCategoryDetailsComponent } from './product-category-details.component';

@NgModule({
  imports: [
    CommonModule,
    SharedComponentsUiDynamicFormModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule
  ],
  declarations: [ProductCategoryDetailsComponent],
  exports: [ProductCategoryDetailsComponent],
  entryComponents: [ProductCategoryDetailsComponent]
})
export class SharedProductCategoryUiProductCategoryDetailModule { }
