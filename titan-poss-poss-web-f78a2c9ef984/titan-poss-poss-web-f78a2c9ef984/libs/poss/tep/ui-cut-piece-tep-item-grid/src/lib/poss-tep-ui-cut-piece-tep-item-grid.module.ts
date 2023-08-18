import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
// import {
//   ConfirmDialogComponent,
//   SharedComponentsUiConfirmDialogModule
// } from '@poss-web/shared/components/ui-confirm-dialog';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';

import { CutPieceTepItemGridComponent } from './cut-piece-tep-item-grid/cut-piece-tep-item-grid.component';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule,
    // SharedComponentsUiConfirmDialogModule,
    SharedComponentsUiAgGridModule,
    SharedUtilFieldValidatorsModule
  ],
  declarations: [CutPieceTepItemGridComponent],
  exports: [CutPieceTepItemGridComponent]
})
export class PossTepUiCutPieceTepItemGridModule {}
