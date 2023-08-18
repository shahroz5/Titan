import { createFeatureSelector } from '@ngrx/store';
import { CtAcceptAdvanceState } from './ct-accept-advance.state';
import {
  CtAcceptAdvanceActionTypes,
  CtAcceptAdvanceActions
} from './ct-accept-advance.actions';

export const ctAcceptAdvanceFeatureKey = 'ctAcceptAdvance';

export const selectCtAcceptAdvanceState = createFeatureSelector<
  CtAcceptAdvanceState
>(ctAcceptAdvanceFeatureKey);

export const initialState: CtAcceptAdvanceState = {
  errors: null,
  isLoading: false,
  selectedRsoName: null,
  totalAmt: 0,
  initiateAdvanceResponse: null,
  updateAdvanceResponse: null,
  partiallyAdvanceResponse: null,
  rsoDetails: [],
  remarks: '',
  viewAdvanceResponse: null,
  advanceHistoryItems: null,
  historySearchParamDetails: null,
  orderNumber: { order: 0, status: null },
  deleteAdvanceTransactionResponse: null
};

export function CtAcceptAdvanceReducer(
  state: CtAcceptAdvanceState = initialState,
  action: CtAcceptAdvanceActions
): CtAcceptAdvanceState {
  switch (action.type) {
    case CtAcceptAdvanceActionTypes.INITIATE_ADVANCE:
    case CtAcceptAdvanceActionTypes.UPDATE_ADVANCE:
    case CtAcceptAdvanceActionTypes.PARTIALLY_UPDATE_ADVANCE:
    case CtAcceptAdvanceActionTypes.LOAD_RSO_DETAILS:
    case CtAcceptAdvanceActionTypes.VIEW_ADVANCE:
    case CtAcceptAdvanceActionTypes.LOAD_ADVANCE_HISTORY:
    case CtAcceptAdvanceActionTypes.DELETE_ADVANCE_TRANSACTION_DETAILS:
      return { ...state, isLoading: true, errors: null };
    case CtAcceptAdvanceActionTypes.LOAD_RSO_DETAILS_SUCCESS:
      return {
        ...state,
        rsoDetails: action.payload,
        errors: null,
        isLoading: false
      };
    case CtAcceptAdvanceActionTypes.LOAD_RSO_DETAILS_FAILURE:
      return {
        ...state,
        rsoDetails: null,
        errors: action.payload,
        isLoading: false
      };
    case CtAcceptAdvanceActionTypes.INITIATE_ADVANCE_SUCCESS:
      return {
        ...state,
        initiateAdvanceResponse: action.payload,
        errors: null,
        isLoading: false
      };
    case CtAcceptAdvanceActionTypes.INITIATE_ADVANCE_FAILURE:
      return {
        ...state,
        initiateAdvanceResponse: null,
        errors: action.payload,
        isLoading: false
      };
    case CtAcceptAdvanceActionTypes.UPDATE_ADVANCE_SUCCESS:
      return {
        ...state,
        updateAdvanceResponse: action.payload,
        errors: null,
        isLoading: false
      };
    case CtAcceptAdvanceActionTypes.UPDATE_ADVANCE_FAILURE:
      return {
        ...state,
        updateAdvanceResponse: null,
        errors: action.payload,
        isLoading: false
      };
    case CtAcceptAdvanceActionTypes.PARTIALLY_UPDATE_ADVANCE_SUCCESS:
      return {
        ...state,
        partiallyAdvanceResponse: action.payload,
        errors: null,
        isLoading: false
      };
    case CtAcceptAdvanceActionTypes.PARTIALLY_UPDATE_ADVANCE_FAILURE:
      return {
        ...state,
        partiallyAdvanceResponse: null,
        errors: action.payload,
        isLoading: false
      };
    case CtAcceptAdvanceActionTypes.VIEW_ADVANCE_SUCCESS:
      return {
        ...state,
        viewAdvanceResponse: action.payload,
        errors: null,
        isLoading: false
      };
    case CtAcceptAdvanceActionTypes.VIEW_ADVANCE_FAILURE:
      return {
        ...state,
        viewAdvanceResponse: null,
        errors: action.payload,
        isLoading: false
      };
    case CtAcceptAdvanceActionTypes.LOAD_ADVANCE_HISTORY_SUCCESS:
      return {
        ...state,
        advanceHistoryItems: action.payload,
        errors: null,
        isLoading: false
      };
    case CtAcceptAdvanceActionTypes.LOAD_ADVANCE_HISTORY_FAILURE:
      return {
        ...state,
        advanceHistoryItems: null,
        errors: action.payload,
        isLoading: false
      };
    case CtAcceptAdvanceActionTypes.SET_SELECTED_RSO_NAME:
      return {
        ...state,
        selectedRsoName: action.payload,
        errors: null,
        isLoading: false
      };
    case CtAcceptAdvanceActionTypes.SET_TOTAL_AMOUNT:
      return {
        ...state,
        totalAmt: action.payload,
        errors: null,
        isLoading: false
      };
    case CtAcceptAdvanceActionTypes.RESET_ACCEPT_ADVANCE:
      return {
        ...state,
        errors: null,
        isLoading: false,
        selectedRsoName: null,
        totalAmt: 0,
        initiateAdvanceResponse: null,
        updateAdvanceResponse: null,
        partiallyAdvanceResponse: null,
        rsoDetails: [],
        remarks: '',
        viewAdvanceResponse: null,
        orderNumber: { order: 0, status: null },
        deleteAdvanceTransactionResponse: null
      };
    case CtAcceptAdvanceActionTypes.SET_REMARKS:
      return {
        ...state,
        remarks: action.payload
      };
    case CtAcceptAdvanceActionTypes.SET_HISTORY_SEARCH_PARAM_DETAILS:
      return {
        ...state,
        historySearchParamDetails: action.payload
      };
    case CtAcceptAdvanceActionTypes.SET_ORDER_NUMBER:
      return {
        ...state,
        orderNumber: { order: action.payload, status: action.status }
      };
    case CtAcceptAdvanceActionTypes.DELETE_ADVANCE_TRANSACTION_DETAILS_SUCCESS:
      return {
        ...state,
        deleteAdvanceTransactionResponse: action.payload,
        errors: null,
        isLoading: false
      };
    case CtAcceptAdvanceActionTypes.DELETE_ADVANCE_TRANSACTION_DETAILS_FAILURE:
      return {
        ...state,
        deleteAdvanceTransactionResponse: null,
        errors: action.payload,
        isLoading: false
      };
    default:
      return state;
  }
}
