import {
  Component,
  OnInit,
  OnDestroy,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';

import {
  CancellableCashMemoData,
  OverlayNotificationType,
  GiftCardsTypesEnum,
  SummaryBarServiceAbstraction,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  SummaryBarEventRef,
  SummaryBarEventType,
  RoleCodesEnum,
  CashMemoMinimalDetail,
  GetGiftCardItemResponse,
  TransactionTypeEnum,
  SubTransactionTypeEnum,
  GiftCardItem,
  GcCashMemoCancelRequestBody,
  GcCancelTypesEnum,
  GcCashMemoCancelResponse,
  CustomErrors,
  PaymentDetails,
  SummaryBarType,
  ToolbarConfig,
  LocationSettingAttributesEnum,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  RsoNameObject,
  printDocTypeEnum,
  printTransactionTypesEnum,
  printFileTypeEnum,
  InvoiceDeliveryTypes,
  PrintingServiceAbstraction
} from '@poss-web/shared/models';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';
import { GiftCardsFacade } from '@poss-web/poss/gift-cards/data-access-gift-cards';
import { CmListGridPopUpComponent } from '@poss-web/poss/gift-cards/ui-cm-list-grid-pop-up';
import { TranslateService } from '@ngx-translate/core';
import { PaymentFacade } from '@poss-web/shared/payment/data-access-payment';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import * as moment from 'moment';
import { FormControl, FormGroup } from '@angular/forms';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { ToolbarFacade } from '@poss-web/shared/toolbar/data-access-toolbar';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import { PrintingService } from '@poss-web/shared/printing/feature-printing';
@Component({
  selector: 'poss-web-gift-cards-cancellation',
  templateUrl: './gift-cards-cancellation.component.html',
  styleUrls: []
})
export class GiftCardsCancellationComponent implements OnInit, OnDestroy {
  @ViewChild('cancellationSuccessNotificationTemplate', { static: true })
  private cancellationSuccessNotificationTemplate: TemplateRef<any>;
  destroy$: Subject<null> = new Subject<null>();
  giftCardsTypesEnum = GiftCardsTypesEnum;
  selectedCM: CancellableCashMemoData;
  gcCashMemoList: CancellableCashMemoData[] = [];
  cancellationReasons: { value: string; description: string }[] = [];
  clearAllDataObservable$: Observable<boolean> = of(false);
  clearAllPaymentDetails$: Observable<boolean> = of(false);
  customerId = null;
  gcCmDetails: CashMemoMinimalDetail;
  giftCardObservable$: Observable<GiftCardItem[]>;
  rsoNamesList: { value: string; description: string }[];
  paymentDetails: PaymentDetails[];
  invoicedTime: string;
  clearSelectedCancellationReason = false;
  clearSelectedRsoName = false;
  selectedCancellationReason: string;
  gcCashMemoCancelResponse: GcCashMemoCancelResponse;
  selectedRsoName: { value: string; description: string };
  selectCustomerAlertMessage: string;
  selectRsoNameAlertMessage: string;
  addRemarksAlertMessage: string;
  selectCancellationReasonAlertMessage: string;
  noSearchResultsMessage: string;
  invalidRemarksAlertMessage: string;
  selectedCustomerMobileNumber: string;
  selectedCustomerName: string;
  isLoading$: Observable<boolean> = of(false);
  gcCancellationForm: FormGroup;
  isOpenPopUp = false;
  currentYear = moment().year();
  isGcCancellationAllowed = false;
  giftCardsItemList = [];

  summaryBarRemarks$ = new Subject<string>();
  printErrorText: string;
  id: string;
  cancellationType: GcCancelTypesEnum;
  cndoc: any;
  cnDocNo: number[];
  constructor(
    public translate: TranslateService,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private dialog: MatDialog,
    private commonFacade: CommonFacade,
    private customerFacade: CustomerFacade,
    private paymentFacade: PaymentFacade,
    private summaryBar: SummaryBarServiceAbstraction,
    private giftCardsFacade: GiftCardsFacade,
    private fieldValidatorsService: FieldValidatorsService,
    private toolbarFacade: ToolbarFacade,
    private locationSettingsFacade: LocationSettingsFacade,
    private alertPopupService: AlertPopupServiceAbstraction,
    private router: Router,
    public printingService: PrintingServiceAbstraction
  ) {
    this.gcCancellationForm = new FormGroup({
      cmNumber: new FormControl('', [
        this.fieldValidatorsService.requestNumberField('CM Number')
      ]),
      mobileNumber: new FormControl('', [
        this.fieldValidatorsService.mobileField('Mobile Number')
      ])
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
    this.commonFacade.setTransactionConfig({
      isPaymentEditable: false,
      transactionType: {
        type: TransactionTypeEnum.CM,
        subType: SubTransactionTypeEnum.GIFT_SALE
      },
      showPayment: false
    });
    const toolbarData: ToolbarConfig = {
      txnType: TransactionTypeEnum.CM,
      subTxnType: SubTransactionTypeEnum.GIFT_SALE,
      loadMetalPrices: true,
      loadHoldPopup: false,
      loadOpenOrdersPopup: false
    };
    this.toolbarFacade.setToolbarConfig(toolbarData);
    this.locationSettingsFacade
      .getLocationSetting(
        LocationSettingAttributesEnum.GC_IS_CARD_CANCELLATION_ALLOWED
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((isGcCancellationAllowed: string) => {
        if (isGcCancellationAllowed === 'true') {
          this.isGcCancellationAllowed = true;
          this.getTranslatedAlertMessages();
          this.giftCardsFacade
            .getCashMemoAvailableForCancellation()
            .pipe(takeUntil(this.destroy$))
            .subscribe((cashMemoList: CancellableCashMemoData[]) => {
              this.gcCashMemoList = cashMemoList;
              if (this.gcCashMemoList.length > 0 && this.isOpenPopUp) {
                this.openGcCmSelectionPopUp();
              } else if (this.gcCashMemoList.length === 0 && this.isOpenPopUp) {
                this.isOpenPopUp = false;
                this.showAlertNotification(this.noSearchResultsMessage);
              }
            });
          this.giftCardsFacade
            .getError()
            .pipe(takeUntil(this.destroy$))
            .subscribe((errors: CustomErrors) => {
              if (errors && errors.code) {
                this.errorHandler(errors);
              }
            });
          this.giftCardsFacade.loadRsoDetails(RoleCodesEnum.RSO);
          this.giftCardsFacade
            .getRsoDetails()
            .pipe(takeUntil(this.destroy$))
            .subscribe((rsoNameList: RsoNameObject[]) => {
              this.rsoNamesList = rsoNameList;
              // if (rsoNamesList && rsoNamesList.length > 0) {
              //   this.rsoNamesList = rsoNamesList.map((rsoName: string) => {
              //     return { value: rsoName, description: rsoName };
              //   });
              // } else {
              //   this.rsoNamesList = [];
              // }
            });
          this.giftCardsFacade.loadGcCancellationReasons();
          this.giftCardsFacade
            .getGcCancellationReasons()
            .pipe(takeUntil(this.destroy$))
            .subscribe((cancellationReasons: string[]) => {
              if (cancellationReasons && cancellationReasons.length > 0) {
                this.cancellationReasons = cancellationReasons.map(
                  (cancellationReason: string) => {
                    return {
                      value: cancellationReason,
                      description: cancellationReason
                    };
                  }
                );
              } else {
                this.cancellationReasons = [];
              }
            });

          this.giftCardsFacade
            .getSelectedCancellationReason()
            .pipe(takeUntil(this.destroy$))
            .subscribe((selectedCancellationReason: string) => {
              this.selectedCancellationReason = selectedCancellationReason;
              this.overlayNotification.close();
            });
          this.giftCardsFacade
            .getAddedGiftCardItemResponse()
            .pipe(takeUntil(this.destroy$))
            .subscribe((giftCardItemDetail: GetGiftCardItemResponse) => {
              if (giftCardItemDetail) {
                const giftCardGridItem: GiftCardItem = {
                  cardNo: giftCardItemDetail.instrumentNo,
                  amount: giftCardItemDetail.totalValue,
                  tax: giftCardItemDetail.totalTax,
                  finalPrice: giftCardItemDetail.finalValue,
                  bin: giftCardItemDetail.binCode,
                  itemId: giftCardItemDetail.itemId
                };
                this.giftCardsItemList = [
                  ...this.giftCardsItemList,
                  giftCardGridItem
                ];
                this.giftCardObservable$ = giftCardGridItem
                  ? of(this.giftCardsItemList)
                  : of([]);
              }
            });
          this.giftCardsFacade
            .getSelectedGcCashMemoDetails()
            .pipe(takeUntil(this.destroy$))
            .subscribe((selectedGcCashMemoDetails: CashMemoMinimalDetail) => {
              this.gcCmDetails = selectedGcCashMemoDetails;
              console.log('GC CM DETAIL :', this.gcCmDetails);
              if (this.gcCmDetails) {
                this.giftCardsItemList = [];
                this.selectedRsoName = this.getRsoObjFromCode(
                  this.gcCmDetails.employeeCode
                );
                this.showSummaryBar();
                if (this.gcCmDetails.itemIdList.length > 0) {
                  this.gcCmDetails.itemIdList.forEach(
                    (giftCardItemId: string) => {
                      this.giftCardsFacade.getAddedGiftCardItem(
                        this.gcCmDetails.id,
                        giftCardItemId
                      );
                    }
                  );
                }
                this.invoicedTime = this.getInvoiceTime(
                  this.gcCmDetails.confirmedTime
                );
                // this.commonFacade.setTransactionConfig({
                this.commonFacade.setTransactionConfig({
                  isPaymentEditable: false,
                  transactionType: {
                    type: TransactionTypeEnum.CM,
                    subType: SubTransactionTypeEnum.GIFT_SALE
                  },
                  transactionID: this.gcCmDetails.id,
                  showPayment: true
                });
                // this.commonFacade.setTransactionTD(this.gcCmDetails.id);
                this.giftCardsFacade.setCardsTotalAmount(
                  this.gcCmDetails.totalValue
                );
                // this.commonFacade.setTransactionTotalAmount(
                //   this.gcCmDetails.totalValue
                // );
                this.commonFacade.setTransactionTotalAmount(
                  this.gcCmDetails.totalValue
                );
                this.giftCardsFacade.setCardsTotalQty(
                  this.gcCmDetails.totalQuantity
                );
                this.commonFacade.setGcTotalCardsQty(
                  this.gcCmDetails.totalQuantity
                );
              }
            });
          this.giftCardsFacade
            .getGcCashMemoCancelResponse()
            .pipe(takeUntil(this.destroy$))
            .subscribe((gcCashMemoCancelResponse: GcCashMemoCancelResponse) => {
              if (gcCashMemoCancelResponse) {
                this.gcCashMemoCancelResponse = gcCashMemoCancelResponse;
                this.id = gcCashMemoCancelResponse.id.toUpperCase();
                this.cnDocNo = Object.values(gcCashMemoCancelResponse.cndocNos);
                this.cndoc = Object.keys(gcCashMemoCancelResponse.cndocNos)
                  .length
                  ? Object.keys(
                      gcCashMemoCancelResponse.cndocNos
                    )[0].toUpperCase()
                  : null;
                //console.log(Object.keys(this.cndoc));
                this.overlayNotification
                  .show({
                    type: OverlayNotificationType.CUSTOM,
                    hasBackdrop: true,
                    hasClose: true,
                    template: this.cancellationSuccessNotificationTemplate
                  })
                  .events.pipe(takeUntil(this.destroy$))
                  .subscribe((event: OverlayNotificationEventRef) => {
                    if (
                      event.eventType === OverlayNotificationEventType.CLOSE
                    ) {
                      this.clearFields();
                      this.summaryBar.close();
                    }
                  });
              }
            });
          this.giftCardsFacade
            .getSelectedRSONames()
            .pipe(takeUntil(this.destroy$))
            .subscribe(
              (selectedRsoName: { value: string; description: string }) => {
                if (selectedRsoName) {
                  this.selectedRsoName = selectedRsoName;
                }
                this.overlayNotification.close();
              }
            );
          this.isLoading$ = this.giftCardsFacade.getIsLoading();
        } else if (isGcCancellationAllowed === 'false') {
          this.isGcCancellationAllowed = false;
          // this.openIsGrfAllowedDialog();
          this.openIsGcCancellationAllowedAlertDialog();
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
  printError() {
    this.overlayNotification

      .show({
        type: OverlayNotificationType.TIMER,

        message: this.printErrorText,

        hasClose: false
      })

      .events.pipe(takeUntil(this.destroy$))

      .subscribe((event: OverlayNotificationEventRef) => {
        //this.showConfirmIssueSuccessNotification(this.srcDocNo); //call your respective success overlay method
      });
  }
  openIsGcCancellationAllowedAlertDialog() {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.ERROR,
        message: 'pw.giftCards.gcCancellationNotAllowedAlertMsg'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.router.navigate(['home']);
        }
      });
  }

  // openIsGrfAllowedDialog() {
  //   const dialogRef = this.dialog.open(IsGrfAllowedPopUpComponent, {
  //     width: '400px',
  //     hasBackdrop: true,
  //     data: {}
  //   });

  //   dialogRef
  //     .afterClosed()
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe(res => {
  //       if (res) {
  //         if (res === 'ok') {
  //           this.router.navigate(['home']);
  //         }
  //       }
  //     });
  // }

  getInvoiceTime(invoiceTimeInMilliseconds: number): string {
    if (!invoiceTimeInMilliseconds) {
      return '';
    }
    const time = moment
      .utc(invoiceTimeInMilliseconds)
      .local()
      .format('hh:mm A');
    return time;
  }

  errorHandler(error: CustomErrors) {
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

  getTranslatedAlertMessages() {
    const selectCustomerAlertMessage = 'pw.giftCards.selectCustomerAlert';
    const selectRsoNameAlertMessage = 'pw.giftCards.selectRsoNameAlert';
    const addRemarksAlertMessage = 'pw.giftCards.addRemarksAlert';
    const selectCancellationReasonAlertMessage =
      'pw.giftCards.selectCancellationReasonAlert';
    const invalidRemarksAlertMessage =
      'pw.giftCards.invalidRemarksAlertMessage';
    const noSearchResultsMessage = 'pw.giftCards.noSearchResultsMessage';
    this.translate
      .get([
        selectCustomerAlertMessage,
        selectRsoNameAlertMessage,
        addRemarksAlertMessage,
        selectCancellationReasonAlertMessage,
        invalidRemarksAlertMessage,
        noSearchResultsMessage
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMessages => {
        this.selectCustomerAlertMessage =
          translatedMessages[selectCustomerAlertMessage];
        this.selectRsoNameAlertMessage =
          translatedMessages[selectRsoNameAlertMessage];
        this.addRemarksAlertMessage =
          translatedMessages[addRemarksAlertMessage];
        this.selectCancellationReasonAlertMessage =
          translatedMessages[selectCancellationReasonAlertMessage];
        this.invalidRemarksAlertMessage =
          translatedMessages[invalidRemarksAlertMessage];
        this.noSearchResultsMessage =
          translatedMessages[noSearchResultsMessage];
      });
  }

  searchGcCashMemo() {
    this.isOpenPopUp = true;
    this.giftCardsFacade.loadGcCashMemoAvailableForCancellation(
      this.gcCancellationForm.get('mobileNumber').value,
      this.gcCancellationForm.get('cmNumber').value
    );
  }
  print() {
    if (this.cancellationType === GcCancelTypesEnum.CANCEL_WITH_CN) {
      this.printingService.loadPrintData({
        printType: 'GC_WITH_CN',
        doctype: printDocTypeEnum.CUSTOMER_PRINT,
        transacionType: printTransactionTypesEnum.SALES,
        printFileType: printFileTypeEnum.INVOICE_PRINT,
        transacionId: this.id,
        productCode: this.cndoc,
        reprint: false,
        customerId: this.customerId,
        invoiceType: InvoiceDeliveryTypes.PRINT
      });
    }
    if (
      this.cndoc &&
      this.cancellationType === GcCancelTypesEnum.CANCEL_WITH_RETURN
    ) {
      this.printingService.loadPrintData({
        printType: 'GC_WITH_CN',
        doctype: printDocTypeEnum.CUSTOMER_PRINT,
        transacionType: printTransactionTypesEnum.SALES,
        printFileType: printFileTypeEnum.INVOICE_PRINT,
        transacionId: this.id,
        productCode: this.cndoc,
        reprint: false,
        customerId: this.customerId,
        invoiceType: InvoiceDeliveryTypes.PRINT
      });
      this.printingService.loadPrintData({
        printType: 'GC_WITH_RETURN',
        doctype: printDocTypeEnum.CUSTOMER_PRINT,
        transacionType: printTransactionTypesEnum.SALES,
        printFileType: printFileTypeEnum.INVOICE_PRINT,
        transacionId: this.id,
        productCode: this.cndoc,
        reprint: false,
        customerId: this.customerId,
        invoiceType: InvoiceDeliveryTypes.PRINT
      });
    } else if (
      !this.cndoc &&
      this.cancellationType === GcCancelTypesEnum.CANCEL_WITH_RETURN
    ) {
      this.printingService.loadPrintData({
        printType: 'GC_WITH_RETURN',
        doctype: printDocTypeEnum.CUSTOMER_PRINT,
        transacionType: printTransactionTypesEnum.SALES,
        printFileType: printFileTypeEnum.INVOICE_PRINT,
        transacionId: this.id,
        productCode: this.cndoc,
        reprint: false,
        customerId: this.customerId,
        invoiceType: InvoiceDeliveryTypes.PRINT
      });
    }
  }
  openGcCmSelectionPopUp() {
    const dialogRef = this.dialog.open(CmListGridPopUpComponent, {
      autoFocus: false,
      data: {
        gcCashMemoList: this.gcCashMemoList
      },
      width: '600px'
    });

    dialogRef.afterClosed().subscribe((selectedCM: CancellableCashMemoData) => {
      if (selectedCM) {
        this.isOpenPopUp = false;
        this.clearAllDataObservable$ = of(true);
        this.clearAllPaymentDetails$ = of(true);
        this.giftCardObservable$ = of([]);
        this.paymentDetails = [];
        this.giftCardsFacade.loadRsoDetails(RoleCodesEnum.RSO);
        this.giftCardsFacade.loadGcCancellationReasons();
        this.selectedCM = selectedCM;
        this.gcCmDetails = null;
        if (this.selectedCM && this.selectedCM.refTxnId) {
          this.giftCardsFacade.loadSelectedGcCashMemoDetails(
            this.selectedCM.refTxnId
          );
        }
      }
    });
  }

  showSummaryBar(): void {
    this.summaryBar
      .open(SummaryBarType.GIFT_CARD, {
        type: GiftCardsTypesEnum.GIFTCARD_CANCELLATION,
        remarks: this.summaryBarRemarks$.asObservable()
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: SummaryBarEventRef) => {
        switch (event.eventType) {
          case SummaryBarEventType.CANCELWITHCN: {
            this.cancellationType = GcCancelTypesEnum.CANCEL_WITH_CN;
            this.cancelCashMemo(
              GcCancelTypesEnum.CANCEL_WITH_CN,
              event.remarks
            );
            break;
          }
          case SummaryBarEventType.CANCELWITHRETURN: {
            this.cancellationType = GcCancelTypesEnum.CANCEL_WITH_RETURN;
            this.cancelCashMemo(
              GcCancelTypesEnum.CANCEL_WITH_RETURN,
              event.remarks
            );
            break;
          }
          case SummaryBarEventType.CLAER: {
            this.resetData();
            break;
          }
          case SummaryBarEventType.PRINT: {
            this.print();
            break;
          }
        }
      });
  }

  resetData() {
    this.selectedCancellationReason = '';
    this.selectedRsoName = null;
    this.giftCardsFacade.setSelectedCancellationReason('');
    this.giftCardsFacade.loadSelectedRSOName(null);
    this.giftCardsFacade.setRemarks('');
    this.clearSelectedCancellationReason = true;
    this.clearSelectedRsoName = true;
    this.giftCardsItemList = [];
  }

  clearFields() {
    this.gcCancellationForm.reset();
    this.gcCashMemoList = [];
    this.clearAllDataObservable$ = of(true);
    this.clearAllPaymentDetails$ = of(true);
    this.giftCardObservable$ = of([]);
    this.paymentDetails = [];
    this.invoicedTime = '';
    this.gcCmDetails = null;
    this.customerId = '';
    this.selectedCancellationReason = '';
    this.selectedRsoName = null;
    this.selectedCustomerMobileNumber = '';
    this.selectedCustomerName = '';
    this.giftCardsFacade.setSelectedCancellationReason('');
    this.giftCardsFacade.loadSelectedRSOName(null);
    this.giftCardsFacade.setRemarks('');
    this.giftCardsFacade.resetGiftCardsData();
    this.clearSelectedCancellationReason = true;
    this.clearSelectedRsoName = true;
    // this.commonFacade.setTransactionTotalAmount(0);
    this.commonFacade.setTransactionTotalAmount(0);
    this.customerFacade.clearCustomerSearch();
    this.customerFacade.clearSelectedCustomer();
    // this.commonFacade.clearTransactionConfig();
    // this.commonFacade.clearTransactionConfig();
    this.commonFacade.setTransactionConfig({
      isPaymentEditable: false,
      transactionType: {
        type: TransactionTypeEnum.CM,
        subType: SubTransactionTypeEnum.GIFT_SALE
      },
      showPayment: false
    });
    this.summaryBarRemarks$.next('');
    this.giftCardsItemList = [];
  }

  cancelCashMemo(cancelType: string, remarks: string): void {
    if (!this.selectedRsoName) {
      this.showAlertNotification(this.selectRsoNameAlertMessage);
    } else if (!this.selectedCancellationReason) {
      this.showAlertNotification(this.selectCancellationReasonAlertMessage);
    } else if (remarks === null || remarks === undefined) {
      this.showAlertNotification(this.addRemarksAlertMessage);
    } else if (remarks === 'invalid') {
      this.showAlertNotification(this.invalidRemarksAlertMessage);
    } else {
      console.log('SelectedRsoName :', this.selectedRsoName);
      const requestPayload: GcCashMemoCancelRequestBody = {
        cancelType,
        reasonForCancellation: this.selectedCancellationReason,
        refTxnId: this.gcCmDetails.id,
        remarks: remarks ? remarks : null,
        employeeCode: this.selectedRsoName.value
      };
      this.giftCardsFacade.loadCancelGcCashMemo(requestPayload);
    }
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

  setSelectedRSOName(selectedRSOName: { value: string; description: string }) {
    this.clearSelectedRsoName = false;
    this.giftCardsFacade.loadSelectedRSOName(selectedRSOName);
  }

  setSelectedCancellationReason(cancellationReason: string) {
    this.clearSelectedCancellationReason = false;
    this.giftCardsFacade.setSelectedCancellationReason(cancellationReason);
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

  ngOnDestroy() {
    this.clearFields();
    this.selectedCM = null;
    this.gcCmDetails = null;
    this.overlayNotification.close();
    this.summaryBar.close();
    this.customerFacade.clearSelectedCustomer();
    // this.commonFacade.setTransactionTotalAmount(0);
    this.commonFacade.setTransactionTotalAmount(0);
    this.giftCardsFacade.resetGiftCardsData();
    this.destroy$.next();
    this.destroy$.complete();
    this.printingService.resetPrint();
    this.toolbarFacade.resetValues();
    this.toolbarFacade.setToolbarConfig({
      loadMetalPrices: true,
      loadHoldPopup: false,
      loadOpenOrdersPopup: false
    });
  }
}
