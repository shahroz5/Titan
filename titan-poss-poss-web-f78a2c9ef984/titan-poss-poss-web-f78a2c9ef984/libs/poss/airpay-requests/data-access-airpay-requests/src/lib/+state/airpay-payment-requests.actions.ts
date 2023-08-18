import { Action } from '@ngrx/store';
import {
  LoadPaymentRequestPayload,
  PaymentRequestDetails,
  CustomErrors,
  CustomerPayload,
  SearchCustomerPayload,
  GenerateCnPayload
} from '@poss-web/shared/models';

export enum AirpayPaymentRequestActionTypes {
  SEARCH_CUSTOMER = '[Airpay Payment Requests] Search Customer',
  SEARCH_CUSTOMER_SUCCESS = '[Airpay Payment Requests] Search Customer Success',
  SEARCH_CUSTOMER_FAILURE = '[Airpay Payment Requests] Search Customer Failure',

  LOAD_AIRPAY_PAYMENT_REQUESTS = '[Airpay Payment Requests] Load Airpay Payment Requests',
  LOAD_AIRPAY_PAYMENT_REQUESTS_SUCCESS = '[Airpay Payment Requests] Load Airpay Payment Requests Success',
  LOAD_AIRPAY_PAYMENT_REQUESTS_FAILURE = '[Airpay Payment Requests] Load Airpay Payment Requests Failure',

  LOAD_AIRPAY_PAYMENT_REQUESTS_HISTORY = '[Airpay Payment Requests] Load Airpay Payment Requests History',
  LOAD_AIRPAY_PAYMENT_REQUESTS_HISTORY_SUCCESS = '[Airpay Payment Requests] Load Airpay Payment Requests History Success',
  LOAD_AIRPAY_PAYMENT_REQUESTS_HISTORY_FAILURE = '[Airpay Payment Requests] Load Airpay Payment Requests History Failure',

  VERIFY_AIRPAY_PAYMENT = '[Airpay Payment Requests] Verify Airpay Payment Request',
  VERIFY_AIRPAY_PAYMENT_SUCCESS = '[Airpay Payment Requests] Verify Payment Request Success',
  VERIFY_AIRPAY_PAYMENT_FAILURE = '[Airpay Payment Requests] Verify Payment RequestFailure',

  GENERATE_CN_FOR_AIRPAY_PAYMENT = '[Airpay Payment Requests] Generate CN for Airpay Payment Request',
  GENERATE_CN_FOR_AIRPAY_PAYMENT_SUCCESS = '[Airpay Payment Requests] Generate CN for Payment Request Success',
  GENERATE_CN_FOR_AIRPAY_PAYMENT_FAILURE = '[Airpay Payment Requests] Generate CN for Payment RequestFailure',

  RESET_AIRPAY_PAYMENT_REQUESTS = '[Airpay Payment Requests] Clear Airpay Payment Requests',
  RESET_AIRPAY_PAYMENT_REQUESTS_HISTORY = '[Airpay Payment Requests] Clear Airpay Payment Requests History',
  RESET_ERROR = '[Airpay Payment Requests] Reset Airpay Payment Error'
}

export class SearchCustomer implements Action {
  readonly type = AirpayPaymentRequestActionTypes.SEARCH_CUSTOMER;
  constructor(readonly payload: SearchCustomerPayload) {}
}

export class SearchCustomerSuccess implements Action {
  readonly type = AirpayPaymentRequestActionTypes.SEARCH_CUSTOMER_SUCCESS;
  constructor(readonly payload: CustomerPayload) {}
}

