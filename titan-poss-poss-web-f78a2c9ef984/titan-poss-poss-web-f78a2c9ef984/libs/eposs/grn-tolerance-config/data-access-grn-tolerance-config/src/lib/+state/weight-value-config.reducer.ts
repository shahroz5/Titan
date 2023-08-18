import { createFeatureSelector } from '@ngrx/store';

import { GRNWeightValueConfigState } from './weight-value-config.state';
import {
  GRNWeightValueConfigActions,
  GRNWeightValueConfigActionTypes
} from './weight-value-config.actions';

export const initialState: GRNWeightValueConfigState = {
  weightValueConfigListing: null,
  weightValueConfigDetails: null,
  weightValueConfigDetailsSaved: null,
  weightValueConfigDetailsEdited: null,
  totalWeightValueConfig: 0,
  error: null,
  isLoading: null,
  mappedLocationsCount: -1
};

export const WEIGHT_VALUE_CONFIG_FEATURE_KEY = 'GRNWeightValueConfig';
export const selectWeightValueConfigState = createFeatureSelector<
  GRNWeightValueConfigState
>(WEIGHT_VALUE_CONFIG_FEATURE_KEY);

export function GRNWeightValueConfigReducer(
  state: GRNWeightValueConfigState = initialState,
  action: GRNWeightValueConfigActions
): GRNWeightValueConfigState {
  switch (action.type) {
    case GRNWeightValueConfigActionTypes.LOAD_WEIGHT_VALUE_CONIG_DETAILS:
    case GRNWeightValueConfigActionTypes.LOAD_WEIGHT_VALUE_CONIG_LISTING:
      return {
        ...state,
        weightValueConfigDetailsSaved: null,
        weightValueConfigDetailsEdited: null,
        weightValueConfigDetails: null,
        isLoading: true,
        error: null
      };
    case GRNWeightValueConfigActionTypes.EDIT_WEIGHT_VALUE_CONIG_DETAILS:
      return {
        ...state,
        weightValueConfigDetailsSaved: null,
        weightValueConfigDetailsEdited: null,
        isLoading: true,
        error: null
      };
    case GRNWeightValueConfigActionTypes.SEARCH_WEIGHT_VALUE_CONIG_LISTING_SUCCESS:
    case GRNWeightValueConfigActionTypes.LOAD_WEIGHT_VALUE_CONIG_LISTING_SUCCESS:
      return {
        ...state,
        weightValueConfigListing: action.payload.results,
        totalWeightValueConfig: action.payload.totalElements,
        isLoading: false
      };

    case GRNWeightValueConfigActionTypes.LOAD_MAPPED_LOCATIONS_COUNT:
      return {
        ...state,
        isLoading: true,
        error: null,
        mappedLocationsCount: -1
      };

    case GRNWeightValueConfigActionTypes.EDIT_WEIGHT_VALUE_CONIG_DETAILS_FAILURE:
    case GRNWeightValueConfigActionTypes.SAVE_WEIGHT_VALUE_CONIG_DETAILS_FAILURE:
    case GRNWeightValueConfigActionTypes.LOAD_WEIGHT_VALUE_CONIG_DETAILS_FAILURE:
    case GRNWeightValueConfigActionTypes.SEARCH_WEIGHT_VALUE_CONIG_LISTING_FAILURE:
    case GRNWeightValueConfigActionTypes.LOAD_WEIGHT_VALUE_CONIG_LISTING_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case GRNWeightValueConfigActionTypes.LOAD_MAPPED_LOCATIONS_COUNT_FAILURE:
      return {
        ...state,

        isLoading: false,
        mappedLocationsCount: 0
      };

    case GRNWeightValueConfigActionTypes.SEARCH_WEIGHT_VALUE_CONIG_LISTING:
      return {
        ...state,
        isLoading: true,
        error: null,

        totalWeightValueConfig: 0
      };

    case GRNWeightValueConfigActionTypes.LOAD_WEIGHT_VALUE_CONIG_DETAILS_SUCCESS:
      return {
        ...state,
        weightValueConfigDetails: action.payload,
        isLoading: false
      };

    case GRNWeightValueConfigActionTypes.SAVE_WEIGHT_VALUE_CONIG_DETAILS:
      return {
        ...state,
        isLoading: true,
        weightValueConfigDetailsSaved: null,
        weightValueConfigDetailsEdited: null,
        error: null
      };

    case GRNWeightValueConfigActionTypes.EDIT_WEIGHT_VALUE_CONIG_DETAILS_SUCCESS:
      return {
        ...state,
        weightValueConfigDetails: action.payload,
        weightValueConfigDetailsEdited: action.payload,
        isLoading: false
      };

    case GRNWeightValueConfigActionTypes.SAVE_WEIGHT_VALUE_CONIG_DETAILS_SUCCESS:
      return {
        ...state,
        weightValueConfigDetails: action.payload,
        weightValueConfigDetailsSaved: action.payload,
        weightValueConfigDetailsEdited: action.payload,
        isLoading: false
      };

    case GRNWeightValueConfigActionTypes.LOAD_RESET:
      return {
        ...state,
        error: null
      };

    case GRNWeightValueConfigActionTypes.LOAD_MAPPED_LOCATIONS_COUNT_SUCCESS:
      return {
        ...state,
        mappedLocationsCount: action.payload,
        isLoading: false
      };

    default:
      return state;
  }
}
