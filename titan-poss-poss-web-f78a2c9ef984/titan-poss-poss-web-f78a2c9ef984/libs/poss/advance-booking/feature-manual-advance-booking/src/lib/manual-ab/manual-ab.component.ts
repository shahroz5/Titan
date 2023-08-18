import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Event, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AdvanceBookingFacade } from '@poss-web/poss/advance-booking/data-access-advance-booking';
import { FocFacade } from '@poss-web/poss/foc/data-access-foc';
import { FocNotAddedPopupComponent } from '@poss-web/poss/foc/ui-foc-popups';
import { DiscountFacade } from '@poss-web/poss/shared/discount/data-access-discount';
import { ProductFacade } from '@poss-web/poss/shared/product/data-access-product';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import {
  CurrencyFormatterService,
  WeightFormatterService
} from '@poss-web/shared/components/ui-formatters';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import {
  AdvanceBookingDetailsResponse,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  CommomStateAttributeNameEnum,
  CommomStateAttributeTypeEnum,
  ConfigTypeEnum,
  CustomErrors,
  CustomerServiceAbstraction,
  CUSTOMER_TYPE_ENUM,
  DiscountTypeEnum,
  FileUploadLists,
  FreezeRateEnum,
  InvoiceDeliveryTypes,
  ManualBillRequest,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  PanCardPopupAbstraction,
  PanFormVerifyPopupServiceAbstraction,
  PaymentDetails,
  PaymentModeEnum,
  PaymentStatusEnum,
  PostTransactionConfirmationActionsServiceAbstraction,
  printDocTypeEnum,
  printFileTypeEnum,
  PrintingServiceAbstraction,
  printTransactionTypesEnum,
  printTypesEnum,
  SharedBodEodFeatureServiceAbstraction,
  StatusTypesEnum,
  SubTransactionTypeEnum,
  SummaryBarEventRef,
  SummaryBarEventType,
  SummaryBarServiceAbstraction,
  SummaryBarType,
  ToolbarConfig,
  TransactionTypeEnum,
  UpdateOrderDetails,
  ValidationTypesEnum
} from '@poss-web/shared/models';
import {
  OrderConfirmationFacade,
  OrderService
} from '@poss-web/shared/order-confirmation/data-access-order-confirmation';
import { PaymentFacade } from '@poss-web/shared/payment/data-access-payment';
import { ToolbarFacade } from '@poss-web/shared/toolbar/data-access-toolbar';
import { PrintingFacade } from '@poss-web/shared/printing/data-access-printing';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { getManualAdvanceBookingNewUrl } from '@poss-web/shared/util-site-routes';
import * as moment from 'moment';
import { Moment } from 'moment';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, take, takeUntil, withLatestFrom } from 'rxjs/operators';
import { FileFacade } from '@poss-web/shared/file-upload/data-access-file-upload';
import { ValidateCustomerService } from '@poss-web/shared/customer/feature-customer-create';

@Component({
  selector: 'poss-web-manual-ab',
  templateUrl: './manual-ab.component.html',
  styleUrls: ['./manual-ab.component.scss']
})
export class ManualAbComponent implements OnInit, OnDestroy {
  customerId = null;
  customer = null;
  orderId = null;
  totalQty = 0;
  totalAmt = 0;
  enableFreeze = true;
  finalAmt = 0;
  totalDisc = 0;
  totalWeight = 0;
  creditnote = [];
  totalTax = 0;
  productAmt = 0;
  paidValue = 0;
  hallmarkCharges = 0;
  hallmarkDiscount = 0;
  metalRate: any;
  otherChargesList: any;
  standardPrice: any;
  rowNumber = -1;
  locationCode: string;
  docNo: number;
  reqNo: number;
  frozenAB: boolean;
  isViewFlag = false;
  PrintErrorText: string;
  inABFrozenAmount: number;
  confirmedOrder: AdvanceBookingDetailsResponse;

  isLoading$: Observable<boolean>;

  destroy$: Subject<null> = new Subject<null>();
  @Output() orderNumber = new EventEmitter<number>();

  @ViewChild('confirmSuccessNotificationTemplate', { static: true })
  confirmSuccessNotificationTemplate: TemplateRef<any>;
  @ViewChild('confirmApprovalNotificationTemplate', { static: true })
  confirmApprovalNotificationTemplate: TemplateRef<any>;
  actionType = ValidationTypesEnum.REGULARIZE;

