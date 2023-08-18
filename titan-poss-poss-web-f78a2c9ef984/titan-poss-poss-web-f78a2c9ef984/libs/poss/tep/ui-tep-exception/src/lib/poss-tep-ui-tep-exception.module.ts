import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { TepExceptionPopupComponent } from './tep-exception-popup/tep-exception-popup.component';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  declarations: [TepExceptionPopupComponent],
  entryComponents: [TepExceptionPopupComponent]
})
export class PossTepUiTepExceptionModule {}
