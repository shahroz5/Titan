import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddManualFocPopupComponent } from './add-manual-foc-popup/add-manual-foc-popup.component';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { AddManualFocPopupItemComponent } from './add-manual-foc-popup-item/add-manual-foc-popup-item.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  declarations: [AddManualFocPopupComponent, AddManualFocPopupItemComponent],
  exports: [AddManualFocPopupComponent, AddManualFocPopupItemComponent],
  entryComponents: [AddManualFocPopupComponent]
})
export class PossCashMemoUiAddManaulFocPopupModule {}
