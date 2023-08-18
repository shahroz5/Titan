import { PaymentRoRequestManualPopupComponent } from './payment-ro-request-manual-popup/payment-ro-request-manual-popup.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { PaymentCashComponent } from './payment-cash/payment-cash.component';
import { PaymentCardComponent } from './payment-card/payment-card.component';
import { PaymentOthersComponent } from './payment-others/payment-others.component';
import { PaymentDetailsComponent } from './payment-details/payment-details.component';
import { PaymentAirpayPopupComponent } from './payment-airpay-popup/payment-airpay-popup.component';
import { PaymentChequeDDPopupComponent } from './payment-cheque-dd-popup/payment-cheque-dd-popup.component';
import { PaymentWalletPopupComponent } from './payment-wallet-popup/payment-wallet-popup.component';
import { PaymentEncirclePointsPopupComponent } from './payment-encircle-points-popup/payment-encircle-points-popup.component';
import { PaymentGiftVoucherPopupComponent } from './payment-gift-voucher-popup/payment-gift-voucher-popup.component';
import { PaymentRoRequestPopupComponent } from './payment-ro-request-popup/payment-ro-request-popup.component';
import { PaymentCreditNotePopupComponent } from './payment-credit-note-popup/payment-credit-note-popup.component';
import { PaymentRTGSPopupComponent } from './payment-rtgs-popup/payment-rtgs-popup.component';
import { PaymentForexPopupComponent } from './payment-forex-popup/payment-forex-popup.component';
import { PaymentValueAccessPopupComponent } from './payment-value-access-popup/payment-value-access-popup.component';
import { PaymentGiftCardPopupComponent } from './payment-gift-card-popup/payment-gift-card-popup.component';
import { PaymentEmployeeLoanPopupComponent } from './payment-employee-loan-popup/payment-employee-loan-popup.component';
import { PaymentSalaryAdvanceLoanPopupComponent } from './payment-salary-advance-loan-popup/payment-salary-advance-loan-popup.component';
import { PaymentBankLoanPopupComponent } from './payment-bank-loan-popup/payment-bank-loan-popup.component';
import { PaymentCashBackPopupComponent } from './payment-cash-back-popup/payment-cash-back-popup.component';
import { PaymentGhsEvoucherPopupComponent } from './payment-ghs-evoucher-popup/payment-ghs-evoucher-popup.component';
import { PaymentUnipayCardComponent } from './payment-unipay-card/payment-unipay-card.component';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { PaymentUnipayCardRetryPopupComponent } from './payment-unipay-card-retry-popup/payment-unipay-card-retry-popup.component';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { SharedUtilBarcodeReaderModule } from '@poss-web/shared/util-barcode-reader';
import { PossSharedGiftCardsUiGiftCardNumberInputModule } from '@poss-web/poss/shared/gift-cards/ui-gift-card-number-input';
import { PossSharedGiftVoucherUiGiftVoucherModule } from '@poss-web/poss/shared/gift-voucher/ui-gift-voucher';
import { PaymentAirpayIntegrationPopupComponent } from './payment-airpay-integration-popup/payment-airpay-integration-popup.component';
import { PaymentViewComponent } from './payment-view/payment-view.component';
import { PaymentEghsPopupComponent } from './payment-eghs-popup/payment-eghs-popup.component';
import { PaymentOtpPopupComponent } from './payment-otp-popup/payment-otp-popup.component';
import { CnViewComponent } from './cn-view/cn-view.component';
import { PaymentGvStausPopupComponent } from './payment-gv-staus-popup/payment-gv-staus-popup.component';
import { PaymentRazorpayPopupComponent } from './payment-razorpay-popup/payment-razorpay-popup.component';
import { PaymentDigiGoldPopupComponent } from './payment-digi-gold-popup/payment-digi-gold-popup.component';
import { PaymentUnipayLoaderComponent } from './payment-unipay-loader/payment-unipay-loader.component';
import { PaymentNonIntegratedRazorpayComponent } from './payment-non-integrated-razorpay/payment-non-integrated-razorpay.component';
import { SharedComponentsUiFileUploadModule } from '@poss-web/shared/components/ui-file-upload';
import { PaymentUPIPopupComponent } from './payment-upi-popup/payment-upi-popup.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormattersModule,
    SharedUtilFieldValidatorsModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiAgGridModule,
    SharedUtilBarcodeReaderModule,
    PossSharedGiftCardsUiGiftCardNumberInputModule,
    PossSharedGiftVoucherUiGiftVoucherModule,
    SharedComponentsUiFileUploadModule
  ],
  declarations: [
    PaymentCashComponent,
    PaymentCardComponent,
    PaymentOthersComponent,
    PaymentDetailsComponent,
    PaymentAirpayPopupComponent,
    PaymentChequeDDPopupComponent,
    PaymentWalletPopupComponent,
    PaymentEncirclePointsPopupComponent,
    PaymentGiftVoucherPopupComponent,
    PaymentRoRequestPopupComponent,
    PaymentCreditNotePopupComponent,
    PaymentRTGSPopupComponent,
    PaymentForexPopupComponent,
    PaymentValueAccessPopupComponent,
    PaymentGiftCardPopupComponent,
    PaymentEmployeeLoanPopupComponent,
    PaymentSalaryAdvanceLoanPopupComponent,
    PaymentBankLoanPopupComponent,
    PaymentCashBackPopupComponent,
    PaymentGhsEvoucherPopupComponent,
    PaymentUnipayCardComponent,
    PaymentUnipayCardRetryPopupComponent,
    PaymentAirpayIntegrationPopupComponent,
    PaymentRoRequestManualPopupComponent,
    PaymentViewComponent,
    PaymentEghsPopupComponent,
    PaymentOtpPopupComponent,
    CnViewComponent,
    PaymentGvStausPopupComponent,
    PaymentRazorpayPopupComponent,
    PaymentDigiGoldPopupComponent,
    PaymentUnipayLoaderComponent,
    PaymentNonIntegratedRazorpayComponent,
    PaymentUPIPopupComponent
  ],
  entryComponents: [
    PaymentAirpayPopupComponent,
    PaymentChequeDDPopupComponent,
    PaymentGvStausPopupComponent,
    PaymentWalletPopupComponent,
    PaymentEncirclePointsPopupComponent,
    PaymentGiftVoucherPopupComponent,
    PaymentOtpPopupComponent,
    PaymentRoRequestPopupComponent,
    PaymentCreditNotePopupComponent,
    PaymentRTGSPopupComponent,
    PaymentForexPopupComponent,
    PaymentValueAccessPopupComponent,
    PaymentGiftCardPopupComponent,
    PaymentEmployeeLoanPopupComponent,
    PaymentSalaryAdvanceLoanPopupComponent,
    PaymentBankLoanPopupComponent,
    PaymentCashBackPopupComponent,
    PaymentGhsEvoucherPopupComponent,
    PaymentUnipayCardRetryPopupComponent,
    PaymentAirpayIntegrationPopupComponent,
    PaymentRoRequestManualPopupComponent,
    PaymentEghsPopupComponent,
    PaymentRazorpayPopupComponent,
    PaymentDigiGoldPopupComponent,
    PaymentUnipayLoaderComponent,
    PaymentNonIntegratedRazorpayComponent,
    PaymentUPIPopupComponent,
  ],
  exports: [
    PaymentCashComponent,
    PaymentCardComponent,
    PaymentOthersComponent,
    PaymentUnipayCardComponent,
    PaymentDetailsComponent,
    PaymentViewComponent,
    CnViewComponent
  ]
})
export class SharedPaymentUiPaymentModule {}
