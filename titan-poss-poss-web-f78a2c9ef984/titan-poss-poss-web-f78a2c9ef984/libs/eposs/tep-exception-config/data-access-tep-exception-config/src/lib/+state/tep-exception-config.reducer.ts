import {
  TepExceptionConfigActions,
  TepExceptionConfigActionTypes
} from './tep-exception-config.actons';
import { createFeatureSelector } from '@ngrx/store';
import { TepExceptionConfigState } from './tep-exception-config.state';
import { tepExceptionConfigAdaptor } from './tep-exception-config.entity';

export const initialState: TepExceptionConfigState = {
  tepExceptionConfiglist: tepExceptionConfigAdaptor.getInitialState(),
  tepExceptionConfigDetails: null,
  totalElements: null,
  maxFlatTepExchangeValue: null,
  error: null,
  isLoading: null,
  hasSaved: null,
  hasUpdated: null
};

export const TEP_EXCEPTION_CONFIG_FEATURE_NAME = 'tep_exception_config';

export const selectTepExceptionConfig = createFeatureSelector<
  TepExceptionConfigState
>(TEP_EXCEPTION_CONFIG_FEATURE_NAME);

export function tepExceptionConfigReducer(
  state: TepExceptionConfigState = initialState,
  action: TepExceptionConfigActions
): TepExceptionConfigState {
  switch (action.type) {
    case TepExceptionConfigActionTypes.LOAD_TEP_EXCEPTION_CONFIG_LISTING:
    case TepExceptionConfigActionTypes.SEARCH_TEP_EXCEPTION_CONFIG_DETAILS:
      return {
        ...state,
        tepExceptionConfigDetails: null,
        error: null,
        isLoading: true,
        hasSaved: null,
        hasUpdated: null
      };

    case TepExceptionConfigActionTypes.LOAD_TEP_EXCEPTION_CONFIG_LISTING_SUCCESS:
    case TepExceptionConfigActionTypes.SEARCH_TEP_EXCEPTION_CONFIG_DETAILS_SUCCESS:
      return {
        ...state,
        tepExceptionConfiglist: tepExceptionConfigAdaptor.setAll(
          action.payload.results,
          state.tepExceptionConfiglist
        ),
        totalElements: action.payload.totalElements,
        error: null,
        isLoading: false
      };

    case TepExceptionConfigActionTypes.LOAD_TEP_EXCEPTION_CONFIG_LISTING_FAILURE:
    case TepExceptionConfigActionTypes.SEARCH_TEP_EXCEPTION_CONFIG_DETAILS_FAILURE:
      return {
        ...state,
        tepExceptionConfiglist: tepExceptionConfigAdaptor.removeAll(
          state.tepExceptionConfiglist
        ),
        error: action.payload,
        isLoading: false
      };

    case TepExceptionConfigActionTypes.LOAD_TEP_EXCEPTION_CONFIG_DETAILS:
      return {
        ...state,
        tepExceptionConfigDetails: null,
        error: null,
        isLoading: true,
        hasSaved: null,
        hasUpdated: null
      };

    case TepExceptionConfigActionTypes.LOAD_TEP_EXCEPTION_CONFIG_DETAILS_SUCCESS:
      return {
        ...state,
        tepExceptionConfigDetails: action.payload,
        isLoading: false
      };

    case TepExceptionConfigActionTypes.LOAD_TEP_EXCEPTION_CONFIG_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case TepExceptionConfigActionTypes.SAVE_TEP_EXCEPTION_CONFIG_DETAILS:
      return {
        ...state,
        error: null,
        isLoading: true,
        hasSaved: null,
        hasUpdated: null
      };

    case TepExceptionConfigActionTypes.SAVE_TEP_EXCEPTION_CONFIG_DETAILS_SUCCESS:
      return {
        ...state,
        tepExceptionConfigDetails: action.payload,
        isLoading: false,
        hasSaved: true
      };

    case TepExceptionConfigActionTypes.SAVE_TEP_EXCEPTION_CONFIG_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case TepExceptionConfigActionTypes.UPDATE_TEP_EXCEPTION_CONFIG_DETAILS:
      return {
        ...state,
        error: null,
        isLoading: true,
        hasSaved: null,
        hasUpdated: null
      };

    case TepExceptionConfigActionTypes.UPDATE_TEP_EXCEPTION_CONFIG_DETAILS_SUCCESS:
      return {
        ...state,
        tepExceptionConfigDetails: action.payload,
        isLoading: false,
        hasUpdated: true
      };

    case TepExceptionConfigActionTypes.UPDATE_TEP_EXCEPTION_CONFIG_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case TepExceptionConfigActionTypes.LOAD_TEP_GLOBAL_CONFIG_LISTING:
      return {
        ...state
      };

    case TepExceptionConfigActionTypes.LOAD_TEP_GLOBAL_CONFIG_LISTING_SUCCESS:
      return {
        ...state,
        maxFlatTepExchangeValue: action.payload
      };

    case TepExceptionConfigActionTypes.LOAD_TEP_GLOBAL_CONFIG_LISTING_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    default:
      return { ...state };
  }
}