  @Output() clearProductGridData = new EventEmitter<null>();
  TransactionTypeEnumRef = TransactionTypeEnum;
  detailsFlag$: Subject<boolean> = new Subject<boolean>();
  billDetails: any;
  validationType: string;
  businessDate: Moment;
  validationTypesEnum = ValidationTypesEnum;
  toolbarData: ToolbarConfig = {
    txnType: TransactionTypeEnum.AB,
    subTxnType: SubTransactionTypeEnum.MANUAL_AB,
    loadMetalPrices: true,
    loadHoldPopup: true,
    loadOpenOrdersPopup: true
  };
  alertMsgForPan: string;
  bgrAllowed = false;
  reloadABFlag = false;
  minABValue: number;
  isLoadingOrder$: Observable<boolean>;
  summaryBarRemarks$ = new Subject<string>();
  id: any;
  paymentDetails: PaymentDetails[];
  currencyCode: string;
  isLoggedIn: boolean;
  imageUrl: string;
  confirmRemarks: any;
  manualBillDetails = null;
  creditNotePaymentToBeDeleted: PaymentDetails = null;
  maxAllowedAmount: number;
  panMandatoryForAdvance: boolean;
  karatExchangeOfferDiscountSelected = null;
  gepPurityDiscountSelected = null;
  bussinessDay: number;
  MinABFrozenAmount: number;
  customerPAN: any;
  isFocAdded = false;
  availableFocSchemes = 0;
  availableFocSchemesForProducts = false;
  availableFocSchemesForSelectedProducts = true;
  ghsCustomerId = null;
  refundAmountAsCash = 0;
  customerType: any;
  form60Submitted: boolean;
  enableCalculateRivaahGhsDiscount = false;
  calculateRivaahGhsDiscWarningMsg1: string;
  calculateRivaahGhsDiscWarningMsg2: string;
  isLastTransactionPrint = false;
  gstNumber: string;
  idProof: string;
  reloadCustomerForGHS = false;
  selectedFOCSchemesCount = 0;
  newlyGeneratedCn: any;
  resetValidationType$: Subject<null> = new Subject<null>();
  isProfileMatched: boolean;
  prodToBeCollectedByAction = false;
  isCNPrinting = false;
  printActions: any;
  showSuccessMessage = false;

