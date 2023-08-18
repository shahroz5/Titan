import { createFeatureSelector } from '@ngrx/store';
import {
  TepValidationConfigActions,
  TepValidationConfigActionTypes
} from './tep-validation-config.actons';

import { tepValidationConfigAdaptor } from './tep-validation-config.entity';
import { TepValidationConfigState } from './tep-validation-config.state';

export const initialState: TepValidationConfigState = {
  tepValidationConfiglist: tepValidationConfigAdaptor.getInitialState(),
  tepValidationConfigDetails: null,
  totalElements: null,
  error: null,
  isLoading: null,
  hasSaved: null,
  hasUpdated: null
};

export const TEP_VALIDATION_CONFIG_FEATURE_NAME = 'tep_validation_config';

export const selectTepValidationConfig = createFeatureSelector<
  TepValidationConfigState
>(TEP_VALIDATION_CONFIG_FEATURE_NAME);

export function tepValidationConfigReducer(
  state: TepValidationConfigState = initialState,
  action: TepValidationConfigActions
): TepValidationConfigState {
  switch (action.type) {
    case TepValidationConfigActionTypes.LOAD_TEP_VALIDATION_CONFIG_LISTING:
    case TepValidationConfigActionTypes.SEARCH_TEP_VALIDATION_CONFIG_DETAILS:
      return {
        ...state,
        tepValidationConfigDetails: null,
        error: null,
        isLoading: true,
        hasSaved: null,
        hasUpdated: null
      };

    case TepValidationConfigActionTypes.LOAD_TEP_VALIDATION_CONFIG_LISTING_SUCCESS:
    case TepValidationConfigActionTypes.SEARCH_TEP_VALIDATION_CONFIG_DETAILS_SUCCESS:
      return {
        ...state,
        tepValidationConfiglist: tepValidationConfigAdaptor.setAll(
          action.payload.results,
          state.tepValidationConfiglist
        ),
        totalElements: action.payload.totalElements,
        error: null,
        isLoading: false
      };

    case TepValidationConfigActionTypes.LOAD_TEP_VALIDATION_CONFIG_LISTING_FAILURE:
    case TepValidationConfigActionTypes.SEARCH_TEP_VALIDATION_CONFIG_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case TepValidationConfigActionTypes.LOAD_TEP_VALIDATION_CONFIG_DETAILS:
      return {
        ...state,
        tepValidationConfiglist: tepValidationConfigAdaptor.getInitialState(),
        error: null,
        isLoading: true,
        hasSaved: null,
        hasUpdated: null
      };

    case TepValidationConfigActionTypes.LOAD_TEP_VALIDATION_CONFIG_DETAILS_SUCCESS:
      return {
        ...state,
        tepValidationConfigDetails: action.payload,
        error: null,
        isLoading: false
      };

    case TepValidationConfigActionTypes.LOAD_TEP_VALIDATION_CONFIG_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case TepValidationConfigActionTypes.SEARCH_TEP_VALIDATION_CONFIG_DETAILS:
      return {
        ...state,
        error: null,
        isLoading: true,
        hasSaved: null,
        hasUpdated: null
      };

    case TepValidationConfigActionTypes.SAVE_TEP_VALIDATION_CONFIG_DETAILS:
      return {
        ...state,
        error: null,
        isLoading: true,
        hasSaved: null,
        hasUpdated: null
      };

    case TepValidationConfigActionTypes.SAVE_TEP_VALIDATION_CONFIG_DETAILS_SUCCESS:
      return {
        ...state,
        tepValidationConfigDetails: action.payload,
        isLoading: false,
        hasSaved: true
      };

    case TepValidationConfigActionTypes.SAVE_TEP_VALIDATION_CONFIG_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case TepValidationConfigActionTypes.UPDATE_TEP_VALIDATION_CONFIG_DETAILS:
      return {
        ...state,
        error: null,
        isLoading: true,
        hasSaved: null,
        hasUpdated: null
      };

    case TepValidationConfigActionTypes.UPDATE_TEP_VALIDATION_CONFIG_DETAILS_SUCCESS:
      return {
        ...state,
        tepValidationConfigDetails: action.payload,
        isLoading: false,
        hasUpdated: true
      };

    case TepValidationConfigActionTypes.UPDATE_TEP_VALIDATION_CONFIG_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    default:
      return { ...state };
  }
}
