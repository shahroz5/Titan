import {
  Component,
  OnInit,
  OnDestroy,
  TemplateRef,
  ViewChild,
  Output,
  EventEmitter,
  Inject
} from '@angular/core';
import { takeUntil, take } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { grfRequestFacade } from '@poss-web/poss/grf-request-status/data-access-grf-request';
import { PaymentFacade } from '@poss-web/shared/payment/data-access-payment';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import { Router, ActivatedRoute } from '@angular/router';
import {
  CashMemoDetailsResponse,
  CustomErrors,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  RequestStatusTypesEnum,
  SetTotalProductValuesPayload,
  StatusTypesEnum,
  SubTransactionTypeEnum,
  SummaryBarEventRef,
  SummaryBarEventType,
  SummaryBarServiceAbstraction,
  TransactionTypeEnum,
  ValidationTypesEnum,
  WorkflowTypeEnum,
  SummaryBarType,
  ToolbarConfig,
  CustomerInfo,
  ApprovalRequest,
  CashMemoItemDetails,
  ManualBillDetails,
  CmRequestDetails,
  CashMemoItemDetailsResponse,
  UpdateOrderDetails,
  PaymentDetails,
  CommomStateAttributeTypeEnum,
  CommomStateAttributeNameEnum,
  FileUploadLists,
  PrintingServiceAbstraction,
  RsoDetailsPayload,
  GoldRateFreezeEnumTypes
} from '@poss-web/shared/models';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { TranslateService } from '@ngx-translate/core';
import {
  getGRFRequestListRouteUrl
} from '@poss-web/shared/util-site-routes';
import { ToolbarFacade } from '@poss-web/shared/toolbar/data-access-toolbar';
import {
  CurrencyFormatterService,
  WeightFormatterService
} from '@poss-web/shared/components/ui-formatters';
import { POSS_WEB_COIN_PRODUCT_GROUP_CODE } from '@poss-web/shared/util-config';
import {
  OrderConfirmationFacade,
  OrderService
} from '@poss-web/shared/order-confirmation/data-access-order-confirmation';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { ProductFacade } from '@poss-web/poss/shared/product/data-access-product';

const approvalUrl = 'approvals';
const RSOCode = 'RSO';
@Component({
  selector: 'poss-web-grf-status-details',
  templateUrl: './grf-status-details.component.html',
  styleUrls: ['./grf-status-details.component.css']
})
export class GrfStatusDetailsComponent implements OnInit, OnDestroy {
  destroy$: Subject<null> = new Subject<null>();
  cmRequestDetails$: Observable<CmRequestDetails>;
  cmRequestDetails: CmRequestDetails;
  cmCustomerDetails$: Observable<CustomerInfo>;
  cmHeaderDetails$: Observable<ManualBillDetails>;
  productDetails$: Observable<CashMemoItemDetails[]>;
  isLoading$: Observable<boolean>;
  isLoadingOrder$: Observable<boolean>;
  taskId: string;
  processId: string;
  id: string;
  txnType: string;
  paidValue = 0;
  @ViewChild('confirmSuccessNotificationTemplate', { static: true })
  confirmSuccessNotificationTemplate: TemplateRef<any>;
  docNo: number;
  imageUrlData$: Subject<{}> = new Subject<{}>();
  pgDesc$: Observable<{}>;
  currencyCode: string;

  toolbarData: ToolbarConfig = {
    txnType: TransactionTypeEnum.ADV,
    subTxnType: SubTransactionTypeEnum.MANUAL_GRF,
    loadMetalPrices: true,
    loadHoldPopup: false,
    loadOpenOrdersPopup: false
  };
  summaryBarRemarks$ = new Subject<string>();
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
  paymentDetails: PaymentDetails[];
  printErrorText: string;
  cashMemoId = null;
  imageUrl: string;
  orderStatus = null;
  selectedItemsDetails: CashMemoItemDetailsResponse[] = [];
  rsoDetails$: Observable<RsoDetailsPayload[]>;
  cnNo: Object;
  isCommonLoading$: Observable<boolean>;

