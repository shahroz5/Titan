import { createFeatureSelector } from '@ngrx/store';
import { RazorpayStatusCheckState } from './razorpay-status-check.state';
import { razorpayPaymentDetailsAdapter } from './razorpay-status-check.entity';
import {
  RazorpayPaymentActions,
  RazorpayStatusCheckActionTypes
} from './razorpay-status-check.actions';

export const RAZORPPAY_STATUS_CHECK_FEATURE_KEY = 'razorpayStatusCheck';
export const selectRazorpayStatusCheckState = createFeatureSelector<
  RazorpayStatusCheckState
>(RAZORPPAY_STATUS_CHECK_FEATURE_KEY);
export const initialState: RazorpayStatusCheckState = {
  isSearchingCustomer: false,
  hasSearchedCustomer: false,
  searchedCustomerDetails: null,

  paymentRequestList: razorpayPaymentDetailsAdapter.getInitialState(),
  paymentRequestListCount: 0,

  paymentRequesHistory: razorpayPaymentDetailsAdapter.getInitialState(),
  paymentRequestsHistoryCount: 0,

  verificationResponse: null,

  isLoading: false,
  error: null
};

export function RazorpayStatusCheckReducer(
  state: RazorpayStatusCheckState = initialState,
  action: RazorpayPaymentActions
): RazorpayStatusCheckState {
  switch (action.type) {
    case RazorpayStatusCheckActionTypes.SEARCH_CUSTOMER:
      return {
        ...state,
        isSearchingCustomer: true,
        hasSearchedCustomer: false,
        searchedCustomerDetails: null,
        error: null
      };
    case RazorpayStatusCheckActionTypes.SEARCH_CUSTOMER_SUCCESS:
      return {
        ...state,
        isSearchingCustomer: false,
        hasSearchedCustomer: true,
        searchedCustomerDetails: action.payload
      };
    case RazorpayStatusCheckActionTypes.SEARCH_CUSTOMER_FAILURE:
      return {
        ...state,
        isSearchingCustomer: false,
        hasSearchedCustomer: false,
        error: action.payload
      };

    case RazorpayStatusCheckActionTypes.LOAD_RAZORPAY_PAYMENT_REQUESTS:
      return {
        ...state,
        paymentRequestList: razorpayPaymentDetailsAdapter.removeAll(
          state.paymentRequestList
        ),
        verificationResponse: null,
        isLoading: true
      };
    case RazorpayStatusCheckActionTypes.LOAD_RAZORPAY_PAYMENT_REQUESTS_SUCCESS:
      return {
        ...state,
        paymentRequestList: razorpayPaymentDetailsAdapter.setAll(
          action.payload.payments,
          state.paymentRequestList
        ),
        paymentRequestListCount: action.payload.count,
        isLoading: false
      };
    case RazorpayStatusCheckActionTypes.LOAD_RAZORPAY_PAYMENT_REQUESTS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case RazorpayStatusCheckActionTypes.LOAD_RAZORPAY_PAYMENT_REQUESTS_HISTORY:
      return {
        ...state,
        paymentRequesHistory: razorpayPaymentDetailsAdapter.removeAll(
          state.paymentRequesHistory
        ),
        verificationResponse: null,
        isLoading: true
      };
    case RazorpayStatusCheckActionTypes.LOAD_RAZORPAY_PAYMENT_REQUESTS_HISTORY_SUCCESS:
      return {
        ...state,
        paymentRequesHistory: razorpayPaymentDetailsAdapter.setAll(
          action.payload.payments,
          state.paymentRequesHistory
        ),
        paymentRequestsHistoryCount: action.payload.count,
        isLoading: false
      };
    case RazorpayStatusCheckActionTypes.LOAD_RAZORPAY_PAYMENT_REQUESTS_HISTORY_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    case RazorpayStatusCheckActionTypes.VERIFY_RAZORPAY_PAYMENT:
      return {
        ...state,

        paymentRequestList: razorpayPaymentDetailsAdapter.updateOne(
          {
            id: action.payload,
            changes: {
              isVerifying: true
            }
          },
          state.paymentRequestList
        )
      };
    case RazorpayStatusCheckActionTypes.VERIFY_RAZORPAY_PAYMENT_SUCCESS:
      return {
        ...state,
        verificationResponse: action.payload,

        paymentRequestList: razorpayPaymentDetailsAdapter.updateOne(
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
    case RazorpayStatusCheckActionTypes.VERIFY_RAZORPAY_PAYMENT_FAILURE:
      return {
        ...state,

        paymentRequestList: razorpayPaymentDetailsAdapter.updateOne(
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

    case RazorpayStatusCheckActionTypes.RESET_RAZORPAY_PAYMENT_REQUESTS:
      return {
        ...state,
        paymentRequestListCount: 0,
        paymentRequestList: razorpayPaymentDetailsAdapter.removeAll(
          state.paymentRequestList
        ),
        verificationResponse: null
      };
    case RazorpayStatusCheckActionTypes.RESET_RAZORPAY_PAYMENT_REQUESTS_HISTORY:
      return {
        ...state,
        paymentRequestsHistoryCount: 0,
        paymentRequesHistory: razorpayPaymentDetailsAdapter.removeAll(
          state.paymentRequesHistory
        ),
        verificationResponse: null
      };
    case RazorpayStatusCheckActionTypes.RESET_ERROR:
      return {
        ...state,
        error: null
      };
    case RazorpayStatusCheckActionTypes.GENERATE_CN_FOR_RAZORPAY_PAYMENT:
      return {
        ...state,
        isLoading: true,
        verificationResponse: null,
        error: null
      };
    case RazorpayStatusCheckActionTypes.GENERATE_CN_FOR_RAZORPAY_PAYMENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        verificationResponse: action.payload
      };
    case RazorpayStatusCheckActionTypes.GENERATE_CN_FOR_RAZORPAY_PAYMENT_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    default:
      return state;
  }
}
