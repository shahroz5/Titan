import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as PrintingActions from './printing.actions';
import { printingSelectors } from './printing.selectors';
import { PrintingState } from './printing.state';
import {
  InvoiceDeliveryTypes,
  NotificationPayload,
  PrintPayload,
  TransactionIdsPayload,
  TransactionListPayload
} from '@poss-web/shared/models';

@Injectable()
export class PrintingFacade {
  constructor(private store: Store<PrintingState>) {}

  private hasError$ = this.store.select(printingSelectors.selectHasError);

  private isLoading$ = this.store.select(printingSelectors.selectIsLoading);

  private isPrintSuccess$ = this.store.select(
    printingSelectors.selectIsPrintingSuccess
  );

  private isNotificationPrintSuccess$ = this.store.select(
    printingSelectors.selectIsNotificationPrintSuccess
  );

  private isNotificationMailSent$ = this.store.select(
    printingSelectors.selectIsNotificationMailSent
  );

  private isMailSent$ = this.store.select(printingSelectors.selectIsMailSent);

  private lastTransactionId$ = this.store.select(
    printingSelectors.selectLastTransactionId
  );

  private lastTransactionPaymentType$ = this.store.select(
    printingSelectors.selectLastTransactionPaymentType
  );

  private transactionIds$ = this.store.select(
    printingSelectors.selectTransactionIds
  );

  getHasError() {
    return this.hasError$;
  }

  getIsLoading() {
    return this.isLoading$;
  }

  getIsPrintSuccess() {
    return this.isPrintSuccess$;
  }

  getIsMailSent() {
    return this.isMailSent$;
  }

  getLastTransactionId() {
    return this.lastTransactionId$;
  }

  getLastTransactionPaymentType() {
    return this.lastTransactionPaymentType$;
  }

  getTransactionIds() {
    return this.transactionIds$;
  }

  getIsNotifcationPrintSuccess() {
    return this.isNotificationPrintSuccess$;
  }

  getIsNotificationMailSent() {
    return this.isNotificationMailSent$;
  }

  loadPrintData(printdata: PrintPayload) {
    if (printdata.invoiceType === InvoiceDeliveryTypes.BOTH) {
      this.store.dispatch(
        new PrintingActions.VerifyCustomerPrintDeatils(printdata)
      );
    } else {
      this.store.dispatch(new PrintingActions.LoadPrintDeatils(printdata));
    }
  }

  loadNotificationPrint(printdata: NotificationPayload) {
    if (printdata.invoiceType === InvoiceDeliveryTypes.MAIL) {
      this.store.dispatch(new PrintingActions.GetNotificationMail(printdata));
    } else {
      this.store.dispatch(new PrintingActions.GetNotificationPrint(printdata));
    }
  }

  resetPrint() {
    this.store.dispatch(new PrintingActions.ResetPrint());
  }

  loadLastTransactionId(payload: TransactionListPayload) {
    this.store.dispatch(new PrintingActions.GetLastTransactionId(payload));
  }

  loadTransactionIds(payload: TransactionIdsPayload) {
    this.store.dispatch(new PrintingActions.GetTransactionIds(payload));
  }
}
