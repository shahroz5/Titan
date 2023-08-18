import { Action } from '@ngrx/store';
import {
  LoadPaymentRequestPayload,
  PaymentRequestDetails,
  CustomErrors,
  CustomerPayload,
  SearchCustomerPayload,
  GenerateCnPayload
} from '@poss-web/shared/models';

export enum RazorpayStatusCheckActionTypes {
  SEARCH_CUSTOMER = '[Razorpay Status Check] Search Customer',
  SEARCH_CUSTOMER_SUCCESS = '[Razorpay Status Check] Search Customer Success',
  SEARCH_CUSTOMER_FAILURE = '[Razorpay Status Check] Search Customer Failure',

  LOAD_RAZORPAY_PAYMENT_REQUESTS = '[Razorpay Status Check] Load Razorpay Payment Requests',
  LOAD_RAZORPAY_PAYMENT_REQUESTS_SUCCESS = '[Razorpay Status Check] Load Razorpay Payment Requests Success',
  LOAD_RAZORPAY_PAYMENT_REQUESTS_FAILURE = '[Razorpay Status Check] Load Razorpay Payment Requests Failure',

  LOAD_RAZORPAY_PAYMENT_REQUESTS_HISTORY = '[Razorpay Status Check] Load Razorpay Payment Requests History',
  LOAD_RAZORPAY_PAYMENT_REQUESTS_HISTORY_SUCCESS = '[Razorpay Status Check] Load Razorpay Payment Requests History Success',
  LOAD_RAZORPAY_PAYMENT_REQUESTS_HISTORY_FAILURE = '[Razorpay Status Check] Load Razorpay Payment Requests History Failure',

  VERIFY_RAZORPAY_PAYMENT = '[Razorpay Status Check] Verify Razorpay Payment Request',
  VERIFY_RAZORPAY_PAYMENT_SUCCESS = '[Razorpay Status Check] Verify Payment Request Success',
  VERIFY_RAZORPAY_PAYMENT_FAILURE = '[Razorpay Status Check] Verify Payment RequestFailure',

  GENERATE_CN_FOR_RAZORPAY_PAYMENT = '[Razorpay Status Check] Generate CN for Razorpay Payment Request',
  GENERATE_CN_FOR_RAZORPAY_PAYMENT_SUCCESS = '[Razorpay Status Check] Generate CN for Payment Request Success',
  GENERATE_CN_FOR_RAZORPAY_PAYMENT_FAILURE = '[Razorpay Status Check] Generate CN for Payment RequestFailure',

  RESET_RAZORPAY_PAYMENT_REQUESTS = '[Razorpay Status Check] Clear Razorpay Payment Requests',
  RESET_RAZORPAY_PAYMENT_REQUESTS_HISTORY = '[Razorpay Status Check] Clear Razorpay Payment Requests History',
  RESET_ERROR = '[Razorpay Status Check] Clear Razorpay Error'
}

export class SearchCustomer implements Action {
  readonly type = RazorpayStatusCheckActionTypes.SEARCH_CUSTOMER;
  constructor(readonly payload: SearchCustomerPayload) {}
}

export class SearchCustomerSuccess implements Action {
  readonly type = RazorpayStatusCheckActionTypes.SEARCH_CUSTOMER_SUCCESS;
  constructor(readonly payload: CustomerPayload) {}
}

