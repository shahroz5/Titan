import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import { Observable, Subject } from 'rxjs';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { ToolbarFacade } from '@poss-web/shared/toolbar/data-access-toolbar';
import { GepFacade } from '@poss-web/poss/gep/data-access-gep';
import { SharedBodEodFacade } from '@poss-web/shared/bod-eod/data-access-bod-eod';
import {
  CustomErrors,
  FileTypeEnum,
  GepTransactionTypesEnum,
  InvoiceDeliveryTypes,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  printDocTypeEnum,
  printFileTypeEnum,
  PrintingServiceAbstraction,
  printTransactionTypesEnum,
  printTypesEnum,
  SetTotalProductValuesPayload,
  SubTransactionTypeEnum,
  SummaryBarEventRef,
  SummaryBarEventType,
  SummaryBarServiceAbstraction,
  SummaryBarType,
  ToolbarConfig,
  TransactionTypeEnum,
  PostTransactionConfirmationActionsServiceAbstraction,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum
} from '@poss-web/shared/models';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { FileFacade } from '@poss-web/shared/file-upload/data-access-file-upload';
import { MatDialog } from '@angular/material/dialog';
import { FilePreviewComponent } from '@poss-web/shared/components/ui-file-upload';
import { ProductFacade } from '@poss-web/poss/shared/product/data-access-product';

@Component({
  selector: 'poss-web-gep-view',
  templateUrl: './gep-view.component.html'
})
export class GepViewComponent implements OnInit, OnDestroy {
  selectedHistoryItem: any;
  isLoading$: Observable<boolean>;
  isCommonFacadeLoading$: Observable<boolean>;
  isCustomerFacadeLoading$: Observable<boolean>;
  productGrid: any;
  destroy$: Subject<null> = new Subject<null>();
  summaryBarRemarks$ = new Subject<string>();
  txnId: any;
  txnType: any;
  subTxnType: any;
  dateFormat: any;

  toolbarData: ToolbarConfig = {
    txnType: TransactionTypeEnum.GEP,
    subTxnType: SubTransactionTypeEnum.NEW_GEP,
    loadMetalPrices: true,
    loadHoldPopup: false,
    loadOpenOrdersPopup: false
  };
  printErrorText: string;

  fileUploadLabel: string;
  fileType = 'OTHERS';
  docType = TransactionTypeEnum.GEP;

  defaultImageUrl = 'assets/img/product-default-image.svg';
  filesList: any;
  rso: any;
  customerId: number;

  constructor(
    private gepFacade: GepFacade,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private commonFacade: CommonFacade,
    private customerFacade: CustomerFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private summaryBar: SummaryBarServiceAbstraction,
    public printingService: PrintingServiceAbstraction,
    private translate: TranslateService,
    private toolbarFacade: ToolbarFacade,
    private bodeodFacade: SharedBodEodFacade,
    private appSettingFacade: AppsettingFacade,
    private fileFacade: FileFacade,

    private dialog: MatDialog,
    private postConfirmationActions: PostTransactionConfirmationActionsServiceAbstraction,
    private alertPopUpService: AlertPopupServiceAbstraction,
    private regularFacade: ProductFacade
  ) {}

  ngOnInit(): void {
    //this.gepFacade.resetGep();
    this.txnId = this.activatedRoute.snapshot.params['_id'];
    this.txnType = this.activatedRoute.snapshot.params['_txntype'];
    this.subTxnType = this.activatedRoute.snapshot.params['_subTxntype'];
    this.isLoading$ = this.gepFacade.getIsLoaded();
    this.isCommonFacadeLoading$ = this.gepFacade.getIsLoaded();
    this.isCustomerFacadeLoading$ = this.gepFacade.getIsLoaded();
    this.gepFacade.getViewGEPDetails(this.txnId, this.subTxnType);
    this.regularFacade.loadRSODetails('RSO');

    this.overlayNotification.close();
    this.bodeodFacade.loadLatestBusinessDay();
    this.summaryBar.close();
    this.toolbarFacade.setToolbarConfig(this.toolbarData);

    this.isLoading$ = this.gepFacade.getIsLoaded();

    this.appSettingFacade
      .getDateFormat()
      .pipe(takeUntil(this.destroy$))
      .subscribe((format: string) => {
        this.dateFormat = format;
      });

    this.fileFacade.loadDocumentsList({
      customerId: null,
      docType: this.docType,
      fileType: this.fileType,
      id: this.txnId
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

    this.translate
      .get([
        'pw.printerConfiguration.printError',
        'pw.gepHistory.gepFileUploadedLabel'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.printErrorText =
          translatedMessages['pw.printerConfiguration.printError'];
        this.fileUploadLabel =
          translatedMessages['pw.gepHistory.gepFileUploadedLabel'];
      });

    this.gepFacade
      .getViewGEPResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((gepResponse: any) => {
        if (gepResponse) {
          this.customerId = gepResponse.customerId;
          this.customerFacade.loadSelectedCustomer(
            gepResponse.customerId,
            false,
            false
          );
          this.selectedHistoryItem = gepResponse;
          this.setSummaryConfig();
          gepResponse.itemIdList.forEach(element => {
            this.gepFacade.loadGepItem({
              id: gepResponse.id,
              itemId: element,
              subTxnType: this.subTxnType
            });
          });
          this.showSummaryBar();
        }
      });

    this.gepFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error && error.code) {
          this.errorHandler(error);
        }
      });

