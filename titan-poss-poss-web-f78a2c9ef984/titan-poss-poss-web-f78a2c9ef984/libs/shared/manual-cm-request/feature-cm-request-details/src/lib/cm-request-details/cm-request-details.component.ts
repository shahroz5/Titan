import {
  Component,
  OnInit,
  OnDestroy,
  TemplateRef,
  ViewChild,
  Inject
} from '@angular/core';
import { takeUntil, take } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { CmRequestFacade } from '@poss-web/shared/manual-cm-request/data-access-cm-request';
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
  printTypesEnum,
  printDocTypeEnum,
  printTransactionTypesEnum,
  CommomStateAttributeTypeEnum,
  CommomStateAttributeNameEnum,
  printFileTypeEnum,
  FileUploadLists,
  PrintingServiceAbstraction,
  RsoDetailsPayload,
  CUSTOMER_TYPE_ENUM,
  PanCardPopupAbstraction,
  ViewTcsServiceAbstraction,
  TcsDataResponse,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  PaymentModeEnum,
  CustomerServiceAbstraction
} from '@poss-web/shared/models';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { TranslateService } from '@ngx-translate/core';
import {
  getCMRequestListRouteUrl,
  getCMRequestApprovalsListRouteUrl
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
import { CashMemoFacade } from '@poss-web/poss/cash-memo/data-access-cash-memo';

const approvalUrl = 'approvals';
const RSOCode = 'RSO';

@Component({
  selector: 'poss-web-cm-request-details',
  templateUrl: './cm-request-details.component.html',
  styleUrls: ['./cm-request-details.component.scss']
})
export class CmRequestDetailsComponent implements OnInit, OnDestroy {
  isCorpUser: boolean;
  destroy$: Subject<null> = new Subject<null>();
  cmRequestDetails$: Observable<CmRequestDetails>;
  cmRequestDetails: CmRequestDetails;
  cmCustomerDetails$: Observable<CustomerInfo>;
  cmHeaderDetails$: Observable<ManualBillDetails>;
  productDetails$: Observable<CashMemoItemDetails[]>;
  isLoading$: Observable<boolean>;
  isLoadingOrder$: Observable<boolean>;
  isCMLoading$: Observable<boolean>;
  taskId: string;
  processId: string;
  id: string;
  txnType: string;
  paidValue = 0;
  totalOrderAmt = 0;
  finalOrderAmt = 0;
  @ViewChild('confirmSuccessNotificationTemplate', { static: true })
  confirmSuccessNotificationTemplate: TemplateRef<any>;
  docNo: number;
  imageUrlData$: Subject<{}> = new Subject<{}>();
  pgDesc$: Observable<{}>;
  currencyCode: string;

  toolbarData: ToolbarConfig = {
    txnType: TransactionTypeEnum.CM,
    subTxnType: SubTransactionTypeEnum.MANUAL_CM,
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
  totalQty = 0;
  panMandatoryForCM: boolean;
  maxAllowedAmount: number;
  customerType: any;
  form60Submitted: boolean;
  customerPAN: any;
  customerId = null;
  tcsToBeCollected = null;
  tcsCollectedAtCm: number;
  otherCharges = null;
  confirmData = null;
  orderDetails = null;
  newlyGeneratedCn: any;
  refundAmountAsCash = 0;
  gstNumber: string;
  idProof: string;
  isCommonLoading$: Observable<boolean>;

  constructor(
    private cmRequestFacade: CmRequestFacade,
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
    public printingService: PrintingServiceAbstraction,
    private productFacade: ProductFacade,
    private panCardServiceAbstraction: PanCardPopupAbstraction,
    private viewTcsService: ViewTcsServiceAbstraction,
    private alertPopupService: AlertPopupServiceAbstraction,
    private cashMemoFacade: CashMemoFacade,
    private customerService: CustomerServiceAbstraction
  ) {
    this.cmRequestFacade.clearCmRequestDetails();
    if (router.url.split('/', 2)[1] === approvalUrl) {
      this.isCorpUser = true;
      this.taskId = this.activatedRoute.snapshot.params['_taskId'];
      this.processId = this.activatedRoute.snapshot.params['_processId'];

      this.commonFacade.setTransactionConfig({
        isPaymentEditable: false,
        transactionType: {
          type: TransactionTypeEnum.CM,
          subType: SubTransactionTypeEnum.MANUAL_CM
        },
        workflowData: {
          processID: this.processId,
          taskID: this.taskId,
          taskName: WorkflowTypeEnum.REQUEST_APPROVER_L1,
          workflowType: WorkflowTypeEnum.MANUAL_BILL
        }
      });
    } else {
      this.isCorpUser = false;
      this.txnType = this.activatedRoute.snapshot.params['_txnType'];
      this.id = this.activatedRoute.snapshot.params['_id'];
    }
    this.translate
      .get(['pw.otherReceiptsIssues.printError'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.printErrorText =
          translatedMessages['pw.otherReceiptsIssues.printError'];
      });
  }

  ngOnInit() {
    this.productFacade.resetValues();
    this.cmRequestFacade.loadCmRequestDetails({
      processId: this.isCorpUser ? this.processId : this.id,
      taskId: this.taskId,
      taskName: WorkflowTypeEnum.REQUEST_APPROVER_L1,
      workFlowType: WorkflowTypeEnum.MANUAL_BILL,
      userType: this.isCorpUser
    });
    this.cmRequestDetails$ = this.cmRequestFacade.getCmRequestDetails();
    this.cmRequestDetails$.pipe(takeUntil(this.destroy$)).subscribe(val1 => {
      if (val1) {
        this.cmRequestDetails = val1;
        // if (
        //   this.cmRequestDetails?.headerData?.data.customerDocDetails
        //     ?.split(',')
        //     .includes(ImageTypesEnum.MANUAL_BILL)
        // ) {
        this.productFacade.loadRSODetails(
          RSOCode,
          this.cmRequestDetails?.locationCode
        );
        this.cmRequestFacade.loadFileUploadList({
          txnType: TransactionTypeEnum.CM,
          id: this.cmRequestDetails?.headerData?.data.id,
          customerId: this.cmRequestDetails?.headerData?.data.customerId,
          locationCode: this.cmRequestDetails?.locationCode
        });

        // }
        if (!this.isCorpUser) {
          this.commonFacade.clearTransactionConfig();
          this.commonFacade.setTransactionConfig({
            isPaymentEditable:
              this.cmRequestDetails.approvalStatus === StatusTypesEnum.REJECTED
                ? false
                : true,
            transactionType: {
              type: TransactionTypeEnum.CM,
              subType: SubTransactionTypeEnum.MANUAL_CM
            }
          });

          if (
            this.cmRequestDetails.approvalStatus === StatusTypesEnum.APPROVED
          ) {
            this.showSummaryBar(false);
          } else {
            this.showSummaryBar(true);
          }

          const data = val1?.headerData?.data;
          if (data) {
            this.customerFacade.loadSelectedCustomer(
              String(data.customerId),
              false,
              false
            );
            this.commonFacade.setTransactionTotalAmount(data.finalValue);
            this.commonFacade.setTransactionTD(data.id);
            this.cmRequestFacade.loadCmProductList({
              id: data.id,
              txnType: data.txnType,
              subTxnType: data.subTxnType
            });
            this.otherCharges = val1?.headerData?.data?.otherCharges;
            this.commonFacade.setCMOtherCharges(
              val1?.headerData?.data?.otherCharges
            );
          }
        } else {
          this.commonFacade.setTransactionTotalAmount(
            val1?.headerData?.data?.finalValue
          );
          this.commonFacade.setCMOtherCharges(
            val1?.headerData?.data?.otherCharges
          );
        }
      }
    });
    this.componentInit();
  }

  componentInit() {
    this.toolbarFacade.setToolbarConfig(this.toolbarData);
    this.commonFacade.loadCMPgDesc();
    this.isLoading$ = this.cmRequestFacade.getIsLoading();
    this.isLoadingOrder$ = this.orderConfirmationFacade.getIsLoading();
    this.isCMLoading$ = this.cashMemoFacade.getIsLoading();
    this.cmCustomerDetails$ = this.cmRequestFacade.getCmCustomerDetails();
    this.cmHeaderDetails$ = this.cmRequestFacade.getCmHeaderDetails();
    this.productDetails$ = this.cmRequestFacade.getCmProductDetails();
    this.rsoDetails$ = this.productFacade.getRSODetails();
    this.tcsAmountSubscription();
    this.pgDesc$ = this.commonFacade.getCommonFacadeAttributes(
      CommomStateAttributeTypeEnum.CASHMEMO,
      CommomStateAttributeNameEnum.PRODUCT_GROUP_DESC
    );
    this.cmRequestFacade
      .getCmProductList()
      .pipe(takeUntil(this.destroy$))
      .subscribe(val1 => {
        if (val1) {
          this.orderDetails = val1;
          val1.itemIdList.forEach(element => {
            this.cashMemoId = val1.id;
            this.commonFacade.setTcsAmount(val1.tcsToBeCollected);
            this.commonFacade.setTransactionTotalAmount(val1.finalValue);
            this.cmRequestFacade.loadCmProductDetails({
              id: val1.id,
              itemId: element,
              txnType: val1.txnType,
              subTxnType: val1.subTxnType
            });

            this.productFacade.getItemFromCashMemo({
              id: val1.id,
              itemId: element,
              headerData: val1,
              txnType: val1.txnType,
              subTxnType: val1.subTxnType
            });
          });
        }
      });

    this.cmRequestFacade
      .getHasError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

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

    this.cmRequestFacade
      .getCmApprovalRequest()
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

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
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
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.LOADING
      );

    this.cmRequestFacade
      .getCmProductDetails()
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

    this.cmRequestFacade
      .getFileUploadListRes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: FileUploadLists[]) => {
        if (data.length !== 0)
          this.cmRequestFacade.loadFileDownloadUrl({
            id: data[data.length - 1].id,
            locationCode: this.cmRequestDetails?.locationCode
          });
      });

    this.cmRequestFacade
      .getFileDownloadUrl()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: string) => {
        this.imageUrl = data;
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

    this.customerFacade
      .getBrandDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(brandDetail => {
        if (brandDetail) {
          this.maxAllowedAmount =
            brandDetail.panCardDetails.data.configurationAmountForCashMemo;
          this.panMandatoryForCM =
            brandDetail.panCardDetails.data.isPanCardMandatoryforCashMemo;
        }
      });

    this.customerFacade
      .getSelectSelectedCustomer()
      .pipe(takeUntil(this.destroy$))
      .subscribe(customer => {
        if (customer) {
          this.customerId = customer.customerId;
          this.customerPAN = customer.custTaxNo;
          this.customerType = customer.customerType;
          this.form60Submitted =
            customer.customerDetails.data.form60AndIdProofSubmitted;
          this.gstNumber = customer.instiTaxNo;
          this.idProof = customer.customerDetails.data.idProof;
        } else {
          this.customerId = null;
          this.customerPAN = null;
          this.customerType = null;
          this.gstNumber = null;
          this.idProof = null;
        }
      });

    this.cashMemoFacade
      .getPartialUpdateCashMemoResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: CashMemoDetailsResponse) => {
        if (data) {
          this.commonFacade.setTransactionTotalAmount(data.finalValue);
          this.orderDetails = data;
          this.commonFacade.setCMOrderValues({
            taxAmt: data.totalTax,
            totalAmt: data.totalValue,
            finalAmt: data.finalValue,
            roundOff: data.roundingVariance,
            hallmarkCharges: data.hallmarkCharges,
            hallmarkDiscount: data.hallmarkDiscount
          });
          if (data.tcsToBeCollected === 0 || data.tcsToBeCollected === null) {
            this.commonFacade.setTcsAmount(0);
          }
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
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.TOTAL_AMT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(amt => {
        this.totalOrderAmt = amt;
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.CASHMEMO,
        CommomStateAttributeNameEnum.FINAL_AMT
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(amt => {
        this.finalOrderAmt = amt;
      });
  }

  confirmCashmemo(event, data) {
    const orderDetails: UpdateOrderDetails = {
      cashMemoId: data.id,
      orderDetails: {
        customerId: data.customerId,
        metalRateList: data.metalRateList,
        finalValue: data.finalValue,
        otherCharges: this.otherCharges,
        paidValue: this.currencyRoundOff(this.paidValue),
        remarks: event.remarks ? event.remarks : null,
        totalDiscount: data.totalDiscount,
        totalQuantity: data.totalQuantity,
        totalTax: this.currencyRoundOff(data.totalTax),
        totalValue: this.currencyRoundOff(data.totalValue),
        totalWeight: this.weightRoundOff(data.totalWeight),
        hallmarkCharges: this.currencyRoundOff(data.hallmarkCharges),
        hallmarkDiscount: this.currencyRoundOff(data.hallmarkDiscount),
        tcsToBeCollected: this.currencyRoundOff(this.tcsToBeCollected),
        tcsCollected: this.currencyRoundOff(this.tcsCollectedAtCm)
      },
      status: StatusTypesEnum.CONFIRMED,
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
  }

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
    this.cmRequestFacade.loadCmApprovalRequest(data);
  }

  back() {
    if (this.isCorpUser) {
      this.router.navigate([getCMRequestApprovalsListRouteUrl()]);
    } else {
      this.router.navigate([getCMRequestListRouteUrl()]);
    }
  }

  showSummaryBar(readOnly: boolean) {
    this.summaryBar
      .open(SummaryBarType.MB, {
        actionType: ValidationTypesEnum.REGULARIZE,
        clearType: false,
        remarks: this.summaryBarRemarks$.asObservable(),
        readOnly: readOnly
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: SummaryBarEventRef) => {
        switch (event.eventType) {
          case SummaryBarEventType.CONFRIM: {
            // if (!event.remarks) {
            //   const remarksMessage = 'pw.manualCashMemo.remarksMsg';
            //   this.errorNotifications(remarksMessage);
            const data = this.orderDetails;
            this.confirmData = event;
            if (
              this.totalQty !== 0 &&
              this.panMandatoryForCM &&
              this.paidValue > this.maxAllowedAmount &&
              ((this.customerType === CUSTOMER_TYPE_ENUM.INTERNATIONAL &&
                !this.form60Submitted) ||
                (this.customerType === CUSTOMER_TYPE_ENUM.ONE_TIME &&
                  !this.form60Submitted &&
                  !this.customerPAN) ||
                (this.customerType === CUSTOMER_TYPE_ENUM.INSTITUTIONAL &&
                  !this.gstNumber &&
                  !this.customerPAN) ||
                (this.customerType === CUSTOMER_TYPE_ENUM.REGULAR &&
                  !this.customerPAN &&
                  !this.idProof))
            ) {
              this.openPanCardPopUp();
            } else {
              if (
                this.totalOrderAmt !== 0 &&
                this.finalOrderAmt - this.paidValue === 0
              ) {
                this.tcsCalculation();
              } else {
                this.confirmCashmemo(event, data);
              }
            }
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
    }  else if (error.code === ErrorEnums.ERR_CUST_001) {
      this.customerService.open({customerType: this.customerType, customerId: this.customerId})
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
      .subscribe((event: OverlayNotificationEventRef) => {
        this.closeAction(event.eventType);
      });
  }

  closeAction(eventType) {
    if (eventType === OverlayNotificationEventType.CLOSE) {
      this.back();
    }
  }

  loadImageUrl(event: string) {
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
      this.taxAmt = this.orderDetails?.totalTax;
      this.totalAmt = this.orderDetails?.totalValue;
      this.finalAmt = this.orderDetails?.finalValue;
      this.roundOff = this.orderDetails?.roundingVariance;
      this.hallmarkCharges = this.orderDetails?.hallmarkCharges;
      this.hallmarkDiscount = this.orderDetails?.hallmarkDiscount;
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

    // this.commonFacade.setTotalProductValues(totalValues);
    this.commonFacade.setCMTotalProductValues(totalValues);
  }

  print() {
    if (this.cashMemoId) {
      this.printingService.loadPrintData({
        printType: printTypesEnum.CM_PRINTS,
        transacionId: this.cashMemoId,
        transacionType: printTransactionTypesEnum.SALES,
        doctype: printDocTypeEnum.CUSTOMER_PRINT,
        printFileType: printFileTypeEnum.INVOICE_PRINT
      });
    }
  }

  openPanCardPopUp() {
    this.panCardServiceAbstraction.open(this.customerId, this.customerType);
  }

  viewTcs() {
    const CustomerData = {
      id: this.cashMemoId,
      txnType: TransactionTypeEnum.CM,
      subTxnType: SubTransactionTypeEnum.MANUAL_CM
    };
    this.viewTcsService.open(CustomerData);
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
          let tcsAlertLabel = null;

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
                tcsAlertLabel =
                  translatedMessages['pw.regularCashMemo.alertMsgForTcs'];
              });
            this.openErrorMsgForOrder(tcsAlertLabel);
            this.commonFacade.setTcsAmount(this.tcsToBeCollected);
            this.cashMemoFacade.partialUpdateCashMemo({
              id: this.cashMemoId,
              requestDetails: {
                tcsCollected: this.tcsToBeCollected
              },
              txnType: TransactionTypeEnum.CM,
              subTxnType: SubTransactionTypeEnum.MANUAL_CM
            });
          } else if (
            (this.tcsToBeCollected === 0 ||
              this.tcsToBeCollected === data.tcsCollected ||
              this.tcsToBeCollected === null) &&
            this.orderDetails
          ) {
            this.confirmCashmemo(this.confirmData, this.orderDetails);
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

  ngOnDestroy(): void {
    this.overlayNotification.close();
    this.commonFacade.setCMOtherCharges(null);
    this.summaryBar.close();
    this.destroy$.next();
    this.destroy$.complete();
    this.commonFacade.clearTransactionConfig();
    this.summaryBarRemarks$.next('');
    this.orderConfirmationFacade.resetValues();
    this.printingService.resetPrint();
    this.toolbarFacade.setToolbarConfig({
      loadMetalPrices: true,
      loadHoldPopup: false,
      loadOpenOrdersPopup: false
    });
    this.orderStatus = null;
    this.productFacade.clearProductList();
    this.productFacade.clearProductRelatedDetails();
    this.cashMemoFacade.resetValues();
  }
}
