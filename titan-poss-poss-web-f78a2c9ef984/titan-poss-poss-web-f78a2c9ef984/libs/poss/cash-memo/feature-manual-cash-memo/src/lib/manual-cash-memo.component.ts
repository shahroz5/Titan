import { PaymentFacade } from '@poss-web/shared/payment/data-access-payment';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  TemplateRef
} from '@angular/core';
import {
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  SummaryBarServiceAbstraction,
  SummaryBarEventRef,
  SummaryBarEventType,
  StatusTypesEnum,
  TransactionTypeEnum,
  SubTransactionTypeEnum,
  CashMemoDetailsResponse,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  ManualBillRequest,
  ValidationTypesEnum,
  SummaryBarType,
  ToolbarConfig,
  UpdateOrderDetails,
  PaymentDetails,
  printTypesEnum,
  printDocTypeEnum,
  printTransactionTypesEnum,
  printFileTypeEnum,
  CommomStateAttributeTypeEnum,
  CommomStateAttributeNameEnum,
  FileUploadLists,
  PrintingServiceAbstraction,
  SharedBodEodFeatureServiceAbstraction,
  Lov,
  PaymentStatusEnum,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  PaymentModeEnum,
  PostTransactionConfirmationActionsServiceAbstraction,
  InvoiceDeliveryTypes,
  PanCardPopupAbstraction,
  TcsDataResponse,
  ViewTcsServiceAbstraction,
  OverlayNotificationType,
  CUSTOMER_TYPE_ENUM,
  DiscountTypeEnum,
  RemoveAppliedTransactionLevelDiscountByIDPayload,
  PanFormVerifyPopupServiceAbstraction,
  ConfigTypeEnum,
  CustomerServiceAbstraction,
  Customers
} from '@poss-web/shared/models';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import { Subject, Observable, combineLatest } from 'rxjs';
import { takeUntil, take, filter, withLatestFrom } from 'rxjs/operators';
import { CashMemoFacade } from '@poss-web/poss/cash-memo/data-access-cash-memo';
import { ToolbarFacade } from '@poss-web/shared/toolbar/data-access-toolbar';
import { TranslateService } from '@ngx-translate/core';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import { ActivatedRoute, NavigationEnd, Router, Event } from '@angular/router';
import { getManualCashMemoUrl } from '@poss-web/shared/util-site-routes';
import { ProductFacade } from '@poss-web/poss/shared/product/data-access-product';
import {
  CurrencyFormatterService,
  WeightFormatterService
} from '@poss-web/shared/components/ui-formatters';
import {
  OrderConfirmationFacade,
  OrderService
} from '@poss-web/shared/order-confirmation/data-access-order-confirmation';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { DiscountFacade } from '@poss-web/poss/shared/discount/data-access-discount';
import { FocFacade } from '@poss-web/poss/foc/data-access-foc';
import { PrintingFacade } from '@poss-web/shared/printing/data-access-printing';
import { FocNotAddedPopupComponent } from '@poss-web/poss/foc/ui-foc-popups';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { ResetTcsPopupComponent } from '@poss-web/poss/shared/view-tcs/ui-view-tcs';
import { ValidateCustomerService } from '@poss-web/shared/customer/feature-customer-create';

const discountTypeCode = 'DISCOUNT_TYPE';
const occasionTypeCode = 'OCCASION_TYPE';

@Component({
  selector: 'poss-web-manual-cash-memo',
  templateUrl: './manual-cash-memo.component.html',
  styleUrls: ['./manual-cash-memo.component.scss']
})
export class ManualCashMemoComponent implements OnInit, OnDestroy {
  customerId = null;
  customer: Customers = null;
  cashMemoId = null;
  totalQty = 0;
  totalAmt = 0;
  finalAmt = 0;
  totalDisc = 0;
  totalWeight = 0;
  totalTax = 0;
  productAmt = 0;
  paidValue = 0;
  hallmarkCharges = 0;
  hallmarkDiscount = 0;
  metalRate: any;
  otherChargesList: any;
  docNo = 0;
  reqNo: number;
  isViewFlag = false;
  isLoading$: Observable<boolean>;
  isLoadingOrder$: Observable<boolean>;
  destroy$: Subject<null> = new Subject<null>();

  @ViewChild('confirmSuccessNotificationTemplate', { static: true })
  confirmSuccessNotificationTemplate: TemplateRef<any>;
  @ViewChild('confirmApprovalNotificationTemplate', { static: true })
  confirmApprovalNotificationTemplate: TemplateRef<any>;
  actionType = ValidationTypesEnum.REGULARIZE;
  TransactionTypeEnumRef = TransactionTypeEnum;
  detailsFlag$: Subject<boolean> = new Subject<boolean>();
  resetValidationType$: Subject<null> = new Subject<null>();

  toolbarData: ToolbarConfig = {
    txnType: TransactionTypeEnum.CM,
    subTxnType: SubTransactionTypeEnum.MANUAL_CM,
    loadMetalPrices: true,
    loadHoldPopup: true,
    loadOpenOrdersPopup: true
  };

