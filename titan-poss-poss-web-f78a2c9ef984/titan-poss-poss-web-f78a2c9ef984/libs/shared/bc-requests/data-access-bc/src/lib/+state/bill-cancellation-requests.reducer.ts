import { BillCancellationRequestsState } from './bill-cancellation-requests.state';

import { createFeatureSelector } from '@ngrx/store';
import {
  billDetailsAdapter,
  billStatusAdapter,
  itemDetailsAdapter
} from './bill-cancellation-requests.entity';
import {
  BillCancellationRequestsActions,
  BillCancellationRequestsActionsTypes
} from './bill-cancellation-requests.actions';

export const BILL_CANCELLATION_REQUESTS_FEATURE_KEY =
  'bill-cancellation-request';

export const selectBillCancellationRequestsState = createFeatureSelector<
  BillCancellationRequestsState
>(BILL_CANCELLATION_REQUESTS_FEATURE_KEY);

export const initialState: BillCancellationRequestsState = {
  billCancellationRequests: billDetailsAdapter.getInitialState(),
  billancellationRequestsDetail: null,
  billCancellationRequestsCount: 0,
  hasError: null,
  isLoading: false,
  locations: null,
  billCancelStatus: billStatusAdapter.getInitialState(),
  productDetails: itemDetailsAdapter.getInitialState(),
  viewCashMemoResponse: null,
  advancedFilter: 'APPROVED',
  selectedData: null,
  deleteResponse: null,
  confirmResponse: null,
  cancelResponse: null,
  billStatusCount: 0,
  cancelType: null,
  errorWhileCancellingBill: false
};

