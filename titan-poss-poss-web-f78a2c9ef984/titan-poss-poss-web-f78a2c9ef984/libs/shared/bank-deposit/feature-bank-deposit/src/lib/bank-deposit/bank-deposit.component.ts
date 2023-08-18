import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import {
  BankDepositRequest,
  BankDepositResponse,
  CustomErrors,
  OverlayNotificationType,
  OverlayNotificationServiceAbstraction,
  printTypesEnum,
  printDocTypeEnum,
  printTransactionTypesEnum,
  printFileTypeEnum,
  BankingAndRevenueMenuKeyEnum,
  DepositDateResponse,
  BoutiqueBankDepositEnum
} from '@poss-web/shared/models';
import { Observable, Subject } from 'rxjs';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';

import { BankDepositFacade } from '@poss-web/shared/bank-deposit/data-access-bank-deposit';
import { takeUntil } from 'rxjs/operators';
import { getBankingAndRevenueHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import { PrintingService } from '@poss-web/shared/printing/feature-printing';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

@Component({
  selector: 'poss-web-bank-deposit',
  templateUrl: './bank-deposit.component.html'
})
export class BankDepositComponent implements OnInit, OnDestroy {
  listingPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };

  count = 0;
  length = 0;
  pageSize = 10;
  minPageSize = 0;
  pageSizeOptions: number[] = [];
  pageEvent: PageEvent;

  dateRangeRequest: BankDepositRequest;
  bankDepositList$: Observable<BankDepositResponse>;
  isLoading$: Observable<boolean>;
  destroy$: Subject<null> = new Subject<null>();
  dateRangeData: BankDepositRequest = {
    fromDate: null,
    toDate: null
  };
  dateFormat: string;
  printErrorText: string;
  transactionId: string | number;
  selctedTransaction: any = null;

  constructor(
    private router: Router,
    private bankDepositFacade: BankDepositFacade,
    private appSettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private printingService: PrintingService,
    private translate: TranslateService
  ) {
    this.translate
      .get(['pw.otherReceiptsIssues.printError'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.printErrorText =
          translatedMessages['pw.otherReceiptsIssues.printError'];
      });

    this.isLoading$ = this.bankDepositFacade.getIsLoading();
    this.bankDepositFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
  }

  ngOnInit(): void {
    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.listingPageEvent.pageSize = data;
        this.pageSize = data;
      });
    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSizeOptions = data;
        this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
          a < b ? a : b
        );
      });
    this.appSettingFacade
      .getDateFormat()
      .pipe(takeUntil(this.destroy$))
      .subscribe((format: string) => {
        this.dateFormat = format;
      });
    this.bankDepositFacade
      .gettransacionDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((transactionDetails: DepositDateResponse) => {
        if (transactionDetails) {
          if (transactionDetails.paymentCode === BoutiqueBankDepositEnum.CASH) {
            if (transactionDetails.transacionIdDetails.length > 0) {
              transactionDetails.transacionIdDetails.forEach(element => {
                this.printingService.loadPrintData({
                  printType: printTypesEnum.CASH_DEPOSIT_PRINT,
                  transactionIds: element,
                  transacionType: printTransactionTypesEnum.SALES,
                  printFileType: printFileTypeEnum.CASH_PRINT,
                  doctype: printDocTypeEnum.CUSTOMER_PRINT
                });
              });
            }
          } else if (
            transactionDetails.paymentCode === BoutiqueBankDepositEnum.CHEQUE
          ) {
            if (transactionDetails.transacionIdDetails.length > 0) {
              transactionDetails.transacionIdDetails.forEach(element => {
                this.printingService.loadPrintData({
                  printType: printTypesEnum.CHEQUE_DEPOSIT_PRINT,
                  transactionIds: { transactionIds: element.transactionIds },
                  transacionType: printTransactionTypesEnum.SALES,
                  printFileType: printFileTypeEnum.CHEQUE_PRINT,
                  doctype: printDocTypeEnum.CUSTOMER_PRINT
                });
              });
            }
          }
        }
      });
  }

  back() {
    this.router.navigate([getBankingAndRevenueHomeRouteUrl()], {
      queryParams: {
        menu: BankingAndRevenueMenuKeyEnum.BANKING_REVENUE_MENU_KEY
      }
    });
  }

  loadBankDeposit(dateRange: BankDepositRequest) {
    this.selctedTransaction = null;
    if (dateRange === null) {
      this.bankDepositFacade.resetValues();
      this.bankDepositList$ = this.bankDepositFacade.getBankDepositList();
      this.bankDepositList$
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: BankDepositResponse) => {
          if (data) {
            this.count = data.totalElements;
          }
        });
    } else {
      this.dateRangeData.fromDate = dateRange.fromDate;
      this.dateRangeData.toDate = dateRange.toDate;
      this.bankDepositFacade.loadBankDeposit(this.listingPageEvent, dateRange);
      this.bankDepositList$ = this.bankDepositFacade.getBankDepositList();
      this.bankDepositList$
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: BankDepositResponse) => {
          if (data) {
            this.count = data.totalElements;
          }
        });
    }
  }

  emitTransactionId(event) {
    this.selctedTransaction = event;
  }

  printChequeDeposit() {
    this.bankDepositFacade.loadTransacionDetails({
      depositDate: moment(this.selctedTransaction.date).valueOf(),
      paymentCode: BoutiqueBankDepositEnum.CHEQUE
    });
  }

  printCashDeposit() {
    this.bankDepositFacade.loadTransacionDetails({
      depositDate: moment(this.selctedTransaction.date).valueOf(),
      paymentCode: BoutiqueBankDepositEnum.CASH
    });
  }

  printError() {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        message: this.printErrorText,
        hasClose: false
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  errorHandler(error: CustomErrors) {
    if (error) {
      this.overlayNotification
        .show({
          type: OverlayNotificationType.ERROR,
          hasBackdrop: true,
          hasClose: true,
          error: error
        })
        .events.pipe(takeUntil(this.destroy$))
        .subscribe();
    }
  }

  paginate(pageEvent: PageEvent) {
    this.listingPageEvent = pageEvent;
    this.bankDepositFacade.loadBankDeposit(
      this.listingPageEvent,
      this.dateRangeData
    );
  }

  ngOnDestroy(): void {
    this.bankDepositFacade.resetError();
    this.destroy$.next();
    this.destroy$.complete();
    this.printingService.resetPrint();
  }
}
