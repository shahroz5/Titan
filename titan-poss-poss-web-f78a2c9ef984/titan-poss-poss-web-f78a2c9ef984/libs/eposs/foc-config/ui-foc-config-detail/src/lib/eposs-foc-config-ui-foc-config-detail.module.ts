import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchemeConfigComponent } from './scheme-config/scheme-config.component';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';

import { EpossDiscountConfigUiDiscountApplicableModule } from '@poss-web/eposs/discount-config/ui-discount-applicable';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiToggleButtonModule,

    EpossDiscountConfigUiDiscountApplicableModule
  ],
  declarations: [SchemeConfigComponent],
  exports: [SchemeConfigComponent]
})
export class EpossFocConfigUiFocConfigDetailModule {}