export class SearchCustomerFailure implements Action {
  readonly type = RazorpayStatusCheckActionTypes.SEARCH_CUSTOMER_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadRazorpayPaymentRequests implements Action {
  readonly type = RazorpayStatusCheckActionTypes.LOAD_RAZORPAY_PAYMENT_REQUESTS;
  constructor(readonly payload: LoadPaymentRequestPayload) {}
}

export class LoadRazorpayPaymentRequestsSuccess implements Action {
  readonly type =
    RazorpayStatusCheckActionTypes.LOAD_RAZORPAY_PAYMENT_REQUESTS_SUCCESS;
  constructor(
    readonly payload: { payments: PaymentRequestDetails[]; count: number }
  ) {}
}

export class LoadRazorpayPaymentRequestsFailure implements Action {
  readonly type =
    RazorpayStatusCheckActionTypes.LOAD_RAZORPAY_PAYMENT_REQUESTS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadRazorpayPaymentRequestsHistory implements Action {
  readonly type =
    RazorpayStatusCheckActionTypes.LOAD_RAZORPAY_PAYMENT_REQUESTS_HISTORY;
  constructor(readonly payload: LoadPaymentRequestPayload) {}
}

export class LoadRazorpayPaymentRequestsHistorySuccess implements Action {
  readonly type =
    RazorpayStatusCheckActionTypes.LOAD_RAZORPAY_PAYMENT_REQUESTS_HISTORY_SUCCESS;
  constructor(
    readonly payload: { payments: PaymentRequestDetails[]; count: number }
  ) {}
}

export class LoadRazorpayPaymentRequestsHistoryFailure implements Action {
  readonly type =
    RazorpayStatusCheckActionTypes.LOAD_RAZORPAY_PAYMENT_REQUESTS_HISTORY_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class VerifyRazorpayPaymentRequest implements Action {
  readonly type = RazorpayStatusCheckActionTypes.VERIFY_RAZORPAY_PAYMENT;
  constructor(public payload: string) {}
}
export class VerifyRazorpayPaymentRequestSuccess implements Action {
  readonly type =
    RazorpayStatusCheckActionTypes.VERIFY_RAZORPAY_PAYMENT_SUCCESS;
  constructor(public payload: PaymentRequestDetails) {}
}

export class VerifyRazorpayPaymentRequestFailure implements Action {
  readonly type =
    RazorpayStatusCheckActionTypes.VERIFY_RAZORPAY_PAYMENT_FAILURE;
  constructor(
    public payload: {
      paymentId: string;
      error: CustomErrors;
    }
  ) {}
}

export class GenerateCNforRazorpayRequest implements Action {
  readonly type =
    RazorpayStatusCheckActionTypes.GENERATE_CN_FOR_RAZORPAY_PAYMENT;
  constructor(public payload: GenerateCnPayload) {}
}
export class GenerateCNforRazorpayRequestSuccess implements Action {
  readonly type =
    RazorpayStatusCheckActionTypes.GENERATE_CN_FOR_RAZORPAY_PAYMENT_SUCCESS;
  constructor(public payload: PaymentRequestDetails) {}
}

export class GenerateCNforRazorpayRequestFailure implements Action {
  readonly type =
    RazorpayStatusCheckActionTypes.GENERATE_CN_FOR_RAZORPAY_PAYMENT_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class ResetRazorpayPaymentRequestsList implements Action {
  readonly type =
    RazorpayStatusCheckActionTypes.RESET_RAZORPAY_PAYMENT_REQUESTS;
}
export class ResetRazorpayPaymentRequestsHistory implements Action {
  readonly type =
    RazorpayStatusCheckActionTypes.RESET_RAZORPAY_PAYMENT_REQUESTS_HISTORY;
}

export class ResetRazorpayPaymentERROR implements Action {
  readonly type = RazorpayStatusCheckActionTypes.RESET_ERROR;
}

export type RazorpayPaymentActions =
  | SearchCustomer
  | SearchCustomerSuccess
  | SearchCustomerFailure
  | LoadRazorpayPaymentRequests
  | LoadRazorpayPaymentRequestsSuccess
  | LoadRazorpayPaymentRequestsFailure
  | LoadRazorpayPaymentRequestsHistory
  | LoadRazorpayPaymentRequestsHistorySuccess
  | LoadRazorpayPaymentRequestsHistoryFailure
  | VerifyRazorpayPaymentRequest
  | VerifyRazorpayPaymentRequestSuccess
  | VerifyRazorpayPaymentRequestFailure
  | ResetRazorpayPaymentRequestsList
  | ResetRazorpayPaymentRequestsHistory
  | GenerateCNforRazorpayRequest
  | GenerateCNforRazorpayRequestSuccess
  | GenerateCNforRazorpayRequestFailure
  | ResetRazorpayPaymentERROR;
