import { createFeatureSelector } from '@ngrx/store';
import { CnPriorityConfigState } from './cn-priority-config.state';
import {
  CnPriorityConfigActions,
  CnPriorityConfigActionTypes
} from './cn-priority-config.actions';

export const CnPriorityConfigKey = 'cnPriorityConfig';
export const selectCnPriorityConfigState = createFeatureSelector<
  CnPriorityConfigState
>(CnPriorityConfigKey);
export const initialState: CnPriorityConfigState = {
  cnPriorityConfigList: [],
  isLoading: null,
  error: null,
  cnPriorityConfig: null,
  hasSaved: null,
  hasUpdated: null,
  totalElements: null,
  cnTypeList: null
};

export function cnPriorityConfigReducer(
  state: CnPriorityConfigState,
  action: CnPriorityConfigActions
) {
  switch (action.type) {
    case CnPriorityConfigActionTypes.SEARCH_CONFIG_BY_CONFIG_NAME:

    case CnPriorityConfigActionTypes.LOAD_CN_PRIORITY_CONFIG_LIST:

    case CnPriorityConfigActionTypes.SAVE_CN_PRIORITY_CONFIG:
    case CnPriorityConfigActionTypes.LOAD_CN_PRIORITY_CONFIG_BY_CONFIG_ID:
    case CnPriorityConfigActionTypes.LOAD_CN_TYPE_LIST:
      return {
        ...state,
        isLoading: true
      };
    case CnPriorityConfigActionTypes.SEARCH_CONFIG_BY_CONFIG_NAME_SUCCESS:
    case CnPriorityConfigActionTypes.LOAD_CN_PRIORITY_CONFIG_LIST_SUCCESS:
      return {
        ...state,
        cnPriorityConfigList: action.payload.cnPriorityConfigList,
        totalElements: action.payload.totalElements,
        isLoading: false
      };
    case CnPriorityConfigActionTypes.SEARCH_CONFIG_BY_CONFIG_NAME_FAILURE:
    case CnPriorityConfigActionTypes.SAVE_CN_PRIORITY_CONFIG_FAILURE:

    case CnPriorityConfigActionTypes.LOAD_CN_PRIORITY_CONFIG_BY_CONFIG_ID_FAILURE:
    case CnPriorityConfigActionTypes.LOAD_CN_PRIORITY_CONFIG_LIST_FAILURE:
    case CnPriorityConfigActionTypes.LOAD_CN_TYPE_LIST_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: null
      };

    case CnPriorityConfigActionTypes.LOAD_CN_TYPE_LIST_SUCCESS:
      return {
        ...state,
        cnTypeList: action.payload
      };

    case CnPriorityConfigActionTypes.LOAD_CN_PRIORITY_CONFIG_BY_CONFIG_ID_SUCCESS:
      return {
        ...state,
        cnPriorityConfig: action.payload,
        isLoading: false
      };

    case CnPriorityConfigActionTypes.SAVE_CN_PRIORITY_CONFIG_SUCCESS:
      return {
        ...state,
        hasSaved: true,
        cnPriorityConfig: action.payload,
        isLoading: false
      };
    case CnPriorityConfigActionTypes.UPDATE_CN_PRIORITY_CONFIG:
      return {
        ...state,
        isLoading: true,
        hasUpdated: false
      };

    case CnPriorityConfigActionTypes.UPDATE_CN_PRIORITY_CONFIG_SUCCESS:
      return {
        ...state,
        hasUpdated: true,
        isLoading: false,
        cnPriorityConfig: action.payload
      };
    case CnPriorityConfigActionTypes.UPDATE_CN_PRIORITY_CONFIG_FAILURE:
      return {
        ...state,
        hasUpdated: false,
        isLoading: null,
        error: action.payload
      };

    case CnPriorityConfigActionTypes.LOAD_RESET:
      return {
        ...state,
        isLoading: null,
        hasUpdated: null,
        hasSaved: null,
        cnPriorityConfigList: [],
        cnPriorityConfig: null,
        error: null
      };
    default:
      return {
        ...state
      };
  }
}
