import { createFeatureSelector } from '@ngrx/store';
import {
  MaxFlatTepConfigActionTypes,
  MaxFlatTepConfigActions
} from './max-flat-tep-config.actions';
import { MaxFlatTepConfigState } from './max-flat-tep-config.state';

export const maxFlatTepConfigFeatureKey = 'max-flat-tep-config';

export const selectMaxFlatTepConfigState = createFeatureSelector<
  MaxFlatTepConfigState
>(maxFlatTepConfigFeatureKey);

export const initialState: MaxFlatTepConfigState = {
  errors: null,
  isLoading: false,
  maxFlatTepConfigDetails: null,
  updateMaxFlatTepConfigResponse: null
};

export function MaxFlatTepConfigReducer(
  state: MaxFlatTepConfigState = initialState,
  action: MaxFlatTepConfigActions
): MaxFlatTepConfigState {
  switch (action.type) {
    case MaxFlatTepConfigActionTypes.LOAD_MAX_FLAT_TEP_CONFIG:
    case MaxFlatTepConfigActionTypes.UPDATE_MAX_FLAT_TEP_CONFIG:
      return { ...state, isLoading: true, errors: null };
    case MaxFlatTepConfigActionTypes.LOAD_MAX_FLAT_TEP_CONFIG_SUCCESS:
      return {
        ...state,
        maxFlatTepConfigDetails: action.payload,
        errors: null,
        isLoading: false
      };
    case MaxFlatTepConfigActionTypes.LOAD_MAX_FLAT_TEP_CONFIG_FAILURE:
      return {
        ...state,
        maxFlatTepConfigDetails: null,
        errors: action.payload,
        isLoading: false
      };
    case MaxFlatTepConfigActionTypes.UPDATE_MAX_FLAT_TEP_CONFIG_SUCCESS:
      return {
        ...state,
        updateMaxFlatTepConfigResponse: action.payload,
        errors: null,
        isLoading: false
      };
    case MaxFlatTepConfigActionTypes.UPDATE_MAX_FLAT_TEP_CONFIG_FAILURE:
      return {
        ...state,
        updateMaxFlatTepConfigResponse: null,
        errors: action.payload,
        isLoading: false
      };
    case MaxFlatTepConfigActionTypes.RESET_DATA:
      return {
        ...state,
        updateMaxFlatTepConfigResponse: null,
        maxFlatTepConfigDetails: null,
        errors: null,
        isLoading: false
      };
    default:
      return state;
  }
}
