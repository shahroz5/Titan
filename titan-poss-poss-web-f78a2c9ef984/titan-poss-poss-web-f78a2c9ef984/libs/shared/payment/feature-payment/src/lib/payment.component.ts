import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { TranslateService } from '@ngx-translate/core';
import { PaymentFacade } from '@poss-web/shared/payment/data-access-payment';
import { combineLatest, Observable } from 'rxjs';
import {
  PaymentModeEnum,
  PaymentDetails,
  EncirclePointsPayment,
  PaymentType,
  QCGCCardDetails,
  AllowedPayments,
  PaymentGroupEnum,
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  UniPayResponse,
  OverlayNotificationType,
  UniPayRequest,
  UnipayTransactionMode,
  UnipayTransactionType,
  UnipayTransationStatusEnum,
  TransactionTypeEnum,
  UniPaymentDetails,
  OtherDetailsForUnipay,
  QCGCGetBalancePayload,
  PaymentConfig,
  SubTransactionTypeEnum,
  EditCashDetails,
  PaymentStatusEnum,
  StoreUser,
  IntegratedPaymentRequestPayload,
  PaymentRequest,
  WorkflowTypeEnum,
  UnipayTransactionDetails,
  GiftCardTxnEnum,
  GHSeVoucherDetails,
  CNListResponse,
  CNListRequestPayload,
  GvStatusList,
  GiftVoucherStatusDropdownEnum,
  GiftVoucher,
  PaymentPayload,
  LocationSettingAttributesEnum,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  QCGC,
  GHSAccountDetails,
  GHSAttachments,
  SEARCH_BY_ENUM,
  CommomStateAttributeTypeEnum,
  CommomStateAttributeNameEnum,
  CreditNoteDetail,
  ViewTcsServiceAbstraction,
  DigiGetBalancePayload,
  DigiGoldDetails,
  GenerateOtpDigiGoldPayload,
  DiscountsResponse,
  DiscountTypeEnum,
  CashLimitDetails,
  MaxCashAmountDetails,
  ConfigTypeEnum,
  RuleTypesEnum,
  EnteredGHSDetails,
  EmployeeLoanConfigList,
  CashBackBankDetail,
  CashBackConfigDetail,
  StatusTypesEnum,
  OverlayNotificationEventType,
  FileUploadLists,
  UnipayTransationUrlEnum
} from '@poss-web/shared/models';
import {
  Component,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  PaymentEncirclePointsPopupComponent,
  PaymentUnipayCardRetryPopupComponent,
  PaymentOtpPopupComponent
} from '@poss-web/shared/payment/ui-payment';
import { Subject } from 'rxjs';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import { takeUntil, take, filter } from 'rxjs/operators';
import { ErrorEnums, ErrorTranslateKeyMap } from '@poss-web/shared/util-error';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import { CurrencyFormatterService } from '@poss-web/shared/components/ui-formatters';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import {
  PaymentGvStausPopupComponent,
  PaymentEghsPopupComponent,
  PaymentGhsEvoucherPopupComponent,
  PaymentUnipayLoaderComponent
} from '@poss-web/shared/payment/ui-payment';
import { DiscountFacade } from '@poss-web/poss/shared/discount/data-access-discount';
import * as moment from 'moment';

