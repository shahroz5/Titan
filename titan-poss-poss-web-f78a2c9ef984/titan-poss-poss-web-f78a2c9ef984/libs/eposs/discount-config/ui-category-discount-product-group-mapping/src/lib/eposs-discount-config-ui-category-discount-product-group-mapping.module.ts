import { EpossDiscountConfigUiDiscountConfigAbCoPopupModule } from '@poss-web/eposs/discount-config/ui-discount-config-ab-co-popup';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { CategoryDiscountProductGroupMappingComponent } from './category-discount-product-group-mapping/category-discount-product-group-mapping.component';
import { EpossDiscountConfigUiDiscountValuePercentagePopupModule } from '@poss-web/eposs/discount-config/ui-discount-value-percentage-popup';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiAgGridModule,
    EpossDiscountConfigUiDiscountConfigAbCoPopupModule,
    EpossDiscountConfigUiDiscountValuePercentagePopupModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiFormattersModule
  ],
  declarations: [CategoryDiscountProductGroupMappingComponent],
  exports: [CategoryDiscountProductGroupMappingComponent]
})
export class EpossDiscountConfigUiCategoryDiscountProductGroupMappingModule {}
