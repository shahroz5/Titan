import { createFeatureSelector } from '@ngrx/store';
import { BgrToleranceConfigState } from './bgr-tolerance-config.state';
import {
  BgrToleranceConfigAction,
  BgrToleranceConfigActionTypes
} from './bgr-tolerance-config.actions';

export const BgrToleranceConfigFeatureKey = 'bgrToleranceConfig';

export const selectBgrToleranceConfigState = createFeatureSelector<
  BgrToleranceConfigState
>(BgrToleranceConfigFeatureKey);

export const initialState: BgrToleranceConfigState = {
  bgrToleranceConfigList: [],
  bgrToleranceConfig: null,
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
  configIdInSlabValidationFailure: null
};
export function bgrToleranceConfigReducer(
  state: BgrToleranceConfigState = initialState,
  action: BgrToleranceConfigAction
) {
  switch (action.type) {
    case BgrToleranceConfigActionTypes.LOAD_BGR_TOLERANCE_CONFIG_LIST:
      return {
        ...state,
        isLoading: true,
        error: null,
        bgrToleranceConfig: null
      };
    case BgrToleranceConfigActionTypes.LOAD_BGR_TOLERANCE_CONFIG_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        bgrToleranceConfigList: action.payload.data,
        totalElements: action.payload.totalElements
      };
    case BgrToleranceConfigActionTypes.LOAD_BGR_TOLERANCE_CONFIG_LIST_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case BgrToleranceConfigActionTypes.SEARCH_BGR_TOLERANCE_CONFIG_LIST:
      return {
        ...state,
        isLoading: true
      };
    case BgrToleranceConfigActionTypes.SEARCH_BGR_TOLERANCE_CONFIG_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        bgrToleranceConfigList: action.payload.data,
        totalElements: action.payload.totalElements
      };
    case BgrToleranceConfigActionTypes.SEARCH_BGR_TOLERANCE_CONFIG_LIST_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case BgrToleranceConfigActionTypes.SAVE_BGR_TOLERANCE_CONFIG:
      return {
        ...state,
        hasSaved: false,
        isLoading: true,
        bgrToleranceConfig: null
      };
    case BgrToleranceConfigActionTypes.SAVE_BGR_TOLERANCE_CONFIG_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasSaved: true,
        configId: action.payload
      };

    case BgrToleranceConfigActionTypes.SAVE_BGR_TOLERANCE_CONFIG_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasSaved: false,
        error: action.payload
      };

    case BgrToleranceConfigActionTypes.UPADTE_BGR_TOLERANCE_CONFIG_IS_ACTIVE:
      return {
        ...state,
        isLoading: true,
        hasUpdated: false,
        bgrToleranceConfig: null
      };

    case BgrToleranceConfigActionTypes.UPADTE_BGR_TOLERANCE_CONFIG_IS_ACTIVE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasUpdated: true,
        bgrToleranceConfig: action.payload
        // residualWeightConfigDetailsEdited: action.payload
      };

    case BgrToleranceConfigActionTypes.UPADTE_BGR_TOLERANCE_CONFIG_IS_ACTIVE_FAILURE:
      return {
        ...state,
        isLoading: false,
        hasUpdated: false,
        error: action.payload
      };

    case BgrToleranceConfigActionTypes.LOAD_RESET:
      return {
        ...state,
        bgrToleranceConfigList: [],
        bgrToleranceConfig: null,
        isLoading: null,
        hasSaved: null,
        hasUpdated: null,
        totalElements: null,
        error: null,
        toleranceConfigMapping: null,
        configId: null,
        isCleared: null,
        rangeWeight: [],
        metalType: []
      };
    case BgrToleranceConfigActionTypes.LOAD_BGR_TOLERANCE_RANGE_WEIGHT:
      return {
        ...state,
        isLoading: true,
        rangeWeight: null,
        error: null
      };
    case BgrToleranceConfigActionTypes.LOAD_BGR_TOLERANCE_RANGE_WEIGHT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        rangeWeight: action.payload
      };
    case BgrToleranceConfigActionTypes.LOAD_BGR_TOLERANCE_RANGE_WEIGHT_FAILURE:
      return {
        ...state,
        isLoading: null,
        error: action.payload
      };
    case BgrToleranceConfigActionTypes.LOAD_SELECTED_CONFIG_DETAILS:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case BgrToleranceConfigActionTypes.LOAD_SELECTED_CONFIG_DETAILS_SUCCESSS:
      return {
        ...state,
        isLoading: false,
        bgrToleranceConfig: action.payload
      };
    case BgrToleranceConfigActionTypes.LOAD_SELECTED_CONFIG_DETAILS_FAILURE:
      return {
        ...state,
        isLoading: null,
        error: action.payload
      };
    case BgrToleranceConfigActionTypes.LOAD_RANGE_MAPPING_BY_CONFIG_ID:
      return {
        ...state,
        isLoading: true,
        toleranceConfigMapping: null,
        error: null
      };
    case BgrToleranceConfigActionTypes.LOAD_RANGE_MAPPING_BY_CONFIG_ID_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        toleranceConfigMapping: action.payload
      };
    }
    case BgrToleranceConfigActionTypes.LOAD_RANGE_MAPPING_BY_CONFIG_ID_FAILURE:
      return {
        ...state,
        isLoading: null,
        error: action.payload,
        toleranceConfigMapping: null
      };
    case BgrToleranceConfigActionTypes.LOAD_METAL_TYPES:
      return {
        ...state,
        isLoading: true,
        error: null
      };
    case BgrToleranceConfigActionTypes.LOAD_METAL_TYPES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        metalType: action.payload
      };
    case BgrToleranceConfigActionTypes.LOAD_METAL_TYPES_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    case BgrToleranceConfigActionTypes.REMOVE_BGR_TOLERANCE_CONFIG:
      return {
        ...state,
        isLoading: true,
        isCleared: false
      };
    case BgrToleranceConfigActionTypes.REMOVE_BGR_TOLERANCE_CONFIG_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isCleared: true
      };
    case BgrToleranceConfigActionTypes.REMOVE_BGR_TOLERANCE_CONFIG_FAILURE:
      return {
        ...state,
        isLoading: null,
        error: action.payload,
        isCleared: null
      };
    case BgrToleranceConfigActionTypes.UPADTE_RANGE_MAPPING:
      return {
        ...state,
        isLoading: true,
        hasUpdated: false
      };
    case BgrToleranceConfigActionTypes.UPADTE_RANGE_MAPPING_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasUpdated: true,
        toleranceConfigMapping: action.payload
      };
    case BgrToleranceConfigActionTypes.UPADTE_RANGE_MAPPING_FAILURE:
      return {
        ...state,
        isLoading: null,
        error: action.payload,
        hasUpdated: false
      };
    case BgrToleranceConfigActionTypes.UPDATE_CONFIG_ID:
      return {
        ...state,
        configIdInSlabValidationFailure: action.configId
      };
    default: {
      return { ...state };
    }
  }
}
