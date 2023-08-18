import { createFeatureSelector } from '@ngrx/store';

import { BgrConfigState } from './bgr-config.state';
import { BgrConfigActions, BgrConfigActionTypes } from './bgr-config.actions';

export const initialState: BgrConfigState = {
  bgrConfigListing: null,
  bgrConfigDetails: null,
  bgrConfigDetailsSaved: null,
  bgrConfigDetailsEdited: null,
  bgrTotalConfig: 0,
  error: null,
  isLoading: null
};

export const BGR_CONFIG_FEATURE_KEY = 'BgrConfig';
export const selectBgrConfigState = createFeatureSelector<BgrConfigState>(
  BGR_CONFIG_FEATURE_KEY
);

export function BgrConfigReducer(
  state: BgrConfigState = initialState,
  action: BgrConfigActions
): BgrConfigState {
  switch (action.type) {
    case BgrConfigActionTypes.LOAD_BGR_CONFIG_LISTING:
      return {
        ...state,
        bgrConfigDetails: null,
        bgrConfigDetailsSaved: null,
        bgrConfigDetailsEdited: null,
        isLoading: true,
        error: null
      };

    case BgrConfigActionTypes.LOAD_BGR_CONFIG_LISTING_SUCCESS:
      return {
        ...state,
        bgrConfigListing: action.payload.results,
        bgrTotalConfig: action.payload.totalElements,
        isLoading: false
      };

    case BgrConfigActionTypes.LOAD_BGR_CONFIG_LISTING_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case BgrConfigActionTypes.SEARCH_BGR_CONFIG_LISTING:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case BgrConfigActionTypes.SEARCH_BGR_CONFIG_LISTING_SUCCESS:
      return {
        ...state,
        bgrConfigListing: action.payload.results,
        bgrTotalConfig: action.payload.totalElements,
        isLoading: false
      };

    case BgrConfigActionTypes.SEARCH_BGR_CONFIG_LISTING_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case BgrConfigActionTypes.LOAD_BGR_CONFIG_DETAILS:
      return {
        ...state,
        bgrConfigDetails: null,
        bgrConfigDetailsSaved: null,
        bgrConfigDetailsEdited: null,
        isLoading: true,
        error: null
      };

    case BgrConfigActionTypes.LOAD_BGR_CONFIG_DETAILS_SUCCESS:
      return {
        ...state,
        bgrConfigDetails: action.payload,
        isLoading: false
      };

    case BgrConfigActionTypes.LOAD_BGR_CONFIG_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case BgrConfigActionTypes.SAVE_BGR_CONFIG_DETAILS:
      return {
        ...state,
        isLoading: true,
        bgrConfigDetailsSaved: null,
        bgrConfigDetailsEdited: null,
        error: null
      };

    case BgrConfigActionTypes.SAVE_BGR_CONFIG_DETAILS_SUCCESS:
      return {
        ...state,
        bgrConfigDetails: action.payload,
        bgrConfigDetailsSaved: action.payload,
        isLoading: false
      };

    case BgrConfigActionTypes.SAVE_BGR_CONFIG_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case BgrConfigActionTypes.EDIT_BGR_CONFIG_DETAILS:
      return {
        ...state,
        isLoading: true,
        bgrConfigDetailsSaved: null,
        bgrConfigDetailsEdited: null,
        error: null
      };

    case BgrConfigActionTypes.EDIT_BGR_CONFIG_DETAILS_SUCCESS:
      return {
        ...state,
        bgrConfigDetails: action.payload,
        bgrConfigDetailsEdited: action.payload,
        isLoading: false
      };

    case BgrConfigActionTypes.EDIT_BGR_CONFIG_DETAILS_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    default:
      return state;
  }
}
