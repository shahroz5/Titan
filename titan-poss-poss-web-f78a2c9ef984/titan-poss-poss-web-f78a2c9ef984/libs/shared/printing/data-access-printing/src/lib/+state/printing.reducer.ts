import { createFeatureSelector } from '@ngrx/store';
import { PrintingState } from './printing.state';
import { PrintingActionTypes, PrintingActions } from './printing.actions';

export const printingFeatureKey = 'printing';

export const selectPrintingState = createFeatureSelector<PrintingState>(
  printingFeatureKey
);

export const initialState: PrintingState = {
  hasError: null,
  isLoading: false,
  isPrintingSuccess: null,
  lastTransactionId: null,
  lastTransactionPaymentType: null,
  transactionIds: null,
  isNotificationPrintSuccess: null,
  isNotificationMailSent: null
};

export function printingReducer(
  state: PrintingState = initialState,
  action: PrintingActions
): PrintingState {
  switch (action.type) {
    case PrintingActionTypes.PRINT_RECEIPT:
    case PrintingActionTypes.VERIFY_CUSTOMER_PRINT_DETAILS:
    case PrintingActionTypes.LOAD_PRINT_DETAILS:
      return {
        ...state,
        isLoading: true,
        hasError: null,
        isMailSent: false,
        isPrintingSuccess: null
      };

    case PrintingActionTypes.GET_NOTIFICATION_PRINT:
    case PrintingActionTypes.GET_NOTIFICATION_MAIL:
      return {
        ...state,
        isLoading: true,
        hasError: null,
        isNotificationMailSent: false,
        isNotificationPrintSuccess: null
      };

    case PrintingActionTypes.GET_NOTIFICATION_PRINT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isNotificationPrintSuccess: true,
        isNotificationMailSent: false
      };

    case PrintingActionTypes.GET_NOTIFICATION_MAIL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isNotificationMailSent: true,
        isNotificationPrintSuccess: false
      };

    case PrintingActionTypes.GET_NOTIFICATION_PRINT_FAILURE:
      return {
        ...state,
        hasError: action.payload,
        isNotificationPrintSuccess: false
      };

    case PrintingActionTypes.GET_NOTIFICATION_MAIL_FAILURE:
      return {
        ...state,
        hasError: action.payload,
        isNotificationMailSent: false
      };

    case PrintingActionTypes.PRINT_RECEIPT_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasError: action.payload,
        isPrintingSuccess: false
      };

    case PrintingActionTypes.LOAD_PRINT_DETAILS_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasError: action.payload
      };

    case PrintingActionTypes.PRINT_RECEIPT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasError: null,
        isPrintingSuccess: true
      };

    case PrintingActionTypes.LOAD_PRINT_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasError: null
      };

    case PrintingActionTypes.MAIL_RECEIPT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasError: null,
        isMailSent: true
      };

    case PrintingActionTypes.RESET_PRINT_DATA:
      return {
        ...state,
        isLoading: false,
        hasError: null,
        isPrintingSuccess: null,
        transactionIds: null,
        isMailSent: false,
        isNotificationMailSent: null,
        isNotificationPrintSuccess: null
      };

    case PrintingActionTypes.GET_LAST_TRANSACTION_ID:
      return {
        ...state,
        isLoading: true,
        hasError: null,
        lastTransactionId: null,
        lastTransactionPaymentType: null
      };

    case PrintingActionTypes.GET_LAST_TRANSACTION_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasError: null,
        lastTransactionId: action.payload.id,
        lastTransactionPaymentType: action.payload.paymentType
      };

    case PrintingActionTypes.GET_LAST_TRANSACTION_ID_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasError: action.payload,
        lastTransactionId: null,
        lastTransactionPaymentType: null
      };

    case PrintingActionTypes.GET_TRANSACTION_IDS:
      return {
        ...state,
        isLoading: true,
        hasError: null,
        transactionIds: null
      };

    case PrintingActionTypes.GET_TRANSACTION_IDS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasError: null,
        transactionIds: action.payload
      };

    case PrintingActionTypes.GET_TRANSACTION_IDS_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasError: action.payload,
        transactionIds: null
      };

    default:
      return state;
  }
}
