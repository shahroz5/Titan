import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';

import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';

import { CmTepItemListGridComponent } from './cm-tep-item-list-grid/cm-tep-item-list-grid.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiAgGridModule,
    SharedUtilFieldValidatorsModule
  ],
  declarations: [CmTepItemListGridComponent],
  exports: [CmTepItemListGridComponent]
})
export class SharedTepUiCmTepItemListGridModule {}
