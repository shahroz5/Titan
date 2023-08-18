import { createFeatureSelector } from '@ngrx/store';
import { AirpayPaymentRequestState } from './airpay-payment-requests.state';
import { airpayPaymentDetailsAdapter } from './airpay-payment-requests.entity';
import {
  AirpayPaymentActions,
  AirpayPaymentRequestActionTypes
} from './airpay-payment-requests.actions';

export const AIRPAY_PAYMENT_REQUEST_FEATURE_KEY = 'airpayPaymentRequest';
export const selectAirpayPaymentRequestState = createFeatureSelector<
  AirpayPaymentRequestState
>(AIRPAY_PAYMENT_REQUEST_FEATURE_KEY);
export const initialState: AirpayPaymentRequestState = {
  isSearchingCustomer: false,
  hasSearchedCustomer: false,
  searchedCustomerDetails: null,

  paymentRequestList: airpayPaymentDetailsAdapter.getInitialState(),
  paymentRequestListCount: 0,

  paymentRequesHistory: airpayPaymentDetailsAdapter.getInitialState(),
  paymentRequestsHistoryCount: 0,

  verificationResponse: null,

  isLoading: false,
  error: null
};

export function AirpayPaymentRequestReducer(
  state: AirpayPaymentRequestState = initialState,
  action: AirpayPaymentActions
): AirpayPaymentRequestState {
  switch (action.type) {
    case AirpayPaymentRequestActionTypes.SEARCH_CUSTOMER:
      return {
        ...state,
        isSearchingCustomer: true,
        hasSearchedCustomer: false,
        searchedCustomerDetails: null,
        error: null
      };
    case AirpayPaymentRequestActionTypes.SEARCH_CUSTOMER_SUCCESS:
      return {
        ...state,
        isSearchingCustomer: false,
        hasSearchedCustomer: true,
        searchedCustomerDetails: action.payload
      };
    case AirpayPaymentRequestActionTypes.SEARCH_CUSTOMER_FAILURE:
      return {
        ...state,
        isSearchingCustomer: false,
        hasSearchedCustomer: false,
        error: action.payload
      };

    case AirpayPaymentRequestActionTypes.LOAD_AIRPAY_PAYMENT_REQUESTS:
      return {
        ...state,
        paymentRequestList: airpayPaymentDetailsAdapter.removeAll(
          state.paymentRequestList
        ),
        isLoading: true,
        verificationResponse: null
      };
    case AirpayPaymentRequestActionTypes.LOAD_AIRPAY_PAYMENT_REQUESTS_SUCCESS:
      return {
        ...state,
        paymentRequestList: airpayPaymentDetailsAdapter.setAll(
          action.payload.payments,
          state.paymentRequestList
        ),
        paymentRequestListCount: action.payload.count,
        isLoading: false
      };
    case AirpayPaymentRequestActionTypes.LOAD_AIRPAY_PAYMENT_REQUESTS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case AirpayPaymentRequestActionTypes.LOAD_AIRPAY_PAYMENT_REQUESTS_HISTORY:
      return {
        ...state,
        paymentRequesHistory: airpayPaymentDetailsAdapter.removeAll(
          state.paymentRequesHistory
        ),
        isLoading: true,
        verificationResponse: null
      };
    case AirpayPaymentRequestActionTypes.LOAD_AIRPAY_PAYMENT_REQUESTS_HISTORY_SUCCESS:
      return {
        ...state,
        paymentRequesHistory: airpayPaymentDetailsAdapter.setAll(
          action.payload.payments,
          state.paymentRequesHistory
        ),
        paymentRequestsHistoryCount: action.payload.count,
        isLoading: false
      };
    case AirpayPaymentRequestActionTypes.LOAD_AIRPAY_PAYMENT_REQUESTS_HISTORY_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    case AirpayPaymentRequestActionTypes.VERIFY_AIRPAY_PAYMENT:
      return {
        ...state,

        paymentRequestList: airpayPaymentDetailsAdapter.updateOne(
          {
            id: action.payload,
            changes: {
              isVerifying: true
            }
          },
          state.paymentRequestList
        )
      };
    case AirpayPaymentRequestActionTypes.VERIFY_AIRPAY_PAYMENT_SUCCESS:
      return {
        ...state,
        verificationResponse: action.payload,

        paymentRequestList: airpayPaymentDetailsAdapter.updateOne(
          {
            id: action.payload.id,
            changes: {
              isVerifying: false,
              status: action.payload.status,
              approvedDate: action.payload.approvedDate
            }
          },
          state.paymentRequestList
        )
      };
    case AirpayPaymentRequestActionTypes.VERIFY_AIRPAY_PAYMENT_FAILURE:
      return {
        ...state,

        paymentRequestList: airpayPaymentDetailsAdapter.updateOne(
          {
            id: action.payload.paymentId,
            changes: {
              isVerifying: false
            }
          },
          state.paymentRequestList
        ),
        error: action.payload.error
      };

    case AirpayPaymentRequestActionTypes.RESET_AIRPAY_PAYMENT_REQUESTS:
      return {
        ...state,
        paymentRequestListCount: 0,
        paymentRequestList: airpayPaymentDetailsAdapter.removeAll(
          state.paymentRequestList
        ),
        verificationResponse: null
      };
    case AirpayPaymentRequestActionTypes.RESET_AIRPAY_PAYMENT_REQUESTS_HISTORY:
      return {
        ...state,
        paymentRequestsHistoryCount: 0,
        paymentRequesHistory: airpayPaymentDetailsAdapter.removeAll(
          state.paymentRequesHistory
        ),
        verificationResponse: null
      };
    case AirpayPaymentRequestActionTypes.RESET_ERROR:
      return {
        ...state,
        error: null
      };
    case AirpayPaymentRequestActionTypes.GENERATE_CN_FOR_AIRPAY_PAYMENT:
      return {
        ...state,
        isLoading: true,
        verificationResponse: null,
        error: null
      };
    case AirpayPaymentRequestActionTypes.GENERATE_CN_FOR_AIRPAY_PAYMENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        verificationResponse: action.payload
      };
    case AirpayPaymentRequestActionTypes.GENERATE_CN_FOR_AIRPAY_PAYMENT_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    default:
      return state;
  }
}
