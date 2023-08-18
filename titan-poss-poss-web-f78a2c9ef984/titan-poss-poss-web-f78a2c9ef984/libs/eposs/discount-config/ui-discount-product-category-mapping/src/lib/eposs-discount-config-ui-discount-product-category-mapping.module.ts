import { SharedComponentsUiFilterDialogModule } from '@poss-web/shared/components/ui-filter-dialog';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountProductCategoryMappingComponent } from './discount-product-category-mapping/discount-product-category-mapping.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule,
    SharedComponentsUiFilterDialogModule
  ],
  declarations: [DiscountProductCategoryMappingComponent],
  exports: [DiscountProductCategoryMappingComponent]
})
export class EpossDiscountConfigUiDiscountProductCategoryMappingModule {}
