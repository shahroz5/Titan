import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RtgsRefundViewComponent } from './rtgs-refund-view/rtgs-refund-view.component';
import { ChequeRefundViewComponent } from './cheque-refund-view/cheque-refund-view.component';
import { CcRefundViewComponent } from './cc-refund-view/cc-refund-view.component';
import { AirpayRefundViewComponent } from './airpay-refund-view/airpay-refund-view.component';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { RazorpayRefundViewComponent } from './razorpay-refund-view/razorpay-refund-view.component';

@NgModule({
  imports: [
    CommonModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiFormFieldControlsModule,
    CommonCustomMaterialModule,
    SharedUtilFieldValidatorsModule
  ],
  declarations: [RtgsRefundViewComponent, ChequeRefundViewComponent, CcRefundViewComponent, AirpayRefundViewComponent, RazorpayRefundViewComponent],
  exports: [RtgsRefundViewComponent, ChequeRefundViewComponent, CcRefundViewComponent, AirpayRefundViewComponent]
})
export class PossCreditNoteUiRefundPaymentModeViewModule {}
