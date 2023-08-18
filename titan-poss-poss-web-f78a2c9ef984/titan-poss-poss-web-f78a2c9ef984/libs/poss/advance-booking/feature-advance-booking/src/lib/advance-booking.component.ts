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
import { ProductSearchAutocompleteComponent } from '@poss-web/shared/item-master/ui-product-search-autocomplete';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import {
  AdvanceBookingActionTypesEnum,
  AdvanceBookingDetailsResponse,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  CashMemoTaxDetails,
  CashMemoTypesEnum,
  CommomStateAttributeNameEnum,
  CommomStateAttributeTypeEnum,
  ConfigTypeEnum,
  CustomErrors,
  Customers,
  CustomerServiceAbstraction,
  CUSTOMER_TYPE_ENUM,
  DiscountsResponse,
  DiscountTypeEnum,
  EditedWeightData,
  FreezeRateEnum,
  InvoiceDeliveryTypes,
  LocationSettingAttributesEnum,
  Lov,
  MetalPrice,
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
  ProductDetailsInGrid,
  ProductPriceDetails,
  SearchProductList,
  SharedBodEodFeatureServiceAbstraction,
  StatusTypesEnum,
  SubTransactionTypeEnum,
  SummaryBarEventRef,
  SummaryBarEventType,
  SummaryBarServiceAbstraction,
  SummaryBarType,
  ToolbarConfig,
  TransactionTypeEnum,
  UpdateOrderDetails
} from '@poss-web/shared/models';
import {
  OrderConfirmationFacade,
  OrderService
} from '@poss-web/shared/order-confirmation/data-access-order-confirmation';
import { PaymentFacade } from '@poss-web/shared/payment/data-access-payment';
import { PrintingFacade } from '@poss-web/shared/printing/data-access-printing';
import { ToolbarFacade } from '@poss-web/shared/toolbar/data-access-toolbar';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { getAdvanceBookingNewUrl } from '@poss-web/shared/util-site-routes';
import * as moment from 'moment';
import { Moment } from 'moment';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, take, takeUntil, withLatestFrom } from 'rxjs/operators';

const selectRSO = 'Select RSO';
import { FileFacade } from '@poss-web/shared/file-upload/data-access-file-upload';
import { ValidateCustomerService } from '@poss-web/shared/customer/feature-customer-create';

@Component({
  selector: 'poss-web-advance-booking',
  templateUrl: './advance-booking.component.html',
  styleUrls: []
})
export class AdvanceBookingComponent implements OnInit, OnDestroy {
  customerId = null;
  customer: Customers = null;
  selectedOccasion = null;
  cashMemoId = null;
  isFocCheck = false;
  productType: string;
  rsoDetails = [selectRSO];
  enableFreeze = true;
  itemIdArray = [];
  itemIdsArray = [];
  totalProductsCount = 0;
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
  editedItem: ProductDetailsInGrid;
  editedWeightData: EditedWeightData;
  currencyCode: string;
  metalRate: any;
  tab: CashMemoTypesEnum;
  viewData: AdvanceBookingDetailsResponse;
  otherChargesList: any;
  standardPrice: any;
  rowNumber = -1;
  deleteFlag = false;
  taxValue = 0;
  cessTaxValue = 0;
  totalItemValue = 0;
  totalItemTax = 0;
  taxDetails: CashMemoTaxDetails;
  locationCode: string;
  status: StatusTypesEnum;
  priceDetails: ProductPriceDetails;

