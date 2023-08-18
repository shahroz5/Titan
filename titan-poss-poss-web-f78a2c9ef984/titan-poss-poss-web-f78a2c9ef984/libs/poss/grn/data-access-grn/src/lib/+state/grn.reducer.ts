import { createFeatureSelector } from '@ngrx/store';

import { GrnActionTypes, GrnActions } from './grn.actions';
import { GrnSate } from './grn.state';
import { grnReqItemAdaptor } from './grn.entity';

export const grnKey = 'grn';
export const selectGrnState = createFeatureSelector<GrnSate>(grnKey);
export const initialState: GrnSate = {
  error: null,
  hasSaved: null,
  hasUpdated: null,
  isLoading: null,
  totalElements: null,
  grnReqStatus: grnReqItemAdaptor.getInitialState(),
  customerId: null,
  grnDetails: null,
  totalReturnGrn: 0,
  totalReturnProduct: 0,
  status: null,
  grnConfirmResponse: null,
  grnInitiateResponse: null,
  itemDetails: null,
  reqId: null,
  locationCodes: null,
  approvers: [],
  sendForApprovalResponse: null,
  sendForApprovalSuccess: null,
  totalGrnHistoryReq: null,
  grnHistory: [],
  grnReasons: null,
  finalPriceDetails: null,
  tcsAmountCollected: null,
  focDeductionAmount: null,
  historySearchParamDetails: null
};

