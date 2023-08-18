import { createFeatureSelector } from '@ngrx/store';

import { ResidualWeightConfigState } from './residual-weight-config.state';
import {
  ResidualWeightConfigAction,
  ResidualWeightConfigActionTypes
} from './residual-weight-config.actions';

export const ResidualWeightConfigFeatureKey = 'ResidualWeightConfig';

export const selectResidualWeightConfigState = createFeatureSelector<
  ResidualWeightConfigState
>(ResidualWeightConfigFeatureKey);

export const initialState: ResidualWeightConfigState = {
  residualWeightConfigList: [],
  residualWeightConfig: null,
  isLoading: null,
  hasSaved: null,
  hasUpdated: null,
  totalElements: null,
  error: null,
  configId: null,
  rangeWeight: [],
  rangeMapping: null,
  isCleared: null,
  ruleDetailsCount: 0
};
export function residualWeightConfigReducer(
  state: ResidualWeightConfigState = initialState,
  action: ResidualWeightConfigAction
) {
  switch (action.type) {
    case ResidualWeightConfigActionTypes.LOAD_RESIDUAL_WEIGHT_CONFIG_LIST:
      return {
        ...state,
        isLoading: true,
        error: null,
        residualWeightConfig: null
      };
    case ResidualWeightConfigActionTypes.LOAD_RESIDUAL_WEIGHT_CONFIG_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        residualWeightConfigList: action.payload.data,
        totalElements: action.payload.totalElements
      };
    case ResidualWeightConfigActionTypes.LOAD_RESIDUAL_WEIGHT_CONFIG_LIST_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case ResidualWeightConfigActionTypes.SEARCH_RESIDUAL_WEIGHT_CONFIG_LIST:
      return {
        ...state,
        isLoading: true
      };
    case ResidualWeightConfigActionTypes.SEARCH_RESIDUAL_WEIGHT_CONFIG_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        residualWeightConfigList: action.payload.data,
        totalElements: action.payload.totalElements
      };
    case ResidualWeightConfigActionTypes.SEARCH_RESIDUAL_WEIGHT_CONFIG_LIST_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case ResidualWeightConfigActionTypes.SAVE_RESIDUAL_WEIGHT_CONFIG:
      return {
        ...state,
        hasSaved: false,
        isLoading: true,
        residualWeightConfig: null
      };
    case ResidualWeightConfigActionTypes.SAVE_RESIDUAL_WEIGHT_CONFIG_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasSaved: true,
        configId: action.payload
      };

    case ResidualWeightConfigActionTypes.SAVE_RESIDUAL_WEIGHT_CONFIG_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasSaved: false,
        error: action.payload
      };

    case ResidualWeightConfigActionTypes.UPADTE_RESIDUAL_WEIGHT_CONFIG_IS_ACTIVE:
      return {
        ...state,
        isLoading: true,
        hasUpdated: false,
        residualWeightConfig: null
      };

    case ResidualWeightConfigActionTypes.UPADTE_RESIDUAL_WEIGHT_CONFIG_IS_ACTIVE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasUpdated: true,
        residualWeightConfig: action.payload
      };

    case ResidualWeightConfigActionTypes.UPADTE_RESIDUAL_WEIGHT_CONFIG_IS_ACTIVE_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasUpdated: false,
        error: action.payload
      };

    case ResidualWeightConfigActionTypes.LOAD_RESET:
      return {
        ...state,
        residualWeightConfigList: [],
        residualWeightConfig: null,
        isLoading: null,
        hasSaved: null,
        hasUpdated: null,
        totalElements: null,
        error: null,
        rangeMapping: null,
        configId: null,
        isCleared: null
      };
    case ResidualWeightConfigActionTypes.LOAD_RESIDUAL_WEIGHT_RANGE_WEIGHT:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case ResidualWeightConfigActionTypes.LOAD_RESIDUAL_WEIGHT_RANGE_WEIGHT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        rangeWeight: action.payload
      };
    case ResidualWeightConfigActionTypes.LOAD_RESIDUAL_WEIGHT_RANGE_WEIGHT_FAILURE:
      return {
        ...state,
        isLoading: null,
        error: action.payload
      };
    case ResidualWeightConfigActionTypes.LOAD_SELECTED_CONFIG_DETAILS:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case ResidualWeightConfigActionTypes.LOAD_SELECTED_CONFIG_DETAILS_SUCCESSS:
      return {
        ...state,
        isLoading: false,
        residualWeightConfig: action.payload
      };
    case ResidualWeightConfigActionTypes.LOAD_SELECTED_CONFIG_DETAILS_FAILURE:
      return {
        ...state,
        isLoading: null,
        error: action.payload
      };
    case ResidualWeightConfigActionTypes.LOAD_RANGE_MAPPING_BY_CONFIG_ID:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case ResidualWeightConfigActionTypes.LOAD_RANGE_MAPPING_BY_CONFIG_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        rangeMapping: action.payload.weightTolerance,
        ruleDetailsCount: action.payload.totalElements
      };
    case ResidualWeightConfigActionTypes.LOAD_RANGE_MAPPING_BY_CONFIG_ID_FAILURE:
      return {
        ...state,
        isLoading: null,
        error: action.payload,
        rangeMapping: null
      };

    case ResidualWeightConfigActionTypes.UPADTE_RANGE_MAPPING:
      return {
        ...state,
        isLoading: true,
        hasUpdated: false
        //residualWeightConfig: null
      };

    case ResidualWeightConfigActionTypes.UPADTE_RANGE_MAPPING_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasUpdated: true
        //rangeMapping: action.payload
      };

    case ResidualWeightConfigActionTypes.UPADTE_RANGE_MAPPING_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasUpdated: false,
        error: action.payload
      };
    case ResidualWeightConfigActionTypes.REMOVE_RESIDUAL_WEIGHT_RANGE_WEIGHT:
      return {
        ...state,
        isLoading: true,
        isCleared: false
      };
    case ResidualWeightConfigActionTypes.REMOVE_RESIDUAL_WEIGHT_RANGE_WEIGHT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isCleared: true
      };
    case ResidualWeightConfigActionTypes.REMOVE_RESIDUAL_WEIGHT_RANGE_WEIGHT_FAILURE:
      return {
        ...state,
        isLoading: null,
        error: action.payload,
        isCleared: null
      };

    default: {
      return { ...state };
    }
  }
}