  currentAdvanceBookingDetailsResponse: AdvanceBookingDetailsResponse;
  isAddFlag = false;
  isLoadPriceFlag: boolean;
  isUpdateFlag: boolean;
  isLotNumberUpdate: boolean;
  isActualWeightUpdate: boolean;
  isBestGoldRateType: boolean;
  confirmedCashmemoDoc = 0;
  orderStatus = null;
  creditnote = [];
  isLoading$: Observable<boolean>;
  isLoadingOrder$: Observable<boolean>;
  occasionList$: Observable<Lov[]>;
  searchProductList$: Observable<SearchProductList[]>;
  isValid$: Observable<any>;
  paymentDetails: PaymentDetails[];
  product$: Subject<ProductDetailsInGrid> = new Subject<ProductDetailsInGrid>();
  searchEnable$: Subject<boolean> = new Subject<boolean>();
  occasionEnable$: Subject<boolean> = new Subject<boolean>();
  selectedOccasion$: Subject<string> = new Subject<string>();
  clearOccasion$: Subject<null> = new Subject<null>();
  occasionIcon$: Subject<string> = new Subject<string>();
  clearAllData$: Subject<null> = new Subject<null>();
  errorData$: Subject<boolean> = new Subject<boolean>();
  destroy$: Subject<null> = new Subject<null>();
  cashMemoTypesEnumRef = CashMemoTypesEnum;
  isWithoutCustomerFlag = false;
  businessDate: Moment;
  bgrAllowed = false;
  minABValue: number;
  MinABFrozenAmount: number;
  frozenAB: boolean;
  @Output() orderNumber = new EventEmitter<number>();
  @Output() clearProductGridData = new EventEmitter<null>();
  @ViewChild(ProductSearchAutocompleteComponent)
  private searchComponent: ProductSearchAutocompleteComponent;
  @ViewChild('confirmSuccessNotificationTemplate', { static: true })
  confirmSuccessNotificationTemplate: TemplateRef<any>;
  summaryBarRemarks$ = new Subject<string>();
  isLoggedIn: boolean;
  customerName = null;
  abHoldTimeInMinutes: number;
  PrintErrorText: string;
  customerId$: Subject<boolean> = new Subject<boolean>();
  maxAllowedAmount: number;
  alertMsgForPan: string;
  toolbarData: ToolbarConfig = {
    txnType: TransactionTypeEnum.AB,
    subTxnType: SubTransactionTypeEnum.NEW_AB,
    loadMetalPrices: true,
    loadHoldPopup: true,
    loadOpenOrdersPopup: true
  };
  creditNotePaymentToBeDeleted: PaymentDetails = null;
  karatExchangeOfferDiscountSelected = null;
  gepPurityDiscountSelected = null;
  confirmRemarks: any;
  isNarrationMandatory = false;
  reloadABFlag = false;
  customerPAN: any;
  ghsCustomerId: any;
  updateCustomerForGHS = false;
  reloadCustomerForGHS = false;
  isFocAdded = false;
  availableFocSchemes = 0;
  availableFocSchemesForProducts = false;
  availableFocSchemesForSelectedProducts = true;
  isCnRedeemed: boolean;
  updateGridData = false;
  refundAmountAsCash = 0;
  customerType: any;
  isNoCustomerDependentPayment = true;
  form60Submitted: boolean;
  enableCalculateRivaahGhsDiscount = false;
  calculateRivaahGhsDiscWarningMsg1: string;
  calculateRivaahGhsDiscWarningMsg2: string;
  isLastTransactionPrint = false;
  gstNumber: string;
  idProof: string;
  selectedFOCSchemesCount = 0;
  newlyGeneratedCn: any;
  hasErrorWhileUpdating = false;
  isProfileMatched = false;
  isPanCardMandatoryforAdvance: boolean;
  panMandatoryForAdvance: boolean;
  prodToBeCollectedByAction = false;
  isCustomerUpdate = false;
  isCNPrinting = false;
  printActions: any;
  showSuccessMessage = false;