import { FilePreviewComponent } from '@poss-web/shared/components/ui-file-upload';
import { SharedBodEodFacade } from '@poss-web/shared/bod-eod/data-access-bod-eod';
import { ResetTcsPopupComponent } from '@poss-web/poss/shared/view-tcs/ui-view-tcs';
import { MatExpansionPanel } from '@angular/material/expansion';
// tslint:disable-next-line:nx-enforce-module-boundaries
import { CommonBaseComponent } from '@poss-web/shared/util-common';
import { POSS_WEB_TIME_TRACKING_LOG } from '@poss-web/shared/util-config';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
@Component({
  selector: 'poss-web-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent
  extends CommonBaseComponent
  implements OnInit, OnDestroy, OnChanges {
  airpayResponseData$: Subject<any> = new Subject<any>();
  razorpayResponseData$: Subject<any> = new Subject<any>();

  showPayment;
  isCnViewAllowed = false;
  isCnViewAlowedBC = false;
  isCNPartialRedeemAllowed: boolean;
  failedGV$: Subject<any> = new Subject<any>();
  addGvLoading$: Subject<any> = new Subject<any>();
  transactionDiscounts: DiscountsResponse[];
  isCustomerSelected = false;
  enteredGhSDetails: EnteredGHSDetails = null;
  encirclePoints = 0;
  ulpID: string;
  customerID: string;
  ghsTransactionId = null;
  ghsCustomerId = null;
  hostConfigPayment = [];
  isCashBackCardValidated$: Observable<any>;

  enableUnipay = false;
  payeeBanks: string[] = [];
  mutipleGVsearch = false;
  cnDetails$: Observable<any>;
  chequePayerBanks: string[] = [];
  ddPayerBanks: string[] = [];
  cardConfig: PaymentConfig;
  totalPaidAmount = 0;
  chequeValidityDays: number;
  ddValidityDays: number;
  noOfDaysForChequeOrDDAcceptance: number;
  allowedPayments: AllowedPayments = new Map<
    PaymentModeEnum,
    PaymentGroupEnum
  >();
  finalUnipayPayload: UniPayRequest;
  maxCashLimit = 0;
  maxCashLimitDeatils: CashLimitDetails;
  wallets: string[] = [];
  subBankLoans: string[] = [];
  paymentFieldNames: string[] = [];
  paymentDetails: PaymentDetails[] = [];
  paymentRequestTocheckValidate: PaymentRequest[] = [];
  isEncirclePaymentAdded = false;
  isRsoSelected = true;
  paymentDetails$: Observable<PaymentDetails[]>;
  empLoanDetails$: Observable<EmployeeLoanConfigList>;
  enableEncircle = false;
  QCGCDetails: QCGCCardDetails = null;
  digiBalanceDetails: DigiGoldDetails = null;
  digiSellingPrice: number;
  GVDetails: GvStatusList[] = [];
  status: string;
  GHSeVoucherQCGCDetails: GHSeVoucherDetails = null;
  GHSAccountDetails: GHSAccountDetails;
  customerSpecificPayments: PaymentModeEnum[] = [];
  customerSpecificWalletPayments: string[] = [];
  customerSpecificBankLoanPayments: string[] = [];
  isLoading = false;
  destroy$ = new Subject();
  paymentModeEnumRef = PaymentModeEnum;
  transactionID: string;
  transactionType: TransactionTypeEnum;
  subTransactionType: SubTransactionTypeEnum;
  transactionTotalAmount = 0;
  currencyCode: string;
  selectedCustomer: any;
  isAirpayIntegrationEnabled = false;
  isRazorpayIntegrationEnabled = false;
  isChequeAdded = false;
  isDDAdded = false;
  isCreditNoteAdded = false;
  isUlpAllowed = false;
  rsoList: StoreUser[] = [];
  isROApprovedByWorkflow = true;
  timeFormat: string;
  isPaymentEditable: boolean;
  roPaymentRequest$: Observable<PaymentRequest>;
  paymentRequest$: Subject<any> = new Subject<any>();
  minValue: number;
  creditNoteList$: Observable<CNListResponse>;
  locationCode: string;
  invokedCreditNote$: Observable<CNListResponse>;
  isfailedGVDialogOpen = false;
  thirdPartyCNList$: Observable<CNListResponse>;
  isLoading$: Observable<any>;
  isOtpAllowedForCm$: Observable<any>;
  isOtpAllowedForAb$: Observable<any>;
  isOtpAllowedForAdvance$: Observable<any>;
  isOtpGeneratedForCn$: Observable<any>;
  isOtpGeneratedForEmpLoan$: Observable<any>;
  isOtpGeneratedForDigi$: Observable<boolean>;
  isOtpForMinimunCn$: Observable<any>;
  cashBackOfferBankDetails$: Observable<CashBackBankDetail[]>;
  cashBackOfferConfigDetails$: Observable<CashBackConfigDetail>;
  isDigiPaymentComplete$: Observable<any>;
  pgDesc$: Observable<any>;
  listingPageEvent: CNListRequestPayload = {
    customerId: null,
    isPageable: false,
    locationCode: null
  };
  cnpriorityError: string;
  tcsAmountToBeCollected$: Observable<any>;

  disableFullPaymentCheck = false;
  hasCashPayment = true;
  cashAmountMaxCap: MaxCashAmountDetails;
  GHSAttachments: GHSAttachments[];
  isCustomerMandatoryForDigiGold: boolean;

  temp = false;
  defaultImageUrl = 'assets/img/product-default-image.svg';
  ghsAccounts = [];
  isGHSredemptionAllowed: boolean;
  isOtpRequiredForGHS: boolean;
  ghsCustomerSearch$: Observable<any>;
  customerChanged = false;
  ghsCount: number;
  tcsToBeCollectedAtCM: number;
  tcsCollectedAmount: any;
  startTimeofUnipay: number;
  endTimeofUnipay: number;
  totalTimeofUnipay: number;

  get totalAmountDue() {
    const amount = this.currencyFormatterService.format(
      this.transactionTotalAmount - this.totalPaidAmount,
      this.currencyCode,
      false
    );

    return !!amount ? +amount.replace(new RegExp(',', 'g'), '') : 0;
  }

  get displayCardPayment() {
    return !(
      this.enableUnipay && this.enablePayment(PaymentModeEnum.UNIPAY, false)
    );
  }

  businessDate: string;
  EGHSVoucherData$: Subject<any> = new Subject<any>();
  EGHS$: Subject<any> = new Subject<any>();
  ghsAddedAccounts$: Subject<any> = new Subject<any>();
  isOtpGeneratedForGhs$: Subject<any> = new Subject<any>();
  EGHSDocs$: Subject<any> = new Subject<any>();
  voidRetrypayload: PaymentDetails;
  currentFiscalYear: string;
  showRemainingAmount = true;
  @Input() setFocus: number;
  matBadgeNumber: number;
  @ViewChild(MatExpansionPanel) pannel?: MatExpansionPanel;
  setCashFocus = false;
  setCardFocus = false;
  setOtherPaymentFocus = false;
  transactionTypeRef = TransactionTypeEnum;
  badgeNumber = 6;
  subTransactionTypeEnumRef = SubTransactionTypeEnum;
  @Input() showPanelNumber = true;
  isUploadMandatoryforGHSWithoutOTP = false;
  isUploadMandatoryforThirdPartyCNWithoutOTP = false;
  photoIDProofUrl$: Observable<string>;
  fileUploadTxn: TransactionTypeEnum;
  permissions$: Observable<any[]>;
  resetUnipayCardValues$: Subject<boolean> = new Subject<boolean>();

  CASH_MEMO_ADD_EDIT_PAYMENT_SUBMENU =
    'Customer Transaction Status-Cashmemo Add/Edit Payment Submenu';
  AB_ADD_EDIT_PAYMENT_SUBMENU =
    'Customer Transaction Status-AB Add/Edit Payment Submenu';

  constructor(
    private dialog: MatDialog,
    public paymentFacade: PaymentFacade,
    public locationSettingsFacade: LocationSettingsFacade,
    private translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private customerFacade: CustomerFacade,
    private commonFacade: CommonFacade,
    private currencyFormatterService: CurrencyFormatterService,
    private appsettingFacade: AppsettingFacade,
    private authFacade: AuthFacade,
    private alertPopupService: AlertPopupServiceAbstraction,
    private bodEodFacade: SharedBodEodFacade,
    private discountFacade: DiscountFacade,
    private viewTcsService: ViewTcsServiceAbstraction,
    private permissionfacade: PermissionFacade,
    private elementPermission: ElementPermissionService,
    @Inject(POSS_WEB_TIME_TRACKING_LOG) public timeTrackingLog: boolean
  ) {
    super(timeTrackingLog);
  }

  ngOnInit(): void {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
    this.init();
    //TO change
    //create seperate for payment or load from payment data access
    this.commonFacade.loadABPgDesc();
    this.bodEodFacade.loadLatestBusinessDay();
    this.bodEodFacade
      .getFiscalYear()
      .pipe(takeUntil(this.destroy$))
      .subscribe((fiscalYear: number) => {
        if (fiscalYear) {
          this.currentFiscalYear = fiscalYear.toString();
        }
      });

    this.invokedCreditNote$ = this.paymentFacade.getInvokedCreditNote();

    this.fileUploadRes();
  }

  permission() {
    switch (this.transactionType) {
      case TransactionTypeEnum.CM: {
        this.loadPermission(this.CASH_MEMO_ADD_EDIT_PAYMENT_SUBMENU);
        break;
      }
      case TransactionTypeEnum.AB: {
        this.loadPermission(this.AB_ADD_EDIT_PAYMENT_SUBMENU);
        break;
      }
    }
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['setFocus']) {
      if (this.setFocus === this.badgeNumber) {
        this.pannel.open();
        if (this.enableCashPayment()) this.setCashFocus = true;
        else if (this.enableCardPayment()) this.setCardFocus = true;
        else if (this.enableOtherPayment()) this.setOtherPaymentFocus = true;
      } else {
        this.setCashFocus = false;
        this.setCardFocus = false;
        this.setOtherPaymentFocus = false;
      }
    }
  }

  loadCashBackOfferBankDetails(dataValue) {
    if (dataValue) {
      this.paymentFacade.loadCashBackOfferBankDetails();
    }
  }

  loadTransactionTotalAmount(amount: number) {
    this.transactionTotalAmount = amount ? amount : 0;
    this.loadMaxCashLimit();
  }

  loadTransactionID(transactionID: string) {
    if (transactionID) {
      if (this.transactionType === TransactionTypeEnum.CM) {
        this.commonFacade.loadCMGrfTolerance({
          ruleType: RuleTypesEnum.GRF_CONFIGURATION,
          ruleRequestList: {
            locationCode: this.locationCode
          }
        });
        this.commonFacade.loadCMGrnTolerance({
          ruleType: RuleTypesEnum.GRN_CONFIGURATION,
          ruleRequestList: {
            locationCode: this.locationCode
          }
        });
      } else if (this.transactionType === TransactionTypeEnum.AB) {
        this.commonFacade.loadABGrfTolerance({
          ruleType: RuleTypesEnum.GRF_CONFIGURATION,
          ruleRequestList: {
            locationCode: this.locationCode
          }
        });
        this.commonFacade.loadABGrnTolerance({
          ruleType: RuleTypesEnum.GRN_CONFIGURATION,
          ruleRequestList: {
            locationCode: this.locationCode
          }
        });
      }
      this.transactionID = transactionID;
      this.paymentFacade.loadPaymentDetails({
        transactionId: this.transactionID,
        transactionType: this.transactionType,
        subTransactionType: this.subTransactionType
      });
      this.loadMaxCashLimit();
    } else {
      this.transactionID = null;
      this.paymentFacade.clearPaymentDetails();
    }
  }

  init() {
    // this.commonFacade
    //   .getDisableFullPaymentCheck()
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.GLOBAL,
        CommomStateAttributeNameEnum.DISABLE_FULL_PAYMENT_CHECK
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(disable => {
        this.disableFullPaymentCheck = disable;
      });
    this.tcsAmountToBeCollected$ = this.commonFacade.getCommonFacadeAttributes(
      CommomStateAttributeTypeEnum.CASHMEMO,
      CommomStateAttributeNameEnum.TCS_TO_BE_COLLECTED
    );
    this.tcsAmountToBeCollected$
      .pipe(takeUntil(this.destroy$))
      .subscribe(tcsAmount => {
        this.tcsToBeCollectedAtCM = tcsAmount;
      });
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.ADVANCE_BOOKING,
        CommomStateAttributeNameEnum.STATUS
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.status = data;
        if (
          this.transactionType === TransactionTypeEnum.AB &&
          this.status &&
          this.status !== StatusTypesEnum.NEWCANCELLED
        ) {
          if (this.isCnViewAllowed) {
            this.loadCreditNoteDetails();
          }
          if (this.isCnViewAlowedBC) {
            this.loadCreditNoteDetails(TransactionTypeEnum.CMCAN);
          }
        }
      });

    this.authFacade
      .getLocationCode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.locationCode = data;
      });

    this.bodEodFacade
      .getBusinessDayDate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(businessDate => {
        this.businessDate = moment(businessDate).toISOString(true);
      });

    this.pgDesc$ = this.commonFacade.getCommonFacadeAttributes(
      CommomStateAttributeTypeEnum.ADVANCE_BOOKING,
      CommomStateAttributeNameEnum.PRODUCT_GROUP_DESC
    );

    // this.commonFacade
    //   .getTransactionConfig()
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.GLOBAL,
        CommomStateAttributeNameEnum.TRANSACTION_CONFIG
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(transactionConfig => {
        if (transactionConfig && !transactionConfig.transactionIDPresent) {
          this.paymentFacade.resetPayment();

          if (transactionConfig) {
            this.transactionType = transactionConfig.transactionType?.type;
            this.subTransactionType =
              transactionConfig.transactionType?.subType;
            this.isPaymentEditable = !!transactionConfig.isPaymentEditable;
            this.isCnViewAllowed = transactionConfig.isCnViewAllowed
              ? transactionConfig.isCnViewAllowed
              : false;

            this.isCnViewAlowedBC = transactionConfig.isCnViewAllowedBC
              ? transactionConfig.isCnViewAllowedBC
              : false;
            this.showPayment =
              transactionConfig.showPayment === false ? false : true;
            this.showRemainingAmount =
              transactionConfig.showRemainingAmount === false ? false : true;

            if (
              transactionConfig.transactionTotalAmount !== null &&
              transactionConfig.transactionTotalAmount !== undefined
            ) {
              this.loadTransactionTotalAmount(
                transactionConfig.transactionTotalAmount
              );
            }
            if (this.isPaymentEditable) {
              let transactionType = this.transactionType;
              if (
                this.transactionType === TransactionTypeEnum.ADV &&
                this.subTransactionType === SubTransactionTypeEnum.FROZEN_RATES
              ) {
                transactionType = TransactionTypeEnum.GRF;
              }
              this.paymentFacade.loadAllowedPayments(transactionType);
              this.paymentFacade.loadUnipayHostConfiguration();
            }
            if (
              transactionConfig.workflowData?.workflowType ===
                WorkflowTypeEnum.MANUAL_BILL ||
              transactionConfig.workflowData?.workflowType ===
                WorkflowTypeEnum.MANUAL_AB_BILL ||
              transactionConfig.workflowData?.workflowType ===
                WorkflowTypeEnum.MANUAL_BILL_GRF
            ) {
              this.paymentFacade.loadCMPaymentDetails({
                processId: transactionConfig.workflowData.processID,
                taskId: transactionConfig.workflowData.taskID,
                taskName: transactionConfig.workflowData.taskName,
                workFlowType: transactionConfig.workflowData.workflowType
              });
            } else {
              this.loadTransactionID(transactionConfig.transactionID);
            }
          } else {
            this.transactionType = null;
            this.subTransactionType = null;
            this.isPaymentEditable = null;
            this.transactionTotalAmount = 0;
          }
        }
      });

    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.FACTORY_BRAND_CODE)
      .pipe(takeUntil(this.destroy$))
      .subscribe(brandCode => {
        if (brandCode) {
          this.customerFacade.loadBrandDetails(brandCode);
        }
      });

    this.customerFacade
      .getBrandDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(brandDetail => {
        if (brandDetail) {
          this.isCustomerMandatoryForDigiGold =
            brandDetail?.configDetails?.data?.isCustomerMandatoryForDigiGold;
        }
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.ADVANCE_BOOKING,
        CommomStateAttributeNameEnum.MIN_AB_VALUE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: number) => {
        this.minValue = data;
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CUSTOMER_ORDER,
        CommomStateAttributeNameEnum.MIN_CO_VALUE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: number) => {
        this.minValue = data;
      });

    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.DIGIGOLD_IS_CN_PARTIAL_REDEMPTION_ALLOWED_FOR_DIGIGOLD
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(isPartialRedAllowed => {
        this.isCNPartialRedeemAllowed =
          isPartialRedAllowed === 'true' ? true : false;
      });
    this.discountFacade
      .getIsRsoSelected()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isSelected => {
        this.isRsoSelected = isSelected;
      });

    this.paymentFacade
      .getIsEncirclePaymentAddedRes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAdded => {
        if (isAdded) {
          this.showNotifications('pw.paymentEncircle.paymentAdded');
        }
      });

    this.cnDetails$ = this.paymentFacade.getCNDetails();
    this.isOtpGeneratedForCn$ = this.paymentFacade.getGeneratedOtpForCn();
    this.isOtpGeneratedForEmpLoan$ = this.paymentFacade.getGeneratedOtpForEmpLoan();
    this.isOtpGeneratedForDigi$ = this.paymentFacade.getGeneratedOtpForDigi();
    this.isDigiPaymentComplete$ = this.paymentFacade.getDigiGoldPayment();
    this.cashBackOfferBankDetails$ = this.paymentFacade.getCashBackOfferBankDetails();
    this.cashBackOfferConfigDetails$ = this.paymentFacade.getCashBackOfferConfigDetails();
    this.isCashBackCardValidated$ = this.paymentFacade.getIsValidateCashBackOfferCard();

    this.paymentFacade
      .getDigiGoldPayment()
      .pipe(takeUntil(this.destroy$))
      .subscribe((paymentDetails: PaymentDetails) => {
        if (paymentDetails) {
          this.addStopTrackingByPaymentCode(
            `${PaymentModeEnum.DIGI_GOLD_TANISHQ}/${PaymentModeEnum.DIGI_GOLD_NON_TANISHQ}`
          );
        }
      });

    // this.isGHSAddSuccess$=this.paymentFacade.getIsAddGhsPaymentSuccess()

    // this.commonFacade
    //   .getTransactionID()

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.GLOBAL,
        CommomStateAttributeNameEnum.TRANSACTION_ID
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(transactionID => {
        this.ghsTransactionId = transactionID;
        this.loadTransactionID(transactionID);
      });
    // this.commonFacade
    //   .getTransactionTotalAmount()
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.GLOBAL,
        CommomStateAttributeNameEnum.TRANSACTION_TOTAL_AMOUNT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(transactionTotalAmount => {
        this.loadTransactionTotalAmount(transactionTotalAmount);
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.BILL_CANCELLATION,
        CommomStateAttributeNameEnum.TCS_COLLECTED_AMOUNT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(tcsCollectedAmount => {
        this.tcsCollectedAmount = tcsCollectedAmount;
      });

    this.paymentFacade
      .getPaymentDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        paymentDetails => (
          (this.paymentDetails = paymentDetails),
          this.addStopTrackingByPaymentCode(
            paymentDetails.length !== 0
              ? paymentDetails[paymentDetails.length - 1].paymentCode
              : null
          ),
          console.log('paymentDetails:', this.paymentDetails)
        )
      );

    this.roPaymentRequest$ = this.paymentFacade.getRoPaymentRequest();
    this.paymentFacade
      .getPaymentRequest()
      .pipe(
        filter(() => this.isPaymentEditable),
        takeUntil(this.destroy$)
      )
      .subscribe(paymentRequest => {
        this.paymentRequest$.next(paymentRequest);
      });
    this.paymentDetails$ = this.paymentFacade.getPaymentDetails();

    this.paymentFacade
      .getRsoList()
      .pipe(
        filter(() => this.isPaymentEditable),
        takeUntil(this.destroy$)
      )
      .subscribe(rsoList => {
        this.rsoList = rsoList;
      });

    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.BASECURRENCY_CURRENCY_CODE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(currencyCode => {
        this.currencyCode = currencyCode;
      });

    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.GHS_IS_GHS_REDEMPTION_ALLOWED
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(isGHSredemptionAllowed => {
        this.isGHSredemptionAllowed =
          isGHSredemptionAllowed === 'true' ? true : false;
      });

    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.OTP_IS_OTP_REQUIRED_FOR_GHS_REDEMPTION
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(isOtpRequiredForGHS => {
        this.isOtpRequiredForGHS =
          isOtpRequiredForGHS === 'true' ? true : false;
      });

    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.GHS_ISUPLOAD_MANDATORY_FOR_GHS_WITHOUT_OTP
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(isUploadMandatoryforGHSWithoutOTP => {
        this.isUploadMandatoryforGHSWithoutOTP =
          isUploadMandatoryforGHSWithoutOTP === 'true' ? true : false;
      });

    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.CN_ISUPLOAD_MANDATORY_FOR_THIRDPARTY_CN_WITHOUT_OTP
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(isUploadMandatoryforThirdPartyCNWithoutOTP => {
        this.isUploadMandatoryforThirdPartyCNWithoutOTP =
          isUploadMandatoryforThirdPartyCNWithoutOTP === 'true' ? true : false;
      });

    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.GLOBAL_LOCATION_CODE)
      .pipe(
        filter(status => !!status),
        takeUntil(this.destroy$)
      )
      .subscribe(locationCode => {
        this.locationCode = locationCode;
      });

    this.paymentFacade
      .getEncirclePoints()
      .pipe(
        filter(() => this.isPaymentEditable),
        takeUntil(this.destroy$)
      )
      .subscribe(encirclePoints => (this.encirclePoints = encirclePoints));

    this.appsettingFacade
      .getTimeFormat()
      .pipe(takeUntil(this.destroy$))
      .subscribe(timeFormat => (this.timeFormat = timeFormat));

    this.customerFacade
      .getSelectSelectedCustomer()
      .pipe(
        filter(() => this.isPaymentEditable),
        takeUntil(this.destroy$)
      )
      .subscribe(customer => {
        if (customer) {
          this.isCustomerSelected = true;
          this.selectedCustomer = customer;
          this.ulpID = customer.ulpId;
          this.customerID = customer.customerId;
          if (this.ulpID) {
            this.paymentFacade.loadEncireclePoints(this.customerID);
          } else {
            this.encirclePoints = 0;
          }
          this.loadCreditNoteList(Number(this.customerID));
          this.loadMaxCashLimit();
          this.getIsOTPAllowedForCM();
          this.getIsOTPAllowedForAB();
          this.getIsOTPAllowedForAdvance();
          this.getIsOTPForMiniumCN();
        } else {
          this.isCustomerSelected = false;
          this.encirclePoints = 0;
          this.ulpID = null;
          this.maxCashLimit = 0;
          this.maxCashLimitDeatils = null;
          this.customerID = null;
          this.paymentFacade.resetCreditNoteList();
        }
      });

    this.creditNoteList$ = this.paymentFacade.getCreditNoteList();
    this.invokedCreditNote$ = this.paymentFacade.getInvokedCreditNote();
    this.thirdPartyCNList$ = this.paymentFacade.getThirdPartyCnList();
    this.empLoanDetails$ = this.paymentFacade.getEmpLoanDetails();

    this.isLoading$ = this.paymentFacade.getIsLoading();
    this.paymentFacade
      .getIsUnipayLoading()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isLoading => {
        if (isLoading) {
          this.dialog.open(PaymentUnipayLoaderComponent, {
            autoFocus: false,
            data: {},
            width: '850px',
            disableClose: true
          });
        } else {
          this.dialog.closeAll();
        }
      });

    this.paymentFacade
      .getIsLoading()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isLoading => {
        this.addGvLoading$.next(isLoading);
        this.isLoading = isLoading;
      });

    this.paymentFacade
      .getAllowedPayments()
      .pipe(
        filter(() => this.isPaymentEditable),
        takeUntil(this.destroy$)
      )
      .subscribe(allowedPayments => {
        this.allowedPayments = allowedPayments;
        this.loadMaxCashLimit();
      });
    this.paymentFacade
      .getUnipayTransactionID()
      .pipe(takeUntil(this.destroy$))
      .subscribe((transactionDetails: UnipayTransactionDetails) => {
        if (transactionDetails) {
          const unipayPayload: UniPayRequest = {
            txnType: UnipayTransactionType.SALE_PURCHASE,
            txnMode: UnipayTransactionMode.CR_DR,
            txnId: transactionDetails.id,
            txnAmount: transactionDetails.amount,
            date: this.businessDate,
            transactionType: this.transactionType,
            subTransactionType: this.subTransactionType
          };

          this.startUnipayEdcTrasaction(unipayPayload);
        }
      });
    this.paymentFacade
      .getUnipayResponse()
      .pipe(
        filter(() => this.isPaymentEditable),
        takeUntil(this.destroy$)
      )
      .subscribe((unipayResponse: OtherDetailsForUnipay) => {
        if (unipayResponse) {
          this.getUnipayResponse(this.finalUnipayPayload, unipayResponse);
        }
      });

    this.paymentFacade
      .failedGV()
      .pipe(
        filter(() => this.isPaymentEditable),
        takeUntil(this.destroy$)
      )
      .subscribe((failedPayemnt: PaymentPayload[]) => {
        if (failedPayemnt.length > 0) {
          this.retryfailedGV(failedPayemnt);
        }
      });
    this.paymentFacade
      .getDDPayerBanks()
      .pipe(
        filter(() => this.isPaymentEditable),
        takeUntil(this.destroy$)
      )
      .subscribe(payerBanks => {
        this.ddPayerBanks = payerBanks;
      });

    this.paymentFacade
      .getChequePayerBanks()
      .pipe(
        filter(() => this.isPaymentEditable),
        takeUntil(this.destroy$)
      )
      .subscribe(payerBanks => (this.chequePayerBanks = payerBanks));

    this.paymentFacade
      .getCardConfig()
      .pipe(
        filter(() => this.isPaymentEditable),
        takeUntil(this.destroy$)
      )
      .subscribe(
        config =>
          (this.cardConfig = {
            ...config,
            cardType: config.cardType.map(type => type.toUpperCase())
          })
      );

    this.paymentFacade
      .getPayeeBanks()
      .pipe(
        filter(() => this.isPaymentEditable),
        takeUntil(this.destroy$)
      )
      .subscribe(payeeBanks => (this.payeeBanks = payeeBanks));

    this.paymentFacade
      .getWallets()
      .pipe(
        filter(() => this.isPaymentEditable),
        takeUntil(this.destroy$)
      )
      .subscribe(wallets => (this.wallets = wallets));

    this.paymentFacade
      .getMaxCashLimit()
      .pipe(
        filter(() => this.isPaymentEditable),
        takeUntil(this.destroy$)
      )
      .subscribe(maxCashLimit => (this.maxCashLimit = maxCashLimit));

    this.paymentFacade
      .getMaxCashLimitDetails()
      .pipe(
        filter(() => this.isPaymentEditable),
        takeUntil(this.destroy$)
      )
      .subscribe(maxCashLimitDetails => {
        this.maxCashLimitDeatils = maxCashLimitDetails;
      });

    this.paymentFacade
      .getCashAmountMaxCap()
      .pipe(
        filter(() => this.isPaymentEditable),
        takeUntil(this.destroy$)
      )
      .subscribe(cashAmountMaxCap => {
        this.cashAmountMaxCap = cashAmountMaxCap;
      });

    this.paymentFacade
      .getSubBankLoans()
      .pipe(takeUntil(this.destroy$))
      .subscribe(subBankLoans => (this.subBankLoans = subBankLoans));

    this.paymentFacade
      .getPaymentFieldNames()
      .pipe(takeUntil(this.destroy$))
      .subscribe(paymentFieldNames => {
        this.paymentFieldNames = paymentFieldNames;
      });

    this.paymentFacade
      .getCustomerSpecificPayments()
      .pipe(
        filter(() => this.isPaymentEditable),
        takeUntil(this.destroy$)
      )
      .subscribe(
        customerSpecificPayments =>
          (this.customerSpecificPayments = customerSpecificPayments)
      );
    this.paymentFacade
      .getCustomerSpecificWalletPayments()
      .pipe(
        filter(() => this.isPaymentEditable),
        takeUntil(this.destroy$)
      )
      .subscribe(
        customerSpecificWalletPayments =>
          (this.customerSpecificWalletPayments = customerSpecificWalletPayments)
      );
    this.paymentFacade
      .getCustomerSpecificBankLoanPayments()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        customerSpecificBankLoanPayments =>
          (this.customerSpecificBankLoanPayments = customerSpecificBankLoanPayments)
      );

    this.paymentFacade
      .getQCGCBalanceDetails()
      .pipe(
        filter(() => this.isPaymentEditable),
        takeUntil(this.destroy$)
      )
      .subscribe(QCGCDetails => (this.QCGCDetails = QCGCDetails));
    this.paymentFacade
      .getDigiDetails()
      .pipe(
        filter(() => this.isPaymentEditable),
        takeUntil(this.destroy$)
      )
      .subscribe(
        DigiBalanceDetails => (this.digiBalanceDetails = DigiBalanceDetails)
      );

    this.paymentFacade
      .getDigiSellingPrice()
      .pipe(
        filter(() => this.isPaymentEditable),
        takeUntil(this.destroy$)
      )
      .subscribe(digiSellingPrice => {
        if (digiSellingPrice) {
          this.digiSellingPrice = digiSellingPrice.sellingPrice;
        } else {
          this.digiSellingPrice = 0;
        }
      });

    this.discountFacade
      .getAppliedTransactionLevelDiscounts()
      .pipe(takeUntil(this.destroy$))
      .subscribe((discounts: DiscountsResponse[]) => {
        this.transactionDiscounts = discounts.filter(
          x => x.discountType === DiscountTypeEnum.DIGI_GOLD_DISCOUNT
        );
      });

    this.paymentFacade
      .getGVBalanceDetails()
      .pipe(
        filter(() => this.isPaymentEditable),
        takeUntil(this.destroy$)
      )
      .subscribe(GVDetails => (this.GVDetails = GVDetails));

    this.paymentFacade
      .getGHSeVoucherBalanceDetails()
      .pipe(
        filter(() => this.isPaymentEditable),
        takeUntil(this.destroy$)
      )
      .subscribe(GHSeVoucherQCGCDetails => {
        this.GHSeVoucherQCGCDetails = GHSeVoucherQCGCDetails;
        this.EGHSVoucherData$.next(this.GHSeVoucherQCGCDetails);
      });
    this.paymentFacade
      .getGHSAccountDetails()
      .pipe(
        filter(() => this.isPaymentEditable),
        takeUntil(this.destroy$)
      )
      .subscribe(ghsDetails => {
        if (ghsDetails) {
          this.GHSAccountDetails = ghsDetails;
          this.ghsCustomerId = this.GHSAccountDetails.customerId;
          this.customerFacade.loadGhsCustomerDetails(
            SEARCH_BY_ENUM.MOBILE_NO,
            this.GHSAccountDetails.mobileNo
          );
          this.EGHS$.next(this.GHSAccountDetails);
          if (
            this.transactionType === TransactionTypeEnum.CM &&
            this.subTransactionType === SubTransactionTypeEnum.NEW_CM
          ) {
            this.commonFacade.SetCMGhsCustomerId(this.ghsCustomerId);
          } else if (
            this.transactionType === TransactionTypeEnum.AB &&
            this.subTransactionType === SubTransactionTypeEnum.NEW_AB
          ) {
            this.commonFacade.SetABGhsCustomerId(this.ghsCustomerId);
          }
        }
      });
    this.ghsCustomerSearch$ = this.customerFacade.getGhsCustomerDetails();
    this.paymentFacade
      .getGHSAttachments()
      .pipe(
        filter(() => this.isPaymentEditable),
        takeUntil(this.destroy$)
      )
      .subscribe(GHSdocs => {
        this.GHSAttachments = GHSdocs;
        this.EGHSDocs$.next(this.GHSAttachments);
      });

    this.paymentFacade
      .getIsEncirclePaymentAdded()
      .pipe(
        filter(() => this.isPaymentEditable),
        takeUntil(this.destroy$)
      )
      .subscribe(
        isEncirclePaymentAdded =>
          (this.isEncirclePaymentAdded = isEncirclePaymentAdded)
      );

    this.paymentFacade
      .getIsChequeAdded()
      .pipe(
        filter(() => this.isPaymentEditable),
        takeUntil(this.destroy$)
      )
      .subscribe(isChequeAdded => (this.isChequeAdded = isChequeAdded));

    this.paymentFacade
      .getIsDDAdded()
      .pipe(
        filter(() => this.isPaymentEditable),
        takeUntil(this.destroy$)
      )
      .subscribe(isDDAdded => (this.isDDAdded = isDDAdded));

    this.paymentFacade
      .getIsCreditNoteAdded()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        isCreditNoteAdded => (this.isCreditNoteAdded = isCreditNoteAdded)
      );

    this.paymentFacade
      .getTotalPaidAmount()
      .pipe(takeUntil(this.destroy$))
      .subscribe(totalPaidAmount => (this.totalPaidAmount = totalPaidAmount));

    // this.paymentFacade
    //   .getCreditNoteDetail()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((creditNoteDetail: CreditNoteDetail) => {
    //     console.log('creditNoteDetail :', creditNoteDetail);
    //     if (creditNoteDetail) {

    //     }
    //   });

    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.PAYMENT_CHEQUE_VALIDITY_DAYS
      )
      .pipe(
        filter(data => !!data && this.isPaymentEditable),
        takeUntil(this.destroy$)
      )
      .subscribe(
        chequeValidityDays =>
          (this.chequeValidityDays = Number(chequeValidityDays))
      );

    // this.locationSettingsFacade
    //   .getChequeValidityDays()
    //   .pipe(
    //     filter(data => !!data && this.isPaymentEditable),
    //     takeUntil(this.destroy$)
    //   )
    //   .subscribe(
    //     chequeValidityDays =>
    //       (this.chequeValidityDays = Number(chequeValidityDays))
    //   );

    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.PAYMENT_RTGS_NO_OF_DAYS_FOR_CHEQUE_OR_DD_ACCEPTANCE
      )
      .pipe(
        filter(data => !!data && this.isPaymentEditable),
        takeUntil(this.destroy$)
      )
      .subscribe(
        noOfDaysForChequeOrDDAcceptance =>
          (this.noOfDaysForChequeOrDDAcceptance = Number(
            noOfDaysForChequeOrDDAcceptance
          ))
      );

    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.PAYMENT_IS_MULTIPLE_GV_ALLOWED
      )
      .pipe(
        filter(data => !!data && this.isPaymentEditable),
        takeUntil(this.destroy$)
      )
      .subscribe(mutipleGVsearch => {
        if (!!mutipleGVsearch) {
          return (this.mutipleGVsearch = JSON.parse(mutipleGVsearch));
        }
      });
    this.paymentFacade
      .getDeletedPayment()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: PaymentDetails) => {
        if (res && res?.showPopup !== false) {
          let errMsg = '';
          this.translate
            .get(
              !res?.otherDetails?.data?.creditNoteNo
                ? 'pw.payment.PaymentDeletedMsg'
                : 'pw.payment.paymentDeletedWithCreditNoteMsg',
              { number: res?.otherDetails?.data?.creditNoteNo }
            )
            .pipe(take(1))
            .subscribe(msg => (errMsg = msg));

          this.alertPopupService.open({
            type: AlertPopupTypeEnum.INFO,
            message: errMsg
          });
        }
      });
    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.PAYMENT_RTGS_IS_RO_APPROVED_BY_WORKFLOW
      )
      .pipe(
        filter(() => this.isPaymentEditable),
        takeUntil(this.destroy$)
      )
      .subscribe(isROApprovedByWorkflow => {
        if (!!isROApprovedByWorkflow) {
          return (this.isROApprovedByWorkflow = JSON.parse(
            isROApprovedByWorkflow
          ));
        }
      });

    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.PAYMENT_IS_ULP_ALLOWED)
      .pipe(
        filter(() => this.isPaymentEditable),
        takeUntil(this.destroy$)
      )
      .subscribe(isUlpAllowed => {
        if (!!isUlpAllowed) {
          this.isUlpAllowed = JSON.parse(isUlpAllowed);
        }
      });

    this.paymentFacade
      .getCurrentConfirmedPayment()
      .pipe(
        filter(() => this.isPaymentEditable),
        takeUntil(this.destroy$)
      )
      .subscribe((payment: PaymentDetails) => {
        if (payment) {
          if (
            payment.status === PaymentStatusEnum.FAILED ||
            payment.status === PaymentStatusEnum.OPEN
          ) {
            if (
              payment.paymentCode === this.paymentModeEnumRef.AIRPAY &&
              payment.status === PaymentStatusEnum.OPEN
            ) {
              const key = 'pw.paymentDetails.paymentErrorAirpayMessage';
              this.translate
                .get(key)
                .pipe(takeUntil(this.destroy$))
                .subscribe((translatedMessage: string) => {
                  this.errorNotifications(translatedMessage);
                });
            } else if (payment.paymentCode === this.paymentModeEnumRef.QCGC) {
              const key = 'pw.paymentDetails.paymentFailedMessage';
              this.translate
                .get(key)
                .pipe(takeUntil(this.destroy$))
                .subscribe((translatedMessage: string) => {
                  const msg =
                    translatedMessage.replace(
                      '{0}',
                      payment.paymentCode.toString()
                    ) + payment.instrumentNo;

                  this.errorNotifications(msg);
                });
            }
          }
          if (
            payment.paymentCode === PaymentModeEnum.ENCIRCLE &&
            payment.status === PaymentStatusEnum.INPROGRESS
          ) {
            this.openEncircleOTP(payment);
          }
          if (
            payment.paymentCode === this.paymentModeEnumRef.AIRPAY &&
            payment.status === PaymentStatusEnum.INPROGRESS
          ) {
            const key = 'pw.paymentDetails.paymentErrorAirpayMessage';
            this.translate
              .get(key)
              .pipe(takeUntil(this.destroy$))
              .subscribe((translatedMessage: string) => {
                this.errorNotifications(translatedMessage);
              });
          }
          if (
            payment.paymentCode === this.paymentModeEnumRef.RAZOR_PAY &&
            (payment.status === PaymentStatusEnum.INPROGRESS ||
              payment.status === PaymentStatusEnum.OPEN)
          ) {
            const key = 'pw.paymentDetails.paymentErrorRazorpayMessage';
            this.translate
              .get(key)
              .pipe(takeUntil(this.destroy$))
              .subscribe((translatedMessage: string) => {
                this.errorNotifications(translatedMessage);
              });
          }
        }
      });

    this.paymentFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          if (error.code === ErrorEnums.ERR_SALE_030) {
            this.translate
              .get(ErrorTranslateKeyMap.get(ErrorEnums.ERR_SALE_030))
              .pipe(take(1))
              .subscribe(msg => {
                this.alertPopupService.open({
                  type: AlertPopupTypeEnum.ERROR,
                  message: msg
                });
              });
          } else {
            if (error.code !== ErrorEnums.ERR_SALE_008)
              this.errorHandler(error);
          }
        }
      });

    this.paymentFacade
      .getLoadMaxCashLimit()
      .pipe(
        filter(() => this.isPaymentEditable),
        takeUntil(this.destroy$)
      )
      .subscribe((data: any) => {
        if (data && data.load) {
          this.loadMaxCashLimit();
        }
      });

    // this.paymentFacade
    //   .getIsChequeDDPaymentSuccess()
    //   .pipe(
    //     filter(() => this.isPaymentEditable),
    //     takeUntil(this.destroy$)
    //   )
    //   .subscribe(data => {
    //     if (data) {
    //       this.alertPopupService.open({
    //         type: AlertPopupTypeEnum.INFO,
    //         message: 'pw.paymentModeChequeDD.paymentSuccessMsg'
    //       });
    //     }
    //   });

    this.paymentFacade
      .getGhsResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.ghsAddedAccounts$.next(data);
        }
      });
    this.paymentFacade
      .getGeneratedOtpForCn()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.isOtpGeneratedForGhs$.next(data);
        }
      });
    this.paymentFacade
      .getGHSAccountsAdded()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) this.ghsCount = data;
      });
    this.paymentFacade
      .getIntegratedPaymentRequestStatus()
      .pipe(
        filter(() => this.isPaymentEditable),
        takeUntil(this.destroy$)
      )
      .subscribe(data => {
        if (data) {
          if (data.isSuccess) {
            this.translate
              .get('pw.roPayment.sendRequestSuccessMessage')
              .pipe(take(1))
              .subscribe((translatedMessage: string) => {
                this.alertPopupService.open({
                  type: AlertPopupTypeEnum.INFO,
                  message: translatedMessage + data.transactionId
                });
              });
          } else {
            this.alertPopupService.open({
              type: AlertPopupTypeEnum.ERROR,
              message: 'pw.roPayment.sendRequestErrorMessage'
            });
            // this.translate
            //   .get('pw.roPayment.sendRequestErrorMessage')
            //   .pipe(take(1))
            //   .subscribe((translatedMessage: string) => {
            //     this.dialog.open(ErrorPopupComponent, {
            //       data: {
            //         message: translatedMessage
            //       }
            //     });
            //   });
          }
        }
      });

    this.paymentFacade
      .getAirpaySendLinkResponse()
      .pipe(
        filter(() => this.isPaymentEditable),
        takeUntil(this.destroy$)
      )
      .subscribe(data => {
        if (data && data.length > 0) {
          this.airpayResponseData$.next(data);
        }
      });
    this.paymentFacade
      .getRazorpaySendLinkResponse()
      .pipe(
        filter(() => this.isPaymentEditable),
        takeUntil(this.destroy$)
      )
      .subscribe(data => {
        if (data && data.length > 0) {
          this.razorpayResponseData$.next(data);
        }
      });

    // TODO : Razor pay check to be offine mode is introduced
    combineLatest([
      this.paymentFacade.getIsHostConfigEnabled(),
      this.locationSettingsFacade.getLocationSetting(
        LocationSettingAttributesEnum.PAYMENT_RTGS_IS_ENABLE_UNIPAY_FOR_INTEGRATION
      ),
      this.locationSettingsFacade.getLocationSetting(
        LocationSettingAttributesEnum.PAYMENT_RTGS_IS_ENABLE_AIRPAY_FOR_INTEGRATION
      ),
      this.locationSettingsFacade.getLocationSetting(
        LocationSettingAttributesEnum.PAYMENT_IS_ENABLED_RAZORPAY_FOR_INTEGRATION
      )
    ])
      .pipe(
        filter(() => this.isPaymentEditable),
        takeUntil(this.destroy$)
      )
      .subscribe(
        ([
          mappedPayment,
          locationCheckUnipay,
          locationCheckAirpay,
          locationCheckRazorpay
        ]) => {
          if (!!locationCheckUnipay) {
            this.enableUnipay =
              this.checkIfHostIsMapped(mappedPayment, PaymentModeEnum.UNIPAY) &&
              JSON.parse(locationCheckUnipay);
          }

          if (!!locationCheckAirpay) {
            this.isAirpayIntegrationEnabled =
              this.checkIfHostIsMapped(mappedPayment, PaymentModeEnum.AIRPAY) &&
              JSON.parse(locationCheckAirpay);
          }

          if (!!locationCheckRazorpay) {
            this.isRazorpayIntegrationEnabled =
              this.checkIfHostIsMapped(
                mappedPayment,
                PaymentModeEnum.RAZOR_PAY
              ) && JSON.parse(locationCheckRazorpay);
          }
        }
      );

    this.paymentFacade
      .getUnipayVoidResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          console.log('getUnipayVoidResponse:', data);
        }
      });

    this.paymentFacade
      .getPaymentRequest()
      .pipe(
        filter(() => this.isPaymentEditable),
        takeUntil(this.destroy$)
      )
      .subscribe(paymentRequest => {
        this.paymentRequestTocheckValidate = paymentRequest;
        this.paymentRequest$.next(paymentRequest);
      });

    this.paymentFacade
      .getIsValidateRazorPay()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (
          data &&
          this.paymentRequestTocheckValidate.length > 0 &&
          this.paymentRequestTocheckValidate[0].paymentCode === 'RAZOR PAY' &&
          this.paymentRequestTocheckValidate[0].status === 'OPEN'
        ) {
          this.alertPopupService.open({
            type: AlertPopupTypeEnum.INFO,
            message: 'This Transaction is pending or not paid by the customer.'
          });
        }
      });

    this.paymentFacade
      .getIsResendLinkRazorPaySuccess()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.alertPopupService.open({
            type: AlertPopupTypeEnum.INFO,
            message: 'Resend link sent sucessfully.'
          });
        }
      });
  }

  fileUploadRes() {
    this.paymentFacade
      .getFileUploadRes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: boolean) => {
        if (data && this.fileUploadTxn) {
          this.paymentFacade.loadFileUploadList({
            txnType: this.fileUploadTxn,
            id: this.transactionID,
            customerId: Number(this.customerID)
          });
          this.fileUploadTxn = null;
        }
      });

    this.paymentFacade
      .getFileUploadListRes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: FileUploadLists[]) => {
        if (data.length !== 0)
          this.paymentFacade.loadFileDownloadUrl({
            id: data[data.length - 1].id,
            locationCode: null
          });
      });

    this.photoIDProofUrl$ = this.paymentFacade.getFileDownloadUrl();
  }

  getCashBackOfferConfigDetails(offerId) {
    if (offerId) {
      this.paymentFacade.loadCashBackOfferConfigDetails(offerId);
    }
  }

  resetCashBackPayment() {
    this.paymentFacade.resetCashBackPayment();
  }

  validateCashBackCard(validatePayload) {
    if (validatePayload) {
      this.paymentFacade.validateCashBackOfferCard(validatePayload);
    }
  }

  checkIfHostIsMapped(
    hostConfigPayment: string[],
    payemntMode: PaymentModeEnum
  ) {
    if (hostConfigPayment.indexOf(payemntMode) > -1) {
      return true;
    } else {
      return false;
    }
  }
  openGHSEVoucherPayment() {
    if (this.enableGHSeVoucherPayment() && this.checkRso()) {
      const dialogRef = this.dialog.open(PaymentGhsEvoucherPopupComponent, {
        autoFocus: false,
        data: {
          EGHSVoucherData$: this.EGHSVoucherData$,
          paymentMode: PaymentModeEnum.GHS_EVOUCHER,
          paymentGroup: this.getPaymetGroup(PaymentModeEnum.GHS_EVOUCHER),
          currencyCode: this.currencyCode,
          totalAmountDue: this.totalAmountDue,
          businessDate: this.businessDate
        },
        width: '850px',
        disableClose: true
      });
      dialogRef.componentInstance.getGHSeVoucherBalance
        .pipe(takeUntil(this.destroy$))
        .subscribe(CardNumber => {
          this.getGHSeVoucherBalance(CardNumber);
        });
      dialogRef.componentInstance.getQCGCBalance
        .pipe(takeUntil(this.destroy$))
        .subscribe(CardNumber => {
          this.getQCGCBalance({
            cardNumber: CardNumber,
            otpRequired: true
          });
        });
      dialogRef.componentInstance.resetGHSeVoucher
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.resetGHSeVoucher();
        });

      dialogRef
        .afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: QCGC) => {
          if (res) {
            // this.checkPaymentAlreadyAdded(res);
            this.addPayment(res);
          }
        });
    }
  }

  checkPaymentAlreadyAdded(payment) {
    //to check if payment  already present
    const filteredPayment = this.paymentDetails.filter(x => {
      if (
        x.paymentCode === payment.mode &&
        x.instrumentNo === payment.payload.instrumentNo.toString()
      ) {
        return x;
      }
    });

    filteredPayment.length === 0
      ? this.addPayment(payment)
      : this.duplicatePayment();
  }

  openEGHSPayment() {
    this.resetUploadedFileData();
    if (this.enableEGHSPayment() && this.checkRso()) {
      const dialogRef = this.dialog.open(PaymentEghsPopupComponent, {
        autoFocus: false,
        width: '950px',
        disableClose: true,
        data: {
          EGHS$: this.EGHS$,
          accDetails: this.GHSAccountDetails,
          tempDocs: this.GHSAttachments,
          temp: this.temp,
          enteredGHSDetails: this.enteredGhSDetails,
          paymentMode: PaymentModeEnum.GHS_ACCOUNT,
          paymentGroup: this.getPaymetGroup(PaymentModeEnum.GHS_ACCOUNT),
          currencyCode: this.currencyCode,
          businessDate: this.businessDate,
          totalAmountDue: this.totalAmountDue,
          attachments$: this.EGHSDocs$,
          ghsCustomerSearch$: this.ghsCustomerSearch$,
          paymentsAdded$: this.ghsAddedAccounts$,
          isOtpGenerated$: this.isOtpGeneratedForGhs$,
          isOtpRequired: this.isOtpRequiredForGHS,
          isGhsAllowed: this.isGHSredemptionAllowed,
          locationCode: this.locationCode,
          prevCustId: this.customerID,
          isUploadMandatoryforGHSWithoutOTP: this
            .isUploadMandatoryforGHSWithoutOTP
        }
      });

      dialogRef.componentInstance.getGHSDetails
        .pipe(takeUntil(this.destroy$))
        .subscribe(CardNumber => {
          this.getGHSAccountDetails(CardNumber);
          // this.getGHSDetails.emit(CardNumber);
        });
      dialogRef.componentInstance.generateGhsOtp
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
          if (data) {
            this.generateOTPForCn(data);
          }
        });
      dialogRef.componentInstance.getAttachments
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
          this.getGHSAttachments(data);
          // this.getAttachments.emit(data);
        });

      dialogRef.componentInstance.checkclick
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: EnteredGHSDetails) => {
          if (data.imageUrl) {
            this.enteredGhSDetails = data;
            this.openFilePreviewPopup(data.imageUrl);
          }
        });
      dialogRef.componentInstance.addGHS
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
          if (data) {
            this.addPayment(data);
          }
        });
      dialogRef.componentInstance.emitCustomerIds
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
          if (data && data.oldCustId !== this.customerID) {
            this.customerChanged = true;
          } else this.customerChanged = false;
          // this.getGHSAttachments(data);
          // this.getAttachments.emit(data);
        });
      dialogRef.componentInstance.uploadPhotoIDProof
        .pipe(takeUntil(this.destroy$))
        .subscribe(photoIDProof => {
          this.fileUploadTxn = TransactionTypeEnum.GHS_REDEMPTION;
          this.paymentFacade.loadFileUpload({
            file: photoIDProof,
            txnType: TransactionTypeEnum.GHS_REDEMPTION,
            id: this.transactionID,
            customerId: Number(this.customerID)
          });
        });
      dialogRef.componentInstance.photoIDProofUrl$ = this.photoIDProofUrl$;

      dialogRef
        .afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe(data => {
          this.temp = false;
          if (this.customerChanged) {
            // if (data && data.oldCustId !== data.ghsCustId) {
            this.alertPopupService.open({
              type: AlertPopupTypeEnum.INFO,
              message: 'Customer changed to GHS Customer'
            });
          }
          //  this.enteredGhSDetails=null
          this.paymentFacade.resetGHSeVoucher();
        });
    }
  }
  openFilePreviewPopup(url) {
    const ref = this.dialog.open(FilePreviewComponent, {
      height: '525px',
      width: '700px',
      autoFocus: false,
      data: {
        defaultImageUrl: this.defaultImageUrl,
        imageUrl: url
      }
    });
    ref
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.temp = true;
          this.openEGHSPayment();
        }
      });
  }

  // loadAirpayOpenPayments() {
  //   this.paymentFacade.loadAirpayOpenPayments({
  //     transactionId: this.transactionID,
  //     transactionType: this.transactionType,
  //     subTransactionType: this.subTransactionType
  //   });
  // }

  startAirpayIntPayment(paymentDetails) {
    this.paymentFacade.startAirpayIntPayment({
      transactionType: this.transactionType,
      subTransactionType: this.subTransactionType,
      transactionId: this.transactionID,
      paymentDetails: paymentDetails
    });
  }

  updatePaymentRequest(paymentDetails) {
    this.paymentFacade.updateintegratedPaymentRequest(paymentDetails.id);
  }

  validateIntegratedPaymentRequest(paymentId) {
    this.paymentFacade.validateIntegratedPaymentRequest(paymentId);
  }

  updateAirpayPaymentStatus(data) {
    this.paymentFacade.updateAirpayPaymentStatus(data.paymentDetails);
  }

  // loadRazorpayOpenPayments() {
  //   this.paymentFacade.loadRazorOpenPayments({
  //     transactionId: this.transactionID,
  //     transactionType: this.transactionType,
  //     subTransactionType: this.subTransactionType
  //   });
  // }

  startRazorpayPayment(paymentDetails) {
    this.addStartTrackingByPaymentCode(PaymentModeEnum.RAZOR_PAY);
    this.paymentFacade.startRazorpayPayment({
      transactionType: this.transactionType,
      subTransactionType: this.subTransactionType,
      transactionId: this.transactionID,
      paymentDetails: paymentDetails
    });
  }

  updateRazorpayPayment(paymentDetails) {
    this.paymentFacade.updateRazorpayPayment({
      transactionType: this.transactionType,
      subTransactionType: this.subTransactionType,
      paymentDetails: {
        paymentId: paymentDetails.id,
        details: paymentDetails.details
      },
      status: PaymentStatusEnum.OPEN
    });
  }

  validateRazorpayPayment(paymentId) {
    this.paymentFacade.validateRazorpayPayment({
      transactionType: this.transactionType,
      subTransactionType: this.subTransactionType,
      paymentId: paymentId
    });
  }

  updateRazorpayPaymentStatus(data) {
    this.paymentFacade.updateRazorpayPaymentStatus(data.paymentDetails);
  }

  loadMaxCashLimit() {
    if (
      this.isPaymentEditable &&
      this.transactionID &&
      this.customerID &&
      this.allowedPayments.has(PaymentModeEnum.CASH) &&
      this.transactionTotalAmount !== 0
    ) {
      this.paymentFacade.loadMaxCashLimit({
        transactionType: this.transactionType,
        subTransactionType: this.subTransactionType,
        customerId: this.customerID,
        transactionId: this.transactionID,
        paymentCode: PaymentModeEnum.CASH,
        paymentGroup: this.getPaymetGroup(PaymentModeEnum.CASH)
      });
    } else {
      this.maxCashLimit = 0;
      this.maxCashLimitDeatils = null;
    }
  }

  loadDigiGoldSellingPrice() {
    this.addStartTrackingByPaymentCode(
      `${PaymentModeEnum.DIGI_GOLD_TANISHQ}/${PaymentModeEnum.DIGI_GOLD_NON_TANISHQ}`
    );
    this.paymentFacade.getDigiPrice({
      mobileNo: this.selectedCustomer.mobileNo,
      transactionId: this.transactionID
    });
  }

  sendPaymentRequest(data: IntegratedPaymentRequestPayload) {
    this.paymentFacade.sendIntegratedPaymentRequest(data);
  }

  loadPaymentRequestStatus(value: PaymentModeEnum) {
    // value === PaymentModeEnum.RO_PAYMENT
    //   ? this.paymentFacade.loadROPaymentRequestStatus(this.customerID)
    this.paymentFacade.loadPaymentRequestStatus(this.customerID, value);
  }

  loadCreditNoteList(customerId: number) {
    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.GLOBAL_LOCATION_CODE)
      .pipe(
        filter(status => !!status),
        take(1)
      )
      .subscribe(locationCode => {
        this.locationCode = locationCode;
        if (customerId) {
          const paginationPayload = {
            customerId: customerId,
            isPageable: this.listingPageEvent.isPageable,
            locationCode: this.locationCode,
            isFrozenRateCnRequired: false,
            status: 'OPEN'
          };

          this.paymentFacade.loadCreditNoteList(paginationPayload);
        }
      });
  }

  getIsOTPAllowedForCM() {
    this.isOtpAllowedForCm$ = this.locationSettingsFacade.getLocationSetting(
      LocationSettingAttributesEnum.OTP_IS_OTP_ALLOWED_CM
    );
  }

  getIsOTPForMiniumCN() {
    this.isOtpForMinimunCn$ = this.locationSettingsFacade.getLocationSetting(
      LocationSettingAttributesEnum.CN_OTP_FOR_MIN_CN
    );
  }

  getIsOTPAllowedForAB() {
    this.isOtpAllowedForAb$ = this.locationSettingsFacade.getLocationSetting(
      LocationSettingAttributesEnum.OTP_IS_OTP_ALLOWED_AB
    );
  }

  getIsOTPAllowedForAdvance() {
    this.isOtpAllowedForAdvance$ = this.locationSettingsFacade.getLocationSetting(
      LocationSettingAttributesEnum.OTP_IS_OTP_ALLOWED_ADVANCE
    );
  }

  loadCreditNoteDetails(type?: TransactionTypeEnum) {
    if (this.transactionID) {
      this.paymentFacade.loadCreditNoteDetails({
        transactionId: this.transactionID,
        transactionType: type === TransactionTypeEnum.CMCAN ? type : null
      });
    }
  }
  getInvokedCN(invokeCNRequestPaylaod) {
    invokeCNRequestPaylaod.locationCode = this.locationCode;
    this.paymentFacade.loadInvokedCreditNote(invokeCNRequestPaylaod);
  }

  getThirdPartyCN(thirdpartyCNPayload) {
    thirdpartyCNPayload.locationCode = this.locationCode;
    this.paymentFacade.loadThirdPartyCnList(thirdpartyCNPayload);
  }

  addPayment(paymentDetails: PaymentType) {
    this.resetUploadedFileData();
    if (this.transactionID && this.checkRso()) {
      switch (paymentDetails.mode) {
        case PaymentModeEnum.CASH: {
          this.addStartTrackingByPaymentCode(PaymentModeEnum.CASH);
          if (
            this.tcsToBeCollectedAtCM !== 0 &&
            this.tcsToBeCollectedAtCM !== null &&
            this.tcsToBeCollectedAtCM !== undefined
          ) {
            this.paymentFacade.addCashPayment({
              transactionType: this.transactionType,
              subTransactionType: this.subTransactionType,
              transactionId: this.transactionID,
              paymentDetails: paymentDetails,
              isTcsPayment: true
            });
          } else {
            this.paymentFacade.addCashPayment({
              transactionType: this.transactionType,
              subTransactionType: this.subTransactionType,
              transactionId: this.transactionID,
              paymentDetails: paymentDetails
            });
          }

          break;
        }
        case PaymentModeEnum.CARD: {
          this.addStartTrackingByPaymentCode(PaymentModeEnum.CARD);
          if (
            this.tcsToBeCollectedAtCM !== 0 &&
            this.tcsToBeCollectedAtCM !== null &&
            this.tcsToBeCollectedAtCM !== undefined
          ) {
            this.paymentFacade.addCardPayment({
              transactionType: this.transactionType,
              subTransactionType: this.subTransactionType,
              transactionId: this.transactionID,
              paymentDetails: paymentDetails,
              isTcsPayment: true
            });
          } else {
            this.paymentFacade.addCardPayment({
              transactionType: this.transactionType,
              subTransactionType: this.subTransactionType,
              transactionId: this.transactionID,
              paymentDetails: paymentDetails
            });
          }
          break;
        }
        case PaymentModeEnum.CASH_BACK: {
          this.addStartTrackingByPaymentCode(PaymentModeEnum.CASH_BACK);
          if (
            this.tcsToBeCollectedAtCM !== 0 &&
            this.tcsToBeCollectedAtCM !== null &&
            this.tcsToBeCollectedAtCM !== undefined
          ) {
            this.paymentFacade.addCardPayment({
              transactionType: this.transactionType,
              subTransactionType: this.subTransactionType,
              transactionId: this.transactionID,
              paymentDetails: paymentDetails,
              isTcsPayment: true
            });
          } else {
            this.paymentFacade.addCardPayment({
              transactionType: this.transactionType,
              subTransactionType: this.subTransactionType,
              transactionId: this.transactionID,
              paymentDetails: paymentDetails
            });
          }
          break;
        }
        case PaymentModeEnum.CHEQUE: {
          this.addStartTrackingByPaymentCode(PaymentModeEnum.CHEQUE);
          const duplicate = this.paymentDetails.filter(payment => {
            if (
              payment.bankName === paymentDetails.payload.bankName &&
              payment.instrumentNo === paymentDetails.payload.instrumentNo &&
              payment.paymentCode === PaymentModeEnum.CHEQUE
            ) {
              return payment;
            }
          });
          if (
            this.tcsToBeCollectedAtCM !== 0 &&
            this.tcsToBeCollectedAtCM !== null &&
            this.tcsToBeCollectedAtCM !== undefined
          ) {
            duplicate.length === 0
              ? this.paymentFacade.addChequeDDPayment({
                  transactionType: this.transactionType,
                  subTransactionType: this.subTransactionType,
                  transactionId: this.transactionID,
                  paymentDetails: paymentDetails,
                  isTcsPayment: true
                })
              : this.duplicatePayment();
          } else {
            duplicate.length === 0
              ? this.paymentFacade.addChequeDDPayment({
                  transactionType: this.transactionType,
                  subTransactionType: this.subTransactionType,
                  transactionId: this.transactionID,
                  paymentDetails: paymentDetails
                })
              : this.duplicatePayment();
          }
          // this.paymentFacade.addChequeDDPayment({
          //   transactionType: this.transactionType,
          //   subTransactionType: this.subTransactionType,
          //   transactionId: this.transactionID,
          //   paymentDetails: paymentDetails
          // });

          break;
        }
        // TODO : Separate Actions for cheque and DD
        case PaymentModeEnum.DD: {
          this.addStartTrackingByPaymentCode(PaymentModeEnum.DD);
          const duplicate = this.paymentDetails.filter(payment => {
            if (
              payment.bankName === paymentDetails.payload.bankName &&
              payment.instrumentNo === paymentDetails.payload.instrumentNo &&
              payment.paymentCode === PaymentModeEnum.DD
            ) {
              return payment;
            }
          });
          if (
            this.tcsToBeCollectedAtCM !== 0 &&
            this.tcsToBeCollectedAtCM !== null &&
            this.tcsToBeCollectedAtCM !== undefined
          ) {
            duplicate.length === 0
              ? this.paymentFacade.addChequeDDPayment({
                  transactionType: this.transactionType,
                  subTransactionType: this.subTransactionType,
                  transactionId: this.transactionID,
                  paymentDetails: paymentDetails,
                  isTcsPayment: true
                })
              : this.duplicatePayment();
          } else {
            duplicate.length === 0
              ? this.paymentFacade.addChequeDDPayment({
                  transactionType: this.transactionType,
                  subTransactionType: this.subTransactionType,
                  transactionId: this.transactionID,
                  paymentDetails: paymentDetails
                })
              : this.duplicatePayment();
          }
          // this.paymentFacade.addChequeDDPayment({
          //   transactionType: this.transactionType,
          //   subTransactionType: this.subTransactionType,
          //   transactionId: this.transactionID,
          //   paymentDetails: paymentDetails
          // });

          break;
        }

        case PaymentModeEnum.ENCIRCLE: {
          this.addStartTrackingByPaymentCode(PaymentModeEnum.ENCIRCLE);
          if (
            this.tcsToBeCollectedAtCM !== 0 &&
            this.tcsToBeCollectedAtCM !== null &&
            this.tcsToBeCollectedAtCM !== undefined
          ) {
            this.paymentFacade.addEncirclePointsPayment({
              transactionType: this.transactionType,
              subTransactionType: this.subTransactionType,
              transactionId: this.transactionID,
              paymentDetails: paymentDetails,
              isTcsPayment: true
            });
          } else {
            this.paymentFacade.addEncirclePointsPayment({
              transactionType: this.transactionType,
              subTransactionType: this.subTransactionType,
              transactionId: this.transactionID,
              paymentDetails: paymentDetails
            });
          }
          break;
        }
        case PaymentModeEnum.QCGC: {
          this.addStartTrackingByPaymentCode(PaymentModeEnum.QCGC);
          if (
            this.tcsToBeCollectedAtCM !== 0 &&
            this.tcsToBeCollectedAtCM !== null &&
            this.tcsToBeCollectedAtCM !== undefined
          ) {
            this.paymentFacade.addQCGCPayment({
              transactionType: this.transactionType,
              subTransactionType: this.subTransactionType,
              transactionId: this.transactionID,
              paymentDetails: paymentDetails,
              isTcsPayment: true
            });
          } else {
            this.paymentFacade.addQCGCPayment({
              transactionType: this.transactionType,
              subTransactionType: this.subTransactionType,
              transactionId: this.transactionID,
              paymentDetails: paymentDetails
            });
          }
          break;
        }
        case PaymentModeEnum.GIFT_VOUCHER: {
          this.addStartTrackingByPaymentCode(PaymentModeEnum.GIFT_VOUCHER);
          this.addGVPayment();

          break;
        }
        case PaymentModeEnum.GHS_EVOUCHER: {
          this.addStartTrackingByPaymentCode(PaymentModeEnum.GHS_EVOUCHER);
          if (
            this.tcsToBeCollectedAtCM !== 0 &&
            this.tcsToBeCollectedAtCM !== null &&
            this.tcsToBeCollectedAtCM !== undefined
          ) {
            this.paymentFacade.addGHSeVoucherPayment({
              transactionType: this.transactionType,
              subTransactionType: this.subTransactionType,
              transactionId: this.transactionID,
              paymentDetails: paymentDetails,
              isTcsPayment: true
            });
          } else {
            this.paymentFacade.addGHSeVoucherPayment({
              transactionType: this.transactionType,
              subTransactionType: this.subTransactionType,
              transactionId: this.transactionID,
              paymentDetails: paymentDetails
            });
          }
          break;
        }
        case PaymentModeEnum.UNIPAY: {
          // const filteredPayment = this.paymentDetails.filter(x => {
          //   if (x.paymentCode === 'UNIPAY') {
          //     return x;
          //   }
          // });

          // const unipayPayload: UniPayRequest = {
          //   txnType: UnipayTransactionMode.CR_DR,
          //   txnMode: UnipayTransactionType.SALE_PURCHASE,
          //   txnId: '',
          //   txnAmount: paymentDetails.payload.amount,
          //   date: moment(),
          //   transactionType: this.transactionType,
          //   subTransactionType: this.subTransactionType
          // };

          // filteredPayment.length === 0
          //   ? this.paymentFacade.addUnipayPayment({
          //       transactionType: this.transactionType,
          //       subTransactionType: this.subTransactionType,
          //       transactionId: this.transactionID,
          //       paymentDetails: paymentDetails
          //     })
          //   : this.duplicatePayment();
          this.addStartTrackingByPaymentCode(PaymentModeEnum.UNIPAY);
          if (
            this.tcsToBeCollectedAtCM !== 0 &&
            this.tcsToBeCollectedAtCM !== null &&
            this.tcsToBeCollectedAtCM !== undefined
          ) {
            this.paymentFacade.addUnipayPayment({
              transactionType: this.transactionType,
              subTransactionType: this.subTransactionType,
              transactionId: this.transactionID,
              paymentDetails: paymentDetails,
              isTcsPayment: true
            });
          } else {
            this.paymentFacade.addUnipayPayment({
              transactionType: this.transactionType,
              subTransactionType: this.subTransactionType,
              transactionId: this.transactionID,
              paymentDetails: paymentDetails
            });
          }
          break;
        }
        case PaymentModeEnum.WALLET: {
          this.addStartTrackingByPaymentCode(PaymentModeEnum.WALLET);
          if (
            this.tcsToBeCollectedAtCM !== 0 &&
            this.tcsToBeCollectedAtCM !== null &&
            this.tcsToBeCollectedAtCM !== undefined
          ) {
            this.paymentFacade.addWalletPayment({
              transactionType: this.transactionType,
              subTransactionType: this.subTransactionType,
              transactionId: this.transactionID,
              paymentDetails: paymentDetails,
              isTcsPayment: true
            });
          } else {
            this.paymentFacade.addWalletPayment({
              transactionType: this.transactionType,
              subTransactionType: this.subTransactionType,
              transactionId: this.transactionID,
              paymentDetails: paymentDetails
            });
          }
          break;
        }
        case PaymentModeEnum.BANK_LOAN: {
          this.addStartTrackingByPaymentCode(PaymentModeEnum.BANK_LOAN);
          if (
            this.tcsToBeCollectedAtCM !== 0 &&
            this.tcsToBeCollectedAtCM !== null &&
            this.tcsToBeCollectedAtCM !== undefined
          ) {
            this.paymentFacade.addBankLoanPayment({
              transactionType: this.transactionType,
              subTransactionType: this.subTransactionType,
              transactionId: this.transactionID,
              paymentDetails: paymentDetails,
              isTcsPayment: true
            });
          } else {
            this.paymentFacade.addBankLoanPayment({
              transactionType: this.transactionType,
              subTransactionType: this.subTransactionType,
              transactionId: this.transactionID,
              paymentDetails: paymentDetails
            });
          }
          break;
        }
        case PaymentModeEnum.AIRPAY: {
          this.addStartTrackingByPaymentCode(PaymentModeEnum.AIRPAY);
          if (
            this.tcsToBeCollectedAtCM !== 0 &&
            this.tcsToBeCollectedAtCM !== null &&
            this.tcsToBeCollectedAtCM !== undefined
          ) {
            this.isAirpayIntegrationEnabled
              ? this.paymentFacade.addAirpayPayment({
                  transactionType: this.transactionType,
                  subTransactionType: this.subTransactionType,
                  transactionId: this.transactionID,
                  paymentDetails: paymentDetails,
                  isTcsPayment: true
                })
              : this.paymentFacade.addManualPayment({
                  transactionType: this.transactionType,
                  subTransactionType: this.subTransactionType,
                  transactionId: this.transactionID,
                  paymentDetails: paymentDetails,
                  isTcsPayment: true
                });
          } else {
            this.isAirpayIntegrationEnabled
              ? this.paymentFacade.addAirpayPayment({
                  transactionType: this.transactionType,
                  subTransactionType: this.subTransactionType,
                  transactionId: this.transactionID,
                  paymentDetails: paymentDetails
                })
              : this.paymentFacade.addManualPayment({
                  transactionType: this.transactionType,
                  subTransactionType: this.subTransactionType,
                  transactionId: this.transactionID,
                  paymentDetails: paymentDetails
                });
          }
          break;
        }

        case PaymentModeEnum.RAZOR_PAY: {
          this.addStartTrackingByPaymentCode(PaymentModeEnum.RAZOR_PAY);
          if (
            this.tcsToBeCollectedAtCM !== 0 &&
            this.tcsToBeCollectedAtCM !== null &&
            this.tcsToBeCollectedAtCM !== undefined
          ) {
            this.isRazorpayIntegrationEnabled
              ? this.paymentFacade.startRazorpayPayment({
                  transactionType: this.transactionType,
                  subTransactionType: this.subTransactionType,
                  transactionId: this.transactionID,
                  paymentDetails: paymentDetails,
                  isTcsPayment: true
                })
              : this.paymentFacade.addManualPayment({
                  transactionType: this.transactionType,
                  subTransactionType: this.subTransactionType,
                  transactionId: this.transactionID,
                  paymentDetails: paymentDetails,
                  isTcsPayment: true
                });
          } else {
            this.isRazorpayIntegrationEnabled
              ? this.paymentFacade.startRazorpayPayment({
                  transactionType: this.transactionType,
                  subTransactionType: this.subTransactionType,
                  transactionId: this.transactionID,
                  paymentDetails: paymentDetails
                })
              : this.paymentFacade.addManualPayment({
                  transactionType: this.transactionType,
                  subTransactionType: this.subTransactionType,
                  transactionId: this.transactionID,
                  paymentDetails: paymentDetails
                });
          }

          break;
        }

        case PaymentModeEnum.RO_PAYMENT: {
          this.addStartTrackingByPaymentCode(PaymentModeEnum.RO_PAYMENT);
          if (this.isROApprovedByWorkflow) {
            if (
              this.tcsToBeCollectedAtCM !== 0 &&
              this.tcsToBeCollectedAtCM !== null &&
              this.tcsToBeCollectedAtCM !== undefined
            ) {
              this.paymentFacade.addROPayment({
                transactionType: this.transactionType,
                subTransactionType: this.subTransactionType,
                transactionId: this.transactionID,
                paymentDetails: paymentDetails,
                isTcsPayment: true
              });
            } else {
              this.paymentFacade.addROPayment({
                transactionType: this.transactionType,
                subTransactionType: this.subTransactionType,
                transactionId: this.transactionID,
                paymentDetails: paymentDetails
              });
            }
          } else {
            this.paymentFacade.addManualPayment({
              transactionType: this.transactionType,
              subTransactionType: this.subTransactionType,
              transactionId: this.transactionID,
              paymentDetails: paymentDetails
            });
          }
          break;
        }
        case PaymentModeEnum.RTGS: {
          this.addStartTrackingByPaymentCode(PaymentModeEnum.RTGS);
          if (
            this.tcsToBeCollectedAtCM !== 0 &&
            this.tcsToBeCollectedAtCM !== null &&
            this.tcsToBeCollectedAtCM !== undefined
          ) {
            this.paymentFacade.addRtgsPayment({
              transactionType: this.transactionType,
              subTransactionType: this.subTransactionType,
              transactionId: this.transactionID,
              paymentDetails: paymentDetails,
              isTcsPayment: true
            });
          } else {
            this.paymentFacade.addRtgsPayment({
              transactionType: this.transactionType,
              subTransactionType: this.subTransactionType,
              transactionId: this.transactionID,
              paymentDetails: paymentDetails
            });
          }
          break;
        }
        case PaymentModeEnum.UPI: {
          this.addStartTrackingByPaymentCode(PaymentModeEnum.UPI);
          if (
            this.tcsToBeCollectedAtCM !== 0 &&
            this.tcsToBeCollectedAtCM !== null &&
            this.tcsToBeCollectedAtCM !== undefined
          ) {
            this.paymentFacade.addUPIPayment({
              transactionType: this.transactionType,
              subTransactionType: this.subTransactionType,
              transactionId: this.transactionID,
              paymentDetails: paymentDetails,
              isTcsPayment: true
            });
          } else {
            this.paymentFacade.addUPIPayment({
              transactionType: this.transactionType,
              subTransactionType: this.subTransactionType,
              transactionId: this.transactionID,
              paymentDetails: paymentDetails
            });
          }
          break;
        }
        case PaymentModeEnum.EMPLOYEE_LOAN: {
          if (
            this.tcsToBeCollectedAtCM !== 0 &&
            this.tcsToBeCollectedAtCM !== null &&
            this.tcsToBeCollectedAtCM !== undefined
          ) {
            this.paymentFacade.addEmployeeLoanPayment({
              transactionType: this.transactionType,
              subTransactionType: this.subTransactionType,
              transactionId: this.transactionID,
              paymentDetails: paymentDetails,
              isTcsPayment: true
            });
          } else {
            this.paymentFacade.addEmployeeLoanPayment({
              transactionType: this.transactionType,
              subTransactionType: this.subTransactionType,
              transactionId: this.transactionID,
              paymentDetails: paymentDetails
            });
          }
          break;
        }
        case PaymentModeEnum.CREDIT_NOTE: {
          this.addStartTrackingByPaymentCode(PaymentModeEnum.CREDIT_NOTE);
          if (
            (this.transactionType === TransactionTypeEnum.CM &&
              (this.subTransactionType === SubTransactionTypeEnum.NEW_CM ||
                this.subTransactionType ===
                  SubTransactionTypeEnum.MANUAL_CM)) ||
            (this.transactionType === TransactionTypeEnum.AB &&
              (this.subTransactionType === SubTransactionTypeEnum.NEW_AB ||
                this.subTransactionType === SubTransactionTypeEnum.MANUAL_AB))
          ) {
            // this.paymentFacade.loadCreditNoteDetail(
            //   paymentDetails.payload.reference3
            // );
            this.paymentFacade.loadSelectedCreditNotePaymentToBeAdded(
              paymentDetails
            );
            if (
              this.tcsToBeCollectedAtCM !== 0 &&
              this.tcsToBeCollectedAtCM !== null &&
              this.tcsToBeCollectedAtCM !== undefined
            ) {
              this.paymentFacade.addCreditNotePayment({
                transactionType: this.transactionType,
                subTransactionType: this.subTransactionType,
                transactionId: this.transactionID,
                paymentDetails: paymentDetails,
                isTcsPayment: true
              });
            } else {
              this.paymentFacade.addCreditNotePayment({
                transactionType: this.transactionType,
                subTransactionType: this.subTransactionType,
                transactionId: this.transactionID,
                paymentDetails: paymentDetails
              });
            }
            this.paymentDetails$ = this.paymentFacade.getPaymentDetails();
            this.paymentFacade.resetInvokedCreditNote();
          } else {
            if (
              this.tcsToBeCollectedAtCM !== 0 &&
              this.tcsToBeCollectedAtCM !== null &&
              this.tcsToBeCollectedAtCM !== undefined
            ) {
              this.paymentFacade.addCreditNotePayment({
                transactionType: this.transactionType,
                subTransactionType: this.subTransactionType,
                transactionId: this.transactionID,
                paymentDetails: paymentDetails,
                isTcsPayment: true
              });
            } else {
              this.paymentFacade.addCreditNotePayment({
                transactionType: this.transactionType,
                subTransactionType: this.subTransactionType,
                transactionId: this.transactionID,
                paymentDetails: paymentDetails
              });
            }
            this.paymentDetails$ = this.paymentFacade.getPaymentDetails();
            this.paymentFacade.resetInvokedCreditNote();
          }
          // const paginationPayload = {
          //   customerId: Number(this.customerID),
          //   isPageable: this.listingPageEvent.isPageable,
          //   locationCode: this.locationCode
          // };
          // this.paymentFacade.loadCreditNoteList(paginationPayload);
          break;
        }
        case PaymentModeEnum.GHS_ACCOUNT: {
          this.addStartTrackingByPaymentCode(PaymentModeEnum.GHS_ACCOUNT);
          if (
            this.tcsToBeCollectedAtCM !== 0 &&
            this.tcsToBeCollectedAtCM !== null &&
            this.tcsToBeCollectedAtCM !== undefined
          ) {
            this.paymentFacade.addGHSAccountPayment({
              transactionType: this.transactionType,
              subTransactionType: this.subTransactionType,
              transactionId: this.transactionID,
              paymentDetails: paymentDetails,
              isTcsPayment: true
            });
          } else {
            this.paymentFacade.addGHSAccountPayment({
              transactionType: this.transactionType,
              subTransactionType: this.subTransactionType,
              transactionId: this.transactionID,
              paymentDetails: paymentDetails
            });
          }
          break;
        }
        case PaymentModeEnum.DIGI_GOLD_NON_TANISHQ:
        case PaymentModeEnum.DIGI_GOLD_TANISHQ: {
          if (
            this.tcsToBeCollectedAtCM !== 0 &&
            this.tcsToBeCollectedAtCM !== null &&
            this.tcsToBeCollectedAtCM !== undefined
          ) {
            this.paymentFacade.addDigiPayment({
              transactionType: this.transactionType,
              subTransactionType: this.subTransactionType,
              transactionId: this.transactionID,
              paymentDetails: paymentDetails,
              isTcsPayment: true
            });
          } else {
            this.paymentFacade.addDigiPayment({
              transactionType: this.transactionType,
              subTransactionType: this.subTransactionType,
              transactionId: this.transactionID,
              paymentDetails: paymentDetails
            });
          }
          break;
        }
      }
    }

    // else {
    //   const msg = 'pw.payment.paymentError';
    //   this.errorNotifications(msg);
    // }
  }

  startUnipayEdcTrasaction(unipayPayload: UniPayRequest) {
    this.startTimeofUnipay = new Date().getTime();
    this.finalUnipayPayload = unipayPayload;
    this.paymentFacade.resetData();

    this.paymentFacade.startUnipayPayment(unipayPayload);

    // const observeEvents = this.paymentFacade
    //   .getUnipayResponse()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((unipayResponse: UniPayResponse) => {
    //     if (unipayResponse) {
    //       this.getUnipayResponse(unipayPayload, unipayResponse);
    //       observeEvents.unsubscribe();
    //     }
    //   });
  }

  getUnipayResponse(unipayPayload: UniPayRequest, unipayResponse) {
    const updateUnipayPlayload: UniPaymentDetails = new UniPaymentDetails();
    this.endTimeofUnipay = new Date().getTime();
    this.totalTimeofUnipay = this.endTimeofUnipay - this.startTimeofUnipay;
    this.resetUnipayCardValues$.next(false);
    console.log(
      'unipayPayload, unipayResponse:',
      unipayPayload,
      unipayResponse
    );

    if (unipayResponse?.response?.ResponseCode === 0) {
      updateUnipayPlayload.instrumentDate = moment(
        unipayResponse.response.Txn_Date
      );
      updateUnipayPlayload.payerBankName = PaymentModeEnum.UNIPAY;
      updateUnipayPlayload.payeeBankName = PaymentModeEnum.UNIPAY;

      updateUnipayPlayload.otherDetails = this.getUnipayDetailsToBeAddedToPaymentResponse(
        unipayPayload,
        unipayResponse
      );
      updateUnipayPlayload.instrumentNo = unipayResponse.response.ApprovalCode;

      this.paymentFacade.updateUniPayPayment({
        status: PaymentStatusEnum.COMPLETED,
        transactionType: this.transactionType,
        subTransactionType: this.subTransactionType,
        transactionId: unipayPayload.txnId,
        updateUnipayPlayload
      });
    } else if (unipayResponse === null || unipayResponse === 'error') {
      this.resetUnipayCardValues$.next(true);
      this.paymentFacade.deletePayment({
        transactionType: this.transactionType,
        subTransactionType: this.subTransactionType,
        paymentId: unipayPayload.txnId,
        showPopup: false
      });
    } else {
      this.retryPopup(unipayPayload, unipayResponse.response);
    }
  }

  getUnipayDetailsToBeAddedToPaymentResponse(
    unipayPayload: UniPayRequest,
    unipayResponse: OtherDetailsForUnipay
  ) {
    return {
      type: PaymentModeEnum.UNIPAY,
      data: {
        url: UnipayTransationUrlEnum.URL,
        request: {
          txnType: unipayPayload.txnType,
          txnMode: unipayPayload.txnMode,
          txnId: unipayPayload.txnId,
          txnAmount: unipayPayload.txnAmount,
          date: unipayPayload.date
        },
        response: {
          requestInput: unipayResponse.response.Request_Input,
          responseCode: unipayResponse.response.ResponseCode,
          responseMessage: unipayResponse.response.ResponseMessage,
          aprovalCode: unipayResponse.response.ApprovalCode,
          rRN: unipayResponse.response.RRN_No,
          amount: unipayResponse.response.Amount,
          cardNumber: unipayResponse.response.Card_Num,
          cardType: unipayResponse.response.Card_Type,
          cardHolderName: unipayResponse.response.CardHolder_Name,
          acquirerBank: unipayResponse.response.Acquirer_Bank,
          txnDate: unipayResponse.response.Txn_Date,
          txnType: unipayResponse.response.Txn_Type,
          bankInvoiceNumber: unipayResponse.response.BankInvoice_Num,
          batchNumber: unipayResponse.response.Batch_Number,
          terminalId: unipayResponse.response.Terminal_Id,
          merchantId: unipayResponse.response.Merchant_Id,
          utid: unipayResponse.response.utid
        },
        requestTime: this.startTimeofUnipay,
        responseTime: this.endTimeofUnipay,
        totalTime: this.totalTimeofUnipay,
        httpStatus: unipayResponse.httpStatus,
        transactionStatus: unipayResponse.transactionStatus,
        cardNumber: unipayResponse.cardNumber,
        referenceNumber: unipayResponse.referenceNumber
      }
    };
  }

  checkRso() {
    const productGridNotPresent = [
      SubTransactionTypeEnum.GIFT_SALE,
      SubTransactionTypeEnum.FROZEN_RATES,
      SubTransactionTypeEnum.NON_FROZEN_RATES
    ];
    if (
      this.isRsoSelected === false &&
      productGridNotPresent.indexOf(this.subTransactionType) === -1
    ) {
      this.errorNotifications('pw.productGrid.rsoNotSelectedMsg');
      return false;
    }
    return true;
  }

  retryPopup(unipayPayload: UniPayRequest, unipayResponse: UniPayResponse) {
    const observeEvent = this.dialog
      .open(PaymentUnipayCardRetryPopupComponent, {
        autoFocus: false,
        disableClose: true,
        data: {
          mode: 'Payment',
          ResponsePayload: unipayResponse
        },
        width: '450px'
      })
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(popupAction => {
        if (popupAction === UnipayTransationStatusEnum.DELETE) {
          this.paymentFacade.deletePayment({
            transactionType: this.transactionType,
            subTransactionType: this.subTransactionType,
            paymentId: unipayPayload.txnId
          });
          observeEvent.unsubscribe();
        } else if (popupAction === UnipayTransationStatusEnum.RETRY) {
          this.startUnipayEdcTrasaction(unipayPayload);
          observeEvent.unsubscribe();
        }
      });
  }

  generateOTPForCn(payload) {
    this.paymentFacade.loadIsOtpGenerated({
      id: payload.id,
      otpType: payload.type
    });
  }

  generateOTPForEmpLoan(payload) {
    this.paymentFacade.loadEmpLoanOtpGenerate({
      id: payload.id,
      otpType: payload.type
    });
  }
  retryfailedGV(failedGV: PaymentPayload[]) {
    if (!this.isfailedGVDialogOpen) {
      this.dialog
        .open(PaymentGvStausPopupComponent, {
          autoFocus: false,
          data: {
            failedGV$: this.failedGV$,
            currencyCode: this.currencyCode
          },
          width: 'auto'
        })

        .afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe(popupAction => {
          this.isfailedGVDialogOpen = false;
          this.paymentFacade.resetFailedGV();
          if (popupAction) {
            this.retryGVPayment(popupAction);
          }
        });
    }

    this.isfailedGVDialogOpen = true;
    this.failedGV$.next(failedGV);
  }
  getDigiGoldDiscountSelected(payment: PaymentDetails): any {
    const discount = this.transactionDiscounts.find(
      x => x.referenceId.toUpperCase() === payment.id.toUpperCase()
    );
    if (this.transactionDiscounts.length > 0 && discount) {
      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.CONFIRM,
          message: 'pw.payment.deleteDigiGoldGrnLabel'
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: boolean) => {
          if (res) {
            this.discountFacade.removeDigiDiscount({
              discountType: discount.discountType,
              txnType: this.transactionType,
              subTxnType: this.subTransactionType,
              transactionId: this.transactionID,
              discountId: discount.discountTxnId,
              referenceId: discount.referenceId
            });
          }
        });
    } else {
      const tcsPayment = this.paymentDetails.find(
        value => value.isTcsPayment === true
      );
      if (
        this.transactionType === TransactionTypeEnum.CM &&
        this.tcsToBeCollectedAtCM !== 0 &&
        tcsPayment
      ) {
        if (tcsPayment.id === payment.id) {
          this.paymentFacade.deletePayment({
            transactionType: this.transactionType,
            subTransactionType: this.subTransactionType,
            paymentId: payment.id
          });
        } else {
          this.alertPopupService.open({
            type: AlertPopupTypeEnum.INFO,
            message: 'pw.payment.deleteTcsPaymentLabel'
          });
        }
      } else if (
        this.transactionType === TransactionTypeEnum.CM &&
        this.tcsToBeCollectedAtCM !== 0 &&
        !tcsPayment
      ) {
        this.resetTcsAmountPopup();
      } else {
        this.paymentFacade.deletePayment({
          transactionType: this.transactionType,
          subTransactionType: this.subTransactionType,
          paymentId: payment.id
        });
      }
    }
  }

  deletePayment(payment: PaymentDetails) {
    if (
      payment.paymentCode === PaymentModeEnum.CREDIT_NOTE &&
      payment.instrumentType !== ConfigTypeEnum.DIGI_GOLD_TANISHQ &&
      !this.transactionDiscounts.some(
        x => x.referenceId.toUpperCase() === payment.id.toUpperCase()
      ) &&
      ((this.transactionType === TransactionTypeEnum.CM &&
        this.subTransactionType === SubTransactionTypeEnum.NEW_CM) ||
        (this.transactionType === TransactionTypeEnum.AB &&
          (this.subTransactionType === SubTransactionTypeEnum.NEW_AB ||
            this.subTransactionType === SubTransactionTypeEnum.MANUAL_AB)))
    ) {
      const tcsPayment = this.paymentDetails.find(
        value => value.isTcsPayment === true
      );
      if (
        this.transactionType === TransactionTypeEnum.CM &&
        this.tcsToBeCollectedAtCM !== 0 &&
        tcsPayment
      ) {
        if (tcsPayment.id === payment.id) {
          this.paymentFacade.loadSelectedCreditNotePaymentToBeDeleted(payment);
        } else {
          this.alertPopupService.open({
            type: AlertPopupTypeEnum.INFO,
            message: 'pw.payment.deleteTcsPaymentLabel'
          });
        }
      } else if (
        this.transactionType === TransactionTypeEnum.CM &&
        this.tcsToBeCollectedAtCM !== 0 &&
        !tcsPayment
      ) {
        this.resetTcsAmountPopup();
      } else {
        this.paymentFacade.loadSelectedCreditNotePaymentToBeDeleted(payment);
      }
    } else if (
      payment.paymentCode === PaymentModeEnum.DIGI_GOLD_TANISHQ ||
      this.transactionDiscounts.some(
        x => x.referenceId.toUpperCase() === payment.id.toUpperCase()
      ) ||
      (payment.instrumentType === ConfigTypeEnum.DIGI_GOLD_TANISHQ &&
        ((this.transactionType === TransactionTypeEnum.CM &&
          (this.subTransactionType === SubTransactionTypeEnum.NEW_CM ||
            this.subTransactionType === SubTransactionTypeEnum.MANUAL_CM)) ||
          (this.transactionType === TransactionTypeEnum.AB &&
            (this.subTransactionType === SubTransactionTypeEnum.NEW_AB ||
              this.subTransactionType === SubTransactionTypeEnum.MANUAL_AB))))
    ) {
      this.getDigiGoldDiscountSelected(payment);
    }
    // Note: Added to test void during deletion of unipay payment
    // else if (
    //   payment.paymentCode === PaymentModeEnum.UNIPAY &&
    //   payment.status === PaymentStatusEnum.COMPLETED
    // ) {
    //   this.voidUnipayPayment(payment);
    // }
    else {
      const tcsPayment = this.paymentDetails.find(
        value => value.isTcsPayment === true
      );
      if (
        this.transactionType === TransactionTypeEnum.CM &&
        this.tcsToBeCollectedAtCM !== 0 &&
        tcsPayment
      ) {
        if (tcsPayment.id === payment.id) {
          this.paymentFacade.deletePayment(
            {
              transactionType: this.transactionType,
              subTransactionType: this.subTransactionType,
              paymentId: payment.id
            },
            payment
          );
        } else {
          this.alertPopupService.open({
            type: AlertPopupTypeEnum.INFO,
            message: 'pw.payment.deleteTcsPaymentLabel'
          });
        }
      } else if (
        this.transactionType === TransactionTypeEnum.CM &&
        this.tcsToBeCollectedAtCM !== 0 &&
        !tcsPayment
      ) {
        this.resetTcsAmountPopup();
      } else {
        this.paymentFacade.deletePayment(
          {
            transactionType: this.transactionType,
            subTransactionType: this.subTransactionType,
            paymentId: payment.id
          },
          payment
        );
      }
    }
  }

  resetTcsAmountPopup() {
    this.dialog
      .open(ResetTcsPopupComponent, {
        width: '500px',
        height: 'auto'
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          this.commonFacade.setTcsTcsAmountNeedToReset(true);
        }
      });
  }

  removePaymentDetail(creditNoteId) {
    const selectedPayment = this.paymentDetails.find(
      payment => payment.instrumentNo === creditNoteId.toString()
    );
    const tcsPayment = this.paymentDetails.find(
      value => value.isTcsPayment === true
    );
    if (
      this.transactionType === TransactionTypeEnum.CM &&
      this.tcsToBeCollectedAtCM !== 0 &&
      tcsPayment
    ) {
      if (tcsPayment.instrumentNo === creditNoteId.toString()) {
        this.paymentFacade.deletePayment({
          transactionType: this.transactionType,
          subTransactionType: this.subTransactionType,
          paymentId: selectedPayment.id
        });
      } else {
        this.alertPopupService.open({
          type: AlertPopupTypeEnum.INFO,
          message: 'pw.payment.deleteTcsPaymentLabel'
        });
      }
    } else if (
      this.transactionType === TransactionTypeEnum.CM &&
      this.tcsToBeCollectedAtCM !== 0 &&
      !tcsPayment
    ) {
      this.resetTcsAmountPopup();
    } else {
      this.paymentFacade.deletePayment({
        transactionType: this.transactionType,
        subTransactionType: this.subTransactionType,
        paymentId: selectedPayment.id
      });
    }
    this.paymentDetails$ = this.paymentFacade.getPaymentDetails();
  }

  editPayment(details: EditCashDetails) {
    this.paymentFacade.editCashPayment({
      transactionType: this.transactionType,
      subTransactionType: this.subTransactionType,
      paymentDetails: details
    });
  }

  getQCGCBalance(data) {
    const cardNumber = data.cardNumber;
    const otpRequired = data.otpRequired;

    const QCGCPaylaod: QCGCGetBalancePayload = {
      cardType: GiftCardTxnEnum.QC_VENDOR_CODE,
      cardNumber,
      otpRequired
    };

    this.paymentFacade.getQCGCBalance(QCGCPaylaod);
  }

  getDigiBalance(data: DigiGetBalancePayload) {
    const digiPaylaod: DigiGetBalancePayload = {
      mobileNo: data.mobileNo,
      transactionId: this.transactionID
    };

    this.paymentFacade.getDigiBalance(digiPaylaod);
  }

  sendDigiOTP(value: GenerateOtpDigiGoldPayload) {
    this.paymentFacade.sendDigiOTP({
      ...value,
      transactionId: this.transactionID
    });
  }

  addGVPayment() {
    this.GVDetails.filter(
      value => value.status === GiftVoucherStatusDropdownEnum.REDEEMABLE_CODE
    ).forEach(gv => {
      if (
        this.tcsToBeCollectedAtCM !== 0 &&
        this.tcsToBeCollectedAtCM !== null &&
        this.tcsToBeCollectedAtCM !== undefined
      ) {
        this.paymentFacade.addGVPayment({
          transactionType: this.transactionType,
          subTransactionType: this.subTransactionType,
          transactionId: this.transactionID,
          isTcsPayment: true,
          paymentDetails: new GiftVoucher(PaymentGroupEnum.REGULAR, {
            amount: gv.totalValue,
            instrumentNo: String(gv.serialNo),
            instrumentType: PaymentModeEnum.GIFT_VOUCHER,
            instrumentDate: this.businessDate
          })
        });
      } else {
        this.paymentFacade.addGVPayment({
          transactionType: this.transactionType,
          subTransactionType: this.subTransactionType,
          transactionId: this.transactionID,
          paymentDetails: new GiftVoucher(PaymentGroupEnum.REGULAR, {
            amount: gv.totalValue,
            instrumentNo: String(gv.serialNo),
            instrumentType: PaymentModeEnum.GIFT_VOUCHER,
            instrumentDate: this.businessDate
          })
        });
      }
    });
  }

  retryGVPayment(payment: PaymentPayload[]) {
    payment.forEach(gv => {
      this.paymentFacade.addGVPayment(gv);
    });
  }

  getGVBalance(data) {
    const cardNumber = data.voucherNumber;

    this.paymentFacade.loadGVBalance({ serialNo: data.voucherNumber });
  }

  removeGV(data) {
    this.paymentFacade.removeGV(data);
  }
  resetGV() {
    this.paymentFacade.resetQCGC();
  }

  resetQCGC() {
    this.paymentFacade.resetQCGC();
  }

  getGHSeVoucherBalance(cardNumber: string) {
    const QCGCPaylaod: QCGCGetBalancePayload = {
      cardType: GiftCardTxnEnum.QC_VENDOR_CODE,
      cardNumber
    };

    this.paymentFacade.getGHSeVoucherBalance(QCGCPaylaod);
  }
  resetGHSeVoucher() {
    this.paymentFacade.resetGHSeVoucher();
  }
  getGHSAccountDetails(accountNumber: string) {
    this.paymentFacade.loadGHSAccountDetails(accountNumber);
  }
  getGHSAttachments(data) {
    this.paymentFacade.loadGHSAttachments({
      accountNumber: data.accNo,
      customerId: data.custId
    });
  }
  tabChanged(event) {
    if (event === true) {
      this.paymentFacade.resetInvokedCreditNote();
      this.invokedCreditNote$ = this.paymentFacade.getInvokedCreditNote();
    }
  }
  enableCashPayment(): boolean {
    this.hasCashPayment = true;
    const paymentMode = PaymentModeEnum.CASH;
    // if (this.customerSpecificPayments.includes(paymentMode)) {
    //   this.hasCashPayment =
    //     this.isCustomerSelected && this.allowedPayments.has(paymentMode);
    // } else {
    //   this.hasCashPayment = this.allowedPayments.has(paymentMode);
    // }

    this.hasCashPayment =
      this.isCustomerSelected && this.allowedPayments.has(paymentMode);

    return this.maxCashLimit > 0 && this.enablePayment(paymentMode);
  }

  enableUPIPayment(): boolean {
    return this.enablePayment(PaymentModeEnum.UPI);
  }

  enableCardPayment(): boolean {
    return this.enablePayment(PaymentModeEnum.CARD);
  }

  enableUnipayCardPayment(): boolean {
    return this.enablePayment(PaymentModeEnum.UNIPAY);
  }

  enableEGHSPayment(): any {
    return (
      this.isGHSredemptionAllowed &&
      this.enablePayment(PaymentModeEnum.GHS_ACCOUNT)
    );

    //return
  }

  enableGHSeVoucherPayment(): boolean {
    return this.enablePayment(PaymentModeEnum.GHS_EVOUCHER);
  }

  enableEncirclePayment(): boolean {
    return (
      this.isUlpAllowed &&
      !this.isEncirclePaymentAdded &&
      !!this.encirclePoints &&
      this.enablePayment(PaymentModeEnum.ENCIRCLE)
    );
  }

  enablePayment(paymentMode: PaymentModeEnum, limitCheck = true) {
    // Accept Advance : CN as a payment option, no other payment option can be clubbed
    if (
      this.transactionType === TransactionTypeEnum.ADV &&
      this.subTransactionType === SubTransactionTypeEnum.NON_FROZEN_RATES &&
      this.isCreditNoteAdded
    ) {
      return false;
    }
    // Accept Advance : Cheque as a payment option, no other payment option can be clubbed and can be added once
    else if (
      this.transactionType === TransactionTypeEnum.ADV &&
      this.subTransactionType === SubTransactionTypeEnum.NON_FROZEN_RATES &&
      this.isChequeAdded
    ) {
      return false;
    }
    // Accept Advance : DD as a payment option, no other payment option can be clubbed and can be added once
    // else if (
    //   this.transactionType === TransactionTypeEnum.ADV &&
    //   this.subTransactionType === SubTransactionTypeEnum.NON_FROZEN_RATES &&
    //   this.isDDAdded
    // ) {
    //   return false;
    // }

    // GRF : Cheque as a payment option, no other payment option can be clubbed and can be added once
    else if (
      this.transactionType === TransactionTypeEnum.ADV &&
      this.subTransactionType === SubTransactionTypeEnum.FROZEN_RATES &&
      this.isChequeAdded
    ) {
      return false;
    } else if (limitCheck && !this.limitCheck()) {
      return false;
    } else if (this.customerSpecificPayments.includes(paymentMode)) {
      return this.isCustomerSelected && this.allowedPayments.has(paymentMode);
    } else {
      return this.allowedPayments.has(paymentMode);
    }
  }

  limitCheck() {
    return this.totalAmountDue > 0;
  }

  enableOtherPayment(): boolean {
    // Accept Advance : Cheque as a payment option, no other payment option can be clubbed and can be added once
    if (
      this.transactionType === TransactionTypeEnum.ADV &&
      this.subTransactionType === SubTransactionTypeEnum.NON_FROZEN_RATES &&
      this.isChequeAdded
    ) {
      return false;
    }
    // Accept Advance : DD as a payment option, no other payment option can be clubbed and can be added once
    // else if (
    //   this.transactionType === TransactionTypeEnum.ADV &&
    //   this.subTransactionType === SubTransactionTypeEnum.NON_FROZEN_RATES &&
    //   this.isDDAdded
    // ) {
    //   return false;
    // }

    // GRF : Cheque as a payment option, no other payment option can be clubbed and can be added once
    else if (
      this.transactionType === TransactionTypeEnum.ADV &&
      this.subTransactionType === SubTransactionTypeEnum.FROZEN_RATES &&
      this.isChequeAdded
    ) {
      return false;
    } else {
      return (
        (this.allowedPayments.has(PaymentModeEnum.RO_PAYMENT) &&
          this.isROApprovedByWorkflow &&
          this.ulpID !== null) ||
        this.limitCheck()
      );
    }
  }

  getPaymetGroup(paymentMode: PaymentModeEnum): PaymentGroupEnum {
    return this.allowedPayments.get(paymentMode);
  }

  editCashError(event) {
    if (event.type === 'Others') {
      this.translate
        .get('pw.payment.cashEditError')
        .pipe(take(1))
        .subscribe((translatedMessage: string) => {
          this.alertPopupService.open({
            type: AlertPopupTypeEnum.ERROR,
            message:
              translatedMessage +
              this.currencyFormatterService.format(
                event.maxLimit,
                this.currencyCode
              )
          });
        });
    } else if (event.type === 'Minimum') {
      this.translate
        .get('pw.payment.minCashEditError')
        .pipe(take(1))
        .subscribe((translatedMessage: string) => {
          this.alertPopupService.open({
            type: AlertPopupTypeEnum.ERROR,
            message: translatedMessage
          });
        });
    }

    this.paymentFacade.resetCashPaymentAmount({
      paymentId: event.paymentId
    });
  }

  showNotifications(key) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.TIMER,
            message: translatedMessage
          })
          .events.subscribe((eventType: OverlayNotificationEventType) => {
            this.overlayNotification.close();
            this.paymentFacade.resetIsEncircleAdded();
          });
      });
  }

  openEncirclePointsPayment() {
    if (this.enableEncirclePayment() && this.checkRso()) {
      this.dialog
        .open(PaymentEncirclePointsPopupComponent, {
          autoFocus: false,
          width: '450px',
          data: {
            encirclePoints: this.encirclePoints,
            ulpID: this.ulpID,
            paymentGroup: this.getPaymetGroup(PaymentModeEnum.ENCIRCLE),
            currencyCode: this.currencyCode,
            totalAmountDue: this.totalAmountDue,
            businessDate: this.businessDate
          },
          disableClose: true
        })

        .afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: EncirclePointsPayment) => {
          if (data) {
            this.addPayment(data);
          }
        });
    }
  }

  openEncircleOTP(payment: PaymentDetails) {
    this.dialog
      .open(PaymentOtpPopupComponent, {
        autoFocus: false,
        width: '450px',
        data: {}
      })

      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: number) => {
        if (data) {
          this.paymentFacade.validateEncirclePayment({
            transactionType: this.transactionType,
            subTransactionType: this.subTransactionType,
            paymentId: payment.id,
            inputValue: String(data)
          });
        }
      });
  }

  errorHandler(error: CustomErrors) {
    if (error.code === 'ERR-CONFIG-015') {
      this.cnpriorityError = error.message;
    }
    this.overlayNotification.show({
      type: OverlayNotificationType.ERROR,
      message: error.message,
      hasClose: true,
      error: error
    });
  }

  errorNotifications(errorKey) {
    const key = errorKey;
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification.show({
          type: OverlayNotificationType.SIMPLE,
          message: translatedMessage,
          hasClose: true,
          hasBackdrop: true
        });
      });
  }

  duplicatePayment() {
    const msg = 'pw.paymentModeQCGC.duplicatePayment';
    this.errorNotifications(msg);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  testUnipayPayment() {
    let filteredPayment: PaymentDetails[];

    filteredPayment = this.paymentDetails.filter((x: PaymentDetails) => {
      if (x.paymentCode === 'UNIPAY') {
        return x;
      }
    });
    if (filteredPayment.length > 0) {
      const unipayPayload: UniPayRequest = {
        txnType: UnipayTransactionType.SALE_PURCHASE,
        txnMode: UnipayTransactionMode.CR_DR,
        txnId: filteredPayment[0].id,
        txnAmount: filteredPayment[0].amount,
        date: this.businessDate,
        transactionType: this.transactionType,
        subTransactionType: this.subTransactionType
      };

      this.startUnipayEdcTrasaction(unipayPayload);
    }
  }

  voidUnipayPayment(paymentDetail: PaymentDetails) {
    const unipayPayload: UniPayRequest = {
      txnType: UnipayTransactionType.VOID,
      txnMode: UnipayTransactionMode.CR_DR,
      txnId: paymentDetail.id,
      date: paymentDetail?.otherDetails?.data?.response?.txnDate,
      transactionType: this.transactionType,
      subTransactionType: this.subTransactionType,
      BankInvoiceNumber:
        paymentDetail?.otherDetails?.data?.response?.bankInvoiceNumber
    };

    this.paymentFacade.voidUnipayPayment(unipayPayload);
  }

  // Instrumentation
  addStartTrackingByPaymentCode(paymentCode) {
    const key1 = 'pw.instrumentationMessges.paymentAddMsg';
    const key2 = 'pw.instrumentationMessges.paymentMsg';
    this.translate
      .get([key1, key2])
      .pipe(take(1))
      .subscribe((translatedMsgs: any) => {
        this.startTracking(
          translatedMsgs[key1] +
            ' - ' +
            paymentCode +
            ' ' +
            translatedMsgs[key2]
        );
      });
  }

  addStopTrackingByPaymentCode(paymentCode) {
    const key1 = 'pw.instrumentationMessges.paymentAddMsg';
    const key2 = 'pw.instrumentationMessges.paymentMsg';
    this.translate
      .get([key1, key2])
      .pipe(take(1))
      .subscribe((translatedMsgs: any) => {
        this.stopTracking(
          translatedMsgs[key1] +
            ' - ' +
            paymentCode +
            ' ' +
            translatedMsgs[key2]
        );
      });
  }

  loadEmpLoanDetails(employeeCode) {
    this.paymentFacade.loadEmpLoanDetails(employeeCode);
  }

  uploadPhotoIDProofForThirdPartyCN(event: FormData) {
    this.fileUploadTxn = TransactionTypeEnum.CN_REDEMPTION;
    this.paymentFacade.loadFileUpload({
      file: event,
      txnType: TransactionTypeEnum.CN_REDEMPTION,
      id: this.transactionID,
      customerId: Number(this.customerID)
    });
  }

  resetUploadedFileData() {
    this.paymentFacade.resetUploadedFileData();
  }
}
