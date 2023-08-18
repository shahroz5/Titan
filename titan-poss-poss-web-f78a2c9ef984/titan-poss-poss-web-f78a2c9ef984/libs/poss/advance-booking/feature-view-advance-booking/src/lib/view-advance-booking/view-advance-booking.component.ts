import {
  Component, EventEmitter, Inject, OnDestroy, OnInit, Output,
  TemplateRef, ViewChild
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Event, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AdvanceBookingFacade } from '@poss-web/poss/advance-booking/data-access-advance-booking';
import { FocFacade } from '@poss-web/poss/foc/data-access-foc';
import { ProductFacade } from '@poss-web/poss/shared/product/data-access-product';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { FilePreviewComponent } from '@poss-web/shared/components/ui-file-upload';
import { CurrencyFormatterService } from '@poss-web/shared/components/ui-formatters';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import { FileFacade } from '@poss-web/shared/file-upload/data-access-file-upload';
import { ProductSearchAutocompleteComponent } from '@poss-web/shared/item-master/ui-product-search-autocomplete';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import {
  AdvanceBookingActionTypesEnum, AdvanceBookingDetailsResponse, AlertPopupServiceAbstraction, AlertPopupTypeEnum, CashMemoItemDetailsResponse, CashMemoTaxDetails, CommomStateAttributeNameEnum, CommomStateAttributeTypeEnum, CustomErrors, DocumentListResponse, EditedWeightData, FileTypeEnum, FileUploadLists,
  FreezeRateEnum, InvoiceDeliveryTypes, LocationSettingAttributesEnum, Lov, OverlayNotificationEventRef, OverlayNotificationServiceAbstraction, OverlayNotificationType, PaymentDetails, PaymentModeEnum, PostTransactionConfirmationActionsServiceAbstraction, printDocTypeEnum, printFileTypeEnum, PrintingServiceAbstraction, printTransactionTypesEnum, printTypesEnum, ProductDetailsInGrid, ProductPriceDetails, RsoDetailsPayload, SetTotalProductValuesPayload, StatusTypesEnum, SubTransactionTypeEnum, SummaryBarEventRef, SummaryBarEventType, SummaryBarServiceAbstraction, SummaryBarType,
  ToolbarConfig, TransactionTypeEnum, UpdateOrderDetails
} from '@poss-web/shared/models';
import {
  OrderConfirmationFacade,
  OrderService
} from '@poss-web/shared/order-confirmation/data-access-order-confirmation';
import { PaymentFacade } from '@poss-web/shared/payment/data-access-payment';
import { ToolbarFacade } from '@poss-web/shared/toolbar/data-access-toolbar';
import { POSS_WEB_COIN_PRODUCT_GROUP_CODE } from '@poss-web/shared/util-config';
import { getAdvanceBookingReguestStatusUrl } from '@poss-web/shared/util-site-routes';
import { Observable, of, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { ErrorEnums } from '@poss-web/shared/util-error';

const selectRSO = 'Select RSO';
const RSOCode = 'RSO';

@Component({
  selector: 'poss-web-view-advance-booking',
  templateUrl: './view-advance-booking.component.html'
})
export class ViewAdvanceBookingComponent implements OnInit, OnDestroy {
  customerId = null;
  selectedOccasion = null;
  cashMemoId = null;
  isFocCheck = false;
  productType: string;
  rsoDetails = [selectRSO];
  itemIdArray = [];
  itemIdsArray = [];
  totalProductsCount = 0;
  totalQty = 0;
  totalAmt = 0;
  totalDisc = 0;
  totalWeight = 0;
  totalTax = 0;
  productAmt = 0;
  paidValue = 0;
  editedItem: ProductDetailsInGrid;
  editedWeightData: EditedWeightData;
  currencyCode: string;
  metalRate: any;
  productDetails = [];
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
  resDocNo: number;
  currentAdvanceBookingDetailsResponse: AdvanceBookingDetailsResponse;
  isAddFlag = false;
  isLoadPriceFlag: boolean;
  isUpdateFlag: boolean;
  isLotNumberUpdate: boolean;
  isActualWeightUpdate: boolean;
  confirmedCashmemoDoc = 0;
  isLoading$: Observable<boolean>;
  selectedItemsDetails: CashMemoItemDetailsResponse[] = [];
  occasionList$: Observable<Lov[]>;
  docNo: number;
  defaultImageUrl = 'assets/img/product-default-image.svg';
  filesList: DocumentListResponse[];
  productDetails$: Observable<any>;
  selectedData$: Observable<any>;
  isValid$: Observable<any>;
  paymentDetails: PaymentDetails[];
  product$: Subject<ProductDetailsInGrid> = new Subject<ProductDetailsInGrid>();
  successMsg = '';
  errorData$: Subject<boolean> = new Subject<boolean>();
  destroy$: Subject<null> = new Subject<null>();
  tab = '';
  subTxnType = SubTransactionTypeEnum.NEW_AB;
  minABValue: number;
  @Output() orderNumber = new EventEmitter<number>();
  @Output() clearProductGridData = new EventEmitter<null>();
  @ViewChild(ProductSearchAutocompleteComponent)
  private searchComponent: ProductSearchAutocompleteComponent;
  @ViewChild('confirmSuccessNotificationTemplate', { static: true })
  confirmSuccessNotificationTemplate: TemplateRef<any>;
  @ViewChild('confirmRegularizeSuccessNotificationTemplate', { static: true })
  confirmRegularizeSuccessNotificationTemplate: TemplateRef<any>;
  confirmedTime: any;
  rso: any;
  toolbarData: ToolbarConfig = {
    txnType: TransactionTypeEnum.AB,
    subTxnType: this.subTxnType,
    loadMetalPrices: true,
    loadHoldPopup: false,
    loadOpenOrdersPopup: false
  };
  isLoadingOrder$: Observable<boolean>;
  pgDesc$: Observable<{}>;
  imageUrlData$: Subject<any> = new Subject<any>();
  creditnote = [];
  summaryBarRemarks$ = new Subject<string>();
  isLoggedIn: boolean;
  productQty = 0;
  productWeight = 0;
  productDisc = 0;
  coinQty = 0;
  coinWeight = 0;
  coinDisc = 0;
  coinAmt = 0;
  taxAmt = 0;
  finalAmt = 0;
  roundOff = 0;
  hallmarkCharges = 0;
  hallmarkDiscount = 0;
  imageUrl: string;
  enableFreeze = true;
  bgrAllowed = false;
  MinABFrozenAmount: number;
  frozenAB: boolean;
  selectedFOCSchemes = [];
  rsoDetails$: Observable<RsoDetailsPayload[]>;
  isCommonLoading$: Observable<boolean>;
  newlyGeneratedCn: any;
  newlyGeneratedCNForPrint: any;
  isCNPrinting = false;
  paymentType: string;
  PrintErrorText: string;

  constructor(
    public customerFacade: CustomerFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private summaryBar: SummaryBarServiceAbstraction,
    private advanceBookingFacade: AdvanceBookingFacade,
    private orderConfirmationFacade: OrderConfirmationFacade,
    private translate: TranslateService,
    private toolbarFacade: ToolbarFacade,
    private router: Router,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private appsettingFacade: AppsettingFacade,
    private commonFacade: CommonFacade,
    private paymentFacade: PaymentFacade,
    private locationSettingsFacade: LocationSettingsFacade,
    private productFacade: ProductFacade,
    private fileFacade: FileFacade,
    private authFacade: AuthFacade,
    private orderService: OrderService,
    private currencyFormatterService: CurrencyFormatterService,
    private alertPopupService: AlertPopupServiceAbstraction,
    public printingService: PrintingServiceAbstraction,
    private postConfirmationActions: PostTransactionConfirmationActionsServiceAbstraction,
    @Inject(POSS_WEB_COIN_PRODUCT_GROUP_CODE)
    public coinCode: string,
    private focFacade: FocFacade
  ) {
    this.appsettingFacade.setBlockCopyPasteSetting(true);
    this.translate
      .get(['pw.otherReceiptsIssues.printError'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.PrintErrorText =
          translatedMessages['pw.otherReceiptsIssues.printError'];
      });
  }

  ngOnInit() {
    this.clearPage(true);

    this.getCashMemoReponse();

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
        this.tab = this.activatedRoute.snapshot.params['_tab'];
        if (this.activatedRoute.snapshot.params['_txntype'] === 'manual-ab') {
          this.subTxnType = SubTransactionTypeEnum.MANUAL_AB;
        }
      });

    this.tab = this.activatedRoute.snapshot.params['_tab'];
    if (this.activatedRoute.snapshot.params['_txntype'] === 'manual-ab') {
      this.subTxnType = SubTransactionTypeEnum.MANUAL_AB;
    }

    if (this.activatedRoute.snapshot.params['_processId']) {
      let workflow = '';
      if (this.tab === 'cancel') {
        workflow = 'CANCEL_ADVANCE_BOOKING';
      } else if (this.tab === 'activate') {
        workflow = 'ACTIVATE_ADVANCE_BOOKING';
      } else {
        workflow = 'ADVANCE_BOOKING_MANUAL_BILL';
      }

      this.advanceBookingFacade.loadworkflowProcessDetails({
        processId: this.activatedRoute.snapshot.params['_processId'],
        workflowType: workflow
      });
    }

    this.commonFacade.setTransactionConfig({
      isPaymentEditable: false,
      showPayment: this.tab === 'regularize' ? false : true,
      isCnViewAllowed: this.tab === 'regularize' ? false : true,
      transactionType: {
        type: TransactionTypeEnum.AB,
        subType: this.subTxnType
      },
      taxTransactionType: TransactionTypeEnum.CUST_TRANSACTION_AB
    });

    if (this.activatedRoute.snapshot.params['_id']) {
      this.advanceBookingFacade.viewCashMemo({
        id: this.activatedRoute.snapshot.params['_id'],
        txnType: TransactionTypeEnum.AB,
        subTxnType: this.subTxnType
      });
    }

    // this.printingService
    //   .getIsPrintingSuccess()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((isPrintingSuccess: boolean) => {
    //     if (isPrintingSuccess) {
    //         if (this.isCNPrinting) {
    //           this.newlyGeneratedCNForPrint.shift();
    //         }
    //         if (this.newlyGeneratedCNForPrint.length > 0) {
    //           this.isCNPrinting = true;
    //           this.printCN(this.newlyGeneratedCNForPrint[0]);
    //           this.newlyGeneratedCNForPrint = []
    //         } else {
    //           this.isCNPrinting = false;
    //           this.showAlertPopUp('pw.regularCashMemo.printingSuccessMessage');
    //         }
    //     }
    //   });

    this.componentInit();
  }

  componentInit() {
    this.showSummaryBar('', '');
    this.isLoading$ = this.advanceBookingFacade.getIsLoading();
    this.isLoadingOrder$ = this.orderConfirmationFacade.getIsLoading();
    this.toolbarFacade.setToolbarConfig(this.toolbarData);
    this.productFacade.loadRSODetails(RSOCode);
    this.commonFacade.loadABPgDesc();
    this.selectedData$ = this.advanceBookingFacade.getSelectedData();
    this.selectedData$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.showSummaryBar(data.approvalStatus, data.workflowType);
          this.commonFacade.clearTransactionConfig();
          this.commonFacade.setTransactionConfig({
            isPaymentEditable:
              this.tab === 'regularize' &&
              data.approvalStatus === StatusTypesEnum.APPROVED
                ? true
                : false,
            isCnViewAllowed: this.tab === 'regularize' ? false : true,
            transactionType: {
              type: TransactionTypeEnum.AB,
              subType: this.subTxnType
            },
            taxTransactionType: TransactionTypeEnum.CUST_TRANSACTION_AB,
            transactionID: this.currentAdvanceBookingDetailsResponse ? this.currentAdvanceBookingDetailsResponse.id : null,
            transactionTotalAmount: this.currentAdvanceBookingDetailsResponse ? this.currentAdvanceBookingDetailsResponse.finalValue : 0
          });
        }
      });

    this.commonFacade.loadABStandardMetalPriceDetails();
    this.isLoading$ = this.advanceBookingFacade.getIsLoading();
    this.rsoDetails$ = this.productFacade.getRSODetails();

    this.paymentFacade
      .getPaymentDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((payments: PaymentDetails[]) => {
        this.paymentDetails = payments;
        this.newlyGeneratedCn = this.paymentDetails.filter(
          cn =>
            (cn.paymentCode === PaymentModeEnum.CREDIT_NOTE)
        );
        if (this.newlyGeneratedCn) {
          this.newlyGeneratedCNForPrint = this.newlyGeneratedCn;
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

    this.advanceBookingFacade
      .getMinABValue()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: number) => {
        this.commonFacade.setABMinABVAlue(data);
      });

      this.advanceBookingFacade
      .getABStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.commonFacade.setAbStatus(data);
      })

    this.paymentFacade
      .getTotalPaidAmount()
      .pipe(takeUntil(this.destroy$))
      .subscribe(totalValue => {
        this.paidValue = totalValue;
      });
    this.productFacade
      .getItemDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data) {
          this.productDetails$ = of(data.map(x => x.itemDetails));
          this.getTotalProductValues(data.map(x => x.itemDetails));

          this.selectedItemsDetails = data;
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
    this.orderConfirmationFacade
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

    this.advanceBookingFacade
      .getFreezeRateResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: AdvanceBookingDetailsResponse) => {
        if (data && data.status) {
          this.currentAdvanceBookingDetailsResponse = data;
          this.creditnote = data.creditNotes;
          if (this.tab === 'cancel' || this.tab === 'activate') {
            if (
              this.tab === 'cancel' &&
              data.status === StatusTypesEnum.NEWCANCELLED
            ) {
              this.successMsg = 'CANCELLED';
            } else if (
              this.tab === 'cancel' &&
              data.status === StatusTypesEnum.CONFIRMED
            ) {
              this.successMsg = 'Rejected For Cancellation';
            } else if (
              this.tab === 'activate' &&
              data.status === StatusTypesEnum.CONFIRMED
            ) {
              this.successMsg = 'ACTIVATED';
            } else if (
              this.tab === 'activate' &&
              data.status === StatusTypesEnum.SUSPENDED
            ) {
              this.successMsg = 'Rejected For Activation';
            }

            this.resDocNo = data.docNo;

            this.showSuccessMessageNotification();
          }
        }
      });

    this.orderConfirmationFacade
      .confirmCashMemoResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: AdvanceBookingDetailsResponse) => {
        if (data && data.status) {
          this.docNo = data.docNo;
          this.creditnote = data.creditNotes;
          this.showRegularizeSuccessMessageNotification();
        }
      });

    this.advanceBookingFacade
      .getUpdateCashMemoResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: AdvanceBookingDetailsResponse) => {
        if (data && data.status) {
          this.docNo = data.docNo;
          this.creditnote = data.creditNotes;
          this.showRegularizeSuccessMessageNotification();
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

    this.isCommonLoading$ = this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.ADVANCE_BOOKING,
        CommomStateAttributeNameEnum.LOADING
      );

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

    this.advanceBookingFacade
      .getFileUploadListRes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: FileUploadLists[]) => {
        if (data.length !== 0)
          this.advanceBookingFacade.loadFileDownloadUrl({
            id: data[data.length - 1].id,
            locationCode: null
          });
      });

    this.advanceBookingFacade
      .getFileDownloadUrl()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: string) => {
        this.imageUrl = data;
      });

    this.focFacade.loadSelectedABFocSchemes({
      id: this.activatedRoute.snapshot.params['_id'],
      txnType: TransactionTypeEnum.AB,
      subTxnType: this.subTxnType
    });

    this.fileFacade.loadDocumentsList({
      customerId: null,
      docType: 'AB',
      fileType: 'OTHERS',
      id: this.activatedRoute.snapshot.params['_id']
    });

    this.fileFacade
      .getDocumentsLst()
      .pipe(takeUntil(this.destroy$))
      .subscribe(docs => {
        if (docs) {
          this.filesList = docs;
        }
      });
    this.fileFacade
      .getDocumentUrlById()
      .pipe(takeUntil(this.destroy$))
      .subscribe(docUrl => {
        if (docUrl) {
          this.showPopup(docUrl);
        }
      });

    this.fileFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.focFacade
      .getSelectedABFocSchemes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(selectedFOCSchemes => {
        if (selectedFOCSchemes) this.selectedFOCSchemes = selectedFOCSchemes;
      });
  }

  getCashMemoReponse() {
    this.advanceBookingFacade
      .getViewCashMemoResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: AdvanceBookingDetailsResponse) => {
        if (data) {
          this.currentAdvanceBookingDetailsResponse = data;

          this.advanceBookingFacade.loadFileUploadList({
            txnType: TransactionTypeEnum.AB,
            id: data.id,
            customerId: data.customerId
          });

          this.commonFacade.setTransactionTotalAmount(data.finalValue);

          this.cashMemoId = data.id;
          this.summaryBarRemarks$.next(data.remarks);

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
  }
  showSummaryBar(status: string, type: string) {
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
            this.advanceBookingFacade.freezeAdvanceBooking({
              id: this.cashMemoId,
              requestDetails: this.currentAdvanceBookingDetailsResponse,
              txnType: TransactionTypeEnum.AB,
              subTxnType: this.subTxnType,
              actionType: AdvanceBookingActionTypesEnum.CANCEL
            });

            break;
          }
          case SummaryBarEventType.CONFIRMCANCEL: {
            this.advanceBookingFacade.freezeAdvanceBooking({
              id: this.cashMemoId,
              requestDetails: this.currentAdvanceBookingDetailsResponse,
              txnType: TransactionTypeEnum.AB,
              subTxnType: this.subTxnType,
              actionType: AdvanceBookingActionTypesEnum.CANCEL_REQUEST,
              acknowledge: true
            });

            break;
          }
          case SummaryBarEventType.SUSPEND_AB: {
            this.advanceBookingFacade.freezeAdvanceBooking({
              id: this.cashMemoId,
              requestDetails: this.currentAdvanceBookingDetailsResponse,
              txnType: TransactionTypeEnum.AB,
              subTxnType: this.subTxnType,
              actionType: AdvanceBookingActionTypesEnum.ACTIVATE_REQUEST,
              acknowledge: true
            });

            break;
          }
          case SummaryBarEventType.ACTIVATE_AB: {
            this.advanceBookingFacade.freezeAdvanceBooking({
              id: this.cashMemoId,
              requestDetails: this.currentAdvanceBookingDetailsResponse,
              txnType: TransactionTypeEnum.AB,
              subTxnType: this.subTxnType,
              actionType: AdvanceBookingActionTypesEnum.ACTIVATE
            });
            break;
          }

          case SummaryBarEventType.REGULARIZE_AB: {
            this.confirmManualAB(event);

            break;
          }
          case SummaryBarEventType.PRINT: {
            this.reprint();
          }
        }
      });
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
          this.showSuccessMessageNotification()
      });
  }

  reprint() {
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
                  transacionType: printTransactionTypesEnum.SALES,
                  printFileType: printFileTypeEnum.INVOICE_PRINT,
                  customerId: this.customerId,
                  transacionId: this.cashMemoId,
                  doctype: printDocTypeEnum.CUSTOMER_PRINT,
                  reprint: true,
                  invoiceType: action
                });

        }
      });
  }

  print() {
    this.printingService.loadPrintData({
      printType: printTypesEnum.AB_PRINTS,
      transacionId: this.cashMemoId,
      transacionType: printTransactionTypesEnum.SALES,
      doctype: printDocTypeEnum.CUSTOMER_PRINT,
      printFileType: printFileTypeEnum.INVOICE_PRINT
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

  freezeRate(type) {
    this.advanceBookingFacade.freezeAdvanceBooking({
      id: this.currentAdvanceBookingDetailsResponse.id,
      requestDetails: {
        customerId: this.customerId,
        isFrozenRate: type === FreezeRateEnum.YES ? true : false,
        isBestRate: false
      },
      txnType: TransactionTypeEnum.AB,
      subTxnType: SubTransactionTypeEnum.MANUAL_AB
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

  confirmManualAB(event) {
    const orderDetails: UpdateOrderDetails = {
      cashMemoId: this.cashMemoId,
      orderDetails: {
        customerId: this.currentAdvanceBookingDetailsResponse.customerId,
        metalRateList: this.currentAdvanceBookingDetailsResponse.metalRateList,
        finalValue: this.currentAdvanceBookingDetailsResponse.finalValue,
        otherCharges: null,
        paidValue: this.currencyRoundOff(this.paidValue),
        remarks: event.remarks ? event.remarks : null,
        totalDiscount: this.currentAdvanceBookingDetailsResponse.totalDiscount,
        totalQuantity: this.currentAdvanceBookingDetailsResponse.totalQuantity,

        totalTax: this.currentAdvanceBookingDetailsResponse.totalTax,
        totalValue: this.currentAdvanceBookingDetailsResponse.totalValue,
        totalWeight: this.currentAdvanceBookingDetailsResponse.totalWeight,

        minValue: this.minABValue,
        hallmarkCharges: this.currencyRoundOff(
          this.currentAdvanceBookingDetailsResponse.hallmarkCharges
        ),
        hallmarkDiscount: this.currencyRoundOff(
          this.currentAdvanceBookingDetailsResponse.hallmarkDiscount
        )
      },
      status: StatusTypesEnum.CONFIRMED,

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

  clearPage(clearTransactionID: boolean) {
    if (clearTransactionID) {
      this.commonFacade.clearTransactionTD();
      this.clearProductGridData.emit();
    }

    this.commonFacade.clearAdvanceBooking();
    this.advanceBookingFacade.resetValues();
    this.customerId = null;
    this.selectedOccasion = null;
    this.itemIdsArray = [];
    this.itemIdArray = [];
    this.summaryBar.close();
    this.isUpdateFlag = false;
    this.cashMemoId = null;
    this.customerFacade.clearCustomerSearch();
    this.errorData$.next(false);
    this.overlayNotification.close();
    this.totalProductsCount = 0;
    this.rowNumber = -1;
    this.orderConfirmationFacade.resetValues();
    this.deleteFlag = false;
    this.orderNumber.emit(0);
    this.currentAdvanceBookingDetailsResponse = null;

    this.commonFacade.setABMinABVAlue(0);
    this.commonFacade.setminFrozenABVAlue(0);
    this.summaryBarRemarks$.next('');
  }

  loadItemsInCashMemo(data) {
    this.status = data.status;
    this.productFacade.setItemIDList(data);
    if (data.customerId) {
      this.customerFacade.loadSelectedCustomer(
        String(data.customerId),
        false,
        false
      );
    }
  }

  searchAbUrl() {
    this.advanceBookingFacade.loadSelectedData(null);
    this.summaryBar.close();
    this.router.navigate([getAdvanceBookingReguestStatusUrl()]);
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

        this.advanceBookingFacade.loadSelectedData(null);
        this.router.navigate([getAdvanceBookingReguestStatusUrl()], {
          state: { clearFilter: false }
        });
      });
  }

  loadImageUrl(event: string) {
    this.commonFacade.loadABImageUrl(event);
  }

  showRegularizeSuccessMessageNotification() {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.CUSTOM,
        message: '',
        hasBackdrop: true,
        hasClose: true,
        template: this.confirmRegularizeSuccessNotificationTemplate
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        this.clearPage(true);

        this.advanceBookingFacade.loadSelectedData(null);
        this.router.navigate([getAdvanceBookingReguestStatusUrl()], {
          state: { clearFilter: false }
        });
      });
  }
  showPopup(image): void {
    this.dialog.open(FilePreviewComponent, {
      height: '490px',
      width: '700px',
      autoFocus: false,
      data: {
        defaultImageUrl: this.defaultImageUrl,
        imageUrl: image,
        previewHeader: 'File upload'
      }
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
    this.taxAmt = 0;
    this.totalAmt = 0;
    this.finalAmt = 0;
    this.roundOff = 0;
    this.hallmarkCharges = 0;
    this.hallmarkDiscount = 0;
    if (event.length !== 0) {
      this.taxAmt = this.currentAdvanceBookingDetailsResponse?.totalTax;

      this.finalAmt = this.currentAdvanceBookingDetailsResponse?.finalValue;
      this.totalAmt = this.currentAdvanceBookingDetailsResponse?.totalValue;
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
      taxAmt: this.taxAmt,
      totalAmt: this.totalAmt,
      coinQty: this.coinQty,
      coinWeight: this.coinWeight,
      coinDisc: this.coinDisc,
      coinAmt: this.coinAmt,
      finalAmt: this.finalAmt,
      roundOff: this.roundOff,
      hallmarkCharges: this.hallmarkCharges,
      hallmarkDiscount: this.hallmarkDiscount
    };

    console.log('totalValues', totalValues);

    this.commonFacade.setABTotalProductValues(totalValues);
  }

  loadFileImageUrl(fileData) {
    let extn = fileData.name.split('.').pop();
    extn = extn.toLowerCase();
    if (extn === FileTypeEnum.PDF) this.fileFacade.downloadPdfFile(fileData);
    else extn === FileTypeEnum.JPG || extn === FileTypeEnum.JPEG;
    this.fileFacade.loadDocumentUrlById(fileData.id);
  }

  ngOnDestroy(): void {
    this.overlayNotification.close();
    this.summaryBar.close();
    this.fileFacade.clearResponse();
    this.creditnote = [];
    this.docNo = 0;
    this.commonFacade.setABMinABVAlue(0);
    this.commonFacade.setAbStatus(null);
    this.advanceBookingFacade.resetValues();
    this.destroy$.next();
    this.productFacade.resetValues();
    this.destroy$.complete();

    this.commonFacade.clearTransactionConfig();
    this.appsettingFacade.setBlockCopyPasteSetting(false);
    this.printingService.resetPrint();

    this.toolbarFacade.setToolbarConfig({
      loadMetalPrices: true,
      loadHoldPopup: false,
      loadOpenOrdersPopup: false
    });
    this.paymentFacade.resetDeletedPayment();
  }
}
