import { createFeatureSelector } from '@ngrx/store';
import { AbToleranceConfigState } from './ab-tolerance-config.state';
import {
  AbToleranceConfigAction,
  AbToleranceConfigActionTypes
} from './ab-tolerance-config.actions';

export const AbToleranceConfigFeatureKey = 'abToleranceConfig';

export const selectAbToleranceConfigState = createFeatureSelector<
  AbToleranceConfigState
>(AbToleranceConfigFeatureKey);

export const initialState: AbToleranceConfigState = {
  abToleranceConfigList: [],
  abToleranceConfig: null,
  toleranceConfigMapping: null,
  totalElements: null,
  isLoading: false,
  configId: null,
  hasSaved: false,
  hasUpdated: false,
  error: null,
  isCleared: false,
  rangeWeight: [],
  metalType: [],
  uniqueNameCheckCount: null,
  ruleDetailsCount: 0
};
export function abToleranceConfigReducer(
  state: AbToleranceConfigState = initialState,
  action: AbToleranceConfigAction
) {
  switch (action.type) {
    case AbToleranceConfigActionTypes.LOAD_AB_TOLERANCE_CONFIG_LIST:
      return {
        ...state,
        isLoading: true,
        error: null,
        abToleranceConfig: null
      };
    case AbToleranceConfigActionTypes.LOAD_AB_TOLERANCE_CONFIG_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        abToleranceConfigList: action.payload.data,
        totalElements: action.payload.totalElements
      };
    case AbToleranceConfigActionTypes.LOAD_AB_TOLERANCE_CONFIG_LIST_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case AbToleranceConfigActionTypes.SEARCH_AB_TOLERANCE_CONFIG_LIST:
      return {
        ...state,
        isLoading: true
      };
    case AbToleranceConfigActionTypes.SEARCH_AB_TOLERANCE_CONFIG_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        abToleranceConfigList: action.payload.data,
        totalElements: action.payload.totalElements
      };
    case AbToleranceConfigActionTypes.SEARCH_AB_TOLERANCE_CONFIG_LIST_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case AbToleranceConfigActionTypes.SAVE_AB_TOLERANCE_CONFIG:
      return {
        ...state,
        hasSaved: false,
        isLoading: true,
        abToleranceConfig: null
      };
    case AbToleranceConfigActionTypes.SAVE_AB_TOLERANCE_CONFIG_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasSaved: true,
        configId: action.payload.ruleId
      };

    case AbToleranceConfigActionTypes.SAVE_AB_TOLERANCE_CONFIG_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasSaved: false,
        error: action.payload
      };

    case AbToleranceConfigActionTypes.UPADTE_AB_TOLERANCE_CONFIG_IS_ACTIVE:
      return {
        ...state,
        isLoading: true,
        hasUpdated: false,
        abToleranceConfig: null
      };

    case AbToleranceConfigActionTypes.UPADTE_AB_TOLERANCE_CONFIG_IS_ACTIVE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasUpdated: true,
        abToleranceConfig: action.payload
        // residualWeightConfigDetailsEdited: action.payload
      };

    case AbToleranceConfigActionTypes.UPADTE_AB_TOLERANCE_CONFIG_IS_ACTIVE_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasUpdated: false,
        error: action.payload
      };

    case AbToleranceConfigActionTypes.LOAD_RESET:
      return {
        ...state,
        abToleranceConfigList: [],
        abToleranceConfig: null,
        isLoading: null,
        hasSaved: null,
        hasUpdated: null,
        totalElements: null,
        error: null,
        toleranceConfigMapping: null,
        configId: null,
        isCleared: null,
        rangeWeight: [],
        metalType: [],
        uniqueNameCheckCount: null
      };
    case AbToleranceConfigActionTypes.LOAD_AB_TOLERANCE_RANGE_WEIGHT:
      return {
        ...state,
        isLoading: true,
        rangeWeight: null,
        error: null
      };
    case AbToleranceConfigActionTypes.LOAD_AB_TOLERANCE_RANGE_WEIGHT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        rangeWeight: action.payload
      };
    case AbToleranceConfigActionTypes.LOAD_AB_TOLERANCE_RANGE_WEIGHT_FAILURE:
      return {
        ...state,
        isLoading: null,
        error: action.payload
      };
    case AbToleranceConfigActionTypes.LOAD_SELECTED_CONFIG_DETAILS:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case AbToleranceConfigActionTypes.LOAD_SELECTED_CONFIG_DETAILS_SUCCESSS:
      return {
        ...state,
        isLoading: false,
        abToleranceConfig: action.payload
      };
    case AbToleranceConfigActionTypes.LOAD_SELECTED_CONFIG_DETAILS_FAILURE:
      return {
        ...state,
        isLoading: null,
        error: action.payload
      };
    case AbToleranceConfigActionTypes.LOAD_RANGE_MAPPING_BY_CONFIG_ID:
      return {
        ...state,
        isLoading: true,
        toleranceConfigMapping: null,
        error: null
      };
    case AbToleranceConfigActionTypes.LOAD_RANGE_MAPPING_BY_CONFIG_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        toleranceConfigMapping: action.payload.ruleDetails,
        ruleDetailsCount: action.payload.totalElements
      };
    case AbToleranceConfigActionTypes.LOAD_RANGE_MAPPING_BY_CONFIG_ID_FAILURE:
      return {
        ...state,
        isLoading: null,
        error: action.payload,
        toleranceConfigMapping: null
      };
    case AbToleranceConfigActionTypes.LOAD_METAL_TYPES:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case AbToleranceConfigActionTypes.LOAD_METAL_TYPES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        metalType: action.payload
      };
    case AbToleranceConfigActionTypes.LOAD_METAL_TYPES_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case AbToleranceConfigActionTypes.REMOVE_AB_TOLERANCE_CONFIG:
      return {
        ...state,
        isLoading: true,
        isCleared: false
      };
    case AbToleranceConfigActionTypes.REMOVE_AB_TOLERANCE_CONFIG_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isCleared: true
      };
    case AbToleranceConfigActionTypes.REMOVE_AB_TOLERANCE_CONFIG_FAILURE:
      return {
        ...state,
        isLoading: null,
        error: action.payload,
        isCleared: null
      };
    case AbToleranceConfigActionTypes.UPADTE_RANGE_MAPPING:
      return {
        ...state,
        isLoading: true,
        hasUpdated: false
      };
    case AbToleranceConfigActionTypes.UPADTE_RANGE_MAPPING_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasUpdated: true,
        toleranceConfigMapping: action.payload
      };
    case AbToleranceConfigActionTypes.UPADTE_RANGE_MAPPING_FAILURE:
      return {
        ...state,
        isLoading: null,
        error: action.payload,
        hasUpdated: false
      };
    case AbToleranceConfigActionTypes.AB_TOLERANCE_CONFIG_UNIQUE_NAME_CHECK:
      return {
        ...state,
        isLoading: true,
        error: null,
        uniqueNameCheckCount: null
      };
    case AbToleranceConfigActionTypes.AB_TOLERANCE_CONFIG_UNIQUE_NAME_CHECK_SUCCESS:
      return {
        ...state,
        isLoading: false,
        uniqueNameCheckCount: action.payload
      };
    case AbToleranceConfigActionTypes.AB_TOLERANCE_CONFIG_UNIQUE_NAME_CHECK_FAILURE:
      return {
        ...state,
        isLoading: false,
        uniqueNameCheckCount: null,
        error: action.payload
      };

    default: {
      return { ...state };
    }
  }
}
