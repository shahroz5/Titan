import {
  Component,
  OnInit,
  OnDestroy,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import {
  CNDetailsInfo,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationEventRef,
  OverlayNotificationType,
  OverlayNotificationEventType,
  cnTransferTabEnum,
  ToolbarConfig,
  CustomErrors,
  SummaryBarServiceAbstraction,
  SummaryBarType,
  SummaryBarEventRef,
  SummaryBarEventType,
  SummaryBarCNTypesEnum,
  LocationSummaryList,
  CNStatusEnum,
  CreditNoteAPITypes,
  DocumentListResponse,
  FileUploadDocTypeEnum,
  FileUploadFileTypeEnum,
  FileTypeEnum,
  FileData,
  CreditNoteDetails,
  printTypesEnum,
  PrintingServiceAbstraction,
  printTransactionTypesEnum,
  printFileTypeEnum,
  printDocTypeEnum,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  PostTransactionConfirmationActionsServiceAbstraction,
  InvoiceDeliveryTypes
} from '@poss-web/shared/models';
import { ToolbarFacade } from '@poss-web/shared/toolbar/data-access-toolbar';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import { getCreditNoteTransferUrl } from '@poss-web/shared/util-site-routes';
import { FilePreviewComponent } from '@poss-web/shared/components/ui-file-upload';
import { FileFacade } from '@poss-web/shared/file-upload/data-access-file-upload';
import { CreditNoteTransferFacade } from '@poss-web/poss/cn-transfer/data-access-cn-transfer';
import { CreditNoteFacade } from '@poss-web/poss/credit-note/data-access-cn';

@Component({
  selector: 'poss-web-cn-transfer-details',
  templateUrl: './cn-transfer-details.component.html'
})
export class CnTransferDetailsComponent implements OnInit, OnDestroy {
  toolbarData: ToolbarConfig = {
    txnType: null,
    subTxnType: null,
    loadMetalPrices: true,
    loadHoldPopup: false,
    loadOpenOrdersPopup: false
  };

  tab: cnTransferTabEnum;
  cnTransferTabEnumRef = cnTransferTabEnum;
  srcLocationCode: string;
  id: string;
  taskId: string;
  taskName: string;
  workFlowType: string;
  cnDetails: CNDetailsInfo = null;
  requestNo = null;
  isCustomerSelected: false;
  destroy$: Subject<null> = new Subject<null>();
  isLoading$: Observable<boolean>;

  isApproved = null;
  updatedCnResponse = null;
  locationForSelection: LocationSummaryList[] = [];
  selectedLocationDetails = null;

  transferRequestMsg: string;
  requestnoLabelText: string;
  transferApproveMsg: string;
  transferRejectMsg: string;
  transferCancelMsg: string;
  transferInwardMsg: string;
  printButtonLabel: string;
  newCnnumText: string;
  filesList: DocumentListResponse[];
  fileIds: string[] = [];
  receivedCNDetailStatus: string;
  creditNoteDetails: CreditNoteDetails;

  @ViewChild('requestSuccessNotificationTemplate', { static: true })
  requestSuccessNotificationTemplate: TemplateRef<any>;

  @ViewChild('inwardSuccessNotificationTemplate', { static: true })
  inwardSuccessNotificationTemplate: TemplateRef<any>;

  @ViewChild('approveOrRejectSuccessNotificationTemplate', { static: true })
  approveOrRejectSuccessNotificationTemplate: TemplateRef<any>;

  @ViewChild('transferRequestCancelledNotificationTemplate', { static: true })
  transferRequestCancelledNotificationTemplate: TemplateRef<any>;

  //#region 'resource file literal keys'
  readonly transferRequestMsgKey: string = 'pw.creditNote.transferRequestMsg';
  readonly requestNoLabelTextKey: string = 'pw.creditNote.requestNoLabelText';
  readonly transferApproveMsgKey: string = 'pw.creditNote.transferApproveMsg';
  readonly transferRejectMsgKey: string = 'pw.creditNote.transferRejectMsg';
  readonly transferCancelMsgKey: string = 'pw.creditNote.transferCancelMsg';
  readonly transferInwardMsgKey: string = 'pw.creditNote.transferInwardMsg';
  readonly printButttonLabelKey: string = 'pw.regularCashMemo.printButtonTxt';
  readonly newCNNumTextKey: string = 'pw.creditNote.newCNNumText';
  //#endregion

  constructor(
    private translate: TranslateService,
    private cnTransferFacade: CreditNoteTransferFacade,
    private activatedRoute: ActivatedRoute,
    private toolbarFacade: ToolbarFacade,
    private customerFacade: CustomerFacade,
    // private authFacade: AuthFacade,
    private router: Router,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private summaryBar: SummaryBarServiceAbstraction,
    private fileFacade: FileFacade,
    private dialog: MatDialog,
    private creditNoteFacade: CreditNoteFacade,
    public printingService: PrintingServiceAbstraction,
    private alertPopupService: AlertPopupServiceAbstraction,
    private postConfirmationActions: PostTransactionConfirmationActionsServiceAbstraction,
  ) {
    this.tab = this.activatedRoute.snapshot.params['tab'];
    this.srcLocationCode = this.activatedRoute.snapshot.params['_locationCode'];
    this.id = this.activatedRoute.snapshot.params['_id'];
    this.taskId = this.activatedRoute.snapshot.params['_taskId'];
    this.taskName = this.activatedRoute.snapshot.params['_taskName'];
  }

  ngOnInit(): void {
    this.cnTransferFacade.resetCnTransfer();
    this.toolbarFacade.setToolbarConfig(this.toolbarData);
    this.customerFacade.clearSelectedCustomer();
    this.cnTransferFacade.loadLocationCodes();
    this.cnTransferFacade
      .getLocationCodes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((locations: LocationSummaryList[]) => {
        if (locations) {
          this.locationForSelection = locations.map(location => ({
            locationCode: location.locationCode,
            description: location.description
          }));
          this.getselectedLocationDetails();
        }
      });
    this.customerFacade
      .getIsCustomerSelected()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => (this.isCustomerSelected = data));

    this.cnTransferFacade
      .getSelectedCreditNoteDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.cnDetails = data;
          this.customerFacade.loadSelectedCustomer(
            String(this.cnDetails?.customerId),
            false,
            false
          );
          this.getselectedLocationDetails();
          this.showNotification();

          this.fileFacade.loadDocumentsList({
            customerId: null,
            docType: FileUploadDocTypeEnum.CN_WORKFLOW,
            fileType: FileUploadFileTypeEnum.OTHERS,
            id: this.id,
            locationCode: this.cnDetails?.locationCode
              ? this.cnDetails?.locationCode
              : null
          });

          this.creditNoteFacade.loadCreditNoteDetails(
            this.cnDetails.id
          );
        }
      });
    this.loadData();
    this.cnTransferFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.cnTransferFacade
      .getRaisedRequestDocNo()
      .pipe(takeUntil(this.destroy$))
      .subscribe(docNo => {
        if (docNo) {
          this.requestNo = docNo;
          this.successNotificationOverlay(
            this.requestSuccessNotificationTemplate
          );
        }
      });
    this.cnTransferFacade
      .getIsApprovedOrRejectedStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.successNotificationOverlay(
            this.approveOrRejectSuccessNotificationTemplate
          );
        }
      });
    this.cnTransferFacade
      .getIsCnTransferRquestCancelled()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.successNotificationOverlay(
            this.transferRequestCancelledNotificationTemplate
          );
        }
      });
    this.cnTransferFacade
      .getCnUpdateResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.updatedCnResponse = null;
        if (data) {
          this.updatedCnResponse = data;
          this.successNotificationOverlay(
            this.inwardSuccessNotificationTemplate
          );
        }
      });
    this.isLoading$ = this.cnTransferFacade.getIsLoading();
    this.translateLabels();
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

    this.creditNoteFacade
      .getCreditNoteDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((creditNoteDetails: CreditNoteDetails) => {
        if (creditNoteDetails) {
          this.creditNoteDetails = creditNoteDetails;
          this.receivedCNDetailStatus = this.creditNoteDetails.status.toUpperCase();
        }
      });

    this.printingService
      .getIsNotificationMailSent()
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

    this.printingService
      .getPrintError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }
  translateLabels() {
    this.translate
      .get([
        this.transferRequestMsgKey,
        this.requestNoLabelTextKey,
        this.transferApproveMsgKey,
        this.transferRejectMsgKey,
        this.transferCancelMsgKey,
        this.transferInwardMsgKey,
        this.newCNNumTextKey,
        this.printButttonLabelKey
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.transferRequestMsg = translatedMsg[this.transferRequestMsgKey];
        this.requestnoLabelText = translatedMsg[this.requestNoLabelTextKey];
        this.transferApproveMsg = translatedMsg[this.transferApproveMsgKey];
        this.transferRejectMsg = translatedMsg[this.transferRejectMsgKey];
        this.transferCancelMsg = translatedMsg[this.transferCancelMsgKey];
        this.transferInwardMsg = translatedMsg[this.transferInwardMsgKey];
        this.newCnnumText = translatedMsg[this.newCNNumTextKey];
        this.printButtonLabel = translatedMsg[this.printButttonLabelKey];
      });
  }
  loadData() {
    this.cnTransferFacade.loadSelectedCreditNoteDetailsById({
      tab: this.tab,
      srcBtqCode: this.srcLocationCode,
      id: this.id,
      taskId: this.taskId,
      taskName: this.taskName,
      workflowType: CreditNoteAPITypes.CREDIT_NOTE_TRANSFER
    });
  }
  showNotification() {
    this.overlayNotification.close();
    this.summaryBar.close();

    if (this.tab === cnTransferTabEnum.SEARCH) {
      this.showRequestTransferOverlay();
    } else if (this.tab === cnTransferTabEnum.SENT_REQUESTS) {
      if (this.cnDetails?.approvalStatus === CNStatusEnum.APPROVED) {
        this.showInwardNotificationOverlay();
      } else if (this.cnDetails?.approvalStatus === CNStatusEnum.PENDING) {
        this.showCancelRequestNotificationOverlay();
      }
    } else {
      if (this.cnDetails?.approvalStatus === CNStatusEnum.PENDING) {
        this.showApproveOrRejectNotificationOverlay();
      }
    }
  }
  showRequestTransferOverlay() {
    this.summaryBar.close();
    this.summaryBar
      .open(SummaryBarType.CN, SummaryBarCNTypesEnum.CN_TRANSFER_RAISE_REQUEST)
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: SummaryBarEventRef) => {
        if (event.eventType === SummaryBarEventType.CONFRIM) {
          if (event.remarks) {
            this.showProgressNotification();
            this.cnTransferFacade.raiseTransferRequest({
              id: this.id,
              remarksDto: {
                approverLocationCode: this.srcLocationCode,
                remarks: event.remarks,
                tempFileIds:
                  this.fileIds.length > 0
                    ? {
                        OTHERS: this.fileIds
                      }
                    : null
              }
            });
          } else {
            this.remarksMandatoryNotification();
          }
        }
      });
  }
  showInwardNotificationOverlay() {
    this.summaryBar
      .open(SummaryBarType.CN, SummaryBarCNTypesEnum.CN_TRANSFER_INWARD)
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: SummaryBarEventRef) => {
        if (event.eventType === SummaryBarEventType.CONFRIM) {
          if (event.remarks) {
            this.showProgressNotification();

            this.cnTransferFacade.inwardCN({
              workflowType: CreditNoteAPITypes.CREDIT_NOTE_TRANSFER,
              id: this.cnDetails.headerData.data.id,
              remarksDto: {
                remarks: event.remarks
              }
            });
          } else {
            this.remarksMandatoryNotification();
          }
        }
      });
  }
  showCancelRequestNotificationOverlay() {
    this.summaryBar
      .open(SummaryBarType.CN, SummaryBarCNTypesEnum.CN_TRANSFER_CANCEL_REQUEST)
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: SummaryBarEventRef) => {
        if (event.eventType === SummaryBarEventType.CONFRIM) {
          if (event.remarks) {
            this.showProgressNotification();
            this.cnTransferFacade.cancelRequest({
              workflowType: CreditNoteAPITypes.CREDIT_NOTE_TRANSFER,
              id: this.cnDetails.headerData.data.id,
              remarksDto: {
                remarks: event.remarks
              }
            });
          } else {
            this.remarksMandatoryNotification();
          }
        }
      });
  }
  showApproveOrRejectNotificationOverlay() {
    this.summaryBar
      .open(SummaryBarType.CN, SummaryBarCNTypesEnum.CN_TRANSFER_APPROVE_REJECT)
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: SummaryBarEventRef) => {
        switch (event.eventType) {
          case SummaryBarEventType.CANCEL: {
            if (event.remarks) {
              this.showProgressNotification();
              this.isApproved = false;
              this.cnTransferFacade.approveOrRejectCNTransfer({
                workflowType: CreditNoteAPITypes.CREDIT_NOTE_TRANSFER,
                id: this.cnDetails.headerData.data.id,
                remarksDto: {
                  remarks: event.remarks
                },
                status: CNStatusEnum.REJECTED
              });
            } else {
              this.remarksMandatoryNotification();
            }

            break;
          }
          case SummaryBarEventType.CONFRIM: {
            this.showProgressNotification();
            this.isApproved = true;
            this.cnTransferFacade.approveOrRejectCNTransfer({
              workflowType: CreditNoteAPITypes.CREDIT_NOTE_TRANSFER,
              id: this.cnDetails.headerData?.data?.id,
              remarksDto: {
                remarks: event.remarks
              },
              status: CNStatusEnum.APPROVED
            });
            break;
          }
        }
      });
  }
  showProgressNotification() {
    const key = 'pw.creditNote.progressMessage';
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.PROGRESS,
            message: translatedMsg,
            hasBackdrop: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe();
      });
  }
  successNotificationOverlay(templateRef: TemplateRef<any>) {
    this.overlayNotification.close();
    this.overlayNotification
      .show({
        type: OverlayNotificationType.CUSTOM,
        hasClose: true,
        hasBackdrop: true,
        template: templateRef
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        if (event.eventType === OverlayNotificationEventType.CLOSE) {
          this.back();
        }
      });
  }
  remarksMandatoryNotification() {
    this.translate
      .get('pw.errorMessages.ERR-SALE-170')
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMsg,
            hasBackdrop: false,
            hasClose: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe();
      });
  }
  /**
   * Error handler method
   * @param error:error Object
   */
  errorHandler(error: any) {
    this.overlayNotification.close();
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true,
        error: error
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        this.showNotification();
      });
  }
  back() {
    this.cnTransferFacade.resetCnTransfer();
    this.router.navigate([getCreditNoteTransferUrl(this.tab)]);
  }
  getselectedLocationDetails(): LocationSummaryList {
    this.selectedLocationDetails = null;
    if (this.cnDetails && this.locationForSelection.length) {
      this.selectedLocationDetails = this.locationForSelection.find(
        location => {
          if (
            this.tab === cnTransferTabEnum.SEARCH ||
            this.tab === cnTransferTabEnum.RECEIVED_REQUESTS
          ) {
            if (location.locationCode === this.cnDetails.locationCode) {
              return location;
            }
          } else if (this.tab === cnTransferTabEnum.SENT_REQUESTS) {
            if (
              location.locationCode ===
              this.cnDetails?.headerData?.data?.approverLocationCode
            ) {
              return location;
            }
          }
        }
      );
    }
    return null;
  }
  loadFileImageUrl(fileData: FileData) {
    let extn = fileData.name.split('.').pop();
    extn = extn.toLowerCase();
    if (extn === FileTypeEnum.PDF) {
      this.fileFacade.downloadPdfFile({
        ...fileData,
        locationCode: this.cnDetails?.locationCode
      });
    } else if (extn === FileTypeEnum.JPG || extn === FileTypeEnum.JPEG) {
      this.fileFacade.loadDocumentUrlById(
        fileData.id,
        this.cnDetails?.locationCode
      );
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

  print() {
    if (this.updatedCnResponse.id) {
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
              printType: printTypesEnum.CREDIT_NOTE,
              transacionId: this.updatedCnResponse.id,
              productCode: this.updatedCnResponse.id,
              printFileType: printFileTypeEnum.INVOICE_PRINT,
              doctype: printDocTypeEnum.CUSTOMER_PRINT,
              reprint: false,
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

  ngOnDestroy(): void {
    this.summaryBar.close();
    this.destroy$.next();
    this.destroy$.complete();
    this.fileFacade.clearResponse();
    this.printingService.resetPrint();
  }
}
