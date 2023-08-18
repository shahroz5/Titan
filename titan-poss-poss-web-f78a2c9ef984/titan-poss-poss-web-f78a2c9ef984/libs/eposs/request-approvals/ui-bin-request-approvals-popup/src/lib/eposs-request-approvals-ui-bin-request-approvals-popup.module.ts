import { BinRequestApprovalsPopupComponent } from './popup/bin-request-approvals-popup.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiThumbnailModule } from '@poss-web/shared/components/ui-thumbnail';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';

@NgModule({
  declarations: [BinRequestApprovalsPopupComponent],
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiThumbnailModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  exports: [BinRequestApprovalsPopupComponent],
  entryComponents: [BinRequestApprovalsPopupComponent]
})
export class EpossRequestApprovalsUiBinRequestApprovalsPopupModule {}