export class SearchCustomerFailure implements Action {
  readonly type = AirpayPaymentRequestActionTypes.SEARCH_CUSTOMER_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadAirpayPaymentRequests implements Action {
  readonly type = AirpayPaymentRequestActionTypes.LOAD_AIRPAY_PAYMENT_REQUESTS;
  constructor(readonly payload: LoadPaymentRequestPayload) {}
}

export class LoadAirpayPaymentRequestsSuccess implements Action {
  readonly type =
    AirpayPaymentRequestActionTypes.LOAD_AIRPAY_PAYMENT_REQUESTS_SUCCESS;
  constructor(
    readonly payload: { payments: PaymentRequestDetails[]; count: number }
  ) {}
}

export class LoadAirpayPaymentRequestsFailure implements Action {
  readonly type =
    AirpayPaymentRequestActionTypes.LOAD_AIRPAY_PAYMENT_REQUESTS_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class LoadAirpayPaymentRequestsHistory implements Action {
  readonly type =
    AirpayPaymentRequestActionTypes.LOAD_AIRPAY_PAYMENT_REQUESTS_HISTORY;
  constructor(readonly payload: LoadPaymentRequestPayload) {}
}

export class LoadAirpayPaymentRequestsHistorySuccess implements Action {
  readonly type =
    AirpayPaymentRequestActionTypes.LOAD_AIRPAY_PAYMENT_REQUESTS_HISTORY_SUCCESS;
  constructor(
    readonly payload: { payments: PaymentRequestDetails[]; count: number }
  ) {}
}

export class LoadAirpayPaymentRequestsHistoryFailure implements Action {
  readonly type =
    AirpayPaymentRequestActionTypes.LOAD_AIRPAY_PAYMENT_REQUESTS_HISTORY_FAILURE;
  constructor(readonly payload: CustomErrors) {}
}

export class VerifyAirpayPaymentRequest implements Action {
  readonly type = AirpayPaymentRequestActionTypes.VERIFY_AIRPAY_PAYMENT;
  constructor(public payload: string) {}
}
export class VerifyAirpayPaymentRequestSuccess implements Action {
  readonly type = AirpayPaymentRequestActionTypes.VERIFY_AIRPAY_PAYMENT_SUCCESS;
  constructor(public payload: PaymentRequestDetails) {}
}

export class VerifyAirpayPaymentRequestFailure implements Action {
  readonly type = AirpayPaymentRequestActionTypes.VERIFY_AIRPAY_PAYMENT_FAILURE;
  constructor(
    public payload: {
      paymentId: string;
      error: CustomErrors;
    }
  ) {}
}

export class GenerateCNforAirpayRequest implements Action {
  readonly type =
    AirpayPaymentRequestActionTypes.GENERATE_CN_FOR_AIRPAY_PAYMENT;
  constructor(public payload: GenerateCnPayload) {}
}
export class GenerateCNforAirpayRequestSuccess implements Action {
  readonly type =
    AirpayPaymentRequestActionTypes.GENERATE_CN_FOR_AIRPAY_PAYMENT_SUCCESS;
  constructor(public payload: PaymentRequestDetails) {}
}

export class GenerateCNforAirpayRequestFailure implements Action {
  readonly type =
    AirpayPaymentRequestActionTypes.GENERATE_CN_FOR_AIRPAY_PAYMENT_FAILURE;
  constructor(public payload: CustomErrors) {}
}
export class ResetAirpayPaymentRequestsList implements Action {
  readonly type = AirpayPaymentRequestActionTypes.RESET_AIRPAY_PAYMENT_REQUESTS;
}
export class ResetAirpayPaymentRequestsHistory implements Action {
  readonly type =
    AirpayPaymentRequestActionTypes.RESET_AIRPAY_PAYMENT_REQUESTS_HISTORY;
}
export class ResetAirpayPaymentRequestsError implements Action {
  readonly type = AirpayPaymentRequestActionTypes.RESET_ERROR;
}

export type AirpayPaymentActions =
  | SearchCustomer
  | SearchCustomerSuccess
  | SearchCustomerFailure
  | LoadAirpayPaymentRequests
  | LoadAirpayPaymentRequestsSuccess
  | LoadAirpayPaymentRequestsFailure
  | LoadAirpayPaymentRequestsHistory
  | LoadAirpayPaymentRequestsHistorySuccess
  | LoadAirpayPaymentRequestsHistoryFailure
  | VerifyAirpayPaymentRequest
  | VerifyAirpayPaymentRequestSuccess
  | VerifyAirpayPaymentRequestFailure
  | ResetAirpayPaymentRequestsList
  | ResetAirpayPaymentRequestsHistory
  | GenerateCNforAirpayRequest
  | GenerateCNforAirpayRequestSuccess
  | GenerateCNforAirpayRequestFailure
  | ResetAirpayPaymentRequestsError;
