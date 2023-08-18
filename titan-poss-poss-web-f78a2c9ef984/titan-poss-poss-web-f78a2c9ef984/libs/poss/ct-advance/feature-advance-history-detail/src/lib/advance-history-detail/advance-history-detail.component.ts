import { Component, OnDestroy, OnInit } from '@angular/core';
import { CtAcceptAdvanceFacade } from '@poss-web/poss/ct-advance/data-access-ct-accept-advance';
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
  CtAdvanceTabsEnum,
  printTypesEnum,
  printDocTypeEnum,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  OverlayNotificationEventRef,
  CustomErrors,
  printFileTypeEnum,
  printTransactionTypesEnum,
  PrintingServiceAbstraction,
  InvoiceDeliveryTypes,
  PostTransactionConfirmationActionsServiceAbstraction,
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  RsoNameObject
} from '@poss-web/shared/models';
import { CustomerFacade } from '@poss-web/shared/customer/data-access-customer';
import * as moment from 'moment';
import { ErrorEnums } from '@poss-web/shared/util-error';

@Component({
  selector: 'poss-web-advance-history-detail',
  templateUrl: './advance-history-detail.component.html'
})
export class AdvanceHistoryDetailComponent implements OnInit, OnDestroy {
  selectedHistoryItem: any;
  rsoNamesList: RsoNameObject[] = [];
  isLoading$: Observable<boolean>;
  isCommonFacadeLoading$: Observable<boolean>;
  isCustomerFacadeLoading$: Observable<boolean>;
  moment = moment;
  printErrorText: string;
  selectedRsoObj: RsoNameObject = {
    value: '',
    description: ''
  };
  destroy$: Subject<null> = new Subject<null>();
  summaryBarRemarks$ = new Subject<string>();
  customerId: number;
  constructor(
    private advanceFacade: CtAcceptAdvanceFacade,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private commonFacade: CommonFacade,
    private customerFacade: CustomerFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private summaryBar: SummaryBarServiceAbstraction,
    public printingService: PrintingServiceAbstraction,
    private postConfirmationActions: PostTransactionConfirmationActionsServiceAbstraction,
    private alertPopUpService: AlertPopupServiceAbstraction
  ) {}

  ngOnInit(): void {
    const transactionId = this.activatedRoute.snapshot.params['_id'];
    this.advanceFacade.getViewAdvanceDetails(transactionId);
    this.isLoading$ = this.advanceFacade.getIsLoading();
    this.advanceFacade.loadRsoDetails('RSO');
    this.isCommonFacadeLoading$ = this.advanceFacade.getIsLoading();
    this.isCustomerFacadeLoading$ = this.advanceFacade.getIsLoading();
    this.advanceFacade
      .getRsoDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((rsoNamesList: RsoNameObject[]) => {
        this.rsoNamesList = rsoNamesList;
      });
    this.advanceFacade
      .getViewAdvanceResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((advanceResponse: any) => {
        if (advanceResponse) {
          // this.commonFacade.setTransactionConfig({
          //   isPaymentEditable: false,
          //   transactionType: {
          //     type: TransactionTypeEnum.ADV,
          //     subType: SubTransactionTypeEnum.NON_FROZEN_RATES
          //   },
          //   transactionID: transactionId
          // });
          this.commonFacade.setTransactionConfig({
            isPaymentEditable: false,
            showRemainingAmount: false,
            transactionType: {
              type: TransactionTypeEnum.ADV,
              subType: SubTransactionTypeEnum.NON_FROZEN_RATES
            },
            transactionID: transactionId
          });
          this.customerId = advanceResponse.customerId;
          this.customerFacade.loadSelectedCustomer(
            advanceResponse.customerId,
            false,
            false
          );
          this.selectedHistoryItem = advanceResponse;
          this.showSummaryBar();
          this.selectedRsoObj = this.getRsoObjFromCode(
            this.selectedHistoryItem?.employeeCode
          );
          // this.commonFacade.setTransactionTotalAmount(
          //   this.selectedHistoryItem.finalValue
          // );
          this.commonFacade.setTransactionTotalAmount(
            this.selectedHistoryItem.finalValue
          );
          if (this.selectedHistoryItem && this.selectedHistoryItem.remarks) {
            this.summaryBarRemarks$.next(this.selectedHistoryItem.remarks);
          }
        }
      });
    this.advanceFacade
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
      .open(SummaryBarType.ADV, {
        status: this.selectedHistoryItem.status,
        type: CtAdvanceTabsEnum.HISTORY,
        remarks: this.summaryBarRemarks$.asObservable()
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: SummaryBarEventRef) => {
        switch (event.eventType) {
          case SummaryBarEventType.PRINT: {
            this.printAcceptAdvanceConfirmedTransaction(
              this.selectedHistoryItem.id
            );
          }
        }
      });
  }

  printAcceptAdvanceConfirmedTransaction(transactionId: string) {
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
            printType: printTypesEnum.ACCEPT_ADVANCE_PRINTS,
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
