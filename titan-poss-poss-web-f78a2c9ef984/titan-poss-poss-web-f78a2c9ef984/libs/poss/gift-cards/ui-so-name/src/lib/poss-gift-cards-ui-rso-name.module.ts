import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { UiRSoNameComponent } from './ui-rso-name/ui-rso-name.component';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiSelectionDialogModule } from '@poss-web/shared/components/ui-selection-dialog';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiSelectionDialogModule
  ],
  declarations: [UiRSoNameComponent],
  exports: [UiRSoNameComponent]
})
export class PossGiftCardsUiRsoNameModule {}