export function grnReducer(state: GrnSate = initialState, action: GrnActions) {
  switch (action.type) {
    case GrnActionTypes.FILTER_GRN_REQ_STATUS_LIST:
    case GrnActionTypes.LOAD_GRN_HISTORY_DETAILS:
    case GrnActionTypes.CONFIRM_GRN:
    case GrnActionTypes.LOAD_GRN_DETAILS_BY_ID:
    case GrnActionTypes.SEARCH_GRN:
    case GrnActionTypes.LOAD_GRN_REQ_STATUS_LIST:
    case GrnActionTypes.INITIATE_GRN:
    case GrnActionTypes.LOAD_ITEM:
    case GrnActionTypes.CONFIRM_GRN_WITHOUT_APPROVAL:
    case GrnActionTypes.SEND_FOR_APPROVAL:
    case GrnActionTypes.LOAD_GRN_FINAL_PRICE_DETAILS:
    case GrnActionTypes.LOAD_COLLECTED_TCS_AMOUNT:
      return {
        ...state,
        isLoading: true
      };
    case GrnActionTypes.SET_FOC_DEDUCTION_VALUE:
      return {
        ...state,
        focDeductionAmount: action.payload
      };
    case GrnActionTypes.CONFIRM_GRN_WITHOUT_APPROVAL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        grnConfirmResponse: action.payload
      };

    case GrnActionTypes.LOAD_COLLECTED_TCS_AMOUNT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        tcsAmountCollected: action.payload
      };

    case GrnActionTypes.SEND_FOR_APPROVAL_SUCCESS:
      return {
        ...state,
        sendForApprovalResponse: action.payload,
        isLoading: false
      };

    case GrnActionTypes.LOAD_GRN_HISTORY_DETAILS_SUCCESS:
      return {
        ...state,
        grnHistory: action.payload?.grnHistoryDetails 
                    ? action.payload?.grnHistoryDetails 
                    : null,
        totalGrnHistoryReq: action.payload?.totalElements
                    ? action.payload?.totalElements 
                    : 0,
        isLoading: false
      };

    case GrnActionTypes.FILTER_GRN_REQ_STATUS_LIST_SUCCESS:
      return {
        ...state,
        ...state,
        isLoading: false,
        grnReqStatus: grnReqItemAdaptor.setAll(
          action.payload.grnReqStatus,
          state.grnReqStatus
        ),
        totalElements: action.payload.totalElement
      };
    case GrnActionTypes.LOAD_GRN_REASONS:
      return { ...state, error: null };
    case GrnActionTypes.LOAD_GRN_REASONS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        grnReasons: action.payload
      };
    case GrnActionTypes.LOAD_GRN_FINAL_PRICE_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        finalPriceDetails: action.payload,
        focDeductionAmount: action.payload.focDeductionValue
      };
    case GrnActionTypes.FILTER_GRN_REQ_STATUS_LIST_FAILURE:
    case GrnActionTypes.LOAD_GRN_HISTORY_DETAILS_FAILURE:
    case GrnActionTypes.SEND_FOR_APPROVAL_FAILURE:
    case GrnActionTypes.CONFIRM_GRN_WITHOUT_APPROVAL_FAILURE:
    case GrnActionTypes.CONFIRM_GRN_FAILURE:
    case GrnActionTypes.LOAD_GRN_DETAILS_BY_ID_FAILURE:
    case GrnActionTypes.SEARCH_GRN_FAILURE:
    case GrnActionTypes.LOAD_GRN_REQ_STATUS_LIST_FAILURE:
    case GrnActionTypes.INITIATE_GRN_FAILURE:
    case GrnActionTypes.LOAD_ITEM_FAILURE:
    case GrnActionTypes.GET_LOCATIONS_FAILURE:
    case GrnActionTypes.LOAD_APPROVERS_FAILURE:
    case GrnActionTypes.LOAD_GRN_REASONS_FAILURE:
    case GrnActionTypes.LOAD_GRN_FINAL_PRICE_DETAILS_FAILURE:
    case GrnActionTypes.LOAD_COLLECTED_TCS_AMOUNT_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case GrnActionTypes.SEARCH_GRN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        grnReqStatus: grnReqItemAdaptor.addAll(
          action.payload.grnReqStatus,
          state.grnReqStatus
        ),
        totalElements: action.payload.totalElement
      };
      
    case GrnActionTypes.SET_HISTORY_SEARCH_PARAM_DETAILS:
      return {
        ...state,
        historySearchParamDetails: action.payload
      };

    case GrnActionTypes.LOAD_GRN_REQ_STATUS_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        grnReqStatus: grnReqItemAdaptor.addMany(
          action.payload.grnReqStatus,
          state.grnReqStatus
        ),
        totalElements: action.payload.totalElement
      };

    case GrnActionTypes.LOAD_GRN_DETAILS_BY_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        grnDetails: action.payload,
        totalReturnGrn: action.payload.totalReturnGrn,
        totalReturnProduct: action.payload.totalReturnProduct,
        status: action.payload.status,
        customerId: action.payload.customerId
      };

    case GrnActionTypes.CONFIRM_GRN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        grnConfirmResponse: action.payload
      };
    case GrnActionTypes.INITIATE_GRN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        grnInitiateResponse: action.payload
      };
    case GrnActionTypes.LOAD_ITEM_SUCCESS:
      return {
        ...state,
        isLoading: false,
        itemDetails: action.payload
      };
    case GrnActionTypes.GET_LOCATIONS_SUCCESS:
      return {
        ...state,
        locationCodes: action.payload,
        isLoading: false,
        error: null
      };
    case GrnActionTypes.LOAD_APPROVERS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        approvers: action.payload
      };
    case GrnActionTypes.LOAD_GRN_SUMMARY_BAR_DETAILS:
      return {
        ...state,
        isLoading: false,
        totalReturnGrn: action.value,
        totalReturnProduct: action.count
      };
    case GrnActionTypes.LOAD_RESET:
      return {
        ...state,
        error: null,
        hasSaved: null,
        hasUpdated: null,
        isLoading: null,
        totalElements: null,
        grnReqStatus: grnReqItemAdaptor.getInitialState(),
        customerId: null,
        grnDetails: null,
        totalReturnGrn: 0,
        totalReturnProduct: 0,
        status: null,
        grnConfirmResponse: null,
        grnInitiateResponse: null,
        itemDetails: null,
        sendForApprovalResponse: null,
        grnHistory: [],
        approvers: [],
        totalGrnHistoryReq: null,
        finalPriceDetails: null,
        tcsAmountCollected: null
      };

    default:
      return {
        ...state
      };
  }
}
