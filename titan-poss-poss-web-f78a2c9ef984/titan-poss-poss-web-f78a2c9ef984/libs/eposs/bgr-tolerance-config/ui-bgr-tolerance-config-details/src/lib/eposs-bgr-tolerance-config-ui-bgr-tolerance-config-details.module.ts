import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BgrToleranceConfigUiGridComponent } from './bgr-tolerance-config-ui-grid/bgr-tolerance-config-ui-grid.component';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { BgrToleranceConfigEditPopupComponent } from './bgr-tolerance-config-edit-popup/bgr-tolerance-config-edit-popup.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedUtilFieldValidatorsModule
  ],
  declarations: [
    BgrToleranceConfigUiGridComponent,
    BgrToleranceConfigEditPopupComponent
  ],
  exports: [
    BgrToleranceConfigUiGridComponent,
    BgrToleranceConfigEditPopupComponent
  ]
})
export class EpossBgrToleranceConfigUiBgrToleranceConfigDetailsModule {}
