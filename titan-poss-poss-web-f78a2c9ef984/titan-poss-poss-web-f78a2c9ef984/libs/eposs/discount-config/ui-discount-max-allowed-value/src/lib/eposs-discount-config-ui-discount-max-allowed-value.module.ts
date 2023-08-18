import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaxAllowedValueConfigComponent } from './max-allowed-value/max-allowed-value.component';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';

import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { RivaAddMaxAllowedValueComponent } from './riva-add-max-allowed-value/riva-add-max-allowed-value.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiFormattersModule
  ],
  declarations: [
    MaxAllowedValueConfigComponent,
    RivaAddMaxAllowedValueComponent
  ],
  exports: [MaxAllowedValueConfigComponent, RivaAddMaxAllowedValueComponent]
})
export class EpossDiscountConfigUiDiscountMaxAllowedValueModule {}
