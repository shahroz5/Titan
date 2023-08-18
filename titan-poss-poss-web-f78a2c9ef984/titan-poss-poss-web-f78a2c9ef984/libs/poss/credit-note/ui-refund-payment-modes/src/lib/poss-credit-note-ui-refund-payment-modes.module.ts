import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { ChequeRefundModeComponent } from './cheque-refund-mode/cheque-refund-mode.component';
import { RefundPaymentModesComponent } from './refund-payment-modes.component';
import { RtgsRefundModeComponent } from './rtgs-refund-mode/rtgs-refund-mode.component';
import { AirpayRefundModeComponent } from './airpay-refund-mode/airpay-refund-mode.component';
import { CcRefundModeComponent } from './cc-refund-mode/cc-refund-mode.component';
import { RazorpayRefundModeComponent } from './razorpay-refund-mode/razorpay-refund-mode.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedUtilFieldValidatorsModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  declarations: [
    RefundPaymentModesComponent,
    ChequeRefundModeComponent,
    RtgsRefundModeComponent,
    AirpayRefundModeComponent,
    CcRefundModeComponent,
    RazorpayRefundModeComponent
  ],
  exports: [RefundPaymentModesComponent]
})
export class PossCreditNoteUiRefundPaymentModesModule {}
