import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddFocPopupComponent } from './add-foc-popup/add-foc-popup.component';
import { AddFocPopupItemComponent } from './add-foc-popup-item/add-foc-popup-item.component';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  declarations: [AddFocPopupComponent, AddFocPopupItemComponent],
  exports: [AddFocPopupComponent, AddFocPopupItemComponent],
  entryComponents: [AddFocPopupComponent]
})
export class PossCashMemoUiAddFocPopupModule {}
