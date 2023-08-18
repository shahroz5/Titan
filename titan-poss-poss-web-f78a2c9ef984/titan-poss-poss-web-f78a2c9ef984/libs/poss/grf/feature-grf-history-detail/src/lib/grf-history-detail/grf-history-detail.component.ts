import { Component, OnDestroy, OnInit } from '@angular/core';
import { CtGrfFacade } from '@poss-web/poss/grf/data-access-grf';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import {
  SubTransactionTypeEnum,
  TransactionTypeEnum,
  SummaryBarServiceAbstraction,
  SummaryBarType,
  SummaryBarEventRef,
  SummaryBarEventType,
  printTypesEnum,
  printDocTypeEnum,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  OverlayNotificationEventRef,
  CustomErrors,
  printFileTypeEnum,
  printTransactionTypesEnum,
  GoldRateFreezeEnumTypes,
  PaymentDetails,
  PaymentModeEnum,
  PrintingServiceAbstraction,
  PostTransactionConfirmationActionsServiceAbstraction,
  AlertPopupServiceAbstraction,
  InvoiceDeliveryTypes,
  AlertPopupTypeEnum,
  HistorySearchParamDetails,
  RsoNameObject
} from '@poss-web/shared/models';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import * as moment from 'moment';
// import { PrintingService } from '@poss-web/shared/printing/feature-printing';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { FileFacade } from '@poss-web/shared/file-upload/data-access-file-upload';
import { MatDialog } from '@angular/material/dialog';
import { FilePreviewComponent } from '@poss-web/shared/components/ui-file-upload';

@Component({
  selector: 'poss-web-grf-history-detail',
  templateUrl: './grf-history-detail.component.html'
})
export class GrfHistoryDetailComponent implements OnInit, OnDestroy {
  selectedHistoryItem: any;
  isLoading$: Observable<boolean>;
  isCommonFacadeLoading$: Observable<boolean>;
  isCustomerFacadeLoading$: Observable<boolean>;
  moment = moment;
  currencyCode = '';
  printErrorText: string;
  destroy$: Subject<null> = new Subject<null>();
  summaryBarRemarks$ = new Subject<string>();
  mergedItemPaymentDetails: PaymentDetails[] = [];
  totalPaidAmount = 0;
  filesList: any;
  imageUrl: string;
  defaultImageUrl = 'assets/img/product-default-image.svg';
  rsoNamesList: RsoNameObject[] = [];
  selectedRsoObj: RsoNameObject = {
    value: '',
    description: ''
  };
  customerId: number;

  constructor(
    private grfFacade: CtGrfFacade,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private commonFacade: CommonFacade,
    private customerFacade: CustomerFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private summaryBar: SummaryBarServiceAbstraction,
    public printingService: PrintingServiceAbstraction,
    private fileFacade: FileFacade,
    private dialog: MatDialog,
    private postConfirmationActions: PostTransactionConfirmationActionsServiceAbstraction,
    private alertPopUpService: AlertPopupServiceAbstraction
  ) {}