  constructor(
    public customerFacade: CustomerFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private summaryBar: SummaryBarServiceAbstraction,
    private advanceBookingFacade: AdvanceBookingFacade,
    private translate: TranslateService,
    private paymentFacade: PaymentFacade,
    private toolbarFacade: ToolbarFacade,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authFacade: AuthFacade,
    private printingFacade: PrintingFacade,
    private commonFacade: CommonFacade,
    public printingService: PrintingServiceAbstraction,
    private bodEodFeatureService: SharedBodEodFeatureServiceAbstraction,
    private orderService: OrderService,
    private orderConfirmationFacade: OrderConfirmationFacade,
    private locationSettingsFacade: LocationSettingsFacade,
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
      transacionId: this.cashMemoId,
      transacionType: printTransactionTypesEnum.SALES,
      printFileType: printFileTypeEnum.INVOICE_PRINT,
      doctype: printDocTypeEnum.CUSTOMER_PRINT,
      reprint: false,
      invoiceType: action,
      customerId: this.customerId
    });
    if (this.creditnote.length == 0) {
      this.showSuccessMessage = true;
    }else{
      this.isCNPrinting = true;
    }
  }

  printCN(action) {
    this.printingService.loadPrintData({
      printType: printTypesEnum.CREDIT_NOTE,
      transacionId: this.cashMemoId,
      transacionType: printTransactionTypesEnum.SALES,
      printFileType: printFileTypeEnum.INVOICE_PRINT,
      doctype: printDocTypeEnum.CUSTOMER_PRINT,
      reprint: false,
      invoiceType: action,
      customerId: this.customerId
    });
  }

  printLastTransaction() {
    this.printingFacade.loadLastTransactionId({
      searchValue: '',
      status: StatusTypesEnum.CONFIRMED,
      txnType: TransactionTypeEnum.AB,
      subTxnType: SubTransactionTypeEnum.NEW_AB,
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
                  reprint: false,
                  lastTransactionPrint: true,
                  invoiceType: action,
                  customerId: this.customerId
                });
              }
            });
        }
      });
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

  ngOnInit() {
    this.clearPage(true);
    this.showSummaryBar();
    this.componentInit();
    this.getCustomerResponse();
    this.getCashMemoReponse();
    this.commonFacade.setFileUploadVisible(true);

    this.authFacade
      .isUserLoggedIn()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoggedIn: boolean) => {
        this.isLoggedIn = isLoggedIn;
      });
    this.bodEodFeatureService
      .getBusinessDayDate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(businessDate => {
        this.businessDate = moment(businessDate);
      });

    this.commonFacade.loadABTolerance({
      ruleType: 'ORDER_AB_BGR_CONFIG',
      ruleRequestList: {
        locationCode: this.locationCode
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
        if (this.activatedRoute.snapshot.params['_id'] !== 'new') {
          this.clearPage(false);
          this.isLoadPriceFlag = true;

          this.advanceBookingFacade.viewCashMemo({
            id: this.activatedRoute.snapshot.params['_id'],
            txnType: TransactionTypeEnum.AB,
            subTxnType: SubTransactionTypeEnum.NEW_AB
          });
        }
      });

    if (this.activatedRoute.snapshot.params['_id'] !== 'new') {
      this.clearPage(false);
      this.isLoadPriceFlag = true;

      this.advanceBookingFacade.viewCashMemo({
        id: this.activatedRoute.snapshot.params['_id'],
        txnType: TransactionTypeEnum.AB,
        subTxnType: SubTransactionTypeEnum.NEW_AB
      });
    }
    this.productFacade
      .getCreateOrder()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.advanceBookingFacade.createCashMemo({
            txnType: TransactionTypeEnum.AB,
            subTxnType: SubTransactionTypeEnum.NEW_AB
          });
          this.isWithoutCustomerFlag = true;
          this.productFacade.setCreateOrder(false);
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
            brandDetail?.panCardDetails?.data?.configurationAmountForAdvance;
          this.isPanCardMandatoryforAdvance =
            brandDetail?.panCardDetails?.data?.isPanCardMandatoryforAdvance;
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

    this.discountFacade
      .getIsSelectedTransactionLevelDiscountDeleted()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isDiscountDeleted => {
        if (isDiscountDeleted) {
          if (this.creditNotePaymentToBeDeleted) {
            this.paymentFacade.deletePayment({
              paymentId: this.creditNotePaymentToBeDeleted.id,
              transactionType: TransactionTypeEnum.AB,
              subTransactionType: SubTransactionTypeEnum.NEW_AB
            });
            this.creditNotePaymentToBeDeleted = null;
          }
          this.reloadAB();
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
            ? this.confirmAdvanceBooking(this.confirmRemarks)
            : this.discountsRemoveAlert(discountStatus);
        }
      });

    this.advanceBookingFacade
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

    this.productFacade.setGridSearchEnable(true);
  }

  showSummaryBar() {
    this.summaryBar
      .open(SummaryBarType.AB_NEW, {
        remarks: this.summaryBarRemarks$.asObservable()
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: SummaryBarEventRef) => {
        this.isLastTransactionPrint = false;
        switch (event.eventType) {
          case SummaryBarEventType.CLAER: {
            this.clearPage(true);
            this.router.navigate([getAdvanceBookingNewUrl()]);
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
                  this.isPanCardMandatoryforAdvance &&
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
                  this.advanceBookingFacade.ValidateMetalRate({
                    id: this.cashMemoId,
                    status: StatusTypesEnum.CONFIRMED,
                    txnType: TransactionTypeEnum.AB,
                    subTxnType: SubTransactionTypeEnum.NEW_AB,
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
          case SummaryBarEventType.HOLD: {
            if (this.customerId === null) {
              const customerErr = 'pw.regularCashMemo.selectCustomerMsg';
              this.errorNotifications(customerErr);
            } else {
              let isFormValidated = this.validateCustomerService.validateCustomer(
                this.customer
              );
              if (isFormValidated) {
                if (this.totalQty === 0) {
                  const addItemMessage =
                    'pw.advanceBooking.addItemToGridMessage';
                  this.errorNotifications(addItemMessage);
                } else {
                  this.advanceBookingFacade.updateCashMemo({
                    id: this.cashMemoId,
                    status: StatusTypesEnum.HOLD,

                    requestDetails: {
                      customerId: this.customerId,
                      metalRateList: this.metalRate,
                      finalValue: this.finalAmt,
                      occasion: this.selectedOccasion,
                      otherChargesList: null,
                      paidValue: this.paidValue,
                      remarks: event.remarks ? event.remarks : null,
                      totalDiscount: this.currencyRoundOff(this.totalDisc),
                      totalQuantity: this.totalQty,
                      totalTax: this.totalTax,

                      totalWeight: this.totalWeight,
                      totalValue: this.totalAmt,
                      hallmarkCharges: this.currencyRoundOff(
                        this.hallmarkCharges
                      ),
                      hallmarkDiscount: this.currencyRoundOff(
                        this.hallmarkDiscount
                      )
                    },
                    txnType: TransactionTypeEnum.AB,
                    subTxnType: SubTransactionTypeEnum.NEW_AB
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
            if (this.cashMemoId) {
              this.advanceBookingFacade.deleteCashMemo({
                id: this.cashMemoId,
                txnType: TransactionTypeEnum.AB,
                subTxnType: SubTransactionTypeEnum.NEW_AB
              });
            } else
              this.showSimpleNotifications('pw.regularCashMemo.deleteOrderMsg');
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
      !this.isBestGoldRateType &&
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
              this.cashMemoId,
              TransactionTypeEnum.AB,
              SubTransactionTypeEnum.NEW_AB,
              null
            );
          }
        });
    } else {
      this.orderService.ConfirmAllBillLevelDiscounsts(
        this.cashMemoId,
        TransactionTypeEnum.AB,
        SubTransactionTypeEnum.NEW_AB,
        null
      );
    }
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

  componentInit() {
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.ADVANCE_BOOKING,
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
    this.locationSettingsFacade
      .getLocationSetting(LocationSettingAttributesEnum.AB_HOLD_TIME)
      .subscribe(configDetails => {
        if (configDetails && configDetails !== null) {
          this.abHoldTimeInMinutes = Number(configDetails);

          this.commonFacade.setConfigHoldTime(this.abHoldTimeInMinutes);
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
    this.authFacade
      .getLocationCode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.locationCode = data;
      });
    this.toolbarFacade.setToolbarConfig(this.toolbarData);

    this.commonFacade.loadABStandardMetalPriceDetails();
    this.isLoading$ = this.advanceBookingFacade.getIsLoading();
    this.isLoadingOrder$ = this.orderConfirmationFacade.getIsLoading();

    this.commonFacade.setTransactionConfig({
      isPaymentEditable: true,
      transactionType: {
        type: TransactionTypeEnum.AB,
        subType: SubTransactionTypeEnum.NEW_AB
      },
      taxTransactionType: TransactionTypeEnum.CUST_TRANSACTION_AB
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
      .getHasCustomerSpecificPayments()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAdded => {
        this.isNoCustomerDependentPayment = !isAdded;
      });

    this.advanceBookingFacade
      .getMinABValue()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: number) => {
        this.commonFacade.setABMinABVAlue(data);
      });

    this.advanceBookingFacade
      .getMinFrozenABAmount()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: number) => {
        this.commonFacade.setminFrozenABVAlue(data);
      });

    this.advanceBookingFacade
      .getFrozenABValue()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: boolean) => {
        this.commonFacade.setFrozenABVAlue(data);
      });

    this.advanceBookingFacade
      .getBestGoldRate()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: boolean) => {
        this.isBestGoldRateType = data;
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
          this.advanceBookingFacade.partialUpdateCashMemo({
            id: this.cashMemoId,
            requestDetails: {
              customerId: ghsCustomerId
            },
            txnType: TransactionTypeEnum.AB,
            subTxnType: SubTransactionTypeEnum.NEW_AB
          });
        }
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
          this.currentAdvanceBookingDetailsResponse = {
            ...this.currentAdvanceBookingDetailsResponse,
            orderWeightDetails: data
          };
        }
      });

    this.advanceBookingFacade
      .getHasError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.paymentFacade
      .getTotalPaidAmount()
      .pipe(takeUntil(this.destroy$))
      .subscribe(totalValue => {
        if (totalValue) {
          this.paidValue = this.currencyRoundOff(totalValue);
        } else {
          this.paidValue = 0;
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

    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.BASECURRENCY_CURRENCY_CODE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(currencyCode => {
        this.currencyCode = currencyCode;
      });

    this.paymentFacade
      .getPaymentDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((payments: PaymentDetails[]) => {
        this.paymentDetails = payments;
        this.isCnRedeemed = false;
        this.isCnRedeemed = payments.some(
          x => x.otherDetails?.data?.isRateProtectedCN
        );
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

    this.advanceBookingFacade
      .getRSODetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((rsoDetails: string[]) => {
        if (rsoDetails.length !== 0) {
          this.rsoDetails = [selectRSO];
          rsoDetails.forEach(element => this.rsoDetails.push(element));
        }
      });

    this.toolbarFacade
      .getMetalPriceDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: MetalPrice[]) => {
        if (data.length !== 0 && this.cashMemoId !== null) {
          this.updatePrice();
          this.updateGridData = true;
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
        CommomStateAttributeNameEnum.TOTAL_WEIGHT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(weight => {
        this.totalWeight = Number(this.weightFormatterService.format(weight));
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.ADVANCE_BOOKING,
        CommomStateAttributeNameEnum.TOTAL_DISCOUNT
      )
      .subscribe(disc => {
        this.totalDisc = disc;
      });
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.ADVANCE_BOOKING,
        CommomStateAttributeNameEnum.TOTAL_AMT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(amt => {
        this.totalAmt = this.currencyRoundOff(amt);
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
        CommomStateAttributeNameEnum.TAX_AMT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(tax => {
        this.totalTax = this.currencyRoundOff(tax);
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

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.ADVANCE_BOOKING,
        CommomStateAttributeNameEnum.PRODUCT_AMT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(amt => {
        this.productAmt = this.currencyRoundOff(amt);
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.ADVANCE_BOOKING,
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
        console.log(isPrintingSuccess);
        if (isPrintingSuccess) {
          if (this.printActions) {
            if (this.isCNPrinting && this.creditnote.length > 0) {
              this.printCN(this.printActions);
              this.isCNPrinting = false;
            }else{
              this.showSuccessMessage = true;
            }
            if (this.showSuccessMessage) {
              this.showAlertPopUp('pw.regularCashMemo.printingSuccessMessage');
              this.showSuccessMessage = false;
            }
          }
        }
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
              selectedFOCSchemesCount > 0) &&
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

    this.paymentFacade
      .getIsGRFCNAdded()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isGRFCNAdded: boolean) => {
        if (isGRFCNAdded) {
          this.updatePrice();
          this.updateGridData = true;
          this.paymentFacade.resetIsGRFCNAdded();
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
            (discountDetails.discountType ===
              DiscountTypeEnum.DIGI_GOLD_DISCOUNT &&
              discountDetails.referenceId.toUpperCase() ===
                paymentDetails?.id.toUpperCase())
          ) {
            this.reloadAB();
          }

          if (
            paymentDetails?.paymentCode === PaymentModeEnum.CREDIT_NOTE &&
            paymentDetails?.otherDetails?.data?.isRateProtectedCN
          ) {
            this.updatePrice();
            this.updateGridData = true;
          }
        }
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
      });
  }

  confirmAdvanceBooking(event) {
    const orderDetails: UpdateOrderDetails = {
      cashMemoId: this.cashMemoId,
      orderDetails: {
        customerId: this.customerId,
        metalRateList: this.metalRate,
        finalValue: this.finalAmt,
        otherCharges: null,
        paidValue: this.paidValue,
        remarks: event.remarks ? event.remarks : null,
        totalDiscount: this.currencyRoundOff(this.totalDisc),
        totalQuantity: this.totalQty,

        totalTax: this.totalTax,

        totalWeight: this.totalWeight,
        totalValue: this.totalAmt,

        minValue: this.minABValue,
        hallmarkCharges: this.currencyRoundOff(this.hallmarkCharges),
        hallmarkDiscount: this.currencyRoundOff(this.hallmarkDiscount)
      },
      status: StatusTypesEnum.CONFIRMED,
      transactionType: TransactionTypeEnum.AB,
      subTransactionType: SubTransactionTypeEnum.NEW_AB
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

  getCashMemoReponse() {
    this.advanceBookingFacade
      .getCreateCashMemoResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: AdvanceBookingDetailsResponse) => {
        if (data) {
          this.currentAdvanceBookingDetailsResponse = data;
          this.cashMemoId = data.id;
          this.commonFacade.setFileUploadVisible(true);
          this.advanceBookingFacade.setOrderNumber(data.docNo, data.status);
          this.commonFacade.setABOrderNumber({
            orderNo: data.docNo,
            status: data.status
          });

          this.productFacade.setGridSearchEnable(true);
          this.status = StatusTypesEnum.OPEN;

          this.commonFacade.setTransactionTD(data.id);
          if (!this.isWithoutCustomerFlag) {
            this.advanceBookingFacade.partialUpdateCashMemo({
              id: this.cashMemoId,
              requestDetails: {
                customerId: this.customerId
              },
              txnType: TransactionTypeEnum.AB,
              subTxnType: SubTransactionTypeEnum.NEW_AB
            });
          }
        }
      });

    this.advanceBookingFacade
      .getViewCashMemoResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: AdvanceBookingDetailsResponse) => {
        this.viewData = data;
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
              this.updateCustomerForGHS = true;
              if (
                data.status === StatusTypesEnum.HOLD ||
                data.status === StatusTypesEnum.OPEN
              ) {
                this.customerFacade.loadSelectedCustomer(
                  String(data.customerId),
                  false,
                  true,
                  true,
                  true
                );
              }
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
            this.currentAdvanceBookingDetailsResponse = data;
            this.productFacade.setStandardPrice(
              data?.metalRateList?.metalRates
            );
            if (!data.updateWeight) {
              this.cashMemoId = data.id;

              this.commonFacade.setTransactionTD(data.id);
              this.advanceBookingFacade.setOrderNumber(data.docNo, data.status);
              this.commonFacade.setABOrderNumber({
                orderNo: data.docNo,
                status: data.status
              });
              this.productFacade.setGridSearchEnable(true);

              if (data.status === StatusTypesEnum.HOLD) {
                this.summaryBarRemarks$.next(data.remarks);
                if (data.customerId) {
                  this.customerFacade.loadSelectedCustomer(
                    String(data.customerId),
                    false
                  );
                }

                if (
                  this.isLoadPriceFlag &&
                  this.expireTime(data.lastHoldTime) === 'Expired'
                ) {
                  this.isLoadPriceFlag = false;
                  const goldRateChangeMsg =
                    'Hold time expired. Advance Booking will be updated with latest price';
                  this.errorNotifications(goldRateChangeMsg);

                  this.updatePrice();
                } else {
                  this.isLoadPriceFlag = false;
                  this.loadItemsInCashMemo(data);
                }
              } else if (data.status === StatusTypesEnum.OPEN) {
                if (this.isLoadPriceFlag) {
                  this.isLoadPriceFlag = false;
                  this.updatePrice();
                  if (data.customerId) {
                    this.customerFacade.loadSelectedCustomer(
                      String(data.customerId)
                    );
                  }
                } else {
                  this.loadItemsInCashMemo(data);
                }
              }
            }
          }
        }
      });

    this.advanceBookingFacade
      .getFreezeRateResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: AdvanceBookingDetailsResponse) => {
        if (data) {
          this.viewData = data;
          this.currentAdvanceBookingDetailsResponse = data;
          this.reloadAB();
        }
      });

    this.orderConfirmationFacade
      .confirmCashMemoResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: AdvanceBookingDetailsResponse) => {
        if (data && data.status === StatusTypesEnum.CONFIRMED) {
          this.confirmedCashmemoDoc = data.docNo;
          this.orderStatus = StatusTypesEnum.CONFIRMED;
          this.creditnote = data.creditNotes;
          this.reloadOpenAndHoldValues();
          this.showSuccessMessageNotification();
        }
      });
    this.advanceBookingFacade
      .getUpdateCashMemoResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: AdvanceBookingDetailsResponse) => {
        if (data) {
          const successKey1 = 'pw.advanceBooking.updateCMSuccessMessage1';
          this.updateCashMemoNotification(successKey1, data.docNo);
          this.loadHoldValues();
        }
      });

    this.advanceBookingFacade
      .getPartailUpdateCashMemoResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: AdvanceBookingDetailsResponse) => {
        if (data) {
          this.viewData = data;
          this.currentAdvanceBookingDetailsResponse = data;
          if (data.hasError) {
            if (data.customerId) {
              this.hasErrorWhileUpdating = true;
              this.customerFacade.loadSelectedCustomer(
                String(data.customerId),
                true,
                true,
                true,
                true
              );
            }
          } else {
            if (this.isCustomerUpdate) {
              this.productFacade.setItemIDList({ item: data, isUpdate: true });
              if (this.customerId && this.isCustomerUpdate) {
                this.customerFacade.loadSelectedCustomerDetail(
                  String(this.customerId),
                  false
                );
              }
            }
            this.isCustomerUpdate = false;
          }
          if (this.prodToBeCollectedByAction) {
            const successKey =
              'pw.advanceBooking.updateABDetailsSuccessMessage';
            this.updateABDetailsNotification(successKey);
            this.prodToBeCollectedByAction = false;
          }
        }
      });

    this.advanceBookingFacade
      .getDeleteCashMemoResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: boolean) => {
        if (data !== false) {
          const successKey = 'pw.advanceBooking.deleteCMSuccessMessage';
          this.deleteCashMemoNotification(successKey);
          this.reloadOpenAndHoldValues();
        }
      });
  }

  getCustomerResponse() {
    this.customerFacade
      .getSelectSelectedCustomer()
      .pipe(takeUntil(this.destroy$))
      .subscribe(customer => {
        if (customer) {
          const tempCustomerId = this.customerId;
          this.customerId = customer.customerId;
          this.customer = customer;
          this.customerName = customer.customerName;
          this.customerPAN = customer.custTaxNo;
          this.customerType = customer.customerType;
          this.gstNumber = customer.instiTaxNo;
          this.idProof = customer.customerDetails.data.idProof;
          this.form60Submitted =
            customer.customerDetails.data.form60AndIdProofSubmitted;
          if (customer.customerId !== null) {
            this.customerFacade.loadSelectedCustomerDetail(
              String(customer.customerId),
              customer?.isCalledFromCustomer
            );
            if (this.cashMemoId === null) {
              this.advanceBookingFacade.createCashMemo({
                txnType: TransactionTypeEnum.AB,
                subTxnType: SubTransactionTypeEnum.NEW_AB
              });
            } else {
              if (
                this.status === StatusTypesEnum.OPEN &&
                tempCustomerId !== this.customerId &&
                !this.updateCustomerForGHS &&
                !this.hasErrorWhileUpdating
              ) {
                this.isCustomerUpdate = true;
                this.advanceBookingFacade.partialUpdateCashMemo({
                  id: this.cashMemoId,
                  requestDetails: {
                    customerId: this.customerId
                  },
                  txnType: TransactionTypeEnum.AB,
                  subTxnType: SubTransactionTypeEnum.NEW_AB,
                  oldData: this.viewData
                });
              } else {
                if (this.updateCustomerForGHS)
                  this.updateCustomerForGHS = false;
                if (this.hasErrorWhileUpdating) {
                  this.hasErrorWhileUpdating = false;
                }
              }
            }
          }
          this.reloadOpenAndHoldValues();
        } else {
          if (!this.hasErrorWhileUpdating) {
            this.customerId = null;
          }
          this.customer = null;
          this.customerPAN = null;
          this.customerId$.next(false);
          this.clearOccasion$.next();
          this.customerType = null;
          this.gstNumber = null;
          this.idProof = null;
        }
      });
  }

  /**
   * to display error message
   * @param error : error from api
   */
  errorHandler(error: CustomErrors) {
    if (error.code === ErrorEnums.ERR_SALE_045) {
      const key = 'pw.regularCashMemo.holdExpiredMsg';
      this.expireNotifications(key);
    } else if (error.code === ErrorEnums.ERR_SALE_008) {
      const key = 'pw.advanceBooking.metalRateChangedMsg';
      this.expireNotifications(key);
      this.toolbarFacade.loadMetalPriceDetails();
    } else if (error.code === ErrorEnums.ERR_SALE_089) {
      const key = 'pw.regularCashMemo.itemPresentMsg';
      this.errorNotifications(key);
    } else if (error.code === ErrorEnums.ERR_QZ_TRAY) {
      this.printError(error.message);
      /* } else if (error.code === ErrorEnums.ERR_SALE_008) {
      /**
       * // TODO: To be removed after SSE implementation
       * Server side events
       */
      // this.toolbarFacade.loadMetalPriceDetails();
    } else if (error.code === ErrorEnums.ERR_SALE_084) {
      this.toolbarFacade.loadMetalPriceDetails();
      this.openConfirmDialogForPayment(error.dynamicValues?.paymentCodes);
      this.commonFacade.setCMErrorInUpdatePrice(true);
      this.productFacade.resetItemIdList();
      this.productFacade.setItemIDList({
        item: this.currentAdvanceBookingDetailsResponse,
        isUpdate: false
      });
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
        .subscribe(() => {
          if (this.orderStatus === StatusTypesEnum.CONFIRMED) {
            this.showSuccessMessageNotification();
          }
        });
    }
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

  clearSearchField() {
    this.errorData$.next(false);
    this.searchComponent.clearSearch(null);
  }

  updateSelectedLotNumber(event) {
    this.editedItem = event.data;
    this.isUpdateFlag = true;
    this.isLotNumberUpdate = true;
    this.rowNumber = event.rowIndex;
    this.advanceBookingFacade.resetLotNumberValues();
    this.advanceBookingFacade.loadLotNumber(event.data.selectedLotNumber);
    const index = this.itemIdArray.indexOf(event.oldValue);
    this.itemIdArray.splice(index, 1);
    this.itemIdsArray.splice(index, 1);
  }

  updateActualWeight(event) {
    this.editedItem = event.item;
    this.editedWeightData = event.data;
    this.isUpdateFlag = true;
    this.isActualWeightUpdate = true;
    this.rowNumber = event.rowIndex;
    this.advanceBookingFacade.resetLotNumberValues();
    this.advanceBookingFacade.loadLotNumber(event.item.selectedLotNumber);
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

    docNo: number
  ) {
    this.translate
      .get([successKey1])
      .pipe(take(1))
      .subscribe((translatedMessages: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessages[successKey1] + docNo,

            hasClose: true,
            hasBackdrop: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe((event: OverlayNotificationEventRef) => {
            if (event.eventType === OverlayNotificationEventType.CLOSE) {
              this.clearPage(true);
              this.router.navigate([getAdvanceBookingNewUrl()]);
              this.clearSearchField();
            }
          });
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

  clearPage(clearTransactionID: boolean) {
    if (clearTransactionID) {
      this.commonFacade.clearTransactionTD();
      this.productFacade.clearProductGrid();
      this.productFacade.setGridSearchEnable(true);
      this.focFacade.clearABFocSchemes();
      this.focFacade.clearABFocSchemesCount();
      this.focFacade.clearFocSchemesForItems();
      this.toolbarFacade.loadMetalPriceDetails();
    }
    this.discountFacade.clearTransactionLevelDiscountDetails();
    this.reloadOpenAndHoldValues();
    this.orderConfirmationFacade.resetValues();
    this.clearOccasion$.next();
    this.creditnote = [];
    this.confirmedCashmemoDoc = 0;
    this.commonFacade.clearAdvanceBooking();
    this.productFacade.resetValues();
    this.advanceBookingFacade.resetValues();
    this.customerId = null;
    this.customer = null;
    this.isWithoutCustomerFlag = false;
    this.isProfileMatched = false;
    this.orderStatus = null;
    this.clearAllData$.next();
    this.isUpdateFlag = false;
    this.cashMemoId = null;
    this.customerFacade.clearCustomerSearch();
    this.customerFacade.clearSelectedCustomer();

    this.errorData$.next(false);
    this.overlayNotification.close();

    this.deleteFlag = false;

    this.currentAdvanceBookingDetailsResponse = null;

    this.commonFacade.setABMinABVAlue(0);
    this.summaryBarRemarks$.next('');
    this.reloadABFlag = false;
    this.updateCustomerForGHS = false;
    this.reloadCustomerForGHS = false;
    this.updateGridData = false;
    this.fileFacade.clearResponse();
    this.fileFacade.clearFileList(true);
    this.discountFacade.clearOrderDiscDetails();
    this.commonFacade.clearTcsAmount();
    this.commonFacade.setABOrderNumber({
      orderNo: 0,
      status: null
    });
    this.hasErrorWhileUpdating = false;
    this.commonFacade.clearTolerance();
    this.commonFacade.clearABGrfTolerance();
    this.commonFacade.clearABGrnTolerance();
    this.prodToBeCollectedByAction = false;
  }

  validateProduct(inventoryId: string): boolean {
    if (
      this.itemIdsArray.filter(c => c.inventoryId === inventoryId).length === 1
    ) {
      return false;
    } else {
      return true;
    }
  }

  updatePrice() {
    this.advanceBookingFacade.updatePriceDetails({
      id: this.cashMemoId,
      txnType: TransactionTypeEnum.AB,
      subTxnType: SubTransactionTypeEnum.NEW_AB
    });
  }

  loadOpenValues() {
    this.toolbarFacade.loadOpenOrdersCount({
      status: StatusTypesEnum.OPEN,
      txnType: TransactionTypeEnum.AB,
      subTxnType: SubTransactionTypeEnum.NEW_AB
    });
    this.toolbarFacade.loadOpenOrders({
      searchValue: '',
      status: StatusTypesEnum.OPEN,
      txnType: TransactionTypeEnum.AB,
      subTxnType: SubTransactionTypeEnum.NEW_AB,
      pageIndex: 0,
      pageSize: 10
    });
  }

  loadHoldValues() {
    this.toolbarFacade.loadOnHoldCount({
      status: StatusTypesEnum.HOLD,
      txnType: TransactionTypeEnum.AB,
      subTxnType: SubTransactionTypeEnum.NEW_AB
    });
    this.toolbarFacade.loadOnHold({
      searchValue: '',
      status: StatusTypesEnum.HOLD,
      txnType: TransactionTypeEnum.AB,
      subTxnType: SubTransactionTypeEnum.NEW_AB,
      pageIndex: 0,
      pageSize: 10
    });
  }

  loadItemsInCashMemo(data) {
    this.status = data.status;
    if (!this.updateGridData) this.productFacade.resetItemIdList();
    this.productFacade.setItemIDList({
      item: data,
      isUpdate: this.updateGridData
    });
    this.updateGridData = false;
  }

  freezeRate(type) {
    this.advanceBookingFacade.freezeAdvanceBooking({
      id: this.cashMemoId,
      requestDetails: {
        customerId: this.customerId,
        isFrozenRate: type === FreezeRateEnum.YES ? true : false,
        isBestRate: false
      },
      txnType: TransactionTypeEnum.AB,
      subTxnType: SubTransactionTypeEnum.NEW_AB
    });
  }

  bestRate(type: boolean) {
    this.advanceBookingFacade.freezeAdvanceBooking({
      id: this.cashMemoId,
      requestDetails: {
        customerId: this.customerId,
        isFrozenRate: false,
        isBestRate: type
      },
      txnType: TransactionTypeEnum.AB,
      subTxnType: SubTransactionTypeEnum.NEW_AB
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
      .subscribe(() => {
        this.clearPage(true);

        this.router.navigate([getAdvanceBookingNewUrl()]);
        this.clearSearchField();
      });
  }

  expireTime(time) {
    const momentTime = moment(time);
    const currentTime = moment();
    const leftOverMinutes = moment().diff(moment(momentTime), 'minutes');

    if (leftOverMinutes <= this.abHoldTimeInMinutes) {
      return currentTime
        .add(this.abHoldTimeInMinutes - leftOverMinutes, 'minutes')
        .format('hh:mm A');
    } else {
      return 'Expired';
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
                  // this.updatePrice();
                  // this.updateGridData = true;
                } else {
                  this.openConfirmDialogForPayment([]);
                  this.commonFacade.setCMErrorInUpdatePrice(true);
                }
              }
            }
          });
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
  ngOnDestroy(): void {
    this.commonFacade.setABMinABVAlue(0);
    this.commonFacade.setFrozenABVAlue(false);
    this.commonFacade.setminFrozenABVAlue(0);

    this.advanceBookingFacade.setOrderNumber(0, null);
    this.commonFacade.setABOrderNumber({
      orderNo: 0,
      status: null
    });
    this.orderConfirmationFacade.resetValues();
    this.summaryBar.close();
    this.overlayNotification.close();
    this.destroy$.next();
    this.orderStatus = null;
    this.destroy$.complete();
    this.advanceBookingFacade.resetValues();
    this.customerFacade.clearSelectedCustomer();
    this.customerFacade.clearCustomerSearch();

    this.commonFacade.clearTransactionConfig();
    this.commonFacade.clearTolerance();
    this.commonFacade.clearABGrfTolerance();
    this.commonFacade.clearABGrnTolerance();
    this.discountFacade.clearTransactionLevelDiscountDetails();

    this.toolbarFacade.setToolbarConfig({
      loadMetalPrices: true,
      loadHoldPopup: false,
      loadOpenOrdersPopup: false
    });
    this.printingService.resetPrint();
    this.paymentFacade.resetDeletedPayment();
    this.commonFacade.setFileUploadVisible(false);
  }

  reloadAB() {
    if (this.cashMemoId) {
      const tempId = this.cashMemoId;

      this.reloadABFlag = true;
      this.commonFacade.clearTransactionTD();
      this.advanceBookingFacade.viewCashMemo({
        id: tempId,
        txnType: TransactionTypeEnum.AB,
        subTxnType: SubTransactionTypeEnum.NEW_AB
      });
      this.commonFacade.setTransactionTD(tempId);
    }
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
              this.router.navigate([getAdvanceBookingNewUrl()]);
            }
          });
      });
  }

  showPanFormVerifyPopup() {
    this.panFormVerifyPopupService
      .open({
        type: AlertPopupTypeEnum.INFO,
        id: this.cashMemoId,
        customerId: this.customerId,
        customerType: this.customerType,
        txnType: TransactionTypeEnum.AB
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((dailogResponse: boolean) => {
        this.isProfileMatched = dailogResponse;
      });
  }

  reloadOpenAndHoldValues() {
    this.loadOpenValues();
    this.loadHoldValues();
  }

  prodToBeCollectedBy(event) {
    const request = {
      collectedBy: event
    };
    this.prodToBeCollectedByAction = true;
    this.advanceBookingFacade.partialUpdateCashMemo({
      id: this.cashMemoId,
      txnType: TransactionTypeEnum.AB,
      subTxnType: SubTransactionTypeEnum.NEW_AB,
      requestDetails: request
    });
  }
}
