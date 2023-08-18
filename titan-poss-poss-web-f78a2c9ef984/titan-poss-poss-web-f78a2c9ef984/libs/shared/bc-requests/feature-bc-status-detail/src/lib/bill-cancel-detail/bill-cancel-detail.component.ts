import { ActivatedRoute, Router } from '@angular/router';
import {
  AddFocToCmResponsePayload,
  CashMemoDetailsResponse,
  CashMemoItemDetails,
  CashMemoItemDetailsResponse,
  CommomStateAttributeNameEnum,
  CommomStateAttributeTypeEnum,
  CustomErrors,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  RsoDetailsPayload,
  SetTotalProductValuesPayload,
  SummaryBarEventRef,
  SummaryBarEventType,
  SummaryBarServiceAbstraction,
  SummaryBarType,
  TransactionTypeEnum,
  printDocTypeEnum,
  printTransactionTypesEnum,
  printFileTypeEnum,
  PrintingServiceAbstraction,
  InvoiceDeliveryTypes,
  BcTypesEnum,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  PostTransactionConfirmationActionsServiceAbstraction,
  PaymentDetails,
  PaymentModeEnum,
  SharedBodEodFeatureServiceAbstraction,
  UniPayRequest,
  UnipayTransactionType,
  UnipayTransactionMode
} from '@poss-web/shared/models';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { commonTranslateKeyMap } from '@poss-web/shared/util-adaptors';
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
import { BillCancellationRequestsFacade } from '@poss-web/shared/bc-requests/data-access-bc';
import {
  BcCmRouteTypesEnum,
  getCMBillCancelRequestsRouteUrl
} from '@poss-web/shared/util-site-routes';
import { POSS_WEB_COIN_PRODUCT_GROUP_CODE } from '@poss-web/shared/util-config';
import { ProductFacade } from '@poss-web/poss/shared/product/data-access-product';
import { FocFacade } from '@poss-web/poss/foc/data-access-foc';
import { ErrorEnums } from '@poss-web/shared/util-error';
import * as moment from 'moment';
import { PaymentFacade } from '@poss-web/shared/payment/data-access-payment';
import { MatDialog } from '@angular/material/dialog';
import { CurrencyFormatterService } from '@poss-web/shared/components/ui-formatters';

const RSOCode = 'RSO';

@Component({
  selector: 'poss-web-bill-cancel-detail',
  templateUrl: './bill-cancel-detail.component.html',
  styleUrls: ['./bill-cancel-detail.component.scss']
})
export class BillCancelDetailComponent implements OnInit, OnDestroy {
  destroy$: Subject<null> = new Subject<null>();
  hasNotification = true;
  isLoading$: Observable<boolean>;
  @ViewChild('deleteSuccessNotificationTemplate', { static: true })
  confirmSuccessNotificationTemplate: TemplateRef<any>;
  cashMemoId: string;
  id: string;
  paymentDetails$: Observable<any>;
  productDetails$: Observable<any>;
  selectedData: Observable<any>;
  status: string;
  statusColor: string;
  printErrorText: string;
  employeeCode: string;
  reasonForCancellation: any;
  srcDocNo = null;
  reqStatus: string;
  cnNo = [];
  cancelType: string[];
  summaryBarRemarks$ = new Subject<string>();
  pgDesc$: Observable<{}>;
  imageUrlData$: Subject<any> = new Subject<any>();
  subTxnType: any;
  approval: any;
  processId: any;
  subType: string;
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
  selectedItemsDetails: CashMemoItemDetailsResponse[] = [];
  rsoDetails$: Observable<RsoDetailsPayload[]>;
  focItems$: Observable<AddFocToCmResponsePayload[]>;
  manualFocItems$: Observable<AddFocToCmResponsePayload[]>;
  cashMemoHistoryProductGrid$: Observable<
    (AddFocToCmResponsePayload | CashMemoItemDetails)[]
  >;
  viewCashMemo$: Observable<CashMemoDetailsResponse>;
  approvalStatus: string;
  tcsCollectedAmount: number;
  tcsCnAmount: number;
  tcsCnDocNo: any;
  requestorRemarks = null;
  cancellationType: any;
  docID: string;
  cndoc: string;
  isCommonLoading$: Observable<boolean>;
  customerId: number;
  paymentDetails: PaymentDetails[] = [];
  bussinessDay: number;
  enteredRemarks: string;
  totalVoidRequests = 0;
  noOfVoidRequestsCompleted = 0;
  successRequests = [];
  failureRequests = [];
  isPaymentLoading$: Observable<boolean>;
  unipayDetailsMsg: string;
  unipayPaymentDetails: PaymentDetails[] = [];
  voidUnipayIndex = -1;
  unipayVoidFailedMsg: string;
  voidLabel: string;
  timeDelayLoader = false;

