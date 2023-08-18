import { createFeatureSelector } from '@ngrx/store';
import { CoToleranceConfigState } from './co-tolerance-config.state';
import {
  CoToleranceConfigAction,
  CoToleranceConfigActionTypes
} from './co-tolerance-config.actions';

export const CoToleranceConfigFeatureKey = 'coToleranceConfig';

export const selectCoToleranceConfigState = createFeatureSelector<
  CoToleranceConfigState
>(CoToleranceConfigFeatureKey);

export const initialState: CoToleranceConfigState = {
  coToleranceConfigList: [],
  coToleranceConfig: null,
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
export function coToleranceConfigReducer(
  state: CoToleranceConfigState = initialState,
  action: CoToleranceConfigAction
) {
  switch (action.type) {
    case CoToleranceConfigActionTypes.LOAD_CO_TOLERANCE_CONFIG_LIST:
      return {
        ...state,
        isLoading: true,
        error: null,
        coToleranceConfig: null
      };
    case CoToleranceConfigActionTypes.LOAD_CO_TOLERANCE_CONFIG_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        coToleranceConfigList: action.payload.data,
        totalElements: action.payload.totalElements
      };
    case CoToleranceConfigActionTypes.LOAD_CO_TOLERANCE_CONFIG_LIST_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case CoToleranceConfigActionTypes.SEARCH_CO_TOLERANCE_CONFIG_LIST:
      return {
        ...state,
        isLoading: true
      };
    case CoToleranceConfigActionTypes.SEARCH_CO_TOLERANCE_CONFIG_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        coToleranceConfigList: action.payload.data,
        totalElements: action.payload.totalElements
      };
    case CoToleranceConfigActionTypes.SEARCH_CO_TOLERANCE_CONFIG_LIST_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case CoToleranceConfigActionTypes.SAVE_CO_TOLERANCE_CONFIG:
      return {
        ...state,
        hasSaved: false,
        isLoading: true,
        coToleranceConfig: null
      };
    case CoToleranceConfigActionTypes.SAVE_CO_TOLERANCE_CONFIG_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasSaved: true,
        configId: action.payload.ruleId
      };

    case CoToleranceConfigActionTypes.SAVE_CO_TOLERANCE_CONFIG_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasSaved: false,
        error: action.payload
      };

    case CoToleranceConfigActionTypes.UPADTE_CO_TOLERANCE_CONFIG_IS_ACTIVE:
      return {
        ...state,
        isLoading: true,
        hasUpdated: false,
        coToleranceConfig: null
      };

    case CoToleranceConfigActionTypes.UPADTE_CO_TOLERANCE_CONFIG_IS_ACTIVE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasUpdated: true,
        coToleranceConfig: action.payload
        // residualWeightConfigDetailsEdited: action.payload
      };

    case CoToleranceConfigActionTypes.UPADTE_CO_TOLERANCE_CONFIG_IS_ACTIVE_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasUpdated: false,
        error: action.payload
      };

    case CoToleranceConfigActionTypes.LOAD_RESET:
      return {
        ...state,
        coToleranceConfigList: [],
        coToleranceConfig: null,
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
    case CoToleranceConfigActionTypes.LOAD_CO_TOLERANCE_RANGE_WEIGHT:
      return {
        ...state,
        isLoading: true,
        rangeWeight: null,
        error: null
      };
    case CoToleranceConfigActionTypes.LOAD_CO_TOLERANCE_RANGE_WEIGHT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        rangeWeight: action.payload
      };
    case CoToleranceConfigActionTypes.LOAD_CO_TOLERANCE_RANGE_WEIGHT_FAILURE:
      return {
        ...state,
        isLoading: null,
        error: action.payload
      };
    case CoToleranceConfigActionTypes.LOAD_SELECTED_CONFIG_DETAILS:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case CoToleranceConfigActionTypes.LOAD_SELECTED_CONFIG_DETAILS_SUCCESSS:
      return {
        ...state,
        isLoading: false,
        coToleranceConfig: action.payload
      };
    case CoToleranceConfigActionTypes.LOAD_SELECTED_CONFIG_DETAILS_FAILURE:
      return {
        ...state,
        isLoading: null,
        error: action.payload
      };
    case CoToleranceConfigActionTypes.LOAD_RANGE_MAPPING_BY_CONFIG_ID:
      return {
        ...state,
        isLoading: true,
        toleranceConfigMapping: null,
        error: null
      };
    case CoToleranceConfigActionTypes.LOAD_RANGE_MAPPING_BY_CONFIG_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        toleranceConfigMapping: action.payload.ruleDetails,
        ruleDetailsCount: action.payload.totalElements
      };
    case CoToleranceConfigActionTypes.LOAD_RANGE_MAPPING_BY_CONFIG_ID_FAILURE:
      return {
        ...state,
        isLoading: null,
        error: action.payload,
        toleranceConfigMapping: null
      };
    case CoToleranceConfigActionTypes.LOAD_METAL_TYPES:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case CoToleranceConfigActionTypes.LOAD_METAL_TYPES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        metalType: action.payload
      };
    case CoToleranceConfigActionTypes.LOAD_METAL_TYPES_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case CoToleranceConfigActionTypes.REMOVE_CO_TOLERANCE_CONFIG:
      return {
        ...state,
        isLoading: true,
        isCleared: false
      };
    case CoToleranceConfigActionTypes.REMOVE_CO_TOLERANCE_CONFIG_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isCleared: true
      };
    case CoToleranceConfigActionTypes.REMOVE_CO_TOLERANCE_CONFIG_FAILURE:
      return {
        ...state,
        isLoading: null,
        error: action.payload,
        isCleared: null
      };
    case CoToleranceConfigActionTypes.UPADTE_RANGE_MAPPING:
      return {
        ...state,
        isLoading: true,
        hasUpdated: false
      };
    case CoToleranceConfigActionTypes.UPADTE_RANGE_MAPPING_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasUpdated: true,
        toleranceConfigMapping: action.payload
      };
    case CoToleranceConfigActionTypes.UPADTE_RANGE_MAPPING_FAILURE:
      return {
        ...state,
        isLoading: null,
        error: action.payload,
        hasUpdated: false
      };
    case CoToleranceConfigActionTypes.CO_TOLERANCE_CONFIG_UNIQUE_NAME_CHECK:
      return {
        ...state,
        isLoading: true,
        error: null,
        uniqueNameCheckCount: null
      };
    case CoToleranceConfigActionTypes.CO_TOLERANCE_CONFIG_UNIQUE_NAME_CHECK_SUCCESS:
      return {
        ...state,
        isLoading: false,
        uniqueNameCheckCount: action.payload
      };
    case CoToleranceConfigActionTypes.CO_TOLERANCE_CONFIG_UNIQUE_NAME_CHECK_FAILURE:
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
