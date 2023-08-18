import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { RsoNamesListComponent } from './rso-names-list/rso-names-list.component';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiSelectionDialogModule } from '@poss-web/shared/components/ui-selection-dialog';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiSelectionDialogModule
  ],
  declarations: [RsoNamesListComponent],
  exports: [RsoNamesListComponent]
})
export class PossCtAdvanceUiRsoNamesListModule {}
