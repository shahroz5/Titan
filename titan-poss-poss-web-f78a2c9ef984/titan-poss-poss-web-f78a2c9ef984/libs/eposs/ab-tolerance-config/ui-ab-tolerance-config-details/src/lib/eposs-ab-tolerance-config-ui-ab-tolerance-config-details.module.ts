import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbToleranceConfigUiGridComponent } from './ab-tolerance-config-ui-grid/ab-tolerance-config-ui-grid.component';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { AbToleranceConfigEditPopupComponent } from './ab-tolerance-config-edit-popup/ab-tolerance-config-edit-popup.component';
import { SharedComponentsUiSortDialogModule } from '@poss-web/shared/components/ui-sort-dialog';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedUtilFieldValidatorsModule,
    SharedComponentsUiSortDialogModule
  ],
  declarations: [
    AbToleranceConfigUiGridComponent,
    AbToleranceConfigEditPopupComponent
  ],
  exports: [
    AbToleranceConfigUiGridComponent,
    AbToleranceConfigEditPopupComponent
  ]
})
export class EpossAbToleranceConfigUiAbToleranceConfigDetailsModule {}
