import {
  Component,
  OnInit,
  OnDestroy,
  TemplateRef,
  ViewChild,
  Inject,
  Output,
  EventEmitter
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {
  GiftCardBinEnum,
  GiftCardItem,
  GiftCardsTypesEnum,
  SummaryBarServiceAbstraction,
  CustomerInfo,
  OverlayNotificationEventType,
  OverlayNotificationEventRef,
  AddGiftCardItemPayload,
  PartiallyUpdateGiftDetailsPayload,
  PartiallyUpdateGcCmPayload,
  UpdateOrderDetails,
  StatusTypesEnum,
  CashMemoDetailsResponse,
  SummaryBarType,
  ToolbarConfig,
  GcDetails,
  GetGiftCardItemResponse,
  LocationSettingAttributesEnum,
  printTypesEnum,
  printDocTypeEnum,
  printTransactionTypesEnum,
  printFileTypeEnum,
  QCGCGetBalancePayload,
  GiftCardTxnEnum,
  CommomStateAttributeTypeEnum,
  CommomStateAttributeNameEnum,
  PostTransactionConfirmationActionsServiceAbstraction,
  InvoiceDeliveryTypes,
  RsoNameObject,
  PanFormVerifyPopupServiceAbstraction,
  CustomerServiceAbstraction
} from '@poss-web/shared/models';
import { GiftCardsFacade } from '@poss-web/poss/gift-cards/data-access-gift-cards';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { PaymentFacade } from '@poss-web/shared/payment/data-access-payment';
import {
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  SummaryBarEventRef,
  SummaryBarEventType,
  TransactionTypeEnum,
  PaymentDetails,
  SubTransactionTypeEnum,
  GcCashMemoDetailsRequest,
  RoleCodesEnum,
  PrintingServiceAbstraction
} from '@poss-web/shared/models';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject, of, combineLatest } from 'rxjs';
import { takeUntil, filter, take } from 'rxjs/operators';
import { OverlayNotificationType } from '@poss-web/shared/models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { CurrencySymbolService } from '@poss-web/shared/components/ui-formatters';
import { POSS_WEB_GC_MAX_AMOUNT_LIMIT } from '@poss-web/shared/util-config';
import { POSS_WEB_GC_MIN_AMOUNT_LIMIT } from '@poss-web/shared/util-config';

// import { PrintingService } from '@poss-web/shared/printing/feature-printing';

import {
  OrderConfirmationFacade,
  OrderService
} from '@poss-web/shared/order-confirmation/data-access-order-confirmation';

import { ToolbarFacade } from '@poss-web/shared/toolbar/data-access-toolbar';
import { ActivatedRoute, Router, Event, NavigationEnd } from '@angular/router';
import { AuthFacade } from '@poss-web/shared/auth/data-access-auth';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum
} from '@poss-web/shared/models';
import {
  getGiftCardsSaleUrl,
  homeUrl
} from '@poss-web/shared/util-site-routes';
import { ValidateCustomerService } from '@poss-web/shared/customer/feature-customer-create';

@Component({
  selector: 'poss-web-gift-cards-sale',
  templateUrl: './gift-cards-sale.component.html',
  styleUrls: ['./gift-cards-sale.component.scss']
})
export class GiftCardsSaleComponent implements OnInit, OnDestroy {
  @ViewChild('gcSaleSuccessNotificationTemplate', { static: true })
  private gcSaleSuccessNotificationTemplate: TemplateRef<any>;
  giftCardSaleFormGroup: FormGroup;
  baseCurrencyCode: string;
  cardNumbersList: string[] = [];
  cardsListObservable$: Observable<GiftCardItem[]>;
  clearCardNumberField = false;
  clearAllDataObservable$ = of(false);
  destroy$ = new Subject();
  enableUnipay = false;
  giftCardObservable$: Observable<[GiftCardItem]> | Observable<[]>;
  roleCode: string = RoleCodesEnum.RSO;
  selectedCustomer$: Observable<CustomerInfo>;
  isLoading$: Observable<boolean>;
  isOrderConfirmationLoading$: Observable<boolean>;
  maxAmount = 0;
  minAmount = 0;
  paymentDetailsList: PaymentDetails[] = [];
  recentlyAddedCardNumber: string;
  rsoNamesList: { value: string; description: string }[] = [];
  cardsList: GiftCardItem[] = [];
  totalAmt = 0;
  totalPaidAmount = 0;
  updatedCardsList: GiftCardItem[] = [];
  customerId = null;
  customer = null;
  cashMemoId = null;
  cashMemoNumber = null;
  selectedSalesTxnId = null;
  deleteId = null;
  deleteEventObj = null;
  updatedGcItem = null;
  updateAmount = null;
  printData$: Observable<any>;
  selectedRsoName: { value: string; description: string };
  selectCustomerAlertMessage: string;
  selectRsoNameAlertMessage: string;
  addRemarksAlertMessage: string;
  invalidRemarksAlertMessage: string;
  reversePaymentAlertMessage: string;
  technicalIssueInTransactionIdAlertMessage: string;
  clearSelectedRsoName = false;
  paidValue = 0;
  paymentDetails: PaymentDetails[];
  summaryBarRemarks$ = new Subject<string>();
  isOpenTask = false;
  printErrorText: string;
  selectedRso;
  isLoggedIn: boolean;
  isScan = false;
  status: StatusTypesEnum;
  transactionTypeEnum = TransactionTypeEnum;
  subTransactionTypeEnum = SubTransactionTypeEnum;
  isGcSaleAllowed = false;
  isTransactionSuccess = false;
  giftCardsList = [];
  cardsTotalAmount = 0;
  totalPaidAmountInPayment = 0;
  @Output() orderNumber = new EventEmitter<{
    orderNo: number;
    status: StatusTypesEnum;
  }>();
  isProfileMatched: boolean;
  customerType: string;
  maxAllowedAmount: number;
  panMandatoryForGiftCard: boolean;

