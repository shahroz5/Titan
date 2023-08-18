import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Observable, Subject, of, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';

import {
  CashMemoDetailsResponse,
  OverlayNotificationServiceAbstraction,
  TransactionTypeEnum,
  SubTransactionTypeEnum,
  SummaryBarType,
  SummaryBarEventRef,
  SummaryBarEventType,
  OverlayNotificationType,
  SummaryBarServiceAbstraction,
  printTypesEnum,
  printTransactionTypesEnum,
  printFileTypeEnum,
  printDocTypeEnum,
  CustomErrors,
  CashMemoRouteEnum,
  CommomStateAttributeTypeEnum,
  CommomStateAttributeNameEnum,
  CashMemoItemDetailsResponse,
  PrintingServiceAbstraction,
  DocumentListResponse,
  SetTotalProductValuesPayload,
  CashMemoItemDetails,
  AddFocToCmResponsePayload,
  FileTypeEnum,
  PostTransactionConfirmationActionsServiceAbstraction,
  AlertPopupServiceAbstraction,
  InvoiceDeliveryTypes,
  AlertPopupTypeEnum,
  RsoDetailsPayload
} from '@poss-web/shared/models';
import { ActivatedRoute } from '@angular/router';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import { CashMemoFacade } from '@poss-web/poss/cash-memo/data-access-cash-memo';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { TranslateService } from '@ngx-translate/core';
import { ProductFacade } from '@poss-web/poss/shared/product/data-access-product';
import { FileFacade } from '@poss-web/shared/file-upload/data-access-file-upload';
import { MatDialog } from '@angular/material/dialog';
import { FilePreviewComponent } from '@poss-web/shared/components/ui-file-upload';
import { CoePopupComponent } from '@poss-web/poss/cash-memo/ui-coe-popup';
import { FocFacade } from '@poss-web/poss/foc/data-access-foc';
import { POSS_WEB_COIN_PRODUCT_GROUP_CODE } from '@poss-web/shared/util-config';
import { AdvanceBookingFacade } from '@poss-web/poss/advance-booking/data-access-advance-booking';

const RSOCode = 'RSO';

@Component({
  selector: 'poss-web-cash-memo-history-details',
  templateUrl: './cash-memo-history-details.component.html',
  styleUrls: ['./cash-memo-history-details.component.scss']
})
export class CashMemoHistoryDetailsComponent implements OnInit, OnDestroy {
  weightCodeForGm = 'gm';
  imageUrlData$: Subject<{}> = new Subject<{}>();
  pgDesc$: Observable<{}>;
  destroy$: Subject<null> = new Subject<null>();
  headerDetails: CashMemoDetailsResponse;
  id: string;
  subTxnType: string;
  printErrorText: string;
  status: string;
  isCOAPrinting = false;
  isLoading$: Observable<boolean>;
  selectedItemsDetails: CashMemoItemDetailsResponse[] = [];
  filesList: DocumentListResponse[];
  defaultImageUrl = 'assets/img/product-default-image.svg';
  taxAmt: number;
  totalAmt: number;
  finalAmt = 0;
  roundOff: number;
  transactionType: TransactionTypeEnum;
  viewCashMemo$: Observable<CashMemoDetailsResponse>;
  focItems$: Observable<AddFocToCmResponsePayload[]>;
  manualFocItems$: Observable<AddFocToCmResponsePayload[]>;
  productDetails$: Observable<CashMemoItemDetails[]>;
  cashMemoHistoryProductGrid$: Observable<
    (AddFocToCmResponsePayload | CashMemoItemDetails)[]
  >;
  productQty: number;
  COAItems = [];
  COAItemCodes: { [key: string]: string } = {};
  COAItemsToBePrinted = [];
  productWeight: number;
  productDisc: number;
  productAmt: number;
  coinQty: number;
  coinWeight: number;
  coinDisc: number;
  coinAmt: number;
  hallmarkCharges = 0;
  hallmarkDiscount = 0;
  advanceBookingDetailsResponse;
  isLegacy = false;
  rsoDetails$: Observable<RsoDetailsPayload[]>;
  isCommonLoading$: Observable<boolean>;
  customerId: number;
  printActions: string;

