import { Injectable } from '@angular/core';
import {
  NotificationPayload,
  PrintPayload,
  printTransactionTypesEnum,
  responseTypeEnum,
  TransactionDetails,
  TransactionIdsPayload,
  TransactionListPayload
} from '@poss-web/shared/models';
import { PrinterHelper } from '@poss-web/shared/util-adaptors';
import {
  ApiService,
  getCustomerPrintUrl,
  getOtherIssuePrintUrl,
  getPrintDepositUrl,
  getPrinterNameUrl,
  getReturnInvoicePrintUrl,
  getSalesPrintDataUrl,
  getStockIssuePrintUrl,
  getStockTransferPrintUrl,
  getTransactionListUrl,
  getNotificationUrl,
  getOtherReceivePrintUrl
} from '@poss-web/shared/util-api-service';
import { Observable, throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class PrintingService {
  constructor(private apiService: ApiService) {}

  getPrintData(
    printData: PrintPayload
  ): Observable<{ blob: any; printerName: string }> {
    let firstApiUrl;
    let getMethod: boolean;
    switch (printData.transacionType) {
      case printTransactionTypesEnum.OTHER_ISSUE: {
        firstApiUrl = getOtherIssuePrintUrl(
          printData.printType,
          printData.transacionId
        );
        getMethod = true;
        break;
      }
      case printTransactionTypesEnum.OTHER_RECEIVE: {
        firstApiUrl = getOtherReceivePrintUrl(
          printData.printType,
          printData.transacionId
        );
        getMethod = true;
        break;
      }
      case printTransactionTypesEnum.STOCK_ISSUE: {
        firstApiUrl = getStockIssuePrintUrl(
          printData.printType,
          printData.transacionId
        );
        getMethod = true;
        break;
      }
      case printTransactionTypesEnum.STOCK_TRANSFER: {
        firstApiUrl = getStockTransferPrintUrl(
          printData.printType,
          printData.transacionId
        );
        getMethod = true;
        break;
      }
      case printTransactionTypesEnum.RETURN_INVOICE: {
        firstApiUrl = getReturnInvoicePrintUrl(
          printData.printType,
          printData.transacionId
        );
        getMethod = true;
        break;
      }
      default: {
        firstApiUrl = getSalesPrintDataUrl(
          printData.printType,
          printData.printFileType,
          printData?.transacionId,
          printData.reprint,
          printData.invoiceType,
          printData.productCode,
          printData.lastTransactionPrint
        );
        getMethod = false;
        break;
      }
    }

    const secondApiUrl = getPrinterNameUrl(printData.doctype);

    return this.apiService
      .get(secondApiUrl.path, secondApiUrl.params)
      .pipe(map((data: any) => data?.printerName)) // 'Microsoft Print to PDF'
      .pipe(
        mergeMap(printerName => {
          this.apiService.ResponseContentType = responseTypeEnum.BLOB;
          if (getMethod === true) {
            return this.apiService
              .getBlobResponse(firstApiUrl.path, firstApiUrl.params)
              .pipe(
                //  map((data: any) => ({ blob: data, printerName: printerName }))

                mergeMap((data: any) =>
                  PrinterHelper.readFile(data, printerName)
                ),
                map(
                  value => {
                    return value;
                  },
                  catchError(x => throwError(x))
                )
              );
          } else {
            return this.apiService
              .postBlobResponse(
                firstApiUrl.path,
                printData.transactionIds,
                firstApiUrl.params
              )
              .pipe(
                //  map((data: any) => ({ blob: data, printerName: printerName }))

                mergeMap((data: any) =>
                  PrinterHelper.readFile(data, printerName)
                ),
                map(
                  value => {
                    return value;
                  },
                  catchError(x => throwError(x))
                )
              );
          }
        })
      );
  }

  getPrintNotification(notificationPayload: NotificationPayload) {
    const getNotificationListUrl = getNotificationUrl(notificationPayload);
    return this.apiService
      .post(getNotificationListUrl.path, null, getNotificationListUrl.params)
      .pipe(map((data: any) => data));
  }

  loadTransactionList(
    searchValue: any,
    status: string,
    txnType: string,
    subTxnType: string,
    pageIndex: number,
    pageSize: number,
    searchData: TransactionListPayload
  ): Observable<TransactionDetails> {
    const loadTransactionListUrl = getTransactionListUrl(
      searchValue,
      status,
      txnType,
      subTxnType,
      pageIndex,
      pageSize,
      searchData,
      ['fiscalYear,desc', 'docNo,desc']
    );

    return this.apiService
      .get(loadTransactionListUrl.path, loadTransactionListUrl.params)
      .pipe(map((data: any) => PrinterHelper.getTransactionDetails(data)));
  }

  verifyCustomerEmailDetails(customerId: string) {
    const url = getCustomerPrintUrl(customerId);
    this.apiService.ResponseContentType = 'text';
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => data));
  }

  getTransactionDetails(transactionIds: TransactionIdsPayload) {
    const url = getPrintDepositUrl();
    return this.apiService
      .post(url.path, transactionIds, url.params)
      .pipe(map((data: any) => PrinterHelper.getTransactionIds(data)));
  }
}