  constructor(
    @Inject(POSS_WEB_GC_MAX_AMOUNT_LIMIT) public maxGcAmountLimit,
    @Inject(POSS_WEB_GC_MIN_AMOUNT_LIMIT) public minGcAmountLimit,
    public currencySymbolService: CurrencySymbolService,
    public dialog: MatDialog,
    public translate: TranslateService,
    private giftCardsFacade: GiftCardsFacade,
    private customerFacade: CustomerFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    public paymentFacade: PaymentFacade,
    private commonFacade: CommonFacade,
    private summaryBar: SummaryBarServiceAbstraction,
    private fieldValidatorsService: FieldValidatorsService,
    private orderService: OrderService,
    private orderConfirmationFacade: OrderConfirmationFacade,
    private toolbarFacade: ToolbarFacade,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authFacade: AuthFacade,
    public printingService: PrintingServiceAbstraction,
    private locationSettingsFacade: LocationSettingsFacade,
    private alertPopupService: AlertPopupServiceAbstraction,
    private panFormVerifyPopupService: PanFormVerifyPopupServiceAbstraction,
    private postConfirmationActions: PostTransactionConfirmationActionsServiceAbstraction,
    private customerService: CustomerServiceAbstraction,
    private validateCustomerService: ValidateCustomerService
  ) {
    this.giftCardSaleFormGroup = new FormGroup({});
    // this.maxAmount = Number(maxGcAmountLimit);
    // this.minAmount = Number(minGcAmountLimit);
    // this.giftCardSaleFormGroup = new FormGroup({
    //   amount: new FormControl('', [
    //     this.fieldValidatorsService.requiredField('amount'),
    //     this.fieldValidatorsService.amountField(
    //       'amount',
    //       this.maxAmount,
    //       this.minAmount
    //     )
    //   ]),
    //   tax: new FormControl(0)
    // });
    this.translate
      .get(['pw.otherReceiptsIssues.printError'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.printErrorText =
          translatedMessages['pw.otherReceiptsIssues.printError'];
      });
  }