  constructor(
    private GrfRequestFacade: grfRequestFacade,
    private paymentFacade: PaymentFacade,
    private customerFacade: CustomerFacade,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private summaryBar: SummaryBarServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private commonFacade: CommonFacade,
    private translate: TranslateService,
    private toolbarFacade: ToolbarFacade,
    private weightFormatterService: WeightFormatterService,
    private currencyFormatterService: CurrencyFormatterService,
    @Inject(POSS_WEB_COIN_PRODUCT_GROUP_CODE)
    public coinCode: string,
    private orderService: OrderService,
    private orderConfirmationFacade: OrderConfirmationFacade,
    public printingService: PrintingServiceAbstraction // private productFacade: ProductFacade
  ) {
    this.GrfRequestFacade.clearGrfRequestDetails();

    this.taskId = this.activatedRoute.snapshot.params['_taskId'];
    this.processId = this.activatedRoute.snapshot.params['_processId'];
    //this.txnType = this.activatedRoute.snapshot.params['_txnType'];
    //this.id = this.activatedRoute.snapshot.params['_id'];
    this.commonFacade.setTransactionConfig({
      isPaymentEditable: false,
      transactionType: {
        type: TransactionTypeEnum.AB,
        subType: SubTransactionTypeEnum.MANUAL_AB
      },


      // workflowData: {
      //   processID: this.processId,
      //   taskID: this.taskId,
      //   taskName: WorkflowTypeEnum.REQUEST_APPROVER_L1,
      //   workflowType: WorkflowTypeEnum.MANUAL_BILL_GRF
      // }
    });

    this.translate
      .get(['pw.otherReceiptsIssues.printError'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.printErrorText =
          translatedMessages['pw.otherReceiptsIssues.printError'];
      });
  }

  ngOnInit() {
    // this.productFacade.resetValues();
    this.GrfRequestFacade.loadGrfRequestDetails({
      processId: this.processId,
      taskId: this.taskId,
      taskName: WorkflowTypeEnum.REQUEST_APPROVER_L1,
      workFlowType: WorkflowTypeEnum.MANUAL_BILL_GRF
    });
    // this.productFacade.loadRSODetails(RSOCode);
    this.componentInit();
    // this.showSummaryBar();
  }

