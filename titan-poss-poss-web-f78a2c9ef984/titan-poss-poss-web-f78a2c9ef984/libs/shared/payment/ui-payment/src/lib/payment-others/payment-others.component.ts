import { FormControl } from '@angular/forms';
import {
  PaymentModeEnum,
  PaymentType,
  DDPayment,
  ChequePayment,
  QCGCCardDetails,
  AllowedPayments,
  PaymentGroupEnum,
  WalletPayment,
  PaymentDetails,
  QCGC,
  RtgsPayment,
  TransactionTypeEnum,
  SubTransactionTypeEnum,
  StoreUser,
  ROPaymentRequestType,
  PaymentRequest,
  CNListResponse,
  CreditNotePayment,
  GvStatusList,
  SelectDropDownOption,
  AirpayPayment,
  AirpayIntegratedPayment,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  RazorPayPayment,
  DigiGetBalancePayload,
  DigiGoldDetails,
  GenerateOtpDigiGoldPayload,
  DigiGoldCombinedPaymentPayload,
  EmployeeLoanConfigList,
  EmployeeLoanPayment,
  LoadEmployeeDetailsPayload,
  RazorPayIntegratedPayment,
  CashBackConfigDetail,
  CashBackBankDetail,
  ValidateCashBackPayload,
  CashBackPayment,
  UPIPayment
} from '@poss-web/shared/models';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  AfterViewInit,
  ViewChild
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PaymentChequeDDPopupComponent } from '../payment-cheque-dd-popup/payment-cheque-dd-popup.component';
import { PaymentWalletPopupComponent } from '../payment-wallet-popup/payment-wallet-popup.component';
import { PaymentGiftVoucherPopupComponent } from '../payment-gift-voucher-popup/payment-gift-voucher-popup.component';
import { PaymentRoRequestPopupComponent } from '../payment-ro-request-popup/payment-ro-request-popup.component';
import { PaymentCreditNotePopupComponent } from '../payment-credit-note-popup/payment-credit-note-popup.component';
import { PaymentRTGSPopupComponent } from '../payment-rtgs-popup/payment-rtgs-popup.component';
import { PaymentForexPopupComponent } from '../payment-forex-popup/payment-forex-popup.component';
import { PaymentValueAccessPopupComponent } from '../payment-value-access-popup/payment-value-access-popup.component';
import { PaymentGiftCardPopupComponent } from '../payment-gift-card-popup/payment-gift-card-popup.component';
import { PaymentEmployeeLoanPopupComponent } from '../payment-employee-loan-popup/payment-employee-loan-popup.component';
import { PaymentSalaryAdvanceLoanPopupComponent } from '../payment-salary-advance-loan-popup/payment-salary-advance-loan-popup.component';
import { PaymentBankLoanPopupComponent } from '../payment-bank-loan-popup/payment-bank-loan-popup.component';
import { PaymentCashBackPopupComponent } from '../payment-cash-back-popup/payment-cash-back-popup.component';
import { Subject, Observable, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PaymentRoRequestManualPopupComponent } from '../payment-ro-request-manual-popup/payment-ro-request-manual-popup.component';
import { TranslateService } from '@ngx-translate/core';
import { PaymentAirpayPopupComponent } from '../payment-airpay-popup/payment-airpay-popup.component';
import { PaymentAirpayIntegrationPopupComponent } from '../payment-airpay-integration-popup/payment-airpay-integration-popup.component';
import { PaymentRazorpayPopupComponent } from '../payment-razorpay-popup/payment-razorpay-popup.component';
import { PaymentDigiGoldPopupComponent } from '../payment-digi-gold-popup/payment-digi-gold-popup.component';
import { SelectDropdownComponent } from '@poss-web/shared/components/ui-form-field-controls';
import { PaymentNonIntegratedRazorpayComponent } from '../payment-non-integrated-razorpay/payment-non-integrated-razorpay.component';
import { PaymentUPIPopupComponent } from '../payment-upi-popup/payment-upi-popup.component';
@Component({
  selector: 'poss-web-payment-others',
  templateUrl: './payment-others.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentOthersComponent implements OnInit, OnChanges, OnDestroy {
  @Input() isCustomerSelected = false;
  @Input() ulpID: string;
  @Input() customerID: string;
  @Input() rsoList: StoreUser[] = [];
  @Input() creditNoteList$: Observable<CNListResponse>;
  @Input() cashBackOfferBankDetails$: Observable<CashBackBankDetail[]>;
  @Input() cashBackOfferConfigDetails$: Observable<CashBackConfigDetail>;
  @Input() isCashBackCardValidated$: Observable<any>;
  @Input() isCustomerMandatoryForDigiGold: boolean;

  @Input() isROApprovedByWorkflow = false;
  @Input() chequeValidityDays: number;
  @Input() ddValidityDays: number;
  @Input() noOfDaysForChequeOrDDAcceptance: number;
  @Input() allowedPayments: AllowedPayments = new Map<
    PaymentModeEnum,
    PaymentGroupEnum
  >();
  @Input() customerSpecificPayments: PaymentModeEnum[] = [];
  @Input() customerSpecificWalletPayments: string[] = [];
  @Input() customerSpecificBankLoanPayments: string[] = [];
  @Input() wallets: string[] = [];
  @Input() subBankLoans: string[] = [];
  @Input() paymentFieldNames: string[] = [];
  @Input() chequePayerBanks: string[] = [];
  @Input() ddPayerBanks: string[] = [];
  @Input() currencyCode: string;
  @Input() totalAmountDue = 0;
  @Input() totalPaidAmount = 0;
  @Input() QCGCDetails: QCGCCardDetails = null;
  @Input() digiBalance: DigiGoldDetails = null;
  @Input() digiPrice: number = 0;
  @Input() GVDetails: GvStatusList[] = null;
  @Input()
  paymentDetails: PaymentDetails[] = [];
  @Input() enable: boolean;
  @Input() isChequeAdded = false;
  @Input() isDDAdded = false;
  @Input() invokedCreditNote$: Observable<CNListResponse>;
  @Input() thirdPartyCNList$: Observable<CNListResponse>;
  @Input() paymentDetails$: Observable<PaymentDetails[]>;
  @Input() mutipleGVsearch = false;
  @Input() isCreditNoteAdded = false;
  @Input() timeFormat: string;
  @Input() isOtpAllowedForCm$: Observable<any>;
  @Input() isOtpAllowedForAb$: Observable<any>;
  @Input() isOtpAllowedForAdvance$: Observable<any>;
  @Input() pgDesc: any;
  @Input() transactionType: TransactionTypeEnum;
  @Input() subTransactionType: SubTransactionTypeEnum;
  @Input() roPaymentRequest$: Observable<PaymentRequest>;
  @Input() paymentRequest$: Subject<any> = new Subject<any>();
  @Input() isOtpGeneratedForCn$: Observable<any>;
  @Input() isOtpGeneratedForEmpLoan$: Observable<any>;
  @Input() isOtpGeneratedForDigi$: Observable<boolean>;
  @Input() isDigiPaymentComplete$: Observable<any>;
  @Input() isOtpForMinimunCn$: Observable<any>;
  @Input() cnpriorityError: string;
  @Input() businessDate: string;
  @Input() pendingAirpayPaymentDetails: PaymentDetails[] = [];
  @Input() isAirpayIntegrationEnabled: boolean;
  @Input() isRazorpayIntegrationEnabled: boolean;
  @Input() selectedCustomer: any;
  @Input() airpayResponseData$: Subject<any> = new Subject<any>();
  @Input() isRsoSelected = true;
  @Input() pendingRazorpayPaymentDetails: PaymentDetails[] = [];
  @Input() razorpayResponseData$: Subject<any> = new Subject<any>();
  @Input() currentFiscalYear: string;
  @Input() isCNPartialRedeemAllowed: boolean;
  @Input() empLoanDetails$: Observable<EmployeeLoanConfigList>;
  @Input() transactionTotalAmount: number;
  @Input() photoIDProofUrl$: Observable<string>;
  @Input() isUploadMandatoryforThirdPartyCNWithoutOTP = false;

  @Output() validateRazorpayPayment = new EventEmitter<string>();
  @Output() updateRazorpayPaymentStatus = new EventEmitter<any>();
  @Output() updateRazorpayPayment = new EventEmitter<any>();
  @Output() startRazorpayPayment = new EventEmitter<RazorPayPayment>();
  @Output() rsoError = new EventEmitter<any>();
  @Output() validateIntegratedPaymentRequest = new EventEmitter<string>();
  @Output() updatePaymentRequest = new EventEmitter<any>();
  @Output() delete = new EventEmitter<PaymentDetails>();
  @Output() updateAirpayPayment = new EventEmitter<any>();
  @Output() startAirpayIntPayment = new EventEmitter<AirpayIntegratedPayment>();
  @Output() loadCashBackOfferBankDetails = new EventEmitter<boolean>();
  @Output() resetCashBackPayment = new EventEmitter();

  @Output() add = new EventEmitter<PaymentType>();
  @Output() sendPaymentRequest = new EventEmitter<any>();
  @Output() loadPaymentRequestStatus = new EventEmitter<any>();
  @Output() getQCGCBalance = new EventEmitter<{
    cardNumber: string;
    otpRequired: boolean;
  }>();

  @Output() getDigiBalance = new EventEmitter<DigiGetBalancePayload>();
  @Output() getDigiSellingPrice = new EventEmitter();

  @Output() sendDigiOTP = new EventEmitter<GenerateOtpDigiGoldPayload>();
  @Output() getGVBalance = new EventEmitter<{
    voucherNumber: string;
  }>();
  @Output() removeGV = new EventEmitter<string>();

  @Output() getInvokedCN = new EventEmitter<any>();
  @Output() getThirdPartyCN = new EventEmitter<any>();
  @Output() removePaymentDetail = new EventEmitter<any>();
  @Output() tabChanged = new EventEmitter<boolean>();
  @Output() resetQCGC = new EventEmitter();
  @Output() resetGV = new EventEmitter();
  @Output() duplicatePayment = new EventEmitter();
  @Output() generateOTPForCn = new EventEmitter<any>();
  @Output() loadEmpLoanDetails = new EventEmitter<LoadEmployeeDetailsPayload>();
  @Output() addLoanPayment = new EventEmitter();
  @Output() generateOTPForEmpLoan = new EventEmitter<any>();
  @Output() loadCreditNoteList = new EventEmitter();
  @Output() getCashBackConfigDetails = new EventEmitter<string>();
  @Output() validateCashBackCard = new EventEmitter<ValidateCashBackPayload>();
  @Output() uploadPhotoIDProof = new EventEmitter<FormData>();
  @Output() resetUploadedFileData = new EventEmitter();

  destroy$ = new Subject();
  QCGCData$: Subject<any> = new Subject<any>();
  digiData$: Subject<any> = new Subject<any>();
  digiPrice$: Subject<any> = new Subject<any>();
  GVData$: Subject<any> = new Subject<any>();
  totalDueAmount$: Subject<any> = new Subject<any>();

  paymentModesList: { description: string; value: PaymentModeEnum }[] = [];
  enabledPaymentOptions: SelectDropDownOption[] = [];
  // openAirpayPaymentsDetails$: Subject<any> = new Subject<any>();
  // openAirpayPaymentsDetails: PaymentDetails[] = [];

  // openRazorpayPaymentsDetails$: Subject<any> = new Subject<any>();
  // openRazorpayPaymentsDetails: PaymentDetails[] = [];

  form = new FormControl(null);
  temp = false;
  defaultImageUrl = 'assets/img/product-default-image.svg';
  @ViewChild(SelectDropdownComponent, { static: true })
  selectDropdownRef: SelectDropdownComponent;
  @Input() setFocus = false;

  constructor(
    private dialog: MatDialog,
    private translateService: TranslateService,
    private alertPopupService: AlertPopupServiceAbstraction
  ) {}

  ngOnInit() {
    this.translateService
      .get([
        'pw.paymentOthers.creditNoteOption',
        'pw.paymentOthers.chequeOption',
        'pw.paymentOthers.ddOption',
        'pw.paymentOthers.roPaymentOption',
        'pw.paymentOthers.rtgsOption',
        'pw.paymentOthers.forexOption',
        'pw.paymentOthers.walletOption',
        'pw.paymentOthers.valueAccessOption',
        'pw.paymentOthers.giftCardOption',
        'pw.paymentOthers.giftVoucherOption',
        'pw.paymentOthers.employeeLoanOption',
        'pw.paymentOthers.salaryAdvanceLoanOption',
        'pw.paymentOthers.bankLoanOption',
        'pw.paymentOthers.cashBackOfferOption',
        'pw.paymentOthers.airpayLabel',
        'pw.paymentOthers.razorpayLabel',
        'pw.paymentOthers.digiGoldLabel',
        'pw.paymentOthers.upiOption'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedLabels: any) => {
        this.paymentModesList = [
          {
            description: translatedLabels['pw.paymentOthers.creditNoteOption'],
            value: PaymentModeEnum.CREDIT_NOTE
          },
          {
            description: translatedLabels['pw.paymentOthers.airpayLabel'],
            value: PaymentModeEnum.AIRPAY
          },
          {
            description: translatedLabels['pw.paymentOthers.chequeOption'],
            value: PaymentModeEnum.CHEQUE
          },
          {
            description: translatedLabels['pw.paymentOthers.ddOption'],
            value: PaymentModeEnum.DD
          },
          {
            description: translatedLabels['pw.paymentOthers.roPaymentOption'],
            value: PaymentModeEnum.RO_PAYMENT
          },
          {
            description: translatedLabels['pw.paymentOthers.rtgsOption'],
            value: PaymentModeEnum.RTGS
          },
          {
            description: translatedLabels['pw.paymentOthers.forexOption'],
            value: PaymentModeEnum.FOREX
          },
          {
            description: translatedLabels['pw.paymentOthers.walletOption'],
            value: PaymentModeEnum.WALLET
          },
          {
            description: translatedLabels['pw.paymentOthers.valueAccessOption'],
            value: PaymentModeEnum.VALUE_ACCESS
          },
          {
            description: translatedLabels['pw.paymentOthers.giftCardOption'],
            value: PaymentModeEnum.QCGC
          },
          {
            description: translatedLabels['pw.paymentOthers.giftVoucherOption'],
            value: PaymentModeEnum.GIFT_VOUCHER
          },
          {
            description:
              translatedLabels['pw.paymentOthers.employeeLoanOption'],
            value: PaymentModeEnum.EMPLOYEE_LOAN
          },
          {
            description:
              translatedLabels['pw.paymentOthers.salaryAdvanceLoanOption'],
            value: PaymentModeEnum.SALARY_ADVANCE_LOAN
          },
          {
            description: translatedLabels['pw.paymentOthers.bankLoanOption'],
            value: PaymentModeEnum.BANK_LOAN
          },
          {
            description:
              translatedLabels['pw.paymentOthers.cashBackOfferOption'],
            value: PaymentModeEnum.CASH_BACK
          },
          {
            description: translatedLabels['pw.paymentOthers.razorpayLabel'],
            value: PaymentModeEnum.RAZOR_PAY
          },
          {
            description: translatedLabels['pw.paymentOthers.digiGoldLabel'],
            value: PaymentModeEnum.DIGI_GOLD_NON_TANISHQ
          },
          {
            description: translatedLabels['pw.paymentOthers.digiGoldLabel'],
            value: PaymentModeEnum.DIGI_GOLD_TANISHQ
          },
          {
            description: translatedLabels['pw.paymentOthers.upiOption'],
            value: PaymentModeEnum.UPI
          }
        ];
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['QCGCDetails']) {
      this.QCGCData$.next(changes['QCGCDetails']);
    }
    if (changes['digiBalance']) {
      this.digiData$.next(changes['digiBalance']);
    }
    if (changes['digiPrice']) {
      this.digiPrice$.next(changes['digiPrice']);
    }
    if (changes['GVDetails']) {
      this.GVData$.next(changes['GVDetails']);
    }
    if (changes['enable']) {
      this.checkForm();
    }
    if (changes['totalAmountDue']) {
      this.totalDueAmount$.next(changes['totalAmountDue']);
      this.reset();
    }
    if (changes['paymentDetails']) {
      this.pendingAirpayPaymentDetails = this.paymentDetails.filter(x => {
        if (
          x &&
          x.paymentCode === PaymentModeEnum.AIRPAY &&
          (x.status === 'OPEN' || x.status === 'IN_PROGRESS')
        ) {
          return x;
        }
      });
      this.pendingRazorpayPaymentDetails = this.paymentDetails.filter(x => {
        if (
          x &&
          x.paymentCode === PaymentModeEnum.RAZOR_PAY &&
          (x.status === 'OPEN' || x.status === 'IN_PROGRESS')
        ) {
          return x;
        }
      });
    }
    if (changes['setFocus']) {
      if (this.setFocus) {
        setTimeout(() => {
          if (this.selectDropdownRef) this.selectDropdownRef.focus();
        }, 100);
      }
    }
    this.createPaymentOptions();
  }

  checkForm() {
    this.reset();
    if (this.enable) {
      this.form.enable();
    } else {
      this.form.disable();
    }
  }
  reset() {
    this.form.reset();
  }

  limitCheck() {
    return this.totalAmountDue > 0;
  }

  createPaymentOptions() {
    this.enabledPaymentOptions = this.paymentModesList
      .filter(payment => this.enablePayment(payment.value))
      .map(payment => ({
        description: payment.description,
        value: payment.value
      }));

    if (this.enabledPaymentOptions.length) {
      this.form.setValue(this.enabledPaymentOptions[0].value);
    }
  }

  enablePayment(paymentMode: PaymentModeEnum) {
    // Accept Advance : CN as a payment option, no other payment option can be clubbed
    if (
      this.transactionType === TransactionTypeEnum.ADV &&
      this.subTransactionType === SubTransactionTypeEnum.NON_FROZEN_RATES &&
      paymentMode !== PaymentModeEnum.CREDIT_NOTE &&
      this.isCreditNoteAdded
    ) {
      return false;
    }
    // Accept Advance : CN as a payment option, no other payment option can be clubbed
    else if (
      this.transactionType === TransactionTypeEnum.ADV &&
      this.subTransactionType === SubTransactionTypeEnum.NON_FROZEN_RATES &&
      paymentMode === PaymentModeEnum.CREDIT_NOTE &&
      !this.isCreditNoteAdded &&
      this.totalPaidAmount !== 0
    ) {
      return false;
    }
    // Accept Advance : Cheque as a payment option, no other payment option can be clubbed
    else if (
      this.transactionType === TransactionTypeEnum.ADV &&
      this.subTransactionType === SubTransactionTypeEnum.NON_FROZEN_RATES &&
      paymentMode !== PaymentModeEnum.CHEQUE &&
      this.isChequeAdded
    ) {
      return false;
    }
    // Accept Advance : Cheque as a payment option, no other payment option can be clubbed and can be added once
    else if (
      this.transactionType === TransactionTypeEnum.ADV &&
      this.subTransactionType === SubTransactionTypeEnum.NON_FROZEN_RATES &&
      paymentMode === PaymentModeEnum.CHEQUE &&
      this.totalPaidAmount !== 0
    ) {
      return false;
    }

    // Accept Advance : DD as a payment option, no other payment option can be clubbed
    // else if (
    //   this.transactionType === TransactionTypeEnum.ADV &&
    //   this.subTransactionType === SubTransactionTypeEnum.NON_FROZEN_RATES &&
    //   paymentMode !== PaymentModeEnum.DD &&
    //   this.isDDAdded
    // ) {
    //   return false;
    // }
    // Accept Advance : DD as a payment option, no other payment option can be clubbed and can be added once
    // else if (
    //   this.transactionType === TransactionTypeEnum.ADV &&
    //   this.subTransactionType === SubTransactionTypeEnum.NON_FROZEN_RATES &&
    //   paymentMode === PaymentModeEnum.DD &&
    //   this.totalPaidAmount !== 0
    // ) {
    //   return false;
    // }

    // GRF : Cheque as a payment option, no other payment option can be clubbed
    else if (
      this.transactionType === TransactionTypeEnum.ADV &&
      this.subTransactionType === SubTransactionTypeEnum.FROZEN_RATES &&
      paymentMode !== PaymentModeEnum.CHEQUE &&
      this.isChequeAdded
    ) {
      return false;
    }
    // GRF : Cheque as a payment option, no other payment option can be clubbed and can be added once
    else if (
      this.transactionType === TransactionTypeEnum.ADV &&
      this.subTransactionType === SubTransactionTypeEnum.FROZEN_RATES &&
      paymentMode === PaymentModeEnum.CHEQUE &&
      this.totalPaidAmount !== 0
    ) {
      return false;
    } else if (
      paymentMode === PaymentModeEnum.RO_PAYMENT &&
      this.ulpID === null
    ) {
      return false;
    } else if (
      paymentMode === PaymentModeEnum.RO_PAYMENT &&
      this.allowedPayments.has(PaymentModeEnum.RO_PAYMENT) &&
      this.isROApprovedByWorkflow
    ) {
      return true;
      //
    } else if (
      paymentMode === PaymentModeEnum.DIGI_GOLD_NON_TANISHQ &&
      this.allowedPayments.has(PaymentModeEnum.DIGI_GOLD_TANISHQ)
    ) {
      return false;
    } else if (
      paymentMode === PaymentModeEnum.EMPLOYEE_LOAN &&
      this.allowedPayments.has(PaymentModeEnum.EMPLOYEE_LOAN) &&
      this.paymentDetails.some(
        x => x.paymentCode === PaymentModeEnum.EMPLOYEE_LOAN
      )
    ) {
      return false;
    } else if (
      paymentMode === PaymentModeEnum.AIRPAY &&
      this.pendingAirpayPaymentDetails.length > 0
    ) {
      return true;
    } else if (
      paymentMode === PaymentModeEnum.RAZOR_PAY &&
      this.pendingRazorpayPaymentDetails.length > 0
    ) {
      return true;
    }

    if (!this.limitCheck()) {
      return false;
    } else if (this.customerSpecificPayments.includes(paymentMode)) {
      return this.isCustomerSelected && this.allowedPayments.has(paymentMode);
    } else {
      return this.allowedPayments.has(paymentMode);
    }
  }

  getPaymetGroup(paymentMode: PaymentModeEnum) {
    return this.allowedPayments.get(paymentMode);
  }

  selectPayment(paymentMode: PaymentModeEnum) {
    if (
      this.form.enabled &&
      this.enablePayment(paymentMode) &&
      this.checkRso(paymentMode)
    ) {
      switch (paymentMode) {
        case PaymentModeEnum.CHEQUE: {
          this.openChequePayment();
          break;
        }
        case PaymentModeEnum.DD: {
          this.openDDPayment();
          break;
        }
        case PaymentModeEnum.WALLET: {
          this.openWalletPayment();
          break;
        }

        case PaymentModeEnum.GIFT_VOUCHER: {
          this.openGiftVoucherPayment();
          break;
        }
        case PaymentModeEnum.RO_PAYMENT: {
          if (this.isROApprovedByWorkflow) {
            this.openRoRequestPayment();
          } else {
            this.openRoRequestPaymentManual();
          }
          break;
        }
        case PaymentModeEnum.CREDIT_NOTE: {
          this.loadCreditNoteList.emit();
          this.openCreditNotePayment();
          break;
        }
        case PaymentModeEnum.RTGS: {
          this.openRTGSPayment();
          break;
        }
        case PaymentModeEnum.FOREX: {
          this.openForexPayment();
          break;
        }
        case PaymentModeEnum.VALUE_ACCESS: {
          this.openValueAccessPayment();
          break;
        }
        case PaymentModeEnum.QCGC: {
          this.openGiftCardPayment();
          break;
        }
        case PaymentModeEnum.DIGI_GOLD_NON_TANISHQ:
        case PaymentModeEnum.DIGI_GOLD_TANISHQ: {
          this.openDigiGoldPayment();
          break;
        }
        case PaymentModeEnum.EMPLOYEE_LOAN: {
          this.openEmployeeLoanPayment();
          break;
        }
        case PaymentModeEnum.SALARY_ADVANCE_LOAN: {
          this.openSalaryAdvanceLoanPayment();
          break;
        }
        case PaymentModeEnum.BANK_LOAN: {
          this.openBankLoanPayment();
          break;
        }
        case PaymentModeEnum.CASH_BACK: {
          this.openCashBackPayment();
          break;
        }

        case PaymentModeEnum.AIRPAY: {
          this.openAirpayPayment();
          break;
        }
        case PaymentModeEnum.RAZOR_PAY: {
          this.openRazorpayPayment();
          break;
        }
        case PaymentModeEnum.UPI: {
          this.openUPIPayment();
          break;
        }
      }
    }
  }

  checkRso(paymentMode: PaymentModeEnum) {
    const productGridNotPresent = [
      SubTransactionTypeEnum.GIFT_SALE,
      SubTransactionTypeEnum.FROZEN_RATES,
      SubTransactionTypeEnum.NON_FROZEN_RATES
    ];
    if (
      this.isRsoSelected === false &&
      paymentMode !== PaymentModeEnum.RO_PAYMENT &&
      productGridNotPresent.indexOf(this.subTransactionType) === -1
    ) {
      this.rsoError.emit();
      return false;
    }
    return true;
  }

  openAirpayPayment() {
    if (this.isCustomerSelected) {
      if (!this.isAirpayIntegrationEnabled) {
        this.dialog
          .open(PaymentAirpayPopupComponent, {
            autoFocus: false,
            width: '450px',
            data: {
              paymentGroup: this.getPaymetGroup(PaymentModeEnum.AIRPAY),
              currencyCode: this.currencyCode,
              totalAmountDue: this.totalAmountDue,
              fieldDetails: this.paymentFieldNames,
              customerID: this.customerID,
              businessDate: this.businessDate
            },
            disableClose: true
          })
          .afterClosed()
          .pipe(takeUntil(this.destroy$))
          .subscribe((paymentData: AirpayPayment) => {
            if (paymentData) {
              this.add.emit(paymentData);
            }
          });
      } else {
        // this.loadAirpayOpenPayments.next();
        this.loadPaymentRequestStatus.emit(PaymentModeEnum.AIRPAY);
        const ref = this.dialog.open(PaymentAirpayIntegrationPopupComponent, {
          autoFocus: false,
          width: '450px',
          data: {
            paymentGroup: this.getPaymetGroup(PaymentModeEnum.AIRPAY),
            currencyCode: this.currencyCode,
            totalAmountDue: this.totalAmountDue,
            customer: this.selectedCustomer,
            customerID: this.customerID,
            airpayResponseData$: this.airpayResponseData$,
            openAirpayPaymentsDetails$: of(this.pendingAirpayPaymentDetails),
            businessDate: this.businessDate,
            requestStatus$: this.paymentRequest$
          },
          disableClose: true
        });
        ref.componentInstance.startPaymentEvent
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: AirpayIntegratedPayment) => {
            if (data) {
              //  this.startAirpayIntPayment.emit(data);
              this.sendPaymentRequest.emit(data);
            }
          });
        ref.componentInstance.resendLinkEvent
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: any) => {
            if (data) {
              this.updatePaymentRequest.emit(data);
            }
          });
        ref.componentInstance.verifyTransactionEvent
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: string) => {
            if (data) {
              this.validateIntegratedPaymentRequest.emit(data);
            }
          });

        ref.componentInstance.addAirpayPayment
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: AirpayIntegratedPayment) => {
            if (data) {
                this.add.emit(data);
            }
          });
      }
    }
  }

  openRazorpayPayment() {
    if (this.isCustomerSelected) {
      if (!this.isRazorpayIntegrationEnabled) {
        this.dialog
          .open(PaymentNonIntegratedRazorpayComponent, {
            autoFocus: false,
            width: '450px',
            data: {
              paymentGroup: this.getPaymetGroup(PaymentModeEnum.RAZOR_PAY),
              currencyCode: this.currencyCode,
              totalAmountDue: this.totalAmountDue,
              fieldDetails: this.paymentFieldNames,
              customerID: this.customerID,
              businessDate: this.businessDate
            },
            disableClose: true
          })
          .afterClosed()
          .pipe(takeUntil(this.destroy$))
          .subscribe((paymentData: RazorPayPayment) => {
            if (paymentData) {
              this.add.emit(paymentData);
            }
          });
      } else {
        this.loadPaymentRequestStatus.emit(PaymentModeEnum.RAZOR_PAY);
        const ref = this.dialog.open(PaymentRazorpayPopupComponent, {
          autoFocus: false,
          width: '450px',
          data: {
            paymentGroup: this.getPaymetGroup(PaymentModeEnum.RAZOR_PAY),
            currencyCode: this.currencyCode,
            totalAmountDue: this.totalAmountDue,
            customer: this.selectedCustomer,
            razorpayResponseData$: this.razorpayResponseData$,
            openRazorpayPaymentsDetails$: of(
              this.pendingRazorpayPaymentDetails
            ),

            businessDate: this.businessDate,
            customerID: this.customerID,
            requestStatus$: this.paymentRequest$
          },
          disableClose: true
        });
        ref.componentInstance.startPaymentEvent
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: RazorPayIntegratedPayment) => {
            if (data) {
              this.sendPaymentRequest.emit(data);
            }
          });
        ref.componentInstance.resendLinkEvent
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: any) => {
            if (data) {
              this.updatePaymentRequest.emit(data);
            }
          });
        ref.componentInstance.verifyTransactionEvent
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: string) => {
            if (data) {
              this.validateIntegratedPaymentRequest.emit(data);
            }
          });

        ref.componentInstance.addRazorpayPayment
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: RazorPayIntegratedPayment) => {
            if (data) {
              this.add.emit(data);
            }
          });

        ref
          .afterClosed()
          .pipe(takeUntil(this.destroy$))
          .subscribe((data: any) => {
            if (data) {
              if (
                data.status === 'IN_PROGRESS' ||
                data.status === 'COMPLETED'
              ) {
                this.updateRazorpayPaymentStatus.emit(data);
                this.alertPopupService.open({
                  type: AlertPopupTypeEnum.INFO,
                  message: 'pw.paymentModeRazorpay.successMessage'
                });
              } else if (
                data.status === 'FAILED' ||
                data.status === 'CANCELLED' ||
                data.status === 'REVERSED' ||
                data.status === 'DELETED'
              ) {
                this.alertPopupService.open({
                  type: AlertPopupTypeEnum.ERROR,
                  message: 'pw.paymentModeRazorpay.errorMessage'
                });
                // this.translate
                //   .get('pw.paymentModeAirpay.errorMessage')
                //   .pipe(take(1))
                //   .subscribe((translatedMessage: string) => {
                //     this.dialog.open(ErrorPopupComponent, {
                //       data: {
                //         message: translatedMessage
                //       }
                //     });
                //   });
                this.delete.next(data);
              }
            }
          });
      }
    }
  }
  openChequePayment() {
    this.dialog
      .open(PaymentChequeDDPopupComponent, {
        autoFocus: false,
        width: '450px',
        data: {
          paymentMode: PaymentModeEnum.CHEQUE,
          payerBanks: this.chequePayerBanks,
          validityDays: this.noOfDaysForChequeOrDDAcceptance,
          paymentGroup: this.getPaymetGroup(PaymentModeEnum.CHEQUE),
          currencyCode: this.currencyCode,
          totalAmountDue: this.totalAmountDue,
          businessDate: this.businessDate
        },
        disableClose: true
      })
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: ChequePayment) => {
        if (res) {
          this.add.emit(res);
        }
      });
  }

  openDDPayment() {
    this.dialog
      .open(PaymentChequeDDPopupComponent, {
        autoFocus: false,
        width: '450px',
        data: {
          paymentMode: PaymentModeEnum.DD,
          payerBanks: this.ddPayerBanks,
          validityDays: this.noOfDaysForChequeOrDDAcceptance,
          paymentGroup: this.getPaymetGroup(PaymentModeEnum.DD),
          currencyCode: this.currencyCode,
          totalAmountDue: this.totalAmountDue,
          businessDate: this.businessDate
        },
        disableClose: true
      })
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: DDPayment) => {
        if (res) {
          this.add.emit(res);
        }
      });
  }

  openWalletPayment() {
    this.dialog
      .open(PaymentWalletPopupComponent, {
        autoFocus: false,
        width: '450px',
        data: {
          wallets: this.isCustomerSelected
            ? this.wallets
            : this.wallets.filter(
                wallet => !this.customerSpecificWalletPayments.includes(wallet)
              ),
          paymentGroup: this.getPaymetGroup(PaymentModeEnum.WALLET),
          currencyCode: this.currencyCode,
          totalAmountDue: this.totalAmountDue,
          fieldDetails: this.paymentFieldNames,
          businessDate: this.businessDate
        },
        disableClose: true
      })
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: WalletPayment) => {
        if (res) {
          this.add.emit(res);
        }
      });
  }

  openGiftVoucherPayment() {
    const dialogRef = this.dialog.open(PaymentGiftVoucherPopupComponent, {
      autoFocus: false,
      data: {
        GVData$: this.GVData$,
        paymentGroup: this.getPaymetGroup(PaymentModeEnum.GIFT_VOUCHER),
        currencyCode: this.currencyCode,
        mutipleGVsearch: this.mutipleGVsearch,
        businessDate: this.businessDate
      },
      width: '950px',
      disableClose: true
    });

    dialogRef.componentInstance.getGVBalance
      .pipe(takeUntil(this.destroy$))
      .subscribe(CardNumber => {
        this.getGVBalance.emit({
          voucherNumber: CardNumber
        });
      });

    dialogRef.componentInstance.removeGV
      .pipe(takeUntil(this.destroy$))
      .subscribe(CardNumber => {
        this.removeGV.emit(CardNumber);
      });

    dialogRef.componentInstance.resetGV
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.resetGV.emit();
      });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: QCGC) => {
        if (res) {
          this.add.emit(res);
          // this.checkPaymentAlreadyAdded(res);
        }
      });
  }

  openRoRequestPayment() {
    if (this.isCustomerSelected) {
      this.loadPaymentRequestStatus.emit(PaymentModeEnum.RO_PAYMENT);
      const ref = this.dialog.open(PaymentRoRequestPopupComponent, {
        autoFocus: false,
        width: '450px',
        data: {
          paymentGroup: this.getPaymetGroup(PaymentModeEnum.RO_PAYMENT),
          currencyCode: this.currencyCode,
          totalAmountDue: this.totalAmountDue,
          customer: this.selectedCustomer,

          businessDate: this.businessDate,
          customerID: this.customerID,
          requestStatus$: this.paymentRequest$
        },
        disableClose: true
      });
      ref.componentInstance.startPaymentEvent
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: RazorPayIntegratedPayment) => {
          if (data) {
            this.sendPaymentRequest.emit(data);
          }
        });
      ref.componentInstance.resendLinkEvent
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          if (data) {
            this.updatePaymentRequest.emit(data);
          }
        });
      ref.componentInstance.verifyTransactionEvent
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: string) => {
          if (data) {
            this.validateIntegratedPaymentRequest.emit(data);
          }
        });

      ref.componentInstance.addROPayment
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          if (data) {
            this.add.emit(data);
          }
        });

      ref
        .afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          if (data) {
            if (data.status === 'IN_PROGRESS' || data.status === 'COMPLETED') {
              this.updateRazorpayPaymentStatus.emit(data);
              this.alertPopupService.open({
                type: AlertPopupTypeEnum.INFO,
                message: 'pw.paymentModeRazorpay.successMessage'
              });
            } else if (
              data.status === 'FAILED' ||
              data.status === 'CANCELLED' ||
              data.status === 'REVERSED' ||
              data.status === 'DELETED'
            ) {
              this.alertPopupService.open({
                type: AlertPopupTypeEnum.ERROR,
                message: 'pw.paymentModeRazorpay.errorMessage'
              });
              // this.translate
              //   .get('pw.paymentModeAirpay.errorMessage')
              //   .pipe(take(1))
              //   .subscribe((translatedMessage: string) => {
              //     this.dialog.open(ErrorPopupComponent, {
              //       data: {
              //         message: translatedMessage
              //       }
              //     });
              //   });
              this.delete.next(data);
            }
          }
        });
    }
  }

  openRoRequestPaymentManual() {
    this.dialog
      .open(PaymentRoRequestManualPopupComponent, {
        autoFocus: false,
        width: '450px',
        data: {
          currencyCode: this.currencyCode,
          totalAmountDue: this.totalAmountDue,
          paymentGroup: this.getPaymetGroup(PaymentModeEnum.RO_PAYMENT),
          customerID: this.customerID,
          rsoList: this.rsoList,
          businessDate: this.businessDate
        },
        disableClose: true
      })
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.add.emit(data);
        }
      });
  }

  openCreditNotePayment() {
    this.resetUploadedFileData.emit();

    const dialogRef = this.dialog.open(PaymentCreditNotePopupComponent, {
      autoFocus: false,
      width: '996px',
      data: {
        totalAmountDue$: this.totalDueAmount$,
        creditNoteList$: this.creditNoteList$,
        paymentGroup: this.getPaymetGroup(PaymentModeEnum.CREDIT_NOTE),
        currencyCode: this.currencyCode,
        paymentDetails$: this.paymentDetails$,
        invokedCreditNote$: this.invokedCreditNote$,
        totalAmountDue: this.totalAmountDue,
        thirdPartyCNList$: this.thirdPartyCNList$,
        isOtpAllowedForCm$: this.isOtpAllowedForCm$,
        isOtpForMinimunCn$: this.isOtpForMinimunCn$,
        isOtpAllowedForAb$: this.isOtpAllowedForAb$,
        isOtpAllowedForAdvance$: this.isOtpAllowedForAdvance$,
        isOtpGeneratedForCn$: this.isOtpGeneratedForCn$,
        cnpriorityError: this.cnpriorityError,
        businessDate: this.businessDate,
        currentFiscalYear: this.currentFiscalYear,
        isCNPartialRedeemAllowed: this.isCNPartialRedeemAllowed,
        isUploadMandatoryforThirdPartyCNWithoutOTP: this
          .isUploadMandatoryforThirdPartyCNWithoutOTP
      },
      disableClose: true
    });

    dialogRef.componentInstance.getInvokedCN
      .pipe(takeUntil(this.destroy$))
      .subscribe(invokeCnPayload => {
        this.getInvokedCN.emit(invokeCnPayload);
      });

    dialogRef.componentInstance.getThirdPartyCN
      .pipe(takeUntil(this.destroy$))
      .subscribe(thirdpartyCnPayload => {
        this.getThirdPartyCN.emit(thirdpartyCnPayload);
      });
    dialogRef.componentInstance.tabChanged
      .pipe(takeUntil(this.destroy$))
      .subscribe(isTabChanged => {
        this.tabChanged.emit(isTabChanged);
      });
    dialogRef.componentInstance.addCreditNotePayment
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: CreditNotePayment) => {
        if (res) {
          this.checkPaymentAlreadyAdded(res);
        }
      });
    dialogRef.componentInstance.generateOTPForCn
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: string) => {
        if (response) {
          this.generateOTPForCn.emit(response);
        }
      });
    dialogRef.componentInstance.removePaymentDetail
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.removePaymentDetail.emit(res);
        }
      });
    dialogRef.componentInstance.uploadPhotoIDProof
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.uploadPhotoIDProof.emit(res);
        }
      });
    dialogRef.componentInstance.photoIDProofUrl$ = this.photoIDProofUrl$;
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: CreditNotePayment) => {
        if (res) {
          this.checkPaymentAlreadyAdded(res);
        }
      });
  }

  openRTGSPayment() {
    this.dialog
      .open(PaymentRTGSPopupComponent, {
        autoFocus: false,
        width: '450px',
        data: {
          paymentGroup: this.getPaymetGroup(PaymentModeEnum.RTGS),
          currencyCode: this.currencyCode,
          totalAmountDue: this.totalAmountDue,
          fieldDetails: this.paymentFieldNames,
          businessDate: this.businessDate
        },
        disableClose: true
      })
      .afterClosed()
      .subscribe((res: RtgsPayment) => {
        if (res) {
          this.add.emit(res);
        }
      });
  }

  openUPIPayment() {
    this.dialog
      .open(PaymentUPIPopupComponent, {
        autoFocus: false,
        width: '450px',
        data: {
          paymentGroup: this.getPaymetGroup(PaymentModeEnum.UPI),
          currencyCode: this.currencyCode,
          totalAmountDue: this.totalAmountDue,
          fieldDetails: this.paymentFieldNames,
          businessDate: this.businessDate
        },
        disableClose: true
      })
      .afterClosed()
      .subscribe((res: UPIPayment) => {
        if (res) {
          this.add.emit(res);
        }
      });
  }

  openForexPayment() {
    this.dialog
      .open(PaymentForexPopupComponent, {
        autoFocus: false,
        width: '450px'
      })
      .afterClosed();
  }
  openValueAccessPayment() {
    this.dialog
      .open(PaymentValueAccessPopupComponent, {
        autoFocus: false,
        width: '450px'
      })
      .afterClosed();
  }

  openGiftCardPayment() {
    const dialogRef = this.dialog.open(PaymentGiftCardPopupComponent, {
      autoFocus: false,
      data: {
        QCGCData$: this.QCGCData$,
        paymentGroup: this.getPaymetGroup(PaymentModeEnum.QCGC),
        currencyCode: this.currencyCode,
        productDesc: this.pgDesc,
        businessDate: this.businessDate,
        paymentDetails$: this.paymentDetails$
      },
      width: '850px',
      disableClose: true
    });

    dialogRef.componentInstance.getQCGCBalance
      .pipe(takeUntil(this.destroy$))
      .subscribe(CardNumber => {
        this.getQCGCBalance.emit({
          cardNumber: CardNumber,
          otpRequired: true
        });
      });

    dialogRef.componentInstance.resetQCGC
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.resetQCGC.emit();
      });

    dialogRef.componentInstance.addQCGCPayment
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: QCGC) => {
        if (res) {
          this.checkPaymentAlreadyAdded(res);
        }
      });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: QCGC) => {
        if (res) {
          this.checkPaymentAlreadyAdded(res);
        }
      });
  }

  openDigiGoldPayment() {
    this.getDigiSellingPrice.emit();
    const dialogRef = this.dialog.open(PaymentDigiGoldPopupComponent, {
      autoFocus: false,
      data: {
        digiBalance: this.digiData$,
        digiPrice: this.digiPrice$,
        isOtpGeneratedForDigi$: this.isOtpGeneratedForDigi$,
        isDigiPaymentComplete$: this.isDigiPaymentComplete$,
        paymentGroup: PaymentGroupEnum.REGULAR,
        currencyCode: this.currencyCode,
        mobileNo: this.selectedCustomer.mobileNumber,
        businessDate: this.businessDate,
        isCustomerMandatoryForDigiGold: this.isCustomerMandatoryForDigiGold,
        tab1: this.enableDigiGold(PaymentModeEnum.DIGI_GOLD_TANISHQ),
        tab2: this.enableDigiGold(PaymentModeEnum.DIGI_GOLD_NON_TANISHQ)
      },
      width: '850px',
      minWidth: '450px',
      disableClose: true
    });

    dialogRef.componentInstance.getDigiBalance
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.getDigiBalance.emit(value);
      });

    dialogRef.componentInstance.sendOtp
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.sendDigiOTP.emit(value);
      });

    dialogRef.componentInstance.resetDigi
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.resetQCGC.emit();
      });

    dialogRef.componentInstance.addDigi
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: DigiGoldCombinedPaymentPayload) => {
        if (res) {
          if (res.nonTanshiq) {
            this.add.emit(res.nonTanshiq);
          }
          if (res.tanshiq) {
            this.add.emit(res.tanshiq);
          }
        }
      });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: DigiGoldCombinedPaymentPayload) => {
        if (res) {
          if (res.nonTanshiq) {
            this.add.emit(res.nonTanshiq);
          }
          if (res.tanshiq) {
            this.add.emit(res.tanshiq);
          }
        }
      });
  }

  openEmployeeLoanPayment() {
    const dialogRef = this.dialog.open(PaymentEmployeeLoanPopupComponent, {
      autoFocus: false,
      width: '500px',
      disableClose: true,
      data: {
        empLoanDetails$: this.empLoanDetails$,
        isOtpGeneratedForEmpLoan$: this.isOtpGeneratedForEmpLoan$,
        paymentDetails$: this.paymentDetails$,
        transactionTotalAmount: this.transactionTotalAmount,
        businessDate: this.businessDate,
        currencyCode: this.currencyCode,
        customerID: this.customerID,
        paymentGroup: PaymentGroupEnum.REGULAR,
        paymentMode: PaymentModeEnum.EMPLOYEE_LOAN
      }
    });
    dialogRef.componentInstance.loadEmpLoanDetails
      .pipe(takeUntil(this.destroy$))
      .subscribe((empCode: LoadEmployeeDetailsPayload) => {
        if (empCode) {
          this.loadEmpLoanDetails.emit(empCode);
        }
      });
    dialogRef.componentInstance.addPayment
      .pipe(takeUntil(this.destroy$))
      .subscribe((paymentPayload: EmployeeLoanPayment) => {
        if (paymentPayload) {
          this.add.emit(paymentPayload);
        }
      });
    dialogRef.componentInstance.invokeOTP
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.generateOTPForEmpLoan.emit(data);
      });
  }

  openSalaryAdvanceLoanPayment() {
    this.dialog
      .open(PaymentSalaryAdvanceLoanPopupComponent, {
        autoFocus: false,
        width: '500px',
        disableClose: true
      })
      .afterClosed();
  }

  openBankLoanPayment() {
    this.dialog
      .open(PaymentBankLoanPopupComponent, {
        autoFocus: false,
        width: '450px',
        data: {
          subBankLoans: this.isCustomerSelected
            ? this.subBankLoans
            : this.subBankLoans.filter(
                subBankLoan =>
                  !this.customerSpecificBankLoanPayments.includes(subBankLoan)
              ),
          paymentGroup: this.getPaymetGroup(PaymentModeEnum.BANK_LOAN),
          currencyCode: this.currencyCode,
          totalAmountDue: this.totalAmountDue,
          fieldDetails: this.paymentFieldNames,
          businessDate: this.businessDate
        },
        disableClose: true
      })
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: WalletPayment) => {
        if (res) {
          this.add.emit(res);
        }
      });
  }

  openCashBackPayment() {
    this.loadCashBackOfferBankDetails.emit(true);

    const dialogRef = this.dialog.open(PaymentCashBackPopupComponent, {
      autoFocus: false,
      width: '500px',
      data: {
        cashBackOfferBankDetails$: this.cashBackOfferBankDetails$,
        paymentGroup: this.getPaymetGroup(PaymentModeEnum.CASH_BACK),
        currencyCode: this.currencyCode,
        totalAmountDue: this.totalAmountDue,
        cashBackOfferConfigDetails$: this.cashBackOfferConfigDetails$,
        isCashBackCardValidated$: this.isCashBackCardValidated$,
        transactionTotalAmount: this.transactionTotalAmount
      },
      disableClose: true
    });
    dialogRef.componentInstance.getCashBackConfigDetails
      .pipe(takeUntil(this.destroy$))
      .subscribe(offerId => {
        this.getCashBackConfigDetails.emit(offerId);
      });

    dialogRef.componentInstance.validateCashBackCard
      .pipe(takeUntil(this.destroy$))
      .subscribe(validatePayload => {
        this.validateCashBackCard.emit(validatePayload);
      });

    dialogRef.componentInstance.resetCashBackPayment
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.resetCashBackPayment.emit();
      });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: CashBackPayment) => {
        if (res) {
          this.add.emit(res);
        }
        this.resetCashBackPayment.emit();
      });
  }

  checkPaymentAlreadyAdded(payment) {
    //to check if payment  already present
    const filteredPayment = this.paymentDetails.filter(x => {
      if (payment.mode === PaymentModeEnum.CREDIT_NOTE) {
        if (
          x.paymentCode === payment.mode &&
          x.instrumentNo === payment.payload.instrumentNo.toString() &&
          x.reference2 === payment.payload.fiscalYear.toString()
        ) {
          return x;
        }
      } else {
        if (
          x.paymentCode === payment.mode &&
          x.instrumentNo === payment.payload.instrumentNo.toString()
        ) {
          return x;
        }
      }
    });

    filteredPayment.length === 0
      ? this.add.emit(payment)
      : this.duplicatePayment.emit();
  }

  enableDigiGold(paymentCode) {
    if (this.allowedPayments.has(paymentCode)) {
      if (
        this.paymentDetails.filter(x => x.paymentCode === paymentCode).length >
        0
      ) {
        return 'Added';
      } else {
        return 'Not Added';
      }
    }

    return 'Not Enabled';
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
