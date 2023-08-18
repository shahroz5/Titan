import { createFeatureSelector } from '@ngrx/store';
import { FtepApprovalConfigState } from './ftep-approval-config.state';
import {
  FtepApprovalConfigActions,
  FtepApprovalConfigActionTypes
} from './ftep-approval-config.actions';

export const ftepApprovalConfigKey = 'ftepApprovalConfig';
export const selectFtepApprovalConfigState = createFeatureSelector<
  FtepApprovalConfigState
>(ftepApprovalConfigKey);
export const initialState: FtepApprovalConfigState = {
  ftepApprovalConfigList: null,
  isLoading: null,
  error: null,
  ftepApprovalConfig: null,
  hasSaved: null,
  hasUpdated: null,
  totalElements: null,
  roleList: null
};

export function ftepApprovalConfigReducer(
  state: FtepApprovalConfigState,
  action: FtepApprovalConfigActions
) {
  switch (action.type) {
    case FtepApprovalConfigActionTypes.SEARCH_FTEP_APPROVAL_CONFIG_BY_FTEP_TYPE:

    case FtepApprovalConfigActionTypes.LOAD_FTEP_APPROVAL_CONFIG_LIST:

    case FtepApprovalConfigActionTypes.SAVE_FTEP_APPROVAL_CONFIG:
    case FtepApprovalConfigActionTypes.LOAD_FTEP_APPROVAL_CONFIG_BY_RULE_ID:
    case FtepApprovalConfigActionTypes.LOAD_ROLE_LIST:
      return {
        ...state,
        isLoading: true
      };
    case FtepApprovalConfigActionTypes.SEARCH_FTEP_APPROVAL_CONFIG_BY_FTEP_TYPE_SUCCESS:
    case FtepApprovalConfigActionTypes.LOAD_FTEP_APPROVAL_CONFIG_LIST_SUCCESS:
      return {
        ...state,
        ftepApprovalConfigList: action.payload.ftepApprovalConfigList,
        totalElements: action.payload.totalElements,
        isLoading: false
      };

    case FtepApprovalConfigActionTypes.LOAD_ROLE_LIST_SUCCESS:
      return {
        ...state,
        roleList: action.payload
      };

    case FtepApprovalConfigActionTypes.SEARCH_FTEP_APPROVAL_CONFIG_BY_FTEP_TYPE_FAILURE:
    case FtepApprovalConfigActionTypes.SAVE_FTEP_APPROVAL_CONFIG_FAILURE:

    case FtepApprovalConfigActionTypes.LOAD_FTEP_APPROVAL_CONFIG_BY_RULE_ID_FAILURE:
    case FtepApprovalConfigActionTypes.LOAD_FTEP_APPROVAL_CONFIG_LIST_FAILURE:
    case FtepApprovalConfigActionTypes.LOAD_ROLE_LIST_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: null
      };

    case FtepApprovalConfigActionTypes.LOAD_FTEP_APPROVAL_CONFIG_BY_RULE_ID_SUCCESS:
      return {
        ...state,
        ftepApprovalConfig: action.payload,
        isLoading: false
      };

    case FtepApprovalConfigActionTypes.SAVE_FTEP_APPROVAL_CONFIG_SUCCESS:
      return {
        ...state,
        hasSaved: true,
        ftepApprovalConfig: action.payload,
        isLoading: false
      };
    case FtepApprovalConfigActionTypes.UPDATE_FTEP_APPROVAL_CONFIG:
      return {
        ...state,
        isLoading: true,
        hasUpdated: false
      };

    case FtepApprovalConfigActionTypes.UPDATE_FTEP_APPROVAL_CONFIG_SUCCESS:
      return {
        ...state,
        hasUpdated: true,
        isLoading: false,
        ftepApprovalConfig: action.payload
      };
    case FtepApprovalConfigActionTypes.UPDATE_FTEP_APPROVAL_CONFIG_FAILURE:
      return {
        ...state,
        hasUpdated: false,
        isLoading: null,
        error: action.payload
      };

    case FtepApprovalConfigActionTypes.LOAD_RESET:
      return {
        ...state,
        isLoading: null,
        hasUpdated: null,
        hasSaved: null,
        ftepApprovalConfig: null,
        error: null,
        roleList: null
      };
    default:
      return {
        ...state
      };
  }
}
