import { createFeatureSelector } from '@ngrx/store';

import { WeightValueConfigState } from './weight-value-config.state';
import {
  WeightValueConfigActions,
  WeightValueConfigActionTypes
} from './weight-value-config.actions';

export const initialState: WeightValueConfigState = {
  weightValueConfigListing: null,
  weightValueConfigDetails: null,
  weightValueConfigDetailsSaved: null,
  weightValueConfigDetailsEdited: null,
  totalWeightValueConfig: 0,
  error: null,
  isLoading: null
};

export const WEIGHT_VALUE_CONFIG_FEATURE_KEY = 'WeightValueConfig';
export const selectWeightValueConfigState = createFeatureSelector<
  WeightValueConfigState
>(WEIGHT_VALUE_CONFIG_FEATURE_KEY);

export function WeightValueConfigReducer(
  state: WeightValueConfigState = initialState,
  action: WeightValueConfigActions
): WeightValueConfigState {
  switch (action.type) {
    case WeightValueConfigActionTypes.LOAD_WEIGHT_VALUE_CONIG_DETAILS:
    case WeightValueConfigActionTypes.LOAD_WEIGHT_VALUE_CONIG_LISTING:
      return {
        ...state,
        weightValueConfigDetailsSaved: null,
        weightValueConfigDetailsEdited: null,
        weightValueConfigDetails: null,
        isLoading: true,
        error: null
      };
    case WeightValueConfigActionTypes.EDIT_WEIGHT_VALUE_CONIG_DETAILS:
      return {
        ...state,
        weightValueConfigDetailsSaved: null,
        weightValueConfigDetailsEdited: null,
        isLoading: true,
        error: null
      };
    case WeightValueConfigActionTypes.SEARCH_WEIGHT_VALUE_CONIG_LISTING_SUCCESS:
    case WeightValueConfigActionTypes.LOAD_WEIGHT_VALUE_CONIG_LISTING_SUCCESS:
      return {
        ...state,
        weightValueConfigListing: action.payload.results,
        totalWeightValueConfig: action.payload.totalElements,
        isLoading: false
      };

    case WeightValueConfigActionTypes.EDIT_WEIGHT_VALUE_CONIG_DETAILS_FAILURE:
    case WeightValueConfigActionTypes.SAVE_WEIGHT_VALUE_CONIG_DETAILS_FAILURE:
    case WeightValueConfigActionTypes.LOAD_WEIGHT_VALUE_CONIG_DETAILS_FAILURE:
    case WeightValueConfigActionTypes.SEARCH_WEIGHT_VALUE_CONIG_LISTING_FAILURE:
    case WeightValueConfigActionTypes.LOAD_WEIGHT_VALUE_CONIG_LISTING_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case WeightValueConfigActionTypes.SEARCH_WEIGHT_VALUE_CONIG_LISTING:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case WeightValueConfigActionTypes.LOAD_WEIGHT_VALUE_CONIG_DETAILS_SUCCESS:
      return {
        ...state,
        weightValueConfigDetails: action.payload,
        isLoading: false
      };

    case WeightValueConfigActionTypes.SAVE_WEIGHT_VALUE_CONIG_DETAILS:
      return {
        ...state,
        isLoading: true,
        weightValueConfigDetailsSaved: null,
        weightValueConfigDetailsEdited: null,
        error: null
      };

    case WeightValueConfigActionTypes.SAVE_WEIGHT_VALUE_CONIG_DETAILS_SUCCESS:
      return {
        ...state,
        weightValueConfigDetails: action.payload,
        weightValueConfigDetailsSaved: action.payload,
        weightValueConfigDetailsEdited: action.payload,
        isLoading: false
      };
    case WeightValueConfigActionTypes.EDIT_WEIGHT_VALUE_CONIG_DETAILS_SUCCESS:
      return {
        ...state,
        weightValueConfigDetails: action.payload,
        weightValueConfigDetailsEdited: action.payload,
        isLoading: false
      };
    case WeightValueConfigActionTypes.LOAD_RESET:
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
}
