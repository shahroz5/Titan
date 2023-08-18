import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiThumbnailModule } from '@poss-web/shared/components/ui-thumbnail';
import { SharedComponentsUiSelectionDialogModule } from '@poss-web/shared/components/ui-selection-dialog';
import { BinRequestPopupComponent } from './bin-request-popup/bin-request-popup.component';
import { BinRequestSuccessPopupComponent } from './bin-request-success-popup/bin-request-success-popup.component';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiThumbnailModule,
    SharedComponentsUiSelectionDialogModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedUtilFieldValidatorsModule
  ],
  declarations: [BinRequestPopupComponent, BinRequestSuccessPopupComponent],
  exports: [BinRequestPopupComponent, BinRequestSuccessPopupComponent],
  entryComponents: [BinRequestPopupComponent, BinRequestSuccessPopupComponent]
})
export class EpossNewBinRequestUiBinRequestBinListModule {}
