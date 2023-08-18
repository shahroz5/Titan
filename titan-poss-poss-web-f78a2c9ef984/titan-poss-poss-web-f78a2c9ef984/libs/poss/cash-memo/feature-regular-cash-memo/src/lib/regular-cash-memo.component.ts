import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { ActivatedRoute, Event, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AdvanceBookingFacade } from '@poss-web/poss/advance-booking/data-access-advance-booking';
import { CashMemoFacade } from '@poss-web/poss/cash-memo/data-access-cash-memo';
import { FocFacade } from '@poss-web/poss/foc/data-access-foc';
import { FocNotAddedPopupComponent } from '@poss-web/poss/foc/ui-foc-popups';
import { DiscountFacade } from '@poss-web/poss/shared/discount/data-access-discount';
import { ProductFacade } from '@poss-web/poss/shared/product/data-access-product';
import { ResetTcsPopupComponent } from '@poss-web/poss/shared/view-tcs/ui-view-tcs';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import {
  CurrencyFormatterService,
  WeightFormatterService
} from '@poss-web/shared/components/ui-formatters';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import { ValidateCustomerService } from '@poss-web/shared/customer/feature-customer-create';
import { FileFacade } from '@poss-web/shared/file-upload/data-access-file-upload';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import {
  AbToleranceConfigMetalType,
  PanCardPopupAbstraction,
  AdvanceBookingDetailsResponse,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  CashMemoDetailsResponse,
  CommomStateAttributeNameEnum,
  CommomStateAttributeTypeEnum,
  ConfigTypeEnum,
  CreateCashMemoResponse,
  CustomErrors,
  DiscountsResponse,
  FreezeRateEnum,
  InvoiceDeliveryTypes,
  LocationSettingAttributesEnum,
  Lov,
  MetalTypeEnum,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  PaymentDetails,
  PaymentModeEnum,
  PaymentStatusEnum,
  PostTransactionConfirmationActionsServiceAbstraction,
  printDocTypeEnum,
  printFileTypeEnum,
  PrintingServiceAbstraction,
  printTransactionTypesEnum,
  printTypesEnum,
  RangeTypesEnum,
  RuleTypesEnum,
  SharedBodEodFeatureServiceAbstraction,
  StatusTypesEnum,
  SubTransactionTypeEnum,
  SummaryBarEventRef,
  SummaryBarEventType,
  SummaryBarServiceAbstraction,
  SummaryBarType,
  TcsDataResponse,
  ToolbarConfig,
  TransactionTypeEnum,
  UpdateOrderDetails,
  ValidationTypesEnum,
  ViewTcsServiceAbstraction,
  CUSTOMER_TYPE_ENUM,
  CashMemoItemDetailsResponse,
  DiscountTypeEnum,
  PanFormVerifyPopupServiceAbstraction,
  RemoveAppliedTransactionLevelDiscountByIDPayload,
  CustomerServiceAbstraction,
  Customers
} from '@poss-web/shared/models';
import {
  OrderConfirmationFacade,
  OrderService
} from '@poss-web/shared/order-confirmation/data-access-order-confirmation';
import { PaymentFacade } from '@poss-web/shared/payment/data-access-payment';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { PrintingFacade } from '@poss-web/shared/printing/data-access-printing';
import { ToolbarFacade } from '@poss-web/shared/toolbar/data-access-toolbar';
import { commonStatusTranslateKeyMap } from '@poss-web/shared/util-adaptors';
import { CommonBaseComponent } from '@poss-web/shared/util-common';
import { POSS_WEB_TIME_TRACKING_LOG } from '@poss-web/shared/util-config';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { getCashMemoUrl } from '@poss-web/shared/util-site-routes';
import * as moment from 'moment';
import { Moment } from 'moment';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, take, takeUntil, withLatestFrom } from 'rxjs/operators';

