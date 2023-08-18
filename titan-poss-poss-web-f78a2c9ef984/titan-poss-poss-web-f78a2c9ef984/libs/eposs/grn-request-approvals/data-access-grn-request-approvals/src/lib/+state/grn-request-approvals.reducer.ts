import { createFeatureSelector } from '@ngrx/store';

import {
  GrnRequestApprovalActionTypes,
  GrnRequestApprovalActions
} from './grn-request-approvals.action';

import { GrnRequestApprovalState } from './grn-request-approvals.state';
import { grnRequestListAdaptor } from './grn-request-approvals.entity';

export const initialState: GrnRequestApprovalState = {
  grnRequestList: grnRequestListAdaptor.getInitialState(),
  error: null,
  hasSaved: null,
  totalElements: null,
  isLoading: null,
  hasUpdated: null
};

export const GRN_REQUEST_APPROVAL_FEATURE_KEY = 'grnRequestApproval';
export const selectGrnRequestApprovalState = createFeatureSelector<
  GrnRequestApprovalState
>(GRN_REQUEST_APPROVAL_FEATURE_KEY);

export function grnRequestApprovalsReducer(
  state = initialState,
  action: GrnRequestApprovalActions
): GrnRequestApprovalState {
  switch (action.type) {
    case GrnRequestApprovalActionTypes.SAVE_GRN_REQUEST_APPROVAL_STATUS:
      return {
        ...state,
        isLoading: true
      };
    case GrnRequestApprovalActionTypes.LOAD_GRN_REQUEST_LIST:
      return {
        ...state,
        isLoading: true,
        grnRequestList: grnRequestListAdaptor.setAll([], state.grnRequestList)
      };
    case GrnRequestApprovalActionTypes.LOAD_GRN_REQUEST_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        grnRequestList: grnRequestListAdaptor.setAll(
          action.payload,
          state.grnRequestList
        )
      };

    case GrnRequestApprovalActionTypes.LOAD_GRN_REQUEST_LIST_FAILURE:
    case GrnRequestApprovalActionTypes.SAVE_GRN_REQUEST_APPROVAL_STATUS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case GrnRequestApprovalActionTypes.SAVE_GRN_REQUEST_APPROVAL_STATUS_SUCCESS:
      console.log(action.payload);
      return {
        ...state,
        isLoading: false,
        hasUpdated: true,
        grnRequestList: grnRequestListAdaptor.removeMany(
          action.payload,
          state.grnRequestList
        ),
        error: null
      };

    case GrnRequestApprovalActionTypes.LOAD_RESET:
      return {
        ...state,
        grnRequestList: grnRequestListAdaptor.getInitialState(),
        error: null,
        hasSaved: null,
        totalElements: null,
        isLoading: null,
        hasUpdated: null
      };

    default:
      return state;
  }
}
