import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { RefundPaymentModeFieldsComponent } from './refund-payment-mode-fields/refund-payment-mode-fields.component';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiFileUploadModule } from '@poss-web/shared/components/ui-file-upload';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedUtilFieldValidatorsModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiFileUploadModule
  ],
  declarations: [RefundPaymentModeFieldsComponent],
  exports: [RefundPaymentModeFieldsComponent]
})
export class PossTepUiRefundPaymentModeFieldsModule {}
