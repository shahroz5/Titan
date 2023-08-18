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
  SummaryBarEventRef,
  SummaryBarEventType,
  SummaryBarServiceAbstraction,
  SummaryBarType,
  TransactionTypeEnum,
  SubTransactionTypeEnum,
  CashMemoItemDetails,
  LocationSettingAttributesEnum,
  CommomStateAttributeTypeEnum,
  CashMemoItemDetailsResponse,
  AddFocToCmResponsePayload,
  CommomStateAttributeNameEnum,
  RsoDetailsPayload,
  printDocTypeEnum,
  printTransactionTypesEnum,
  printFileTypeEnum,
  PrintingServiceAbstraction,
  InvoiceDeliveryTypes,
  PostTransactionConfirmationActionsServiceAbstraction,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  LovMasterEnum,
  PaymentDetails,
  PaymentModeEnum,
  SharedBodEodFeatureServiceAbstraction,
  UniPayRequest,
  UnipayTransactionType,
  UnipayTransactionMode
} from '@poss-web/shared/models';
import { combineLatest, Observable, of, Subject } from 'rxjs';
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
import { FormBuilder, FormGroup } from '@angular/forms';
import { FocFacade } from '@poss-web/poss/foc/data-access-foc';
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

const RSOCode = 'RSO';

