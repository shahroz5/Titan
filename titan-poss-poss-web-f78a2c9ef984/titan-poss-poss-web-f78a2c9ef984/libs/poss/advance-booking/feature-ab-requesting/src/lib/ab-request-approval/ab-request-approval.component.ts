import {
  Component,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Event, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AdvanceBookingFacade } from '@poss-web/poss/advance-booking/data-access-advance-booking';
import { ProductFacade } from '@poss-web/poss/shared/product/data-access-product';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import {
  CurrencyFormatterService,
  WeightFormatterService
} from '@poss-web/shared/components/ui-formatters';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import {
  AdvanceBookingActionTypesEnum,
  AdvanceBookingDetailsResponse,
  CashMemoItemDetailsResponse,
  CashMemoTypesEnum,
  CommomStateAttributeNameEnum,
  CommomStateAttributeTypeEnum,
  CustomErrors,
  FreezeRateEnum,
  InvoiceDeliveryTypes,
  LocationSettingAttributesEnum,
  OverlayNotificationEventRef,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  PaymentDetails,
  printDocTypeEnum,
  printFileTypeEnum,
  PrintingServiceAbstraction,
  printTransactionTypesEnum,
  printTypesEnum,
  RsoDetailsPayload,
  SetTotalProductValuesPayload,
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
import { ToolbarFacade } from '@poss-web/shared/toolbar/data-access-toolbar';
import { POSS_WEB_COIN_PRODUCT_GROUP_CODE } from '@poss-web/shared/util-config';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { getAdvanceBookingSearchUrl } from '@poss-web/shared/util-site-routes';
import * as moment from 'moment';
import { Moment } from 'moment';
import { Observable, of, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

const selectRSO = 'Select RSO';
const RSOCode = 'RSO';

@Component({
  selector: 'poss-web-ab-request-approval',
  templateUrl: './ab-request-approval.component.html'
})
export class AbRequestApprovalComponent implements OnInit, OnDestroy {
  customerId = null;
  isForm: boolean;
  isABApproval = false;
  selectedOccasion = null;
  cashMemoId = null;
  isFocCheck = false;
  productType: string;
  rsoDetails = [selectRSO];

  currencyCode: string;

  locationCode: string;
  status: StatusTypesEnum;
  PrintErrorText: string;
  currentAdvanceBookingDetailsResponse: AdvanceBookingDetailsResponse;
  abDetailPayload: any;
  isLoading$: Observable<boolean>;
  isLoadPriceFlag: boolean;
  productDetails$: Observable<any>;
  clearPage = null;
  totalQty = 0;
  totalAmt = 0;
  totalDisc = 0;
  totalWeight = 0;
  finalAmt = 0;
  roundOff = 0;
  creditnote = [];
  totalTax = 0;
  productAmt = 0;
  paidValue = 0;
  productQty = 0;
  productWeight = 0;
  productDisc = 0;
  coinQty = 0;
  coinWeight = 0;
  coinDisc = 0;
  coinAmt = 0;
  taxValue = 0;
  totalValue = 0;
  finalValue = 0;
  hallmarkCharges = 0;
  hallmarkDiscount = 0;
  destroy$: Subject<null> = new Subject<null>();
  cashMemoTypesEnumRef = CashMemoTypesEnum;
  minABValue: number;
  MinABFrozenAmount: number;
  @Output() orderNumber = new EventEmitter<number>();

  @ViewChild('confirmSuccessNotificationTemplate', { static: true })
  confirmSuccessNotificationTemplate: TemplateRef<any>;
  @ViewChild('freezeSuccessNotificationTemplate', { static: true })
  freezeSuccessNotificationTemplate: TemplateRef<any>;
  @ViewChild('AddPaymentSuccessNotificationTemplate', { static: true })
  AddPaymentSuccessNotificationTemplate: TemplateRef<any>;

  confirmedTime: any;
  rso: any;
  type: any;
  actionType: string;
  isLoadingOrder$: Observable<boolean>;
  metalRate: any;
  resDocNo: number;
  successMsg: string;
  isPaymentAllowed = false;
  orderNo = 0;
  cancellationAllowedForAB: any;
  paymentDetails: PaymentDetails[];
  businessDate: Moment;
  selectedItemsDetails: CashMemoItemDetailsResponse[] = [];

  subTxnType = SubTransactionTypeEnum.NEW_AB;
  isNonFrozenRequestApprovals = false;
  toolbarData: ToolbarConfig = {
    txnType: TransactionTypeEnum.AB,
    subTxnType: this.subTxnType,
    loadMetalPrices: true,
    loadHoldPopup: false,
    loadOpenOrdersPopup: false
  };

  summaryBarRemarks$ = new Subject<string>();
  pgDesc$: Observable<{}>;
  imageUrlData$: Subject<any> = new Subject<any>();
  rsoDetails$: Observable<RsoDetailsPayload[]>;
  isCommonLoading$: Observable<boolean>;

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
    private commonFacade: CommonFacade,
    private orderService: OrderService,
    public printingService: PrintingServiceAbstraction,
    private orderConfirmationFacade: OrderConfirmationFacade,
    private locationSettingsFacade: LocationSettingsFacade,
    private productFacade: ProductFacade,
    private weightFormatterService: WeightFormatterService,
    private currencyFormatterService: CurrencyFormatterService,
    private bodEodFeatureService: SharedBodEodFeatureServiceAbstraction,
    @Inject(POSS_WEB_COIN_PRODUCT_GROUP_CODE)
    public coinCode: string
  ) {
    this.translate
      .get(['pw.otherReceiptsIssues.printError'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.PrintErrorText =
          translatedMessages['pw.otherReceiptsIssues.printError'];
      });
  }

  ngOnInit() {
    this.router.events
      .pipe(
        filter(
          (event: Event) =>
            event instanceof NavigationEnd && !!this.authFacade.isUserLoggedIn()
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.type = this.activatedRoute.snapshot.params['_tab'];
        if (this.activatedRoute.snapshot.params['_txntype'] === 'manual-ab') {
          this.subTxnType = SubTransactionTypeEnum.MANUAL_AB;
        }
      });

    this.type = this.activatedRoute.snapshot.params['_tab'];

    this.overlayNotification.close();
    this.commonFacade.clearTransactionConfig();
    this.commonFacade.clearTransactionTD();

    this.summaryBar.close();
    this.productFacade.resetValues();
    this.componentInit();
    this.getCashMemoReponse();
    this.toolbarFacade.setToolbarConfig(this.toolbarData);
    this.productFacade.loadRSODetails(RSOCode);
    this.commonFacade.loadABPgDesc();
    this.productFacade.loadRSODetails('rso');

    if (this.activatedRoute.snapshot.params['_txntype'] === 'manual-ab') {
      this.subTxnType = SubTransactionTypeEnum.MANUAL_AB;
    }

    if (this.type === 'activate-request') {
      this.status = StatusTypesEnum.SUSPENDED;
      this.actionType = 'ACTIVATE_REQUEST_ADVANCE_BOOKING';
    } else if (this.type === 'freeze') {
      this.status = StatusTypesEnum.CONFIRMED;
      this.actionType = 'FREEZE';
      this.isPaymentAllowed = true;
    } else if (this.type === 'add-payment') {
      this.status = StatusTypesEnum.CONFIRMED;
      this.actionType = 'ADD_PAYMENT';
      this.isPaymentAllowed = true;
    }

    if (
      this.activatedRoute.snapshot.params['_id'] &&
      this.activatedRoute.snapshot.params['_txntype']
    ) {
      this.isLoadPriceFlag = true;
      this.advanceBookingFacade.viewCashMemo({
        id: this.activatedRoute.snapshot.params['_id'],
        txnType: TransactionTypeEnum.AB,
        subTxnType: this.subTxnType
      });
    }
    this.commonFacade.setTransactionConfig({
      isPaymentEditable: this.isPaymentAllowed,
      showPayment: true,
      isCnViewAllowed: true,
      transactionType: {
        type: TransactionTypeEnum.AB,
        subType: this.subTxnType
      }
    });
    this.rsoDetails$ = this.productFacade.getRSODetails();
    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.AB_CANCELLATION_ALLOWED_FOR_AB
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (!!data) {
          this.cancellationAllowedForAB = JSON.parse(data);
        }
      });

    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.AB_REQUEST_APPROVAL_FOR_NON_FROZEN_ORDER_CANCEL
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.isNonFrozenRequestApprovals = JSON.parse(data);
        }
      });
  }

  print() {
    this.printingService.loadPrintData({
      printType: printTypesEnum.AB_PRINTS,
      transacionType: printTransactionTypesEnum.SALES,
      printFileType: printFileTypeEnum.INVOICE_PRINT,
      customerId: this.customerId,
      transacionId: this.cashMemoId,
      doctype: printDocTypeEnum.CUSTOMER_PRINT,
      reprint: true,
      invoiceType: InvoiceDeliveryTypes.PRINT
    });
  }

  reprint() {
    this.printingService.loadPrintData({
      printType: printTypesEnum.AB_PRINTS,
      transacionType: printTransactionTypesEnum.SALES,
      printFileType: printFileTypeEnum.INVOICE_PRINT,
      customerId: this.customerId,
      transacionId: this.cashMemoId,
      doctype: printDocTypeEnum.CUSTOMER_PRINT,
      reprint: true,
      invoiceType: InvoiceDeliveryTypes.PRINT
    });
  }

  componentInit() {
    this.authFacade
      .getLocationCode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.locationCode = data;
      });
    this.printingService
      .getPrintError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.bodEodFeatureService
      .getBusinessDayDate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(businessDate => {
        this.businessDate = moment(businessDate);
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
      .pipe(takeUntil(this.destroy$))
      .subscribe(disc => {
        this.totalDisc = disc;
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
        this.finalAmt = this.currencyRoundOff(amt);

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
    this.orderConfirmationFacade
      .confirmCashMemoResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: AdvanceBookingDetailsResponse) => {
        if (data && this.actionType === 'FREEZE' && data.isFrozenRate) {
          this.creditnote = data.creditNotes;

          this.orderNo = data.docNo;

          this.showfreezeMessageNotification(
            this.freezeSuccessNotificationTemplate
          );
        } else if (data && this.actionType === 'ADD_PAYMENT') {
          this.creditnote = data.creditNotes;
          this.orderNo = data.docNo;
          this.showfreezeMessageNotification(
            this.AddPaymentSuccessNotificationTemplate
          );
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
    this.paymentFacade
      .getPaymentDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((payments: PaymentDetails[]) => {
        this.paymentDetails = payments;
      });
    this.isLoadingOrder$ = this.orderConfirmationFacade.getIsLoading();
    this.isLoading$ = this.advanceBookingFacade.getIsLoading();
    this.productFacade
      .getRSODetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data) {
          this.rso = data.map(rso => ({
            value: rso,

            description: rso
          }));
        }
      });
    this.productFacade
      .getItemDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data && data.length > 0) {
          this.productDetails$ = of(data.map(x => x.itemDetails));
          this.getTotalProductValues(data.map(x => x.itemDetails));
          this.selectedItemsDetails = data;
        }
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
        CommomStateAttributeNameEnum.MIN_AB_VALUE
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: number) => {
        this.minABValue = data;
      });

    this.advanceBookingFacade
      .getHasError()
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

    this.productFacade
      .getMetalRate()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: {}) => {
        if (data) {
          this.metalRate = data;
        }
      });

    this.pgDesc$ = this.commonFacade.getCommonFacadeAttributes(
      CommomStateAttributeTypeEnum.ADVANCE_BOOKING,
      CommomStateAttributeNameEnum.PRODUCT_GROUP_DESC
    );

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.ADVANCE_BOOKING,
        CommomStateAttributeNameEnum.IMAGE_URL_DATA
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: string) => {
        if (data !== null) {
          this.imageUrlData$.next(data);
        }
      });

    this.isCommonLoading$ = this.commonFacade.getCommonFacadeAttributes(
      CommomStateAttributeTypeEnum.ADVANCE_BOOKING,
      CommomStateAttributeNameEnum.LOADING
    );
  }

  getCashMemoReponse() {
    this.advanceBookingFacade
      .getViewCashMemoResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: AdvanceBookingDetailsResponse) => {
        if (data) {
          this.cashMemoId = data.id;
          this.currentAdvanceBookingDetailsResponse = data;
          this.abDetailPayload = {
            customerId: data.customerId,
            employeeCode: data.employeeCode,
            isFrozenRate: data.isFrozenRate,
            isBestRate: data.isBestRate,
            metalRateList: data.metalRateList,
            remarks: data.remarks,
            paidValue: data.paidValue
          };
          if (this.type === 'cancel-request') {
            if (
              moment(this.businessDate).format('YYYY-MM-DD') ===
              moment(data.docDate).format('YYYY-MM-DD')
            ) {
              this.actionType = 'CANCEL_ADVANCE_BOOKING';
            } else if (data.isFrozenRate === true || data.isBestRate === true) {
              this.actionType = 'CANCEL_REQUEST_ADVANCE_BOOKING';
            } else if (
              data.isFrozenRate === false &&
              this.isNonFrozenRequestApprovals === true
            ) {
              this.actionType = 'CANCEL_REQUEST_ADVANCE_BOOKING';
            } else if (
              data.isFrozenRate === false &&
              this.isNonFrozenRequestApprovals === false
            ) {
              this.actionType = 'CANCEL_ADVANCE_BOOKING';
            }
            this.status = StatusTypesEnum.CONFIRMED;
          }

          if (this.isLoadPriceFlag && this.type === 'freeze') {
            this.isLoadPriceFlag = false;

            this.updatePrice();
          }
          this.showSummaryBar(this.status, this.actionType);

          this.commonFacade.setTransactionTotalAmount(data.finalValue);

          this.cashMemoId = data.id;

          this.commonFacade.setTransactionTD(data.id);

          data.itemIdList.forEach(element => {
            this.productFacade.getItemFromCashMemo({
              id: this.cashMemoId,
              itemId: element,
              headerData: data,
              txnType: TransactionTypeEnum.AB,
              subTxnType: this.subTxnType
            });
          });

          this.loadItemsInCashMemo(data);
        }
      });

    this.advanceBookingFacade
      .getFreezeRateResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: AdvanceBookingDetailsResponse) => {
        if (data && data.status) {
          if (this.actionType === 'CANCEL_REQUEST_ADVANCE_BOOKING') {
            this.successMsg = 'sent for CANCELLATION';

            this.resDocNo = data.cancellationDetails.requestDocNo;
          } else if (this.actionType === 'CANCEL_ADVANCE_BOOKING') {
            this.creditnote = data.creditNotes;
            this.successMsg = 'CANCELLED';
            this.resDocNo = data.docNo;
          } else if (this.actionType === 'ACTIVATE_REQUEST_ADVANCE_BOOKING') {
            this.successMsg = ' sent for ACTIVATION';
            this.resDocNo = data.activationDetails.requestDocNo;
          }
          this.showSuccessMessageNotification();
        }
      });
  }

  updatePrice() {
    this.advanceBookingFacade.updatePriceDetails(
      {
        id: this.cashMemoId,
        txnType: TransactionTypeEnum.AB,
        subTxnType: this.subTxnType
      },
      'RATE_FREEZE'
    );
  }

  printError() {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.TIMER,
        message: this.PrintErrorText,
        hasClose: false
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        if(this.actionType === 'CANCEL_ADVANCE_BOOKING' ){
          this.showSuccessMessageNotification()
        } else{
          this.showfreezeMessageNotification(
            this.actionType === 'FREEZE'
              ? this.freezeSuccessNotificationTemplate
              : this.AddPaymentSuccessNotificationTemplate
          );
        }
      });
  }

  errorHandler(error: CustomErrors) {
    if (error.code === ErrorEnums.ERR_QZ_TRAY) {
      this.printError();
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

  showSummaryBar(status: string, type: any) {
    this.summaryBar
      .open(SummaryBarType.AB, {
        status: status,
        type: type,
        remarks: this.summaryBarRemarks$.asObservable()
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: SummaryBarEventRef) => {
        switch (event.eventType) {
          case SummaryBarEventType.CANCEL_AB: {
            if (this.isForm !== true) {
              this.clearPage = !this.clearPage;
            }
            if (this.isForm)
              this.advanceBookingFacade.freezeAdvanceBooking({
                id: this.cashMemoId,
                requestDetails: this.abDetailPayload,
                txnType: TransactionTypeEnum.AB,
                subTxnType: this.subTxnType,
                actionType: AdvanceBookingActionTypesEnum.CANCEL
              });

            break;
          }

          case SummaryBarEventType.CANCEL_REQUEST_AB: {
            if (this.isForm !== true) {
              this.clearPage = !this.clearPage;
            }
            if (this.isForm)
              this.advanceBookingFacade.freezeAdvanceBooking({
                id: this.cashMemoId,
                requestDetails: this.abDetailPayload,
                txnType: TransactionTypeEnum.AB,
                subTxnType: this.subTxnType,
                actionType: AdvanceBookingActionTypesEnum.CANCEL_REQUEST
              });
            break;
          }

          case SummaryBarEventType.ACTIVATE_REQUEST_AB: {
            this.advanceBookingFacade.freezeAdvanceBooking({
              id: this.cashMemoId,
              requestDetails: this.abDetailPayload,
              txnType: TransactionTypeEnum.AB,
              subTxnType: this.subTxnType,
              actionType: AdvanceBookingActionTypesEnum.ACTIVATE_REQUEST
            });
            break;
          }

          case SummaryBarEventType.FREEZE: {
            this.confirmFreeze(AdvanceBookingActionTypesEnum.RATE_FREEZE);
            break;
          }

          case SummaryBarEventType.ADD_PAYMENT: {
            if (this.paymentDetails.filter(x => x.isEditable).length > 0) {
              this.confirmFreeze(AdvanceBookingActionTypesEnum.ADD_PAYMENT);
            } else {
              this.errorNotifications(
                "Please add the payment's before click on confirm"
              );
            }

            break;
          }

          case SummaryBarEventType.CLAER: {
            this.router.navigate(
              [getAdvanceBookingSearchUrl()],

              {
                state: { clearFilter: false }
              }
            );

            this.clearPage = true;
            break;
          }
        }
      });
  }
  confirmFreeze(type) {
    const orderDetails: UpdateOrderDetails = {
      cashMemoId: this.cashMemoId,
      actionType: type,
      orderDetails: {
        customerId: this.abDetailPayload.customerId,
        metalRateList: this.abDetailPayload.metalRateList,
        finalValue: this.finalAmt,
        otherCharges: null,
        paidValue: this.paidValue,
        remarks: this.abDetailPayload.remarks,
        totalDiscount: this.totalDisc,
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
      subTransactionType: this.subTxnType
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

  formDetails(data) {
    console.log(data);

    if (!data.remarks) {
      this.isForm = false;
    } else {
      this.isForm = true;
    }
    this.abDetailPayload = {
      ...this.abDetailPayload,
      remarks: data.remarks ? data.remarks : this.abDetailPayload.remarks,
      employeeCode: data.employeeCode,
      isFrozenRate:
        this.type === 'freeze' ? true : this.abDetailPayload.isFrozenRate
    };

    console.log(data, this.abDetailPayload, 'after');
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

  loadItemsInCashMemo(data) {
    this.productFacade.setItemIDList(data);
    if (data.customerId) {
      this.customerFacade.loadSelectedCustomer(
        String(data.customerId),
        false,
        false
      );
    }
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
      subTxnType: SubTransactionTypeEnum.NEW_AB,
      actionType: AdvanceBookingActionTypesEnum.RATE_FREEZE
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
        this.searchAbUrl();
      });
  }

  searchAbUrl() {
    this.router.navigate(
      [getAdvanceBookingSearchUrl()],

      {
        state: { clearFilter: true }
      }
    );
  }

  loadImageUrl(event: string) {
    this.commonFacade.loadABImageUrl(event);
  }

  showfreezeMessageNotification(template) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.CUSTOM,
        message: '',
        hasBackdrop: true,
        hasClose: true,
        template: template
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.searchAbUrl();
      });
  }

  getTotalProductValues(event: any) {
    this.productQty = 0;
    this.productWeight = 0;
    this.productDisc = 0;
    this.productAmt = 0;
    this.coinQty = 0;
    this.coinWeight = 0;
    this.coinDisc = 0;
    this.coinAmt = 0;
    this.taxValue = 0;
    this.totalValue = 0;
    this.finalValue = 0;
    this.roundOff = 0;
    this.hallmarkCharges = 0;
    this.hallmarkDiscount = 0;

    if (event.length !== 0) {
      this.taxValue = this.currentAdvanceBookingDetailsResponse?.totalTax;

      this.totalValue = this.currentAdvanceBookingDetailsResponse?.totalValue;
      this.finalValue = this.currentAdvanceBookingDetailsResponse?.finalValue;
      this.roundOff = this.currentAdvanceBookingDetailsResponse?.roundingVariance;
      this.hallmarkCharges = this.currentAdvanceBookingDetailsResponse?.hallmarkCharges;
      this.hallmarkDiscount = this.currentAdvanceBookingDetailsResponse?.hallmarkDiscount;

      event.forEach(element => {
        if (element?.productGroupCode === this.coinCode) {
          this.coinQty = this.coinQty + element?.totalQuantity;
          this.coinWeight = this.coinWeight + element?.totalWeight;
          this.coinDisc = this.coinDisc + element?.totalDiscount;
          this.coinAmt = this.coinAmt + element?.totalValue;
        } else {
          this.productQty = this.productQty + element?.totalQuantity;
          this.productWeight = this.productWeight + element?.totalWeight;
          this.productDisc = this.productDisc + element?.totalDiscount;
          this.productAmt = this.productAmt + element?.totalValue;
        }
      });
    }

    const totalValues: SetTotalProductValuesPayload = {
      productQty: this.productQty,
      productWeight: this.productWeight,
      productDisc: this.productDisc,
      productAmt: this.productAmt,
      taxAmt: this.taxValue,
      totalAmt: this.totalValue,
      coinQty: this.coinQty,
      coinWeight: this.coinWeight,
      coinDisc: this.coinDisc,
      coinAmt: this.coinAmt,
      finalAmt: this.finalValue,
      roundOff: this.roundOff,
      hallmarkCharges: this.hallmarkCharges,
      hallmarkDiscount: this.hallmarkDiscount
    };

    console.log('totalValues', totalValues);

    this.commonFacade.setABTotalProductValues(totalValues);
  }

  ngOnDestroy(): void {
    this.commonFacade.setABMinABVAlue(0);
    this.orderNo = 0;
    this.creditnote = [];
    this.orderConfirmationFacade.resetValues();
    this.overlayNotification.close();
    this.advanceBookingFacade.resetValues();
    this.destroy$.next();
    this.productFacade.resetValues();
    this.destroy$.complete();
    this.summaryBar.close();
    this.commonFacade.clearTransactionConfig();

    this.summaryBarRemarks$.next('');
    this.printingService.resetPrint();

    this.toolbarFacade.setToolbarConfig({
      loadMetalPrices: true,
      loadHoldPopup: false,
      loadOpenOrdersPopup: false
    });
  }
}
