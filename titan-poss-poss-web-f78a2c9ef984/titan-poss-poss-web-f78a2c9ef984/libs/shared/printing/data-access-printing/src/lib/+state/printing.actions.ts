import { Action } from '@ngrx/store';

import {
  CustomErrors,
  NotificationPayload,
  PrintPayload,
  TransactionDetails,
  TransactionIdsPayload,
  TransactionIdsResponse,
  TransactionListPayload
} from '@poss-web/shared/models';

export enum PrintingActionTypes {
  LOAD_PRINT_DETAILS = '[Printing] LOAD PRINT DETAILS',
  LOAD_PRINT_DETAILS_SUCCESS = '[Printing] LOAD PRINT DETAILS Success',
  LOAD_PRINT_DETAILS_FAILURE = '[Printing] LOAD PRINT DETAILS Failure',

  PRINT_RECEIPT = '[Printing] Print Receipt',
  PRINT_RECEIPT_SUCCESS = '[Printing] Print Receipt Success',
  PRINT_RECEIPT_FAILURE = '[Printing] Print Receipt Failure',

  MAIL_RECEIPT = '[Printing] Mail Receipt',
  MAIL_RECEIPT_SUCCESS = '[Printing] Mail Receipt Success',
  MAIL_RECEIPT_FAILURE = '[Printing] Mail Receipt Failure',

  GET_LAST_TRANSACTION_ID = '[Printing] Last Transaction Id',
  GET_LAST_TRANSACTION_ID_SUCCESS = '[Printing] Last Transaction Id Success',
  GET_LAST_TRANSACTION_ID_FAILURE = '[Printing] Last Transaction Id Failure',

  VERIFY_CUSTOMER_PRINT_DETAILS = '[Printing] Verify Customer Print Details',
  VERIFY_CUSTOMER_PRINT_DETAILS_SUCCESS = '[Printing] Verify Customer Print Details Success',
  VERIFY_CUSTOMER_PRINT_DETAILS_FAILURE = '[Printing] Verify Customer Print Details Failure',

  GET_TRANSACTION_IDS = '[Boutique Bank Deposit] Get Home Bank & Non Home Bank Transaction Ids',
  GET_TRANSACTION_IDS_SUCCESS = '[Boutique Bank Deposit] Get Home Bank & Non Home Bank Transaction Ids Success',
  GET_TRANSACTION_IDS_FAILURE = '[Boutique Bank Deposit] Get Home Bank & Non Home Bank Transaction Ids Failure',

  GET_NOTIFICATION_PRINT = '[Printing] Get Notification Print',
  GET_NOTIFICATION_PRINT_SUCCESS = '[Printing] Get Notification Print Success',
  GET_NOTIFICATION_PRINT_FAILURE = '[Printing] Get Notification Print Failure',

  GET_NOTIFICATION_MAIL = '[Printing] Get Notification Mail',
  GET_NOTIFICATION_MAIL_SUCCESS = '[Printing] Get Notification Mail Success',
  GET_NOTIFICATION_MAIL_FAILURE = '[Printing] Get Notification Mail Failure',

  RESET_PRINT_DATA = '[Printing] Reset Print Data'
}

export class LoadPrintDeatils implements Action {
  readonly type = PrintingActionTypes.LOAD_PRINT_DETAILS;
  constructor(readonly printData: PrintPayload) {}
}

export class LoadPrintDeatilsSuccess implements Action {
  readonly type = PrintingActionTypes.LOAD_PRINT_DETAILS_SUCCESS;
  constructor(readonly payload: any) {}
}