  constructor(
    public customerFacade: CustomerFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private summaryBar: SummaryBarServiceAbstraction,
    private manualAbFacade: AdvanceBookingFacade,
    private toolbarFacade: ToolbarFacade,
    private translate: TranslateService,
    private printingFacade: PrintingFacade,
    private paymentFacade: PaymentFacade,
    private commonFacade: CommonFacade,
    private bodEodFeatureService: SharedBodEodFeatureServiceAbstraction,
    public printingService: PrintingServiceAbstraction,
    private authFacade: AuthFacade,
    private orderService: OrderService,
    private router: Router,
    private orderConfirmationFacade: OrderConfirmationFacade,
    private activatedRoute: ActivatedRoute,
    private productFacade: ProductFacade,
    private weightFormatterService: WeightFormatterService,
    private currencyFormatterService: CurrencyFormatterService,
    private discountFacade: DiscountFacade,
    private alertPopupService: AlertPopupServiceAbstraction,
    private postConfirmationActions: PostTransactionConfirmationActionsServiceAbstraction,
    private focFacade: FocFacade,
    private dialog: MatDialog,
    private panCardServiceAbstraction: PanCardPopupAbstraction,
    private panFormVerifyPopupService: PanFormVerifyPopupServiceAbstraction,
    private fileFacade: FileFacade,
    private customerService: CustomerServiceAbstraction,
    private validateCustomerService: ValidateCustomerService
  ) {
    this.translate
      .get([
        'pw.otherReceiptsIssues.printError',
        'pw.regularCashMemo.alertMsgForPan',
        'pw.discount.calculateRivaahGhsDiscWarningMsg1',
        'pw.discount.calculateRivaahGhsDiscWarningMsg2'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.PrintErrorText =
          translatedMessages['pw.otherReceiptsIssues.printError'];
        this.alertMsgForPan =
          translatedMessages['pw.regularCashMemo.alertMsgForPan'];
        this.calculateRivaahGhsDiscWarningMsg1 =
          translatedMessages['pw.discount.calculateRivaahGhsDiscWarningMsg1'];
        this.calculateRivaahGhsDiscWarningMsg2 =
          translatedMessages['pw.discount.calculateRivaahGhsDiscWarningMsg2'];
      });
  }
  ngOnInit() {
    this.clearPage(true);
    this.overlayNotification.close();
    this.summaryBar.close();
    this.toolbarFacade.setToolbarConfig(this.toolbarData);
    this.showSummaryBar();
    this.getCashMemoReponse();
    this.getCustomerResponse();
    this.commonFacade.setFileUploadVisible(true);
    this.authFacade
      .isUserLoggedIn()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: boolean) => {
        this.isLoggedIn = data;
      });

    this.bodEodFeatureService
      .getBusinessDayDate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(businessDate => {
        this.businessDate = moment(businessDate);
        this.bussinessDay = businessDate;
      });

    this.componentInit();
    this.router.events
      .pipe(
        filter(
          (event: Event) => event instanceof NavigationEnd && this.isLoggedIn
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.id = this.activatedRoute.snapshot.params['_id'];

        if (this.id !== 'new') {
          this.clearPage(false);
          this.manualAbFacade.viewCashMemo({
            id: this.id,
            txnType: TransactionTypeEnum.AB,
            subTxnType: SubTransactionTypeEnum.MANUAL_AB
          });
        }
      });
    if (this.activatedRoute.snapshot.params['_id'] !== 'new') {
      this.id = this.activatedRoute.snapshot.params['_id'];
      this.clearPage(true);
      this.manualAbFacade.viewCashMemo({
        id: this.id,
        txnType: TransactionTypeEnum.AB,
        subTxnType: SubTransactionTypeEnum.MANUAL_AB
      });
    }

    this.detailsFlag$.next(false);
    this.productFacade.setGridSearchEnable(false);
  }

  showSummaryBar() {
    this.summaryBar
      .open(SummaryBarType.AB_MB, {
        actionType: this.actionType,
        clearType: true,
        remarks: this.summaryBarRemarks$.asObservable()
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: SummaryBarEventRef) => {
        this.isLastTransactionPrint = false;
        switch (event.eventType) {
          case SummaryBarEventType.CLAER: {
            this.clearPage(true);
            this.router.navigate([getManualAdvanceBookingNewUrl()]);
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
            if (!this.customerId) {
              this.errorNotifications('Please Select Customer');
            } else {
              let isFormValidated = this.validateCustomerService.validateCustomer(
                this.customer
              );
              if (isFormValidated) {
                this.confirmRemarks = event;

                if (
                  this.totalQty !== 0 &&
                  this.panMandatoryForAdvance &&
                  this.paidValue > this.maxAllowedAmount &&
                  !this.isProfileMatched
                  // ((this.customerType === CUSTOMER_TYPE_ENUM.INTERNATIONAL &&
                  //   !this.form60Submitted) ||
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
                  this.manualAbFacade.ValidateMetalRate({
                    id: this.id,
                    status: StatusTypesEnum.CONFIRMED,
                    txnType: TransactionTypeEnum.AB,
                    subTxnType: SubTransactionTypeEnum.MANUAL_AB,
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
              }
            }
            break;
          }

          case SummaryBarEventType.DELETE: {
            if (this.orderId) {
              this.manualAbFacade.deleteCashMemo({
                id: this.orderId,
                txnType: TransactionTypeEnum.AB,
                subTxnType: SubTransactionTypeEnum.MANUAL_AB
              });
            } else
              this.showSimpleNotifications('pw.regularCashMemo.deleteOrderMsg');

            break;
          }

          case SummaryBarEventType.PRINT: {
            this.isLastTransactionPrint = true;
            this.printLastTransaction();
            break;
          }
        }
      });
  }

  openPanCardPopUp() {
    this.panCardServiceAbstraction.open(this.customerId, this.customerType);
  }

  confirmABWithFreezeCheck() {
    if (
      !this.frozenAB &&
      this.MinABFrozenAmount !== 0 &&
      this.paidValue >= this.MinABFrozenAmount
    ) {
      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.CONFIRM,
          message:
            'Order is eligible for freezing rate. Do you want to proceed without gold rate Freeze ?'
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: boolean) => {
          if (res) {
            this.orderService.ConfirmAllBillLevelDiscounsts(
              this.orderId,
              TransactionTypeEnum.AB,
              SubTransactionTypeEnum.MANUAL_AB,
              null
            );
          }
        });
    } else {
      this.orderService.ConfirmAllBillLevelDiscounsts(
        this.orderId,
        TransactionTypeEnum.AB,
        SubTransactionTypeEnum.MANUAL_AB,
        null
      );
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

  printLastTransaction() {
    this.printingFacade.loadLastTransactionId({
      searchValue: '',
      status: StatusTypesEnum.CONFIRMED,
      txnType: TransactionTypeEnum.AB,
      subTxnType: SubTransactionTypeEnum.MANUAL_AB,
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
                this.printingService.loadPrintData({
                  printType: printTypesEnum.AB_PRINTS,
                  transacionId: lastTransactionId,
                  transacionType: printTransactionTypesEnum.SALES,
                  printFileType: printFileTypeEnum.INVOICE_PRINT,
                  doctype: printDocTypeEnum.CUSTOMER_PRINT,
                  lastTransactionPrint: true,
                  reprint: false,
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
              this.isCNPrinting = false;
              action = InvoiceDeliveryTypes.MAIL;
              break;
            }
            case 'both': {
              action = InvoiceDeliveryTypes.BOTH;
              break;
            }
          }
          this.printActions = action;
          this.printAB(action);
        }
      });
  }

  printAB(action) {
    this.printingService.loadPrintData({
      printType: printTypesEnum.AB_PRINTS,
      transacionId: this.orderId,
      transacionType: printTransactionTypesEnum.SALES,
      printFileType: printFileTypeEnum.INVOICE_PRINT,
      doctype: printDocTypeEnum.CUSTOMER_PRINT,
      reprint: false,
      customerId: this.customerId,
      invoiceType: action
    });
    this.isCNPrinting = true;
    if (this.creditnote.length == 0) {
      this.showSuccessMessage = true;
    }
  }

  printCN(action) {
    this.printingService.loadPrintData({
      printType: printTypesEnum.CREDIT_NOTE,
      transacionId: this.orderId,
      transacionType: printTransactionTypesEnum.SALES,
      printFileType: printFileTypeEnum.INVOICE_PRINT,
      doctype: printDocTypeEnum.CUSTOMER_PRINT,
      reprint: false,
      customerId: this.customerId,
      invoiceType: action
    });
    this.showSuccessMessage = true;
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

  componentInit() {
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.TOLERANCE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((offerDetails: any) => {
        if (offerDetails && offerDetails?.data) {
          if (
            moment(this.businessDate) >=
              moment(offerDetails.data.bgrOfferFromDate) &&
            moment(this.businessDate) <=
              moment(offerDetails.data.bgrOfferToDate)
          ) {
            this.bgrAllowed = true;
          }
        } else {
          this.bgrAllowed = false;
        }
      });
    this.isLoading$ = this.manualAbFacade.getIsLoading();
    this.isLoadingOrder$ = this.orderConfirmationFacade.getIsLoading();
    this.authFacade
      .getLocationCode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.locationCode = data;
      });

    this.commonFacade.setTransactionConfig({
      isPaymentEditable: true,
      transactionType: {
        type: TransactionTypeEnum.AB,
        subType: SubTransactionTypeEnum.MANUAL_AB
      },
      taxTransactionType: TransactionTypeEnum.CUST_TRANSACTION_AB
    });
    this.orderConfirmationFacade
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

    this.productFacade
      .getDiscountSelected()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isDiscountSelected => {
        if (isDiscountSelected) {
          this.reloadAB();
        }
      });

    this.discountFacade
      .getIsReloadDiscountsGrid()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isReload => {
        if (isReload) {
          this.reloadAB();
          this.discountFacade.loadReloadDiscountsGrid(false);
        }
      });

    this.discountFacade
      .getIsTransactionLevelDiscountApplied()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isDiscountSelected => {
        if (isDiscountSelected) {
          this.reloadAB();
        }
      });

    this.discountFacade
      .getIsAllAppliedTransactionLevelDiscountsDeleted()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isDiscountDeleted => {
        if (isDiscountDeleted.isDeleted) {
          this.reloadAB();
        }
      });

    this.customerFacade
      .getBrandDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(brandDetail => {
        if (brandDetail) {
          this.maxAllowedAmount =
            brandDetail?.panCardDetails?.data?.configurationAmountForAdvance;
          this.panMandatoryForAdvance =
            brandDetail?.panCardDetails?.data?.isPanCardMandatoryforAdvance;
        }
      });

    this.paymentFacade
      .getCreditNotePaymentToBeDeleted()
      .pipe(takeUntil(this.destroy$))
      .subscribe((creditNotePaymentToBeDeleted: PaymentDetails) => {
        this.creditNotePaymentToBeDeleted = creditNotePaymentToBeDeleted;
      });

    this.discountFacade
      .getIsSelectedTransactionLevelDiscountDeleted()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isDiscountDeleted => {
        if (isDiscountDeleted) {
          if (this.creditNotePaymentToBeDeleted) {
            this.paymentFacade.deletePayment({
              paymentId: this.creditNotePaymentToBeDeleted.id,
              transactionType: TransactionTypeEnum.AB,
              subTransactionType: SubTransactionTypeEnum.MANUAL_AB
            });
            this.creditNotePaymentToBeDeleted = null;
          }
          this.reloadAB();
        }
      });

    this.discountFacade
      .getConfimrationDiscountState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(discountStatus => {
        if (discountStatus) {
          discountStatus === PaymentStatusEnum.COMPLETED
            ? this.confirmManualAB(this.confirmRemarks)
            : this.discountsRemoveAlert(discountStatus);
        }
      });

    this.manualAbFacade
      .getIsMetalRateValidated()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isMetalRateValidated => {
        if (isMetalRateValidated === true) {
          if (
            this.totalQty !== 0 &&
            this.availableFocSchemes &&
            (this.availableFocSchemesForProducts ||
              this.availableFocSchemesForSelectedProducts) &&
            !this.isFocAdded
          ) {
            this.openFocNotAddedPopup(event);
          } else if (this.enableCalculateRivaahGhsDiscount) {
            this.calculateRivaahGHSAlert();
          } else {
            this.confirmABWithFreezeCheck();
          }
        }
      });

    this.discountFacade
      .getAppliedKaratorCoinOfferDiscountResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(appliedDiscount => {
        if (appliedDiscount) {
          this.reloadAB();
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

    this.manualAbFacade
      .getHasError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.manualAbFacade
      .getMinABValue()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: number) => {
        this.commonFacade.setABMinABVAlue(data);
      });

    this.manualAbFacade
      .getMinFrozenABAmount()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: number) => {
        this.commonFacade.setminFrozenABVAlue(data);
      });

    this.manualAbFacade
      .getFrozenABValue()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: boolean) => {
        this.commonFacade.setFrozenABVAlue(data);
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.ADVANCE_BOOKING,
        CommomStateAttributeNameEnum.MIN_AB_VALUE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: number) => {
        this.minABValue = data;
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.ADVANCE_BOOKING,
        CommomStateAttributeNameEnum.MIN_FROZEN_AB_VALUE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: number) => {
        this.MinABFrozenAmount = data;
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.ADVANCE_BOOKING,
        CommomStateAttributeNameEnum.FROZEN_AB_VALUE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: boolean) => {
        this.frozenAB = data;
      });
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.ADVANCE_BOOKING,
        CommomStateAttributeNameEnum.AB_ORDER_WEIGHT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data) {
          this.manualBillDetails = {
            ...this.manualBillDetails,
            orderWeightDetails: data
          };
        }
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.ADVANCE_BOOKING,
        CommomStateAttributeNameEnum.TOTAL_QUANTITY
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(quantity => {
        this.totalQty = quantity;
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.ADVANCE_BOOKING,
        CommomStateAttributeNameEnum.TOTAL_AMT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(amt => {
        this.totalAmt = amt;
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.ADVANCE_BOOKING,
        CommomStateAttributeNameEnum.FINAL_AMT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(amt => {
        this.finalAmt = amt;
        this.commonFacade.setTransactionTotalAmount(amt);
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.ADVANCE_BOOKING,
        CommomStateAttributeNameEnum.TOTAL_WEIGHT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(weight => {
        this.totalWeight = weight;
      });

    this.manualAbFacade
      .getFreezeRateResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: AdvanceBookingDetailsResponse) => {
        if (data) {
          this.manualBillDetails = data;
        }
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.ADVANCE_BOOKING,
        CommomStateAttributeNameEnum.TOTAL_DISCOUNT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(disc => {
        this.totalDisc = disc;
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.ADVANCE_BOOKING,
        CommomStateAttributeNameEnum.TAX_AMT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(tax => {
        this.totalTax = tax;
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.ADVANCE_BOOKING,
        CommomStateAttributeNameEnum.HALLMARK_CHARGES
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(hallmarkCharges => {
        this.hallmarkCharges = hallmarkCharges;
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.ADVANCE_BOOKING,
        CommomStateAttributeNameEnum.HALLMARK_DISCOUNT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(hallmarkDiscount => {
        this.hallmarkDiscount = hallmarkDiscount;
      });

    this.orderConfirmationFacade
      .confirmCashMemoResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: AdvanceBookingDetailsResponse) => {
        if (data) {
          this.confirmedOrder = data;
          this.updateCashMemoNotification();
          this.reloadOpenAndHoldValues(false);
        }
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.ADVANCE_BOOKING,
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

    this.manualAbFacade
      .getFileUploadRes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data) {
          this.manualAbFacade.loadFileUploadList({
            txnType: TransactionTypeEnum.AB,
            id: this.orderId,
            customerId: this.customerId
          });
        }
      });

    this.manualAbFacade
      .getFileUploadListRes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: FileUploadLists[]) => {
        if (data.length !== 0)
          this.manualAbFacade.loadFileDownloadUrl({
            id: data[data.length - 1].id,
            locationCode: null
          });
      });

    this.manualAbFacade
      .getFileDownloadUrl()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: string) => {
        this.imageUrl = data;
      });

    combineLatest([
      this.focFacade.getSavedABFocSchemes().pipe(takeUntil(this.destroy$)),
      this.focFacade.getSelectedABFocSchemes().pipe(takeUntil(this.destroy$)),
      this.focFacade
        .getSelectedABFocSchemesCount()
        .pipe(takeUntil(this.destroy$)),
      this.focFacade.getDeletedABFocSchemes().pipe(takeUntil(this.destroy$))
    ]).subscribe(
      ([
        savedFOCSchemes,
        selectedFOCSchemes,
        selectedFOCSchemesCount,
        deletedFocSchemes
      ]) => {
        if (
          savedFOCSchemes ||
          selectedFOCSchemes ||
          selectedFOCSchemesCount ||
          deletedFocSchemes
        ) {
          this.selectedFOCSchemesCount = selectedFOCSchemesCount;
          if (
            (savedFOCSchemes !== null ||
              (selectedFOCSchemes && selectedFOCSchemes.length) ||
              selectedFOCSchemesCount) &&
            !deletedFocSchemes
          ) {
            this.isFocAdded = true;
          } else this.isFocAdded = false;
        }
      }
    );

    this.focFacade
      .getAvailableSchemes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.availableFocSchemes = data.length;
      });

    this.focFacade
      .getABFocSchemesForItems()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.availableFocSchemesForProducts = data;
      });

    this.focFacade
      .getABFocSchemes()
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
            this.reloadAB();
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
            this.reloadAB();
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
            (discountDetails.discountType ===
              DiscountTypeEnum.DIGI_GOLD_DISCOUNT &&
              discountDetails.referenceId.toUpperCase() ===
                paymentDetails?.id.toUpperCase())
          ) {
            this.reloadAB();
          }
        }
      });
  }

  getCashMemoReponse() {
    this.manualAbFacade
      .getCreateCashMemoResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data !== null) {
          this.manualBillDetails = data;
          this.id = data.id;
          this.detailsFlag$.next(true);

          this.orderId = data.id;
          this.commonFacade.setFileUploadVisible(true);
          this.manualAbFacade.setOrderNumber(data.docNo, data.status);
          this.commonFacade.setABOrderNumber({
            orderNo: data.docNo,
            status: data.status
          });
          this.productFacade.setGridSearchEnable(true);
          this.manualAbFacade.partialUpdateCashMemo({
            id: this.orderId,
            requestDetails: {
              customerId: this.customerId,
              isFrozenRate: true,
              isBestRate: false
            },
            txnType: TransactionTypeEnum.AB,
            subTxnType: SubTransactionTypeEnum.MANUAL_AB
          });

          this.commonFacade.setTransactionTD(data.id);

          this.customerFacade.loadSelectedCustomer(
            String(this.customerId),
            false
          );
        }
      });

    this.manualAbFacade
      .getViewCashMemoResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: AdvanceBookingDetailsResponse) => {
        this.discountFacade.clearOrderDiscDetails();
        this.discountFacade.setOrderDiscDetails(data);
        // if (
        //   data?.discountDetails?.data?.rivaahGhsDiscountDetails
        //     ?.isRivaahDiscountApplicable
        // )
        //   this.discountFacade.setEnableCalculateRivaahGHSDiscounts(true);
        // else this.discountFacade.setEnableCalculateRivaahGHSDiscounts(false);

        if (data) {
          if (this.reloadABFlag) {
            if (this.reloadCustomerForGHS && data.customerId) {
              this.customerFacade.loadSelectedCustomer(
                String(this.ghsCustomerId),
                false
              );
              this.reloadCustomerForGHS = false;
            }
            this.productFacade.setItemIDList({
              item: data,
              isUpdate: false,
              isGetHeaderDetails: true
            });
            this.reloadABFlag = false;
          } else {
            this.commonFacade.setFileUploadVisible(true);
            this.manualBillDetails = data;
            console.log(data, this.billDetails);
            this.detailsFlag$.next(true);
            this.orderId = data.id;
            this.commonFacade.setTransactionTD(data.id);
            this.manualAbFacade.setOrderNumber(data.docNo, data.status);
            this.commonFacade.setABOrderNumber({
              orderNo: data.docNo,
              status: data.status
            });
            this.productFacade.setGridSearchEnable(true);
            this.productFacade.setStandardPrice(data.metalRateList.metalRates);
            this.customerFacade.loadSelectedCustomer(
              String(data.customerId),
              false
            );
            this.isViewFlag = true;
            if (data.status === StatusTypesEnum.OPEN) {
              this.validationType = data?.manualBillDetails?.validationType;

              if (
                this.validationType === ValidationTypesEnum.PASSWORD_VALIDATION
              ) {
                this.actionType = ValidationTypesEnum.REGULARIZE;
                this.showSummaryBar();
              } else if (
                this.validationType === ValidationTypesEnum.REQUEST_APPROVAL
              ) {
                this.actionType = ValidationTypesEnum.SENDAPPROVAL;
                this.showSummaryBar();
              }
              this.productFacade.resetItemIdList();
              this.productFacade.setItemIDList({ item: data, isUpdate: false });
              if (
                this.validationType === ValidationTypesEnum.REQUEST_APPROVAL
              ) {
                this.manualAbFacade.loadFileUploadList({
                  txnType: TransactionTypeEnum.AB,
                  id: data.id,
                  customerId: data.customerId
                });
              }
            }
          }
        }
      });

    this.manualAbFacade
      .getPartailUpdateCashMemoResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: AdvanceBookingDetailsResponse) => {
        if (data) {
          this.standardPrice = data.metalRateList.metalRates;
          this.productFacade.setStandardPrice(data.metalRateList.metalRates);
          this.manualBillDetails = data;
          if (this.prodToBeCollectedByAction) {
            const successKey =
              'pw.advanceBooking.updateABDetailsSuccessMessage';
            this.updateABDetailsNotification(successKey);
            this.prodToBeCollectedByAction = false;
          }
        }
      });

    this.manualAbFacade
      .getDeleteCashMemoResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: boolean) => {
        if (data !== false) {
          const successKey = 'pw.advanceBooking.deleteCMSuccessMessage';
          this.deleteCashMemoNotification(successKey);
          this.reloadOpenAndHoldValues();
        }
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
          if (this.printActions) {
            if (this.isCNPrinting && this.creditnote.length > 0) {
              this.printCN(this.printActions);
              this.isCNPrinting = false;
            }
            if (this.showSuccessMessage) {
              this.showAlertPopUp('pw.regularCashMemo.printingSuccessMessage');
              this.showSuccessMessage = false;
            }
          }
        }
      });
  }

  getCustomerResponse() {
    this.customerFacade
      .getSelectSelectedCustomer()
      .pipe(takeUntil(this.destroy$))
      .subscribe(customer => {
        if (customer) {
          this.customerPAN = customer.custTaxNo;
          this.customerId = customer.customerId;
          this.customer = customer;
          this.customerType = customer.customerType;
          this.form60Submitted =
            customer.customerDetails.data.form60AndIdProofSubmitted;
          this.gstNumber = customer.instiTaxNo;
          this.idProof = customer.customerDetails.data.idProof;
        } else {
          this.customerId = null;
          this.customer = null;
          this.customerPAN = null;
          this.customerType = null;
          this.gstNumber = null;
          this.idProof = null;
        }
      });
  }

  confirmManualAB(event) {
    const orderDetails: UpdateOrderDetails = {
      cashMemoId: this.orderId,
      orderDetails: {
        customerId: this.customerId,
        metalRateList: this.metalRate,
        finalValue: this.finalAmt,
        otherCharges: null,
        paidValue: this.currencyRoundOff(this.paidValue),
        remarks: event.remarks ? event.remarks : null,
        totalDiscount: this.currencyRoundOff(this.totalDisc),
        totalQuantity: this.totalQty,

        totalTax: this.currencyRoundOff(this.totalTax),
        totalValue: this.currencyRoundOff(this.totalAmt),
        totalWeight: this.weightRoundOff(this.totalWeight),

        minValue: this.minABValue,
        hallmarkCharges: this.currencyRoundOff(this.hallmarkCharges),
        hallmarkDiscount: this.currencyRoundOff(this.hallmarkDiscount)
      },
      status:
        this.actionType === ValidationTypesEnum.REGULARIZE
          ? StatusTypesEnum.CONFIRMED
          : StatusTypesEnum.APPROVAL_PENDING,
      transactionType: TransactionTypeEnum.AB,
      subTransactionType: SubTransactionTypeEnum.MANUAL_AB
    };

    const msg = this.orderService.confirmOrder(
      orderDetails,
      this.paymentDetails,
      TransactionTypeEnum.AB
    );

    if (msg) {
      this.errorNotifications(msg);
    }
  }

  freezeRate(type) {
    // this.manualAbFacade.freezeAdvanceBooking({
    //   id: this.orderId,
    //   requestDetails: {
    //     customerId: this.customerId,
    //     isFrozenRate: type === FreezeRateEnum.YES ? true : false,
    //     isBestRate: false
    //   },
    //   txnType: TransactionTypeEnum.AB,
    //   subTxnType: SubTransactionTypeEnum.MANUAL_AB
    // });
  }

  openErrorMsgForOrder(message) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.INFO,
        message: message
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
        }
      });
  }

  bestRate(type: boolean) {
    // this.manualAbFacade.freezeAdvanceBooking({
    //   id: this.customerId,
    //   requestDetails: {
    //     customerId: this.customerId,
    //     isFrozenRate: false,
    //     isBestRate: type
    //   },
    //   txnType: TransactionTypeEnum.AB,
    //   subTxnType: SubTransactionTypeEnum.MANUAL_AB
    // });
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
        if (!this.isLastTransactionPrint) this.updateCashMemoNotification();
      });
  }

  /**
   * to display error message
   * @param error : error from api
   */
  errorHandler(error: CustomErrors) {
    if (error.code === 'ERR-CORE-034') {
      const key = 'pw.manualCashMemo.metalPriceNotificationMsg';
      this.errorNotifications(key);
    } else if (error.code === ErrorEnums.ERR_QZ_TRAY) {
      this.printError(error.message);
    } else if (error.code === ErrorEnums.ERR_CUST_001) {
      this.customerService.open({
        customerType: this.customerType,
        customerId: this.customerId
      });
    } else {
      this.overlayNotification
        .show({
          type: OverlayNotificationType.ERROR,
          hasClose: true,
          error: error
        })
        .events.pipe(takeUntil(this.destroy$))
        .subscribe();
    }
  }

  reloadAB() {
    if (this.orderId) {
      const tempId = this.orderId;
      this.reloadABFlag = true;
      this.commonFacade.clearTransactionTD();
      this.manualAbFacade.viewCashMemo({
        id: tempId,
        txnType: TransactionTypeEnum.AB,
        subTxnType: SubTransactionTypeEnum.MANUAL_AB
      });
      this.commonFacade.setTransactionTD(tempId);
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

  updateCashMemoNotification() {
    let template;
    if (this.confirmedOrder.status === StatusTypesEnum.APPROVAL_PENDING) {
      this.reqNo = this.confirmedOrder.manualBillDetails.requestNo;
      template = this.confirmApprovalNotificationTemplate;
    } else {
      this.docNo = this.confirmedOrder.docNo;
      this.creditnote = this.confirmedOrder.creditNotes;
      template = this.confirmSuccessNotificationTemplate;
    }
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
          this.router.navigate([getManualAdvanceBookingNewUrl()]);
          this.isViewFlag = false;
          this.actionType = ValidationTypesEnum.REGULARIZE;
          this.showSummaryBar();
          this.resetValidationType$.next();
        }
      });
  }

  clearPage(clearTransactionID: boolean) {
    if (clearTransactionID) {
      this.commonFacade.clearTransactionTD();
      this.productFacade.clearProductGrid();
      this.productFacade.setGridSearchEnable(false);
      this.focFacade.clearABFocSchemes();
      this.focFacade.clearABFocSchemesCount();
      this.focFacade.clearFocSchemesForItems();
    }
    this.discountFacade.clearTransactionLevelDiscountDetails();
    this.confirmedOrder = null;

    this.commonFacade.clearAdvanceBooking();
    this.productFacade.resetValues();
    this.paymentFacade.clearPaymentDetails();
    this.manualAbFacade.resetValues();
    this.customerId = null;
    this.customer = null;
    this.orderId = null;
    this.isProfileMatched = false;
    this.customerFacade.clearCustomerSearch();
    this.overlayNotification.close();
    this.rowNumber = -1;

    this.orderConfirmationFacade.resetValues();
    this.commonFacade.setABMinABVAlue(0);
    this.commonFacade.setminFrozenABVAlue(0);
    this.detailsFlag$.next(false);
    this.reloadABFlag = false;
    this.orderNumber.emit(0);
    this.summaryBarRemarks$.next('');
    this.fileFacade.clearResponse();
    this.fileFacade.clearFileList(true);
    this.discountFacade.clearOrderDiscDetails();
    this.commonFacade.clearTcsAmount();
    this.commonFacade.setABOrderNumber({
      orderNo: 0,
      status: null
    });
    this.reloadCustomerForGHS = false;
    this.selectedFOCSchemesCount = 0;
    this.prodToBeCollectedByAction = false;
    this.manualBillDetails = null;
  }

  validateBill(event: ManualBillRequest) {
    console.log(event);
    if (this.customerId !== null) {
      this.manualAbFacade.createCashMemo({
        requestDetails: event,
        txnType: TransactionTypeEnum.AB,
        subTxnType: SubTransactionTypeEnum.MANUAL_AB
      });
    }
  }

  loadOpenValues() {
    this.toolbarFacade.loadOpenOrdersCount({
      status: StatusTypesEnum.OPEN,
      txnType: TransactionTypeEnum.AB,
      subTxnType: SubTransactionTypeEnum.MANUAL_AB
    });
    this.toolbarFacade.loadOpenOrders({
      searchValue: '',
      status: StatusTypesEnum.OPEN,
      txnType: TransactionTypeEnum.AB,
      subTxnType: SubTransactionTypeEnum.MANUAL_AB,
      pageIndex: 0,
      pageSize: 10
    });
  }

  loadHoldValues() {
    this.toolbarFacade.loadOnHoldCount({
      status: StatusTypesEnum.HOLD,
      txnType: TransactionTypeEnum.AB,
      subTxnType: SubTransactionTypeEnum.MANUAL_AB
    });
    this.toolbarFacade.loadOnHold({
      searchValue: '',
      status: StatusTypesEnum.HOLD,
      txnType: TransactionTypeEnum.AB,
      subTxnType: SubTransactionTypeEnum.MANUAL_AB,
      pageIndex: 0,
      pageSize: 10
    });
  }

  validationTypeChange(event: string) {
    console.log('val', event);
    if (event === ValidationTypesEnum.PASSWORD) {
      this.actionType = ValidationTypesEnum.REGULARIZE;
      this.showSummaryBar();
    } else if (event === ValidationTypesEnum.APPROVAL) {
      this.actionType = ValidationTypesEnum.SENDAPPROVAL;
      this.showSummaryBar();
    }
  }

  uploadFile(event: FormData) {
    this.manualAbFacade.loadFileUpload({
      file: event,
      txnType: TransactionTypeEnum.AB,
      id: this.orderId
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
  discountsRemoveAlert(discountType: string) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.ERROR,
        message:
          'No Products have availed ' +
          discountType +
          ' discounts, Please Remove ' +
          discountType +
          ' discounts at Order level to Proceed further'
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
          headerLabel: 'pw.foc.focSchemeNotAdded',
          infoLabel: 'pw.foc.pleseCheckEligibilityForSchemesMsg'
        }
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          if (this.enableCalculateRivaahGhsDiscount) {
            this.calculateRivaahGHSAlert();
          } else {
            this.confirmABWithFreezeCheck();
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
          this.confirmABWithFreezeCheck();
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
              this.router.navigate([getManualAdvanceBookingNewUrl()]);
              this.isViewFlag = false;
              this.actionType = ValidationTypesEnum.REGULARIZE;
              this.showSummaryBar();
              this.resetValidationType$.next();
            }
          });
      });
  }

  reloadOpenAndHoldValues(holdReload = true) {
    this.loadOpenValues();
    if (holdReload) this.loadHoldValues();
  }

  showPanFormVerifyPopup() {
    this.panFormVerifyPopupService
      .open({
        type: AlertPopupTypeEnum.INFO,
        id: this.id,
        customerId: this.customerId,
        customerType: this.customerType,
        txnType: TransactionTypeEnum.AB
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((dailogResponse: boolean) => {
        this.isProfileMatched = dailogResponse;
      });
  }

  prodToBeCollectedBy(event) {
    const request = {
      collectedBy: event
    };
    this.prodToBeCollectedByAction = true;
    this.manualAbFacade.partialUpdateCashMemo({
      id: this.orderId,
      txnType: TransactionTypeEnum.AB,
      subTxnType: SubTransactionTypeEnum.MANUAL_AB,
      requestDetails: request
    });
  }

  updateABDetailsNotification(successKey: string) {
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
          .subscribe((event: OverlayNotificationEventRef) => {});
      });
  }

  ngOnDestroy(): void {
    this.summaryBar.close();
    this.confirmedOrder = null;
    this.manualAbFacade.setOrderNumber(0, null);
    this.commonFacade.setABOrderNumber({
      orderNo: 0,
      status: null
    });
    this.overlayNotification.close();
    this.destroy$.next();
    this.creditnote = [];
    this.destroy$.complete();
    this.customerId = null;
    this.customer = null;

    this.commonFacade.clearTransactionConfig();
    this.customerFacade.clearSelectedCustomer();
    this.clearPage(true);
    this.printingService.resetPrint();
    this.toolbarFacade.setToolbarConfig({
      loadMetalPrices: false,
      loadHoldPopup: false,
      loadOpenOrdersPopup: false
    });

    this.discountFacade.clearTransactionLevelDiscountDetails();
    this.paymentFacade.resetDeletedPayment();
    this.commonFacade.setFileUploadVisible(false);
  }
}
