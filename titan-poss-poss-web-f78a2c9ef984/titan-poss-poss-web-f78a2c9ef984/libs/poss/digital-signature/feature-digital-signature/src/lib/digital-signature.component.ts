import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  TemplateRef
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { SignaturePadComponent } from '@poss-web/shared/components/ui-signature-pad';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { MatDialog } from '@angular/material/dialog';
import { TermsCondtionComponent } from './terms-condtion/terms-condtion.component';
import { Router } from '@angular/router';
import { getPossHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import { ErrorEnums } from '@poss-web/shared/util-error';
import {
  CustomerDigitalSignatureResponse,
  CustomErrors,
  PossHomeKeyEnum,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  OverlayNotificationEventRef,
  CustomerDigitalSignatureRequestPayload,
  OverlayNotificationEventType,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  StoreDetailsResponse,
  SummaryBarServiceAbstraction,
  InvoiceDeliveryTypes,
  printDocTypeEnum,
  printFileTypeEnum,
  printTransactionTypesEnum,
  printTypesEnum,
  PrintingServiceAbstraction
} from '@poss-web/shared/models';
import { DigitalSignatureFacade } from '@poss-web/poss/digital-signature/data-access-digital-signature';
import { filter, take, takeUntil } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { FilePreviewComponent } from '@poss-web/shared/components/ui-file-upload';
import { GepDeclarationFormTemplateComponent } from './gep-declaration-form-template/gep-declaration-form-template.component';
import { TepDeclarationFormTemplateComponent } from './tep-declaration-form-template/tep-declaration-form-template.component';
import { SharedBodEodFacade } from '@poss-web/shared/bod-eod/data-access-bod-eod';
import { MatSelectChange } from '@angular/material/select';
import { PrintingService } from '@poss-web/shared/printing/feature-printing';
@Component({
  selector: 'poss-web-digital-signature',
  templateUrl: './digital-signature.component.html',
  styleUrls: ['./digital-signature.component.scss']
})
export class DigitalSignatureComponent implements OnInit, OnDestroy {
  destroy$: Subject<null> = new Subject<null>();
  isLoading$: Observable<boolean>;

  form: FormGroup;
  sign;
  isOTPSent = false;
  isOTPVerified = false;
  transactionTypes = [
    'Advance Booking',
    'TEP',
    'GEP',
    'GHS',
    'Cash Memo',
    'Accept Advance',
    'GRN',
    'GRF',
    'Gift Card',
    'CN Cancellation',
    'Customer Order'
  ];

  customerDetailsForDigitalSignature: CustomerDigitalSignatureResponse = null;
  customerName: string;
  customerMobileNumber: string;
  customerEmailId: string;
  customerAddressLine1: string;
  customerAddressLine2: string;
  customerUlpNumber: string;
  customerDigitalSignature: string;
  customerId: string;

  showTermAndConditionError = false;
  showOtpVerificationError = false;
  showSignatureError = false;
  disableSignaturePad = true;
  customerSignature = '';
  selectedTransactionTypes = {
    isAdvanceOrderOrBooking: false,
    isCashMemo: false,
    isGHS: false,
    isAcceptAdvance: false,
    isGRN: false,
    isGRF: false,
    isGiftCard: false,
    isCNCancellation: false,
    isTEPDeclarationAndExchangeForm: false,
    isGEPDeclarationAndExchangeForm: false,
    isCCAFRequestServicePaymentOrCustomerOrder: false
  };
  ghsTermsAndConditionsContent = null;
  advanceBookingTermsAndConditionsContent = null;
  cashMemoTermsAndConditionsContent = null;
  acceptAdvanceTermsAndConditionsContent = null;
  grfTermsAndConditionsContent = null;
  grnTermsAndConditionsContent = null;
  giftCardTermsAndConditionsContent = null;
  cnCancellationTermsAndConditionsContent = null;
  customerOrderTermsAndConditionsContent = null;
  tepDeclarationFormContent = null;
  gepDeclarationFormContent = null;
  businessDay = null;
  isUpdateSignatureSuccess = false;
  customerList = [];
  storeDetails: any;

  @ViewChild(SignaturePadComponent) signaturePad: SignaturePadComponent;

  @ViewChild('confirmSuccessNotificationTemplate', { static: true })
  confirmSuccessNotificationTemplate: TemplateRef<any>;

  otpFormControl = new FormControl();
  summaryBarRemarks$ = new Subject<string>();
  gepTxnId: string;
  tepTxnId: string;
  isGEPForm: boolean = false;
  isTEPForm: boolean = false;

  constructor(
    fb: FormBuilder,
    public router: Router,
    private fieldValidatorsService: FieldValidatorsService,
    private dialog: MatDialog,
    private digitalSignatureFacade: DigitalSignatureFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private httpClient: HttpClient,
    private bodEodFacade: SharedBodEodFacade,
    private alertPopupService: AlertPopupServiceAbstraction,
    private summaryBar: SummaryBarServiceAbstraction,
    private printingService: PrintingService
  ) {
    this.form = fb.group({
      mobile: [null, this.fieldValidatorsService.mobileField('Mobile No.')],
      ulp: [null, this.fieldValidatorsService.ulpIdField('ULP ID')],
      signatureField: ['', Validators.required],
      acceptTermsConditions: [true],
      email: ['', this.fieldValidatorsService.emailField('Email')],
      selectCustomer: [null]
    });
    this.form.setValidators(this.requiredValidator);
  }

  ngOnInit(): void {
    this.getAdvanceBookingTermsAndConditionsContent();
    this.getCashMemoTermsAndConditionsContent();
    this.getAcceptAdvanceTermsAndConditionsContent();
    this.getGrfTermsAndConditionsContent();
    this.getGrnTermsAndConditionsContent();
    this.getGiftCardTermsAndConditionsContent();
    this.getCnCancellationTermsAndConditionsContent();
    this.getCustomerOrderTermsAndConditionsContent();
    this.getTepDeclarationFormContent();
    this.getGepDeclarationFormContent();
    this.summaryBar.close();

    this.isLoading$ = this.digitalSignatureFacade.getIsLoading();
    this.digitalSignatureFacade.loadStoreDetailsForDigitalSignature();
    this.digitalSignatureFacade
      .getStoreDetailsForDigitalSignatureResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: StoreDetailsResponse) => {
        if (response) {
          this.storeDetails = response.storeDetails.data;
        }
      });
    this.digitalSignatureFacade
      .getCustomerDetailsResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: CustomerDigitalSignatureResponse[]) => {
        if (response) {
          if (response.length) {
            this.customerList = response.map(
              (customerObject: CustomerDigitalSignatureResponse) => {
                return {
                  value: customerObject,
                  description: `${customerObject.customerName} - ${customerObject.customerType}`
                };
              }
            );
            if (response && response.length >= 0) {
              this.form.get('selectCustomer').setValue(response[0]);
              this.updateCustomerDetails(response[0]);
            }
          } else {
            this.customerList = [];
            this.showAlertNotification('Customer record is not found.');
          }
        }
      });
    this.digitalSignatureFacade
      .getCustomerDetailsForDigitalSignatureResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: CustomerDigitalSignatureResponse[]) => {
        if (response) {
          if (response.length) {
            if (response && response.length === 1) {
              this.customerDetailsForDigitalSignature = response[0];
              const jsonResponse = JSON.parse(
                response[0].applicableTransactionTypes
              );
              this.updateTransactionTypes(jsonResponse);
            }
          } else {
            this.updateTransactionTypes();
          }
        }
      });
    this.digitalSignatureFacade
      .sendCustomerDetailsForDigitalSignatureResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (customerDetailsResponse: CustomerDigitalSignatureResponse) => {
          if (customerDetailsResponse) {
            if (this.customerSignature && this.customerMobileNumber) {
              this.digitalSignatureFacade.uploadDigitalSignature(
                this.customerMobileNumber,
                this.customerDetailsForDigitalSignature.customerType,
                this.customerSignature
              );
            }
            // else {
            //   this.form.reset();
            //   this.clearDigitalSignatureScreen();
            //   this.showAlertNotification('Changes are updated successfully.');
            // }
          }
        }
      );
    this.digitalSignatureFacade
      .uploadDigitalSignatureResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(uploadResponse => {
        if (uploadResponse) {
          const applicableTransactionTypes = JSON.parse(
            uploadResponse.applicableTransactionTypes
          );
          const customerDocumentTxnId = JSON.parse(
            uploadResponse.customerDocumentTxnId
          );
          this.isGEPForm =
            applicableTransactionTypes.data.isGEPDeclarationAndExchangeForm;
          this.isTEPForm =
            applicableTransactionTypes.data.isTEPDeclarationAndExchangeForm;
          this.gepTxnId = customerDocumentTxnId.data.gepDeclarationTxnId;
          this.tepTxnId = customerDocumentTxnId.data.tepDeclarationTxnId;
          this.showConfirmIssueSuccessNotification(
            'Customer Digital Signature is successfully updated.'
          );
          this.isUpdateSignatureSuccess = true;
        }
      });
    this.digitalSignatureFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error && error.code) {
          if (error.code === ErrorEnums.ERR_SALE_129) {
            this.otpFormControl.reset();
            this.form.get('email').reset();
            this.clearDigitalSignatureScreen();
          }
          this.errorHandler(error);
        }
      });
    this.bodEodFacade
      .getLatestBusinessDate()
      .pipe(
        filter(date => date !== -1),
        takeUntil(this.destroy$)
      )
      .subscribe((date: number) => {
        if (date) {
          this.businessDay = date;
        }
      });

    this.getIsOtpGenerated();
    this.getIsOtpValidated();
  }

  onCustomerSelectionChange(event: MatSelectChange) {
    if (event && event.value) {
      this.updateCustomerDetails(event.value);
    }
  }

  updateTransactionTypes(jsonResponse?: any) {
    this.customerDigitalSignature =
      this.customerDetailsForDigitalSignature.digitalSignature &&
      this.customerDetailsForDigitalSignature.digitalSignature !== 'null'
        ? this.customerDetailsForDigitalSignature.digitalSignature.startsWith(
            '"'
          )
          ? JSON.parse(this.customerDetailsForDigitalSignature.digitalSignature)
          : this.customerDetailsForDigitalSignature.digitalSignature
        : null;

    this.otpFormControl.setValue('');
    this.otpFormControl.updateValueAndValidity();
    this.signaturePad.clear();
    this.disableSignaturePad = true;
    this.isOTPSent = false;
    this.isOTPVerified = false;
    this.disableSignaturePad = true;
    if (jsonResponse) {
      this.selectedTransactionTypes = jsonResponse.data;
    } else {
      this.selectedTransactionTypes = {
        isAdvanceOrderOrBooking: false,
        isCashMemo: false,
        isGHS: false,
        isAcceptAdvance: false,
        isGRN: false,
        isGRF: false,
        isGiftCard: false,
        isCNCancellation: false,
        isTEPDeclarationAndExchangeForm: false,
        isGEPDeclarationAndExchangeForm: false,
        isCCAFRequestServicePaymentOrCustomerOrder: false
      };
    }
  }

  updateCustomerDetails(customerDetails: CustomerDigitalSignatureResponse) {
    this.customerDetailsForDigitalSignature = customerDetails;
    this.customerName = this.customerDetailsForDigitalSignature.customerName;
    this.customerMobileNumber = this.customerDetailsForDigitalSignature.mobileNumber;
    this.customerEmailId = this.customerDetailsForDigitalSignature.customerEmail;
    this.form.get('email').setValue(this.customerEmailId);
    if (this.customerDetailsForDigitalSignature.customerAddress) {
      const customerAddress = JSON.parse(
        this.customerDetailsForDigitalSignature.customerAddress
      );
      this.customerAddressLine1 = `${customerAddress.data.addressLines.join(
        ', '
      )},`;
      this.customerAddressLine2 = `${customerAddress.data.city}, ${customerAddress.data.state}, ${customerAddress.data.country}-${customerAddress.data.pincode}`;
    }
    // JSON.parse(
    //     this.customerDetailsForDigitalSignature.digitalSignature
    //   ).digitalSignature
    // : '';
    this.customerUlpNumber = this.customerDetailsForDigitalSignature.ulpNumber;
    this.customerId = this.customerDetailsForDigitalSignature.customerId;
    this.digitalSignatureFacade.loadCustomerDetailsForDigitalSignature(
      this.customerDetailsForDigitalSignature.customerType,
      this.customerDetailsForDigitalSignature.mobileNumber,
      this.customerDetailsForDigitalSignature.ulpNumber
    );
  }

  getTepDeclarationFormContent() {
    this.httpClient
      .get('./assets/declaration-forms/tep-declaration-form.json')
      .subscribe(data => {
        if (data) {
          this.tepDeclarationFormContent = data;
        }
      });
  }

  getGepDeclarationFormContent() {
    this.httpClient
      .get('./assets/declaration-forms/gep-declaration-form.json')
      .subscribe(data => {
        if (data) {
          this.gepDeclarationFormContent = data;
        }
      });
  }
  getGhsTermsAndConditionsContent() {
    this.httpClient
      .get('./assets/terms-and-conditions/ghs-terms-and-conditions.txt', {
        responseType: 'text'
      })
      .subscribe(data => {
        if (data) {
          this.ghsTermsAndConditionsContent = data;
        }
      });
  }
  getAdvanceBookingTermsAndConditionsContent() {
    this.httpClient
      .get(
        './assets/terms-and-conditions/advance-booking-terms-and-conditions.json'
      )
      .subscribe(data => {
        if (data) {
          this.advanceBookingTermsAndConditionsContent = data;
        }
      });
  }

  getCashMemoTermsAndConditionsContent() {
    this.httpClient
      .get('./assets/terms-and-conditions/cash-memo-terms-and-conditions.json')
      .subscribe(data => {
        if (data) {
          this.cashMemoTermsAndConditionsContent = data;
        }
      });
  }

  getAcceptAdvanceTermsAndConditionsContent() {
    this.httpClient
      .get(
        './assets/terms-and-conditions/accept-advance-terms-and-conditions.json'
      )
      .subscribe(data => {
        if (data) {
          this.acceptAdvanceTermsAndConditionsContent = data;
        }
      });
  }

  getGrfTermsAndConditionsContent() {
    this.httpClient
      .get('./assets/terms-and-conditions/grf-terms-and-conditions.json')
      .subscribe(data => {
        if (data) {
          this.grfTermsAndConditionsContent = data;
        }
      });
  }

  getGrnTermsAndConditionsContent() {
    this.httpClient
      .get('./assets/terms-and-conditions/grn-terms-and-conditions.json')
      .subscribe(data => {
        if (data) {
          this.grnTermsAndConditionsContent = data;
        }
      });
  }

  getGiftCardTermsAndConditionsContent() {
    this.httpClient
      .get('./assets/terms-and-conditions/gift-card-terms-and-conditions.json')
      .subscribe(data => {
        if (data) {
          this.giftCardTermsAndConditionsContent = data;
        }
      });
  }

  getCnCancellationTermsAndConditionsContent() {
    this.httpClient
      .get(
        './assets/terms-and-conditions/cn-cancellation-terms-and-conditions.json'
      )
      .subscribe(data => {
        if (data) {
          this.cnCancellationTermsAndConditionsContent = data;
        }
      });
  }

  getCustomerOrderTermsAndConditionsContent() {
    this.httpClient
      .get(
        './assets/terms-and-conditions/customer-order-terms-and-conditions.json'
      )
      .subscribe(data => {
        if (data) {
          this.customerOrderTermsAndConditionsContent = data;
        }
      });
  }

  showAlertNotification(message: string): void {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.SIMPLE,
        hasClose: true,
        hasBackdrop: true,
        message
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        if (event.eventType === OverlayNotificationEventType.CLOSE) {
          if (this.isUpdateSignatureSuccess) {
            this.form.reset();
            this.clearDigitalSignatureScreen();
            this.isUpdateSignatureSuccess = false;
          }
        }
      });
  }

  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true, // optional
        error: error,
        hasBackdrop: true
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  getCustomerDetailsForDigitalSignature(searchType: string) {
    switch (searchType) {
      case 'MOBILE': {
        if (this.form.get('mobile').valid) {
          if (
            (!this.form.get('ulp').valid || !this.form.get('ulp').value) &&
            !this.form.get('mobile').value
          ) {
            this.clearData();
          }
          if (this.form.get('mobile').value) {
            this.clearData();
            this.digitalSignatureFacade.loadCustomerDetails(
              this.form.get('mobile').value,
              this.form.get('ulp').value
            );
          }
        }
        break;
      }
      case 'ULP': {
        if (this.form.get('ulp').valid) {
          if (
            (!this.form.get('mobile').valid ||
              !this.form.get('mobile').value) &&
            !this.form.get('ulp').value
          ) {
            this.clearData();
          }
          if (this.form.get('ulp').value) {
            this.clearData();
            this.digitalSignatureFacade.loadCustomerDetails(
              this.form.get('mobile').value,
              this.form.get('ulp').value
            );
          }
        }
        break;
      }
    }
  }

  clearData() {
    this.otpFormControl.reset();
    this.form.get('email').reset();
    this.clearDigitalSignatureScreen();
  }

  requiredValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    if (
      (control.get('mobile').value == undefined ||
        control.get('mobile').value == null ||
        control.get('mobile').value == '') &&
      (control.get('ulp').value == undefined ||
        control.get('ulp').value == null ||
        control.get('ulp').value == '')
    ) {
      return { required: true };
    }
    return null;
  }

  submit() {
    this.showTermAndConditionError = false;
    this.showOtpVerificationError = false;
    this.showSignatureError = false;

    this.sign = this.signaturePad.signature;
    this.customerSignature = this.signaturePad.signature;

    if (
      (!this.form.get('mobile').value && !this.form.get('ulp').value) ||
      this.form.get('mobile').invalid ||
      this.form.get('ulp').invalid
    ) {
      this.showAlertPopUp('Please enter Mobile No. or ULP ID. properly.');
    } else if (!this.isOTPVerified) {
      this.showOtpVerificationError = true;
      this.showAlertPopUp('Please verify OTP.');
    } else if (!this.form.get('acceptTermsConditions').value) {
      this.showTermAndConditionError = true;
      this.showAlertPopUp('Please accept terms and conditions.');
    }
    // else if (!this.customerDigitalSignature && !this.customerSignature) {
    else if (!this.customerSignature) {
      this.showSignatureError = true;
      this.showAlertPopUp('Please insert signature.');
    } else {
      const customerDigitalSignatureRequestPayload: CustomerDigitalSignatureRequestPayload = {
        applicableTransactionTypes: {
          type: 'APPLICABLE_TRANSACTION_TYPES',
          data: this.selectedTransactionTypes
        },
        emailId: this.form.get('email').value,
        mobileNumber: this.customerMobileNumber,
        ulpNumber: this.customerUlpNumber,
        customerType: this.customerDetailsForDigitalSignature.customerType,
        customerId: this.customerDetailsForDigitalSignature.customerId
      };
      this.digitalSignatureFacade.sendCustomerDetailsForDigitalSignature(
        customerDigitalSignatureRequestPayload
      );
    }

    // if (
    //   (!this.form.get('mobile').value && !this.form.get('ulp').value) ||
    //   this.form.get('mobile').invalid ||
    //   this.form.get('ulp').invalid
    // ) {
    //   this.showAlertPopUp('Please enter Mobile No. or ULP ID. properly.');
    // } else if (!this.form.hasError('required')) {
    //   if (this.isOTPVerified) {
    //     if (this.form.get('signatureField').valid) {
    //       if (!!this.form.get('acceptTermsConditions').value) {
    //         const customerDigitalSignatureRequestPayload: CustomerDigitalSignatureRequestPayload = {
    //           applicableTransactionTypes: {
    //             type: 'APPLICABLE_TRANSACTION_TYPES',
    //             data: this.selectedTransactionTypes
    //           },
    //           emailId: this.form.get('email').value,
    //           mobileNumber: this.customerMobileNumber,
    //           ulpNumber: this.customerUlpNumber
    //         };
    //         this.digitalSignatureFacade.sendCustomerDetailsForDigitalSignature(
    //           customerDigitalSignatureRequestPayload
    //         );
    //       } else {
    //         this.showTermAndConditionError = true;
    //         this.showAlertPopUp('Please accept terms and conditions.');
    //       }
    //     } else {
    //       if (!this.customerDigitalSignature && !this.customerSignature) {
    //         this.showSignatureError = true;
    //         this.showAlertPopUp('Please insert signature.');
    //       }
    //     }
    //   } else {
    //     this.showOtpVerificationError = true;
    //     this.showAlertPopUp('Please verify OTP.');
    //   }
    // } else {
    //   this.form.markAllAsTouched();
    // }

    // if (!this.form.hasError('required')) {
    //   // if (this.form.get('signatureField').valid) {
    //     if (!!this.form.get('acceptTermsConditions').value) {
    //       if (this.isOTPVerified) {
    //         console.log('Confirm Action');
    //       } else {
    //         this.showOtpVerificationError = true;
    //       }
    //     } else {
    //       this.showTermAndConditionError = true;
    //     }
    //   //}
    //   else {
    //     this.showSignatureError = true;
    //   }
    // } else {
    //   this.form.markAllAsTouched();
    // }
  }

  showConfirmIssueSuccessNotification(message: string): void {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.CUSTOM,
        message: message,
        hasBackdrop: true,
        hasClose: true,
        template: this.confirmSuccessNotificationTemplate
      })
      .events.pipe(take(1))
      .subscribe((event: OverlayNotificationEventRef) => {
        if (event.eventType === OverlayNotificationEventType.CLOSE) {
          if (this.isUpdateSignatureSuccess) {
            this.form.reset();
            this.clearDigitalSignatureScreen();
            this.isUpdateSignatureSuccess = false;
            this.overlayNotification.close();
            this.summaryBar.close();
          }
        }
      });
  }

  print(printType: string) {
    this.printingService.loadPrintData({
      printType: printType,
      doctype: printDocTypeEnum.CUSTOMER_PRINT,
      transacionType: printTransactionTypesEnum.SALES,
      printFileType: printFileTypeEnum.INVOICE_PRINT,
      customerId: this.customerId,
      transacionId:
        printType === printTypesEnum.GEP_DIGITAL_SIGNATURE
          ? this.gepTxnId
          : this.tepTxnId,
      reprint: true,
      invoiceType: InvoiceDeliveryTypes.PRINT
    });
  }

  openTermsAndConditions(type: string) {
    let content = null;
    switch (type) {
      case 'TEP': {
        this.openTepDeclarationForm();
        break;
      }
      case 'GEP': {
        this.openGepDeclarationForm();
        break;
      }
      case 'GHS': {
        content = this.ghsTermsAndConditionsContent;
        break;
      }
      case 'Advance Booking': {
        content = this.advanceBookingTermsAndConditionsContent;
        break;
      }
      case 'Cash Memo': {
        content = this.cashMemoTermsAndConditionsContent;
        break;
      }
      case 'Accept Advance': {
        content = this.acceptAdvanceTermsAndConditionsContent;
        break;
      }
      case 'GRF': {
        content = this.grfTermsAndConditionsContent;
        break;
      }
      case 'GRN': {
        content = this.grnTermsAndConditionsContent;
        break;
      }
      case 'Gift Card': {
        content = this.giftCardTermsAndConditionsContent;
        break;
      }
      case 'CN Cancellation': {
        content = this.cnCancellationTermsAndConditionsContent;
        break;
      }
      case 'Customer Order': {
        content = this.customerOrderTermsAndConditionsContent;
        break;
      }
    }
    if (type !== 'TEP' && type !== 'GEP') {
      this.dialog.open(TermsCondtionComponent, {
        width: '90%',
        data: { content: content }
      });
    }
  }

  openGepDeclarationForm() {
    this.dialog.open(GepDeclarationFormTemplateComponent, {
      width: '90%',
      data: {
        mobileNumber: this.customerMobileNumber,
        customerName: this.customerName,
        customerSignature: this.customerDigitalSignature,
        customerAddress1: this.customerAddressLine1,
        customerAddress2: this.customerAddressLine2,
        businessDay: this.businessDay,
        content: this.gepDeclarationFormContent,
        storeDetails: this.storeDetails,
        customerDetailsForDigitalSignature: this
          .customerDetailsForDigitalSignature,
        customerId: this.customerId,
        applicableTransactionTypes: this.customerDetailsForDigitalSignature
          .applicableTransactionTypes
      }
    });
  }

  openTepDeclarationForm() {
    this.dialog.open(TepDeclarationFormTemplateComponent, {
      width: '90%',
      data: {
        mobileNumber: this.customerMobileNumber,
        customerName: this.customerName,
        customerSignature: this.customerDigitalSignature,
        customerAddress1: this.customerAddressLine1,
        customerAddress2: this.customerAddressLine2,
        businessDay: this.businessDay,
        content: this.tepDeclarationFormContent,
        storeDetails: this.storeDetails,
        customerDetailsForDigitalSignature: this
          .customerDetailsForDigitalSignature,
        customerId: this.customerId,
        applicableTransactionTypes: this.customerDetailsForDigitalSignature
          .applicableTransactionTypes
      }
    });
  }

  isTransactionChecked(type: string): boolean {
    let isChecked = false;
    switch (type) {
      case 'TEP': {
        if (this.selectedTransactionTypes.isTEPDeclarationAndExchangeForm) {
          isChecked = true;
        } else {
          isChecked = false;
        }
        break;
      }
      case 'GEP': {
        if (this.selectedTransactionTypes.isGEPDeclarationAndExchangeForm) {
          isChecked = true;
        } else {
          isChecked = false;
        }
        break;
      }
      case 'GHS': {
        if (this.selectedTransactionTypes.isGHS) {
          isChecked = true;
        } else {
          isChecked = false;
        }
        break;
      }
      case 'Advance Booking': {
        if (this.selectedTransactionTypes.isAdvanceOrderOrBooking) {
          isChecked = true;
        } else {
          isChecked = false;
        }
        break;
      }
      case 'Cash Memo': {
        if (this.selectedTransactionTypes.isCashMemo) {
          isChecked = true;
        } else {
          isChecked = false;
        }
        break;
      }
      case 'Accept Advance': {
        if (this.selectedTransactionTypes.isAcceptAdvance) {
          isChecked = true;
        } else {
          isChecked = false;
        }
        break;
      }
      case 'GRN': {
        if (this.selectedTransactionTypes.isGRN) {
          isChecked = true;
        } else {
          isChecked = false;
        }
        break;
      }
      case 'GRF': {
        if (this.selectedTransactionTypes.isGRF) {
          isChecked = true;
        } else {
          isChecked = false;
        }
        break;
      }
      case 'Gift Card': {
        if (this.selectedTransactionTypes.isGiftCard) {
          isChecked = true;
        } else {
          isChecked = false;
        }
        break;
      }
      case 'CN Cancellation': {
        if (this.selectedTransactionTypes.isCNCancellation) {
          isChecked = true;
        } else {
          isChecked = false;
        }
        break;
      }
      case 'Customer Order': {
        if (
          this.selectedTransactionTypes
            .isCCAFRequestServicePaymentOrCustomerOrder
        ) {
          isChecked = true;
        } else {
          isChecked = false;
        }
        break;
      }
    }
    return isChecked;
  }

  onTransactionTypeChanged(event, type) {
    switch (type) {
      case 'TEP': {
        if (event.checked) {
          this.selectedTransactionTypes.isTEPDeclarationAndExchangeForm = true;
        } else {
          this.selectedTransactionTypes.isTEPDeclarationAndExchangeForm = false;
        }
        break;
      }
      case 'GEP': {
        if (event.checked) {
          this.selectedTransactionTypes.isGEPDeclarationAndExchangeForm = true;
        } else {
          this.selectedTransactionTypes.isGEPDeclarationAndExchangeForm = false;
        }
        break;
      }
      case 'GHS': {
        if (event.checked) {
          this.selectedTransactionTypes.isGHS = true;
        } else {
          this.selectedTransactionTypes.isGHS = false;
        }
        break;
      }
      case 'Advance Booking': {
        if (event.checked) {
          this.selectedTransactionTypes.isAdvanceOrderOrBooking = true;
        } else {
          this.selectedTransactionTypes.isAdvanceOrderOrBooking = false;
        }
        break;
      }
      case 'Cash Memo': {
        if (event.checked) {
          this.selectedTransactionTypes.isCashMemo = true;
        } else {
          this.selectedTransactionTypes.isCashMemo = false;
        }
        break;
      }
      case 'Accept Advance': {
        if (event.checked) {
          this.selectedTransactionTypes.isAcceptAdvance = true;
        } else {
          this.selectedTransactionTypes.isAcceptAdvance = false;
        }
        break;
      }
      case 'GRN': {
        if (event.checked) {
          this.selectedTransactionTypes.isGRN = true;
        } else {
          this.selectedTransactionTypes.isGRN = false;
        }
        break;
      }
      case 'GRF': {
        if (event.checked) {
          this.selectedTransactionTypes.isGRF = true;
        } else {
          this.selectedTransactionTypes.isGRF = false;
        }
        break;
      }
      case 'Gift Card': {
        if (event.checked) {
          this.selectedTransactionTypes.isGiftCard = true;
        } else {
          this.selectedTransactionTypes.isGiftCard = false;
        }
        break;
      }
      case 'CN Cancellation': {
        if (event.checked) {
          this.selectedTransactionTypes.isCNCancellation = true;
        } else {
          this.selectedTransactionTypes.isCNCancellation = false;
        }
        break;
      }
      case 'Customer Order': {
        if (event.checked) {
          this.selectedTransactionTypes.isCCAFRequestServicePaymentOrCustomerOrder = true;
        } else {
          this.selectedTransactionTypes.isCCAFRequestServicePaymentOrCustomerOrder = false;
        }
        break;
      }
    }

    if (event.checked && this.customerMobileNumber && this.customerName) {
      switch (type) {
        case 'TEP':
          this.openTepDeclarationForm();
          break;
        case 'GEP':
          this.openGepDeclarationForm();
          break;
      }
    }
  }

  clear() {
    this.signaturePad.clear();
    this.sign = null;
  }

  undo() {
    this.signaturePad.undo();
    this.sign = null;
  }

  sendOtp() {
    // this.isOTPSent = true;
    if (this.customerId) {
      this.digitalSignatureFacade.resetValidateOtpField();
      this.digitalSignatureFacade.generateOtpForCustomerSignature(
        this.customerId
      );
    } else {
      this.showAlertPopUp('Please provide Mobile number or ULP Number.');
    }
  }

  resendOtp() {
    // this.isOTPSent = false;
    this.otpFormControl.setValue('');
    this.otpFormControl.updateValueAndValidity();
    this.digitalSignatureFacade.generateOtpForCustomerSignature(
      this.customerId
    );
  }

  verifyOTP() {
    // this.isOTPVerified = true;

    // this.disableSignaturePad = false;

    this.digitalSignatureFacade.validateOtpForCustomerSignature(
      this.customerId,
      this.otpFormControl.value
    );
  }

  getIsOtpGenerated() {
    this.digitalSignatureFacade
      .getIsOtpGenerated()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isOtpGenerated: boolean) => {
        switch (isOtpGenerated) {
          case true: {
            this.isOTPSent = true;
            this.showAlertNotification('OTP is sent.');
            this.digitalSignatureFacade.resetIsOtpGenerated();
            break;
          }
          case false: {
            this.isOTPSent = false;
            break;
          }
        }
      });
  }

  getIsOtpValidated() {
    this.digitalSignatureFacade
      .getIsOtpVerified()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isOtpVerified: boolean) => {
        if (isOtpVerified) {
          this.isOTPVerified = true;
          this.disableSignaturePad = false;
          this.showAlertNotification('Please sign on signature pad.');
          // if (!this.customerDigitalSignature) {
          //   this.showAlertNotification('Please sign on signature pad.');
          // } else {
          //   this.showAlertNotification(
          //     'You can update your signature if required.'
          //   );
          // }
        } else {
          this.isOTPVerified = false;
          this.disableSignaturePad = true;
        }
      });
  }

  back() {
    this.router.navigate([getPossHomeRouteUrl()], {
      queryParams: {
        menu: PossHomeKeyEnum.DIGITAL_SIGNATURE
      }
    });
  }

  dataURItoBlob(dataURI: any) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    let byteString: string;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
    else byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    let ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
  }

  clearDigitalSignatureScreen() {
    // this.form.reset();
    this.digitalSignatureFacade.resetDigitalSignature();
    this.customerDetailsForDigitalSignature = null;
    this.customerList = [];
    this.customerMobileNumber = '';
    this.customerName = '';
    this.customerEmailId = '';
    this.customerId = '';
    this.customerSignature = '';
    this.customerUlpNumber = '';
    this.customerAddressLine1 = '';
    this.customerAddressLine2 = '';
    this.isOTPSent = false;
    this.isOTPVerified = false;
    this.showTermAndConditionError = false;
    this.showSignatureError = false;
    this.showOtpVerificationError = false;
    this.selectedTransactionTypes = {
      isAdvanceOrderOrBooking: false,
      isCashMemo: false,
      isGHS: false,
      isAcceptAdvance: false,
      isGRN: false,
      isGRF: false,
      isGiftCard: false,
      isCNCancellation: false,
      isTEPDeclarationAndExchangeForm: false,
      isGEPDeclarationAndExchangeForm: false,
      isCCAFRequestServicePaymentOrCustomerOrder: false
    };
    this.gepTxnId = null;
    this.tepTxnId = null;
    this.isGEPForm = false;
    this.isTEPForm = false;

    if (this.signaturePad) {
      this.signaturePad.clear();
    }
    this.customerDigitalSignature = null;
    this.disableSignaturePad = true;
  }

  showAlertPopUp(message: string) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.ERROR,
        message
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  viewAvailableSignature() {
    this.dialog.open(FilePreviewComponent, {
      // height: '490px',
      width: '700px',
      autoFocus: false,
      data: {
        defaultImageUrl: this.customerDigitalSignature,
        imageUrl: this.customerDigitalSignature,
        previewHeader: 'Customer Signature',
        type: 'DIGITAL_SIGNATURE'
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.form.reset();
    this.clearDigitalSignatureScreen();
  }
}
