import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountSchemeMappingComponent } from './discount-scheme-mapping/discount-scheme-mapping.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';

@NgModule({
  imports: [CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiAgGridModule,
    SharedComponentsUiToggleButtonModule
  ],
  declarations: [DiscountSchemeMappingComponent],
  exports: [DiscountSchemeMappingComponent]
})
export class EpossDiscountConfigUiDiscountSchemeMappingModule {}
