import { createFeatureSelector } from '@ngrx/store';
import { InvGlobalConfigurationState } from './inventory-global-config.state';

import {
  InvGlobalConfigurationActions,
  InvGlobalConfigurationActionTypes
} from './inventory-global-config.actions';

export const invglobalConfigurationFeatureKey = 'invglobalConfiguration';
export const selectInvGlobalConfigurationState = createFeatureSelector<
  InvGlobalConfigurationState
>(invglobalConfigurationFeatureKey);

export const initialState: InvGlobalConfigurationState = {
  invglobalConfigurationFiledValue: null,
  isLoading: null,
  error: null,
  hasUpdated: null,
  invglobalConfigurationList: null
};
export function invglobalConfigurationReducer(
  state: InvGlobalConfigurationState = initialState,
  action: InvGlobalConfigurationActions
) {
  switch (action.type) {
    case InvGlobalConfigurationActionTypes.LOAD_INV_GLOBAL_CONFIGURATION_LIST:
    case InvGlobalConfigurationActionTypes.LOAD_INV_GLOBAL_CONFIGURATION_FILED_VALUE:
    case InvGlobalConfigurationActionTypes.UPDATE_INV_GLOBAL_CONFIGURATION_FIELD_VALUE:
    case InvGlobalConfigurationActionTypes.SAVE_INV_GLOBAL_CONFIGURATION:
      return {
        ...state,
        isLoading: true
      };

    case InvGlobalConfigurationActionTypes.LOAD_INV_GLOBAL_CONFIGURATION_LIST_SUCCESS:
      return {
        ...state,
        invglobalConfigurationList: action.payload,
        isLoading: true
      };

    case InvGlobalConfigurationActionTypes.SAVE_INV_GLOBAL_CONFIGURATION_SUCCESS:
      return {
        ...state,
        invglobalConfigurationList: action.payload,
        isLoading: false
      };

    case InvGlobalConfigurationActionTypes.LOAD_INV_GLOBAL_CONFIGURATION_LIST_FAILURE:
    case InvGlobalConfigurationActionTypes.SAVE_INV_GLOBAL_CONFIGURATION_FAILURE:
    case InvGlobalConfigurationActionTypes.UPDATE_INV_GLOBAL_CONFIGURATION_FIELD_VALUE_FAILURE:
    case InvGlobalConfigurationActionTypes.LOAD_INV_GLOBAL_CONFIGURATION_FILED_VALUE_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: null
      };
    case InvGlobalConfigurationActionTypes.LOAD_INV_GLOBAL_CONFIGURATION_FILED_VALUE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        invglobalConfigurationFiledValue: action.payload
      };
    case InvGlobalConfigurationActionTypes.UPDATE_INV_GLOBAL_CONFIGURATION_FIELD_VALUE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasUpdated: true,
        invglobalConfigurationFiledValue: action.payload
      };

    case InvGlobalConfigurationActionTypes.LOAD_RESET:
      return {
        ...state,
        error: null,
        invglobalConfigurationFiledValue: null,
        invglobalConfigurationList: null,
        hasUpdated: null,
        isLoading: null
      };
    default:
      return { ...state };
  }
}
