import { createFeatureSelector } from '@ngrx/store';
import { IbtConfigurationState } from './ibt-configuration.state';
import {
  IbtConfigurationActions,
  IbtConfigurationActionTypes
} from './ibt-configuration.actions';

export const ibtConfigurationKey = 'ibtConfiguration';
export const selectIbtConfigurationState = createFeatureSelector<
  IbtConfigurationState
>(ibtConfigurationKey);
export const initialState: IbtConfigurationState = {
  ibtConfigList: null,
  isLoading: null,
  error: null,
  ibtConfiguration: null,
  hasSaved: null,
  hasUpdated: null,
  totalElements: null
};

export function ibtConfigurationReducer(
  state: IbtConfigurationState,
  action: IbtConfigurationActions
) {
  switch (action.type) {
    case IbtConfigurationActionTypes.SEARCH_CONFIG_BY_CONFIG_NAME:

    case IbtConfigurationActionTypes.LOAD_IBT_CONFIGURATION_LIST:

    case IbtConfigurationActionTypes.SAVE_IBT_CONFIGURATION:
    case IbtConfigurationActionTypes.LOAD_IBT_CONFIGURATION_BY_CONFIG_ID:
      return {
        ...state,
        isLoading: true
      };
    case IbtConfigurationActionTypes.SEARCH_CONFIG_BY_CONFIG_NAME_SUCCESS:
    case IbtConfigurationActionTypes.LOAD_IBT_CONFIGURATION_LIST_SUCCESS:
      return {
        ...state,
        ibtConfigList: action.payload.ibtConfigList,
        totalElements: action.payload.totalElements,
        isLoading: false
      };
    case IbtConfigurationActionTypes.SEARCH_CONFIG_BY_CONFIG_NAME_FAILURE:
    case IbtConfigurationActionTypes.SAVE_IBT_CONFIGURATION_FAILURE:

    case IbtConfigurationActionTypes.LOAD_IBT_CONFIGURATION_BY_CONFIG_ID_FAILURE:
    case IbtConfigurationActionTypes.LOAD_IBT_CONFIGURATION_LIST_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: null
      };

    case IbtConfigurationActionTypes.LOAD_IBT_CONFIGURATION_BY_CONFIG_ID_SUCCESS:
      return {
        ...state,
        ibtConfiguration: action.payload,
        isLoading: false
      };

    case IbtConfigurationActionTypes.SAVE_IBT_CONFIGURATION_SUCCESS:
      return {
        ...state,
        hasSaved: true,
        ibtConfiguration: action.payload,
        isLoading: false
      };
    case IbtConfigurationActionTypes.UPDATE_IBT_CONFIGURATION:
      return {
        ...state,
        isLoading: true,
        hasUpdated: false
      };

    case IbtConfigurationActionTypes.UPDATE_IBT_CONFIGURATION_SUCCESS:
      return {
        ...state,
        hasUpdated: true,
        isLoading: false,
        ibtConfiguration: action.payload
      };
    case IbtConfigurationActionTypes.UPDATE_IBT_CONFIGURATION_FAILURE:
      return {
        ...state,
        hasUpdated: false,
        isLoading: null,
        error: action.payload
      };
    case IbtConfigurationActionTypes.CLEAR_SEARCH:
      return {
        ...state,

        ibtConfigList: null
      };
    case IbtConfigurationActionTypes.LOAD_RESET:
      return {
        ...state,
        isLoading: null,
        hasUpdated: null,
        hasSaved: null,
        ibtConfigList: null,
        ibtConfiguration: null,
        error: null
      };
    default:
      return {
        ...state
      };
  }
}