  constructor(
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private customerFacade: CustomerFacade,
    private commonFacade: CommonFacade,
    private dialog: MatDialog,
    private cashMemoFacade: CashMemoFacade,
    private activatedRoute: ActivatedRoute,
    private summaryBar: SummaryBarServiceAbstraction,
    public printingService: PrintingServiceAbstraction,
    private translate: TranslateService,
    private productFacade: ProductFacade,
    private fileFacade: FileFacade,
    private focFacade: FocFacade,
    @Inject(POSS_WEB_COIN_PRODUCT_GROUP_CODE)
    private coinCode: string,
    private advanceBookingFacade: AdvanceBookingFacade,
    private postConfirmationActions: PostTransactionConfirmationActionsServiceAbstraction,
    private alertPopUpService: AlertPopupServiceAbstraction
  ) {}

  ngOnInit(): void {
    this.customerFacade.clearSelectedCustomer();
    this.commonFacade.clearCashMemo();
    this.productFacade.resetValues();
    this.summaryBar.close();
    this.focFacade.resetFOCData();
    this.cashMemoFacade.resetValues();
    this.overlayNotification.close();
    this.advanceBookingFacade.resetValues();
    this.productDetails$ = this.cashMemoFacade.getItemDetails();
    this.productFacade.loadRSODetails(RSOCode);

    this.advanceBookingFacade
      .getViewCashMemoResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe(abDetails => {
        if (abDetails) {
          this.advanceBookingDetailsResponse = abDetails;
        }
      });
    this.productFacade
      .getItemDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((items: CashMemoItemDetailsResponse[]) => {
        this.selectedItemsDetails = items;
        this.COAItems = [];
        if (items) {
          items.forEach(item => {
            if (item.itemDetails.priceDetails.printGuranteeCard) {
              this.COAItems.push(item.itemDetails.itemId);
              this.COAItemCodes[item.itemDetails.itemId] =
                item.itemDetails.itemCode;
            }
          });
        }
      });
    this.focItems$ = this.focFacade.getFocListAddedToCM();
    this.manualFocItems$ = this.focFacade.getManualFocListAddedToCM();
    this.viewCashMemo$ = this.cashMemoFacade.getViewCashMemoResponse();
    this.isLoading$ = this.cashMemoFacade.getIsLoading();
    this.rsoDetails$ = this.productFacade.getRSODetails();
    this.pgDesc$ = this.commonFacade.getCommonFacadeAttributes(
      CommomStateAttributeTypeEnum.CASHMEMO,
      CommomStateAttributeNameEnum.PRODUCT_GROUP_DESC
    );
    this.id = this.activatedRoute.snapshot.params['_id'];
    this.subTxnType = this.activatedRoute.snapshot.params['_subTxnType'];
    if (this.id && this.subTxnType) {
      this.focFacade.getFocAssignedToCM({
        id: this.id,
        txnType: TransactionTypeEnum.CM,
        subTxnType:
          this.subTxnType === CashMemoRouteEnum.REGULAR
            ? SubTransactionTypeEnum.NEW_CM
            : this.subTxnType === CashMemoRouteEnum.MANUAL
            ? SubTransactionTypeEnum.MANUAL_CM
            : SubTransactionTypeEnum.FOC_CM
      });
      this.focFacade.getManualFocAssignedToCM({
        id: this.id,
        txnType: TransactionTypeEnum.CM,
        subTxnType:
          this.subTxnType === CashMemoRouteEnum.REGULAR
            ? SubTransactionTypeEnum.NEW_CM
            : this.subTxnType === CashMemoRouteEnum.MANUAL
            ? SubTransactionTypeEnum.MANUAL_CM
            : SubTransactionTypeEnum.FOC_CM
      });
      this.cashMemoFacade.viewCashMemo({
        id: this.id,
        txnType: TransactionTypeEnum.CM,
        subTxnType:
          this.subTxnType === CashMemoRouteEnum.REGULAR
            ? SubTransactionTypeEnum.NEW_CM
            : this.subTxnType === CashMemoRouteEnum.MANUAL
            ? SubTransactionTypeEnum.MANUAL_CM
            : SubTransactionTypeEnum.FOC_CM
      });
    }

    this.fileFacade.loadDocumentsList({
      customerId: null,
      docType: 'CM',
      fileType: 'OTHERS',
      id: this.id
    });
    this.commonFacade.loadCMPgDesc();
    this.viewCashMemo$.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.headerDetails = data;

      if (data) {
        if (data?.txnSource === 'LEGACY') {
          this.isLegacy = true;
        }
        if (
          this.headerDetails.refTxnId &&
          this.headerDetails.refTxnType &&
          this.headerDetails.refSubTxnType
        ) {
          this.advanceBookingFacade.viewCashMemo({
            id: this.headerDetails.refTxnId,
            txnType: this.headerDetails.refTxnType,
            subTxnType: this.headerDetails.refSubTxnType
          });
        }
        this.commonFacade.setTransactionTotalAmount(data.finalValue);
        this.commonFacade.setCMOtherCharges(data.otherChargesList);
        this.commonFacade.setTransactionConfig({
          isPaymentEditable: false,
          transactionType: {
            type: TransactionTypeEnum.CM,
            subType:
              this.subTxnType === CashMemoRouteEnum.REGULAR
                ? SubTransactionTypeEnum.NEW_CM
                : SubTransactionTypeEnum.MANUAL_CM
          }
        });
        this.commonFacade.setTcsAmount(data.tcsCollectedAmount);
        this.commonFacade.setTransactionTD(this.id);
        this.status = data.status;
        this.commonFacade.SetCMisLegacy(this.isLegacy);
        this.loadItemsInCashMemo(
          this.headerDetails ? this.headerDetails : null
        );
      }
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
      .get(['pw.otherReceiptsIssues.printError'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.printErrorText =
          translatedMessages['pw.otherReceiptsIssues.printError'];
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

    this.isCommonLoading$ = this.commonFacade.getCommonFacadeAttributes(
      CommomStateAttributeTypeEnum.CASHMEMO,
      CommomStateAttributeNameEnum.LOADING
    );
    this.cashMemoFacade
      .getHasError()
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
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
          /* this.loadItemsInCashMemo(
            this.headerDetails ? this.headerDetails : null
          ); */
        }

        if (results[0]?.length) {
          this.getTotalProductValues(results[0], results[2]);
        }
        this.cashMemoHistoryProductGrid$ = of([
          ...results[0],
          ...results[1],
          ...results[3]
        ]);
        this.showSummaryBar();
      });

