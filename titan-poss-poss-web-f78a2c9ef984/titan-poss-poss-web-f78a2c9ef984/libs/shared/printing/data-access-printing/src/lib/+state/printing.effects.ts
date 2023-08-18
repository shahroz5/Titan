import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/angular';
import { ErrorEnums } from '@poss-web/shared/util-error';
import { map, mergeMap } from 'rxjs/operators';
import { PrintingState } from './printing.state';

import { PrintingActionTypes } from './printing.actions';
import * as PrintingActions from './printing.actions';
import { PrintingService } from '../printing.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  CustomErrors,
  InvoiceDeliveryTypes,
  TransactionDetails,
  TransactionIdsResponse
} from '@poss-web/shared/models';

import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { LoggerService } from '@poss-web/shared/util-logger';
import { PrinterService } from '@poss-web/shared/util-common';
@Injectable()
export class PrintingEffects {
  constructor(
    private dataPersistence: DataPersistence<PrintingState>,
    private loggerService: LoggerService,
    private printingService: PrintingService,
    private qztray: PrinterService
  ) {}

  @Effect() loadPrintDeatils$: Observable<Action> = this.dataPersistence.fetch(
    PrintingActionTypes.LOAD_PRINT_DETAILS,
    {
      run: (action: PrintingActions.LoadPrintDeatils) => {
        return this.printingService.getPrintData(action.printData).pipe(
          map((data: any) => {
            if (action.printData.invoiceType === InvoiceDeliveryTypes.MAIL) {
              return new PrintingActions.MailReceiptSuccess(true);
            } else {
              return new PrintingActions.PrintReceipt(
                data.printerName,
                data.blob
              );
            }
          })
        );
      },

      onError: (
        action: PrintingActions.LoadPrintDeatils,
        error: HttpErrorResponse
      ) => {
        return new PrintingActions.LoadPrintDeatilsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  printData$: Observable<Action> = this.dataPersistence.fetch(
    PrintingActionTypes.PRINT_RECEIPT,
    {
      run: (action: PrintingActions.PrintReceipt) => {
        return this.qztray.print(action.printName, action.printData).pipe(
          map(x => {
            return new PrintingActions.PrintReceiptSuccess(x);
          })
        );
      },
      onError: (
        action: PrintingActions.PrintReceipt,
        error: HttpErrorResponse
      ) => {
        const customError: CustomErrors = {
          code: ErrorEnums.ERR_QZ_TRAY,
          message: error.message,
          error: error,
          traceId: null,
          timeStamp: null
        };
        return new PrintingActions.PrintReceiptFailure(customError);
      }
    }
  );

  @Effect()
  loadLastTransactionId$: Observable<Action> = this.dataPersistence.fetch(
    PrintingActionTypes.GET_LAST_TRANSACTION_ID,
    {
      run: (action: PrintingActions.GetLastTransactionId) => {
        return this.printingService
          .loadTransactionList(
            action.payload.searchValue,
            action.payload.status,
            action.payload.txnType,
            action.payload.subTxnType,
            action.payload.pageIndex,
            action.payload.pageSize,
            action.payload
          )
          .pipe(
            map(
              (data: TransactionDetails) =>
                new PrintingActions.GetLastTransactionIdSuccess(data)
            )
          );
      },
      onError: (
        action: PrintingActions.GetLastTransactionId,
        error: HttpErrorResponse
      ) => {
        return new PrintingActions.GetLastTransactionIdFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect() verifyCustomerPrintDeatils$: Observable<
    Action
  > = this.dataPersistence.fetch(
    PrintingActionTypes.VERIFY_CUSTOMER_PRINT_DETAILS,
    {
      run: (action: PrintingActions.VerifyCustomerPrintDeatils) => {
        return this.printingService
          .verifyCustomerEmailDetails(action.printData.customerId)
          .pipe(
            map((data: any) => {
              return new PrintingActions.LoadPrintDeatils(action.printData);
            })
          );
      },

      onError: (
        action: PrintingActions.VerifyCustomerPrintDeatils,
        error: HttpErrorResponse
      ) => {
        let payload = { ...action.printData };
        payload.invoiceType = InvoiceDeliveryTypes.PRINT;
        return new PrintingActions.LoadPrintDeatils(payload);
      }
    }
  );

  @Effect()
  getTransactionIds$ = this.dataPersistence.fetch(
    PrintingActionTypes.GET_TRANSACTION_IDS,
    {
      run: (action: PrintingActions.GetTransactionIds) => {
        return this.printingService
          .getTransactionDetails(action.payload)
          .pipe(
            map(
              (transacionDetails: TransactionIdsResponse) =>
                new PrintingActions.GetTransactionIdsSuccess(transacionDetails)
            )
          );
      },
      onError: (
        action: PrintingActions.GetTransactionIds,
        error: HttpErrorResponse
      ) => {
        return new PrintingActions.GetTransactionIdsFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  getNotificationPrint$ = this.dataPersistence.fetch(
    PrintingActionTypes.GET_NOTIFICATION_PRINT,
    {
      run: (action: PrintingActions.GetNotificationPrint) => {
        return this.printingService
          .getPrintNotification(action.payload)
          .pipe(
            map(
              (transacionDetails: any) =>
                new PrintingActions.GetNotificationPrintSuccess()
            )
          );
      },
      onError: (
        action: PrintingActions.GetNotificationPrint,
        error: HttpErrorResponse
      ) => {
        return new PrintingActions.GetNotificationPrintFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  getNotificationMail$ = this.dataPersistence.fetch(
    PrintingActionTypes.GET_NOTIFICATION_MAIL,
    {
      run: (action: PrintingActions.GetNotificationMail) => {
        return this.printingService
          .getPrintNotification(action.payload)
          .pipe(
            map(
              (transacionDetails: any) =>
                new PrintingActions.GetNotificationMailSuccess()
            )
          );
      },
      onError: (
        action: PrintingActions.GetNotificationMail,
        error: HttpErrorResponse
      ) => {
        return new PrintingActions.GetNotificationMailFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  errorHandler(error: HttpErrorResponse): CustomErrors {
    const customError: CustomErrors = CustomErrorAdaptor.fromJson(error);
    this.loggerService.error(customError);
    return customError;
  }
}