    this.gepFacade
      .getgepProductDetail()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        if (data) {
          this.productGrid = data;
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

    this.regularFacade
      .getRSODetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data) {
          this.rso = data.map(rso => ({
            value: rso.code,
            description: rso.name
          }));
        }
      });
  }

  loadFileImageUrl(fileData) {
    let extn = fileData.name.split('.').pop();
    extn = extn.toLowerCase();
    if (extn === FileTypeEnum.PDF) this.fileFacade.downloadPdfFile(fileData);
    else extn === FileTypeEnum.JPG || extn === FileTypeEnum.JPEG;
    this.fileFacade.loadDocumentUrlById(fileData.id);
  }

  showPopup(image): void {
    this.dialog.open(FilePreviewComponent, {
      height: '490px',
      width: '700px',
      autoFocus: false,
      data: {
        defaultImageUrl: this.defaultImageUrl,
        imageUrl: image,
        previewHeader: this.fileUploadLabel
      }
    });
  }

  setSummaryConfig() {
    const totalValues: SetTotalProductValuesPayload = {
      productQty: this.selectedHistoryItem.totalQuantity,
      productWeight: this.selectedHistoryItem.totalWeight,
      productDisc: 0,
      productAmt: 0,
      taxAmt: 0,
      totalAmt: this.selectedHistoryItem.finalValue,
      coinQty: 0,
      coinWeight: 0,
      coinDisc: 0,
      coinAmt: 0,
      finalAmt: this.selectedHistoryItem.totalValue,
      hallmarkCharges: 0,
      hallmarkDiscount: 0
    };

    this.commonFacade.setGEPTotalProductValues(totalValues);
  }

  showSummaryBar(): void {
    this.summaryBar
      .open(SummaryBarType.GEP, {
        type: GepTransactionTypesEnum.HISTORY,
        status: this.selectedHistoryItem.status
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: SummaryBarEventRef) => {
        switch (event.eventType) {
          case SummaryBarEventType.PRINT: {
            this.printGEPSummary(this.selectedHistoryItem.id);
          }
        }
      });
  }

  printGEPSummary(transactionId: string) {
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
              this.selectedHistoryItem.status === 'CONFIRMED'
                ? printTypesEnum.GEP_PRINTS
                : printTypesEnum.GEP_CANCEL_PRINTS,
            transacionId: transactionId,
            transacionType: printTransactionTypesEnum.SALES,
            printFileType: printFileTypeEnum.INVOICE_PRINT,
            doctype: printDocTypeEnum.CUSTOMER_PRINT,
            reprint: true,
            customerId: this.customerId,
            invoiceType: action
          });
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
      this.printError();
    } else {
      this.overlayNotification.show({
        type: OverlayNotificationType.ERROR,
        hasClose: true,
        error: error
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
      .subscribe();
  }

  ngOnDestroy(): void {
    this.txnId = null;

    this.gepFacade.resetGep();
    this.commonFacade.clearTransactionConfig();
    this.fileFacade.clearResponse();
    this.summaryBar.close();
    this.overlayNotification.close();
    this.customerFacade.clearCustomerSearch();
    this.destroy$.next();
    this.destroy$.complete();
    this.summaryBarRemarks$.next('');
    this.printingService.resetPrint();
    this.toolbarFacade.setToolbarConfig({
      loadMetalPrices: true,
      loadHoldPopup: false,
      loadOpenOrdersPopup: false
    });
  }
}
