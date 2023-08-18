import { createFeatureSelector } from '@ngrx/store';

import { TepApprovalState } from './tep-approval.state';
import {
  TepApprovalActionTypes,
  TepApprovalActions
} from './tep-approval.actions';
import { tepApprovalAdapter } from './tep-approval.entity';

export const tepApprovalKey = 'tepApproval';

export const tepApprovalState = createFeatureSelector<TepApprovalState>(
  tepApprovalKey
);

/**
 * Initial state of the store
 */
export const initialState: TepApprovalState = {
  approvalist: tepApprovalAdapter.getInitialState(),
  hasError: null,
  isLoading: false,
  totalCount: 0,
  editableWorkflowDetails: null,
  refundList: null,
  editedRefundListItemResponse: null,
  fullValueTepRequestsList: null,
  fvtApprovedDetails: null
};

/**
 * The reducer function which manipulates the store for respective Action
 */
export function TepApprovalReducer(
  state: TepApprovalState = initialState,
  action: TepApprovalActions
): TepApprovalState {
  switch (action.type) {
    case TepApprovalActionTypes.GET_TEP_APPROVAL_LIST:
    case TepApprovalActionTypes.LOAD_WORKFLOW_DETAILS:
    case TepApprovalActionTypes.SAVE_TEP_APPROVAL_STATUS:
    case TepApprovalActionTypes.LOAD_TEP_REFUND_LIST:
    case TepApprovalActionTypes.EDIT_TEP_REFUND_ITEM:
    case TepApprovalActionTypes.GET_FULL_VALUE_TEP_APPROVAL_LIST:
    case TepApprovalActionTypes.SEND_APPROVAL_FOR_REQUEST:
      return {
        ...state,
        isLoading: true,
        hasError: null
      };

    case TepApprovalActionTypes.LOAD_WORKFLOW_DETAILS_FAILURE:
    case TepApprovalActionTypes.GET_TEP_APPROVAL_LIST_FAILURE:
    case TepApprovalActionTypes.SAVE_TEP_APPROVAL_STATUS_FAILURE:
      return {
        ...state,
        hasError: action.payload,
        isLoading: false
      };
    case TepApprovalActionTypes.SAVE_TEP_APPROVAL_STATUS_SUCCESS:
      return {
        ...state,
        isLoading: false,

        approvalist: tepApprovalAdapter.removeMany(
          action.payload,
          state.approvalist
        ),
        hasError: null
      };
    case TepApprovalActionTypes.LOAD_TEP_REFUND_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        refundList: action.payload,
        hasError: null
      };
    case TepApprovalActionTypes.LOAD_TEP_REFUND_LIST_FAILURE:
      return {
        ...state,
        hasError: action.payload,
        isLoading: false,
        refundList: null
      };
    case TepApprovalActionTypes.EDIT_TEP_REFUND_ITEM_SUCCESS:
      return {
        ...state,
        isLoading: false,
        editedRefundListItemResponse: action.payload,
        hasError: null
      };
    case TepApprovalActionTypes.EDIT_TEP_REFUND_ITEM_FAILURE:
      return {
        ...state,
        hasError: action.payload,
        isLoading: false,
        editedRefundListItemResponse: null
      };

    case TepApprovalActionTypes.SAVE_TEP_APPROVAL_STATUS_SUCCESS:
      return {
        ...state,
        isLoading: false,

        approvalist: tepApprovalAdapter.removeMany(
          action.payload,
          state.approvalist
        ),
        hasError: null
      };
    case TepApprovalActionTypes.GET_TEP_APPROVAL_LIST_SUCCESS:
      return {
        ...state,
        approvalist: tepApprovalAdapter.setAll(
          action.payload.results,
          state.approvalist
        ),
        totalCount: action.payload.count,

        isLoading: false,
        hasError: null
      };

    case TepApprovalActionTypes.GET_FULL_VALUE_TEP_APPROVAL_LIST_SUCCESS:
      return {
        ...state,
        fullValueTepRequestsList: action.payload,
        isLoading: false,
        hasError: null
      };
    case TepApprovalActionTypes.SEND_APPROVAL_FOR_REQUEST_SUCCESS:
      return {
        ...state,
        fvtApprovedDetails: action.payload,
        isLoading: false,
        hasError: null
      };
    case TepApprovalActionTypes.GET_FULL_VALUE_TEP_APPROVAL_LIST_FAILURE:
      return {
        ...state,
        fullValueTepRequestsList: null,
        isLoading: false,
        hasError: action.payload
      };
    case TepApprovalActionTypes.SEND_APPROVAL_FOR_REQUEST_FAILURE:
      return {
        ...state,
        fvtApprovedDetails: null,
        isLoading: false,
        hasError: action.payload
      };

    case TepApprovalActionTypes.LOAD_WORKFLOW_DETAILS_SUCCESS:
      return {
        ...state,
        editableWorkflowDetails: action.payload,

        isLoading: false,
        hasError: null
      };

    case TepApprovalActionTypes.UPDATE_RESPONSE:
      return {
        ...state,
        approvalist: tepApprovalAdapter.updateOne(
          {
            id: action.payload.processId,
            changes: {
              approvedData: action.payload.approvedData
            }
          },
          state.approvalist
        )
      };
    case TepApprovalActionTypes.RESET_RESPONSE:
      return {
        ...state,
        editableWorkflowDetails: null,
        approvalist: tepApprovalAdapter.getInitialState(),
        hasError: null,
        isLoading: false,
        totalCount: 0,
        refundList: null,
        editedRefundListItemResponse: null,
        fullValueTepRequestsList: null,
        fvtApprovedDetails: null
      };

    default:
      return {
        ...state
      };
  }
}