  constructor(
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private summaryBar: SummaryBarServiceAbstraction,
    private translate: TranslateService,
    private router: Router,
    private customerFacade: CustomerFacade,
    private commonFacade: CommonFacade,
    private activatedRoute: ActivatedRoute,
    public paymentFacade: PaymentFacade,
    private facade: BillCancellationRequestsFacade,
    @Inject(POSS_WEB_COIN_PRODUCT_GROUP_CODE)
    public coinCode: string,
    private productFacade: ProductFacade,
    private focFacade: FocFacade,
    public printingService: PrintingServiceAbstraction,
    private postConfirmationActions: PostTransactionConfirmationActionsServiceAbstraction,
    private alertPopupService: AlertPopupServiceAbstraction,
    private bodEodFeatureService: SharedBodEodFeatureServiceAbstraction,
    private currencyFormatterService: CurrencyFormatterService
  ) {
    this.subTxnType = this.BcCmRouteTypesEnumRef[
      `${this.activatedRoute.snapshot.params['type']}`
    ];
    this.id = this.activatedRoute.snapshot.params['_id'];
    this.processId = this.activatedRoute.snapshot.params['_processId'];

    this.translate
      .get([
        'pw.otherReceiptsIssues.printError',
        'pw.bc.unipayDetailsMsg',
        'pw.bc.unipayVoidFailedMsg',
        'pw.bc.voidLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.printErrorText =
          translatedMessages['pw.otherReceiptsIssues.printError'];
        this.unipayDetailsMsg = translatedMessages['pw.bc.unipayDetailsMsg'];
        this.unipayVoidFailedMsg =
          translatedMessages['pw.bc.unipayVoidFailedMsg'];
        this.voidLabel = translatedMessages['pw.bc.voidLabel'];
      });
  }

