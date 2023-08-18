import { BillCancelState } from './bill-cancel.state';
import { createFeatureSelector } from '@ngrx/store';
import {
  BillCancelActions,
  BillCancelActionsTypes
} from './bill-cancel.actions';
import { itemDetailsAdapter } from './bill-cancel.entity';

export const BILL_CANCEL_FEATURE_KEY = 'bill-cancel';

export const selectBillCancelState = createFeatureSelector<BillCancelState>(
  BILL_CANCEL_FEATURE_KEY
);

export const initialState: BillCancelState = {
  productDetails: itemDetailsAdapter.getInitialState(),
  viewCashMemoResponse: null,
  hasError: null,
  isLoading: false,
  confirmResponse: null,
  cancelResponse: null,
  cmBillList: [],
  historyList: null,
  reasonsForCancel: [],
  rsoDetails: [],
  cancelType: null,
  bcHistoryRequestParams: null,
  errorWhileCancellingBill: false
};

export function BillCancelReducer(
  state: BillCancelState = initialState,
  action: BillCancelActions
): BillCancelState {
  switch (action.type) {
    case BillCancelActionsTypes.RESET_DETAIL:
      return {
        ...state,
        hasError: null,
        isLoading: false,
        productDetails: itemDetailsAdapter.getInitialState(),
        viewCashMemoResponse: null,
        confirmResponse: null,
        cancelResponse: null,
        reasonsForCancel: [],
        rsoDetails: [],
        cancelType: null,
        errorWhileCancellingBill: false
      };

    case BillCancelActionsTypes.RESET_LIST:
      return {
        ...state,
        hasError: null,
        cmBillList: [],
        isLoading: false
      };

    case BillCancelActionsTypes.RESET_HISTORY:
      return {
        ...state,
        hasError: null,
        historyList: null,
        isLoading: false
      };

    case BillCancelActionsTypes.CONFIRM:
    case BillCancelActionsTypes.GET_ITEM_FROM_CASH_MEMO:
    case BillCancelActionsTypes.LOAD_REASON_FOR_CANCEL:
    case BillCancelActionsTypes.LOAD_RSO_DETAILS:
    case BillCancelActionsTypes.CANCEL_TYPE:
      return {
        ...state,
        isLoading: true,
        hasError: null
      };

    case BillCancelActionsTypes.CONFIRM_SUCCESS:
      return {
        ...state,
        isLoading: false,
        confirmResponse: action.payload,
        hasError: null
      };

    case BillCancelActionsTypes.CANCEL:
      return {
        ...state,
        isLoading: true,
        hasError: null,
        errorWhileCancellingBill: false
      };

    case BillCancelActionsTypes.CANCEL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        cancelResponse: action.payload,
        hasError: null
      };

    case BillCancelActionsTypes.CANCEL_FAILURE:
      return {
        ...state,
        isLoading: false,
        errorWhileCancellingBill: true,
        hasError: action.payload
      };

    case BillCancelActionsTypes.GET_ITEM_FROM_CASH_MEMO_SUCCESS:
      return {
        ...state,
        productDetails: itemDetailsAdapter.addMany(
          [action.payload],
          state.productDetails
        ),
        hasError: null,
        isLoading: false
      };

    case BillCancelActionsTypes.CONFIRM_FAILURE:
    case BillCancelActionsTypes.GET_ITEM_FROM_CASH_MEMO_FAILURE:
    case BillCancelActionsTypes.LOAD_CM_BILL_LIST_FAILURE:
    case BillCancelActionsTypes.LOAD_REASON_FOR_CANCEL_FAILURE:
    case BillCancelActionsTypes.LOAD_RSO_DETAILS_FAILURE:
    case BillCancelActionsTypes.CANCEL_TYPE_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasError: action.payload
      };

    case BillCancelActionsTypes.VIEW_CASH_MEMO_FAILURE:
      return {
        ...state,
        isLoading: false,
        viewCashMemoResponse: null,
        hasError: action.payload
      };
    case BillCancelActionsTypes.LOAD_BC_HISTORY:
      return {
        ...state,
        isLoading: true,
        hasError: null
      };

    case BillCancelActionsTypes.LOAD_BC_HISTORY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        historyList: action.payload,
        hasError: null
      };
    case BillCancelActionsTypes.LOAD_BC_HISTORY_FAILURE:
      return {
        ...state,
        isLoading: false,
        historyList: null,
        hasError: action.payload
      };

    case BillCancelActionsTypes.VIEW_CASH_MEMO_SUCCESS:
      return {
        ...state,
        isLoading: false,
        viewCashMemoResponse: action.payload
      };

    case BillCancelActionsTypes.LOAD_CM_BILL_LIST:
      return {
        ...state,
        isLoading: true,
        cmBillList: [],
        hasError: null
      };

    case BillCancelActionsTypes.LOAD_CM_BILL_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        cmBillList: action.payload,
        hasError: null
      };

    case BillCancelActionsTypes.LOAD_REASON_FOR_CANCEL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        reasonsForCancel: action.payload,
        hasError: null
      };

    case BillCancelActionsTypes.LOAD_RSO_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        rsoDetails: action.payload,
        hasError: null
      };

    case BillCancelActionsTypes.SET_HISTORY_SEARCH_PARAM_DETAILS:
      return {
        ...state,
        bcHistoryRequestParams: action.payload
      };

    case BillCancelActionsTypes.CANCEL_TYPE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        cancelType: action.payload.results,
        hasError: null
      };

    default:
      return state;
  }
}