export class MailReceiptSuccess implements Action {
  readonly type = PrintingActionTypes.MAIL_RECEIPT_SUCCESS;
  constructor(readonly payload: boolean) {}
}
export class LoadPrintDeatilsFailure implements Action {
  readonly type = PrintingActionTypes.LOAD_PRINT_DETAILS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class PrintReceipt implements Action {
  readonly type = PrintingActionTypes.PRINT_RECEIPT;
  constructor(readonly printName: string, readonly printData: string) {}
}

export class PrintReceiptSuccess implements Action {
  readonly type = PrintingActionTypes.PRINT_RECEIPT_SUCCESS;
  constructor(readonly payload: any) {}
}

export class PrintReceiptFailure implements Action {
  readonly type = PrintingActionTypes.PRINT_RECEIPT_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class GetLastTransactionId implements Action {
  readonly type = PrintingActionTypes.GET_LAST_TRANSACTION_ID;
  constructor(readonly payload: TransactionListPayload) {}
}

export class GetLastTransactionIdSuccess implements Action {
  readonly type = PrintingActionTypes.GET_LAST_TRANSACTION_ID_SUCCESS;
  constructor(readonly payload: TransactionDetails) {}
}

export class GetLastTransactionIdFailure implements Action {
  readonly type = PrintingActionTypes.GET_LAST_TRANSACTION_ID_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class VerifyCustomerPrintDeatils implements Action {
  readonly type = PrintingActionTypes.VERIFY_CUSTOMER_PRINT_DETAILS;
  constructor(readonly printData: PrintPayload) {}
}

export class VerifyCustomerPrintDeatilsSuccess implements Action {
  readonly type = PrintingActionTypes.VERIFY_CUSTOMER_PRINT_DETAILS_SUCCESS;
  constructor(readonly payload: any) {}
}

export class VerifyCustomerPrintDeatilsFailure implements Action {
  readonly type = PrintingActionTypes.VERIFY_CUSTOMER_PRINT_DETAILS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class ResetPrint implements Action {
  readonly type = PrintingActionTypes.RESET_PRINT_DATA;
}
export class GetTransactionIds implements Action {
  readonly type = PrintingActionTypes.GET_TRANSACTION_IDS;
  constructor(public payload: TransactionIdsPayload) {}
}
export class GetTransactionIdsSuccess implements Action {
  readonly type = PrintingActionTypes.GET_TRANSACTION_IDS_SUCCESS;
  constructor(public payload: TransactionIdsResponse) {}
}
export class GetTransactionIdsFailure implements Action {
  readonly type = PrintingActionTypes.GET_TRANSACTION_IDS_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class GetNotificationPrint implements Action {
  readonly type = PrintingActionTypes.GET_NOTIFICATION_PRINT;
  constructor(public payload: NotificationPayload) {}
}

export class GetNotificationPrintSuccess implements Action {
  readonly type = PrintingActionTypes.GET_NOTIFICATION_PRINT_SUCCESS;
}

export class GetNotificationPrintFailure implements Action {
  readonly type = PrintingActionTypes.GET_NOTIFICATION_PRINT_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export class GetNotificationMail implements Action {
  readonly type = PrintingActionTypes.GET_NOTIFICATION_MAIL;
  constructor(public payload: NotificationPayload) {}
}

export class GetNotificationMailSuccess implements Action {
  readonly type = PrintingActionTypes.GET_NOTIFICATION_MAIL_SUCCESS;
}

export class GetNotificationMailFailure implements Action {
  readonly type = PrintingActionTypes.GET_NOTIFICATION_MAIL_FAILURE;
  constructor(public payload: CustomErrors) {}
}

export type PrintingActions =
  | LoadPrintDeatils
  | PrintReceipt
  | PrintReceiptSuccess
  | PrintReceiptFailure
  | ResetPrint
  | LoadPrintDeatilsSuccess
  | LoadPrintDeatilsFailure
  | MailReceiptSuccess
  | GetLastTransactionId
  | GetLastTransactionIdSuccess
  | GetLastTransactionIdFailure
  | VerifyCustomerPrintDeatilsSuccess
  | VerifyCustomerPrintDeatils
  | VerifyCustomerPrintDeatilsFailure
  | GetTransactionIds
  | GetTransactionIdsSuccess
  | GetTransactionIdsFailure
  | GetNotificationPrint
  | GetNotificationPrintSuccess
  | GetNotificationPrintFailure
  | GetNotificationMail
  | GetNotificationMailSuccess
  | GetNotificationMailFailure;
