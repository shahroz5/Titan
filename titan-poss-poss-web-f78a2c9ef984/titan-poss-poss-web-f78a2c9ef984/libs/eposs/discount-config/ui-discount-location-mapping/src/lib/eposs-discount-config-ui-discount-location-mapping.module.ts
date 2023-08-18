import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountLoactionMappingComponent } from './discount-location-mapping/discount-location-mapping.component';
import { DiscountDateRangeComponent } from './discount-date-range/discount-date-range.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiAgGridModule
  ],
  declarations: [DiscountLoactionMappingComponent, DiscountDateRangeComponent],
  exports: [DiscountLoactionMappingComponent],
  entryComponents: [DiscountDateRangeComponent]
})
export class EpossDiscountConfigUiDiscountLocationMappingModule {}
