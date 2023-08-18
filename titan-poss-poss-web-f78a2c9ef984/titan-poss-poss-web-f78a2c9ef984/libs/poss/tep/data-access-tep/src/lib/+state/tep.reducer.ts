import { TEPRequestState } from './tep.state';
import { TEPRequestActions, TEPRequestActionTypes } from './tep.actions';
import {
  TEPRefundStatusListAdapter,
  TEPRequestStatusListAdapter
} from './tep.entity';

export const TepRequestFeatureKey = 'tepRequest';

export const initialState: TEPRequestState = {
  hasError: null,
  requestStausDropDownValues: {
    status: 'APPROVED',
    type: 'TEP_APPROVAL_WORKFLOW'
  },
  refundStausDropDownValues: {
    status: 'APPROVAL_PENDING',
    type: 'NEW_TEP',
    refundType: 'CHEQUE'
  },
  isLoading: false,
  refundDetails: null,
  approvedRefundDetails: null,
  searchValues: { function: null, doNo: null, fiscalYear: null, phNo: null },
  searhTEPResponse: null,
  searhTEPResponseCount: 0,
  selectedData: null,
  TEPRequestStatusList: TEPRequestStatusListAdapter.getInitialState(),
  TEPRequestStatusListCount: 0,
  tepItemConfiguratonResponse: null,
  historySearchParamDetails: null,
  historyItems: null,

  TEPRefundRequestStatusList: TEPRefundStatusListAdapter.getInitialState(),
  TEPRefundRequestStatusListCount: 0
};

export function TEPRequestReducer(
  state: TEPRequestState = initialState,
  action: TEPRequestActions
): TEPRequestState {
  switch (action.type) {
    case TEPRequestActionTypes.LOAD_REQUESTS:
    case TEPRequestActionTypes.LOAD_REFUND_REQUESTS:
    case TEPRequestActionTypes.LOAD_REFUND_ORDER_DETAILS:
    case TEPRequestActionTypes.APPROVE_REFUND_ORDER_DETAILS:
    case TEPRequestActionTypes.GET_ITEM_CONFIGURATION:
    case TEPRequestActionTypes.SEARCH_TEP:
    case TEPRequestActionTypes.LOAD_TEP_HISTORY:
    case TEPRequestActionTypes.LOAD_WORKFLOW_DETAILS:
      return { ...state, isLoading: true, hasError: null };
    case TEPRequestActionTypes.LOAD_WORKFLOW_DETAILS_FAILURE:
    case TEPRequestActionTypes.LOAD_REQUESTS_FAILURE:
    case TEPRequestActionTypes.GET_ITEM_CONFIGURATION_FAILURE:
    case TEPRequestActionTypes.SEARCH_TEP_FAILURE:
    case TEPRequestActionTypes.LOAD_REFUND_ORDER_DETAILS_FAILURE:
    case TEPRequestActionTypes.LOAD_REFUND_REQUESTS_FAILURE:
    case TEPRequestActionTypes.APPROVE_REFUND_ORDER_DETAILS_FAILURE:
      return {
        ...state,
        hasError: action.payload,
        isLoading: false
      };

    case TEPRequestActionTypes.SET_DROPDOWN_VALUE:
      return {
        ...state,
        requestStausDropDownValues: action.payload
      };

    case TEPRequestActionTypes.GET_ITEM_CONFIGURATION_SUCCESS:
      return {
        ...state,
        tepItemConfiguratonResponse: action.payload,
        hasError: null,
        isLoading: false
      };

    case TEPRequestActionTypes.LOAD_WORKFLOW_DETAILS_SUCCESS:
      return {
        ...state,
        selectedData: action.payload,
        hasError: null,
        isLoading: false
      };

    case TEPRequestActionTypes.SET_REFUND_DROPDOWN_VALUE:
      return {
        ...state,
        refundStausDropDownValues: action.payload
      };
    case TEPRequestActionTypes.LOAD_TEP_HISTORY_SUCCESS:
      return {
        ...state,
        historyItems: action.payload,
        hasError: null,
        isLoading: false
      };
    case TEPRequestActionTypes.LOAD_TEP_HISTORY_FAILURE:
      return {
        ...state,
        historyItems: null,
        hasError: action.payload,
        isLoading: false
      };
    case TEPRequestActionTypes.SEARCH_TEP_SUCCESS:
      return {
        ...state,
        isLoading: false,
        searhTEPResponse: action.payload.TEPList,
        searhTEPResponseCount: action.payload.totalElements
      };

    case TEPRequestActionTypes.LOAD_REFUND_REQUESTS_SUCCESS:
      return {
        ...state,
        isLoading: false,

        TEPRefundRequestStatusList: TEPRefundStatusListAdapter.addMany(
          action.payload.refundList,
          state.TEPRefundRequestStatusList
        ),
        TEPRefundRequestStatusListCount: action.payload.totalElements,
        hasError: null
      };

    case TEPRequestActionTypes.LOAD_REFUND_ORDER_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        refundDetails: action.payload,

        hasError: null
      };
    case TEPRequestActionTypes.SET_SEARCH_VALUES:
      return {
        ...state,
        searchValues: action.payload
      };
    case TEPRequestActionTypes.RESET_SEARCH_VALUES: {
      return {
        ...state,
        hasError: null,

        isLoading: false,
        //change to do
        searhTEPResponse: null,
        searhTEPResponseCount: 0
      };
    }

    case TEPRequestActionTypes.APPROVE_REFUND_ORDER_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        approvedRefundDetails: action.payload,

        hasError: null
      };

    case TEPRequestActionTypes.LOAD_REQUESTS_SUCCESS:
      return {
        ...state,
        isLoading: false,

        TEPRequestStatusList: TEPRequestStatusListAdapter.addMany(
          action.payload.results,
          state.TEPRequestStatusList
        ),
        TEPRequestStatusListCount: action.payload.totalElements,
        hasError: null
      };

    case TEPRequestActionTypes.SET_HISTORY_SEARCH_PARAM_DETAILS:
      return {
        ...state,
        historySearchParamDetails: action.payload
      };

    case TEPRequestActionTypes.RESET_VALUES:
      return {
        ...state,

        approvedRefundDetails: null,
        refundDetails: null,
        tepItemConfiguratonResponse: null
      };

    case TEPRequestActionTypes.CLEAR_SEARCH_LIST:
      return {
        ...state,
        TEPRequestStatusList: TEPRequestStatusListAdapter.removeAll(
          state.TEPRequestStatusList
        ),
        TEPRequestStatusListCount: 0,
        hasError: null,
        searhTEPResponse: null,
        searhTEPResponseCount: 0,
        historyItems: null,

        TEPRefundRequestStatusList: TEPRefundStatusListAdapter.removeAll(
          state.TEPRefundRequestStatusList
        ),
        TEPRefundRequestStatusListCount: 0,
        tepItemConfiguratonResponse: null
      };
    default:
      return state;
  }
}
