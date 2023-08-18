import { ActivatedRoute, Router } from '@angular/router';
import {
  BcTypesEnum,
  CancelResponse,
  CashMemoDetailsResponse,
  ConfirmResponse,
  CustomErrors,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  SetTotalProductValuesPayload,
  SummaryBarServiceAbstraction,
  TransactionTypeEnum,
  SubTransactionTypeEnum,
  CashMemoItemDetails,
  LocationSettingAttributesEnum,
  CommomStateAttributeTypeEnum,
  CashMemoItemDetailsResponse,
  PrintingServiceAbstraction,
  printTransactionTypesEnum,
  printTypesEnum,
  printFileTypeEnum,
  printDocTypeEnum,
  SummaryBarType,
  SummaryBarEventRef,
  SummaryBarEventType,
  CommomStateAttributeNameEnum,
  AddFocToCmResponsePayload,
  InvoiceDeliveryTypes,
  RsoDetailsPayload,
  PostTransactionConfirmationActionsServiceAbstraction,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum
} from '@poss-web/shared/models';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { FocFacade } from '@poss-web/poss/foc/data-access-foc';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import { take, takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { BillCancelFacade } from '@poss-web/poss/bc/data-access-bc';
import {
  BcCmRouteTypesEnum,
  getBillCancelRouteUrl
} from '@poss-web/shared/util-site-routes';
import * as moment from 'moment';
import { Moment } from 'moment';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import { POSS_WEB_COIN_PRODUCT_GROUP_CODE } from '@poss-web/shared/util-config';
import { CurrencyFormatterService } from '@poss-web/shared/components/ui-formatters';
import { ProductFacade } from '@poss-web/poss/shared/product/data-access-product';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { PaymentFacade } from '@poss-web/shared/payment/data-access-payment';
import { MatDialog } from '@angular/material/dialog';
import { BcCnSelectionPopupComponent } from 'libs/poss/bc/ui-bc-history/src/lib/bc-cn-selection-popup/bc-cn-selection-popup.component';
const RSOCode = 'RSO';

@Component({
  selector: 'poss-web-history-details',
  templateUrl: './history-details.component.html'
})
export class HistoryDetailsComponent implements OnInit, OnDestroy {
  focItems$: Observable<AddFocToCmResponsePayload[]>;
  manualFocItems$: Observable<AddFocToCmResponsePayload[]>;
  destroy$: Subject<null> = new Subject<null>();
  isLoading$: Observable<boolean>;
  @ViewChild('confirmSuccessNotificationTemplate1', { static: true })
  confirmSuccessNotificationTemplate1: TemplateRef<any>;
  @ViewChild('confirmSuccessNotificationTemplate2', { static: true })
  confirmSuccessNotificationTemplate2: TemplateRef<any>;
  cashMemoId: string;
  viewCashMemo: Observable<CashMemoDetailsResponse>;
  productDetails$: Observable<CashMemoItemDetails[]>;
  cashMemoHistoryProductGrid$: Observable<
    (AddFocToCmResponsePayload | CashMemoItemDetails)[]
  >;
  employeeCode = null;
  reasonForCancellation = null;
  srcDocNo: string;
  cnNos = [];
  printErrorText: string;
  reqStatus: BcTypesEnum;
  cmData$: Observable<CashMemoDetailsResponse>;

  BcTypesEnumRef = BcTypesEnum;
  summaryBarRemarks$ = new Subject<string>();
  imageUrlData$: Subject<{}> = new Subject<{}>();
  txnType: TransactionTypeEnum = TransactionTypeEnum.CM;
  subTxnType: SubTransactionTypeEnum;
  id: string;
  pgDesc$: Observable<{}>;
  configHours: number;
  isApproval: boolean;
  txnTime: Moment;
  BcCmRouteTypesEnumRef = BcCmRouteTypesEnum;
  productQty = 0;
  productWeight = 0;
  productDisc = 0;
  productAmt = 0;
  coinQty = 0;
  coinWeight = 0;
  coinDisc = 0;
  coinAmt = 0;
  taxAmt = 0;
  totalAmt = 0;
  finalAmt = 0;
  roundOff = 0;
  hallmarkCharges = 0;
  hallmarkDiscount = 0;
  cashMemoData: CashMemoDetailsResponse;
  isLegacy = false;
  currencyCode: string;
  cancelType: string[];
  selectedItemsDetails: CashMemoItemDetailsResponse[] = [];
  tcsCollectedAmount: number;
  rsoDetails$: Observable<RsoDetailsPayload[]>;
  cnDetails$: Observable<any>;
  cnid: any;
  printCnItems: any;
  printAction: string;
  isCnPrint = false;
  cancelId: number;
  isCommonLoading$: Observable<boolean>;
  customerId: number;
  CNToBePrinted = [];
  constructor(
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private summaryBar: SummaryBarServiceAbstraction,
    private translate: TranslateService,
    private router: Router,
    private customerFacade: CustomerFacade,
    private commonFacade: CommonFacade,
    private facade: BillCancelFacade,
    private activatedRoute: ActivatedRoute,
    private locationSettingsFacade: LocationSettingsFacade,
    @Inject(POSS_WEB_COIN_PRODUCT_GROUP_CODE)
    public coinCode: string,
    private currencyFormatterService: CurrencyFormatterService,
    private productFacade: ProductFacade,
    private printingService: PrintingServiceAbstraction,
    private focFacade: FocFacade,
    private postConfirmationActions: PostTransactionConfirmationActionsServiceAbstraction,
    private alertPopupService: AlertPopupServiceAbstraction,
    public paymentFacade: PaymentFacade,
    private dialog: MatDialog
  ) {
    (this.subTxnType = this.activatedRoute.snapshot.params['_subTxnType']),
      (this.id = this.activatedRoute.snapshot.params['_id']);

    this.translate
      .get(['pw.otherReceiptsIssues.printError'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.printErrorText =
          translatedMessages['pw.otherReceiptsIssues.printError'];
      });
  }

  ngOnInit(): void {
    this.productFacade.resetValues();
    this.customerFacade.clearSelectedCustomer();
    this.commonFacade.clearCashMemo();
    this.facade.resetDetail();
    this.focFacade.resetFOCData();
    this.focItems$ = this.focFacade.getFocListAddedToCM();
    this.manualFocItems$ = this.focFacade.getManualFocListAddedToCM();
    this.overlayNotification.close();
    this.commonFacade.loadBillCancellationPgDesc();
    this.viewCashMemo = this.facade.getViewCashMemoResponse();
    this.componentInit();
    this.commonFacade.loadABPgDesc();
    this.productFacade.loadRSODetails(RSOCode);
    // this.paymentFacade
    //   .getCNDetails()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((data: any) => {
    //     //this.cnid= data;
    //     this.printCnItems = data[0]?.id;
    //     console.log(this.printCnItems, 'cn');
    //   });
    this.productFacade
      .getItemDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((item: CashMemoItemDetailsResponse[]) => {
        this.selectedItemsDetails = item;
      });

    this.focFacade.getFocAssignedToCM({
      id: this.id,
      txnType: TransactionTypeEnum.CM,
      subTxnType: this.subTxnType
    });
    this.focFacade.getManualFocAssignedToCM({
      id: this.id,
      txnType: TransactionTypeEnum.CM,
      subTxnType: this.subTxnType
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
          if (this.isCnPrint) {
            this.CNToBePrinted.shift();
          }
          if (this.CNToBePrinted.length > 0) {
            this.isCnPrint = true;
            this.printData(this.printAction, this.CNToBePrinted[0]);
          } else {
            this.isCnPrint = false;
            this.showAlertPopUp('pw.regularCashMemo.printingSuccessMessage');
          }
        }
      });

    this.showSummaryBar();

    combineLatest([
      this.productDetails$,
      this.focItems$,
      this.viewCashMemo,
      this.manualFocItems$
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(results => {
        if (results[1]) {
          this.commonFacade.setFocItems(results[1]);
        }

        if (results[3]) {
          this.commonFacade.setManualFocItems(results[3]);
        }

        if (results[2]) {
          this.finalAmt = results[2].finalValue;
          this.taxAmt = results[2].totalTax;
          this.roundOff = results[2].roundingVariance;
          this.totalAmt = results[2]?.totalValue;
          this.customerId = results[2]?.customerId;
          this.printCnItems = results[2]?.cnDocNoList;
          debugger;
          this.customerFacade.loadSelectedCustomer(
            String(results[2].customerId),
            false,
            false
          );
          this.loadItemsInCashMemo(results[2]);
        }

        if (results[0]?.length) {
          this.getTotalProductValues(results[0]);
        }
        this.cashMemoHistoryProductGrid$ = of([
          ...results[0],
          ...results[1],
          ...results[3]
        ]);
      });

    this.rsoDetails$ = this.productFacade.getRSODetails();
  }

  componentInit(): void {
    if (this.id && this.subTxnType) {
      this.commonFacade.setTransactionConfig({
        isPaymentEditable: false,
        showRemainingAmount: false,
        isCnViewAllowedBC: true,
        transactionType: {
          type: this.txnType,
          subType: this.subTxnType
        }
      });
      this.commonFacade.setTransactionTD(this.id);
      this.facade.loadCancelType({
        refTxnId: this.id,
        subTxnType: BcTypesEnum.CASH_MEMO,
        txnType: BcTypesEnum.CM_CAN
      });

      this.facade.viewCashMemo({
        id: this.id,
        txnType: this.txnType,
        subTxnType: this.subTxnType
      });

      this.cashMemoId = this.id;
    }

    this.facade
      .hasError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.errorHandler(data);
        }
      });
    this.isLoading$ = this.facade.getisLoading();
    this.productDetails$ = this.facade.getItemDetails();
    this.cmData$ = this.facade.getViewCashMemoResponse();
    this.pgDesc$ = this.commonFacade.getCommonFacadeAttributes(
      CommomStateAttributeTypeEnum.BILL_CANCELLATION,
      CommomStateAttributeNameEnum.PRODUCT_GROUP_DESC
    );
    this.printingService

      .getPrintError()

      .pipe(takeUntil(this.destroy$))

      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.facade
      .getCancelRequest()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: CancelResponse) => {
        if (data) {
          if (data.cndocNos !== null && data.cndocNos.length !== 0) {
            this.cnNos = data.cndocNos;
          }
          this.srcDocNo = String(data.docNo);
          this.showCancelNotification(this.srcDocNo);
        }
      });

    this.facade
      .getConfirmRequest()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: ConfirmResponse) => {
        if (data) {
          this.srcDocNo = data.requestNo;
          this.showConfirmNotification(this.srcDocNo);
        }
      });

    this.facade
      .getViewCashMemoResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: CashMemoDetailsResponse) => {
        if (data) {
          if (data?.txnSource === 'LEGACY') {
            this.isLegacy = true;
          }
          this.cashMemoData = data;
          this.commonFacade.setTransactionTotalAmount(data.finalValue);
          this.commonFacade.setCMOtherCharges(data.otherChargesList);
          this.commonFacade.setTransactionTD(data.id);
          this.customerId = data.customerId;
          this.customerFacade.loadSelectedCustomer(
            String(data.customerId),
            false,
            false
          );
          this.txnTime = data.txnTime;
          this.cancelId = data.cancelTxnId;
          this.tcsCollectedAmount = data.tcsCollectedAmount;
          this.commonFacade.setTcsCollectedAmount(this.tcsCollectedAmount);
          let isApprovalRequired: boolean;
          if (this.isApproval) {
            const totalHours = moment().diff(this.txnTime, 'hours');
            if (totalHours < this.configHours) {
              isApprovalRequired = false;
            } else {
              isApprovalRequired = true;
            }
          } else {
            isApprovalRequired = false;
          }
          this.showSummaryBar();
          this.loadItemsInCashMemo(data);
        }
      });

    this.facade.getReasons().pipe(takeUntil(this.destroy$)).subscribe();

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.BILL_CANCELLATION,
        CommomStateAttributeNameEnum.IMAGE_URL_DATA
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: {}) => {
        console.log(data, 'image data');
        if (data !== null) {
          this.imageUrlData$.next(data);
        }
      });

    this.isCommonLoading$ = this.commonFacade.getCommonFacadeAttributes(
      CommomStateAttributeTypeEnum.BILL_CANCELLATION,
      CommomStateAttributeNameEnum.LOADING
    );

    this.facade
      .getCancelType()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => (this.cancelType = data));

    combineLatest([
      this.locationSettingsFacade
        .getLocationSetting(
          LocationSettingAttributesEnum.CM_MAX_HOURS_FOR_BILL_CANCEL
        )
        .pipe(takeUntil(this.destroy$)),
      this.locationSettingsFacade
        .getLocationSetting(
          LocationSettingAttributesEnum.CM_IS_BILL_CANCEL_APPROVAL_REQUIRED
        )
        .pipe(takeUntil(this.destroy$))
    ]).subscribe(([val1, val2]) => {
      if (!!val1 && !!val2) {
        this.configHours = JSON.parse(val1);
        this.isApproval = JSON.parse(val2);
        let isApprovalRequired: boolean;
        if (this.isApproval) {
          const totalHours = moment().diff(this.txnTime, 'hours');
          if (totalHours < this.configHours) {
            isApprovalRequired = false;
          } else {
            isApprovalRequired = true;
          }
        } else {
          isApprovalRequired = false;
        }
        this.showSummaryBar();
      }
    });

    this.facade
      .getItemDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: CashMemoItemDetails[]) => {
        this.getTotalProductValues(data);
      });
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
        this.showConfirmNotification(this.srcDocNo);
      });
  }
  loadItemsInCashMemo(data: CashMemoDetailsResponse) {
    data.itemIdList.forEach(element => {
      this.facade.getItemFromCashMemo({
        id: this.cashMemoId,
        itemId: element,
        txnType: data.txnType,
        subTxnType: data.subTxnType
      });

      this.productFacade.getItemFromCashMemo({
        id: this.cashMemoId,
        itemId: element,
        headerData: this.cashMemoData,
        txnType: this.txnType,
        subTxnType: this.subTxnType
      });
    });
  }

  showConfirmNotification(srcDocNo: string): void {
    const key = 'pw.bc.requestNoMsg';
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.CUSTOM,
            message: translatedMessage + srcDocNo,
            hasBackdrop: true,
            hasClose: true,
            template: this.confirmSuccessNotificationTemplate2
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            if (event.eventType === OverlayNotificationEventType.CLOSE) {
              this.back();
            }
          });
      });
  }

  showCancelNotification(srcDocNo: string): void {
    const key = 'pw.bc.requestNoMsg';
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.CUSTOM,
            message: translatedMessage + srcDocNo,
            hasBackdrop: true,
            hasClose: true,
            template: this.confirmSuccessNotificationTemplate1
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            if (event.eventType === OverlayNotificationEventType.CLOSE) {
              this.back();
            }
          });
      });
  }
  showSummaryBar(): void {
    this.summaryBar
      .open(SummaryBarType.BC_HISTORY, {})
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: SummaryBarEventRef) => {
        switch (event.eventType) {
          case SummaryBarEventType.PRINT: {
            this.print();
          }
        }
      });
  }
  print() {
    if (this.printCnItems) {
      const dialogRef = this.dialog.open(BcCnSelectionPopupComponent, {
        height: 'auto',
        width: '500px',
        autoFocus: false,
        data: {
          items: this.printCnItems
        }
      });
      dialogRef.componentInstance.printCN
        .pipe(takeUntil(this.destroy$))
        .subscribe(items => {
          this.CNToBePrinted = items;
          this.isCnPrint = true;
          this.printData(InvoiceDeliveryTypes.PRINT, this.CNToBePrinted[0]);
        });
    } else {
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
              printType: 'CM_CANCELLATION',
              doctype: printDocTypeEnum.CUSTOMER_PRINT,
              transacionType: printTransactionTypesEnum.SALES,
              printFileType: printFileTypeEnum.INVOICE_PRINT,
              transacionId: this.cancelId,
              productCode: null,
              reprint: true,
              customerId: this.customerId,
              invoiceType: action
            });
          }
        });
    }

    // this.postConfirmationActions
    //   .open()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(res => {
    //     if (res) {
    //       let action = '';
    //       switch (res) {
    //         case 'print': {
    //           action = InvoiceDeliveryTypes.PRINT;
    //           break;
    //         }
    //         case 'mail': {
    //           action = InvoiceDeliveryTypes.MAIL;
    //           break;
    //         }
    //         case 'both': {
    //           action = InvoiceDeliveryTypes.BOTH;
    //           break;
    //         }
    //       }

    //       this.printData(
    //         action,
    //         this.printCnItems && this.printCnItems.length > 0
    //           ? this.printCnItems[0]
    //           : null
    //       );
    //     }
    //   });
  }

  printData(action: string, cnid: string[]) {
    this.printAction = action;
    this.isCnPrint = true;
    this.printingService.loadPrintData({
      printType: printTypesEnum.BILL_CANCELLATION,
      doctype: printDocTypeEnum.CUSTOMER_PRINT,
      transacionType: printTransactionTypesEnum.SALES,
      printFileType: printFileTypeEnum.INVOICE_PRINT,
      transacionId: this.cancelId,
      productCode: cnid,
      reprint: true,
      customerId: this.customerId,
      invoiceType: action
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
  errorHandler(error: CustomErrors) {
    if (error.code === ErrorEnums.ERR_QZ_TRAY) {
      this.printError();
    }
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true, // optional
        error: error
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  back() {
    this.router.navigate([getBillCancelRouteUrl()], {
      state: { clearFilter: false }
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

  loadImageUrl(event: string) {
    this.commonFacade.loadBillCancellationImageUrl(event);
  }

  getTotalProductValues(event: CashMemoItemDetails[]) {
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
      this.taxAmt = this.cashMemoData?.totalTax;
      this.finalAmt = this.cashMemoData?.finalValue;
      this.totalAmt = this.cashMemoData?.totalValue;
      this.roundOff = this.cashMemoData?.roundingVariance;
      this.hallmarkCharges = this.cashMemoData?.hallmarkCharges;
      this.hallmarkDiscount = this.cashMemoData?.hallmarkDiscount;
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
    this.commonFacade.setBillCancellationTotalProductValues(totalValues);
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
    this.destroy$.next();
    this.summaryBar.close();
    this.destroy$.complete();
    this.summaryBarRemarks$.next('');
    this.cnNos = [];
    this.focFacade.resetFOCData();
    this.commonFacade.clearTcsCollectedAmount();
    this.printingService.resetPrint();
    this.commonFacade.setCMOtherCharges(null);
  }
}