  summaryBarRemarks$ = new Subject<string>();
  currencyCode: string;
  isLoggedIn: boolean;
  paymentDetails: PaymentDetails[];
  printErrorText: string;
  manualBillDetails = null;
  imageUrl: string;
  bussinessDay: number;
  orderStatus = null;
  reloadCMFlag = false;
  discountDetails: any;
  selectedEncircle$: Subject<string> = new Subject<string>();
  clearEncircle$: Subject<null> = new Subject<null>();
  resetEncircle$: Subject<string> = new Subject<string>();
  clearOccasionIcon$: Subject<null> = new Subject<null>();
  enableDiscountUpdate = false;
  discountList: Lov[];
  customerLoyaltyDetails = null;
  selectedEncircleData = null;
  confirmRemarks = null;
  creditNotePaymentToBeDeleted: PaymentDetails = null;
  isEncircleAdded: boolean;
  discountsRemoveAlertMsg1: string;
  discountsRemoveAlertMsg2: string;
  discountsRemoveAlertMsg3: string;
  isFocAdded = false;
  isFocKeptPending = false;
  availableFocSchemes = 0;
  availableFocSchemesForProducts = false;
  availableFocSchemesForSelectedProducts = true;
  ghsCustomerId = null;
  refundAmountAsCash = 0;
  panMandatoryForCM: boolean;
  maxAllowedAmount: number;
  TcsApplicableAmount: any;
  customerPAN: any;
  tcsToBeCollected = null;
  isManualFocAdded = false;
  addedManualFocDetail = [];
  tcsCollectedAtCm: number;
  isManuaFocVerified: boolean;
  tcsAlertLabel: any;
  isCustomerUpdate = false;
  isTCSUpdate = false;
  isItemUpdate = false;
  customerType: any;
  form60Submitted: boolean;
  passportId = '';
  enableCalculateRivaahGhsDiscount = false;
  calculateRivaahGhsDiscWarningMsg1: string;
  calculateRivaahGhsDiscWarningMsg2: string;
  @ViewChild('manualForm') manualForm?: MatExpansionPanel;
  @ViewChild('occasionPanel') occasionPanel?: MatExpansionPanel;
  setManualFormFocus = false;
  setOccasionFocus = false;
  manualFormBadgeNumber = 1;
  occasionBadgeNumber = 2;
  encircleNotificationMsg1: string;
  encircleNotificationMsg2: string;
  encircleDiscountSelectMsg = false;
  selectedOccasion = null;
  customerState = null;
  isIGSTSelected = false;
  occasionList$: Observable<Lov[]>;
  selectedOccasion$: Subject<string> = new Subject<string>();
  clearOccasion$: Subject<null> = new Subject<null>();
  isLastTransactionPrint = false;
  newlyGeneratedCn: any;
  gstNumber: string;
  idProof: string;
  loadAutoDiscounts = false;
  reloadCustomerForGHS = false;
  tcsToBeCollectedAtCM: number;
  cmDetails: CashMemoDetailsResponse;
  isProfileMatched: boolean;
  isAdvancebookingType = false;
  standardPrice: any;