export function BillCancellationRequestsReducer(
  state: BillCancellationRequestsState = initialState,
  action: BillCancellationRequestsActions
): BillCancellationRequestsState {
  switch (action.type) {
    case BillCancellationRequestsActionsTypes.RESET:
      return {
        ...state,
        billCancellationRequests: billDetailsAdapter.getInitialState(),
        billancellationRequestsDetail: null,
        billCancellationRequestsCount: 0,
        hasError: null,
        isLoading: false,
        errorWhileCancellingBill: false
      };
    case BillCancellationRequestsActionsTypes.LOAD_SELECTED_DATA:
    case BillCancellationRequestsActionsTypes.CANCEL_TYPE:
    case BillCancellationRequestsActionsTypes.CONFIRM:
    case BillCancellationRequestsActionsTypes.DELETE:
    case BillCancellationRequestsActionsTypes.GET_ITEM_FROM_CASH_MEMO:
    case BillCancellationRequestsActionsTypes.LOAD_BILL_CANCELLATION_REQUESTS_STATUS:
    case BillCancellationRequestsActionsTypes.LOAD_LOCATION:
    case BillCancellationRequestsActionsTypes.COUNT_BILL_CANCELLATION_REQUESTS:
    case BillCancellationRequestsActionsTypes.APPROVE_BILL_CANCELLATION_REQUESTS:
    case BillCancellationRequestsActionsTypes.LOAD_BILL_CANCELLATION_REQUESTS:
      return {
        ...state,
        isLoading: true,
        hasError: null
      };

    case BillCancellationRequestsActionsTypes.LOAD_BILL_CANCELLATION_REQUESTS_SUCCESS:
      console.log(action.payload);
      return {
        ...state,
        isLoading: false,

        billCancellationRequests: billDetailsAdapter.setAll(
          action.payload.results,
          state.billCancellationRequests
        ),
        billCancellationRequestsCount: action.payload.count,
        hasError: null
      };
    case BillCancellationRequestsActionsTypes.COUNT_BILL_CANCELLATION_REQUESTS_SUCCESS:
      return {
        ...state,
        isLoading: false,

        billCancellationRequestsCount: action.payload,
        hasError: null
      };
    case BillCancellationRequestsActionsTypes.APPROVE_BILL_CANCELLATION_REQUESTS_SUCCESS:
      console.log(action.payload);
      return {
        ...state,
        isLoading: false,

        billancellationRequestsDetail: action.payload,
        hasError: null
      };
    case BillCancellationRequestsActionsTypes.LOAD_SELECTED_FAILURE:
    case BillCancellationRequestsActionsTypes.CANCEL_TYPE_FAILURE:
    case BillCancellationRequestsActionsTypes.LOAD_LOCATION_FAILURE:
    case BillCancellationRequestsActionsTypes.DELETE_FAILURE:
    case BillCancellationRequestsActionsTypes.CONFIRM_FAILURE:
    case BillCancellationRequestsActionsTypes.LOAD_BILL_CANCELLATION_REQUESTS_STATUS_FAILURE:
    case BillCancellationRequestsActionsTypes.GET_ITEM_FROM_CASH_MEMO_FAILURE:
    case BillCancellationRequestsActionsTypes.COUNT_BILL_CANCELLATION_REQUESTS_FAILURE:
    case BillCancellationRequestsActionsTypes.APPROVE_BILL_CANCELLATION_REQUESTS_FAILURE:
    case BillCancellationRequestsActionsTypes.LOAD_BILL_CANCELLATION_REQUESTS_FAILURE:
      return {
        ...state,
        isLoading: false,

        hasError: action.payload
      };

    case BillCancellationRequestsActionsTypes.LOAD_LOCATION_SUCCESS:
      return {
        ...state,
        locations: action.payload,
        isLoading: false,
        hasError: null
      };

    case BillCancellationRequestsActionsTypes.RESET_BC_STATUS:
      return {
        ...state,
        billCancelStatus: billStatusAdapter.getInitialState(),
        billStatusCount: 0,

        hasError: null,
        viewCashMemoResponse: null,
        isLoading: false
      };

    case BillCancellationRequestsActionsTypes.RESET_DETAIL:
      return {
        ...state,
        hasError: null,
        isLoading: false,
        cancelType: null,
        productDetails: itemDetailsAdapter.getInitialState(),
        deleteResponse: null,
        confirmResponse: null,
        cancelResponse: null
      };
    case BillCancellationRequestsActionsTypes.LOAD_SELECTED_DATA_SUCESS:
    case BillCancellationRequestsActionsTypes.LOAD_SELECTED:
      return {
        ...state,
        selectedData: action.payload
      };

    case BillCancellationRequestsActionsTypes.DELETE_SUCCESS:
      console.log(action.payload);
      return {
        ...state,
        isLoading: false,

        deleteResponse: action.payload,
        hasError: null
      };

    case BillCancellationRequestsActionsTypes.CONFIRM_SUCCESS:
      console.log(action.payload);
      return {
        ...state,
        isLoading: false,

        confirmResponse: action.payload,
        hasError: null
      };

    case BillCancellationRequestsActionsTypes.CANCEL:
      return {
        ...state,
        isLoading: true,
        hasError: null,
        errorWhileCancellingBill: false
      };

    case BillCancellationRequestsActionsTypes.CANCEL_SUCCESS:
      console.log(action.payload);
      return {
        ...state,
        isLoading: false,

        cancelResponse: action.payload,
        hasError: null
      };

    case BillCancellationRequestsActionsTypes.CANCEL_FAILURE:
      return {
        ...state,
        isLoading: false,
        errorWhileCancellingBill: true,
        hasError: action.payload
      };

    case BillCancellationRequestsActionsTypes.CANCEL_TYPE_SUCCESS:
      console.log(action.payload);
      return {
        ...state,
        isLoading: false,

        cancelType: action.payload.results,
        hasError: null
      };

    case BillCancellationRequestsActionsTypes.LOAD_BILL_CANCELLATION_REQUESTS_STATUS_SUCCESS:
      console.log(action.payload);
      return {
        ...state,
        isLoading: false,

        billCancelStatus: billStatusAdapter.addMany(
          action.payload.results,
          state.billCancelStatus
        ),
        billStatusCount: action.payload.totalElements,

        hasError: null
      };

    case BillCancellationRequestsActionsTypes.GET_ITEM_FROM_CASH_MEMO_SUCCESS:
      return {
        ...state,
        productDetails: itemDetailsAdapter.addMany(
          [action.payload],
          state.productDetails
        ),

        hasError: null,
        isLoading: false
      };

    case BillCancellationRequestsActionsTypes.VIEW_CASH_MEMO_FAILURE:
      return {
        ...state,
        isLoading: false,
        viewCashMemoResponse: null,
        hasError: action.payload
      };
    case BillCancellationRequestsActionsTypes.LOAD_HISTORY_FILTER_DATA:
      return {
        ...state,
        advancedFilter: action.payload
      };
    case BillCancellationRequestsActionsTypes.VIEW_CASH_MEMO_SUCCESS:
      return {
        ...state,
        isLoading: false,
        viewCashMemoResponse: action.payload
      };

    case BillCancellationRequestsActionsTypes.RESET_FILTER:
      return {
        ...state,
        advancedFilter: 'APPROVED'
      };

    default:
      return state;
  }
}