  ngOnInit(): void {
    this.imageUrl = null;
    this.dialog.closeAll();
    this.commonFacade.setGrfGoldWeight(0);
    this.fileFacade.clearResponse();
    this.grfFacade.loadRsoDetails('RSO');
    const transactionId = this.activatedRoute.snapshot.params['_id'];
    const subTxnType = this.activatedRoute.snapshot.params['grfType'];
    this.isLoading$ = this.grfFacade.getIsLoading();
    this.isCommonFacadeLoading$ = this.grfFacade.getIsLoading();
    this.isCustomerFacadeLoading$ = this.grfFacade.getIsLoading();
    this.grfFacade.getViewGrfDetails(subTxnType, transactionId);
    this.fileFacade.clearResponse();
    this.grfFacade
      .getRsoDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((rsoNamesList: RsoNameObject[]) => {
        this.rsoNamesList = rsoNamesList;
      });
    this.fileFacade.loadDocumentsList({
      customerId: null,
      docType: 'MERGE_GRF',
      fileType: 'OTHERS',
      id: transactionId
    });

    this.grfFacade
      .getViewGrfResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((grfResponse: any) => {
        if (grfResponse) {
          this.selectedRsoObj = this.getRsoObjFromCode(
            grfResponse?.employeeCode
          );
          if (grfResponse.mergedCNs && grfResponse.mergedCNs.length > 0) {
            this.commonFacade.setTransactionConfig(null);
            let totalAmount = 0;
            grfResponse.mergedCNs.forEach(cnData => {
              totalAmount = totalAmount + cnData.amount;
            });
            this.totalPaidAmount = totalAmount;
            const paymentDetails = grfResponse.mergedCNs.map(
              (mergedCNData: any) => {
                return {
                  amount: mergedCNData.amount,
                  instrumentDate: moment(mergedCNData.docData),
                  paymentCode: PaymentModeEnum.CREDIT_NOTE,
                  instrumentNo: mergedCNData.docNo,
                  isDeletable: false,
                  isEditable: false,
                  id: mergedCNData.id
                };
              }
            );
            this.mergedItemPaymentDetails = [...paymentDetails];
            this.commonFacade.setTransactionConfig({
              showPayment: false,
              isPaymentEditable: false,
              showRemainingAmount: false,
              transactionType: {
                type: TransactionTypeEnum.ADV,
                subType: SubTransactionTypeEnum.FROZEN_RATES
              },
              transactionID: transactionId
            });
          } else {
            this.mergedItemPaymentDetails = [];
            this.commonFacade.setTransactionConfig({
              isPaymentEditable: false,
              showRemainingAmount: false,
              transactionType: {
                type: TransactionTypeEnum.ADV,
                subType: SubTransactionTypeEnum.FROZEN_RATES
              },
              transactionID: transactionId
            });
          }
          this.customerId = grfResponse.customerId;
          this.customerFacade.loadSelectedCustomer(
            grfResponse.customerId,
            false,
            false
          );
          // this.commonFacade.setTransactionConfig({
          // this.commonFacade.setTransactionConfig({
          //   isPaymentEditable: false,
          //   transactionType: {
          //     type: TransactionTypeEnum.ADV,
          //     subType: SubTransactionTypeEnum.FROZEN_RATES
          //   },
          //   transactionID: transactionId
          // });
          this.customerId = grfResponse.customerId;
          this.customerFacade.loadSelectedCustomer(
            grfResponse.customerId,
            false,
            false
          );
          this.selectedHistoryItem = grfResponse;
          this.showSummaryBar();
          // this.commonFacade.setTransactionTotalAmount(
          //   this.selectedHistoryItem.finalValue
          // );
          this.commonFacade.setTransactionTotalAmount(
            this.selectedHistoryItem.finalValue
          );
          this.grfFacade.setTotalAmount(this.selectedHistoryItem.finalValue);
          const frozenGoldWeightObj = this.selectedHistoryItem
            .frozenRateDetails;
          const goldWeight =
            frozenGoldWeightObj &&
            frozenGoldWeightObj.data &&
            frozenGoldWeightObj.data.weight
              ? frozenGoldWeightObj.data.weight
              : null;
          this.currencyCode = this.selectedHistoryItem.currencyCode;
          this.grfFacade.setGoldWeight(goldWeight);
          this.commonFacade.setGrfGoldWeight(goldWeight);
          if (this.selectedHistoryItem && this.selectedHistoryItem.remarks) {
            this.summaryBarRemarks$.next(this.selectedHistoryItem.remarks);
          }
        }
      });
    this.grfFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error && error.code) {
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
    this.fileFacade
      .getDocumentsLst()
      .pipe(takeUntil(this.destroy$))
      .subscribe(docs => {
        if (docs) {
          console.log('docs123', docs);
          this.filesList = docs;
        }
      });

    this.fileFacade
      .getDocumentUrlById()
      .pipe(takeUntil(this.destroy$))
      .subscribe(docUrl => {
        if (docUrl) {
          this.imageUrl = docUrl;
          this.showPopup();
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
  }

  showSummaryBar(): void {
    this.summaryBar
      .open(SummaryBarType.GRF, {
        status: this.selectedHistoryItem.status,
        type: GoldRateFreezeEnumTypes.HISTORY,
        remarks: this.summaryBarRemarks$.asObservable()
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: SummaryBarEventRef) => {
        switch (event.eventType) {
          case SummaryBarEventType.PRINT: {
            this.printGrfConfirmedTransaction(this.selectedHistoryItem.id);
          }
        }
      });
  }
  showPopup(): void {
    this.dialog.open(FilePreviewComponent, {
      height: '490px',
      width: '700px',
      autoFocus: false,
      data: {
        defaultImageUrl: this.defaultImageUrl,
        imageUrl: this.imageUrl,
        previewHeader: 'File upload'
      }
    });
  }

  printGrfConfirmedTransaction(transactionId: string) {
    console.log('TRANSACTION ID :', transactionId, ' ', 'IN PRINT');

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

          if (
            this.selectedHistoryItem &&
            this.selectedHistoryItem.mergedCNs &&
            this.selectedHistoryItem.mergedCNs.length > 0
          ) {
            this.printingService.loadPrintData({
              printType: printTypesEnum.MERGE_GRF,
              transacionId: transactionId,
              transacionType: printTransactionTypesEnum.SALES,
              printFileType: printFileTypeEnum.INVOICE_PRINT,
              doctype: printDocTypeEnum.CUSTOMER_PRINT,
              reprint: true,
              customerId: this.customerId,
              invoiceType: action
            });
          } else {
            this.printingService.loadPrintData({
              printType: printTypesEnum.GRF,
              transacionId: transactionId,
              transacionType: printTransactionTypesEnum.SALES,
              printFileType: printFileTypeEnum.INVOICE_PRINT,
              doctype: printDocTypeEnum.CUSTOMER_PRINT,
              reprint: true,
              customerId: this.customerId,
              invoiceType: action
            });
          }
        }
      });
  }

  showAlertPopUp(message: string) {
    this.alertPopUpService
      .open({
        type: AlertPopupTypeEnum.INFO,
        message
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  errorHandler(error: CustomErrors) {
    if (error.code === ErrorEnums.ERR_QZ_TRAY) {
      this.printError(error.message);
    } else {
      this.overlayNotification
        .show({
          type: OverlayNotificationType.ERROR,
          hasClose: true, // optional
          error: error,
          hasBackdrop: true
        })
        .events.pipe(takeUntil(this.destroy$))
        .subscribe();
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
        // this.showAcceptAdvanceSuccessNotification(); //call your respective success overlay method
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
  loadImageUrl(id) {
    this.imageUrl = null;
    this.fileFacade.loadDocumentUrlById(id);
  }

  dateFormat(date) {
    return moment(date);
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

  ngOnDestroy(): void {
    // this.commonFacade.clearTransactionConfig();
    this.commonFacade.clearTransactionConfig();
    this.printingService.resetPrint();
    this.summaryBar.close();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
