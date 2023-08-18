import { createFeatureSelector } from '@ngrx/store';
import { GrnApprovalConfigState } from './grn-approval-config.state';
import {
  GrnApprovalConfigActions,
  GrnApprovalConfigActionTypes
} from './grn-approval-config.actions';

export const grnApprovalConfigKey = 'grnApprovalConfig';
export const selectGrnApprovalConfigState = createFeatureSelector<
  GrnApprovalConfigState
>(grnApprovalConfigKey);
export const initialState: GrnApprovalConfigState = {
  grnApprovalConfigList: null,
  isLoading: null,
  error: null,
  grnApprovalConfig: null,
  hasSaved: null,
  hasUpdated: null,
  totalElements: null,
  roleList: null
};

export function grnApprovalConfigReducer(
  state: GrnApprovalConfigState,
  action: GrnApprovalConfigActions
) {
  switch (action.type) {
    case GrnApprovalConfigActionTypes.SEARCH_GRN_APPROVAL_CONFIG_BY_GRN_TYPE:

    case GrnApprovalConfigActionTypes.LOAD_GRN_APPROVAL_CONFIG_LIST:

    case GrnApprovalConfigActionTypes.SAVE_GRN_APPROVAL_CONFIG:
    case GrnApprovalConfigActionTypes.LOAD_GRN_APPROVAL_CONFIG_BY_RULE_ID:
    case GrnApprovalConfigActionTypes.LOAD_ROLE_LIST:
      return {
        ...state,
        isLoading: true
      };
    case GrnApprovalConfigActionTypes.SEARCH_GRN_APPROVAL_CONFIG_BY_GRN_TYPE_SUCCESS:
    case GrnApprovalConfigActionTypes.LOAD_GRN_APPROVAL_CONFIG_LIST_SUCCESS:
      return {
        ...state,
        grnApprovalConfigList: action.payload.grnApprovalConfigList,
        totalElements: action.payload.totalElements,
        isLoading: false
      };

    case GrnApprovalConfigActionTypes.LOAD_ROLE_LIST_SUCCESS:
      return {
        ...state,
        roleList: action.payload
      };

    case GrnApprovalConfigActionTypes.SEARCH_GRN_APPROVAL_CONFIG_BY_GRN_TYPE_FAILURE:
    case GrnApprovalConfigActionTypes.SAVE_GRN_APPROVAL_CONFIG_FAILURE:

    case GrnApprovalConfigActionTypes.LOAD_GRN_APPROVAL_CONFIG_BY_RULE_ID_FAILURE:
    case GrnApprovalConfigActionTypes.LOAD_GRN_APPROVAL_CONFIG_LIST_FAILURE:
    case GrnApprovalConfigActionTypes.LOAD_ROLE_LIST_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: null
      };

    case GrnApprovalConfigActionTypes.LOAD_GRN_APPROVAL_CONFIG_BY_RULE_ID_SUCCESS:
      return {
        ...state,
        grnApprovalConfig: action.payload,
        isLoading: false
      };

    case GrnApprovalConfigActionTypes.SAVE_GRN_APPROVAL_CONFIG_SUCCESS:
      return {
        ...state,
        hasSaved: true,
        grnApprovalConfig: action.payload,
        isLoading: false
      };
    case GrnApprovalConfigActionTypes.UPDATE_GRN_APPROVAL_CONFIG:
      return {
        ...state,
        isLoading: true,
        hasUpdated: false
      };

    case GrnApprovalConfigActionTypes.UPDATE_GRN_APPROVAL_CONFIG_SUCCESS:
      return {
        ...state,
        hasUpdated: true,
        isLoading: false,
        grnApprovalConfig: action.payload
      };
    case GrnApprovalConfigActionTypes.UPDATE_GRN_APPROVAL_CONFIG_FAILURE:
      return {
        ...state,
        hasUpdated: false,
        isLoading: null,
        error: action.payload
      };

    case GrnApprovalConfigActionTypes.LOAD_RESET:
      return {
        ...state,
        isLoading: null,
        hasUpdated: null,
        hasSaved: null,
        grnApprovalConfig: null,
        error: null,
        roleList: null
      };
    default:
      return {
        ...state
      };
  }
}