    this.printingService
      .getIsMailSent()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isMailSent: boolean) => {
        if (isMailSent) {
          this.showAlertPopUp('pw.regularCashMemo.mailSentMsg');
        }
      });

    // this.printingService
    //   .getIsNotificationPrintSuccess()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((isNotificationPrintSuccess: boolean) => {
    //     if (isNotificationPrintSuccess) {
    //       this.showAlertPopUp('pw.regularCashMemo.printingSuccessMessage');
    //     }
    //   });

    // this.printingService
    //   .getIsMailSent()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((isMailSent: boolean) => {
    //     if (isMailSent) {
    //       this.printingService.loadNotificationPrint({
    //         transacionId: this.id,
    //         reprint: true,
    //         invoiceType: InvoiceDeliveryTypes.MAIL
    //       });
    //       // this.showAlertPopUp('pw.regularCashMemo.mailSentMsg');
    //     }
    //   });

    this.printingService
      .getIsPrintingSuccess()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isPrintingSuccess: boolean) => {
        if (isPrintingSuccess) {
          if (this.isCOAPrinting) {
            this.COAItemsToBePrinted.shift();
            if (this.COAItemsToBePrinted.length > 0) {
              this.printCOA(this.COAItemsToBePrinted[0]);
            }
          } else {
            this.isCOAPrinting = false;
            // if (this.printActions) {
            //   let action = '';
            //   switch (this.printActions) {
            //     case 'print': {
            //       action = InvoiceDeliveryTypes.PRINT;
            //       break;
            //     }
            //     case 'mail': {
            //       action = InvoiceDeliveryTypes.MAIL;
            //       break;
            //     }
            //     case 'both': {
            //       action = InvoiceDeliveryTypes.BOTH;
            //       break;
            //     }
            //   }
            //   this.printingService.loadNotificationPrint({
            //     transacionId: this.id,
            //     reprint: true,
            //     invoiceType: action
            //   });
            // } else {
            //   this.printingService.loadNotificationPrint({
            //     transacionId: this.id,
            //     reprint: true,
            //     invoiceType: InvoiceDeliveryTypes.PRINT
            //   });
            // }
            // this.printActions = null;
            this.showAlertPopUp('pw.regularCashMemo.printingSuccessMessage');
          }
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

  loadItemsInCashMemo(data: CashMemoDetailsResponse) {
    data?.itemIdList.forEach(element => {
      this.cashMemoFacade.getItemFromCashMemoHistory({
        id: this.id,
        itemId: element,
        txnType: data.txnType,
        subTxnType: data.subTxnType
      });

      this.productFacade.getItemFromCashMemo({
        id: this.id,
        itemId: element,
        headerData: data,
        txnType: data.txnType,
        subTxnType: data.subTxnType
      });
    });
  }
  loadImageUrl(event: string) {
    this.commonFacade.loadCMImageUrl(event);
  }
  showPopup(image): void {
    this.dialog.open(FilePreviewComponent, {
      height: '490px',
      width: '700px',
      autoFocus: false,
      data: {
        defaultImageUrl: this.defaultImageUrl,
        imageUrl: image,
        previewHeader: 'File upload'
      }
    });
  }
  getInvoicedTime(time) {
    return moment(time).format('LT');
  }

  getCashMemoDate(date) {
    return moment(date);
  }

  getTotalProductValues(
    event: CashMemoItemDetails[],
    viewCM: CashMemoDetailsResponse
  ) {
    this.productQty = 0;
    this.productWeight = 0;
    this.productDisc = 0;
    this.productAmt = 0;
    this.coinQty = 0;
    this.coinWeight = 0;
    this.coinDisc = 0;
    this.coinAmt = 0;
    this.hallmarkCharges = 0;
    this.hallmarkDiscount = 0;

    if (event.length !== 0) {
      this.hallmarkCharges = viewCM?.hallmarkCharges;
      this.hallmarkDiscount = viewCM?.hallmarkDiscount;
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
    this.commonFacade.setCMTotalProductValues(totalValues);
  }

  showSummaryBar(): void {
    this.summaryBar
      .open(SummaryBarType.CM_HISTORY, {
        status: this.headerDetails?.status,
        remarks: this.headerDetails?.remarks
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: SummaryBarEventRef) => {
        switch (event.eventType) {
          case SummaryBarEventType.PRINT: {
            this.isCOAPrinting = false;
            this.print();
            break;
          }

          case SummaryBarEventType.PRINT_ANNEXURE: {
            this.isCOAPrinting = false;
            this.printAnnexure();
            break;
          }

          case SummaryBarEventType.COA: {
            if (this.COAItems.length > 0) {
              this.openCoePopup();
            } else {
              this.showAlertPopUp('No Items Eligible for COE');
            }

            break;
          }
        }
      });
  }

  openCoePopup() {
    const dialogRef = this.dialog.open(CoePopupComponent, {
      height: 'auto',
      width: '500px',
      autoFocus: false,
      data: {
        items: this.COAItems,
        itemCodes: this.COAItemCodes
      }
    });
    dialogRef.componentInstance.printCOE
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        this.COAItemsToBePrinted = items;
        this.isCOAPrinting = true;
        this.printCOA(this.COAItemsToBePrinted[0]);
      });
  }
  printAnnexure() {
    this.printingService.loadPrintData({
      printType: printTypesEnum.CM_ANNEXURE,
      transacionId: this.id,
      transacionType: printTransactionTypesEnum.SALES,
      printFileType: printFileTypeEnum.INVOICE_PRINT,
      doctype: printDocTypeEnum.CUSTOMER_PRINT,
      reprint: true,
      customerId: this.customerId,
      invoiceType: InvoiceDeliveryTypes.PRINT
    });

    // Todo : Integrate Print Service.
  }

  printCOA(item) {
    this.printingService.loadPrintData({
      printType: printTypesEnum.COA,
      transacionId: this.id,
      transacionType: printTransactionTypesEnum.SALES,
      printFileType: printFileTypeEnum.INVOICE_PRINT,
      doctype: printDocTypeEnum.GURANTEE_CARD,
      reprint: true,
      customerId: this.customerId,
      invoiceType: InvoiceDeliveryTypes.PRINT,
      productCode: item
    });
  }
  print() {
    this.postConfirmationActions
      .open()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        if (res) {
          this.printActions = res;
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
            printType: printTypesEnum.CM_PRINTS,
            transacionId: this.id,
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

  ngOnDestroy() {
    this.summaryBar.close();
    this.destroy$.next();
    this.destroy$.complete();
    this.fileFacade.clearResponse();
    this.printingService.resetPrint();
    this.commonFacade.clearTransactionTD();
    this.productFacade.clearProductList();
    this.productFacade.clearProductRelatedDetails();
    this.commonFacade.clearCmImageUrl();
    this.focFacade.resetFOCData();
    this.commonFacade.setCMOtherCharges(null);
    this.commonFacade.clearTcsAmount();
  }
}
