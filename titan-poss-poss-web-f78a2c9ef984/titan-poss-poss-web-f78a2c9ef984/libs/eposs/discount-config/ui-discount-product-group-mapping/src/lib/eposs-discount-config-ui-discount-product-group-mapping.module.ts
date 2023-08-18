import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountProductGroupMappingComponent } from './discount-product-group-mapping/discount-product-group-mapping.component';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiAgGridModule
  ],
  declarations: [DiscountProductGroupMappingComponent],
  exports: [DiscountProductGroupMappingComponent]
})
export class EpossDiscountConfigUiDiscountProductGroupMappingModule {}