  ngOnInit() {
    const toolbarData: ToolbarConfig = {
      txnType: TransactionTypeEnum.CM,
      subTxnType: SubTransactionTypeEnum.GIFT_SALE,
      loadMetalPrices: true,
      loadHoldPopup: false,
      loadOpenOrdersPopup: true
    };
    this.toolbarFacade.setToolbarConfig(toolbarData);
    this.commonFacade.setGcTotalCardsQty(0);
    // this.commonFacade.setSelectedRsoName(null);
    this.commonFacade.setGCSelectedRsoName(null);
    this.overlayNotification.close();
    const gcDetails$ = combineLatest([
      this.locationSettingsFacade.getLocationSetting(
        LocationSettingAttributesEnum.GC_MINIMUM_AMOUNT
      ),
      this.locationSettingsFacade.getLocationSetting(
        LocationSettingAttributesEnum.GC_MAXIMUM_AMOUNT
      )
    ]);
    gcDetails$.pipe(takeUntil(this.destroy$)).subscribe(gcAmount => {
      if (gcAmount[0] && gcAmount[1]) {
        this.minAmount = Number(gcAmount[0]);
        this.maxAmount = Number(gcAmount[1]);
        this.giftCardSaleFormGroup = new FormGroup({
          amount: new FormControl('', [
            this.fieldValidatorsService.requiredField('amount'),
            this.fieldValidatorsService.amountField(
              'amount',
              this.maxAmount,
              this.minAmount
            )
          ]),
          tax: new FormControl(0)
        });
      }
    });

    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.GC_IS_CARD_ACTIVATION_ALLOWED
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((isGcSaleAllowed: string) => {
        if (isGcSaleAllowed === 'true') {
          this.isGcSaleAllowed = true;
          this.getTranslatedAlertMessages();
          this.locationSettingsFacade
            .getLocationSetting(
              LocationSettingAttributesEnum.BASECURRENCY_CURRENCY_CODE
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe((currencyCode: string) => {
              this.baseCurrencyCode = currencyCode;
            });
          this.clearData();

          // this.commonFacade.setTransactionConfig({
          //   isPaymentEditable: true,
          //   transactionType: {
          //     type: TransactionTypeEnum.CM,
          //     subType: SubTransactionTypeEnum.GIFT_SALE
          //   }
          // });
          this.commonFacade.setTransactionConfig({
            isPaymentEditable: true,
            transactionType: {
              type: TransactionTypeEnum.CM,
              subType: SubTransactionTypeEnum.GIFT_SALE
            }
          });

          this.paymentFacade
            .getTotalPaidAmount()
            .pipe(takeUntil(this.destroy$))
            .subscribe(totalValue => {
              this.paidValue = totalValue;
            });
          this.getCustomerResponse();
          this.getCashMemoResponse();

          this.clearAllDataObservable$ = of(true);
          this.giftCardObservable$ = of(null);
          const id = this.activatedRoute.snapshot.params['_id'];
          if (id !== 'new') {
            this.giftCardsFacade.loadSelectedGcCashMemoDetails(id);
            // this.commonFacade.setTransactionTD(id);
            this.commonFacade.setTransactionTD(id);
          } else {
            this.isOpenTask = false;
          }
          this.authFacade
            .isUserLoggedIn()
            .pipe(takeUntil(this.destroy$))
            .subscribe((isLoggedIn: boolean) => {
              this.isLoggedIn = isLoggedIn;
            });

          this.router.events
            .pipe(
              filter(
                (event: Event) =>
                  event instanceof NavigationEnd && this.isLoggedIn
              ),
              takeUntil(this.destroy$)
            )
            .subscribe(() => {
              this.clearAllDataObservable$ = of(true);
              this.giftCardObservable$ = of(null);
              const id = this.activatedRoute.snapshot.params['_id'];
              if (id !== 'new') {
                this.giftCardsFacade.loadSelectedGcCashMemoDetails(id);
                // this.commonFacade.setTransactionTD(id);
                this.commonFacade.setTransactionTD(id);
              } else {
                this.isOpenTask = false;
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

          this.giftCardsFacade
            .getSelectedGcCashMemoDetails()
            .pipe(takeUntil(this.destroy$))
            .subscribe((cashMemoDetails: any) => {
              if (cashMemoDetails) {
                this.isOpenTask = true;
                this.status = StatusTypesEnum.OPEN;
                this.orderNumber.emit({
                  orderNo: cashMemoDetails.docNo,
                  status: this.status
                });
                this.giftCardsFacade.setOrderNumber(
                  cashMemoDetails.docNo,
                  this.status
                );
                this.commonFacade.setGcOrderNumber({
                  orderNo: cashMemoDetails.docNo,
                  status: this.status
                });
                this.cashMemoId = cashMemoDetails.id;
                this.customerId = cashMemoDetails.customerId;
                this.selectedRso = this.getRsoObjFromCode(
                  cashMemoDetails.employeeCode
                );
                this.setSelectedRSOName(this.selectedRso);
                cashMemoDetails.itemIdList.forEach((giftCardItemId: string) => {
                  this.giftCardsFacade.getAddedGiftCardItem(
                    cashMemoDetails.id,
                    giftCardItemId
                  );
                });
                // if (cashMemoDetails.status === StatusTypesEnum.OPEN) {
                // this.updatePrice();
                this.summaryBarRemarks$.next(cashMemoDetails.remarks);
                if (cashMemoDetails.customerId) {
                  this.customerFacade.loadSelectedCustomer(
                    String(cashMemoDetails.customerId)
                  );
                }
                this.giftCardsFacade.setCardsTotalAmount(
                  cashMemoDetails.totalValue ? cashMemoDetails.totalValue : 0
                );
                // this.commonFacade.setTransactionTotalAmount(
                //   cashMemoDetails.totalValue
                // );
                this.commonFacade.setTransactionTotalAmount(
                  cashMemoDetails.totalValue ? cashMemoDetails.totalValue : 0
                );
                this.giftCardsFacade.setCardsTotalQty(
                  cashMemoDetails.totalQuantity
                    ? cashMemoDetails.totalQuantity
                    : 0
                );
                this.commonFacade.setGcTotalCardsQty(
                  cashMemoDetails.totalQuantity
                    ? cashMemoDetails.totalQuantity
                    : 0
                );
                // }
              } else {
                this.isOpenTask = false;
              }
            });
          this.giftCardsFacade
            .getAddedGiftCardItemResponse()
            .pipe(takeUntil(this.destroy$))
            .subscribe((giftCardItemDetail: GetGiftCardItemResponse) => {
              // this.clearAllDataObservable$ = of(false);
              if (giftCardItemDetail) {
                const giftCardGridItem: GiftCardItem = {
                  cardNo: giftCardItemDetail.instrumentNo,
                  amount: giftCardItemDetail.totalValue,
                  tax: giftCardItemDetail.totalTax,
                  finalPrice: giftCardItemDetail.finalValue,
                  bin: giftCardItemDetail.binCode,
                  itemId: giftCardItemDetail.itemId
                };
                this.clearAllDataObservable$ = of(false);
                this.giftCardObservable$ = giftCardGridItem
                  ? of([giftCardGridItem])
                  : of([]);
                const newCardDetailList = Object.assign([], this.cardsList);
                newCardDetailList.push(giftCardGridItem);
                this.cardsList = newCardDetailList;
                this.giftCardsFacade.loadCardsList(this.cardsList);
              }
            });
          this.giftCardsFacade.loadRsoDetails(this.roleCode);
          this.showSummaryBar();
          this.componentInit();
          this.cardsListObservable$ = this.giftCardsFacade.getCardsList();
          this.cardsListObservable$
            .pipe(takeUntil(this.destroy$))
            .subscribe(cardsList => {
              if (cardsList.length === 0) {
                this.paymentDetailsList = [];
                this.totalPaidAmount = 0;
                this.giftCardsFacade.setGcTotalPaidAmount(this.totalPaidAmount);
              }
              this.updatedCardsList = cardsList;
            });
          this.giftCardsFacade
            .getAddGiftCardItemResponse()
            .pipe(takeUntil(this.destroy$))
            .subscribe(response => {
              if (response) {
                this.isOpenTask = false;
                this.clearCardNumberField = false;
                const cardDetail = {
                  cardNo: this.recentlyAddedCardNumber,
                  bin: GiftCardBinEnum.QCGC,
                  amount: Number(
                    this.giftCardSaleFormGroup.get('amount').value
                  ),
                  tax: Number(this.giftCardSaleFormGroup.get('tax').value),
                  finalPrice:
                    Number(this.giftCardSaleFormGroup.get('amount').value) +
                    Number(this.giftCardSaleFormGroup.get('tax').value),
                  itemId:
                    response.giftDetailsDto && response.giftDetailsDto.itemId
                      ? response.giftDetailsDto.itemId
                      : ''
                };
                this.clearAllDataObservable$ = of(false);
                this.giftCardObservable$ = of([cardDetail]);
                const newCardDetailList = Object.assign([], this.cardsList);
                newCardDetailList.push(cardDetail);
                this.cardsList = newCardDetailList;
                this.giftCardsFacade.loadCardsList(this.cardsList);
              }
            });
          this.giftCardsFacade
            .getDeleteAddedGiftCardItemResponse()
            .pipe(takeUntil(this.destroy$))
            .subscribe(response => {
              if (response) {
                this.deleteId = this.deleteEventObj.itemId;
                if (this.cardNumbersList.includes(this.deleteEventObj.cardNo)) {
                  this.cardNumbersList = this.cardNumbersList.filter(
                    cardNumber => cardNumber !== this.deleteEventObj.cardNo
                  );
                }
                this.cardsList = this.cardsList.filter(
                  cardDetailObj =>
                    cardDetailObj.cardNo !== this.deleteEventObj.cardNo
                );
                this.giftCardsFacade.loadCardsList(this.cardsList);
                this.clearAllDataObservable$ = of(false);
                this.giftCardObservable$ = of(null);
              }
            });
          this.giftCardsFacade
            .getPartiallyUpdateGiftCardItemResponse()
            .pipe(takeUntil(this.destroy$))
            .subscribe(response => {
              if (response && this.updatedGcItem) {
                this.updateAmount = {
                  ...this.updatedGcItem
                };
                this.giftCardObservable$ = of(null);
              }
            });
          this.giftCardsFacade
            .getUpdateGcCashMemoResponse()
            .pipe(takeUntil(this.destroy$))
            .subscribe(response => {
              if (response) {
                if (response.docNo) {
                  this.cashMemoNumber = response.docNo;
                }
                this.confirmGcSale();
              }
            });

          this.giftCardsFacade
            .getGcBalance()
            .pipe(takeUntil(this.destroy$))
            .subscribe(cardBalanceDetails => {
              if (cardBalanceDetails) {
                this.showAlertNotification('Gift Card is already activated.');
              }
            });

          this.giftCardsFacade
            .getError()
            .pipe(takeUntil(this.destroy$))
            .subscribe((error: CustomErrors) => {
              if (error) {
                if (
                  error.code === ErrorEnums.ERR_INT_028 ||
                  error.code === ErrorEnums.ERR_INT_10029
                ) {
                  if (this.cashMemoId) {
                    this.addGcToOpenTransaction();
                  } else {
                    this.giftCardsFacade.createGcCashMemo();
                  }
                } else {
                  this.errorHandler(error);
                }
              }
            });

          // this.paymentFacade
          //   .getError()
          //   .pipe(takeUntil(this.destroy$))
          //   .subscribe((error: CustomErrors) => {
          //     if (error) {
          //       if (
          //         error.code === ErrorEnums.ERR_INT_027 ||
          //         error.code === ErrorEnums.ERR_INT_028
          //       ) {
          //         this.addGcToOpenTransaction();
          //       }
          //     }
          //   });
          this.giftCardsFacade
            .getPrintDataResponse()
            .pipe(
              filter(data => !!data),
              takeUntil(this.destroy$)
            )
            .subscribe(data => {
              const blob = new Blob([data], { type: 'text/html' });
              const url = window.URL.createObjectURL(blob);
              window.open(url);
            });
          this.giftCardsFacade
            .getSelectedRSONames()
            .pipe(takeUntil(this.destroy$))
            .subscribe(
              (selectedRsoName: { value: string; description: string }) => {
                this.selectedRsoName = selectedRsoName;
              }
            );
          this.paymentFacade
            .getPaymentDetails()
            .pipe(takeUntil(this.destroy$))
            .subscribe(paymentDetails => {
              this.paymentDetailsList = paymentDetails;
            });
          this.orderConfirmationFacade
            .getHasError()
            .pipe(takeUntil(this.destroy$))
            .subscribe((error: CustomErrors) => {
              if (error && error.code) {
                this.errorHandler(error);
              }
            });
          this.orderConfirmationFacade
            .confirmCashMemoResponse()
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: CashMemoDetailsResponse) => {
              this.orderNumber.emit({
                orderNo: 0,
                status: StatusTypesEnum.CONFIRMED
              });
              this.giftCardsFacade.setOrderNumber(0, StatusTypesEnum.CONFIRMED);
              this.commonFacade.setGcOrderNumber({
                orderNo: 0,
                status: StatusTypesEnum.CONFIRMED
              });
              this.loadOpenValues();
              if (response) {
                this.orderNumber.emit({
                  orderNo: 0,
                  status: StatusTypesEnum.CONFIRMED
                });
                this.giftCardsFacade.setOrderNumber(
                  0,
                  StatusTypesEnum.CONFIRMED
                );
                this.commonFacade.setGcOrderNumber({
                  orderNo: 0,
                  status: StatusTypesEnum.CONFIRMED
                });
                if (response.docNo) {
                  this.cashMemoNumber = response.docNo;
                }
                this.confirmGcSale();
                this.isOpenTask = false;
                this.isTransactionSuccess = true;
              }
            });
          this.commonFacade
            .getCommonFacadeAttributes(
              CommomStateAttributeTypeEnum.GLOBAL,
              CommomStateAttributeNameEnum.TRANSACTION_TOTAL_AMOUNT
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe(amount => {
              this.cardsTotalAmount = amount;
            });

          this.paymentFacade
            .getTotalPaidAmount()
            .pipe(takeUntil(this.destroy$))
            .subscribe(amount => {
              this.totalPaidAmountInPayment = amount;
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
                this.showAlertPopUp(
                  'pw.regularCashMemo.printingSuccessMessage'
                );
              }
            });
          this.isOrderConfirmationLoading$ = this.orderConfirmationFacade.getIsLoading();
        } else if (isGcSaleAllowed === 'false') {
          this.isGcSaleAllowed = false;
          this.openIsGcSaleAllowedAlertDialog();
        }
      });
    this.customerFacade
      .getBrandDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(brandDetail => {
        if (brandDetail) {
          this.maxAllowedAmount =
            brandDetail.panCardDetails.data.configurationAmountForGiftCard;
          this.panMandatoryForGiftCard =
            brandDetail.panCardDetails.data.isPanCardMandatoryforGiftCard;
        }
      });
  }

  openIsGcSaleAllowedAlertDialog() {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.INFO,
        message: 'pw.giftCards.gcActivationNotAllowedAlertMsg'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.router.navigate([homeUrl()]);
        } else if (res === undefined) {
          this.openIsGcSaleAllowedAlertDialog();
        }
      });
  }

  setScan(isScan: boolean) {
    this.isScan = isScan;
    this.recentlyAddedCardNumber = '';
  }

  getTranslatedAlertMessages() {
    const selectCustomerAlertMessage = 'pw.giftCards.selectCustomerAlert';
    const selectRsoNameAlertMessage = 'pw.giftCards.selectRsoNameAlert';
    const addRemarksAlertMessage = 'pw.giftCards.addRemarksAlert';
    const reversePaymentAlertMessage =
      'pw.giftCards.reversePaymentAlertMessage';
    const invalidRemarksAlertMessage =
      'pw.giftCards.invalidRemarksAlertMessage';
    const technicalIssueInTransactionIdAlertMessage =
      'pw.giftCards.technicalIssueInTransactionIdAlertMessage';
    this.translate
      .get([
        selectCustomerAlertMessage,
        selectRsoNameAlertMessage,
        addRemarksAlertMessage,
        reversePaymentAlertMessage,
        invalidRemarksAlertMessage,
        technicalIssueInTransactionIdAlertMessage
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMessages => {
        this.selectCustomerAlertMessage =
          translatedMessages[selectCustomerAlertMessage];
        this.selectRsoNameAlertMessage =
          translatedMessages[selectRsoNameAlertMessage];
        this.addRemarksAlertMessage =
          translatedMessages[addRemarksAlertMessage];
        this.reversePaymentAlertMessage =
          translatedMessages[reversePaymentAlertMessage];
        this.invalidRemarksAlertMessage =
          translatedMessages[invalidRemarksAlertMessage];
        this.technicalIssueInTransactionIdAlertMessage =
          translatedMessages[technicalIssueInTransactionIdAlertMessage];
      });
  }

  getCustomerResponse() {
    this.customerFacade
      .getSelectSelectedCustomer()
      .pipe(takeUntil(this.destroy$))
      .subscribe(customer => {
        if (customer) {
          this.customer = customer;
        }
        if (!this.isOpenTask) {
          if (customer) {
            this.customerId = customer.customerId;
            this.customer = customer;
            this.customerType = customer.customerType;
            if (this.cashMemoId) {
              let requestBody: PartiallyUpdateGcCmPayload;
              if (this.customerId) {
                requestBody = { customerId: this.customerId };
                this.setSelectedRSOName(this.selectedRsoName);
              }
              this.giftCardsFacade.partiallyUpdateGcCashMemo(
                this.cashMemoId,
                requestBody
              );
            }
            if (
              this.selectedSalesTxnId === null &&
              this.customerId !== null &&
              !this.cashMemoId
            ) {
              this.giftCardsFacade.createGcCashMemo();
            }
          } else {
            this.customerId = null;
            this.customer = null;
          }
        }
      });
  }

  getCashMemoResponse() {
    this.giftCardsFacade
      .getGcCashMemoDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data !== null) {
          this.cashMemoId = data.id;
          this.status = StatusTypesEnum.OPEN;
          this.orderNumber.emit({
            orderNo: Number(data.docNo),
            status: this.status
          });
          this.giftCardsFacade.setOrderNumber(Number(data.docNo), this.status);
          this.commonFacade.setGcOrderNumber({
            orderNo: Number(data.docNo),
            status: this.status
          });
          let requestBody: PartiallyUpdateGcCmPayload;
          this.loadOpenValues();
          if (this.customerId) {
            requestBody = { customerId: this.customerId };
            if (this.cashMemoId) {
              this.setSelectedRSOName(this.selectedRsoName);
            }
          }
          this.giftCardsFacade.partiallyUpdateGcCashMemo(
            this.cashMemoId,
            requestBody
          );
          // this.commonFacade.setTransactionTD(data.id);
          this.commonFacade.setTransactionTD(data.id);
          if (this.recentlyAddedCardNumber) {
            this.addGcToOpenTransaction();
          }
        }
      });
  }

  loadOpenValues() {
    this.toolbarFacade.loadOpenOrdersCount({
      status: StatusTypesEnum.OPEN,
      txnType: TransactionTypeEnum.CM,
      subTxnType: SubTransactionTypeEnum.GIFT_SALE
    });
    this.toolbarFacade.loadOpenOrders({
      searchValue: '',
      status: StatusTypesEnum.OPEN,
      txnType: TransactionTypeEnum.CM,
      subTxnType: SubTransactionTypeEnum.GIFT_SALE,
      pageIndex: 0,
      pageSize: 10
    });
  }

  showNotification(notificationMessage: string) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.SIMPLE,
        message: notificationMessage,
        hasClose: true,
        hasBackdrop: true
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  deleteItemFromGiftCardsList(event: GiftCardItem): void {
    // if (this.paymentDetailsList && this.paymentDetailsList.length > 0) {
    //   this.showAlertNotification(this.reversePaymentAlertMessage);
    // } else {
    this.giftCardsFacade.deleteAddedGiftCardItem(this.cashMemoId, event.itemId);
    this.deleteEventObj = event;
    //}
  }

  partiallyUpdateGiftCardItem(event: GiftCardItem): void {
    this.updatedGcItem = event;
    const requestBody: PartiallyUpdateGiftDetailsPayload = {
      finalValue: event.finalPrice,
      totalTax: event.tax,
      totalValue: event.amount
    };
    const giftCardItemId = event.itemId;
    this.giftCardsFacade.partiallyUpdateGiftCardItem(
      this.cashMemoId,
      giftCardItemId,
      requestBody
    );
  }

  getTotalGiftCardValues(event): void {
    // this.paymentFacade.clearPaymentDetails();
    this.giftCardsFacade.setCardsTotalAmount(event.cardsTotalAmount);
    // this.commonFacade.setTransactionTotalAmount(event.cardsTotalAmount);
    this.commonFacade.setTransactionTotalAmount(event.cardsTotalAmount);
    this.giftCardsFacade.setCardsTotalQty(event.cardsTotalQty);
    this.commonFacade.setGcTotalCardsQty(event.cardsTotalQty);
    this.totalAmt = event.cardsTotalAmount;
    this.recentlyAddedCardNumber = '';
    if (!this.isOpenTask) {
      this.giftCardObservable$ = of(null);
    }
    // this.giftCardObservable$ = of(null);
    this.giftCardSaleFormGroup.get('amount').reset();
    this.giftCardSaleFormGroup.updateValueAndValidity();
    this.clearCardNumberField = true;
    this.giftCardsList = event.rowData;
  }

  getCardNumber(event: { cardNumber: string; trackdata: string }) {
    this.recentlyAddedCardNumber = event.cardNumber;
    this.clearCardNumberField = false;
    if (!this.cardNumbersList.includes(event.cardNumber)) {
      this.cardNumbersList.push(event.cardNumber);
    }
  }

  addGcToOpenTransaction() {
    const requestBody: AddGiftCardItemPayload = {
      finalValue:
        Number(this.giftCardSaleFormGroup.get('amount').value) +
        Number(this.giftCardSaleFormGroup.get('tax').value),
      instrumentNo: this.recentlyAddedCardNumber,
      rowId: this.cardsList.length + 1,
      totalTax: Number(this.giftCardSaleFormGroup.get('tax').value),
      totalValue: Number(this.giftCardSaleFormGroup.get('amount').value)
    };
    this.giftCardsFacade.addGiftCardItem(this.cashMemoId, requestBody);
  }

  addGiftCard() {
    this.isScan = false;
    const cardNumbersInGiftCardsList = this.giftCardsList.map(item => {
      return item.cardNo;
    });
    if (!cardNumbersInGiftCardsList.includes(this.recentlyAddedCardNumber)) {
      // if (!this.customerId) {
      //   this.showAlertNotification(this.selectCustomerAlertMessage);
      // } else if (this.customerId && !this.cashMemoId) {
      //   this.showAlertNotification(
      //     this.technicalIssueInTransactionIdAlertMessage
      //   );
      // } else {
      const QCGCPaylaod: QCGCGetBalancePayload = {
        cardType: GiftCardTxnEnum.QC_VENDOR_CODE,
        cardNumber: this.recentlyAddedCardNumber
      };
      this.giftCardsFacade.loadGcBalance(QCGCPaylaod);
      // const requestBody: AddGiftCardItemPayload = {
      //   finalValue:
      //     Number(this.giftCardSaleFormGroup.get('amount').value) +
      //     Number(this.giftCardSaleFormGroup.get('tax').value),
      //   instrumentNo: this.recentlyAddedCardNumber,
      //   rowId: this.cardsList.length + 1,
      //   totalTax: Number(this.giftCardSaleFormGroup.get('tax').value),
      //   totalValue: Number(this.giftCardSaleFormGroup.get('amount').value)
      // };
      // this.giftCardsFacade.addGiftCardItem(this.cashMemoId, requestBody);
      // }
    } else {
      this.showAlertNotification(
        'Gift Card number you are trying to add is already added in the list. Please try with different Gift Card number.'
      );
    }
  }

  componentInit(): void {
    this.isLoading$ = this.giftCardsFacade.getIsLoading();
    this.giftCardsFacade
      .getRsoDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((rsoDetails: RsoNameObject[]) => {
        this.rsoNamesList = rsoDetails;
        // if (rsoDetails && rsoDetails.length > 0) {
        //   this.rsoNamesList = rsoDetails.map((rsoNameObj: RsoNameObject) => {
        //     return { value: rsoName, description: rsoName };
        //   });
        // } else {
        //   this.rsoNamesList = [];
        // }
      });
  }

  showSummaryBar(): void {
    this.summaryBar
      .open(SummaryBarType.GIFT_CARD, {
        type: GiftCardsTypesEnum.GIFTCARD_SALE,
        remarks: this.summaryBarRemarks$.asObservable()
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: SummaryBarEventRef) => {
        switch (event.eventType) {
          case SummaryBarEventType.CLAER: {
            if (this.paymentDetailsList.length > 0) {
              this.showAlertNotification(this.reversePaymentAlertMessage);
            } else {
              this.clearData();
              this.router.navigate([getGiftCardsSaleUrl()]);
            }
            break;
          }
          case SummaryBarEventType.CONFRIM: {
            if (!this.selectedRsoName) {
              this.showAlertNotification(this.selectRsoNameAlertMessage);
            } else if (this.customerId !== null) {
              let isFormValidated = this.validateCustomerService.validateCustomer(
                this.customer
              );
              if (isFormValidated) {
                this.onConfirmClicked(event);
              } else {
                this.customerService.open({
                  customerType: this.customerType,
                  customerId: this.customerId
                });
              }
            }
            break;
          }
        }
      });
  }

  printGcCashMemo(transactionId: string, txnType: string, subTxnType: string) {
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
            printType: printTypesEnum.GC_PRINTS,
            doctype: printDocTypeEnum.CUSTOMER_PRINT,
            transacionType: printTransactionTypesEnum.SALES,

            printFileType: printFileTypeEnum.INVOICE_PRINT,
            transacionId: transactionId,
            reprint: false,
            customerId: this.customerId,
            invoiceType: action
          });
        }
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

  onConfirmClicked(event) {
    if (
      Number(this.cardsTotalAmount) - Number(this.totalPaidAmountInPayment) !==
      0
    ) {
      this.showAlertNotification('Please Make the correct payment.');
    } else if (
      this.totalPaidAmountInPayment > this.maxAllowedAmount &&
      this.panMandatoryForGiftCard &&
      !this.isProfileMatched
    ) {
      this.showPanFormVerifyPopup();
    } else {
      const orderDetails: UpdateOrderDetails = {
        cashMemoId: this.cashMemoId,
        orderDetails: {
          customerId: Number(this.customerId),
          finalValue: Number(this.totalAmt),
          paidValue: Number(this.paidValue),
          remarks: event.remarks ? event.remarks : null,
          totalTax: 0,
          totalValue: this.totalAmt,
          totalDiscount: 0,
          totalQuantity: this.cardsList.length,
          totalWeight: 0,
          hallmarkCharges: 0,
          hallmarkDiscount: 0
        },
        status: StatusTypesEnum.CONFIRMED,
        transactionType: TransactionTypeEnum.CM,
        subTransactionType: SubTransactionTypeEnum.GIFT_SALE
      };
      const msg = this.orderService.confirmOrder(
        orderDetails,
        this.paymentDetailsList,
        TransactionTypeEnum.CM
      );
      if (msg) {
        this.errorNotifications(msg);
      }
    }
  }

  showPanFormVerifyPopup() {
    this.panFormVerifyPopupService
      .open({
        type: AlertPopupTypeEnum.INFO,
        id: this.cashMemoId,
        customerId: Number(this.customerId),
        customerType: this.customerType,
        txnType: TransactionTypeEnum.CM
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((dailogResponse: boolean) => {
        this.isProfileMatched = dailogResponse;
      });
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

  confirmGcSale(): void {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.CUSTOM,
        hasBackdrop: true,
        hasClose: true,
        template: this.gcSaleSuccessNotificationTemplate
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        if (event.eventType === OverlayNotificationEventType.CLOSE) {
          this.clearData();
          this.router.navigate([getGiftCardsSaleUrl()]);
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
      .subscribe();
  }

  clearData() {
    this.isTransactionSuccess = false;
    this.isProfileMatched = false;
    // this.commonFacade.clearTransactionTD();
    this.commonFacade.clearTransactionTD();
    this.clearSelectedRsoName = true;
    this.cardsList = [];
    // this.commonFacade.setTransactionTotalAmount(0);
    this.commonFacade.setTransactionTotalAmount(0);
    this.commonFacade.setGcTotalCardsQty(0);
    this.giftCardsFacade.setRemarks('');
    this.giftCardsFacade.resetGiftCardsData();
    this.giftCardsFacade.loadRsoDetails(this.roleCode);
    this.selectedRso = null;
    this.customerFacade.clearSelectedCustomer();
    this.clearAllDataObservable$ = of(true);
    this.giftCardObservable$ = of(null);
    this.totalAmt = 0;
    // this.paymentFacade.resetPayment();
    this.summaryBarRemarks$.next('');
    this.printingService.resetPrint();
    this.orderConfirmationFacade.resetValues();
    this.giftCardsFacade.clearGcBalance();
    this.clearCardNumberField = true;
    this.giftCardSaleFormGroup.reset();
    this.giftCardSaleFormGroup.updateValueAndValidity();
    this.commonFacade.setGcOrderNumber({
      orderNo: 0,
      status: null
    });
  }

  changeScanCheckboxState(event: boolean) {
    // this.isScan = event;
  }

  setSelectedRSOName(event: { value: string; description: string }): void {
    if (this.cashMemoId) {
      if (event && event.value) {
        const requestPayload: PartiallyUpdateGcCmPayload = {
          employeeCode: event.value
        };
        this.giftCardsFacade.partiallyUpdateGcCashMemo(
          this.cashMemoId,
          requestPayload
        );
      }
      this.clearSelectedRsoName = false;
    }
    this.giftCardsFacade.loadSelectedRSOName(event);
    this.commonFacade.setGCSelectedRsoName(event);
  }

  /**
   * to display error message
   * @param error : error from api
   */
  errorHandler(error: CustomErrors) {
    if (error.code === ErrorEnums.ERR_QZ_TRAY) {
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
          hasClose: true, // optional
          error: error,
          hasBackdrop: true
        })
        .events.pipe(takeUntil(this.destroy$))
        .subscribe((event: OverlayNotificationEventRef) => {
          if (this.isTransactionSuccess) {
            this.confirmGcSale();
          }
        });
    }
  }

  printError(message: string) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.TIMER,
        message: message,
        hasClose: false
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        this.confirmGcSale();
      });
  }

  printGiftCardCashMemo() {
    this.giftCardsFacade.printGcCashMemo();
  }

  getRsoObjFromCode(code: string) {
    let selectedRso: RsoNameObject = {
      value: '',
      description: ''
    };
    if (this.rsoNamesList.length > 0) {
      const rsoList = this.rsoNamesList.filter((rsoNameObj: RsoNameObject) => {
        return code === rsoNameObj.value;
      });
      if (rsoList.length > 0) {
        selectedRso = rsoList[0];
      }
    }
    return selectedRso;
  }

  ngOnDestroy() {
    this.orderNumber.emit({
      orderNo: 0,
      status: StatusTypesEnum.SUSPENDED
    });
    this.giftCardsFacade.setOrderNumber(0, StatusTypesEnum.SUSPENDED);
    this.commonFacade.setGcOrderNumber({
      orderNo: 0,
      status: StatusTypesEnum.SUSPENDED
    });
    this.isOpenTask = false;
    this.printingService.resetPrint();
    this.clearData();
    this.summaryBar.close();
    this.overlayNotification.close();
    this.destroy$.next();
    this.destroy$.complete();
    this.orderConfirmationFacade.resetValues();
    this.customerFacade.clearCustomerSearch();
    // this.commonFacade.clearTransactionConfig();
    this.commonFacade.clearTransactionConfig();
    this.toolbarFacade.resetValues();
    this.toolbarFacade.setToolbarConfig({
      loadMetalPrices: true,
      loadHoldPopup: false,
      loadOpenOrdersPopup: false
    });
  }
}