  ngOnInit(): void {
    this.productFacade.resetValues();
    this.customerFacade.clearSelectedCustomer();
    this.commonFacade.clearCashMemo();
    this.focFacade.resetFOCData();

    this.overlayNotification.close();
    this.summaryBar.close();
    this.facade.resetDetail();

    if (this.subTxnType && this.id) {
      this.facade.viewCashMemo({
        id: this.id,
        txnType: 'CM',
        subTxnType: this.subTxnType
      });
      this.cashMemoId = this.id;

      this.facade.loadCancelType({
        refTxnId: this.id,
        subTxnType: 'CASH_MEMO',
        txnType: 'CMCAN'
      });

      this.commonFacade.setTransactionConfig({
        isPaymentEditable: false,
        transactionType: {
          type: TransactionTypeEnum.CM,
          subType: this.subTxnType
        }
      });
      this.commonFacade.setTransactionTD(this.id);
    }
    this.facade.loadSelectedData({
      workflowType: 'BILL_CANCELLATION',
      processId: this.processId
    });
    this.rsoDetails$ = this.productFacade.getRSODetails();
    this.focItems$ = this.focFacade.getFocListAddedToCM();
    this.manualFocItems$ = this.focFacade.getManualFocListAddedToCM();
    this.viewCashMemo$ = this.facade.getViewCashMemoResponse();
    this.productDetails$ = this.facade.getItemDetails();
    this.facade
      .getCancelType()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.cancelType = data;
        if (data && data.length) {
          this.showSummaryBar(this.approvalStatus);
        }
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
          this.showAlertPopUp('pw.regularCashMemo.printingSuccessMessage');
        }
      });
    combineLatest([
      this.productDetails$,
      this.focItems$,
      this.viewCashMemo$,
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
          this.customerId = results[2].customerId;
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

    this.componentInit();
  }
  componentInit(): void {
    this.productFacade.loadRSODetails(RSOCode);
    this.commonFacade.loadBillCancellationPgDesc();

    this.facade
      .hasError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data && this.successRequests.length === 0) {
          this.errorHandler(data);
        }
      });

    this.isLoading$ = this.facade.getisLoading();
    this.isPaymentLoading$ = this.paymentFacade.getIsLoading();
    this.selectedData = this.facade.getSelectedData();
    this.facade
      .getSelectedData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.getStatus(data.approvalStatus);
          this.reasonForCancellation =
            data?.headerData?.data?.reasonForCancellation;
          this.id = data.headerData.data.id;
          this.approvalStatus = data.approvalStatus;
          this.requestorRemarks = data.requestorRemarks;
          this.showSummaryBar(data.approvalStatus);
        }
      });
    this.facade
      .getDeleteRequest()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.reqStatus = 'cancelled';
          this.showNotification(this.srcDocNo);
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
    this.facade
      .getCancelRequest()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          if (data.cndocNos !== null) {
            this.cnNo = data?.cndocTypes['BILL_CANCELATION'];
          }
          this.tcsCnDocNo = data?.cndocTypes['TCS_CREDIT_NOTE'];
          this.tcsCnAmount = data.tcsCnAmt;
          this.docID = String(data.id).toUpperCase();
          this.cndoc = Object.keys(data.cndocNos).length
            ? Object.keys(data.cndocNos)[0].toUpperCase()
            : null;
          this.showNotification(this.srcDocNo);
        }
      });
    this.facade
      .getConfirmRequest()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.reqStatus = 'requested again';
          this.srcDocNo = data.requestNo;
          this.showNotification(this.srcDocNo);
        }
      });
    this.viewCashMemo$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: CashMemoDetailsResponse) => {
        if (data) {
          this.commonFacade.setTransactionTotalAmount(data.finalValue);
          this.commonFacade.setCMOtherCharges(data.otherChargesList);
          this.cashMemoData = data;
          this.commonFacade.setTransactionTD(data.id);
          this.srcDocNo = data.docNo;
          this.cashMemoId = data.id;

          console.log('status:', data);
          this.customerId = data.customerId;
          this.customerFacade.loadSelectedCustomer(
            String(data.customerId),
            false,
            false
          );
          this.employeeCode = data.employeeCode;
          this.tcsCollectedAmount = data.tcsCollectedAmount;
          this.commonFacade.setTcsCollectedAmount(this.tcsCollectedAmount);
          this.loadItemsInCashMemo(data);
        }
      });

    this.pgDesc$ = this.commonFacade.getCommonFacadeAttributes(
      CommomStateAttributeTypeEnum.BILL_CANCELLATION,
      CommomStateAttributeNameEnum.PRODUCT_GROUP_DESC
    );
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.BILL_CANCELLATION,
        CommomStateAttributeNameEnum.IMAGE_URL_DATA
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: string) => {
        if (data !== null) {
          this.imageUrlData$.next(data);
        }
      });
    this.isCommonLoading$ = this.commonFacade.getCommonFacadeAttributes(
      CommomStateAttributeTypeEnum.BILL_CANCELLATION,
      CommomStateAttributeNameEnum.LOADING
    );

    this.productDetails$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: CashMemoItemDetails[]) => {
        this.getTotalProductValues(data);
      });

    this.productFacade
      .getItemDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((item: CashMemoItemDetailsResponse[]) => {
        this.selectedItemsDetails = item;
      });

    this.paymentFacade
      .getPaymentDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(paymentDetails => {
        this.paymentDetails = paymentDetails;
      });

    this.bodEodFeatureService
      .getBusinessDayDate()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.bussinessDay = data;
        }
      });

    this.paymentFacade
      .getUnipayVoidResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data) {
          if (data?.res?.response?.ResponseCode === 0) {
            if (
              this.failureRequests.some(
                ele => ele.paymentId === data?.res?.response?.paymentId
              )
            ) {
              const index = this.failureRequests.indexOf(data);
              if (index > -1) {
                this.failureRequests.splice(index, 1);
              }
            }
            this.successRequests.push(data);
            this.voidUnipaySuccessNotification('pw.bc.unipayVoidSuccessMsg');
            this.noOfVoidRequestsCompleted++;
            this.voidUnipayIndex++;

            if (this.totalVoidRequests !== this.noOfVoidRequestsCompleted) {
              // 20 sec delay before api call
              this.timeDelayLoader = true;
              setTimeout(() => {
                this.timeDelayLoader = false;
                this.voidUnipayPayment(
                  this.unipayPaymentDetails[this.voidUnipayIndex]
                );
              }, 10000);
            }
          } else {
            if (
              !this.failureRequests.some(
                ele => ele.paymentId === data.paymentId
              )
            ) {
              this.failureRequests.push(data);
            }
            this.showAlertConfirmationPopUpForUnipayVoid(
              'pw.bc.unipayAlertFailureMsg',
              this.failureRequests,
              data
            );
          }

          if (this.totalVoidRequests === this.noOfVoidRequestsCompleted) {
            this.voidUnipayIndex = -1;
            if (this.successRequests.length === this.totalVoidRequests) {
              this.showAlertPopUpForUnipayVoid(
                'pw.bc.unipayAlertSuccessMsg',
                true
              );
            } else if (
              this.successRequests.length !== 0 &&
              this.failureRequests.length !== 0
            ) {
              // yes: create CN and complete transaction
              // no: go back and try on other system
              this.showAlertPopUpForUnipayVoid(
                'pw.bc.unipayPartialSuccessAlertMsg',
                true
              );
            }
          }
          // console.log(
          //   'getUnipayVoidResponse:',
          //   this.successRequests,
          //   this.failureRequests,
          //   this.totalVoidRequests,
          //   this.noOfVoidRequestsCompleted
          // );
        }
      });

    this.paymentFacade
      .getUpdatePaymentStatusForVoidUnipayRes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: { res: boolean; callCancelBillWithReturn: boolean }) => {
          if (data.res) {
            if (data.callCancelBillWithReturn) {
              this.cancelBillWithReturn();
            } else {
              this.paymentFacade.loadPaymentDetails({
                transactionId: this.cashMemoId,
                transactionType: TransactionTypeEnum.CM,
                subTransactionType: this.subTxnType
              });
            }
          }
        }
      );

    combineLatest([
      this.paymentFacade
        .getErrorWhileUpdatingPaymentStatusForVoidUnipay()
        .pipe(takeUntil(this.destroy$)),
      this.facade.getErrorWhileCancellingBill().pipe(takeUntil(this.destroy$))
    ]).subscribe(([payment, billCancel]) => {
      if ((payment || billCancel) && this.successRequests.length) {
        this.showAlertPopUpForBillCancelFailure(
          'pw.bc.unipayCollectAmountAlertMsg'
        );
      }
    });
  }

  print() {
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
            printType:
              this.cancellationType === BcTypesEnum.CAN_CN
                ? 'BILL_CANCELLATION'
                : 'CM_CANCELLATION',
            doctype: printDocTypeEnum.CUSTOMER_PRINT,
            transacionType: printTransactionTypesEnum.SALES,
            printFileType: printFileTypeEnum.INVOICE_PRINT,
            transacionId: this.docID,
            productCode: this.cndoc !== null ? this.cndoc.toUpperCase() : null,
            reprint: false,
            customerId: this.customerId,
            invoiceType: action
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
  loadItemsInCashMemo(data) {
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
        txnType: data.txnType,
        subTxnType: data.subTxnType
      });
    });
  }

  showNotification(srcDocNo: number): void {
    const key = 'pw.stockIssueNotificationMessages.confirmSuccessMessage';
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMessage: string) => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.CUSTOM,
            message: translatedMessage + srcDocNo,
            hasBackdrop: true,
            hasClose: true,
            template: this.confirmSuccessNotificationTemplate
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.hasNotification = false;
            if (event.eventType === OverlayNotificationEventType.CLOSE) {
              this.back();
            }
          });
      });
  }
  getStatus(status: string) {
    let key;
    if (commonTranslateKeyMap.has(status)) {
      key = commonTranslateKeyMap.get(status);
    }
    this.translate
      .get([key.status, key.statusColor])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: string) => {
        this.status = translatedMessages[key.status];
        this.statusColor = translatedMessages[key.statusColor];
      });
    return this.statusColor;
  }
  showSummaryBar(status) {
    console.log(status);
    this.summaryBar
      .open(SummaryBarType.BC, {
        status: status,
        approval: true,
        remarks: this.requestorRemarks,
        cancelTypes: this.cancelType
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: SummaryBarEventRef) => {
        this.subType = 'CASH_MEMO';

        switch (event.eventType) {
          case SummaryBarEventType.CONFRIM: {
            if (event.remarks)
              this.facade.loadConfirmData({
                body: {
                  employeeCode: this.employeeCode,
                  reasonForCancellation: this.reasonForCancellation,
                  refTxnId: this.cashMemoId,
                  remarks: this.requestorRemarks
                    ? null
                    : event.remarks
                    ? event.remarks
                    : null
                },
                subTxnType: this.subType
              });

            break;
          }
          case SummaryBarEventType.DELETE: {
            this.facade.Delete({
              id: this.id,
              subTxnType: this.subType
            });
            break;
          }
          case SummaryBarEventType.CANCELWITHCN: {
            this.cancellationType = BcTypesEnum.CAN_CN;
            this.reqStatus = 'cancelled with CN';

            this.facade.Cancel({
              body: {
                cancelType: 'CANCEL_WITH_CN',
                remarks: this.requestorRemarks
                  ? null
                  : event.remarks
                  ? event.remarks
                  : null
              },
              id: this.id,
              subTxnType: this.subType
            });
            break;
          }
          case SummaryBarEventType.CANCELWITHRETURN: {
            this.cancellationType = BcTypesEnum.CAN_RETURN;
            this.reqStatus = 'cancelled with RETURN';
            this.enteredRemarks = event.remarks;

            if (this.unipayPaymentVoidCheck()) {
              this.noOfVoidRequestsCompleted = 0;
              this.successRequests = [];
              this.failureRequests = [];
              this.unipayPaymentVoid();
            } else {
              this.facade.Cancel({
                body: {
                  cancelType: 'CANCEL_WITH_RETURN',
                  remarks: this.requestorRemarks
                    ? null
                    : event.remarks
                    ? event.remarks
                    : null
                },
                id: this.id,
                subTxnType: this.subType
              });
            }

            break;
          }
          case SummaryBarEventType.PRINT: {
            break;
          }
        }
      });
  }

  errorNotifications(errorKey) {
    const key = errorKey;
    this.hasNotification = true;
    this.overlayNotification
      .show({
        type: OverlayNotificationType.SIMPLE,
        message: key,
        hasClose: true,
        hasBackdrop: true
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        this.hasNotification = false;
      });
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
      .subscribe((event: OverlayNotificationEventRef) => {
        // Action based event
      });
  }

  back() {
    this.router.navigate([getCMBillCancelRequestsRouteUrl()], {
      state: { clearFilter: false }
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
      this.totalAmt = this.cashMemoData?.totalValue;
      this.finalAmt = this.cashMemoData?.finalValue;
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

    console.log('totalValues', totalValues);

    this.commonFacade.setBillCancellationTotalProductValues(totalValues);
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
        //this.showConfirmNotification(this.srcDocNo);
      });
  }

  // unipay void flow

  unipayPaymentVoidCheck() {
    this.unipayPaymentDetails = this.paymentDetails.filter(
      paymentDetail =>
        paymentDetail.paymentCode === PaymentModeEnum.UNIPAY &&
        !paymentDetail.isVoid
    );
    this.totalVoidRequests = this.unipayPaymentDetails.length;
    if (this.totalVoidRequests !== 0) return true;
    return false;
  }

  unipayPaymentVoid() {
    const dateValidationCheck = this.unipayPaymentDetails.every(
      payment =>
        moment(payment.paymentDate).format('L') ===
        moment(this.bussinessDay).format('L')
    );
    if (dateValidationCheck) {
      this.voidUnipayIndex = 0;
      this.voidUnipayPayment(this.unipayPaymentDetails[this.voidUnipayIndex]);
    } else {
      this.showAlertPopUpForUnipayVoid(
        'pw.bc.unipayAlertDateFailureMsg',
        false
      );
    }
  }

  voidUnipayPayment(paymentDetail: PaymentDetails) {
    const unipayPayload: UniPayRequest = {
      txnType: UnipayTransactionType.VOID,
      txnMode: UnipayTransactionMode.CR_DR,
      txnId: paymentDetail.id,
      date: paymentDetail?.otherDetails?.data?.response?.txnDate,
      BankInvoiceNumber:
        paymentDetail?.otherDetails?.data?.response?.bankInvoiceNumber,
      unipayDetails: {
        hostName: paymentDetail.hostName,
        unipayId: paymentDetail?.otherDetails?.data?.response?.utid,
        amount: paymentDetail.amount
      }
    };

    this.paymentFacade.voidUnipayPayment(unipayPayload);
  }

  showAlertPopUpForUnipayVoid(message: string, cancelBill: boolean) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.INFO,
        message
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res && cancelBill) {
          this.paymentFacade.updatePaymentStatusForVoidUnipay({
            txnType: TransactionTypeEnum.CM,
            subTxnType: this.subTxnType,
            txnId: this.cashMemoId,
            paymentIds: this.successRequests.map(
              req => req?.res?.response?.paymentId
            ),
            callCancelBillWithReturn: true
          });
        }
      });
  }

  showAlertConfirmationPopUpForUnipayVoid(
    message: string,
    failureRequests,
    unipayFailureResData
  ) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message,
        extraMessage: this.getHostnameAndUnipayId(failureRequests),
        extraMessage1: 'pw.bc.unipayReasonForFailureMsg',
        unipayMsg: unipayFailureResData?.res?.response?.ResponseMessage,
        isUnipayFailure: true
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean | string) => {
        if (res === 'retry') {
          this.voidUnipayPayment(
            this.unipayPaymentDetails[this.voidUnipayIndex]
          );
        } else {
          this.paymentFacade.updatePaymentStatusForVoidUnipay({
            txnType: TransactionTypeEnum.CM,
            subTxnType: this.subTxnType,
            txnId: this.cashMemoId,
            paymentIds: this.successRequests.map(
              req => req?.res?.response?.paymentId
            ),
            callCancelBillWithReturn: res === true ? true : false
          });
        }
      });
  }

  showAlertPopUpForBillCancelFailure(message: string) {
    this.alertPopupService.open({
      type: AlertPopupTypeEnum.INFO,
      message
    });
  }

  cancelBillWithReturn() {
    this.facade.Cancel({
      body: {
        cancelType: 'CANCEL_WITH_RETURN',
        remarks: this.requestorRemarks
          ? null
          : this.enteredRemarks
          ? this.enteredRemarks
          : null
      },
      id: this.id,
      subTxnType: this.subType
    });
  }

  getHostnameAndUnipayId(data) {
    let unipay = '';
    data.forEach((element, index) => {
      unipay +=
        element.unipayDetails.hostName +
        ' / ' +
        element.unipayDetails.unipayId +
        ' / ' +
        this.currencyFormatterService.format(element?.unipayDetails?.amount);
      if (index < data.length - 1) {
        unipay += ', ';
      } else {
        unipay += '. ';
      }
    });
    return this.unipayDetailsMsg + unipay;
  }

  resetUnipayDetails() {
    this.successRequests = [];
    this.failureRequests = [];
    this.voidUnipayIndex = -1;
    this.noOfVoidRequestsCompleted = 0;
    this.unipayPaymentDetails = [];
  }

  voidUnipaySuccessNotification(msg) {
    this.translate
      .get(msg)
      .pipe(take(1))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification.show({
          type: OverlayNotificationType.TIMER,
          message: translatedMessage,
          hasClose: false,
          time: 5000
        });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.summaryBar.close();
    this.destroy$.complete();
    this.summaryBarRemarks$.next('');
    this.cnNo = [];
    this.focFacade.resetFOCData();
    this.commonFacade.setCMOtherCharges(null);
    this.commonFacade.clearTcsCollectedAmount();
    this.printingService.resetPrint();
    this.paymentFacade.resetPaymentStatus();
    this.resetUnipayDetails();
  }
}
