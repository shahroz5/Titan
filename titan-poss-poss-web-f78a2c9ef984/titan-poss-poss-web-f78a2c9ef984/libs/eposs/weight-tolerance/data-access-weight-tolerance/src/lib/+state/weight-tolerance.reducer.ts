import {
  WeightToleranceActionTypes,
  WeightToleranceActions
} from './weight-tolerance.actions';

import { WeightToleranceState } from './weight-tolerances.state';
import { createFeatureSelector } from '@ngrx/store';

export const weightToleranceFeatureKey = 'weightTolerance';

export const selectWeightToleranceState = createFeatureSelector<
  WeightToleranceState
>(weightToleranceFeatureKey);

export const initialState: WeightToleranceState = {
  configList: [],

  weightTolerance: [],
  totalElements: null,
  selectedConfigIdDetails: null,
  rangeWeight: [],
  isLoading: null,
  hasSaved: null,
  error: null,
  hasUpdated: null,
  configId: null,
  isCleared: null,
  productGroups: []
};
export function weightToleranceReducer(
  state: WeightToleranceState = initialState,
  action: WeightToleranceActions
): WeightToleranceState {
  switch (action.type) {
    case WeightToleranceActionTypes.LOAD_PRODUCT_GROUPS:
    case WeightToleranceActionTypes.SEARCH_CONFIG_DETAILS_BY_CONFIG_NAME:
    case WeightToleranceActionTypes.LOAD_SELECTED_CONFIG_DETAILS:
    case WeightToleranceActionTypes.LOAD_CONFIG_LIST:
    case WeightToleranceActionTypes.SAVE_WEIGHT_TOLERANCE_DETAILS:
    case WeightToleranceActionTypes.LOAD_WEIGHT_TOLERANCE_BY_CONFIG_ID:
    case WeightToleranceActionTypes.LOAD_RANGE_WEIGHT:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case WeightToleranceActionTypes.LOAD_PRODUCT_GROUPS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        productGroups: action.payload
      };

    case WeightToleranceActionTypes.LOAD_SELECTED_CONFIG_DETAILS_SUCCESSS:
      return {
        ...state,
        selectedConfigIdDetails: action.payload,
        isLoading: false
      };
    case WeightToleranceActionTypes.UPADTE_WEIGHT_TOLERANCE:
    case WeightToleranceActionTypes.UPDATE_IS_ACTIVE:
      return {
        ...state,
        hasUpdated: false,
        isLoading: true
      };
    case WeightToleranceActionTypes.UPADTE_WEIGHT_TOLERANCE_SUCCESS:

    case WeightToleranceActionTypes.UPDATE_IS_ACTIVE_SUCCESS:
      return {
        ...state,
        hasUpdated: true,
        isLoading: false
      };
    case WeightToleranceActionTypes.UPADTE_WEIGHT_TOLERANCE_FAILURE:
    case WeightToleranceActionTypes.UPDATE_IS_ACTIVE_FAILURE:
      return {
        ...state,
        hasUpdated: null,
        error: action.payload,
        isLoading: null
      };

    case WeightToleranceActionTypes.SEARCH_CONFIG_DETAILS_BY_CONFIG_NAME_SUCCESS:
    case WeightToleranceActionTypes.LOAD_CONFIG_LIST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        configList: action.payload.configList,
        totalElements: action.payload.totalElements
      };
    case WeightToleranceActionTypes.LOAD_RANGE_WEIGHT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        rangeWeight: action.payload
      };
    case WeightToleranceActionTypes.SAVE_WEIGHT_TOLERANCE_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        configId: action.payload
      };

    case WeightToleranceActionTypes.LOAD_PRODUCT_GROUPS_FAILURE:
    case WeightToleranceActionTypes.LOAD_SELECTED_CONFIG_DETAILS_FAILURE:
    case WeightToleranceActionTypes.LOAD_CONFIG_LIST_FAILURE:
    case WeightToleranceActionTypes.SAVE_WEIGHT_TOLERANCE_DETAILS_FAILURE:
    case WeightToleranceActionTypes.SEARCH_CONFIG_DETAILS_BY_CONFIG_NAME_FAILURE:
    case WeightToleranceActionTypes.LOAD_RANGE_WEIGHT_FAILURE:
      return {
        ...state,
        isLoading: null,
        error: action.payload
      };
    case WeightToleranceActionTypes.LOAD_WEIGHT_TOLERANCE_BY_CONFIG_ID_FAILURE:
      return {
        ...state,
        isLoading: null,
        error: action.payload,
        weightTolerance: []
      };
    case WeightToleranceActionTypes.LOAD_WEIGHT_TOLERANCE_BY_CONFIG_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        weightTolerance: action.payload.weightTolerance,
        totalElements: action.payload.totalElements
      };

    case WeightToleranceActionTypes.REMOVE_WEIGHT_TOLERANCE:
      return {
        ...state,
        isLoading: true,
        isCleared: false
      };
    case WeightToleranceActionTypes.REMOVE_WEIGHT_TOLERANCE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isCleared: true
      };
    case WeightToleranceActionTypes.REMOVE_WEIGHT_TOLERANCE_FAILURE:
      return {
        ...state,
        isLoading: null,
        error: action.payload,
        isCleared: null
      };
    case WeightToleranceActionTypes.LOAD_RESET:
      return {
        ...state,
        weightTolerance: [],
        isLoading: null,

        configList: [],
        hasUpdated: null,
        hasSaved: null,
        selectedConfigIdDetails: null,
        totalElements: null,
        isCleared: null,
        rangeWeight: [],
        error: null,
        configId: null,
        productGroups: []
      };
    default:
      return { ...state };
  }
}