  constructor(
    public customerFacade: CustomerFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private summaryBar: SummaryBarServiceAbstraction,
    private cashMemoFacade: CashMemoFacade,
    private panFormVerifyPopupService: PanFormVerifyPopupServiceAbstraction,
    private toolbarFacade: ToolbarFacade,
    private translate: TranslateService,
    private paymentFacade: PaymentFacade,
    private commonFacade: CommonFacade,
    private authFacade: AuthFacade,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private productFacade: ProductFacade,
    private weightFormatterService: WeightFormatterService,
    private currencyFormatterService: CurrencyFormatterService,
    private orderService: OrderService,
    private orderConfirmationFacade: OrderConfirmationFacade,
    public printingService: PrintingServiceAbstraction,
    private printingFacade: PrintingFacade,
    private bodEodFeatureService: SharedBodEodFeatureServiceAbstraction,
    private discountFacade: DiscountFacade,
    private alertPopupService: AlertPopupServiceAbstraction,
    private postConfirmationActions: PostTransactionConfirmationActionsServiceAbstraction,
    private focFacade: FocFacade,
    private dialog: MatDialog,
    private panCardServiceAbstraction: PanCardPopupAbstraction,
    private viewTcsService: ViewTcsServiceAbstraction,
    private customerService: CustomerServiceAbstraction,
    private validateCustomerService: ValidateCustomerService
  ) {
    this.translate
      .get([
        'pw.otherReceiptsIssues.printError',
        'pw.manualCashMemo.discountsRemoveAlertMsg1',
        'pw.manualCashMemo.discountsRemoveAlertMsg2',
        'pw.manualCashMemo.discountsRemoveAlertMsg3',
        'pw.discount.calculateRivaahGhsDiscWarningMsg1',
        'pw.discount.calculateRivaahGhsDiscWarningMsg2',
        'pw.discount.encircleNotificationMsg1',
        'pw.discount.encircleNotificationMsg2'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.printErrorText =
          translatedMessages['pw.otherReceiptsIssues.printError'];
        this.discountsRemoveAlertMsg1 =
          translatedMessages['pw.manualCashMemo.discountsRemoveAlertMsg1'];
        this.discountsRemoveAlertMsg2 =
          translatedMessages['pw.manualCashMemo.discountsRemoveAlertMsg2'];
        this.discountsRemoveAlertMsg3 =
          translatedMessages['pw.manualCashMemo.discountsRemoveAlertMsg3'];
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
    this.clearPage(true);
    this.showSummaryBar();
    this.componentInit();
    this.getCustomerResponse();
    this.getCashMemoReponse();
    this.getDiscountsResponse();

    this.authFacade
      .isUserLoggedIn()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoggedIn: boolean) => {
        this.isLoggedIn = isLoggedIn;
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
          this.cashMemoFacade.viewCashMemo({
            id: id,
            txnType: TransactionTypeEnum.CM,
            subTxnType: SubTransactionTypeEnum.MANUAL_CM
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
        subTxnType: SubTransactionTypeEnum.MANUAL_CM
      });
      this.commonFacade.setTransactionTD(
        this.activatedRoute.snapshot.params['_id']
      );
    }
    this.detailsFlag$.next(false);
    this.productFacade.setGridSearchEnable(false);
    this.focFacade
      .getManualFocListAddedToCM()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.addedManualFocDetail = data;
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
            subTxnType: SubTransactionTypeEnum.MANUAL_CM
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
            subTxnType: SubTransactionTypeEnum.MANUAL_CM
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

  viewTcs() {
    const CustomerData = {
      id: this.cashMemoId,
      txnType: TransactionTypeEnum.CM,
      subTxnType: SubTransactionTypeEnum.MANUAL_CM
    };
    this.viewTcsService.open(CustomerData);
  }
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
            SubTransactionTypeEnum.MANUAL_CM,
            this.discountDetails
          );
        }
      });
  }

  showSummaryBar() {
    this.summaryBar
      .open(SummaryBarType.MB, {
        actionType: this.actionType,
        clearType: true,
        remarks: this.summaryBarRemarks$.asObservable(),
        readOnly: false
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: SummaryBarEventRef) => {
        this.isLastTransactionPrint = false;
        switch (event.eventType) {
          case SummaryBarEventType.CLAER: {
            this.clearPage(true);
            this.router.navigate([getManualCashMemoUrl()]);
            if (this.isViewFlag) {
              this.actionType = ValidationTypesEnum.REGULARIZE;
              this.showSummaryBar();
              this.isViewFlag = false;
              this.resetValidationType$.next();
            } else {
              this.showSummaryBar();
            }
            break;
          }
          case SummaryBarEventType.CONFRIM: {
            if (this.customerId !== null) {
              let isFormValidated = this.validateCustomerService.validateCustomer(
                this.customer
              );
              if (isFormValidated) {
                this.confirmRemarks = event;
                this.commonFacade.confrimCashMemo();
                if (this.customerId === null) {
                  const selectCustomerMsg =
                    'pw.manualCashMemo.selectCustomerMsg';
                  this.errorNotifications(selectCustomerMsg);
                } else if (this.selectedOccasion === null) {
                  const selectOccasionMessage =
                    'pw.manualCashMemo.selectOccasionDetailsMessage';
                  this.errorNotifications(selectOccasionMessage);
                } else if (this.totalQty === 0) {
                  const addItemMessage =
                    'pw.manualCashMemo.addItemToGridMessage';
                  this.errorNotifications(addItemMessage);
                } else if (
                  (this.totalQty !== 0 &&
                    this.panMandatoryForCM &&
                    !this.isProfileMatched &&
                    this.paidValue > Number(this.maxAllowedAmount)) ||
                  (this.totalQty !== 0 &&
                    this.paidValue > Number(this.TcsApplicableAmount))
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
                    subTxnType: SubTransactionTypeEnum.MANUAL_CM,
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

          case SummaryBarEventType.PRINT: {
            this.isLastTransactionPrint = true;
            this.printLastTransaction();
            break;
          }

          case SummaryBarEventType.DELETE: {
            //Delete Action
            if (this.cashMemoId) {
              this.focFacade.deleteFoc({
                id: this.cashMemoId,
                txnType: TransactionTypeEnum.CM,
                subTxnType: SubTransactionTypeEnum.MANUAL_CM
              });
              this.cashMemoFacade.deleteCashMemo({
                id: this.cashMemoId,
                txnType: TransactionTypeEnum.CM,
                subTxnType: SubTransactionTypeEnum.MANUAL_CM
              });
            } else
              this.showSimpleNotifications('pw.manualCashMemo.deleteOrderMsg');
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
        paidValue: this.currencyRoundOff(this.paidValue),
        remarks: event?.remarks ? event?.remarks : null,
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
      status:
        this.actionType === ValidationTypesEnum.REGULARIZE
          ? StatusTypesEnum.CONFIRMED
          : StatusTypesEnum.APPROVAL_PENDING,
      transactionType: TransactionTypeEnum.CM,
      subTransactionType: SubTransactionTypeEnum.MANUAL_CM
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

  tcsCalculation() {
    this.cashMemoFacade.loadTcsAmount({
      id: this.cashMemoId,
      txnType: TransactionTypeEnum.CM,
      subTxnType: SubTransactionTypeEnum.MANUAL_CM
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
              subTxnType: SubTransactionTypeEnum.MANUAL_CM
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
              SubTransactionTypeEnum.MANUAL_CM,
              this.discountDetails
            );
            // }
          }
        }
      });
  }

  openErrorMsgForOrder(message) {
    this.alertPopupService.open({
      type: AlertPopupTypeEnum.INFO,
      message: message
    });
  }

  componentInit() {
    this.bodEodFeatureService
      .getBusinessDayDate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.bussinessDay = data;
      });

    this.isLoading$ = this.cashMemoFacade.getIsLoading();
    this.isLoadingOrder$ = this.orderConfirmationFacade.getIsLoading();
    this.toolbarFacade.setToolbarConfig(this.toolbarData);
    this.tcsAmountSubscription();
    this.commonFacade.setTransactionConfig({
      isPaymentEditable: true,
      transactionType: {
        type: TransactionTypeEnum.CM,
        subType: SubTransactionTypeEnum.MANUAL_CM
      },
      taxTransactionType: TransactionTypeEnum.CUST_TRANSACTION_CM
    });
    this.occasionList$ = this.commonFacade.getCommonFacadeAttributes(
      CommomStateAttributeTypeEnum.CASHMEMO,
      CommomStateAttributeNameEnum.OCCASION_LIST
    );

    this.cashMemoFacade
      .getHasError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
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
    this.focFacade
      .getIsManualFocAdded()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: boolean) => {
        this.isManualFocAdded = data;
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.TOTAL_QUANTITY
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(quantity => {
        this.totalQty = quantity;
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
        CommomStateAttributeNameEnum.FINAL_AMT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(amt => {
        this.finalAmt = amt;
        this.commonFacade.setTransactionTotalAmount(amt);
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
        CommomStateAttributeNameEnum.PRODUCT_AMT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(amt => {
        this.productAmt = amt;
      });

    this.paymentFacade
      .getTotalPaidAmount()
      .pipe(takeUntil(this.destroy$))
      .subscribe(totalValue => {
        this.paidValue = totalValue;
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
      .getPaymentDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((payments: PaymentDetails[]) => {
        this.paymentDetails = payments;
        this.newlyGeneratedCn = this.paymentDetails.filter(
          cn =>
            cn.paymentCode === PaymentModeEnum.CREDIT_NOTE &&
            cn.otherDetails.data.newCNNumber !== null
        );
        this.refundAmountAsCash = this.paymentDetails.reduce(
          (sum, b) => sum + b.refundAmount,
          0
        );
      });

    this.orderConfirmationFacade
      .getHasError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.orderConfirmationFacade
      .confirmCashMemoResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: CashMemoDetailsResponse) => {
        if (data) {
          this.updateCashMemoNotification(data);
          this.reloadOpenAndHoldValues(false);
          this.docNo = data.docNo;

          // const successMessage = 'pw.regularCashMemo.confirmCashMemoMessage';

          // this.showNotifications(successMessage);
          // this.showSuccessMessageNotification();
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

    this.cashMemoFacade
      .getFileUploadRes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: boolean) => {
        if (data) {
          this.cashMemoFacade.loadFileUploadList({
            txnType: TransactionTypeEnum.CM,
            id: this.cashMemoId,
            customerId: this.customerId
          });
        }
      });

    this.cashMemoFacade
      .getFileUploadListRes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: FileUploadLists[]) => {
        if (data.length !== 0)
          this.cashMemoFacade.loadFileDownloadUrl({
            id: data[data.length - 1].id,
            locationCode: null
          });
      });

    this.cashMemoFacade
      .getFileDownloadUrl()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: string) => {
        this.imageUrl = data;
      });

    this.printingService
      .getIsMailSent()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isMailSent: boolean) => {
        if (isMailSent) {
          this.showAlertPopUp('pw.regularCashMemo.mailSentMsg');
        }
      });

    this.printingService
      .getIsPrintingSuccess()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isPrintingSuccess: boolean) => {
        if (isPrintingSuccess) {
          this.showAlertPopUp('pw.regularCashMemo.printingSuccessMessage');
        }
      });

    // FOC

    this.focFacade
      .getIsFocAdded()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: boolean) => {
        this.isFocAdded = data;
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

    // GHS
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

          // if (val2?.otherDetails?.data?.isRivaahDiscountApplicable)
          //   this.discountFacade.setEnableCalculateRivaahGHSDiscounts(true);
          // else this.discountFacade.setEnableCalculateRivaahGHSDiscounts(false);
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

    this.discountFacade
      .getEnableCalculateRivaahGHSDiscounts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.enableCalculateRivaahGhsDiscount = data;
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
        if (data === 1) {
          this.manualForm.open();
          this.setManualFormFocus = true;
          this.setOccasionFocus = false;
        } else if (data === 2) {
          this.occasionPanel.open();
          this.setOccasionFocus = true;
          this.setManualFormFocus = false;
        } else {
          this.setOccasionFocus = false;
          this.setManualFormFocus = false;
        }
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

  getCashMemoReponse() {
    this.cashMemoFacade
      .getCreateCashMemoResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data !== null) {
          this.manualBillDetails = data;
          this.detailsFlag$.next(true);
          this.cashMemoId = data.id;
          // todo: add null check
          this.isEncircleAdded = true;
          this.isCustomerUpdate = true;
          this.isTCSUpdate = false;
          this.isItemUpdate = false;
          this.cashMemoFacade.partialUpdateCashMemo({
            id: this.cashMemoId,
            requestDetails: {
              customerId: this.customerId,
              discountTxnDetails: {
                data: {
                  encircleDetails: {
                    discountType: this.selectedEncircleData
                  }
                },
                type: 'DISCOUNT_TXN_DETAILS'
              }
            },
            txnType: TransactionTypeEnum.CM,
            subTxnType: SubTransactionTypeEnum.MANUAL_CM
          });

          this.commonFacade.setTransactionTD(data.id);
          this.commonFacade.setCMOrderNumber({
            orderNo: data.docNo,
            status: StatusTypesEnum.OPEN
          });
          this.reloadOpenAndHoldValues(false);
          this.productFacade.setGridSearchEnable(true);
          if (this.customerId) {
            this.customerFacade.loadSelectedCustomer(
              String(this.customerId),
              false
            );
          }
          const val = data?.manualBillDetails?.validationType;
          if (val === ValidationTypesEnum.PASSWORD_VALIDATION) {
            this.actionType = ValidationTypesEnum.REGULARIZE;
            this.showSummaryBar();
          } else if (val === ValidationTypesEnum.REQUEST_APPROVAL) {
            this.actionType = ValidationTypesEnum.SENDAPPROVAL;
            this.showSummaryBar();
          }
        }
      });

    this.cashMemoFacade
      .getViewCashMemoResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: CashMemoDetailsResponse) => {
        this.cmDetails = data;
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
        // if (
        //   this.discountDetails?.rivaahGhsDiscountDetails
        //     ?.isRivaahDiscountApplicable
        // )
        //   this.discountFacade.setEnableCalculateRivaahGHSDiscounts(true);
        // else this.discountFacade.setEnableCalculateRivaahGHSDiscounts(false);
        if (
          data &&
          data.tcsToBeCollected !== 0 &&
          data.tcsToBeCollected !== null &&
          data.tcsToBeCollected !== undefined
        ) {
          this.commonFacade.setTcsAmount(data.tcsToBeCollected);
        }
        this.discountFacade.clearOrderDiscDetails();
        this.discountFacade.setOrderDiscDetails(data);
        this.commonFacade.setCMOtherCharges(data?.otherChargesList);
        if (data) {
          if (this.reloadCMFlag) {
            if (this.reloadCustomerForGHS && data.customerId) {
              this.customerFacade.loadSelectedCustomer(
                String(data.customerId),
                false,
                true,
                true,
                true
              );
              this.reloadCustomerForGHS = false;
            }
            this.productFacade.setItemIDList({
              item: data,
              isUpdate: false,
              isGetHeaderDetails: true,
              loadAutoDiscounts: this.loadAutoDiscounts
            });
            this.reloadCMFlag = false;
            this.loadAutoDiscounts = false;
          } else {
            this.manualBillDetails = data;
            this.detailsFlag$.next(true);
            this.cashMemoId = data.id;
            this.commonFacade.setCMOrderNumber({
              orderNo: data.docNo,
              status: StatusTypesEnum.OPEN
            });
            this.selectedOccasion = data.occasion;
            this.selectedOccasion$.next(data.occasion);
            this.selectedEncircleData = data.discountDetails
              ? data.discountDetails?.data?.encircleDetails?.discountType
              : null;
            // null or some data
            this.selectedEncircle$.next(this.selectedEncircleData);
            this.discountFacade.setEncircle(this.selectedEncircleData);
            this.customerId = data.customerId;
            this.productFacade.setGridSearchEnable(true);
            this.productFacade.setStandardPrice(data.metalRateList.metalRates);
            this.isViewFlag = true;
            if (data.customerId) {
              this.customerFacade.loadSelectedCustomer(
                String(data.customerId),
                false
              );
            }
            if (data.status === StatusTypesEnum.OPEN) {
              const val = data?.manualBillDetails?.validationType;
              if (val === ValidationTypesEnum.PASSWORD_VALIDATION) {
                this.actionType = ValidationTypesEnum.REGULARIZE;
                this.showSummaryBar();
              } else if (val === ValidationTypesEnum.REQUEST_APPROVAL) {
                this.actionType = ValidationTypesEnum.SENDAPPROVAL;
                this.showSummaryBar();
              }
              this.productFacade.resetItemIdList();
              this.productFacade.setItemIDList({ item: data, isUpdate: false });
              if (
                val === ValidationTypesEnum.REQUEST_APPROVAL
                // &&
                // data.customerDocDetails
                //   ?.split(',')
                //   .includes(ImageTypesEnum.MANUAL_BILL)
              ) {
                this.cashMemoFacade.loadFileUploadList({
                  txnType: TransactionTypeEnum.CM,
                  id: data.id,
                  customerId: data.customerId
                });
              }
            }
          }
        }
      });

    this.cashMemoFacade
      .getPartialUpdateCashMemoResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: CashMemoDetailsResponse) => {
        if (data) {
          this.cmDetails = data;
          if (data.hasError) {
            this.selectedOccasion$.next(data.occasion);
            this.selectedEncircle$.next(
              data.discountDetails
                ? data.discountDetails?.data?.encircleDetails?.discountType
                : null
            );
          } else {
            if (data.tcsToBeCollected === 0 || data.tcsToBeCollected === null) {
              this.commonFacade.setTcsAmount(0);
            }
            this.reloadOpenAndHoldValues(false);
            this.productFacade.setStandardPrice(data.metalRateList.metalRates);
            if (this.isEncircleAdded) {
              this.selectedEncircleData = data.discountDetails
                ? data.discountDetails?.data?.encircleDetails?.discountType
                : null;
              this.discountFacade.setEncircle(this.selectedEncircleData);

              this.discountFacade.loadAppliedTransactionLevelDiscounts({
                transactionId: this.cashMemoId,
                txnType: TransactionTypeEnum.CM,
                subTxnType: SubTransactionTypeEnum.MANUAL_CM
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
          }
        }
      });

    this.cashMemoFacade
      .getDeleteCashMemoResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: boolean) => {
        if (data !== false) {
          const successKey = 'pw.manualCashMemo.deleteCMSuccessMessage';
          this.deleteCashMemoNotification(successKey);
          this.reloadOpenAndHoldValues();
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
        }
      });
  }

  openPanCardPopUp() {
    this.panCardServiceAbstraction.open(
      this.customerId,
      this.customerType,
      this.passportId
    );
  }

  getCustomerResponse() {
    combineLatest([
      this.customerFacade
        .getCustomerLoyaltyDetail()
        .pipe(takeUntil(this.destroy$)),
      this.discountFacade.getDiscountTypes().pipe(takeUntil(this.destroy$))
    ]).subscribe(([loyaltyDetails, discountList]) => {
      if (loyaltyDetails && discountList.length !== 0) {
        console.log(
          'loyaltyDetails, discountList',
          loyaltyDetails,
          discountList
        );
        this.discountList = discountList;
        this.customerLoyaltyDetails = loyaltyDetails;
      }
    });

    this.customerFacade
      .getSelectSelectedCustomer()
      .pipe(takeUntil(this.destroy$))
      .subscribe(customer => {
        console.log('customer seelcted', customer);
        if (customer) {
          const tempCustomerId = this.customerId;
          this.customerId = customer.customerId;
          this.customer = customer;
          this.customerPAN = customer.custTaxNo;
          this.customerType = customer.customerType;
          this.form60Submitted =
            customer.customerDetails.data.form60AndIdProofSubmitted;
          this.gstNumber = customer.instiTaxNo;
          this.idProof = customer.customerDetails.data.idProof;
          this.passportId = customer?.passportId;
          // this.customerLoyaltyDetails = customer.loyaltyDetails;
          // if (this.cashMemoId === null) {
          if (customer.ulpId) {
            this.customerFacade.loadSelectedCustomerDetail(
              String(customer.customerId),
              customer?.isCalledFromCustomer
            );
          }
          const tempCustomerState = this.customerState;
          this.customerState = customer.customerDetails.data.state;
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
          // }
          this.discountFacade.loadDiscountTypes(discountTypeCode);
          this.commonFacade.loadCMOccasions(occasionTypeCode);
        } else {
          this.customerId = null;
          this.customer = null;
          this.customerPAN = null;
          this.clearEncircle$.next();
          this.customerLoyaltyDetails = null;
          this.clearOccasion$.next();
          this.clearOccasionIcon$.next();
          this.customerType = null;
          this.gstNumber = null;
          this.idProof = null;
          this.passportId = '';
        }
      });
  }

  getDiscountsResponse() {
    // slab reload
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
              subTransactionType: SubTransactionTypeEnum.MANUAL_CM
            });
            this.creditNotePaymentToBeDeleted = null;
          }
          this.reloadCM();
        }
      });

    this.paymentFacade
      .getCreditNotePaymentToBeDeleted()
      .pipe(takeUntil(this.destroy$))
      .subscribe((creditNotePaymentToBeDeleted: PaymentDetails) => {
        this.creditNotePaymentToBeDeleted = creditNotePaymentToBeDeleted;
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
            //  else {
            // if (this.isManualFocAdded) {
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
              SubTransactionTypeEnum.MANUAL_CM,
              this.discountDetails
            );
            // }
            // }
          }
        }
      });

    this.discountFacade
      .getAppliedKaratorCoinOfferDiscountResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(appliedDiscount => {
        if (appliedDiscount) {
          this.reloadCM();
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
            paymentDetails?.otherDetails?.data?.isRivaahGhsDiscountRefresh ||
            (paymentDetails?.paymentCode === PaymentModeEnum.CREDIT_NOTE &&
              paymentDetails?.instrumentType ===
                ConfigTypeEnum.DIGI_GOLD_TANISHQ) ||
            (discountDetails.discountType ===
              DiscountTypeEnum.DIGI_GOLD_DISCOUNT &&
              discountDetails.referenceId.toUpperCase() ===
                paymentDetails?.id.toUpperCase())
          ) {
            this.reloadCM();
          }
        }
      });
  }

  printLastTransaction() {
    this.printingFacade.loadLastTransactionId({
      searchValue: '',
      status: StatusTypesEnum.CONFIRMED,
      txnType: TransactionTypeEnum.CM,
      subTxnType: SubTransactionTypeEnum.MANUAL_CM,
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
                let action = null;
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
                this.printingService.loadPrintData({
                  printType: printTypesEnum.CM_PRINTS,
                  transacionId: lastTransactionId,
                  transacionType: printTransactionTypesEnum.SALES,
                  printFileType: printFileTypeEnum.INVOICE_PRINT,
                  doctype: printDocTypeEnum.CUSTOMER_PRINT,
                  reprint: false,
                  customerId: this.customerId,
                  lastTransactionPrint: true,
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
            let action = null;
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
          }
        });
    }
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
    if (error.code === ErrorEnums.ERR_CORE_034) {
      const key = 'pw.manualCashMemo.metalPriceNotificationMsg';
      this.errorNotifications(key);
    } else if (error.code === ErrorEnums.ERR_INV_014) {
      const key = 'pw.manualCashMemo.itemDetailsNAMsg';
      this.errorNotifications(key);
    } else if (error.code === ErrorEnums.ERR_QZ_TRAY) {
      this.printError();
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
          } else if (error.code === ErrorEnums.ERR_SALE_053) {
            this.clearPage(true);
            this.router.navigate([getManualCashMemoUrl()]);
            this.isViewFlag = false;
            this.actionType = ValidationTypesEnum.REGULARIZE;
            this.showSummaryBar();
            this.reloadOpenAndHoldValues(false);
            this.resetValidationType$.next();
          }
        });
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

  updateCashMemoNotification(data) {
    let template;
    if (data.status === StatusTypesEnum.APPROVAL_PENDING) {
      this.reqNo = data.manualBillDetails.requestNo;
      template = this.confirmApprovalNotificationTemplate;
    } else {
      template = this.confirmSuccessNotificationTemplate;
    }
    if (data.status === StatusTypesEnum.CONFIRMED)
      this.orderStatus = StatusTypesEnum.CONFIRMED;
    this.overlayNotification
      .show({
        type: OverlayNotificationType.CUSTOM,
        hasBackdrop: true,
        hasClose: true,
        template: template
      })
      .events.pipe(take(1))
      .subscribe((event: OverlayNotificationEventRef) => {
        if (event.eventType === OverlayNotificationEventType.CLOSE) {
          this.clearPage(true);
          this.router.navigate([getManualCashMemoUrl()]);
          this.isViewFlag = false;
          this.actionType = ValidationTypesEnum.REGULARIZE;
          this.showSummaryBar();
          this.resetValidationType$.next();
        }
      });
  }

  // clears the entire page
  clearPage(clearTransactionID: boolean) {
    if (clearTransactionID) {
      this.commonFacade.clearTransactionTD();
      this.productFacade.clearProductGrid();
      this.productFacade.setGridSearchEnable(false);
      // reset FOC
      this.focFacade.resetFOCData();
      this.focFacade.clearFocSchemesForItems();
    }
    this.commonFacade.clearCashMemo();
    this.cashMemoFacade.resetValues();
    this.commonFacade.setCMOtherCharges(null);
    this.customerId = null;
    this.customer = null;
    this.customerState = null;
    this.isIGSTSelected = false;
    this.isProfileMatched = false;
    this.cashMemoId = null;
    this.customerFacade.clearCustomerSearch();
    this.overlayNotification.close();
    this.detailsFlag$.next(false);
    this.commonFacade.setCMOrderNumber({
      orderNo: 0,
      status: null
    });
    this.summaryBarRemarks$.next('');
    this.orderConfirmationFacade.resetValues();
    this.docNo = 0;
    this.reqNo = 0;
    this.orderStatus = null;
    this.reloadCMFlag = false;
    this.discountFacade.clearTransactionLevelDiscountDetails();
    this.discountFacade.setRefreshDiscountsAndOffersPanel(true);
    this.clearEncircle$.next();
    this.clearOccasion$.next();
    this.clearOccasionIcon$.next();
    this.isEncircleAdded = false;
    this.selectedEncircleData = null;
    this.discountFacade.clearEncircleAdded();
    this.discountFacade.clear();
    this.discountFacade.clearOrderDiscDetails();
    this.commonFacade.clearTcsAmount();
    this.isCustomerUpdate = false;
    this.isTCSUpdate = false;
    this.isItemUpdate = false;
    this.selectedOccasion = null;
    this.encircleDiscountSelectMsg = false;
    this.commonFacade.setFileUploadVisible(false);
    this.loadAutoDiscounts = false;
    this.reloadCustomerForGHS = false;
    this.cmDetails = null;
    this.isIGSTSelected = false;
    this.commonFacade.setIsIGSTFlag(false);
  }

  validateBill(event: ManualBillRequest) {
    if (this.customerId !== null) {
      this.cashMemoFacade.createCashMemo({
        requestDetails: event,
        txnType: TransactionTypeEnum.CM,
        subTxnType: SubTransactionTypeEnum.MANUAL_CM
      });
    }
  }

  loadOpenValues() {
    this.toolbarFacade.loadOpenOrdersCount({
      status: StatusTypesEnum.OPEN,
      txnType: TransactionTypeEnum.CM,
      subTxnType: SubTransactionTypeEnum.MANUAL_CM
    });
    this.toolbarFacade.loadOpenOrders({
      searchValue: '',
      status: StatusTypesEnum.OPEN,
      txnType: TransactionTypeEnum.CM,
      subTxnType: SubTransactionTypeEnum.MANUAL_CM,
      pageIndex: 0,
      pageSize: 10
    });
  }

  loadHoldValues() {
    this.toolbarFacade.loadOnHoldCount({
      status: StatusTypesEnum.HOLD,
      txnType: TransactionTypeEnum.CM,
      subTxnType: SubTransactionTypeEnum.MANUAL_CM
    });
    this.toolbarFacade.loadOnHold({
      searchValue: '',
      status: StatusTypesEnum.HOLD,
      txnType: TransactionTypeEnum.CM,
      subTxnType: SubTransactionTypeEnum.MANUAL_CM,
      pageIndex: 0,
      pageSize: 10
    });
  }

  validationTypeChange(event: string) {
    if (event === ValidationTypesEnum.PASSWORD) {
      this.actionType = ValidationTypesEnum.REGULARIZE;
      this.showSummaryBar();
    } else if (event === ValidationTypesEnum.APPROVAL) {
      this.actionType = ValidationTypesEnum.SENDAPPROVAL;
      this.showSummaryBar();
    }
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

  printError() {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.TIMER,
        message: this.printErrorText,
        hasClose: false
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        if (!this.isLastTransactionPrint) this.showSuccessMessageNotification(); //call your respective success overlay method
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
        this.router.navigate([getManualCashMemoUrl()]);
      });
  }

  uploadFile(event: FormData) {
    this.cashMemoFacade.loadFileUpload({
      file: event,
      txnType: TransactionTypeEnum.CM,
      id: this.cashMemoId
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

  reloadCM() {
    if (this.cashMemoId) {
      const tempId = this.cashMemoId;
      this.reloadCMFlag = true;
      this.commonFacade.clearTransactionTD();
      this.cashMemoFacade.viewCashMemo({
        id: tempId,
        txnType: TransactionTypeEnum.CM,
        subTxnType: SubTransactionTypeEnum.MANUAL_CM
      });
      this.commonFacade.setTransactionTD(tempId);
      // this.selectedEncircleData = null;
      this.discountFacade.setRefreshDiscountsAndOffersPanel(true);
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
        console.log('encircleEvent', encircleEvent, this.selectedEncircleData);
        // todo: check whether enncircle is added or not
        if (this.selectedEncircleData && encircleEvent === undefined) {
          if (this.cashMemoId) {
            this.discountFacade.removeAllAppliedTransactionLevelDiscounts({
              discountType: this.selectedEncircleData,
              subTxnType: SubTransactionTypeEnum.MANUAL_CM,
              transactionId: this.cashMemoId,
              txnType: TransactionTypeEnum.CM
            });
          } else {
            this.selectedEncircleData = encircleEvent;
          }
        } else if (
          encircleEvent !== this.selectedEncircleData &&
          this.cashMemoId
        ) {
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
            subTxnType: SubTransactionTypeEnum.MANUAL_CM,
            oldData: this.cmDetails
          });
        }
      }
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
                SubTransactionTypeEnum.MANUAL_CM,
                this.discountDetails
              );
              // }
            }
          }
        }
      });
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
              SubTransactionTypeEnum.MANUAL_CM,
              this.discountDetails
            );
            // }
          }
        }
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
              this.router.navigate([getManualCashMemoUrl()]);
              this.isViewFlag = false;
              this.actionType = ValidationTypesEnum.REGULARIZE;
              this.resetValidationType$.next();
              this.showSummaryBar();
            }
          });
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
              SubTransactionTypeEnum.MANUAL_CM,
              this.discountDetails
            );
            // }
          }
        }
      });
  }

  // update selected occasion in CM
  selectedOccasionEmit(occasionEvent: string) {
    if (occasionEvent !== this.selectedOccasion) {
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
        subTxnType: SubTransactionTypeEnum.MANUAL_CM,
        oldData: this.cmDetails
      });
    }
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

  ngOnDestroy(): void {
    this.summaryBar.close();
    this.overlayNotification.close();
    this.destroy$.next();
    this.destroy$.complete();
    this.commonFacade.clearTransactionConfig();
    this.commonFacade.setCMOtherCharges(null);
    this.toolbarFacade.resetValues();
    this.orderConfirmationFacade.resetValues();
    this.commonFacade.setCMOrderNumber({ orderNo: 0, status: null });
    this.customerFacade.clearCustomerSearch();
    this.printingService.resetPrint();
    this.toolbarFacade.setToolbarConfig({
      loadMetalPrices: true,
      loadHoldPopup: false,
      loadOpenOrdersPopup: false
    });
    this.cashMemoFacade.resetValues();
    this.isIGSTSelected = false;
    this.commonFacade.setIsIGSTFlag(false);
    this.commonFacade.clearCmImageUrl();
    this.orderStatus = null;
    this.paymentFacade.resetDeletedPayment();
  }
}
