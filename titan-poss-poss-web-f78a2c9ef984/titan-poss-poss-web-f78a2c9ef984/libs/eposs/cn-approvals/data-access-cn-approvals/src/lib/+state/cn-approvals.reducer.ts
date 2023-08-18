import { createFeatureSelector } from '@ngrx/store';

import {
  CnApprovalActionTypes,
  CnApprovalActions
} from './cn-approvals.action';

import { CnApprovalState } from './cn-approvals.state';
import { cnRequestListAdaptor } from './cn-approvals.entity';

export const initialState: CnApprovalState = {
  cnApprovalsList: cnRequestListAdaptor.getInitialState(),
  error: null,
  isLoading: null,
  hasUpdated: null
};

export const CN_APPROVAL_FEATURE_KEY = 'cnApproval';
export const selectCnApprovalState = createFeatureSelector<CnApprovalState>(
  CN_APPROVAL_FEATURE_KEY
);

export function cnApprovalsReducer(
  state = initialState,
  action: CnApprovalActions
): CnApprovalState {
  switch (action.type) {
    case CnApprovalActionTypes.LOAD_CN_APPROVALS_LIST:
      return {
        ...state,
        isLoading: true
      };

    case CnApprovalActionTypes.SAVE_CN_APPROVAL_STATUS:
      return {
        ...state,
        isLoading: true,
        hasUpdated: null
      };

    case CnApprovalActionTypes.LOAD_CN_APPROVALS_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        cnApprovalsList: cnRequestListAdaptor.setAll(
          action.payload,
          state.cnApprovalsList
        )
      };
    case CnApprovalActionTypes.LOAD_CN_APPROVALS_LIST_FAILURE:
    case CnApprovalActionTypes.SAVE_CN_APPROVAL_STATUS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case CnApprovalActionTypes.SAVE_CN_APPROVAL_STATUS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasUpdated: true,
        cnApprovalsList: cnRequestListAdaptor.removeMany(
          action.payload,
          state.cnApprovalsList
        ),
        error: null
      };

    case CnApprovalActionTypes.LOAD_RESET:
      return {
        ...state,
        cnApprovalsList: cnRequestListAdaptor.setAll([], state.cnApprovalsList),
        error: null,
        isLoading: null,
        hasUpdated: null
      };

    default:
      return state;
  }
}
