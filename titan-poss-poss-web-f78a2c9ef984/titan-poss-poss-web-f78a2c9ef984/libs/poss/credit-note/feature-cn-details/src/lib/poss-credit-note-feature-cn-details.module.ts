import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CNDetailsComponent } from './cn-details/cn-details.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { PossCreditNoteUiCnDetailsViewsModule } from '@poss-web/poss/credit-note/ui-cn-details-views';
import { PossCreditNoteDataAccessCnModule } from '@poss-web/poss/credit-note/data-access-cn';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedFileUploadUiFileMultiUploadModule } from '@poss-web/shared/file-upload/ui-file-multi-upload';
import { SharedFileUploadDataAccessFileUploadModule } from '@poss-web/shared/file-upload/data-access-file-upload';
import { PossCreditNoteUiRefundPaymentModesModule } from '@poss-web/poss/credit-note/ui-refund-payment-modes';
import { PossCreditNoteUiRefundPaymentModeViewModule } from '@poss-web/poss/credit-note/ui-refund-payment-mode-view';
import { SharedPaymentDataAccessPaymentModule } from '@poss-web/shared/payment/data-access-payment';
import { SharedPaymentUiPaymentModule } from '@poss-web/shared/payment/ui-payment';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    PossCreditNoteUiCnDetailsViewsModule,
    PossCreditNoteDataAccessCnModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiFormattersModule,
    SharedFileUploadUiFileMultiUploadModule,
    SharedFileUploadDataAccessFileUploadModule,
    PossCreditNoteUiRefundPaymentModesModule,
    PossCreditNoteUiRefundPaymentModeViewModule,
    SharedPaymentDataAccessPaymentModule,
    SharedPaymentUiPaymentModule
  ],
  declarations: [CNDetailsComponent],
  exports: [CNDetailsComponent]
})
export class PossCreditNoteFeatureCnDetailsModule {}