  componentInit() {
    // this.toolbarFacade.setToolbarConfig(this.toolbarData);
    this.cmRequestDetails$ = this.GrfRequestFacade.getGrfRequestDetails();
    this.cmCustomerDetails$ = this.GrfRequestFacade.getGrfCustomerDetails();
    this.cmHeaderDetails$ = this.GrfRequestFacade.getGrfHeaderDetails();
    this.productDetails$ = this.GrfRequestFacade.getGrfProductDetails();
    this.commonFacade.loadCMPgDesc();
    this.isLoading$ = this.GrfRequestFacade.getIsLoading();
    this.isLoadingOrder$ = this.orderConfirmationFacade.getIsLoading();
    //this.rsoDetails$ = this.productFacade.getRSODetails();
    this.pgDesc$ = this.commonFacade.getCommonFacadeAttributes(
      CommomStateAttributeTypeEnum.GRF,
      CommomStateAttributeNameEnum.PRODUCT_GROUP_DESC
    );
    this.GrfRequestFacade.getGrfProductList()
      .pipe(takeUntil(this.destroy$))
      .subscribe(val1 => {
        if (val1) {
          val1.itemIdList.forEach(element => {
            this.cashMemoId = val1.id;
            this.GrfRequestFacade.loadGrfProductDetails({
              id: val1.id,
              itemId: element,
              txnType: val1.txnType,
              subTxnType: val1.subTxnType
            });

            // this.productFacade.getItemFromCashMemo({
            //   id: val1.id,
            //   itemId: element,
            //   headerData: val1,
            //   txnType: val1.txnType,
            //   subTxnType: val1.subTxnType
            // });
          });
        }
      });

    this.GrfRequestFacade.getGrfRequestDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(val1 => {
        if (val1) {
          this.cmRequestDetails = val1;
          if (this.cmRequestDetails) {
            this.showSummaryBar();
          }
          //this.commonFacade.setTransactionTD(val1?.headerData?.data?.id);
          this.commonFacade.setCMOtherCharges(
            val1?.headerData?.data?.otherCharges
          );
          // if (
          //   this.cmRequestDetails?.headerData?.data.customerDocDetails
          //     ?.split(',')
          //     .includes(ImageTypesEnum.MANUAL_BILL)
          // ) {
          this.GrfRequestFacade.loadFileUploadList({
            txnType: TransactionTypeEnum.GRF,
            id: this.cmRequestDetails?.headerData?.data.id,
            customerId: this.cmRequestDetails?.headerData?.data.customerId,
            locationCode: this.cmRequestDetails?.locationCode
          });
          // }

            // if (
            //   this.cmRequestDetails.approvalStatus === StatusTypesEnum.APPROVED
            // ) {
            //   this.showSummaryBar();
            // }
            const data = val1?.headerData?.data;
            if (data) {
              this.customerFacade.loadSelectedCustomer(
                String(data.customerId),
                false,
                false
              );
              //console.log('GOLD WEIGHT :', data.weightAgreed);
              this.commonFacade.setTransactionTotalAmount(data.finalValue);
              this.commonFacade.setGrfGoldWeight(data.weightAgreed);
              this.commonFacade.setTransactionTD(data.id);
              // this.GrfRequestFacade.loadGrfProductList({
              //   id: data.id,
              //   txnType: data.txnType,
              //   subTxnType: data.subTxnType
              // });
            }

        }
      });

    this.GrfRequestFacade.getHasError()
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

    this.GrfRequestFacade.getGrfApprovalRequest()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: ApprovalRequest) => {
        if (data) {
          this.approvalSuccessNotifications(data);
        }
      });

    this.paymentFacade
      .getTotalPaidAmount()
      .pipe(takeUntil(this.destroy$))
      .subscribe(totalValue => {
        this.paidValue = totalValue;
      });

    // this.commonFacade
    //   .getImageUrl()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((data: {}) => {
    //     if (data !== null) {
    //       this.imageUrlData$.next(data);
    //     }
    //   });
    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.GRF,
        CommomStateAttributeNameEnum.IMAGE_URL_DATA
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: {}) => {
        if (data !== null) {
          this.imageUrlData$.next(data);
        }
      });

    this.isCommonLoading$ = this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.GRF,
        CommomStateAttributeNameEnum.LOADING
      );

    this.GrfRequestFacade.getGrfProductDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: CashMemoItemDetails[]) => {
        this.getTotalProductValues(data);
      });

    // this.productFacade
    //   .getItemDetails()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((item: CashMemoItemDetailsResponse[]) => {
    //     this.selectedItemsDetails = item;
    //   });

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
          if (data.status === StatusTypesEnum.CONFIRMED)
            this.orderStatus = StatusTypesEnum.CONFIRMED;
          this.updateCashMemoNotification(data);
          this.docNo = data.docNo;
          this.cnNo = Object.values(data.cndocNos)
        }
      });

    this.paymentFacade
      .getPaymentDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((payments: PaymentDetails[]) => {
        this.paymentDetails = payments;
      });

    this.GrfRequestFacade.getFileUploadListRes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: FileUploadLists[]) => {
        if (data.length !== 0)
          this.GrfRequestFacade.loadFileDownloadUrl({
            id: data[data.length - 1].id,
            locationCode: this.cmRequestDetails?.locationCode
          });
      });

    this.GrfRequestFacade.getFileDownloadUrl()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: string) => {
        this.imageUrl = data;
      });
  }

  confirmCashmemo(event, data) {
    const orderDetails: UpdateOrderDetails = {
      cashMemoId: data.id,
      orderDetails: {
        customerId: data.customerId,
        metalRateList: data.metalRateList,
        finalValue: data.finalValue,
        weightAgreed: data.weightAgreed,
        otherCharges: null,
        paidValue: this.currencyRoundOff(this.paidValue),
        remarks: event.remarks ? event.remarks : null,
        totalDiscount: data.totalDiscount,
        totalQuantity: data.totalQuantity,
        totalTax: this.currencyRoundOff(data.totalTax),
        totalValue: this.currencyRoundOff(data.totalValue),
        totalWeight: this.weightRoundOff(data.totalWeight),
        hallmarkCharges: this.currencyRoundOff(data.hallmarkCharges),
        hallmarkDiscount: this.currencyRoundOff(data.hallmarkDiscount)
      },
      status: StatusTypesEnum.CONFIRMED,
      transactionType: TransactionTypeEnum.ADV,
      subTransactionType: SubTransactionTypeEnum.MANUAL_FROZEN_RATES
    };

    const msg = this.orderService.confirmOrder(
      orderDetails,
      this.paymentDetails,
      TransactionTypeEnum.ADV
    );

    if (msg) {
      this.errorNotifications(msg);
    }
  }

  // createGRF(remarks: string) {
  //   const totalAmount = this.ctGrfFormGroup.get('amount').value;
  //   const orderDetails: UpdateOrderDetails = {
  //     cashMemoId: this.transactionId,
  //     status:
  //       this.actionType === ValidationTypesEnum.REGULARIZE
  //         ? StatusTypesEnum.CONFIRMED
  //         : StatusTypesEnum.APPROVAL_PENDING,
  //     orderDetails: {
  //       customerId: Number(this.customerId),
  //       finalValue: Number(Number(totalAmount).toFixed(2)),
  //       paidValue: Number(Number(this.paidValue).toFixed(2)),
  //       remarks: remarks ? remarks : null,
  //       weightAgreed: Number(this.goldWeight.toFixed(3)),
  //       metalRateList: {
  //         metalRates: this.standardMetalPriceDetails
  //       },
  //       hallmarkCharges: 0,
  //       hallmarkDiscount: 0
  //     },
  //     transactionType: TransactionTypeEnum.ADV,
  //     subTransactionType: SubTransactionTypeEnum.MANUAL_FROZEN_RATES
  //   };
  //   const msg = this.orderService.confirmOrder(
  //     orderDetails,
  //     this.paymentDetailsList,
  //     TransactionTypeEnum.ADV
  //   );
  //   if (msg) {
  //     this.errorNotifications(msg);
  //   }
  // }

  isApprove(event: any) {
    const data = {
      isApprove: event.isApprove,
      requestBody: {
        approvedData: this.cmRequestDetails.approvedData,
        approverRemarks: event.remarks
      },
      processId: this.processId,
      taskId: this.taskId,
      taskName: WorkflowTypeEnum.REQUEST_APPROVER_L1
    };
    this.GrfRequestFacade.loadGrfApprovalRequest(data);
  }

  back() {
    this.router.navigate([getGRFRequestListRouteUrl()]);
  }

  showSummaryBar() {
    this.summaryBar
      .open(SummaryBarType.GRF, {
        actionType:
          this.cmRequestDetails.approvalStatus === StatusTypesEnum.APPROVED
            ? ValidationTypesEnum.REGULARIZE
            : null,

        type: this.cmRequestDetails.approvalStatus === StatusTypesEnum.APPROVED ? GoldRateFreezeEnumTypes?.NEW_GRF : null,
        remarks:this.cmRequestDetails.approvalStatus === StatusTypesEnum.APPROVED
         ? this.summaryBarRemarks$.asObservable() : null,
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: SummaryBarEventRef) => {
        switch (event.eventType) {
          case SummaryBarEventType.REGULARIZE_GRF: {
            // if (!event.remarks) {
            //   const remarksMessage = 'pw.manualCashMemo.remarksMsg';
            //   this.errorNotifications(remarksMessage);
            // } else {
             const data = this.cmRequestDetails.headerData.data;
             this.confirmCashmemo(event,data);
            // console.log(
            //   'INTEGRATE GRF MANUAL BILL FINAL CONFIRMATION API HERE'
            // );
            // }
            break;
          }
        }
      });
  }

  approvalSuccessNotifications(data: ApprovalRequest) {
    let key;
    const key1 = 'pw.cmRequestApproval.approvalSucccessMsg1';
    const key2 = 'pw.cmRequestApproval.approvalSucccessMsg2';
    const key3 = 'pw.cmRequestApproval.approvalSucccessMsg3';
    const key4 = 'pw.cmRequestApproval.rejectSucccessMsg';
    if (data.taskStatus === RequestStatusTypesEnum.APPROVED) {
      key = key3;
    } else {
      key = key4;
    }

    this.translate
      .get([key1, key2, key3, key4])
      .pipe(take(1))
      .subscribe((translatedMessages: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SUCCESS,
            message:
              translatedMessages[key1] +
              `${this.cmRequestDetails.docNo}` +
              translatedMessages[key2] +
              `${this.cmRequestDetails.locationCode}` +
              translatedMessages[key],
            hasBackdrop: true,
            hasClose: true
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.closeAction(event.eventType);
          });
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

  updateCashMemoNotification(data) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.CUSTOM,
        hasBackdrop: true,
        hasClose: true,
        template: this.confirmSuccessNotificationTemplate
      })
      .events.pipe(take(1))
      .subscribe((event: OverlayNotificationEventRef) => {
        this.closeAction(event.eventType);
      });
  }

  /**
   * to display error message
   * @param error : error from api
   */
  errorHandler(error: CustomErrors) {
    if (error.code === ErrorEnums.ERR_QZ_TRAY) {
      this.printError();
    } else {
      this.overlayNotification
        .show({
          type: OverlayNotificationType.ERROR,
          hasClose: true, // optional
          error: error
        })
        .events.pipe(takeUntil(this.destroy$))
        .subscribe((event: OverlayNotificationEventRef) => {
          if (this.orderStatus === StatusTypesEnum.CONFIRMED) {
            this.showSuccessMessageNotification();
          } else if (error.code === ErrorEnums.ERR_SALE_053) {
            this.closeAction(event.eventType);
          }
        });
    }
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
        this.showSuccessMessageNotification();
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
      .subscribe();
  }

  closeAction(eventType) {
    if (eventType === OverlayNotificationEventType.CLOSE) {
      this.back();
    }
  }

  loadImageUrl(event: string) {
    // this.commonFacade.loadImageUrl(event);
    this.commonFacade.loadCMImageUrl(event);
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
      this.taxAmt = this.cmRequestDetails?.headerData?.data?.totalTax;
      this.totalAmt = this.cmRequestDetails?.headerData?.data?.totalValue;
      this.finalAmt = this.cmRequestDetails?.headerData?.data?.finalValue;
      this.roundOff = this.cmRequestDetails?.headerData?.data?.roundingVariance;
      this.hallmarkCharges = this.cmRequestDetails?.headerData?.data?.hallmarkCharges;
      this.hallmarkDiscount = this.cmRequestDetails?.headerData?.data?.hallmarkDiscount;
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

    // const totalValues: SetTotalProductValuesPayload = {
    //   productQty: this.productQty,
    //   productWeight: this.productWeight,
    //   productDisc: this.productDisc,
    //   productAmt: this.productAmt,
    //   taxAmt: this.taxAmt,
    //   totalAmt: this.totalAmt,
    //   coinQty: this.coinQty,
    //   coinWeight: this.coinWeight,
    //   coinDisc: this.coinDisc,
    //   coinAmt: this.coinAmt,
    //   finalAmt: this.finalAmt,
    //   roundOff: this.roundOff,
    //   hallmarkCharges: this.hallmarkCharges,
    //   hallmarkDiscount: this.hallmarkDiscount
    // };

    // this.commonFacade.setTotalProductValues(totalValues);
    //this.commonFacade.setCMTotalProductValues(totalValues);
  }

  // print() {

  //     this.printingService.loadPrintData({
  //       printType: printTypesEnum.GRF,
  //       transacionId: this.id,
  //       transacionType: printTransactionTypesEnum.SALES,
  //       doctype: printDocTypeEnum.CUSTOMER_PRINT,
  //       printFileType: printFileTypeEnum.INVOICE_PRINT
  //     });

  // }

  ngOnDestroy(): void {
    this.overlayNotification.close();
    this.commonFacade.setCMOtherCharges(null);
    this.summaryBar.close();
    this.destroy$.next();
    this.destroy$.complete();
    this.commonFacade.clearTransactionConfig();
    // this.commonFacade.clearCMTransactionConfig();
    this.summaryBarRemarks$.next('');
    this.orderConfirmationFacade.resetValues();
    this.printingService.resetPrint();
    this.toolbarFacade.setToolbarConfig({
      loadMetalPrices: true,
      loadHoldPopup: false,
      loadOpenOrdersPopup: false
    });
    this.orderStatus = null;
    // this.productFacade.clearProductList();
    // this.productFacade.clearProductRelatedDetails();
  }
}