const occasionTypeCode = 'OCCASION_TYPE';
const discountTypeCode = 'DISCOUNT_TYPE';
@Component({
  selector: 'poss-web-regular-cash-memo',
  templateUrl: './regular-cash-memo.component.html',
  styleUrls: ['./regular-cash-memo.component.scss']
})
export class RegularCashMemoComponent
  extends CommonBaseComponent
  implements OnInit, OnDestroy {
  customerId = null;
  customer: Customers = null;
  selectedOccasion = null;
  customerState = null;
  isIGSTSelected = false;
  cashMemoId = null;
  isFocCheck = false;
  totalQty = 0;
  totalAmt = 0;
  totalDisc = 0;
  totalWeight = 0;
  totalTax = 0;
  finalAmt = 0;
  paidValue = 0;
  hallmarkCharges = 0;
  hallmarkDiscount = 0;
  otherChargesList = null;
  metalRate = null;
  status: StatusTypesEnum;
  customerName = null;
  printErrorText: string;
  paymentDetails: PaymentDetails[];
  onConfirmInprogress = false;
  COAItems = [];
  isLoading$: Observable<boolean>;
  isLoadingOrder$: Observable<boolean>;
  occasionList$: Observable<Lov[]>;
  brandDetails$: Observable<any>;
  discountList: Lov[];
  selectedOccasion$: Subject<string> = new Subject<string>();
  clearOccasion$: Subject<null> = new Subject<null>();
  selectedEncircle$: Subject<string> = new Subject<string>();
  clearEncircle$: Subject<null> = new Subject<null>();
  resetEncircle$: Subject<string> = new Subject<string>();
  occasionIcon$: Subject<string> = new Subject<string>();
  clearOccasionIcon$: Subject<null> = new Subject<null>();
  destroy$: Subject<null> = new Subject<null>();
  @ViewChild('confirmSuccessNotificationTemplate', { static: true })
  confirmSuccessNotificationTemplate: TemplateRef<any>;
  confirmedCashmemoDoc = 0;
  abId: string;
  rivaahGenerated = false;
  discountDetails: any;
  isCOAPrinting = false;
  isWithoutCustomerFlag = false;
  summaryBarRemarks$ = new Subject<string>();
  isNarrationMandatory = false;
  isAbFlag = false;
  itemIdList = [];
  searchABFlag = false;
  clearForm$: Subject<null> = new Subject<null>();
  disableForm$: Subject<boolean> = new Subject<boolean>();
  newlyGeneratedCn: any;
  newlyGeneratedCNForPrint: any;

  toolbarData: ToolbarConfig = {
    txnType: TransactionTypeEnum.CM,
    subTxnType: SubTransactionTypeEnum.NEW_CM,
    loadMetalPrices: true,
    loadHoldPopup: true,
    loadOpenOrdersPopup: true
  };

  isFocAdded = false;
  addedManualFocDetail = [];
  isManualFocAdded = false;
  isFocKeptPending = false;
  availableFocSchemes = 0;
  availableFocSchemesForProducts = false;
  availableFocSchemesForSelectedProducts = true;
  isFOCPendingForCM = 0;
  fiscalYear = moment().year();
  currencyCode: string;
  isNoCustomerDependentPayment = true;
  lastHoldTime: Moment;
  viewData: CashMemoDetailsResponse;
  isLoggedIn: boolean;
  cmHoldTimeInMinutes: number;
  abDetails: AdvanceBookingDetailsResponse;
  cmDetails: CashMemoDetailsResponse;
  freezeRateEnum = FreezeRateEnum;
  metalTypeEnum = MetalTypeEnum;
  loadABDetails = false;
  metalType = new FormControl();
  metalTypes = [];
  locationCode: string;
  abStatusMsg1: string;
  abStatusMsg2: string;
  abStatus: string;
  disableFullPaymentCheck: boolean;
  cnNos: number[];
  currentFiscalYear: string;
  ghsCustomerId = null;
  customerLoyaltyDetails = null;
  isEncircleAdded: boolean;
  selectedEncircleData = null;
  confirmRemarks = null;
  bussinessDay: number;
  creditNotePaymentToBeDeleted: PaymentDetails = null;
  orderStatus = null;
  isABinvoked = false;
  customerPAN: any;
  maxAllowedAmount: number;
  panMandatoryForCM: boolean;
  alertMsgForPan: string;
  isABinvokedFirstTime = false;
  isCustomerUpdate = false;
  isTCSUpdate = false;
  isItemUpdate = false;
  enableDiscountUpdate = false;
  reloadCMFlag = false;
  updateCustomerForGHS = false;
  reloadCustomerForGHS = false;
  standardPrice = null;
  customerMobileNumber: any;
  discountsRemoveAlertMsg1: string;
  discountsRemoveAlertMsg2: string;
  discountsRemoveAlertMsg3: string;
  calculateRivaahGhsDiscWarningMsg1: string;
  calculateRivaahGhsDiscWarningMsg2: string;
  encircleNotificationMsg1: string;
  encircleNotificationMsg2: string;
  tcsToBeCollected = null;
  TcsApplicableAmount: any;
  tcsAlertLabel: any;
  tcsCollectedAtCm: number;
  isManuaFocVerified: boolean;
  refundAmountAsCash = 0;
  customerType: any;
  form60Submitted: boolean;
  enableCalculateRivaahGhsDiscount = false;
  encircleDiscountSelectMsg = false;
  setOrderSearchFocus = false;
  setOccasionFocus = false;
  badgeNumber = 1;
  @ViewChild(MatExpansionPanel) pannel?: MatExpansionPanel;
  isLastTransactionPrint = false;
  loadAutoDiscounts = false;
  gstNumber: string;
  passportId = '';
  idProof: string;
  weightUnit = 'gms';
  tcsToBeCollectedAtCM: number;
  isCnRedeemed: boolean;
  isProfileMatched: boolean;
  hasErrorWhileUpdating = false;
  selectedEncircleDataToRevertBack = null;
  permissions$: Observable<any[]>;
  isCNPrinting = false;
  isPrintCM = false;
  action: string;

  CASH_MEMO_ADD_EDIT_SUBMENU =
    'Customer Transaction Status-Cashmemo Add/Edit Submenu';
  isAdvancebookingType = false;
  printActions: any;

  constructor(
    public customerFacade: CustomerFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private summaryBar: SummaryBarServiceAbstraction,
    private cashMemoFacade: CashMemoFacade,
    private toolbarFacade: ToolbarFacade,
    private translate: TranslateService,
    private paymentFacade: PaymentFacade,
    public commonFacade: CommonFacade,
    public printingService: PrintingServiceAbstraction,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private orderConfirmationFacade: OrderConfirmationFacade,
    private dialog: MatDialog,
    private orderService: OrderService,
    private productFacade: ProductFacade,
    private advanceBookingFacade: AdvanceBookingFacade,
    private focFacade: FocFacade,
    private weightFormatterService: WeightFormatterService,
    private currencyFormatterService: CurrencyFormatterService,
    private authFacade: AuthFacade,
    private locationSettingsFacade: LocationSettingsFacade,
    private alertPopupService: AlertPopupServiceAbstraction,
    private panFormVerifyPopupService: PanFormVerifyPopupServiceAbstraction,
    private discountFacade: DiscountFacade,
    private fileFacade: FileFacade,
    private bodEodFeatureService: SharedBodEodFeatureServiceAbstraction,
    private viewTcsService: ViewTcsServiceAbstraction,
    private postConfirmationActions: PostTransactionConfirmationActionsServiceAbstraction,
    @Inject(POSS_WEB_TIME_TRACKING_LOG) public timeTrackingLog: boolean,
    private printingFacade: PrintingFacade,
    private panCardServiceAbstraction: PanCardPopupAbstraction,
    private customerService: CustomerServiceAbstraction,
    private validateCustomerService: ValidateCustomerService,
    private permissionfacade: PermissionFacade,
    private elementPermission: ElementPermissionService
  ) {
    super(timeTrackingLog);
    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.CM_HOLD_TIME_IN_MINUTES)
      .pipe(takeUntil(this.destroy$))
      .subscribe(cmHoldTimeInMinutes => {
        if (cmHoldTimeInMinutes) {
          this.cmHoldTimeInMinutes = Number(cmHoldTimeInMinutes);
          this.commonFacade.setConfigHoldTime(this.cmHoldTimeInMinutes);
        }
      });
    this.translate
      .get([
        'pw.otherReceiptsIssues.printError',
        'pw.regularCashMemo.abStatusMsg1',
        'pw.regularCashMemo.abStatusMsg2',
        'pw.regularCashMemo.alertMsgForPan',
        'pw.regularCashMemo.discountsRemoveAlertMsg1',
        'pw.regularCashMemo.discountsRemoveAlertMsg2',
        'pw.regularCashMemo.discountsRemoveAlertMsg3',
        'pw.discount.calculateRivaahGhsDiscWarningMsg1',
        'pw.discount.calculateRivaahGhsDiscWarningMsg2',
        'pw.discount.encircleNotificationMsg1',
        'pw.discount.encircleNotificationMsg2'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.printErrorText =
          translatedMessages['pw.otherReceiptsIssues.printError'];
        this.abStatusMsg1 =
          translatedMessages['pw.regularCashMemo.abStatusMsg1'];
        this.abStatusMsg2 =
          translatedMessages['pw.regularCashMemo.abStatusMsg2'];
        this.alertMsgForPan =
          translatedMessages['pw.regularCashMemo.alertMsgForPan'];
        this.discountsRemoveAlertMsg1 =
          translatedMessages['pw.regularCashMemo.discountsRemoveAlertMsg1'];
        this.discountsRemoveAlertMsg2 =
          translatedMessages['pw.regularCashMemo.discountsRemoveAlertMsg2'];
        this.discountsRemoveAlertMsg3 =
          translatedMessages['pw.regularCashMemo.discountsRemoveAlertMsg3'];
        this.calculateRivaahGhsDiscWarningMsg1 =
          translatedMessages['pw.discount.calculateRivaahGhsDiscWarningMsg1'];
        this.calculateRivaahGhsDiscWarningMsg2 =
          translatedMessages['pw.discount.calculateRivaahGhsDiscWarningMsg2'];
        this.encircleNotificationMsg1 =
          translatedMessages['pw.discount.encircleNotificationMsg1'];
        this.encircleNotificationMsg2 =
          translatedMessages['pw.discount.encircleNotificationMsg2'];
      });
  }

  ngOnInit() {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
    this.clearPage(true);
    this.showSummaryBar();
    this.componentInit();
    this.getCustomerResponse();
    this.getCashMemoReponse();
    this.bodEodFeatureService.loadLatestBusinessDay();
    this.commonFacade.setFileUploadVisible(false);
    this.authFacade
      .isUserLoggedIn()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoggedIn: boolean) => {
        this.isLoggedIn = isLoggedIn;
      });
    this.bodEodFeatureService
      .getFiscalYear()
      .pipe(takeUntil(this.destroy$))
      .subscribe((fiscalYear: number) => {
        if (fiscalYear) {
          this.currentFiscalYear = fiscalYear.toString();
        }
      });

    this.router.events
      .pipe(
        filter(
          (event: Event) => event instanceof NavigationEnd && this.isLoggedIn
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        const id = this.activatedRoute.snapshot.params['_id'];
        if (id !== 'new') {
          this.clearPage(false);
          this.addStartTracking(
            'pw.instrumentationMessges.invokeOpenHoldOrderMsg'
          );
          this.cashMemoFacade.viewCashMemo({
            id: id,
            txnType: TransactionTypeEnum.CM,
            subTxnType: SubTransactionTypeEnum.NEW_CM
          });
          this.commonFacade.setTransactionTD(
            this.activatedRoute.snapshot.params['_id']
          );
        } else this.clearPage(true);
      });
    if (this.activatedRoute.snapshot.params['_id'] !== 'new') {
      this.clearPage(true);
      this.cashMemoFacade.viewCashMemo({
        id: this.activatedRoute.snapshot.params['_id'],
        txnType: TransactionTypeEnum.CM,
        subTxnType: SubTransactionTypeEnum.NEW_CM
      });
      this.commonFacade.setTransactionTD(
        this.activatedRoute.snapshot.params['_id']
      );
    }

    this.productFacade
      .getCreateOrder()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.cashMemoFacade.createCashMemo({
            txnType: TransactionTypeEnum.CM,
            subTxnType: SubTransactionTypeEnum.NEW_CM
          });
          this.isWithoutCustomerFlag = true;
          this.productFacade.setCreateOrder(false);
        }
      });
    this.productFacade.setGridSearchEnable(true);

    this.authFacade
      .getLocationCode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.locationCode = data;
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.GLOBAL,
        CommomStateAttributeNameEnum.DISABLE_FULL_PAYMENT_CHECK
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.disableFullPaymentCheck = data;
      });

    this.focFacade
      .getManualFocListAddedToCM()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.addedManualFocDetail = data;
      });

    // this.printingService
    //   .getIsNotificationMailSent()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((isMailSent: boolean) => {
    //     if (isMailSent) {
    //       this.showAlertPopUp('pw.regularCashMemo.mailSentMsg');
    //     }
    //   });

    this.printingService
      .getIsMailSent()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isNotificationPrintSuccess: boolean) => {
        if (isNotificationPrintSuccess) {
          this.showAlertPopUp('pw.regularCashMemo.mailSentMsg');
        }
      });

    // this.printingService
    //   .getIsMailSent()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((isMailSent: boolean) => {
    //     if (isMailSent) {
    //       this.printingService.loadNotificationPrint({
    //         transacionId: this.cashMemoId,
    //         reprint: false,
    //         invoiceType: InvoiceDeliveryTypes.MAIL
    //       });
    //       // this.showAlertPopUp('pw.regularCashMemo.mailSentMsg');
    //     }
    //   });

    this.printingService
      .getIsPrintingSuccess()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isPrintingSuccess: boolean) => {
        if (isPrintingSuccess) {
          if (this.isCOAPrinting) {
            this.COAItems?.shift();
          }
          if (this.COAItems.length > 0) {
            this.isCOAPrinting = true;
            this.printCOA(this.COAItems[0]);
            this.COAItems = [];
          } else {
            if (this.isCNPrinting) {
              this.newlyGeneratedCNForPrint.shift();
            }
            if (this.newlyGeneratedCNForPrint.length > 0) {
              this.isCNPrinting = true;
              this.printCN(this.newlyGeneratedCNForPrint[0]);
              this.newlyGeneratedCNForPrint = [];
            } else {
              this.isCOAPrinting = false;
              this.isCNPrinting = false;
              this.showAlertPopUp('pw.regularCashMemo.printingSuccessMessage');
            }
          }
          if (this.isPrintCM) this.printPartialAB(this.action);
        }
      });

    this.cashMemoFacade
      .getIsIGST()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isIGST => {
        if (isIGST !== null) {
          this.isIGSTSelected = isIGST;
          this.commonFacade.setIsIGSTFlag(this.isIGSTSelected);
        }
      });

    this.cashMemoFacade
      .getFocus()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data === this.badgeNumber) {
          this.pannel.open();
          if (this.customerId) {
            this.setOccasionFocus = true;
            this.setOrderSearchFocus = false;
          } else {
            this.setOccasionFocus = false;
            this.setOrderSearchFocus = true;
          }
        } else {
          this.setOccasionFocus = false;
          this.setOrderSearchFocus = false;
        }
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.TCS_AMOUNT_NEED_TO_RESET
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(tcsNeedToReset => {
        if (tcsNeedToReset) {
          this.isCustomerUpdate = false;
          this.isTCSUpdate = true;
          this.isItemUpdate = false;
          this.cashMemoFacade.partialUpdateCashMemo({
            id: this.cashMemoId,
            requestDetails: {
              tcsCollected: 0
            },
            txnType: TransactionTypeEnum.CM,
            subTxnType: SubTransactionTypeEnum.NEW_CM
          });
          this.commonFacade.setTcsTcsAmountNeedToReset(false);
        }
        this.getVerifiedDetailOfManualFoc();
      });
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.IS_IGST_FLAG
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((isIGSTFlag: boolean) => {
        if (isIGSTFlag !== this.isIGSTSelected) {
          this.addStartTracking('pw.instrumentationMessges.updatingIGSTMsg');
          this.isIGSTSelected = isIGSTFlag;
          this.isCustomerUpdate = false;
          this.isTCSUpdate = false;
          this.isItemUpdate = true;
          this.cashMemoFacade.partialUpdateCashMemo({
            id: this.cashMemoId,
            requestDetails: {
              isIGST: isIGSTFlag,
              customerId: this.customerId
            },
            txnType: TransactionTypeEnum.CM,
            subTxnType: SubTransactionTypeEnum.NEW_CM
          });
        }
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.GLOBAL,
        CommomStateAttributeNameEnum.TRANSACTION_CONFIG
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(transactionConfig => {
        if (transactionConfig) {
          if (transactionConfig.refTxnType === 'AB') {
            this.isAdvancebookingType = true;
          } else {
            this.isAdvancebookingType = false;
          }
        }
      });
  }

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  getVerifiedDetailOfManualFoc() {
    this.focFacade
      .getIsManualFocVerified()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isManualFocVerified: boolean) => {
        if (isManualFocVerified) {
          this.isManuaFocVerified = isManualFocVerified;
          this.orderService.ConfirmAllBillLevelDiscounsts(
            this.cashMemoId,
            TransactionTypeEnum.CM,
            SubTransactionTypeEnum.NEW_CM,
            this.discountDetails
          );
        }
      });
  }

  showSummaryBar() {
    this.summaryBar
      .open(SummaryBarType.SUMMARY_BAR, {
        remarks: this.summaryBarRemarks$.asObservable()
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: SummaryBarEventRef) => {
        this.isLastTransactionPrint = false;
        switch (event.eventType) {
          case SummaryBarEventType.CLAER: {
            this.addStartTracking('pw.instrumentationMessges.clearCMOrderMsg');
            this.clearPage(true);
            this.router.navigate([getCashMemoUrl()]);
            this.commonFacade.setTransactionConfig({
              isPaymentEditable: true,
              transactionType: {
                type: TransactionTypeEnum.CM,
                subType: SubTransactionTypeEnum.NEW_CM
              },
              transactionIDPresent: true,
              taxTransactionType: TransactionTypeEnum.CUST_TRANSACTION_CM
            });
            break;
          }
          case SummaryBarEventType.CONFRIM: {
            if (this.customerId !== null) {
              let isFormValidated = this.validateCustomerService.validateCustomer(
                this.customer
              );
              if (isFormValidated) {
                this.addStartTracking(
                  'pw.instrumentationMessges.confirmCMOrderMsg'
                );
                this.confirmRemarks = event;
                if (
                  !this.isProfileMatched &&
                  ((this.totalQty !== 0 &&
                    this.panMandatoryForCM &&
                    this.paidValue > Number(this.maxAllowedAmount)) ||
                    (this.totalQty !== 0 &&
                      this.paidValue > Number(this.TcsApplicableAmount)))
                  // ((this.customerType === CUSTOMER_TYPE_ENUM.INTERNATIONAL &&
                  //   (!this.form60Submitted || !this.passportId)) ||
                  //   (this.customerType === CUSTOMER_TYPE_ENUM.ONE_TIME &&
                  //     !this.form60Submitted &&
                  //     !this.customerPAN) ||
                  //   (this.customerType === CUSTOMER_TYPE_ENUM.INSTITUTIONAL &&
                  //     !this.gstNumber &&
                  //     !this.customerPAN) ||
                  //   (this.customerType === CUSTOMER_TYPE_ENUM.REGULAR &&
                  //     !this.customerPAN &&
                  //     !this.idProof))
                ) {
                  // this.openPanCardPopUp();
                  this.showPanFormVerifyPopup();
                } else {
                  this.cashMemoFacade.ValidateMetalRate({
                    id: this.cashMemoId,
                    status: StatusTypesEnum.CONFIRMED,
                    txnType: TransactionTypeEnum.CM,
                    subTxnType: SubTransactionTypeEnum.NEW_CM,
                    metalRates: {
                      metalRates: this.standardPrice
                    }
                  });
                }
              } else {
                this.customerService.open({
                  customerType: this.customerType,
                  customerId: this.customerId
                });
                if (this.isAdvancebookingType) {
                  const customerMissingForABError =
                    'pw.regularCashMemo.customerMissingForABError';
                  this.errorNotifications(customerMissingForABError);
                }
              }
            }

            break;
          }
          case SummaryBarEventType.HOLD: {
            // todo: foc check needs to be checked

            if (this.customerId === null) {
              const selectCustomerMsg = 'pw.regularCashMemo.selectCustomerMsg';
              this.errorNotifications(selectCustomerMsg);
            } else {
              let isFormValidated = this.validateCustomerService.validateCustomer(
                this.customer
              );
              if (isFormValidated) {
                if (this.selectedOccasion === null) {
                  const selectOccasionMessage =
                    'pw.regularCashMemo.selectOccasionDetailsMessage';
                  this.errorNotifications(selectOccasionMessage);
                } else if (this.isFocCheck === true) {
                  const removeFOCMessage =
                    'pw.regularCashMemo.removeFOCItemOnHoldMessage';
                  this.errorNotifications(removeFOCMessage);
                } else if (this.totalQty === 0) {
                  const addItemMessage =
                    'pw.regularCashMemo.addItemToGridMessage';
                  this.errorNotifications(addItemMessage);
                }
                // else if (!event.remarks) {
                //   const remarksMessage = 'pw.regularCashMemo.remarksMsg';
                //   this.errorNotifications(remarksMessage);
                // }
                else {
                  this.addStartTracking(
                    'pw.instrumentationMessges.holdCMOrderMsg'
                  );
                  // todo: other charges value needs to be added
                  this.cashMemoFacade.updateCashMemo({
                    id: this.cashMemoId,
                    status: StatusTypesEnum.HOLD,
                    requestDetails: {
                      customerId: this.customerId,
                      metalRateList: this.metalRate,
                      finalValue: this.finalAmt,
                      occasion: this.selectedOccasion,
                      otherCharges: this.otherChargesList,
                      paidValue: this.currencyRoundOff(this.paidValue),
                      remarks: event?.remarks ? event?.remarks : null,
                      totalDiscount: this.currencyRoundOff(this.totalDisc),
                      totalQuantity: this.totalQty,
                      totalTax: this.currencyRoundOff(this.totalTax),
                      totalValue: this.currencyRoundOff(this.totalAmt),
                      totalWeight: this.weightRoundOff(this.totalWeight),
                      hallmarkCharges: this.currencyRoundOff(
                        this.hallmarkCharges
                      ),
                      hallmarkDiscount: this.currencyRoundOff(
                        this.hallmarkDiscount
                      )
                    },
                    txnType: TransactionTypeEnum.CM,
                    subTxnType: SubTransactionTypeEnum.NEW_CM
                  });
                }
              } else {
                this.customerService.open({
                  customerType: this.customerType,
                  customerId: this.customerId
                });
                if (this.isAdvancebookingType) {
                  const customerMissingForABError =
                    'pw.regularCashMemo.customerMissingForABError';
                  this.errorNotifications(customerMissingForABError);
                }
              }
            }
            break;
          }
          case SummaryBarEventType.CONVERT: {
            this.commonFacade.convertToAdvance();
            break;
          }
          case SummaryBarEventType.PRINT: {
            this.isLastTransactionPrint = true;
            this.printLastTransaction();
            break;
          }
          case SummaryBarEventType.DELETE: {
            //Delete Action
            if (this.cashMemoId) {
              this.addStartTracking(
                'pw.instrumentationMessges.deleteCMOrderMsg'
              );
              this.focFacade.deleteFoc({
                id: this.cashMemoId,
                txnType: TransactionTypeEnum.CM,
                subTxnType: SubTransactionTypeEnum.NEW_CM
              });
              this.cashMemoFacade.deleteCashMemo({
                id: this.cashMemoId,
                txnType: TransactionTypeEnum.CM,
                subTxnType: SubTransactionTypeEnum.NEW_CM
              });
            } else
              this.showSimpleNotifications('pw.regularCashMemo.deleteOrderMsg');
            this.commonFacade.setTransactionConfig({
              isPaymentEditable: true,
              transactionType: {
                type: TransactionTypeEnum.CM,
                subType: SubTransactionTypeEnum.NEW_CM
              },
              transactionIDPresent: true,
              taxTransactionType: TransactionTypeEnum.CUST_TRANSACTION_CM
            });
            // this.commonFacade.clearTransactionConfig();
            // this.reloadCM();s
            break;
          }
        }
      });
  }

  confirmCashmemo(event) {
    const orderDetails: UpdateOrderDetails = {
      cashMemoId: this.cashMemoId,
      orderDetails: {
        customerId: this.customerId,
        metalRateList: this.metalRate,
        manualFoc: this.isManualFocAdded ? true : false,
        finalValue: this.finalAmt,
        occasion: this.selectedOccasion,
        otherCharges: this.otherChargesList,
        paidValue:
          this.disableFullPaymentCheck && this.paidValue > this.finalAmt
            ? this.currencyRoundOff(this.finalAmt)
            : this.currencyRoundOff(this.paidValue),
        remarks: event?.remarks ? event.remarks : null,
        totalDiscount: this.currencyRoundOff(this.totalDisc),
        totalQuantity: this.totalQty,
        totalTax: this.currencyRoundOff(this.totalTax),
        totalValue: this.currencyRoundOff(this.totalAmt),
        totalWeight: this.weightRoundOff(this.totalWeight),
        hallmarkCharges: this.currencyRoundOff(this.hallmarkCharges),
        hallmarkDiscount: this.currencyRoundOff(this.hallmarkDiscount),
        tcsToBeCollected: this.currencyRoundOff(this.tcsToBeCollected),
        tcsCollected: this.currencyRoundOff(this.tcsCollectedAtCm)
      },
      status: StatusTypesEnum.CONFIRMED,
      transactionType: TransactionTypeEnum.CM,
      subTransactionType: SubTransactionTypeEnum.NEW_CM,
      isNarrationMandatory: this.isNarrationMandatory,
      isABinvoked: this.isABinvoked,
      originalPaidValue: this.currencyRoundOff(this.paidValue)
    };

    const msg = this.orderService.confirmOrder(
      orderDetails,
      this.paymentDetails,
      TransactionTypeEnum.CM
    );

    if (msg) {
      this.errorNotifications(msg);
    }

    // this.orderConfirmationFacade.confirmCashMemo(
    //   orderDetails,
    //   this.notConfirmedPayements
    // );
  }

  componentInit() {
    this.bodEodFeatureService
      .getBusinessDayDate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.bussinessDay = data;
      });

    this.commonFacade.loadCMStandardMetalPriceDetails();
    this.isLoading$ = this.cashMemoFacade.getIsLoading();
    this.isLoadingOrder$ = this.orderConfirmationFacade.getIsLoading();
    this.occasionList$ = this.commonFacade.getCommonFacadeAttributes(
      CommomStateAttributeTypeEnum.CASHMEMO,
      CommomStateAttributeNameEnum.OCCASION_LIST
    );
    this.toolbarFacade.setToolbarConfig(this.toolbarData);
    this.focFacade
      .getIsFocAdded()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: boolean) => {
        this.isFocAdded = data;
      });
    this.focFacade
      .getIsManualFocAdded()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: boolean) => {
        this.isManualFocAdded = data;
      });
    this.focFacade
      .getIsFocKeptPending()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: boolean) => {
        this.isFocKeptPending = data;
      });
    this.focFacade
      .getAvailableSchemes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.availableFocSchemes = data.length;
      });
    this.focFacade
      .getIsFocSchemesForItems()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.availableFocSchemesForProducts = data;
      });

    this.focFacade
      .getFocSchemes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.availableFocSchemesForSelectedProducts =
          data && data.length !== 0 ? true : false;
      });

    this.printingFacade
      .getIsPrintSuccess()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isSuccess: boolean) => {
        if (isSuccess) {
          this.addStopTracking('pw.instrumentationMessges.printCMOrderMsg');
        }
      });

    this.printingService
      .getPrintError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.tcsAmountSubscription();

    this.commonFacade.setTransactionConfig({
      isPaymentEditable: true,
      transactionType: {
        type: TransactionTypeEnum.CM,
        subType: SubTransactionTypeEnum.NEW_CM
      },
      taxTransactionType: TransactionTypeEnum.CUST_TRANSACTION_CM
    });
    this.cashMemoFacade
      .getHasError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.orderConfirmationFacade
      .getHasError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.productFacade
      .getHasError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.paymentFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.HAS_ERROR
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (
          error &&
          (error.code === ErrorEnums.ERR_CONFIG_015 ||
            error.code === ErrorEnums.ERR_CONFIG_078)
        )
          this.metalType.patchValue(null);
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.GHS_CUSTOMER_ID
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((ghsCustomerId: number) => {
        if (
          ghsCustomerId &&
          !this.customerId &&
          this.status === StatusTypesEnum.OPEN &&
          !this.updateCustomerForGHS &&
          !this.hasErrorWhileUpdating
        ) {
          this.cashMemoFacade.partialUpdateCashMemo({
            id: this.cashMemoId,
            requestDetails: {
              customerId: ghsCustomerId
            },
            txnType: TransactionTypeEnum.CM,
            subTxnType: SubTransactionTypeEnum.NEW_CM
          });
        }
      });

    this.paymentFacade
      .getPaymentDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((payments: PaymentDetails[]) => {
        this.paymentDetails = payments;
        this.newlyGeneratedCn = this.paymentDetails.filter(
          cn =>
            (cn.paymentCode === PaymentModeEnum.CREDIT_NOTE ||
              cn.paymentCode === PaymentModeEnum.GHS_ACCOUNT) &&
            cn.otherDetails.data.newCNNumber !== null
        );
        if (this.newlyGeneratedCn) {
          this.newlyGeneratedCNForPrint = this.newlyGeneratedCn;
        }
        this.refundAmountAsCash = this.paymentDetails.reduce(
          (sum, b) => sum + b.refundAmount,
          0
        );
        this.isCnRedeemed = payments.some(
          x => x.otherDetails?.data?.isRateProtectedCN
        );
        this.isDisableInvoke();
      });

    this.paymentFacade
      .getIsGRFCNAdded()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isGRFCNAdded: boolean) => {
        if (isGRFCNAdded) {
          this.updatePrice(true);
          this.paymentFacade.resetIsGRFCNAdded();
        }
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.TOTAL_QUANTITY
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(quantity => {
        this.totalQty = quantity;
        this.isDisableInvoke();
      });
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.TOTAL_WEIGHT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(weight => {
        this.totalWeight = weight;
      });
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.TOTAL_DISCOUNT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(disc => {
        this.totalDisc = disc;
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.TOTAL_AMT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(amt => {
        this.totalAmt = amt;
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.TAX_AMT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(tax => {
        this.totalTax = tax;
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.HALLMARK_CHARGES
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(hallmarkCharges => {
        this.hallmarkCharges = hallmarkCharges;
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.HALLMARK_DISCOUNT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(hallmarkDiscount => {
        this.hallmarkDiscount = hallmarkDiscount;
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.OTHER_CHARGES
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((charges: any) => {
        if (charges) {
          this.otherChargesList = charges;
        } else {
          this.otherChargesList = null;
        }
      });
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.FINAL_AMT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(amt => {
        this.finalAmt = amt;
        this.commonFacade.setTransactionTotalAmount(amt);
      });

    this.paymentFacade
      .getTotalPaidAmount()
      .pipe(takeUntil(this.destroy$))
      .subscribe(totalValue => {
        this.paidValue = totalValue;
      });

    this.toolbarFacade
      .getConfirmOrdersResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(abList => {
        if (abList.length !== 0) {
          let searchResult = true;
          let nonInvokingOrders = [];
          this.abStatus = '';
          let invokingOrder = abList.filter(
            abOrder =>
              abOrder.status === StatusTypesEnum.CONFIRMED ||
              abOrder.status === StatusTypesEnum.PARTIAL_INVOICE
          );
          abList.forEach((element, index) => {
            if (
              element.txnType === TransactionTypeEnum.AB &&
              element.status !== StatusTypesEnum.OPEN &&
              element.status !== StatusTypesEnum.HOLD &&
              element.status !== StatusTypesEnum.DELETED
            ) {
              if (
                element.status === StatusTypesEnum.CONFIRMED ||
                element.status === StatusTypesEnum.PARTIAL_INVOICE
              ) {
                searchResult = false;
                this.advanceBookingFacade.viewCashMemo({
                  id: element.id,
                  txnType: element.txnType,
                  subTxnType: element.subTxnType
                });
                this.isABinvokedFirstTime = true;
              } else {
                nonInvokingOrders.push(element);
                if (
                  this.searchABFlag &&
                  index + 1 === abList.length &&
                  invokingOrder.length === 0
                ) {
                  nonInvokingOrders.forEach((order, orderIndex) =>
                    this.getStatus(order.status, orderIndex)
                  );
                  const msg =
                    this.abStatusMsg1 + this.abStatus + this.abStatusMsg2;
                  this.openErrorMsgForOrder(msg);
                  this.clearPage(true);
                }
              }
            }
          });
          if (this.searchABFlag && searchResult) {
            this.openErrorMsgForOrder(
              'pw.regularCashMemo.docNumberNotAvailableMsg'
            );
            this.clearPage(true);
          }
          this.addStopTracking('pw.instrumentationMessges.searchOpenOrderMsg');
        } else {
          if (this.searchABFlag) {
            this.openErrorMsgForOrder(
              'pw.regularCashMemo.docNumberNotAvailableMsg'
            );
            this.clearPage(true);
          }
        }
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.STANDARD_METAL_PRICE_DETAILS
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.standardPrice = data;
          this.productFacade.setStandardPrice(data);
        }
      });

    this.productFacade
      .getMetalRate()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: {}) => {
        if (data) {
          this.metalRate = data;
        }
      });

    this.paymentFacade
      .getHasCustomerSpecificPayments()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAdded => {
        this.isNoCustomerDependentPayment = !isAdded;
      });
    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.COUNTRY_FISCAL_YEAR)
      .pipe(takeUntil(this.destroy$))
      .subscribe(fiscalYear => {
        if (fiscalYear) {
          this.fiscalYear = Number(fiscalYear);
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
          this.maxAllowedAmount =
            brandDetail.panCardDetails.data.configurationAmountForCashMemo;
          this.TcsApplicableAmount =
            brandDetail?.brandTcsDetails?.data?.b2c?.tcsApplicableAmount;
          this.panMandatoryForCM =
            brandDetail.panCardDetails.data.isPanCardMandatoryforCashMemo;
        }
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.METAL_TYPE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: AbToleranceConfigMetalType[]) => {
        if (data.length !== 0) {
          this.getMetalDetails(data, this.abDetails?.orderWeightDetails);
        }
      });

    this.productFacade
      .getDiscountSelected()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isDiscountSelected => {
        if (isDiscountSelected) {
          this.productFacade.setDiscountSelected(false);
        }
      });
    this.discountFacade
      .getIsReloadDiscountsGrid()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isReload => {
        if (isReload) {
          this.reloadCM();
          this.discountFacade.loadReloadDiscountsGrid(false);
        }
      });
    this.discountFacade
      .getIsTransactionLevelDiscountApplied()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isDiscountSelected => {
        if (isDiscountSelected) {
          this.reloadCM();
        }
      });
    this.discountFacade
      .getIsAllAppliedTransactionLevelDiscountsDeleted()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isDiscountDeleted => {
        if (isDiscountDeleted.isDeleted) {
          if (
            isDiscountDeleted.discountType !==
              DiscountTypeEnum.RIVAAH_CARD_DISCOUNT &&
            this.enableDiscountUpdate
          ) {
            this.loadAutoDiscounts = true;
          }
          if (
            isDiscountDeleted.discountType === DiscountTypeEnum.ULP_BIRTHDAY ||
            isDiscountDeleted.discountType ===
              DiscountTypeEnum.ULP_ANNIVERSARY ||
            isDiscountDeleted.discountType ===
              DiscountTypeEnum.ULP_SPOUSE_BIRTHDAY
          ) {
            this.discountFacade.setEncircle(undefined);
            this.selectedEncircleData = null;
          }
          this.reloadCM();
        }
      });

    this.discountFacade
      .getIsSelectedTransactionLevelDiscountDeleted()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isDiscountDeleted => {
        if (isDiscountDeleted) {
          if (this.creditNotePaymentToBeDeleted) {
            this.paymentFacade.deletePayment({
              paymentId: this.creditNotePaymentToBeDeleted.id,
              transactionType: TransactionTypeEnum.CM,
              subTransactionType: SubTransactionTypeEnum.NEW_CM
            });

            this.creditNotePaymentToBeDeleted = null;
          }
          this.reloadCM();
        }
      });

    this.discountFacade
      .getConfimrationDiscountState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(discountStatus => {
        if (discountStatus) {
          discountStatus === PaymentStatusEnum.COMPLETED
            ? this.confirmCashmemo(this.confirmRemarks)
            : this.discountsRemoveAlert(discountStatus);
        }
      });

    this.cashMemoFacade
      .getIsMetalRateValidated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isMetalRateValidated => {
        if (isMetalRateValidated === true) {
          if (
            this.totalQty !== 0 &&
            this.availableFocSchemes &&
            (this.availableFocSchemesForProducts ||
              this.availableFocSchemesForSelectedProducts) &&
            !(this.isFocAdded || this.isFocKeptPending)
          ) {
            this.openFocNotAddedPopup(event);
          } else if (this.encircleDiscountSelectMsg) {
            this.encircleNotification();
          } else if (this.enableCalculateRivaahGhsDiscount) {
            this.calculateRivaahGHSAlert();
          } else if (
            this.totalAmt !== 0 &&
            this.finalAmt - this.paidValue === 0
          ) {
            this.tcsCalculation();
          } else {
            // if (this.isManualFocAdded) {
            // const requestPayload = {
            //   customerID: this.customerId,
            //   manualFocEndDate: Number(
            //     this.addedManualFocDetail[0].manualFocSchemeDetails.data
            //       .manualFocEndDate
            //   ),
            //   manualFocStartDate: Number(
            //     this.addedManualFocDetail[0].manualFocSchemeDetails.data
            //       .manualFocStartDate
            //   )
            // };
            // this.focFacade.verifyManualFoc(requestPayload);
            // } else {
            //   if (this.isManualFocAdded) {
            // const requestPayload = {
            //   customerID: this.customerId,
            //   manualFocEndDate: Number(
            //     this.addedManualFocDetail[0].manualFocSchemeDetails
            //       .data.manualFocEndDate
            //   ),
            //   manualFocStartDate: Number(
            //     this.addedManualFocDetail[0].manualFocSchemeDetails
            //       .data.manualFocStartDate
            //   )
            // };
            // this.focFacade.verifyManualFoc(requestPayload);
            // }
            // {
            this.orderService.ConfirmAllBillLevelDiscounsts(
              this.cashMemoId,
              TransactionTypeEnum.CM,
              SubTransactionTypeEnum.NEW_CM,
              this.discountDetails
            );
            // }
            // }
          }
        }
      });

    this.paymentFacade
      .getCreditNotePaymentToBeDeleted()
      .pipe(takeUntil(this.destroy$))
      .subscribe((creditNotePaymentToBeDeleted: PaymentDetails) => {
        this.creditNotePaymentToBeDeleted = creditNotePaymentToBeDeleted;
      });

    this.discountFacade
      .getAppliedKaratorCoinOfferDiscountResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(appliedDiscount => {
        if (appliedDiscount) {
          this.reloadCM();
        }
      });

    this.discountFacade
      .getAppliedTransactionLevelDiscounts()
      .pipe(takeUntil(this.destroy$))
      .subscribe((discounts: DiscountsResponse[]) => {
        if (discounts.length > 0) {
          const narrationMandatory = discounts.filter(
            data => data.isNarationMandatory === true
          );
          if (narrationMandatory.length > 0) {
            this.isNarrationMandatory = true;
          } else {
            this.isNarrationMandatory = false;
          }
        }
      });

    this.paymentFacade
      .getIsAddGhsPaymentSuccess()
      .pipe(
        withLatestFrom(this.paymentFacade.getGhsResponse()),
        takeUntil(this.destroy$)
      )
      .subscribe(([val1, val2]) => {
        if (val1) {
          if (
            (val2?.otherDetails?.data?.isSameCustomerAccount &&
              val2?.otherDetails?.data?.customerId !== this.customerId) ||
            (val2?.instrumentType === PaymentModeEnum.RIVAAH_ACCOUNT &&
              val2?.otherDetails?.data?.isRivaahDiscountApplicable) ||
            (val2?.instrumentType !== PaymentModeEnum.RIVAAH_ACCOUNT &&
              val2?.otherDetails?.data?.bonus !== 0)
          ) {
            this.reloadCustomerForGHS = true;
            this.reloadCM();
          }
        }
      });

    this.paymentFacade
      .getDeletedPayment()
      .pipe(
        withLatestFrom(this.discountFacade.getDeletedDiscount()),
        takeUntil(this.destroy$)
      )
      .subscribe(([paymentDetails, discountDetails]) => {
        if (paymentDetails) {
          if (
            paymentDetails?.paymentCode === PaymentModeEnum.DIGI_GOLD_TANISHQ ||
            paymentDetails?.paymentCode === PaymentModeEnum.GHS_ACCOUNT ||
            (paymentDetails?.paymentCode === PaymentModeEnum.CREDIT_NOTE &&
              paymentDetails?.instrumentType ===
                ConfigTypeEnum.DIGI_GOLD_TANISHQ) ||
            paymentDetails?.otherDetails?.data?.isRivaahGhsDiscountRefresh ||
            (discountDetails?.discountType ===
              DiscountTypeEnum.DIGI_GOLD_DISCOUNT &&
              discountDetails?.referenceId.toUpperCase() ===
                paymentDetails?.id.toUpperCase())
          ) {
            this.reloadCM();
          }
          if (
            paymentDetails?.paymentCode === PaymentModeEnum.CREDIT_NOTE &&
            paymentDetails?.otherDetails?.data?.isRateProtectedCN
          ) {
            this.updatePrice(true);
          }
        }
      });

    this.discountFacade
      .getSaveRivaahGHSDiscountsResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          if (data.length !== 0) {
            this.reloadCM();
          } else {
            this.showSimpleNotifications('pw.discount.noRivaahGhsDiscountsMsg');
            this.discountFacade.setEnableCalculateRivaahGHSDiscounts(false);
          }
        }
      });

    combineLatest([
      this.discountFacade
        .getAppliedSystemDvDiscounts()
        .pipe(takeUntil(this.destroy$)),
      this.discountFacade
        .getAppliedBillLevelTransactionLevelDiscounts()
        .pipe(takeUntil(this.destroy$)),
      this.discountFacade
        .getAppliedSystemGhsDiscounts()
        .pipe(takeUntil(this.destroy$))
    ]).subscribe(
      ([systemDvDiscounts, billLevleDiscounts, systemGhsBonusDiscounts]) => {
        if (
          systemDvDiscounts.length > 0 ||
          billLevleDiscounts.length > 0 ||
          systemGhsBonusDiscounts.length > 0
        ) {
          this.enableDiscountUpdate = false;
        } else this.enableDiscountUpdate = true;
      }
    );

    this.discountFacade
      .getEnableCalculateRivaahGHSDiscounts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.enableCalculateRivaahGhsDiscount = data;
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.TCS_TO_BE_COLLECTED
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(tcsAmount => {
        this.tcsToBeCollectedAtCM = tcsAmount;
      });
  }

  reloadCM() {
    if (this.cashMemoId) {
      const tempId = this.cashMemoId;
      this.reloadCMFlag = true;
      this.commonFacade.clearTransactionTD();
      this.cashMemoFacade.viewCashMemo({
        id: tempId,
        txnType: TransactionTypeEnum.CM,
        subTxnType: SubTransactionTypeEnum.NEW_CM
      });
      this.commonFacade.setTransactionTD(tempId);
      this.discountFacade.setRefreshDiscountsAndOffersPanel(true);
    }
  }

  getCashMemoReponse() {
    this.cashMemoFacade
      .getCreateCashMemoResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: CreateCashMemoResponse) => {
        if (data) {
          this.cashMemoId = data.id;
          this.commonFacade.setFileUploadVisible(true);
          this.status = StatusTypesEnum.OPEN;
          this.commonFacade.setTransactionTD(data.id);
          this.commonFacade.setCMOrderNumber({
            orderNo: data.docNo,
            status: this.status
          });

          this.reloadOpenAndHoldValues(false);
          if (!this.isWithoutCustomerFlag) {
            if (!this.isABinvokedFirstTime)
              this.discountFacade.loadDiscountTypes(discountTypeCode);
            this.isCustomerUpdate = true;
            this.isTCSUpdate = false;
            this.isItemUpdate = false;
            this.cashMemoFacade.partialUpdateCashMemo({
              id: this.cashMemoId,
              requestDetails: {
                customerId: this.customerId
              },
              txnType: TransactionTypeEnum.CM,
              subTxnType: SubTransactionTypeEnum.NEW_CM
            });
          }
          this.addStopTracking(
            'pw.instrumentationMessges.creatingOpenOrderMsg'
          );
        }
      });

    this.cashMemoFacade
      .getViewCashMemoResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: CashMemoDetailsResponse) => {
        if (
          data?.isIGST &&
          data.isIGST !== null &&
          this.isIGSTSelected !== data?.isIGST
        ) {
          this.isIGSTSelected = data?.isIGST !== null ? data.isIGST : false;
          this.commonFacade.setIsIGSTFlag(this.isIGSTSelected);
        }
        this.discountDetails = data?.discountDetails?.data;
        this.commonFacade.setDiscountDetails(data?.discountDetails);
        this.cmDetails = data;
        this.viewData = data;
        if (
          data &&
          data.tcsToBeCollected !== 0 &&
          data.tcsToBeCollected !== null &&
          data.tcsToBeCollected !== undefined
        ) {
          this.commonFacade.setTcsAmount(data.tcsToBeCollected);
        }
        this.commonFacade.setCMOtherCharges(data?.otherChargesList);
        this.discountFacade.clearOrderDiscDetails();
        this.discountFacade.setOrderDiscDetails(data);
        if (data) {
          if (this.reloadCMFlag) {
            if (
              this.reloadCustomerForGHS &&
              data.customerId &&
              data.customerId !== this.customerId
            ) {
              this.updateCustomerForGHS = true;
              if (
                data.status === StatusTypesEnum.HOLD ||
                data.status === StatusTypesEnum.OPEN
              ) {
                this.customerFacade.loadSelectedCustomer(
                  String(data.customerId),
                  true,
                  true,
                  true,
                  true
                );
              }
            }
            this.productFacade.setItemIDList({
              item: data,
              isUpdate: false,
              isGetHeaderDetails: false,
              loadAutoDiscounts: this.loadAutoDiscounts
            });
            this.reloadCMFlag = false;
            this.loadAutoDiscounts = false;
            this.reloadCustomerForGHS = false;
          } else {
            this.cashMemoId = data.id;
            this.status = data.status;
            if (data.refTxnId !== null) {
              this.isABinvoked = true;
              this.cashMemoFacade.setIsABInvoked(true);
            }
            this.commonFacade.setFileUploadVisible(true);
            this.commonFacade.setCMOrderNumber({
              orderNo: data.docNo,
              status: data.status
            });
            this.selectedOccasion = data.occasion;
            this.selectedOccasion$.next(data.occasion);
            this.selectedEncircleData = data.discountDetails
              ? data.discountDetails?.data?.encircleDetails?.discountType
              : null;
            this.selectedEncircleDataToRevertBack = this.selectedEncircleData;
            // null or some data
            this.selectedEncircle$.next(this.selectedEncircleData);
            this.discountFacade.setEncircle(this.selectedEncircleData);
            this.customerId = data.customerId;
            this.lastHoldTime = data.lastHoldTime;
            if (data.refTxnType === TransactionTypeEnum.AB) {
              this.loadABDetails = true;
              this.advanceBookingFacade.viewCashMemo({
                id: data.refTxnId,
                txnType: data.refTxnType,
                subTxnType: data.refSubTxnType
              });
              this.commonFacade.setTransactionConfig({
                isPaymentEditable: true,
                transactionType: {
                  type: TransactionTypeEnum.CM,
                  subType: SubTransactionTypeEnum.NEW_CM
                },
                transactionIDPresent: true,
                taxTransactionType: TransactionTypeEnum.CUST_TRANSACTION_CM,

                refTxnType: TransactionTypeEnum.AB
              });
            } else {
              this.commonFacade.setTransactionConfig({
                isPaymentEditable: true,
                transactionType: {
                  type: TransactionTypeEnum.CM,
                  subType: SubTransactionTypeEnum.NEW_CM
                },
                transactionIDPresent: true,
                taxTransactionType: TransactionTypeEnum.CUST_TRANSACTION_CM
              });
              if (this.status === StatusTypesEnum.HOLD) {
                this.summaryBarRemarks$.next(data.remarks);
                if (data.customerId) {
                  this.customerFacade.loadSelectedCustomer(
                    String(data.customerId),
                    false
                  );
                }
                if (
                  this.expireTime(data.lastHoldTime) ===
                  ValidationTypesEnum.EXPIRED
                ) {
                  this.updatePrice(false);
                } else {
                  this.productFacade.resetItemIdList();
                  this.productFacade.setItemIDList({
                    item: data,
                    isUpdate: false
                  });
                  this.productFacade.setStandardPrice(
                    data.metalRateList.metalRates
                  );
                }
              } else if (this.status === StatusTypesEnum.OPEN) {
                this.updatePrice(false);
                if (data.customerId) {
                  this.customerFacade.loadSelectedCustomer(
                    String(data.customerId)
                  );
                }
              }
            }
            this.addStopTracking(
              'pw.instrumentationMessges.invokeOpenHoldOrderMsg'
            );
          }
        }
      });

    this.cashMemoFacade
      .getInvokeOrderDetailsResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: CashMemoDetailsResponse) => {
        if (data) {
          this.cmDetails = data;
          if (data.refTxnId !== null) {
            this.isABinvoked = true;
            this.cashMemoFacade.setIsABInvoked(true);
            this.productFacade.setIsABInvokedFirstTime(true);
          }
          if (this.abDetails.isBestRate) {
            this.productFacade.setStandardPrice(
              this.cmDetails?.metalRateList?.metalRates
            );
          }
          if (this.isABinvokedFirstTime)
            this.discountFacade.loadDiscountTypes(discountTypeCode);
          this.cashMemoId = data.id;
          this.commonFacade.setFileUploadVisible(true);
          this.status = data.status;
          this.commonFacade.setCMOrderNumber({
            orderNo: data.docNo,
            status: data.status
          });
          this.discountFacade.clearOrderDiscDetails();
          this.discountFacade.setOrderDiscDetails(data);
          this.customerId = data.customerId;
          this.commonFacade.setTransactionConfig({
            isPaymentEditable: true,
            transactionType: {
              type: TransactionTypeEnum.CM,
              subType: SubTransactionTypeEnum.NEW_CM
            },
            taxTransactionType: TransactionTypeEnum.CUST_TRANSACTION_CM,
            refTxnType: TransactionTypeEnum.AB
          });
          this.commonFacade.setTransactionTD(data.id);
          if (data.itemIdList.length) {
            this.productFacade.resetItemIdList();
            this.productFacade.setItemIDList({ item: data, isUpdate: false });
          } else {
            this.openErrorMsgForOrder('pw.regularCashMemo.reserveBinErrorMsg');
          }
          this.addStopTracking(
            'pw.instrumentationMessges.invokeOpenOrderDetailsMsg'
          );
        }
      });

    this.cashMemoFacade
      .getUpdatePriceDetailsResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (priceData: {
          data: CashMemoDetailsResponse;
          requestDetails: boolean;
        }) => {
          if (priceData) {
            this.cmDetails = priceData.data;
            if (this.abDetails?.isBestRate) {
              this.productFacade.setStandardPrice(
                this.cmDetails?.metalRateList?.metalRates
              );
            }
            if (
              this.expireTime(this.lastHoldTime) ===
                ValidationTypesEnum.EXPIRED &&
              this.status === StatusTypesEnum.HOLD &&
              this.cmHoldTimeInMinutes
            ) {
              if (this.isNoCustomerDependentPayment) {
                const goldRateChangeMsg =
                  'pw.regularCashMemo.goldRateChangeMsg';
                this.errorNotifications(goldRateChangeMsg);
              }
            }
            if (!priceData.requestDetails) this.productFacade.resetItemIdList();
            this.productFacade.setItemIDList({
              item: priceData.data,
              isUpdate: priceData.requestDetails
            });
            this.productFacade.setStandardPrice(
              this.cmDetails?.metalRateList?.metalRates
            );
          }
        }
      );

    this.cashMemoFacade
      .getPartialUpdateCashMemoResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: CashMemoDetailsResponse) => {
        if (data) {
          this.cmDetails = data;
          if (data.hasError) {
            this.commonFacade.setPartialCmDetails(null);
            if (data.customerId && this.isCustomerUpdate) {
              this.hasErrorWhileUpdating = true;
              this.customerFacade.loadSelectedCustomer(
                String(data.customerId),
                true,
                true,
                true,
                true
              );
            }
            this.selectedOccasion$.next(data.occasion);
            this.selectedEncircle$.next(this.selectedEncircleDataToRevertBack);
          } else {
            this.commonFacade.setPartialCmDetails(data);
            if (data.tcsToBeCollected === 0 || data.tcsToBeCollected === null) {
              this.commonFacade.setTcsAmount(0);
            }

            this.reloadOpenAndHoldValues(false);
            if (this.isEncircleAdded) {
              this.selectedEncircleData = data.discountDetails
                ? data.discountDetails?.data?.encircleDetails?.discountType
                : null;
              this.discountFacade.setEncircle(this.selectedEncircleData);
              this.selectedEncircleDataToRevertBack = this.selectedEncircleData;

              this.discountFacade.loadAppliedTransactionLevelDiscounts({
                transactionId: this.cashMemoId,
                txnType: TransactionTypeEnum.CM,
                subTxnType: SubTransactionTypeEnum.NEW_CM
              });

              this.discountDetails = data?.discountDetails?.data;
            }
            if (
              this.isCustomerUpdate ||
              this.isTCSUpdate ||
              this.isItemUpdate
            ) {
              this.productFacade.setItemIDList({ item: data, isUpdate: true });
              if (this.customerId && this.isCustomerUpdate) {
                this.customerFacade.loadSelectedCustomerDetail(
                  String(this.customerId),
                  false
                );
              }
            }
            if (this.isAbFlag) {
              this.isAbFlag = false;
              this.addStartTracking(
                'pw.instrumentationMessges.invokeOpenOrderDetailsMsg'
              );
              this.cashMemoFacade.invokeOrderDetails({
                txnType: TransactionTypeEnum.CM,
                subTxnType: SubTransactionTypeEnum.NEW_CM,
                requestDetails: {
                  cashMemoId: this.cashMemoId,
                  itemIds: this.itemIdList,
                  orderId: this.abId
                }
              });
            }

            if (this.isEncircleAdded)
              this.addStopTracking(
                'pw.instrumentationMessges.selectEncircleDiscountMsg'
              );
            else if (this.selectedOccasion)
              this.addStopTracking(
                'pw.instrumentationMessges.selectOccaionMsg'
              );
          }
        }
      });

    this.cashMemoFacade
      .getUpdateCashMemoResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: CashMemoDetailsResponse) => {
        if (data) {
          const successKey1 = 'pw.regularCashMemo.updateCMSuccessMessage1';
          const successKey2 = 'pw.regularCashMemo.updateCMSuccessMessage2';
          this.updateCashMemoNotification(successKey1, successKey2, data.docNo);
          this.reloadOpenAndHoldValues();
          this.addStopTracking('pw.instrumentationMessges.holdCMOrderMsg');
        }
      });

    this.orderConfirmationFacade
      .confirmCashMemoResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: AdvanceBookingDetailsResponse) => {
        if (data && data.status === StatusTypesEnum.CONFIRMED) {
          this.rivaahGenerated = data?.isRivaah;
          this.confirmedCashmemoDoc = data.docNo;
          this.orderStatus = StatusTypesEnum.CONFIRMED;
          this.paymentFacade.loadPaymentDetails({
            transactionId: this.cashMemoId,
            transactionType: TransactionTypeEnum.CM,
            subTransactionType: SubTransactionTypeEnum.NEW_CM
          });
          if (data.creditNotes !== null && data.creditNotes.length !== 0) {
            this.cnNos = data.creditNotes;
          }
          this.showSuccessMessageNotification();
          this.addStopTracking('pw.instrumentationMessges.confirmCMOrderMsg');
        }
      });

    this.cashMemoFacade
      .getDeleteCashMemoResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: boolean) => {
        if (data !== false) {
          const successKey = 'pw.regularCashMemo.deleteCMSuccessMessage';
          this.deleteCashMemoNotification(successKey);
          this.reloadOpenAndHoldValues();
          this.addStopTracking('pw.instrumentationMessges.deleteCMOrderMsg');
        }
      });

    this.advanceBookingFacade
      .getViewCashMemoResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: AdvanceBookingDetailsResponse) => {
        if (data) {
          this.abDetails = data;
          this.commonFacade.loadMetalTypes();
          this.commonFacade.setAbDetails(data);
          this.commonFacade.disableFullPaymentCheck(true);
          if (
            data.status === StatusTypesEnum.CONFIRMED ||
            data.status === StatusTypesEnum.PARTIAL_INVOICE
          ) {
            if (this.abDetails.isFrozenRate) {
              this.productFacade.setStandardPrice(
                data.metalRateList.metalRates
              );
            } else if (this.abDetails.isBestRate) {
              this.productFacade.setStandardPrice(
                this.cmDetails?.metalRateList?.metalRates
              );
            }
          }
          if (!this.loadABDetails) {
            this.abId = data.id;
            this.itemIdList = data.itemIdList;

            if (
              data.status === StatusTypesEnum.CONFIRMED ||
              data.status === StatusTypesEnum.PARTIAL_INVOICE
            ) {
              if (this.cashMemoId === null) {
                this.isAbFlag = true;
                if (data.customerId) {
                  this.customerFacade.loadSelectedCustomer(
                    String(data.customerId),
                    false
                  );
                }
              } else {
                if (data.customerId) {
                  this.customerFacade.loadSelectedCustomer(
                    String(data.customerId),
                    false
                  );
                }
                this.cashMemoFacade.invokeOrderDetails({
                  txnType: TransactionTypeEnum.CM,
                  subTxnType: SubTransactionTypeEnum.NEW_CM,
                  requestDetails: {
                    cashMemoId: this.cashMemoId,
                    itemIds: this.itemIdList,
                    orderId: this.abId
                  }
                });
              }
            }
          } else {
            if (this.status === StatusTypesEnum.HOLD) {
              this.summaryBarRemarks$.next(this.viewData?.remarks);
              if (this.viewData?.customerId) {
                this.customerFacade.loadSelectedCustomer(
                  String(this.viewData?.customerId),
                  false
                );
              }

              if (
                this.expireTime(this.lastHoldTime) ===
                  ValidationTypesEnum.EXPIRED &&
                !this.abDetails.isFrozenRate
              ) {
                this.updatePrice(false);
              } else {
                this.productFacade.resetItemIdList();
                this.productFacade.setItemIDList({
                  item: this.viewData,
                  isUpdate: false
                });
                this.productFacade.setStandardPrice(
                  this.cmDetails?.metalRateList?.metalRates
                );
              }
            } else if (this.status === StatusTypesEnum.OPEN) {
              if (this.viewData?.customerId) {
                this.customerFacade.loadSelectedCustomer(
                  String(this.viewData?.customerId),
                  false
                );
              }
              if (!this.abDetails.isFrozenRate) this.updatePrice(false);
              else {
                this.productFacade.resetItemIdList();
                this.productFacade.setItemIDList({
                  item: this.viewData,
                  isUpdate: false
                });
              }
            }
          }
          this.loadABDetails = false;
        }
      });
  }

  getCustomerResponse() {
    combineLatest([
      this.customerFacade
        .getCustomerLoyaltyDetail()
        .pipe(takeUntil(this.destroy$)),
      this.discountFacade.getDiscountTypes().pipe(takeUntil(this.destroy$))
    ]).subscribe(([loyaltyDetails, discountList]) => {
      if (loyaltyDetails && discountList.length !== 0) {
        this.discountList = discountList;
        this.customerLoyaltyDetails = loyaltyDetails;
      }
    });

    this.customerFacade
      .getSelectSelectedCustomer()
      .pipe(takeUntil(this.destroy$))
      .subscribe(customer => {
        if (customer) {
          if (customer.ulpId) {
            this.customerFacade.loadSelectedCustomerDetail(
              String(customer.customerId),
              customer?.isCalledFromCustomer
            );
          }
          const tempCustomerId = this.customerId;
          this.customerId = customer.customerId;
          this.customer = customer;
          const tempCustomerState = this.customerState;
          this.customerState = customer.customerDetails.data.state;
          this.customerMobileNumber = customer.mobileNumber;
          this.customerName = customer.customerName;
          this.customerPAN = customer.custTaxNo;
          this.gstNumber = customer.instiTaxNo;
          this.idProof = customer.customerDetails.data.idProof;
          this.customerType = customer.customerType;
          this.passportId = customer?.passportId;
          this.form60Submitted =
            customer.customerDetails.data.form60AndIdProofSubmitted;
          if (tempCustomerId !== this.customerId) {
            this.commonFacade.setIsIGSTFlag(false);
          }
          if (tempCustomerId === this.customerId) {
            if (
              tempCustomerState !== null &&
              tempCustomerState !== this.customerState
            ) {
              this.commonFacade.setIsIGSTFlag(false);
            }
          }
          if (customer.customerId !== null) {
            if (this.cashMemoId === null) {
              this.addStartTracking(
                'pw.instrumentationMessges.creatingOpenOrderMsg'
              );
              this.cashMemoFacade.createCashMemo({
                txnType: TransactionTypeEnum.CM,
                subTxnType: SubTransactionTypeEnum.NEW_CM
              });
            } else {
              if (
                this.status === StatusTypesEnum.OPEN &&
                tempCustomerId !== this.customerId &&
                !this.updateCustomerForGHS &&
                !this.hasErrorWhileUpdating
              ) {
                this.isCustomerUpdate = true;
                this.isTCSUpdate = false;
                this.isItemUpdate = false;
                this.cashMemoFacade.partialUpdateCashMemo({
                  id: this.cashMemoId,
                  requestDetails: {
                    customerId: this.customerId
                  },
                  txnType: TransactionTypeEnum.CM,
                  subTxnType: SubTransactionTypeEnum.NEW_CM,
                  oldData: this.cmDetails
                });
              } else {
                if (this.updateCustomerForGHS)
                  this.updateCustomerForGHS = false;
                if (this.hasErrorWhileUpdating) {
                  this.hasErrorWhileUpdating = false;
                }
                this.addStopTracking(
                  'pw.instrumentationMessges.clearUpdateCustomerMsg'
                );
              }
              if (!this.isABinvokedFirstTime)
                this.discountFacade.loadDiscountTypes(discountTypeCode);
            }
          }
          this.commonFacade.loadCMOccasions(occasionTypeCode);
        } else {
          if (this.customerId !== null)
            this.addStartTracking(
              'pw.instrumentationMessges.clearUpdateCustomerMsg'
            );
          this.customerPAN = null;
          this.customerType = null;
          this.passportId = null;
          this.gstNumber = null;
          this.idProof = null;
          //this.form60Submitted = null;
          if (!this.hasErrorWhileUpdating) {
            this.clearOccasion$.next();
            this.clearOccasionIcon$.next();
            this.clearEncircle$.next();
            this.customerId = null;
            this.customer = null;
          }
          this.customerLoyaltyDetails = null;
          if (
            this.selectedEncircleData &&
            this.cashMemoId &&
            !this.hasErrorWhileUpdating
          ) {
            this.discountFacade.removeAllAppliedTransactionLevelDiscounts({
              discountType: this.selectedEncircleData,
              subTxnType: SubTransactionTypeEnum.NEW_CM,
              transactionId: this.cashMemoId,
              txnType: TransactionTypeEnum.CM
            });
          }
          if (
            this.selectedOccasion &&
            this.cashMemoId &&
            !this.hasErrorWhileUpdating
          ) {
            this.isCustomerUpdate = false;
            this.isTCSUpdate = false;
            this.cashMemoFacade.partialUpdateCashMemo({
              id: this.cashMemoId,
              requestDetails: {
                occasion: ''
              },
              txnType: TransactionTypeEnum.CM,
              subTxnType: SubTransactionTypeEnum.NEW_CM,
              oldData: this.cmDetails
            });
            this.selectedOccasion = null;
          }
        }
      });
  }

  printLastTransaction() {
    this.printingFacade.loadLastTransactionId({
      searchValue: '',
      status: StatusTypesEnum.CONFIRMED,
      txnType: TransactionTypeEnum.CM,
      subTxnType: SubTransactionTypeEnum.NEW_CM,
      pageIndex: 0,
      pageSize: 1
    });
    this.printingFacade
      .getLastTransactionId()
      .pipe(takeUntil(this.destroy$))
      .subscribe(lastTransactionId => {
        if (lastTransactionId) {
          this.postConfirmationActions
            .open()
            .pipe(takeUntil(this.destroy$))
            .subscribe(res => {
              if (res) {
                let action = '';
                switch (res) {
                  case 'print': {
                    action = InvoiceDeliveryTypes.PRINT;
                    break;
                  }
                  case 'mail': {
                    action = InvoiceDeliveryTypes.MAIL;
                    break;
                  }
                  case 'both': {
                    action = InvoiceDeliveryTypes.BOTH;
                    break;
                  }
                }
                this.addStartTracking(
                  'pw.instrumentationMessges.printCMOrderMsg'
                );
                this.checkItemsAvalilableForCOA();
                this.printingService.loadPrintData({
                  printType: printTypesEnum.CM_PRINTS,
                  transacionId: lastTransactionId,
                  transacionType: printTransactionTypesEnum.SALES,
                  printFileType: printFileTypeEnum.INVOICE_PRINT,
                  doctype: printDocTypeEnum.CUSTOMER_PRINT,
                  reprint: false,
                  lastTransactionPrint: true,
                  customerId: this.customerId,
                  invoiceType: action
                });
              }
            });
        }
      });
  }

  print() {
    this.isLastTransactionPrint = false;
    if (this.cashMemoId) {
      this.postConfirmationActions
        .open()
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          if (res) {
            this.printActions = res;
            let action = '';
            switch (res) {
              case 'print': {
                action = InvoiceDeliveryTypes.PRINT;
                break;
              }
              case 'mail': {
                action = InvoiceDeliveryTypes.MAIL;
                break;
              }
              case 'both': {
                action = InvoiceDeliveryTypes.BOTH;
                break;
              }
            }
            this.action = action;
            this.addStartTracking('pw.instrumentationMessges.printCMOrderMsg');
            this.checkItemsAvalilableForCOA();
            this.printCM(action);
          }
        });
    }
  }

  printCM(action) {
    this.printingService.loadPrintData({
      printType: printTypesEnum.CM_PRINTS,
      transacionId: this.cashMemoId,
      transacionType: printTransactionTypesEnum.SALES,
      printFileType: printFileTypeEnum.INVOICE_PRINT,
      doctype: printDocTypeEnum.CUSTOMER_PRINT,
      reprint: false,
      customerId: this.customerId,
      invoiceType: action
    });
    if (this.cmDetails?.refTxnId) {
      this.isPrintCM = true;
    }
  }

  printPartialAB(action) {
    if (this.newlyGeneratedCn) {
      this.printingService.loadPrintData({
        printType: printTypesEnum.AB_PRINTS,
        transacionId: this.cmDetails.refTxnId,
        transacionType: printTransactionTypesEnum.SALES,
        printFileType: printFileTypeEnum.INVOICE_PRINT,
        doctype: printDocTypeEnum.CUSTOMER_PRINT,
        reprint: true,
        customerId: this.customerId,
        invoiceType: action
      });
      this.isPrintCM = false;
    }
  }

  printCOA(item) {
    this.printingService.loadPrintData({
      printType: printTypesEnum.COA,
      transacionId: this.cashMemoId,
      transacionType: printTransactionTypesEnum.SALES,
      printFileType: printFileTypeEnum.INVOICE_PRINT,
      doctype: printDocTypeEnum.GURANTEE_CARD,
      reprint: false,
      invoiceType: InvoiceDeliveryTypes.PRINT,
      customerId: this.customerId
      //productCode: item
    });
  }

  printCN(item) {
    this.printingService.loadPrintData({
      printType: printTypesEnum.CREDIT_NOTE,
      transacionId: this.cashMemoId,
      transacionType: printTransactionTypesEnum.SALES,
      printFileType: printFileTypeEnum.INVOICE_PRINT,
      doctype: printDocTypeEnum.CUSTOMER_PRINT,
      reprint: false,
      invoiceType: InvoiceDeliveryTypes.PRINT,
      customerId: this.customerId
      //productCode: item.otherDetails.data.newCnId
    });
  }

  printAnnexure() {
    this.COAItems = [];
    this.printingService.loadPrintData({
      printType: printTypesEnum.CM_ANNEXURE,
      transacionId: this.cashMemoId,
      transacionType: printTransactionTypesEnum.SALES,
      printFileType: printFileTypeEnum.INVOICE_PRINT,
      doctype: printDocTypeEnum.CUSTOMER_PRINT,
      reprint: false,
      customerId: this.customerId,
      invoiceType: InvoiceDeliveryTypes.PRINT
    });

    // Todo : Integrate Print Service.
  }

  showAlertPopUp(message: string) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.INFO,
        message
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  /**
   * to display error message
   * @param error : error from api
   */
  errorHandler(error: CustomErrors) {
    this.clearLogData();
    if (error.code === ErrorEnums.ERR_SALE_045) {
      const key = 'pw.regularCashMemo.holdExpiredMsg';
      this.expireNotifications(key);
    } else if (error.code === ErrorEnums.ERR_SALE_008) {
      const key = 'pw.regularCashMemo.metalRateChangedMsg';
      this.expireNotifications(key);
      /**
       * // TODO: To removed after SSE implementation
       * Server side events
       */
      this.toolbarFacade.loadMetalPriceDetails();
    } else if (error.code === ErrorEnums.ERR_QZ_TRAY) {
      this.printError(error.message);
    } else if (error.code === ErrorEnums.ERR_SALE_089) {
      let key = '';
      if (this.searchABFlag) {
        key = 'pw.regularCashMemo.itemAlreadyPresentMsg';
      } else {
        key = 'pw.regularCashMemo.itemPresentMsg';
      }
      this.errorNotifications(key);
    } else if (error.code === ErrorEnums.ERR_SALE_084) {
      this.toolbarFacade.loadMetalPriceDetails();
      this.openConfirmDialogForPayment(error.dynamicValues?.paymentCodes);
      this.commonFacade.setCMErrorInUpdatePrice(true);
      this.productFacade.resetItemIdList();
      this.productFacade.setItemIDList({
        item: this.viewData,
        isUpdate: false
      });
    } else if (error.code === ErrorEnums.ERR_INV_014) {
      const key = 'pw.regularCashMemo.itemDetailsNAMsg';
      this.errorNotifications(key);
    } else if (error.code === ErrorEnums.ERR_CUST_001) {
      this.customerService.open({
        customerType: this.customerType,
        customerId: this.customerId
      });
      if (this.isAdvancebookingType) {
        const customerMissingForABError =
          'pw.regularCashMemo.customerMissingForABError';
        this.errorNotifications(customerMissingForABError);
      }
    } else {
      this.overlayNotification
        .show({
          type: OverlayNotificationType.ERROR,
          hasClose: true, // optional
          error: error
        })
        .events.pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          if (this.orderStatus === StatusTypesEnum.CONFIRMED) {
            this.showSuccessMessageNotification();
          } else if (
            error.code === ErrorEnums.ERR_SALE_053 ||
            error.code === ErrorEnums.ERR_SALE_390
          ) {
            this.clearPage(true);
            this.reloadOpenAndHoldValues();
            this.router.navigate([getCashMemoUrl()]);
          }
        });
    }
  }

  showNotifications(key: string) {
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SUCCESS,
            message: translatedMsg,
            hasClose: true
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.clearPage(true);
            this.router.navigate([getCashMemoUrl()]);
          });
      });
  }

  showSimpleNotifications(key: string) {
    const selectErrorkey = key;
    this.translate
      .get(selectErrorkey)
      .pipe(take(1))
      .subscribe((translatedMsg: any) => {
        this.overlayNotification.show({
          type: OverlayNotificationType.SIMPLE,
          hasClose: true,
          message: translatedMsg,
          hasBackdrop: true
        });
      });
  }

  // update selected occasion in CM
  selectedOccasionEmit(occasionEvent: string) {
    if (occasionEvent !== this.selectedOccasion) {
      this.addStartTracking('pw.instrumentationMessges.selectOccaionMsg');
      this.selectedOccasion = occasionEvent;
      this.isCustomerUpdate = false;
      this.isTCSUpdate = false;
      this.isItemUpdate = false;
      this.cashMemoFacade.partialUpdateCashMemo({
        id: this.cashMemoId,
        requestDetails: {
          occasion: this.selectedOccasion
        },
        txnType: TransactionTypeEnum.CM,
        subTxnType: SubTransactionTypeEnum.NEW_CM,
        oldData: this.cmDetails
      });
    }
  }

  selectedEncircle(encircleEvent: string) {
    const tcsPayment = this.paymentDetails.find(
      value => value.isTcsPayment === true
    );
    if (
      (this.selectedEncircleData && encircleEvent === undefined) ||
      encircleEvent !== this.selectedEncircleData
    ) {
      if (this.tcsToBeCollectedAtCM !== 0 && tcsPayment) {
        this.alertPopupService
          .open({
            type: AlertPopupTypeEnum.INFO,
            message: 'pw.payment.deleteTcsPaymentLabel'
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe(res => {
            this.resetEncircle$.next(this.selectedEncircleData);
          });
      } else if (this.tcsToBeCollectedAtCM !== 0 && !tcsPayment) {
        this.resetTcsAmountPopup();
      } else {
        // undefined or some data
        if (this.selectedEncircleData && encircleEvent === undefined) {
          this.discountFacade.removeAllAppliedTransactionLevelDiscounts({
            discountType: this.selectedEncircleData,
            subTxnType: SubTransactionTypeEnum.NEW_CM,
            transactionId: this.cashMemoId,
            txnType: TransactionTypeEnum.CM
          });
        } else if (encircleEvent !== this.selectedEncircleData) {
          this.addStartTracking(
            'pw.instrumentationMessges.selectEncircleDiscountMsg'
          );
          this.isEncircleAdded = true;
          this.isCustomerUpdate = false;
          this.isTCSUpdate = false;
          this.isItemUpdate = false;
          this.cashMemoFacade.partialUpdateCashMemo({
            id: this.cashMemoId,
            requestDetails: {
              discountTxnDetails: {
                data: {
                  encircleDetails: {
                    discountType: encircleEvent
                  }
                },
                type: 'DISCOUNT_TXN_DETAILS'
              }
            },
            txnType: TransactionTypeEnum.CM,
            subTxnType: SubTransactionTypeEnum.NEW_CM,
            oldData: this.cmDetails
          });
        }
      }
    }
  }

  errorNotifications(errorKey: string) {
    const key = errorKey;
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage,
            hasClose: true,
            hasBackdrop: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe();
      });
  }

  updateCashMemoNotification(
    successKey1: string,
    successKey2: string,
    docNo: number
  ) {
    this.translate
      .get([successKey1, successKey2])
      .pipe(take(1))
      .subscribe((translatedMessages: any) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessages[successKey1] + docNo,
            // translatedMessages[successKey2],
            hasClose: true,
            hasBackdrop: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            if (event.eventType === OverlayNotificationEventType.CLOSE) {
              this.clearPage(true);
              this.router.navigate([getCashMemoUrl()]);
            }
          });
      });
  }

  deleteCashMemoNotification(successKey: string) {
    this.translate
      .get(successKey)
      .pipe(take(1))
      .subscribe((translatedMessage: any) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage,
            hasClose: true,
            hasBackdrop: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            if (event.eventType === OverlayNotificationEventType.CLOSE) {
              this.clearPage(true);
              this.router.navigate([getCashMemoUrl()]);
            }
          });
      });
  }

  // clears the entire page
  clearPage(clearTransactionID: boolean) {
    if (clearTransactionID) {
      this.commonFacade.clearTransactionTD();
      this.productFacade.clearProductGrid();
      this.productFacade.setStandardPrice(this.standardPrice);
      // reset FOC
      this.focFacade.resetFOCData();
      this.focFacade.clearFocSchemesForItems();
      this.toolbarFacade.loadMetalPriceDetails();
    }
    this.isCOAPrinting = false;
    this.isCNPrinting = false;
    this.COAItems = [];
    this.commonFacade.setCMOtherCharges(null);
    this.discountFacade.clearTransactionLevelDiscountDetails();
    this.discountFacade.setRefreshDiscountsAndOffersPanel(true);
    this.commonFacade.setFileUploadVisible(false);
    this.clearEncircle$.next();
    this.clearOccasion$.next();
    this.clearOccasionIcon$.next();
    this.commonFacade.clearCashMemo();
    this.commonFacade.closeTolerance(true);
    this.cashMemoFacade.resetValues();
    this.advanceBookingFacade.resetValues();
    this.customerId = null;
    this.customer = null;
    this.customerState = null;
    this.selectedOccasion = null;
    this.cashMemoId = null;
    this.customerFacade.clearCustomerSearch();
    this.overlayNotification.close();
    this.confirmedCashmemoDoc = 0;
    this.commonFacade.setCMOrderNumber({ orderNo: 0, status: null });
    this.summaryBarRemarks$.next('');
    this.isNarrationMandatory = false;
    this.orderConfirmationFacade.resetValues();
    this.status = null;
    this.isWithoutCustomerFlag = false;
    this.isProfileMatched = false;
    this.isAbFlag = false;
    this.clearForm$.next();
    this.abId = null;
    this.itemIdList = [];
    this.abDetails = null;
    this.cmDetails = null;
    this.commonFacade.clearTolerance();
    this.commonFacade.clearCMGrfTolerance();
    this.commonFacade.clearCMGrnTolerance();
    this.commonFacade.setAbDetails(null);
    this.commonFacade.disableFullPaymentCheck(false);
    this.searchABFlag = false;
    this.lastHoldTime = null;
    this.viewData = null;
    this.customerName = null;
    this.loadABDetails = false;
    this.metalType.patchValue(null);
    this.cnNos = [];
    this.isEncircleAdded = false;
    this.selectedEncircleData = null;
    this.discountFacade.clearEncircleAdded();
    this.customerLoyaltyDetails = null;
    this.orderStatus = null;
    this.isABinvoked = false;
    this.isABinvokedFirstTime = false;
    this.discountFacade.clear();
    this.productFacade.setIsABInvokedFirstTime(false);
    this.cashMemoFacade.setIsABInvoked(false);
    this.isCustomerUpdate = false;
    this.isTCSUpdate = false;
    this.isItemUpdate = false;
    this.reloadCMFlag = false;
    this.updateCustomerForGHS = false;
    this.hasErrorWhileUpdating = false;
    this.fileFacade.resetFileType(true);
    this.discountFacade.clearOrderDiscDetails();
    this.commonFacade.clearTcsAmount();
    this.addStopTracking('pw.instrumentationMessges.clearCMOrderMsg');
    this.clearLogData();
    this.encircleDiscountSelectMsg = false;
    this.rivaahGenerated = false;
    this.loadAutoDiscounts = false;
    this.reloadCustomerForGHS = false;
    this.isCnRedeemed = false;
    this.isIGSTSelected = false;
    this.commonFacade.setIsIGSTFlag(false);
    this.selectedEncircleDataToRevertBack = null;
  }

  updatePrice(isUpdate: boolean) {
    if (this.cashMemoId !== null) {
      this.cashMemoFacade.updatePriceDetails({
        id: this.cashMemoId,
        txnType: TransactionTypeEnum.CM,
        subTxnType: SubTransactionTypeEnum.NEW_CM,
        requestDetails: isUpdate
      });
    }
  }

  loadOpenValues() {
    this.toolbarFacade.loadOpenOrdersCount({
      status: StatusTypesEnum.OPEN,
      txnType: TransactionTypeEnum.CM,
      subTxnType: SubTransactionTypeEnum.NEW_CM
    });
    this.toolbarFacade.loadOpenOrders({
      searchValue: '',
      status: StatusTypesEnum.OPEN,
      txnType: TransactionTypeEnum.CM,
      subTxnType: SubTransactionTypeEnum.NEW_CM,
      pageIndex: 0,
      pageSize: 10
    });
  }

  loadHoldValues() {
    this.toolbarFacade.loadOnHoldCount({
      status: StatusTypesEnum.HOLD,
      txnType: TransactionTypeEnum.CM,
      subTxnType: SubTransactionTypeEnum.NEW_CM
    });
    this.toolbarFacade.loadOnHold({
      searchValue: '',
      status: StatusTypesEnum.HOLD,
      txnType: TransactionTypeEnum.CM,
      subTxnType: SubTransactionTypeEnum.NEW_CM,
      pageIndex: 0,
      pageSize: 10
    });
  }

  expireTime(time: Moment) {
    const momentTime = moment(time);
    const currentTime = moment();
    const leftOverMinutes = currentTime.diff(moment(momentTime), 'minutes');

    if (leftOverMinutes <= this.cmHoldTimeInMinutes) {
      return currentTime
        .add(this.cmHoldTimeInMinutes - leftOverMinutes, 'minutes')
        .format('hh:mm A');
    } else {
      return ValidationTypesEnum.EXPIRED;
    }
  }

  expireNotifications(errorKey: string) {
    const key = errorKey;
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage,
            hasClose: true,
            hasBackdrop: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            if (event.eventType === OverlayNotificationEventType.CLOSE) {
              if (
                this.status === StatusTypesEnum.HOLD ||
                this.status === StatusTypesEnum.OPEN
              ) {
                if (this.isNoCustomerDependentPayment) {
                  this.updatePrice(true);
                } else {
                  this.openConfirmDialogForPayment([]);
                  this.commonFacade.setCMErrorInUpdatePrice(true);
                }
              }
            }
          });
      });
  }

  showSuccessMessageNotification() {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.CUSTOM,
        message: '',
        hasBackdrop: true,
        hasClose: true,
        template: this.confirmSuccessNotificationTemplate
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        this.clearPage(true);
        this.reloadOpenAndHoldValues();
        this.router.navigate([getCashMemoUrl()]);
      });
  }

  selectedDocNumber(event) {
    if (event.orderType === '2') {
      this.clearForm$.next();
      this.openErrorMsgForOrder('pw.regularCashMemo.docNumberNotAvailableMsg');
    } else {
      this.addStartTracking('pw.instrumentationMessges.searchOpenOrderMsg');
      this.searchABFlag = true;
      this.toolbarFacade.loadConfirmOrders({
        searchValue: Number(event.docNumber),
        status: null,
        txnType: TransactionTypeEnum.AB,
        fiscalYear: event.fiscalYear,
        customerName: this.customerName
      });
    }
  }

  openErrorMsgForOrder(message) {
    this.alertPopupService.open({
      type: AlertPopupTypeEnum.INFO,
      message: message
    });
  }

  openPanCardPopUp() {
    this.panCardServiceAbstraction.open(
      this.customerId,
      this.customerType,
      this.passportId
    );
  }

  openFocNotAddedPopup(event) {
    this.dialog
      .open(FocNotAddedPopupComponent, {
        width: '500px',
        height: 'auto',
        data: {
          headerLabel: 'pw.foc.focNotAdded',
          infoLabel: 'pw.foc.pleseCheckEligibilityMsg'
        }
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          if (res === 'keepPending') {
            this.focFacade.setKeepFocTrigger(true);
          } else {
            if (this.encircleDiscountSelectMsg) {
              this.encircleNotification();
            } else if (this.enableCalculateRivaahGhsDiscount) {
              this.calculateRivaahGHSAlert();
            } else if (
              this.totalAmt !== 0 &&
              this.finalAmt - this.paidValue === 0
            ) {
              this.tcsCalculation();
            } else {
              // if (this.isManualFocAdded) {
              //   const requestPayload = {
              //     customerID: this.customerId,
              //     manualFocEndDate: Number(
              //       this.addedManualFocDetail[0].manualFocSchemeDetails.data
              //         .manualFocEndDate
              //     ),
              //     manualFocStartDate: Number(
              //       this.addedManualFocDetail[0].manualFocSchemeDetails.data
              //         .manualFocStartDate
              //     )
              //   };
              //   this.focFacade.verifyManualFoc(requestPayload);
              // } else {
              this.orderService.ConfirmAllBillLevelDiscounsts(
                this.cashMemoId,
                TransactionTypeEnum.CM,
                SubTransactionTypeEnum.NEW_CM,
                this.discountDetails
              );
              // }
            }
          }
        }
      });
  }

  tcsCalculation() {
    this.cashMemoFacade.loadTcsAmount({
      id: this.cashMemoId,
      txnType: TransactionTypeEnum.CM,
      subTxnType: SubTransactionTypeEnum.NEW_CM
    });
  }

  tcsAmountSubscription() {
    this.cashMemoFacade
      .getTcsAmount()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: TcsDataResponse) => {
        if (data) {
          this.tcsToBeCollected = data?.tcsToBeCollected;
          this.tcsCollectedAtCm = data?.tcsCollected;

          if (
            this.tcsToBeCollected !== 0 &&
            this.tcsToBeCollected !== null &&
            this.tcsToBeCollected !== undefined &&
            this.tcsToBeCollected !== data.tcsCollected
          ) {
            this.translate
              .get(['pw.regularCashMemo.alertMsgForTcs'], {
                tcsApplicableAmount: data?.tcsEligibleAmount
              })
              .pipe(takeUntil(this.destroy$))
              .subscribe((translatedMessages: any) => {
                this.tcsAlertLabel =
                  translatedMessages['pw.regularCashMemo.alertMsgForTcs'];
              });
            this.openErrorMsgForOrder(this.tcsAlertLabel);
            this.commonFacade.setTcsAmount(this.tcsToBeCollected);
            this.isCustomerUpdate = false;
            this.isTCSUpdate = true;
            this.isItemUpdate = false;
            this.cashMemoFacade.partialUpdateCashMemo({
              id: this.cashMemoId,
              requestDetails: {
                tcsCollected: this.tcsToBeCollected
              },
              txnType: TransactionTypeEnum.CM,
              subTxnType: SubTransactionTypeEnum.NEW_CM
            });
          } else if (
            this.tcsToBeCollected === 0 ||
            this.tcsToBeCollected === data.tcsCollected ||
            this.tcsToBeCollected === null
          ) {
            // if (this.isManualFocAdded) {
            //   const requestPayload = {
            //     customerID: this.customerId,
            //     manualFocEndDate: Number(
            //       this.addedManualFocDetail[0].manualFocSchemeDetails.data
            //         .manualFocEndDate
            //     ),
            //     manualFocStartDate: Number(
            //       this.addedManualFocDetail[0].manualFocSchemeDetails.data
            //         .manualFocStartDate
            //     )
            //   };
            //   this.focFacade.verifyManualFoc(requestPayload);
            // } else {
            this.orderService.ConfirmAllBillLevelDiscounsts(
              this.cashMemoId,
              TransactionTypeEnum.CM,
              SubTransactionTypeEnum.NEW_CM,
              this.discountDetails
            );
            // }
          }
        }
      });
  }

  currencyRoundOff(amount) {
    const roundedOffAmount = this.currencyFormatterService.format(
      amount,
      this.currencyCode,
      false
    );
    return !!roundedOffAmount
      ? +roundedOffAmount.replace(new RegExp(',', 'g'), '')
      : 0;
  }

  weightRoundOff(weight) {
    const roundedOffWeight = this.weightFormatterService.format(weight);
    return !!roundedOffWeight ? +roundedOffWeight : 0;
  }

  openConfirmDialogForPayment(customerDependentPayments?: []) {
    const message1 = 'pw.regularCashMemo.customerDependentErrorMsg1';
    const message2 = 'pw.regularCashMemo.customerDependentErrorMsg2';

    this.translate
      .get([message1, message2])
      .pipe(take(1))
      .subscribe((translatedMsgs: any) => {
        this.alertPopupService.open({
          type: AlertPopupTypeEnum.INFO,
          message:
            translatedMsgs[message1] +
            customerDependentPayments +
            translatedMsgs[message2]
        });
      });
  }
  printError(msg) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.TIMER,
        message: msg,
        hasClose: false
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        if (!this.isLastTransactionPrint) this.showSuccessMessageNotification();
        //call your respective success overlay method
      });
  }

  dateFormat(date) {
    return moment(date);
  }

  selectedItemType(event) {
    if (this.abDetails.isBestRate) {
      this.commonFacade.loadTolerance({
        ruleType: RuleTypesEnum.BGR_TOLERANCE_CONFIG,
        ruleRequestList: {
          inputValue: this.getWeightDetails(
            event.value,
            this.abDetails.orderWeightDetails
          ),
          metalType: event.value,
          rangeType: RangeTypesEnum.BGR_WEIGHT_TOLERANCE,
          locationCode: this.locationCode
        }
      });
    } else if (this.abDetails.isFrozenRate) {
      this.commonFacade.loadTolerance({
        ruleType: RuleTypesEnum.ORDER_AB_FROZEN_TOLERANCE,
        ruleRequestList: {
          inputValue: this.getWeightDetails(
            event.value,
            this.abDetails.orderWeightDetails
          ),
          metalType: event.value,
          rangeType: RangeTypesEnum.ORDER_TOTAL_WEIGHT,
          locationCode: this.locationCode
        }
      });
    }
  }

  getWeightDetails(itemType: string, weightDetails) {
    if (weightDetails === null) return 0;
    else if (itemType === MetalTypeEnum.GOLD)
      return weightDetails.data.goldWeight;
    else if (itemType === MetalTypeEnum.SILVER)
      return weightDetails.data.silverWeight;
    else if (itemType === MetalTypeEnum.PLATINUM)
      return weightDetails.data.platinumWeight;
  }

  getMetalDetails(data, weightDetails) {
    this.metalTypes = [];
    data.forEach(element => {
      if (
        (element.materialTypeCode === MetalTypeEnum.GOLD &&
          weightDetails.data.goldWeight !== 0) ||
        (element.materialTypeCode === MetalTypeEnum.PLATINUM &&
          weightDetails.data.platinumWeight !== 0) ||
        (element.materialTypeCode === MetalTypeEnum.SILVER &&
          weightDetails.data.silverWeight !== 0)
      ) {
        this.metalTypes.push({
          value: element.materialTypeCode,
          description: element.description
        });
      }
    });
    if (this.metalTypes.length === 1) {
      this.metalType.patchValue(this.metalTypes[0].value);
      this.selectedItemType(this.metalTypes[0]);
    }
  }

  getStatus(status: string, index?: number) {
    let key;
    if (commonStatusTranslateKeyMap.has(status)) {
      key = commonStatusTranslateKeyMap.get(status);
      this.translate
        .get(key.status)
        .pipe(take(1))
        .subscribe((translatedMsg: any) => {
          this.abStatus += (index > 0 ? ',' : '') + translatedMsg;
        });
    }
  }

  discountsRemoveAlert(discountType: string) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.ERROR,
        message:
          this.discountsRemoveAlertMsg1 +
          discountType +
          this.discountsRemoveAlertMsg2 +
          discountType +
          this.discountsRemoveAlertMsg3
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  viewTcs() {
    const CustomerData = {
      id: this.cashMemoId,
      txnType: TransactionTypeEnum.CM,
      subTxnType: SubTransactionTypeEnum.NEW_CM
    };
    this.viewTcsService.open(CustomerData);
  }

  calculateRivaahGHSAlert() {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: this.calculateRivaahGhsDiscWarningMsg1,
        extraMessage: this.calculateRivaahGhsDiscWarningMsg2
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          if (this.totalAmt !== 0 && this.finalAmt - this.paidValue === 0) {
            this.tcsCalculation();
          } else {
            // if (this.isManualFocAdded) {
            //   const requestPayload = {
            //     customerID: this.customerId,
            //     manualFocEndDate: Number(
            //       this.addedManualFocDetail[0].manualFocSchemeDetails.data
            //         .manualFocEndDate
            //     ),
            //     manualFocStartDate: Number(
            //       this.addedManualFocDetail[0].manualFocSchemeDetails.data
            //         .manualFocStartDate
            //     )
            //   };
            //   this.focFacade.verifyManualFoc(requestPayload);
            // } else {
            this.orderService.ConfirmAllBillLevelDiscounsts(
              this.cashMemoId,
              TransactionTypeEnum.CM,
              SubTransactionTypeEnum.NEW_CM,
              this.discountDetails
            );
            // }
          }
        }
      });
  }

  // Instrumentation
  addStartTracking(actionName) {
    this.translate
      .get(actionName)
      .pipe(take(1))
      .subscribe((translatedMsg: any) => {
        this.startTracking(translatedMsg);
      });
  }

  addStopTracking(actionName) {
    this.translate
      .get(actionName)
      .pipe(take(1))
      .subscribe((translatedMsg: any) => {
        this.stopTracking(translatedMsg);
      });
  }

  checkItemsAvalilableForCOA() {
    this.productFacade
      .getItemDetails()
      .pipe(take(1))
      .subscribe((items: CashMemoItemDetailsResponse[]) => {
        this.COAItems = [];
        if (items) {
          items.forEach(item => {
            if (item.itemDetails.priceDetails.printGuranteeCard) {
              this.COAItems.push(item.itemDetails.itemId);
            }
          });
        }
      });
  }

  availableEncircle(discounts) {
    this.encircleDiscountSelectMsg =
      discounts.availableEncircleDiscounts.length > 0 &&
      (discounts.addedEncircleDiscounts === null ||
        discounts.addedEncircleDiscounts === undefined);
  }

  encircleNotification() {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: this.encircleNotificationMsg1,
        extraMessage: this.encircleNotificationMsg2
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          if (this.enableCalculateRivaahGhsDiscount) {
            this.calculateRivaahGHSAlert();
          } else if (
            this.totalAmt !== 0 &&
            this.finalAmt - this.paidValue === 0
          ) {
            this.tcsCalculation();
          } else {
            // if (this.isManualFocAdded) {
            //   const requestPayload = {
            //     customerID: this.customerId,
            //     manualFocEndDate: Number(
            //       this.addedManualFocDetail[0].manualFocSchemeDetails.data
            //         .manualFocEndDate
            //     ),
            //     manualFocStartDate: Number(
            //       this.addedManualFocDetail[0].manualFocSchemeDetails.data
            //         .manualFocStartDate
            //     )
            //   };
            //   this.focFacade.verifyManualFoc(requestPayload);
            // } else {
            this.orderService.ConfirmAllBillLevelDiscounsts(
              this.cashMemoId,
              TransactionTypeEnum.CM,
              SubTransactionTypeEnum.NEW_CM,
              this.discountDetails
            );
            // }
          }
        }
      });
  }

  reloadOpenAndHoldValues(holdReload = true) {
    this.loadOpenValues();
    if (holdReload) this.loadHoldValues();
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
        this.resetEncircle$.next(this.selectedEncircleData);
      });
  }

  showPanFormVerifyPopup() {
    this.panFormVerifyPopupService
      .open({
        type: AlertPopupTypeEnum.INFO,
        id: this.cashMemoId,
        customerId: this.customerId,
        customerType: this.customerType,
        txnType: TransactionTypeEnum.CM
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((dailogResponse: boolean) => {
        this.isProfileMatched = dailogResponse;
      });
  }
  isDisableInvoke() {
    if (this.isCnRedeemed || this.totalQty > 0) {
      this.disableForm$.next(true);
    } else {
      this.disableForm$.next(false);
    }
  }

  ngOnDestroy(): void {
    this.searchABFlag = false;
    this.isCOAPrinting = false;
    this.isCNPrinting = false;
    this.COAItems = [];
    this.commonFacade.clearTransactionConfig();
    this.summaryBar.close();
    this.overlayNotification.close();
    this.orderConfirmationFacade.resetValues();
    this.commonFacade.setCMOtherCharges(null);
    this.toolbarFacade.resetValues();
    this.commonFacade.setCMOrderNumber({ orderNo: 0, status: null });
    this.customerFacade.clearCustomerSearch();
    this.printingService.resetPrint();
    this.commonFacade.disableFullPaymentCheck(false);

    this.discountFacade.clearTransactionLevelDiscountDetails();
    this.toolbarFacade.setToolbarConfig({
      loadMetalPrices: true,
      loadHoldPopup: false,
      loadOpenOrdersPopup: false
    });
    this.cashMemoFacade.resetValues();
    this.orderStatus = null;
    this.commonFacade.clearCmImageUrl();
    this.isIGSTSelected = false;
    this.commonFacade.setIsIGSTFlag(false);
    this.paymentFacade.resetDeletedPayment();
    this.destroy$.next();
    this.destroy$.complete();
    this.commonFacade.clearCMGrfTolerance();
    this.commonFacade.clearCMGrnTolerance();
  }
}