@Component({
  selector: 'poss-web-bc-detail',
  templateUrl: './bc-detail.component.html',
  styleUrls: ['./bc-detail.component.scss']
})
export class BcDetailComponent implements OnInit, OnDestroy {
  focItems$: Observable<AddFocToCmResponsePayload[]>;
  manualFocItems$: Observable<AddFocToCmResponsePayload[]>;
  destroy$: Subject<null> = new Subject<null>();
  isLoading$: Observable<boolean>;
  @ViewChild('confirmSuccessNotificationTemplate1', { static: true })
  confirmSuccessNotificationTemplate1: TemplateRef<any>;
  @ViewChild('confirmSuccessNotificationTemplate2', { static: true })
  confirmSuccessNotificationTemplate2: TemplateRef<any>;
  cashMemoId: string;
  viewCashMemo$: Observable<CashMemoDetailsResponse>;
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
  detailsForm: FormGroup;
  rso = [];
  reason = [];
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
  tcsCnAmount: number;
  tcsCnDocNo: any;
  rsoDetails$: Observable<RsoDetailsPayload[]>;
  isApprovalRequired: boolean;
  cancellationType: BcTypesEnum;
  docID: string;
  cndoc: any;
  isCommonLoading$: Observable<boolean>;
  customerId: number;
  printCnItems: string[];
  printAction: string;
  isCnPrint = false;
  paymentDetails: PaymentDetails[] = [];
  paymentType;
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
    public printingService: PrintingServiceAbstraction,
    private translate: TranslateService,
    private router: Router,
    public paymentFacade: PaymentFacade,
    private customerFacade: CustomerFacade,
    private commonFacade: CommonFacade,
    private facade: BillCancelFacade,
    private form: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private locationSettingsFacade: LocationSettingsFacade,
    @Inject(POSS_WEB_COIN_PRODUCT_GROUP_CODE)
    public coinCode: string,
    private focFacade: FocFacade,
    private currencyFormatterService: CurrencyFormatterService,
    private productFacade: ProductFacade,
    private postConfirmationActions: PostTransactionConfirmationActionsServiceAbstraction,
    private alertPopupService: AlertPopupServiceAbstraction,
    private bodEodFeatureService: SharedBodEodFeatureServiceAbstraction,
    private dialog: MatDialog
  ) {
    this.createForm();
    this.subTxnType = this.BcCmRouteTypesEnumRef[
      `${this.activatedRoute.snapshot.params['type']}`
    ];
    this.id = this.activatedRoute.snapshot.params['_id'];

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
    this.facade.resetDetail();
    this.overlayNotification.close();
    this.summaryBar.close();
    this.focFacade.resetFOCData();
    this.facade.loadRsoDetails(RSOCode);
    this.productFacade.loadRSODetails(RSOCode);
    this.facade.loadReasons(LovMasterEnum.REASON_FOR_CANCELLATION);
    this.commonFacade.loadBillCancellationPgDesc();
    this.focItems$ = this.focFacade.getFocListAddedToCM();
    this.manualFocItems$ = this.focFacade.getManualFocListAddedToCM();
    this.viewCashMemo$ = this.facade.getViewCashMemoResponse();
    this.rsoDetails$ = this.productFacade.getRSODetails();

    this.componentInit();
    this.detailsForm.controls['rsoName'].valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(selectedValue => {
        this.employeeCode = selectedValue;
      });

    this.detailsForm.controls['reason'].valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(selectedValue => {
        this.reasonForCancellation = selectedValue;
      });

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
            this.printCnItems.shift();
          }
          if (this.printCnItems.length > 0) {
            this.isCnPrint = true;
            this.printData(this.printAction, this.printCnItems[0]);
          } else {
            this.isCnPrint = false;
            this.showAlertPopUp('pw.regularCashMemo.printingSuccessMessage');
          }
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
  }

  componentInit(): void {
    if (this.id && this.subTxnType) {
      this.commonFacade.setTransactionConfig({
        isPaymentEditable: false,
        showRemainingAmount: false,
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
    this.printingService

      .getPrintError()

      .pipe(takeUntil(this.destroy$))

      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
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
    this.productDetails$ = this.facade.getItemDetails();
    this.pgDesc$ = this.commonFacade.getCommonFacadeAttributes(
      CommomStateAttributeTypeEnum.BILL_CANCELLATION,
      CommomStateAttributeNameEnum.PRODUCT_GROUP_DESC
    );

    this.facade
      .getCancelRequest()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: CancelResponse) => {
        if (data) {
          if (data.cndocNos !== null) {
            this.cnNos = data.cndocNos;
          }
          this.tcsCnDocNo = data.tcsCnDocNos;
          this.tcsCnAmount = data.tcsCnAmount;
          this.srcDocNo = String(data.docNo);
          this.docID = String(data.id).toUpperCase();
          let cndocs = Object.keys(data.cnId);
          this.cndoc = cndocs.length ? cndocs : null;
          /*  this.cndoc = Object.keys(data.cndocNos).length
            ? Object.keys(data.cndocNos)[0].toUpperCase()
            : null; */
          this.printCnItems = cndocs.length ? cndocs : null;

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

    this.viewCashMemo$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: CashMemoDetailsResponse) => {
        if (data) {
          if (data?.txnSource === 'LEGACY') {
            this.isLegacy = true;
          }
          this.commonFacade.setTransactionTotalAmount(data.finalValue);
          this.commonFacade.setCMOtherCharges(data.otherChargesList);
          this.cashMemoData = data;
          this.commonFacade.setTransactionTD(data.id);
          this.customerId = data.customerId;
          this.customerFacade.loadSelectedCustomer(
            String(data.customerId),
            false,
            false
          );
          this.txnTime = data.txnTime;
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
          this.isApprovalRequired = isApprovalRequired;
          this.showSummaryBar(isApprovalRequired);
          this.loadItemsInCashMemo(data);
        }
      });

    this.facade
      .getRsoDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((rsoDetails: string[]) => {
        if (rsoDetails.length !== 0) {
          this.rso = [];
          rsoDetails.forEach(element => {
            this.rso.push({
              value: element,
              description: element
            });
          });
        }
      });

    this.facade
      .getReasons()
      .pipe(takeUntil(this.destroy$))
      .subscribe(reasons => {
        if (reasons.length !== 0) {
          this.reason = [];
          reasons.forEach(element => {
            this.reason.push({
              value: element.code,
              description: element.value
            });
          });
        }
      });

    this.commonFacade
      .getCommonFacadeAttributes(
        CommomStateAttributeTypeEnum.BILL_CANCELLATION,
        CommomStateAttributeNameEnum.IMAGE_URL_DATA
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: {}) => {
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
      .subscribe(data => {
        this.cancelType = data;
        if (data && data.length) {
          this.showSummaryBar(this.isApprovalRequired);
        }
      });

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
        this.isApprovalRequired = isApprovalRequired;
        this.showSummaryBar(isApprovalRequired);
      }
    });

    this.productDetails$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: CashMemoItemDetails[]) => {
        this.getTotalProductValues(data);
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

          this.printData(
            action,
            this.printCnItems && this.printCnItems.length > 0
              ? this.printCnItems[0]
              : null
          );
        }
      });
  }

  printData(action: string, cnId: string) {
    this.printAction = action;
    this.isCnPrint = true;
    if (this.cancellationType === BcTypesEnum.CAN_CN) {
      this.printingService.loadPrintData({
        printType: 'BILL_CANCELLATION',
        doctype: printDocTypeEnum.CUSTOMER_PRINT,
        transacionType: printTransactionTypesEnum.SALES,
        printFileType: printFileTypeEnum.INVOICE_PRINT,
        transacionId: this.docID,
        productCode: cnId !== null ? cnId.toUpperCase() : null,
        reprint: false,
        customerId: this.customerId,
        invoiceType: action
      });
    }
    if (this.cndoc && this.cancellationType === BcTypesEnum.CAN_RETURN) {
      let isOtherPayment = true;
      if (this.paymentDetails) {
        this.paymentDetails.forEach(type => {
          this.paymentType = type.paymentCode;
          if (
            this.paymentType &&
            this.paymentType !== PaymentModeEnum.CREDIT_NOTE &&
            isOtherPayment
          ) {
            this.printingService.loadPrintData({
              printType: 'BILL_CANCELLATION',
              doctype: printDocTypeEnum.CUSTOMER_PRINT,
              transacionType: printTransactionTypesEnum.SALES,
              printFileType: printFileTypeEnum.INVOICE_PRINT,
              transacionId: this.docID,
              productCode: cnId !== null ? cnId.toUpperCase() : null,
              reprint: false,
              customerId: this.customerId,
              invoiceType: action
            });
            this.printingService.loadPrintData({
              printType: 'CM_CANCELLATION',
              doctype: printDocTypeEnum.CUSTOMER_PRINT,
              transacionType: printTransactionTypesEnum.SALES,
              printFileType: printFileTypeEnum.INVOICE_PRINT,
              transacionId: this.docID,
              productCode: cnId !== null ? cnId.toUpperCase() : null,
              reprint: false,
              customerId: this.customerId,
              invoiceType: action
            });
            isOtherPayment = false;
          }
        });
      }
    }
    if (!this.cndoc && this.cancellationType === BcTypesEnum.CAN_RETURN){
      this.printingService.loadPrintData({
        printType: 'CM_CANCELLATION',
        doctype: printDocTypeEnum.CUSTOMER_PRINT,
        transacionType: printTransactionTypesEnum.SALES,
        printFileType: printFileTypeEnum.INVOICE_PRINT,
        transacionId: this.docID,
        productCode: cnId !== null ? cnId.toUpperCase() : null,
        reprint: false,
        customerId: this.customerId,
        invoiceType: action
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

  showSummaryBar(approval: boolean) {
    this.summaryBar
      .open(SummaryBarType.BC, {
        status: BcTypesEnum.CONFIRMED,
        approval: approval,
        remarks: null,
        cancelTypes: this.cancelType
      })

      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: SummaryBarEventRef) => {
        switch (event.eventType) {
          case SummaryBarEventType.CONFRIM: {
            this.reqStatus = BcTypesEnum.REQUEST;
            if (this.reasonForCancellation === null) {
              const selectReasonMessage = 'pw.bc.reasonMsg';
              this.errorNotifications(selectReasonMessage);
            } else {
              this.facade.loadConfirmData({
                body: {
                  reasonForCancellation: this.reasonForCancellation,
                  refTxnId: this.cashMemoId,
                  remarks: event.remarks ? event.remarks : null
                },
                subTxnType: BcTypesEnum.CASH_MEMO
              });
            }
            break;
          }

          case SummaryBarEventType.CANCELWITHCN: {
            this.cancellationType = BcTypesEnum.CAN_CN;
            this.reqStatus = BcTypesEnum.CAN_CN;
            if (this.reasonForCancellation === null) {
              const selectReasonMessage = 'pw.bc.reasonMsg';
              this.errorNotifications(selectReasonMessage);
            } else if (!event.remarks) {
              const selectRemarksMessage = 'pw.bc.remarksMsg';
              this.errorNotifications(selectRemarksMessage);
            } else {
              this.facade.cancel({
                body: {
                  cancelType: BcTypesEnum.CAN_CN,
                  reasonForCancellation: this.reasonForCancellation,
                  refTxnId: this.cashMemoId,
                  remarks: event.remarks ? event.remarks : null
                },
                subTxnType: BcTypesEnum.CASH_MEMO
              });
            }
            break;
          }

          case SummaryBarEventType.CANCELWITHRETURN: {
            this.cancellationType = BcTypesEnum.CAN_RETURN;
            this.reqStatus = BcTypesEnum.CAN_RETURN;
            this.enteredRemarks = event.remarks;
            if (this.reasonForCancellation === null) {
              const selectReasonMessage = 'pw.bc.reasonMsg';
              this.errorNotifications(selectReasonMessage);
            } else if (!event.remarks) {
              const selectRemarksMessage = 'pw.bc.remarksMsg';
              this.errorNotifications(selectRemarksMessage);
            } else {
              if (this.unipayPaymentVoidCheck()) {
                this.noOfVoidRequestsCompleted = 0;
                this.successRequests = [];
                this.failureRequests = [];
                this.unipayPaymentVoid();
              } else {
                this.facade.cancel({
                  body: {
                    cancelType: BcTypesEnum.CAN_RETURN,
                    reasonForCancellation: this.reasonForCancellation,
                    refTxnId: this.cashMemoId,
                    remarks: event.remarks ? event.remarks : null
                  },
                  subTxnType: BcTypesEnum.CASH_MEMO
                });
              }
            }
            break;
          }
          case SummaryBarEventType.PRINT: {
            break;
          }
        }
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
      .subscribe();
  }

  back() {
    this.router.navigate([getBillCancelRouteUrl()]);
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

  createForm() {
    this.detailsForm = this.form.group({
      rsoName: [null],
      reason: [null]
    });
  }

  loadImageUrl(event: string) {
    this.commonFacade.loadCMImageUrl(event);
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
    console.log('voidUnipayPayment', paymentDetail);
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
    this.facade.cancel({
      body: {
        cancelType: BcTypesEnum.CAN_RETURN,
        reasonForCancellation: this.reasonForCancellation,
        refTxnId: this.cashMemoId,
        remarks: this.enteredRemarks ? this.enteredRemarks : null
      },
      subTxnType: BcTypesEnum.CASH_MEMO
    });
  }

  getHostnameAndUnipayId(data) {
    console.log('getHostnameAndUnipayId', data);
    let unipay = '';
    data.forEach((element, index) => {
      unipay +=
        element?.unipayDetails?.hostName +
        ' / ' +
        element?.unipayDetails?.unipayId +
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
    this.commonFacade.setCMOtherCharges(null);
    this.destroy$.complete();
    this.summaryBarRemarks$.next('');
    this.cnNos = [];
    this.focFacade.resetFOCData();
    this.productFacade.clearProductList();
    this.productFacade.clearProductRelatedDetails();
    this.commonFacade.clearTcsCollectedAmount();
    this.printingService.resetPrint();
    this.paymentFacade.resetPaymentStatus();
    this.resetUnipayDetails();
  }
}
