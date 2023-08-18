import { createFeatureSelector } from '@ngrx/store';
import {
  AmendmentConfigurationActions,
  AmendmentConfigurationActionTypes
} from './amendment-config.actions';
import { AmendmentConfigState } from './amendment-config.state';

export const amendmentConfigFeatureKey = 'mendmentConfigConfiguration';
export const selectAmendmentConfigState = createFeatureSelector<
  AmendmentConfigState
>(amendmentConfigFeatureKey);

export const initialState: AmendmentConfigState = {
  amendmentConfigValue: null,
  isLoading: null,
  hasUpdated: null,
  error: null
};
export function AmendmentConfigReducer(
  state: AmendmentConfigState = initialState,
  action: AmendmentConfigurationActions
  ) {
  switch (action.type) {
    case AmendmentConfigurationActionTypes.LOAD_AMENDMENT_CONFIGURATION_FILED_VALUE:

    case AmendmentConfigurationActionTypes.SAVE_AMENDMENT_CONFIGURATION:
      return {
        ...state,
        isLoading: true
      };

    case AmendmentConfigurationActionTypes.SAVE_AMENDMENT_CONFIGURATION_SUCCESS:
      return {
        ...state,
        AmendmentConfigConfigurationList: action.payload,
        hasUpdated: true,
        isLoading: false
      };

    case AmendmentConfigurationActionTypes.SAVE_AMENDMENT_CONFIGURATION_FAILURE:

    case AmendmentConfigurationActionTypes.LOAD_AMENDMENT_CONFIGURATION_FILED_VALUE_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: null
      };
    case AmendmentConfigurationActionTypes.LOAD_AMENDMENT_CONFIGURATION_FILED_VALUE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        amendmentConfigValue: action.payload
      };

    case AmendmentConfigurationActionTypes.LOAD_RESET:
      return {
        ...state,
        error: null,
        amendmentConfigValue: null,
        hasUpdated: null,
        isLoading: null
      };
    default:
      return { ...state };
  }
}
