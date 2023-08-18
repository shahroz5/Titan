import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CreditNoteFacade } from '@poss-web/poss/credit-note/data-access-cn';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  CancelCnRequestPayload,
  CnRefundAmountDetails,
  CnRefundPaymentData,
  CNSearchEnum,
  CNStatusEnum,
  CreditNoteAPITypes,
  CreditNoteDetails,
  CreditNoteSearchResult,
  CustomErrors,
  DocumentListResponse,
  FileData,
  FileTypeEnum,
  FileUploadDocTypeEnum,
  FileUploadFileTypeEnum,
  InvoiceDeliveryTypes,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  PaymentDetails,
  PostTransactionConfirmationActionsServiceAbstraction,
  printDocTypeEnum,
  printFileTypeEnum,
  PrintingServiceAbstraction,
  printTransactionTypesEnum,
  printTypesEnum,
  RefundOptionTypes,
  SentRequestResponse,
  SharedBodEodFeatureServiceAbstraction,
  SummaryBarCNTypesEnum,
  SummaryBarEventRef,
  SummaryBarEventType,
  SummaryBarServiceAbstraction,
  SummaryBarType,
  ToolbarConfig,
  TransferToEghs,
  UniPayRequest,
  UnipayTransactionMode,
  UnipayTransactionType
} from '@poss-web/shared/models';
import { getCreditNoteUrl } from '@poss-web/shared/util-site-routes';
import { Observable, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import { ToolbarFacade } from '@poss-web/shared/toolbar/data-access-toolbar';
import { FileFacade } from '@poss-web/shared/file-upload/data-access-file-upload';
import { FilePreviewComponent } from '@poss-web/shared/components/ui-file-upload';
import { MatDialog } from '@angular/material/dialog';
import { PaymentFacade } from '@poss-web/shared/payment/data-access-payment';
import * as moment from 'moment';
import { CurrencyFormatterService } from '@poss-web/shared/components/ui-formatters';
import { PrintingFacade } from '@poss-web/shared/printing/data-access-printing';

@Component({
  selector: 'poss-web-cn-details',
  templateUrl: './cn-details.component.html'
})
export class CNDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('confirmSuccessNotificationTemplate', { static: true })
  private confirmSuccessNotificationTemplate: TemplateRef<any>;

  @ViewChild('confirmRequestNotificationTemplate', { static: true })
  private confirmRequestNotificationTemplate: TemplateRef<any>;

  @ViewChild('transferToEGHSSuccessNotificationTemplate', { static: true })
  private transferToEGHSSuccessNotificationTemplate: TemplateRef<any>;

  @Output() isCancelCnAutoApproved: EventEmitter<boolean> = new EventEmitter<
    boolean
  >();

  CNSearchEnumRef = CNSearchEnum;
  CNStatusEnumRef = CNStatusEnum;
  id: string;
  destroy$ = new Subject<null>();
  creditNoteDetails: CreditNoteDetails;
  status: string;
  isLoading$: Observable<boolean>;
  dateFormat: string;
  tabType: string;
  requestId: string;
  refundAmountDetails: CnRefundAmountDetails;
  requestDetails: SentRequestResponse;
  hasNotification = true;
  cnNumber: number;
  requestType: string;
  workFlowType: string;
  toolbarData: ToolbarConfig = {
    txnType: null,
    subTxnType: null,
    loadMetalPrices: true,
    loadHoldPopup: false,
    loadOpenOrdersPopup: false
  };
  transferAmt = null;
  accountNum = null;
  transferToEghsDetails: TransferToEghs;
  docNo: string;
  fiscalYear: string;
  cnId: string;
  ghsDocNo: number;
  transferCreditNoteDetails: CreditNoteSearchResult[];
  hasCancelled = false;
  confirmButton = false;
  cancelButton = false;
  filesList: DocumentListResponse[];
  fileIds: string[] = [];
  showPaymentComponentForApprovedCancelCnRequest = false;
  refundOptionTypes = RefundOptionTypes;
  isAccountNumberReq = false;
  enteredRemarks: string;
  cnCancelPaymentRefundData = null;
  unipayDetailsMsg: string;
  isPaymentLoading$: Observable<boolean>;
  bussinessDay: number;
  unipayVoidFailedMsg: string;
  voidLabel: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private creditNoteFacade: CreditNoteFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private translate: TranslateService,
    private appsettingFacade: AppsettingFacade,
    private customerFacade: CustomerFacade,
    private toolbarFacade: ToolbarFacade,
    private summaryBar: SummaryBarServiceAbstraction,
    private fileFacade: FileFacade,
    private dialog: MatDialog,
    public paymentFacade: PaymentFacade,
    private alertPopupService: AlertPopupServiceAbstraction,
    private bodEodFeatureService: SharedBodEodFeatureServiceAbstraction,
    private postConfirmationActions: PostTransactionConfirmationActionsServiceAbstraction,
    private currencyFormatterService: CurrencyFormatterService,
    private printingFacade: PrintingFacade,
    public printingService: PrintingServiceAbstraction,
  ) {
    this.translate
      .get([
        'pw.creditNote.unipayDetailsMsg',
        'pw.creditNote.unipayVoidFailedMsg',
        'pw.creditNote.voidLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.unipayDetailsMsg =
          translatedMessages['pw.creditNote.unipayDetailsMsg'];
        this.unipayVoidFailedMsg =
          translatedMessages['pw.creditNote.unipayVoidFailedMsg'];
        this.voidLabel = translatedMessages['pw.creditNote.voidLabel'];
      });
  }

  ngOnInit(): void {
    this.paymentFacade.loadChequePayerBanks();
    this.creditNoteFacade.resetDetailPage();
    this.overlayNotification.close();
    this.summaryBar.close();
    this.appsettingFacade
      .getDateFormat()
      .pipe(takeUntil(this.destroy$))
      .subscribe((dateFormat: string) => {
        if (dateFormat) {
          this.dateFormat = dateFormat;
        }
      });
    this.creditNoteFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.toolbarFacade.setToolbarConfig(this.toolbarData);
    const fromPath = this.route.pathFromRoot[2];
    this.id = fromPath.snapshot.params['_id'];
    this.tabType = fromPath.snapshot.params['_tabType'];
    this.docNo = fromPath.snapshot.params['_docNo'];
    this.fiscalYear = fromPath.snapshot.params['_fiscalYear'];
    this.ghsDocNo = fromPath.snapshot.params['_ghsDocNo'];
    this.requestType = fromPath.snapshot.params['_requestType'];

    this.creditNoteFacade.storeRequestType(this.requestType);
    this.isLoading$ = this.creditNoteFacade.getIsLoading();
    this.isPaymentLoading$ = this.paymentFacade.getIsLoading();

    switch (this.requestType) {
      case CNSearchEnum.ACTIVATE_CN:
        this.workFlowType = CreditNoteAPITypes.CREDIT_NOTE_ACTIVATE;
        break;
      case CNSearchEnum.REMOVE_GOLD_RATE:
        this.workFlowType = CreditNoteAPITypes.CREDIT_NOTE_GOLD_RATE_REMOVE;
        break;
      case CNSearchEnum.CANCEL_CN:
        this.workFlowType = CreditNoteAPITypes.CREDIT_NOTE_CANCELLATION;
        break;
    }

    switch (this.tabType) {
      case CNSearchEnum.CN_ACTIVITY:
        this.creditNoteFacade.loadCreditNoteDetails(this.id);
        break;
      case CNSearchEnum.SENT_REQUESTS:
        this.creditNoteFacade.loadRequestById({
          processId: this.id,
          workFlowType: this.workFlowType
        });
        break;
      case CNSearchEnum.EGHS_TRANSFER:
        this.creditNoteFacade.searchTransferedCN({
          cnNumber: this.docNo,
          fiscalYear: this.fiscalYear
        });
        break;
    }
    this.creditNoteFacade
      .getDownloadCN()
      .pipe(takeUntil(this.destroy$))
      .subscribe((downloadCN: boolean) => {
        if (downloadCN) {
          this.showSuccessNotification(
            'pw.creditNote.creditNoteDownloadedSuccessMsg'
          );
        }
      });
    this.creditNoteFacade
      .getTransferedCN()
      .pipe(takeUntil(this.destroy$))
      .subscribe((cnDetails: CreditNoteSearchResult[]) => {
        if (cnDetails && this.tabType === CNSearchEnum.EGHS_TRANSFER) {
          this.transferCreditNoteDetails = cnDetails;
          if (this.transferCreditNoteDetails.length > 0) {
            this.customerFacade.loadSelectedCustomer(
              this.transferCreditNoteDetails[0].customerId.toString(),
              false,
              false
            );
            if (
              this.transferCreditNoteDetails[0].status ===
                CNStatusEnum.TRANSFER_GHS &&
              this.transferCreditNoteDetails.length > 0
            ) {
              this.cnId = this.transferCreditNoteDetails[0].id;
              this.showDownloadCreditNoteNotification();
            }
          }
        }
      });
    this.creditNoteFacade
      .getRequest()
      .pipe(takeUntil(this.destroy$))
      .subscribe((requestDetails: SentRequestResponse) => {
        if (requestDetails) {
          this.requestDetails = requestDetails;
          this.showPaymentComponentForApprovedCancelCnRequest = false;
          this.status = requestDetails.approvalStatus.toUpperCase();
          this.customerFacade.loadSelectedCustomer(
            requestDetails.custId.toString(),
            false,
            false
          );
          if (
            this.status.toUpperCase() === CNSearchEnum.APPROVED &&
            this.requestType === CNSearchEnum.CANCEL_CN
          ) {
            this.showPaymentComponentForApprovedCancelCnRequest = true;
            this.creditNoteFacade.loadCnRefundAmountDetails(
              this.requestDetails.id
            );
          } else if (this.status.toUpperCase() === CNSearchEnum.APPROVED) {
            this.showConfirmRequestNotification();
          } else if (this.status === CNSearchEnum.PENDING) {
            this.showCancelNotification();
          }
        }
      });
    this.creditNoteFacade
      .getcnNumber()
      .pipe(takeUntil(this.destroy$))
      .subscribe((cnNumber: number) => {
        if (cnNumber) {
          this.cnNumber = cnNumber;
          this.showConfirmNotification(
            'pw.creditNote.reqConfirmtionMsg',
            this.cnNumber
          );
        }
      });

    this.creditNoteFacade
      .getCreditNoteDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((creditNoteDetails: CreditNoteDetails) => {
        if (creditNoteDetails) {
          this.creditNoteDetails = creditNoteDetails;
          this.status = this.creditNoteDetails.status.toUpperCase();
          this.customerFacade.loadSelectedCustomer(
            creditNoteDetails.customerId.toString(),
            false,
            false
          );
          if (
            this.tabType === CNSearchEnum.CN_ACTIVITY &&
            this.requestType !== CNSearchEnum.CANCEL_CN &&
            this.requestType !== CNSearchEnum.CN_DETAILS
          ) {
            this.showNotificaton();
          } else if (
            this.tabType === CNSearchEnum.CN_ACTIVITY &&
            this.requestType === CNSearchEnum.CANCEL_CN
          ) {
            //Emit CN AutoApproved status to shell for displaying upload file conditionally
            this.isCancelCnAutoApproved.emit(
              this.creditNoteDetails.isAutoApproved
            );
            if (this.creditNoteDetails.isAutoApproved) {
              this.creditNoteFacade.loadCnRefundAmountDetails(
                this.creditNoteDetails.id
              );
            } else {
              this.showNotificaton(this.creditNoteDetails.isAutoApproved);
            }
          }

          if (
            this.tabType === CNSearchEnum.CN_ACTIVITY &&
            this.requestType === CNSearchEnum.CN_DETAILS &&
            this.creditNoteDetails &&
            this.creditNoteDetails.status === CNStatusEnum.CANCELLED
          ) {
            this.showPrintSummaryBarNotification();
          }
        }
      });

    this.creditNoteFacade
      .getCnRefundAmountDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: CnRefundAmountDetails) => {
        if (data) {
          this.refundAmountDetails = data;
        }
      });
    this.creditNoteFacade
      .getRequestId()
      .pipe(takeUntil(this.destroy$))
      .subscribe((requestId: string) => {
        if (requestId) {
          this.requestId = requestId;

          let successMessageText: string;
          if (this.tabType === CNSearchEnum.CN_ACTIVITY) {
            switch (this.requestType) {
              case CNSearchEnum.REMOVE_GOLD_RATE:
                successMessageText = 'pw.creditNote.confirmationMsg';
                break;
              case CNSearchEnum.ACTIVATE_CN:
                successMessageText =
                  'pw.creditNote.activateCnRequestSuccessMsg';
                break;
              case CNSearchEnum.CANCEL_CN:
                successMessageText = 'pw.creditNote.cancelCnRequestSuccessMsg';
                break;
            }
            this.showConfirmationNotification(successMessageText, requestId);
          }
        }
      });

    this.creditNoteFacade
      .getEGHSDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((eghsDetails: TransferToEghs) => {
        if (eghsDetails) {
          this.transferToEghsDetails = eghsDetails;
          this.showTransferEHSConfirmationNotification(
            'pw.creditNote.transferSuccessMsg',
            this.transferToEghsDetails.docNo
          );
        }
      });

    this.creditNoteFacade
      .getHasCancelled()
      .pipe(takeUntil(this.destroy$))
      .subscribe((hasCancelled: boolean) => {
        this.hasCancelled = hasCancelled;
        if (hasCancelled) {
          this.showSuccessNotification('pw.creditNote.cancelSuccessMsg');
        }
      });
    if (this.id) {
      this.fileFacade.loadDocumentsList({
        customerId: null,
        docType: FileUploadDocTypeEnum.CN_WORKFLOW,
        fileType: FileUploadFileTypeEnum.OTHERS,
        id: this.id
      });
    }

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
      .getFileIds()
      .pipe(takeUntil(this.destroy$))
      .subscribe((ids: string[]) => {
        if (ids) {
          this.fileIds = ids;
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
            this.showAlertPopUpForUnipayVoid(
              'pw.creditNote.unipayAlertSuccessMsg',
              true
            );
          } else {
            this.showAlertConfirmationPopUpForUnipayVoid(
              'pw.creditNote.unipayAlertFailureMsg',
              data
            );
          }
        }
      });

    this.paymentFacade
      .getUpdateCNStatusForVoidUnipayRes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data) {
          this.cancelAutoApprovedCN();
        }
      });
    this.printingService
      .getIsMailSent()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isNotificationPrintSuccess: boolean) => {
        if (isNotificationPrintSuccess) {
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
        }
      )
    this.printingService
      .getPrintError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }
  showConfirmationNotification(key, requestNo) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.CUSTOM,
            message: translatedMessage + ' ' + requestNo,
            hasBackdrop: true,
            hasClose: true,
            template: this.confirmSuccessNotificationTemplate
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.hasNotification = false;
            if (event.eventType === OverlayNotificationEventType.CLOSE) {
              this.router.navigate([
                getCreditNoteUrl(CNSearchEnum.SENT_REQUESTS)
              ]);
            }
          });
      });
  }
  showConfirmRequestNotification() {
    this.summaryBar
      .open(SummaryBarType.CN, SummaryBarCNTypesEnum.CONFIRM)
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: SummaryBarEventRef) => {
        if (event.eventType === SummaryBarEventType.CONFRIM) {
          this.confirmButton = true;
          this.cancelButton = false;
          this.hasNotification = false;
          this.creditNoteFacade.confirmRequest({
            payload: { remarks: event.remarks, paymentDetails: null },
            workFlowType: this.workFlowType,
            id: this.requestDetails.id
          });
        }
      });
  }

  showPrintSummaryBarNotification() {
    this.summaryBar
      .open(SummaryBarType.CN, SummaryBarCNTypesEnum.PRINT)
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: SummaryBarEventRef) => {
        if (event.eventType === SummaryBarEventType.PRINT) {
          this.print(true);
        }
      })
  }

  showConfirmNotification(key, cnNumber) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.CUSTOM,
            // message: translatedMessage + ' ' + cnNumber,
            hasBackdrop: true,
            hasClose: true,
            template: this.confirmRequestNotificationTemplate
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.hasNotification = false;
            if (event.eventType === OverlayNotificationEventType.CLOSE) {
              this.router.navigate([
                getCreditNoteUrl(CNSearchEnum.SENT_REQUESTS)
              ]);
            }
          });
      });
  }

  showNotificaton(isCnAutoApproved = false, cnCancelPaymentRefundData = null) {
    let summaryBarType;
    this.cnCancelPaymentRefundData = cnCancelPaymentRefundData;
    switch (this.requestType) {
      case CNSearchEnum.REMOVE_GOLD_RATE:
        summaryBarType = SummaryBarCNTypesEnum.REMOVE_GOLD_RATE;
        break;
      case CNSearchEnum.ACTIVATE_CN:
        summaryBarType = SummaryBarCNTypesEnum.ACTIVATE_CN;
        break;
      case CNSearchEnum.CANCEL_CN:
        if (this.tabType === CNSearchEnum.CN_ACTIVITY) {
          summaryBarType =
            isCnAutoApproved === true
              ? SummaryBarCNTypesEnum.CN_CANCEL
              : SummaryBarCNTypesEnum.CN_REQUEST_FOR_APPROVAL;
        } else if (
          this.tabType === CNSearchEnum.SENT_REQUESTS &&
          this.status === CNSearchEnum.APPROVED
        ) {
          summaryBarType = SummaryBarCNTypesEnum.CN_CANCEL;
        }
        break;
      default:
        summaryBarType = SummaryBarCNTypesEnum.TRANSFER_TO_EGHS;
        break;
    }

    this.summaryBar
      .open(SummaryBarType.CN, summaryBarType)
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: SummaryBarEventRef) => {
        switch (event.eventType) {
          case SummaryBarEventType.CONFRIM: {
            if (
              this.tabType === CNSearchEnum.SENT_REQUESTS &&
              this.requestType === CNSearchEnum.CANCEL_CN &&
              this.status === CNSearchEnum.APPROVED
            ) {
              const requestPayload: CancelCnRequestPayload = {
                paymentDetails: {
                  data: cnCancelPaymentRefundData,
                  type: CreditNoteAPITypes.CN_REFUND_PAYMENT_DETAILS
                },
                id: this.requestDetails.id,
                creditNoteWorkFlowType: this.workFlowType,
                remarks: event.remarks
              };
              this.creditNoteFacade.cancelRequestApprovedCn(requestPayload);
            } else if (
              this.requestType === CNSearchEnum.REMOVE_GOLD_RATE ||
              this.requestType === CNSearchEnum.ACTIVATE_CN ||
              (this.requestType === CNSearchEnum.CANCEL_CN &&
                !this.creditNoteDetails?.isAutoApproved)
            ) {
              this.creditNoteFacade.raiseRequest({
                creditNoteType: this.workFlowType,
                id: this.id,
                payload: {
                  remarks: event.remarks,
                  tempFileIds:
                    this.fileIds.length > 0
                      ? {
                          OTHERS: this.fileIds
                        }
                      : null
                }
              });
            } else if (
              this.requestType === CNSearchEnum.CANCEL_CN &&
              this.creditNoteDetails?.isAutoApproved
            ) {
              this.enteredRemarks = event.remarks;
              if (
                this.cnCancelPaymentRefundData.paymentCode === 'VOID_UNIPAY'
              ) {
                this.voidUnipayPayment();
              } else {
                this.cancelAutoApprovedCN();
              }
            } else {
              if (
                this.creditNoteDetails?.amount >= this.transferAmt &&
                this.transferAmt &&
                this.transferAmt > 0 &&
                ((this.isAccountNumberReq && this.accountNum) ||
                  !this.isAccountNumberReq)
              ) {
                this.creditNoteFacade.transfterToEghs({
                  id: this.id,
                  payload: {
                    accountNumber: this.accountNum,
                    fiscalYear: this.creditNoteDetails?.fiscalYear,
                    locationCode: this.creditNoteDetails?.locationCode,
                    remarks: event.remarks,
                    transferAmount: this.transferAmt
                  }
                });
              } else {
                this.showNotificaton();
              }
            }
            break;
          }
        }
      });
  }
  showDownloadCreditNoteNotification() {
    this.summaryBar
      .open(SummaryBarType.CN, SummaryBarCNTypesEnum.CN_DOWNLOAD)
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: SummaryBarEventRef) => {
        switch (event.eventType) {
          case SummaryBarEventType.CONFRIM: {
            this.creditNoteFacade.downloadCN({
              id: this.cnId,
              ghsDocNo: this.ghsDocNo
            });
            break;
          }
        }
      });
  }
  showTransferEHSConfirmationNotification(key, requestNo) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.CUSTOM,
            message: translatedMessage + ' ' + requestNo,
            hasBackdrop: true,
            hasClose: true,
            template: this.transferToEGHSSuccessNotificationTemplate
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.hasNotification = false;
            if (event.eventType === OverlayNotificationEventType.CLOSE) {
              this.router.navigate([
                getCreditNoteUrl(CNSearchEnum.EGHS_TRANSFER)
              ]);
            }
          });
      });
  }
  showSuccessNotification(key: string) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage,
            hasClose: true
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            this.summaryBar.close();
            if (this.tabType === CNSearchEnum.SENT_REQUESTS) {
              this.router.navigate([
                getCreditNoteUrl(CNSearchEnum.SENT_REQUESTS)
              ]);
            } else if (this.tabType === CNSearchEnum.EGHS_TRANSFER) {
              this.router.navigate([
                getCreditNoteUrl(CNSearchEnum.EGHS_TRANSFER)
              ]);
            }
          });
      });
  }

  showCancelNotification() {
    this.summaryBar
      .open(SummaryBarType.CN, SummaryBarCNTypesEnum.CN_CANCEL_REQUEST)
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: SummaryBarEventRef) => {
        switch (event.eventType) {
          case SummaryBarEventType.CONFRIM: {
            this.hasNotification = false;
            this.confirmButton = false;
            this.cancelButton = true;
            this.creditNoteFacade.cancelRequest({
              remarks: event.remarks,
              workFlowType: this.workFlowType,
              id: this.requestDetails.id
            });
            break;
          }
        }
      });
  }
  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasBackdrop: true,
        hasClose: true,
        error: error
      })
      .events.pipe(take(1))
      .subscribe();
  }
  transferAmount(transferAmount: number) {
    this.transferAmt = transferAmount;
  }
  accountNumber(accountNumber: number) {
    this.accountNum = accountNumber;
  }
  isAccountNumReq(isAccountNumReq: boolean) {
    this.isAccountNumberReq = isAccountNumReq;
  }
  loadFileImageUrl(fileData: FileData) {
    let extn = fileData.name.split('.').pop();
    extn = extn.toLowerCase();
    switch (extn) {
      case FileTypeEnum.PDF:
        this.fileFacade.downloadPdfFile(fileData);
        break;
      case FileTypeEnum.JPG:
      case FileTypeEnum.JPEG:
        this.fileFacade.loadDocumentUrlById(fileData.id);
        break;
    }
  }

  cnRefundPaymentData(cnCancelPaymentRefundData: CnRefundPaymentData) {
    let isAutoApproved;
    if (this.tabType === CNSearchEnum.CN_ACTIVITY) {
      isAutoApproved = this.creditNoteDetails.isAutoApproved;
    } else {
      isAutoApproved = false;
    }
    this.showNotificaton(isAutoApproved, cnCancelPaymentRefundData);
  }
  isPaymentFormValid(isValidRefundDetails: boolean) {
    if (!isValidRefundDetails) {
      this.summaryBar.close();
    }
  }

  showPopup(image): void {
    this.dialog.open(FilePreviewComponent, {
      height: '490px',
      width: '700px',
      autoFocus: false,
      data: {
        imageUrl: image,
        previewHeader: 'File upload'
      }
    });
  }

  // unipay void flow

  voidUnipayPayment() {
    if (
      moment(
        this.cnCancelPaymentRefundData?.otherDetails?.originalDocDate
      ).format('L') === moment(this.bussinessDay).format('L')
    ) {
      const unipayPayload: UniPayRequest = {
        txnType: UnipayTransactionType.VOID,
        txnMode: UnipayTransactionMode.CR_DR,
        txnId: this.cnCancelPaymentRefundData?.otherDetails?.txnId,
        date: this.cnCancelPaymentRefundData?.otherDetails?.date,
        BankInvoiceNumber: this.cnCancelPaymentRefundData?.otherDetails
          ?.bankInvoiceNumber,
        unipayDetails: {
          hostName: this.cnCancelPaymentRefundData?.otherDetails?.hostName,
          unipayId: this.cnCancelPaymentRefundData?.otherDetails?.unipayId,
          amount: this.cnCancelPaymentRefundData?.otherDetails?.amount
        }
      };

      this.paymentFacade.voidUnipayPayment(unipayPayload);
    } else {
      this.showAlertPopUpForUnipayVoid(
        'pw.creditNote.unipayAlertDateFailureMsg',
        false
      );
    }
  }

  showAlertPopUpForUnipayVoid(message: string, cancelCN: boolean) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.INFO,
        message
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res && cancelCN) {
          this.paymentFacade.updateCNStatusForVoidUnipay(this.id);
        }
      });
  }

  showAlertConfirmationPopUpForUnipayVoid(
    message: string,
    unipayFailureResData
  ) {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.INFO,
        message,
        extraMessage: this.getHostnameAndUnipayId(unipayFailureResData),
        extraMessage1: 'pw.creditNote.unipayReasonForFailureMsg',
        unipayMsg: unipayFailureResData?.res?.response?.ResponseMessage,
        isUnipayFailure: true
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean | string) => {
        if (res === 'retry') {
          this.voidUnipayPayment();
        }
      });
  }

  cancelAutoApprovedCN() {
    const requestPayload: CancelCnRequestPayload = {
      paymentDetails: {
        data: this.cnCancelPaymentRefundData,
        type: CreditNoteAPITypes.CN_REFUND_PAYMENT_DETAILS
      },
      id: this.id,
      creditNoteWorkFlowType: this.workFlowType,
      remarks: this.enteredRemarks
    };
    this.creditNoteFacade.cancelAutoApprovedCn(requestPayload);
  }

  getHostnameAndUnipayId(data) {
    return (
      this.unipayDetailsMsg +
      data?.unipayDetails?.hostName +
      ' / ' +
      data?.unipayDetails?.unipayId +
      ' / ' +
      this.currencyFormatterService.format(data?.unipayDetails?.amount)
    );
  }

  print(isReprint?: boolean) {
    if ((this.creditNoteDetails && this.creditNoteDetails?.id) || this.requestDetails?.id) {
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
              printType: printTypesEnum.CN_CANCELLATION,
              transacionType: printTransactionTypesEnum.SALES,
              printFileType: printFileTypeEnum.INVOICE_PRINT,
              doctype: printDocTypeEnum.CUSTOMER_PRINT,
              reprint: isReprint,
              transacionId: this.creditNoteDetails ? this.creditNoteDetails?.id : this.requestDetails?.id,
              invoiceType: action
            });
          }
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.fileFacade.clearResponse();
    this.summaryBar.close();
    this.paymentFacade.resetCNStatus();
    this.printingService.resetPrint();
  }
}
