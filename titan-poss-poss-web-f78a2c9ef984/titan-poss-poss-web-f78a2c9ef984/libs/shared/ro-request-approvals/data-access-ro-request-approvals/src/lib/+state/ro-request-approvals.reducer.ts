import { createFeatureSelector } from '@ngrx/store';
import { RoRequestApprovalState } from './ro-request-approvals.state';
import {
  RoRequestApprovalAction,
  RoRequestApprovalActionTypes
} from './ro-request-approvals.actions';
import { requestListAdaptor } from './ro-request-approvals.entity';

export const roRequestApprovalFeatureKey = 'roRequestApproval';

export const selectRoRequestApprovalState = createFeatureSelector<
  RoRequestApprovalState
>(roRequestApprovalFeatureKey);

export const initialState: RoRequestApprovalState = {
  pendingRoRequestList: requestListAdaptor.getInitialState(),
  approvedRoRequestList: [],
  rejectedRoRequestList: [],
  closedRoRequestList: [],
  totalElements: null,
  error: null,
  isLoading: null,
  hasUpdated: null,
  boutiqueRequestList: []
};
export function roRequestApprovalReducer(
  state: RoRequestApprovalState = initialState,
  action: RoRequestApprovalAction
): RoRequestApprovalState {
  switch (action.type) {
    case RoRequestApprovalActionTypes.LOAD_RO_REQUEST_APPROVAL_LIST:

    case RoRequestApprovalActionTypes.LOAD_PENDING_RO_REQUEST_APPROVAL_LIST:
    case RoRequestApprovalActionTypes.LOAD_APPROVED_RO_REQUEST_LIST:
    case RoRequestApprovalActionTypes.LOAD_REJECTED_RO_REQUEST_APPROVAL_LIST:
    case RoRequestApprovalActionTypes.LOAD_CLOSED_RO_REQUEST_APPROVAL_LIST:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case RoRequestApprovalActionTypes.LOAD_RO_REQUEST_APPROVAL_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        boutiqueRequestList: action.payload.requestList,
        totalElements: action.payload.totalElements
      };
    case RoRequestApprovalActionTypes.SAVE_RO_REQUEST_APPROVAL_STATUS:
      return {
        ...state,
        hasUpdated: false,
        isLoading: true
      };
    case RoRequestApprovalActionTypes.LOAD_APPROVED_RO_REQUEST_LIST_SUCCESS:
      return {
        ...state,
        approvedRoRequestList: action.payload,
        rejectedRoRequestList: [],
        closedRoRequestList: [],
        isLoading: false
      };

    case RoRequestApprovalActionTypes.LOAD_REJECTED_RO_REQUEST_APPROVAL_LIST_SUCCESS:
      return {
        ...state,
        rejectedRoRequestList: action.payload,
        approvedRoRequestList: [],
        closedRoRequestList: [],
        isLoading: false
      };

    case RoRequestApprovalActionTypes.LOAD_CLOSED_RO_REQUEST_APPROVAL_LIST_SUCCESS:
      return {
        ...state,
        closedRoRequestList: action.payload,
        rejectedRoRequestList: [],
        approvedRoRequestList: [],
        isLoading: false
      };

    case RoRequestApprovalActionTypes.LOAD_PENDING_RO_REQUEST_APPROVAL_LIST_SUCCESS:
      return {
        ...state,
        pendingRoRequestList: requestListAdaptor.setAll(
          action.payload,
          state.pendingRoRequestList
        ),
        isLoading: false
      };

    case RoRequestApprovalActionTypes.SAVE_RO_REQUEST_APPROVAL_STATUS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasUpdated: true,
        pendingRoRequestList: requestListAdaptor.removeMany(
          action.payload,
          state.pendingRoRequestList
        )
      };
    case RoRequestApprovalActionTypes.SAVE_RO_REQUEST_APPROVAL_STATUS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        hasUpdated: null
      };
    case RoRequestApprovalActionTypes.LOAD_RESET:
      return {
        ...state,
        pendingRoRequestList: requestListAdaptor.getInitialState(),
        approvedRoRequestList: [],
        rejectedRoRequestList: [],
        closedRoRequestList: [],
        totalElements: null,
        error: null,
        isLoading: null,
        hasUpdated: null
      };
    case RoRequestApprovalActionTypes.LOAD_RO_REQUEST_APPROVAL_LIST_FAILURE:
    case RoRequestApprovalActionTypes.LOAD_APPROVED_RO_REQUEST_LIST_FAILURE:
    case RoRequestApprovalActionTypes.LOAD_REJECTED_RO_REQUEST_APPROVAL_LIST_FAILURE:
    case RoRequestApprovalActionTypes.LOAD_CLOSED_RO_REQUEST_APPROVAL_LIST_FAILURE:
    case RoRequestApprovalActionTypes.LOAD_PENDING_RO_REQUEST_APPROVAL_LIST_FAILURE:
      return {
        ...state,
        isLoading: null,
        error: action.payload
      };
    default:
      return { ...state };
  }
}
